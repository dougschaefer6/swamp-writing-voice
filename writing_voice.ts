import { z } from "npm:zod@4";

/**
 * @user/writing-voice — Organizational writing voice management
 *
 * Stores and retrieves structured voice profiles for AI document generation.
 * Voice definitions include identity, tiers, prose rules, positioning,
 * document type conventions, audience calibration, and anti-patterns.
 *
 * Voice data is stored in globalArguments so methods can access it at runtime.
 * The published extension ships with the schema only; actual voice content
 * lives in the local model instance definition YAML.
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
  organizationName: z.string().describe("Organization name for voice attribution"),
  voiceIdentity: z.string().describe("Core voice identity: who speaks, authority level, what it sounds like, what it never sounds like"),
  tiers: z.array(TierSchema).describe("Voice tiers from most casual to most formal"),
  proseRules: z.string().describe("Mechanical prose conventions: paragraph structure, sentence rhythm, constructions to avoid"),
  positioningFramework: z.string().describe("How the organization positions itself: outcome-first vs capability-first, differentiators, competitive positioning"),
  documentTypes: z.array(DocumentTypeSchema).describe("Structural conventions per document type"),
  audiences: z.array(AudienceSchema).describe("Voice adjustments per audience segment"),
  antiPatterns: z.array(AntiPatternSchema).optional().default([]).describe("Wrong/right pairs organized by failure mode"),
  killList: z.array(z.string()).optional().default([]).describe("Phrases to remove on sight from any generated content"),
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
  version: "2026.03.18.2",
  globalArguments: VoiceGlobalArgsSchema,
  resources: {
    profile: {
      description: "Voice profile with identity, tiers, rules, positioning, and anti-patterns",
      schema: VoiceProfileSchema,
      lifetime: "infinite",
      garbageCollection: 5,
    },
  },
  methods: {
    get: {
      description: "Retrieve the full voice profile",
      arguments: z.object({}),
      execute: async (_args, context) => {
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
    "get-tier": {
      description: "Retrieve voice guidance filtered to a specific tier",
      arguments: z.object({
        tier: z.string().describe("Tier name (e.g., communications, documentation, legal)"),
      }),
      execute: async (args, context) => {
        const g = context.globalArgs;
        const tierName = args.tier.toLowerCase();
        const tier = g.tiers.find((t) => t.name.toLowerCase() === tierName);

        if (!tier) {
          const available = g.tiers.map((t) => t.name).join(", ");
          context.logger.warning("Tier {tier} not found. Available: {available}", {
            tier: tierName,
            available,
          });
          return { dataHandles: [] };
        }

        context.logger.info("Retrieved tier: {tier}", { tier: tier.name });

        const handle = await context.writeResource("profile", `tier-${tierName}`, {
          organizationName: g.organizationName,
          voiceIdentity: g.voiceIdentity,
          tiers: [tier],
          proseRules: g.proseRules,
          positioningFramework: g.positioningFramework,
          documentTypes: g.documentTypes.filter(
            (d) => d.defaultTier.toLowerCase() === tierName
          ),
          audiences: g.audiences,
          antiPatterns: g.antiPatterns || [],
          killList: g.killList || [],
        });
        return { dataHandles: [handle] };
      },
    },
    "get-document-guide": {
      description: "Retrieve voice and structure guidance for a specific document type and audience",
      arguments: z.object({
        documentType: z.string().describe("Document type (e.g., SOW, Proposal, Executive Summary)"),
        audience: z.string().optional().describe("Target audience segment"),
      }),
      execute: async (args, context) => {
        const g = context.globalArgs;
        const docTypeName = args.documentType.toLowerCase();
        const docType = g.documentTypes.find(
          (d) => d.name.toLowerCase() === docTypeName
        );

        const audience = args.audience
          ? g.audiences.find(
              (a) => a.name.toLowerCase() === args.audience.toLowerCase()
            )
          : undefined;

        const tier = docType
          ? g.tiers.find(
              (t) => t.name.toLowerCase() === docType.defaultTier.toLowerCase()
            )
          : undefined;

        context.logger.info("Document guide: type={type} tier={tier} audience={audience}", {
          type: docType?.name || "not found",
          tier: tier?.name || "not found",
          audience: audience?.name || "none specified",
        });

        const handle = await context.writeResource("profile", `guide-${docTypeName}`, {
          organizationName: g.organizationName,
          voiceIdentity: g.voiceIdentity,
          tiers: tier ? [tier] : g.tiers,
          proseRules: g.proseRules,
          positioningFramework: g.positioningFramework,
          documentTypes: docType ? [docType] : [],
          audiences: audience ? [audience] : g.audiences,
          antiPatterns: g.antiPatterns || [],
          killList: g.killList || [],
        });
        return { dataHandles: [handle] };
      },
    },
    validate: {
      description: "Check the voice profile for completeness and consistency",
      arguments: z.object({}),
      execute: async (_args, context) => {
        const g = context.globalArgs;
        const issues = [];

        if (!g.voiceIdentity || g.voiceIdentity.length < 50) {
          issues.push("Voice identity is missing or too brief");
        }
        if (!g.tiers || g.tiers.length === 0) {
          issues.push("No voice tiers defined");
        }
        if (!g.proseRules || g.proseRules.length < 50) {
          issues.push("Prose rules are missing or too brief");
        }
        if (!g.positioningFramework || g.positioningFramework.length < 50) {
          issues.push("Positioning framework is missing or too brief");
        }
        if (!g.documentTypes || g.documentTypes.length === 0) {
          issues.push("No document types defined");
        }
        if (!g.audiences || g.audiences.length === 0) {
          issues.push("No audience segments defined");
        }
        for (const docType of g.documentTypes || []) {
          const tierExists = g.tiers?.some(
            (t) => t.name.toLowerCase() === docType.defaultTier.toLowerCase()
          );
          if (!tierExists) {
            issues.push(
              `Document type "${docType.name}" references tier "${docType.defaultTier}" which doesn't exist`
            );
          }
        }

        context.logger.info("Validation: {count} issues found", { count: issues.length });

        const handle = await context.writeResource("profile", "validation-result", {
          organizationName: g.organizationName,
          voiceIdentity: issues.length === 0 ? "valid" : "",
          tiers: [],
          proseRules: issues.length === 0 ? "valid" : "",
          positioningFramework: issues.length === 0 ? "valid" : "",
          documentTypes: [],
          audiences: [],
          antiPatterns: [],
          killList: issues.map((i) => `ISSUE: ${i}`),
        });
        return { dataHandles: [handle] };
      },
    },
  },
};
