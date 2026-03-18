# swamp-writing-voice

A swamp extension that gives your AI-generated documents an actual voice instead of the default "committee-approved, personality-free, could-have-been-written-by-literally-anyone" output that every LLM produces out of the box.

## The Problem

If you're using Claude Code or any AI tooling to draft client-facing documents, you've probably noticed that the output reads like it was written by a very competent intern who has never met a customer and has no opinions about anything. It's technically correct and completely forgettable. Every sentence could be swapped for a synonym and mean the same nothing, and your clients can tell, because they're getting the same AI-generated prose from every other vendor responding to the same RFP.

The issue isn't that the AI can't write well. It's that it doesn't know what your organization sounds like, what your positioning is, what your strong opinions are, or what your readers expect from you specifically. Without that context, it defaults to the safest possible version of everything, which is the version that sounds like everyone else.

## What This Is

This is a swamp extension model that stores your organization's writing voice as structured, versioned data that Claude Code can pull at generation time. It's not a prompt template and it's not a style guide PDF that sits in a SharePoint folder and gets ignored. It's a model with a schema, methods, and data outputs that lives in your swamp repo, loads automatically when the companion skill triggers, and shapes the output from the first sentence.

The model ships empty. There is no default voice in here, because the entire point is that your voice is yours and nobody else's. What you get is a structured container for:

- **Voice identity** and a three-tier register framework (Communications, Documentation, Legal) so you can calibrate formality by document type without maintaining three separate voice guides
- **Prose rules** that govern sentence rhythm, paragraph structure, and the mechanical conventions that separate your writing from the AI default
- **Positioning framework** that defines how your organization talks about itself, its customers, and its competitors
- **Document type conventions** for SOWs, proposals, executive summaries, case studies, and business cases
- **Audience calibration** so the voice adjusts appropriately when writing for a CTO versus a procurement evaluator
- **Anti-patterns** with wrong/right pairs that show the specific failure modes you want to avoid, which turns out to be more effective than telling the AI what to do
- **Kill list** of phrases that get removed on sight because they're either AI writing tells, empty filler, or words your organization would never use

## How It Works

Install the extension into your swamp repo, create a model instance, and populate the global arguments with your voice definition. The `get` method writes the full voice profile as a versioned resource. The `add-reference` method stores annotated writing examples as data artifacts that the companion skill can retrieve for pattern-matching.

```bash
# Install the extension
swamp extension install @dougschaefer6/writing-voice

# Create an instance
swamp model create @user/writing-voice my-voice --json

# Edit the global arguments with your voice definition
swamp model edit my-voice

# Write the voice profile to data
swamp model method run my-voice get --json

# Add reference documents (annotated examples of your best writing)
swamp model method run my-voice add-reference \
  --input-file reference.json --json
```

Once populated, the companion Claude Code skill (`SKILL.md`) triggers automatically when you ask Claude Code to draft proposals, SOWs, executive summaries, RFP responses, case studies, or any other client-facing document. Claude pulls the voice profile and reference documents from swamp data before generating, so the output reflects your organization's actual voice rather than generic AI prose.

## The Reference Document Workflow

This is honestly the part that makes the biggest difference in output quality. The voice identity and prose rules get you maybe 70% of the way there, but the reference documents are what close the gap, because the AI can pattern-match against real examples of your writing and understand what the voice sounds like in practice, not just what the rules say in theory.

Reference documents are stored as versioned data artifacts in swamp. Each one is a markdown file with the actual writing sample followed by annotations explaining what makes it work. The `add-reference` method accepts a name and content, and stores it as a resource that persists across sessions and distributes to anyone who pulls the repo.

Good reference documents include:

- A full-length document that demonstrates the voice end to end (a real SOW, a real proposal letter, a real case study)
- Shorter annotated excerpts that call out specific voice mechanics (how you handle a deviation from an RFP requirement, how you frame competitive positioning without naming competitors, how you acknowledge complexity before landing the outcome)
- Examples that show the voice working at different tiers (a casual Slack message versus a polished proposal versus formal contract language)

## The Desktop Bridge Workflow

If you're running Claude Desktop connected to Claude Code via the MCP bridge (`claude mcp serve`), the person who owns your organization's voice can maintain the definition conversationally. Have a conversation with Desktop about what you like, what you hate, what your strong opinions are, how you'd phrase something differently than the AI's default, and tell Desktop to write those preferences into the model definition. The changes are immediately available to Claude Code and to anyone who pulls the repo.

This means the voice definition isn't a one-time setup that slowly drifts out of date. It's a living data set maintained by the person closest to it, with version control and audit trail built in because it's swamp data in a git repo.

## Schema

The model uses `globalArguments` for the voice definition and exposes two methods:

| Method | Description | Input |
|---|---|---|
| `get` | Write the full voice profile to a versioned resource | None |
| `add-reference` | Store an annotated writing example as a data artifact | `name` (string), `content` (string) |

The voice profile resource and reference documents are both stored with `infinite` lifetime and garbage collection (5 versions for profiles, 3 for references), so you get a full revision history of how your voice evolved over time.

## Why This Exists

Most AI writing tools treat voice as a prompt engineering problem. You paste a paragraph of instructions at the top of your prompt, hope the model follows them, and fix the output by hand when it doesn't. That works for one-off tasks but it falls apart completely when you have a team of people using AI to generate documents that all need to sound like the same organization wrote them.

This extension treats voice as an infrastructure problem. The voice definition lives in swamp as structured, versioned, schema-validated data. It loads automatically when relevant, it distributes to the team through git, it can be maintained conversationally through the Desktop bridge, and every version is auditable. That's a fundamentally different approach, and in our experience it produces fundamentally better output, because the AI isn't guessing at your voice from a prompt fragment, it's reading a complete, structured definition backed by real examples of your writing at its best.

## License

MIT
