import { z } from "npm:zod@4";

/**
 * @user/writing-voice — Organizational writing voice management
 */

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
  type: "@user/writing-voice",
  version: "2026.03.18.3",
  globalArguments: VoiceGlobalArgsSchema,
  resources: {
    profile: {
      description: "Voice profile",
      schema: VoiceProfileSchema,
      lifetime: "infinite",
      garbageCollection: 5,
    },
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
