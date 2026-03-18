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

When this skill triggers, follow the steps below in order before generating
any content. Do not skip any step and do not generate content until you have
loaded the voice profile.

## Step 1: Find the model instance

```bash
swamp model search "voice" --json
```

Look for a model with type `@dougschaefer/writing-voice`. Note the `name`
field. This is the instance name used in all subsequent commands.

## Step 2: Load the voice profile

```bash
swamp data get <instance-name> voice-profile --json
```

If this returns an error or no data, run the `get` method first to generate it:

```bash
swamp model method run <instance-name> get --json
```

Then re-run the `swamp data get` command above.

The output contains the full voice definition in the `content` field. Read and
internalize all of the following before generating any text:

- `voiceIdentity` — who speaks, what the authority level is, what the voice
  sounds like, and what it never sounds like
- `tiers` — three voice registers (communications/full, documentation/polished,
  legal/formal). Select the tier that matches the document type being generated.
- `proseRules` — paragraph structure, sentence rhythm, and constructions to
  avoid. Follow these exactly.
- `positioningFramework` — how the organization talks about itself, its
  customers, and its competitors
- `documentTypes` — structural conventions for SOWs, proposals, executive
  summaries, case studies, and business cases. Match the structure to the
  document being generated.
- `audiences` — depth and framing adjustments per reader type. If the user
  specified an audience, apply that audience's guidance.
- `antiPatterns` — wrong/right pairs. Check all generated content against these.
  If any generated text matches a "wrong" pattern, rewrite it using the
  corresponding "right" pattern as guidance.
- `killList` — phrases to remove on sight. Scan all generated content and
  remove any phrase that appears in this list.

## Step 3: Load reference documents

```bash
swamp data list <instance-name> --json
```

Look for any data artifacts with names starting with `reference-`. For each one:

```bash
swamp data get <instance-name> <reference-name> --json
```

Read the `content` field of each reference document. These are annotated writing
examples that demonstrate what the voice sounds like in practice. Use them for
pattern-matching when generating content.

## Step 4: Generate content

With the voice profile and reference documents loaded, generate the requested
content. Apply all voice rules simultaneously:

1. Match the tier to the document type (or use the tier the user specified)
2. Follow `proseRules` for all mechanical conventions
3. Apply `positioningFramework` for any self-referential or competitive content
4. Match `documentTypes` structure if the document type is defined
5. Adjust depth per `audiences` if the user specified a target audience
6. After generating, scan against `antiPatterns` and `killList` and fix any
   violations before presenting the output

## Updating the Voice

Voice updates go through Claude Desktop via the MCP bridge, or by editing the
model instance YAML directly. After any change to globalArguments, regenerate
the data output:

```bash
swamp model method run <instance-name> get --json
```

## Adding Reference Documents

```bash
swamp model method run <instance-name> add-reference --input-file reference.json --json
```

Where `reference.json` contains:

```json
{"name": "doc-name", "content": "markdown content with annotations..."}
```
