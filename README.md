# swamp-writing-voice

Every AI tool on the market writes like it was trained on corporate annual reports and has never had an opinion about anything. You ask it to draft a proposal and you get back something that's technically correct, structurally sound, and so aggressively generic that you could swap your company name for any competitor's and nobody would notice. Your clients notice. Your competitors' clients notice. The evaluators reading your RFP response at 10pm on a Thursday notice, because they've been reading the same AI-generated prose from every other vendor all week and yours doesn't stand out.

This extension fixes that.

## What This Actually Does

This is a swamp model that stores your organization's writing voice as structured, versioned, schema-validated data and makes it available to Claude Code at generation time. Not a prompt template you paste at the top of a message and hope sticks. Not a style guide PDF living in a SharePoint folder that nobody has opened since 2024. This is infrastructure, the same way your CI pipeline is infrastructure and your monitoring stack is infrastructure. Except instead of enforcing code quality it enforces the thing that actually wins deals: sounding like a real organization with real opinions run by people who have actually done the work.

The model ships completely empty because the entire point is that your voice is yours. What you get is a structured container with a schema that covers everything an AI needs to stop defaulting to the safest possible version of everything:

- **Voice identity** that defines who speaks in your documents, what the authority level is, what it sounds like when it's working, and what it absolutely never sounds like under any circumstances, plus a three-tier register framework (we use Communications, Documentation, and Legal) so you can dial formality up or down by document type without maintaining three separate voice guides that inevitably drift apart
- **Prose rules** that govern the mechanical stuff a good editor would catch but AI doesn't know unless you tell it, things like paragraph-first structure, sentence rhythm, whether you run long chained sentences or chop everything into short declaratives, and which constructions to avoid because they're either AI tells or just bad writing
- **Positioning framework** for how your organization talks about itself relative to customers and the competition, outcome-first versus capability-first, whether you name competitors or call out industry failure modes, what your one differentiator is that shows up in every important document
- **Document type conventions** that define the structural rules for SOWs, proposals, executive summaries, case studies, and business cases so every document is recognizably yours regardless of who or what drafted it
- **Audience calibration** because your CTO readers need different depth than your procurement evaluators and the AI will absolutely default to one-size-fits-all if you don't tell it otherwise
- **Anti-patterns** with wrong/right pairs that show the specific failure modes you want to avoid. These turn out to be more effective than telling the AI what to do, because it can pattern-match against concrete examples of bad output and steer away from them
- **Kill list** of phrases that get removed on sight because they're either reliable AI writing tells, empty filler words, or constructions your organization would never use

## How It Works

Install the extension, create a model instance, populate the global arguments with your voice definition, and run the `get` method to write the profile as versioned data. The `add-reference` method stores annotated writing examples (real excerpts from your best work with explanations of what makes them work) as data artifacts that persist, version, and distribute through git like everything else in swamp.

```bash
# Install
swamp extension install @dougschaefer6/writing-voice

# Create an instance
swamp model create @dougschaefer/writing-voice my-voice --json

# Edit the global arguments with your voice definition
swamp model edit my-voice

# Write the voice profile to versioned data
swamp model method run my-voice get --json

# Add reference documents
swamp model method run my-voice add-reference \
  --input-file reference.json --json
```

Once populated, the companion Claude Code skill triggers automatically when you're drafting client-facing documents. Claude pulls the voice profile and reference documents from swamp data before generating, so the output reflects your organization's actual voice from the first sentence.

## Reference Documents

This is the part that closes the gap between "pretty good" and "actually sounds like us." The voice identity and prose rules get you most of the way there, but reference documents are what teach the AI what your voice sounds like in practice rather than just what the rules say in theory, and the difference is significant.

Each reference document is a real writing sample followed by annotations explaining what makes it work. The `add-reference` method stores them as versioned data artifacts with infinite lifetime, so they accumulate over time as your voice library grows.

Good reference documents to start with:

- A full-length document that demonstrates the voice end to end (your best recent SOW, your strongest proposal letter, a case study you're actually proud of)
- Shorter annotated excerpts that call out specific voice mechanics (how you handle a deviation from an RFP requirement, how you frame competitive positioning without naming competitors, how you acknowledge complexity before landing the outcome)
- Examples at different tiers showing how the same organization sounds at full personality versus polished professional versus formal contract language

## The Desktop Bridge

If you're running Claude Desktop connected to Claude Code via the MCP bridge, the person who owns the voice can maintain it conversationally. Talk to Desktop about what you like, what you hate, how you'd phrase something differently, tell it to write those preferences into the model definition, and the changes are immediately available to Claude Code and everyone who pulls the repo.

This is not a one-time setup that slowly drifts out of date while your actual voice evolves. This is a living data set maintained by the person closest to it, using a conversational interface, with version control and audit trail built in because it's swamp data in a git repo. Every edit is tracked, every version is recoverable, and the voice definition distributes to the team the same way code does.

## Schema

Two methods, intentionally simple:

| Method | What It Does | Input |
|---|---|---|
| `get` | Writes the full voice profile as a versioned resource | None |
| `add-reference` | Stores an annotated writing example as a versioned data artifact | `name` (string), `content` (string) |

Voice profiles keep 5 versions, references keep 3, both with infinite lifetime. You get a full revision history of how your voice evolved, which turns out to be useful when someone asks "why did we change that" six months from now.

## Why This Exists

Most AI writing tools treat voice as a prompt engineering problem and most organizations treat voice as a marketing problem. Neither approach works when you have a team of people using AI to generate documents that all need to sound like the same organization wrote them. You end up with five different people pasting five different prompt fragments and getting five different voices, none of which sound like yours.

This extension treats voice as what it actually is: an infrastructure problem. The definition lives in swamp as structured data with a schema, methods, and versioning. It loads when relevant, distributes through git, evolves conversationally through the Desktop bridge, and every version is auditable. The AI isn't guessing at your voice from a prompt fragment. It's reading a complete structured definition backed by real examples of your writing at its best.

## License

MIT
