---
name: writing-voice
description: >
  Organizational writing voice, tone, and document generation standards.
  Apply when drafting proposals, SOWs, executive summaries,
  client communications, RFP responses, or any external-facing document.
triggers:
  - "writing voice"
  - "document voice"
  - "tone guide"
  - "writing style"
  - "draft proposal"
  - "draft SOW"
  - "executive summary"
  - "client deliverable"
  - "RFP response"
---

# Writing Voice

This skill loads the organizational voice profile from the `@user/writing-voice`
swamp model and applies it to document generation. The voice data is managed by
swamp (versioned, audited, updatable via Claude Desktop through the MCP bridge).

## How to Use

Before generating any client-facing document, retrieve the voice profile from
the model. Use the method that best matches what you need:

### Full profile

```bash
swamp model method run <instance-name> get --json
```

### Filtered by tier

```bash
swamp model method run <instance-name> get-tier --input '{"tier": "documentation"}' --json
```

### Filtered by document type and audience

```bash
swamp model method run <instance-name> get-document-guide --input '{"documentType": "Proposal", "audience": "Procurement"}' --json
```

## Applying the Profile

The model output contains structured voice data. When generating a document:

1. Run the appropriate method above to get the voice profile
2. Use `voiceIdentity` as the baseline voice for all content
3. Use the matching `tier` to set the register (full/polished/formal)
4. Use `proseRules` to govern paragraph structure, sentence rhythm, and
   constructions to avoid
5. Use `positioningFramework` to guide how the organization talks about itself
6. Use the matching `documentType` for structural conventions
7. Use the matching `audience` for depth and framing adjustments
8. Check generated content against `antiPatterns` (wrong/right pairs) and
   `killList` (phrases to remove on sight)

## Updating the Voice

Voice updates go through Claude Desktop via the MCP bridge. Desktop edits the
model instance definition YAML (the `globalArguments` section), then regenerate
the data output:

```bash
swamp model method run <instance-name> get --json
```

## Validation

To check the voice profile for completeness and consistency:

```bash
swamp model method run <instance-name> validate --json
```

## Reference Documents

Place full-length writing examples in the `references/` subdirectory for
pattern-matching. The provided templates show the expected format:

- `references/example-full-document.md` — Complete document demonstrating voice
- `references/example-annotated-excerpt.md` — Shorter excerpt with annotations
