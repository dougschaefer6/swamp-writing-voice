# @dougschaefer/writing-voice

A [Swamp](https://swamp.club) extension that stores an organization's writing voice as structured, versioned, schema-validated data. The model holds voice identity, tier definitions (communications, documentation, legal), prose rules, positioning framework, document type conventions, audience calibrations, anti-patterns with wrong/right examples, and a kill list of phrases to remove on sight. The companion Claude Code skill loads this data via `swamp data get` before generating content, so the AI writes with your voice applied rather than defaulting to the safest possible version of everything.

## Methods

| Method | Description | Arguments |
|--------|-------------|-----------|
| `get` | Write the full voice profile to versioned data | None |
| `add-reference` | Store an annotated writing example for pattern-matching | `name` (string), `content` (markdown) |

Voice profiles keep 5 versions and reference documents keep 3, both with infinite lifetime.

## Installation

```bash
swamp extension pull @dougschaefer/writing-voice
```

## Setup

No external credentials are needed. Create an instance with global arguments that define your organization's voice parameters (voice identity, tiers, prose rules, positioning framework, document types, audiences, anti-patterns, and kill list), then run `get` to generate the voice profile data artifact.

```bash
swamp model create @dougschaefer/writing-voice my-voice
swamp model edit my-voice   # populate globalArguments with your voice definition
swamp model method run my-voice get --json
```

Reference documents are added separately. Each one is a real writing excerpt with annotations explaining what makes it effective, and they accumulate over time as versioned data artifacts.

```bash
swamp model method run my-voice add-reference \
  --input-file reference.json --json
```

## License

MIT — see [LICENSE](LICENSE)
