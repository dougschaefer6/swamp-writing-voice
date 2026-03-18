import { z } from "npm:zod@4";

// @dougschaefer/writing-voice
//
// This model exists because every AI on the planet writes like it was trained
// exclusively on corporate annual reports and has never had an opinion about
// anything. The voice profile stored here is what makes the difference between
// "technically correct and completely forgettable" and "sounds like an actual
// organization with actual people who have actually done the work."
//
// Two methods: `get` writes the full voice profile to versioned data, and
// `add-reference` stores annotated writing examples that the AI can
// pattern-match against. The reference docs are what close the gap between
// "follows the rules" and "actually sounds like us," because rules tell you
// what to do and examples show you what it looks like when you do it well.
//
// The schema below is intentionally flat and string-heavy for the big fields
// (voiceIdentity, proseRules, positioningFramework) because voice definitions
// are prose, not structured data, and forcing them into nested objects would
// just make them harder to write and harder to read without adding any
// validation value. The structured fields (tiers, audiences, documentTypes,
// antiPatterns) earn their schemas because they're enumerable and the AI
// needs to be able to index into them by name.

const TierSchema = z.object({
  name: z.string(),
  description: z.string(),
  register: z.enum(["full", "polished", "formal"]),
}).passthrough();

const AudienceSchema = z.object({
  name: z.string(),
  readingFor: z.string(),
  depthLevel: z.enum(["strategic", "operational", "technical", "compliance"]),
  guidance: z.string(),
}).passthrough();

const DocumentTypeSchema = z.object({
  name: z.string(),
  defaultTier: z.string(),
  structure: z.string(),
}).passthrough();

// Anti-patterns are wrong/right pairs. These are honestly the most useful part
// of the entire voice definition because telling the AI "don't write like this,
// write like this instead" with concrete examples turns out to be dramatically
// more effective than abstract rules about tone and style. If you only populate
// one section of the voice profile, make it this one.
const AntiPatternSchema = z.object({
  name: z.string(),
  description: z.string(),
  wrong: z.string(),
  right: z.string(),
  explanation: z.string(),
}).passthrough();

const VoiceGlobalArgsSchema = z.object({
  organizationName: z.string(),
  voiceIdentity: z.string(),
  tiers: z.array(TierSchema),
  proseRules: z.string(),
  positioningFramework: z.string(),
  documentTypes: z.array(DocumentTypeSchema),
  audiences: z.array(AudienceSchema),
  antiPatterns: z.array(AntiPatternSchema).optional().default([]),
  killList: z.array(z.string()).optional().default([]),
});

const VoiceProfileSchema = z.object({
  organizationName: z.string(),
  voiceIdentity: z.string(),
  tiers: z.array(TierSchema),
  proseRules: z.string(),
  positioningFramework: z.string(),
  documentTypes: z.array(DocumentTypeSchema),
  audiences: z.array(AudienceSchema),
  antiPatterns: z.array(AntiPatternSchema),
  killList: z.array(z.string()),
}).passthrough();

export const model = {
  type: "@dougschaefer/writing-voice",
  version: "2026.03.18.3",
  globalArguments: VoiceGlobalArgsSchema,
  resources: {
    profile: {
      description: "Voice profile",
      schema: VoiceProfileSchema,
      lifetime: "infinite",
      garbageCollection: 5,
    },
    // Reference docs get their own resource spec because they version
    // independently from the profile. You might update the voice identity
    // weekly but your reference examples are stable for months, and you don't
    // want a profile update to cycle out a perfectly good writing sample.
    reference: {
      description: "Reference document for voice pattern-matching",
      schema: z.object({
        name: z.string(),
        content: z.string(),
      }).passthrough(),
      lifetime: "infinite",
      garbageCollection: 3,
    },
  },
  methods: {
    // Writes the entire voice profile to a versioned resource. Run this after
    // editing globalArguments so the companion skill can pull structured data
    // instead of parsing YAML at runtime.
    get: {
      description: "Retrieve the full voice profile",
      arguments: z.object({}),
      execute: async (
        _args: Record<string, never>,
        context: {
          globalArgs: z.infer<typeof VoiceGlobalArgsSchema>;
          logger: { info: (m: string, v?: Record<string, unknown>) => void };
          writeResource: (
            s: string,
            n: string,
            d: Record<string, unknown>,
          ) => Promise<unknown>;
        },
      ) => {
        const g = context.globalArgs;
        context.logger.info("Retrieving voice profile for {org}", {
          org: g.organizationName,
        });
        const handle = await context.writeResource("profile", "voice-profile", {
          organizationName: g.organizationName,
          voiceIdentity: g.voiceIdentity,
          tiers: g.tiers,
          proseRules: g.proseRules,
          positioningFramework: g.positioningFramework,
          documentTypes: g.documentTypes,
          audiences: g.audiences,
          antiPatterns: g.antiPatterns || [],
          killList: g.killList || [],
        });
        return { dataHandles: [handle] };
      },
    },
    // Stores a writing example as a versioned data artifact. The content field
    // is markdown: paste in a real excerpt from your best work, then add
    // annotations explaining what makes it work and why the AI should
    // pattern-match against it. The more specific the annotations, the better
    // the output. "This sentence is good" is useless. "This sentence works
    // because it names the actual technical work rather than just claiming the
    // integration exists, so a technical reader can evaluate the claim" is
    // what actually moves the needle.
    "add-reference": {
      description:
        "Add or update a reference document for voice pattern-matching",
      arguments: z.object({
        name: z.string().describe(
          "Reference document name (e.g., example-proposal-excerpt)",
        ),
        content: z.string().describe(
          "Markdown content of the reference document",
        ),
      }),
      execute: async (
        args: { name: string; content: string },
        context: {
          logger: {
            info: (m: string, v?: Record<string, unknown>) => void;
          };
          writeResource: (
            s: string,
            n: string,
            d: Record<string, unknown>,
          ) => Promise<unknown>;
        },
      ) => {
        context.logger.info("Adding reference document: {name}", {
          name: args.name,
        });
        const handle = await context.writeResource(
          "reference",
          `reference-${args.name}`,
          {
            name: args.name,
            content: args.content,
          },
        );
        return { dataHandles: [handle] };
      },
    },
  },
};
