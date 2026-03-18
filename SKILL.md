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
the model:

```bash
swamp model method run <instance-name> get --json
```

## Applying the Profile

The model output contains structured voice data. When generating a document:

1. Run the method above to get the voice profile
2. Use `voiceIdentity` as the baseline voice for all content
3. Use the matching `tier` to set the register (full/polished/formal)
4. Use `proseRules` to govern paragraph structure, sentence rhythm, and
   constructions to avoid
5. Use `positioningFramework` to guide how the organization talks about itself
6. Use the matching `documentType` for structural conventions
7. Use the matching `audience` for depth and framing adjustments
8. Check generated content against `antiPatterns` (wrong/right pairs) and
   `killList` (phrases to remove on sight)

## Reference Documents

All writing examples are stored as versioned model data in `.swamp/data/`.
To access the voice profile and reference documents:

```bash
# Full voice profile
swamp data get <instance-name> voice-profile --json

# Reference documents (annotated writing examples for pattern-matching)
swamp data list <instance-name> --json

# Add or update a reference document
swamp model method run <instance-name> add-reference --input-file reference.json --json
# where reference.json contains: {"name": "doc-name", "content": "markdown content..."}
```

## Updating the Voice

Voice updates go through Claude Desktop via the MCP bridge. Desktop edits the
model instance definition YAML (the `globalArguments` section), then regenerate
the data output:

```bash
swamp model method run <instance-name> get --json
```
