# swamp-writing-voice

A swamp skill that gives your AI-generated documents an actual voice instead of the default "committee-approved, personality-free, could-have-been-written-by-literally-anyone" output that every LLM produces out of the box.

## The Problem

If you're using Claude Code (or any AI tooling) to draft client-facing documents, proposals, SOWs, case studies, or RFP responses, you've probably noticed that the output reads like it was written by a very competent intern who has never met a customer and has no opinions about anything. It's technically correct and completely forgettable. Every sentence could be swapped for a synonym and mean the same nothing, and your clients can tell, because they're getting the same AI-generated prose from every other vendor responding to the same RFP.

The issue isn't that the AI can't write well. It's that it doesn't know what your organization sounds like, what your positioning is, what your strong opinions are, or what your readers expect from you specifically. Without that context, it defaults to the safest possible version of everything, which is the version that sounds like everyone else.

## What This Is

This is a swamp skill that provides the scaffolding for defining your organization's writing voice in a way that Claude Code can actually use at generation time. It's not a prompt template and it's not a style guide PDF that sits in a SharePoint folder and gets ignored. It's a structured skill file that lives in your swamp repo, loads automatically when you're drafting documents, and shapes the output from the first sentence.

The skill ships empty. There is no default voice in here, because the entire point is that your voice is yours and nobody else's. What you get is:

- A SKILL.md with five sections (Voice Identity, Prose Rules, Positioning Framework, Document Structure, Audience Calibration) and instructional comments explaining what goes in each one and why it matters
- A three-tier voice framework (Communications, Documentation, Legal) that lets you calibrate formality by document type without maintaining three separate voice guides
- Reference document templates for annotated writing samples, complete document examples, and anti-pattern catalogs with wrong/right pairs
- A setup guide for using Claude Desktop's MCP bridge to push voice content directly into the skill files, so the person who owns the voice (usually a founder, CTO, or head of marketing) can maintain it without touching the repo directly

## How It Works

Install the skill into your swamp repo. Fill in the SKILL.md sections with your organization's actual voice, positioning, and document conventions. Add reference documents with real examples of your writing at its best, annotated with explanations of what makes each example work. Add anti-patterns with wrong/right pairs showing the specific failure modes you want to avoid.

Once populated, the skill triggers automatically when you ask Claude Code to draft proposals, SOWs, executive summaries, RFP responses, case studies, or any other client-facing document. Claude reads the voice definition and reference examples before generating, so the output reflects your organization's actual voice rather than generic AI prose.

The skill also supports a workflow where Claude Desktop maintains the voice content through the MCP bridge to Claude Code. This means the person who defines the voice can refine it conversationally ("that's too formal," "we'd never say it that way," "add this to the anti-patterns list") and have those changes written directly into the skill files in the repo. The repo remains the single source of truth, Desktop is just the editing interface, and every team member who pulls the repo gets the updated voice immediately.

## Installation

```bash
swamp extension install @dougschaefer6/writing-voice
```

This drops the skill scaffold into your repo's `.claude/skills/writing-voice/` directory. Everything is placeholder content until you fill it in.

## Filling It In

The SKILL.md has five sections, each with instructional comments. Here's what goes where:

**Voice Identity** is the foundation. Write down who speaks in your documents (your organization as a technical partner? a product company? a consultancy?), what authority level the voice carries, what it sounds like when it's working, and what it never sounds like under any circumstances. Define your tiers here too, the skill ships with three (Communications, Documentation, Legal) but you can adjust those to match how your organization actually segments its writing.

**Prose Rules** are the mechanical conventions. Paragraph-first or bullet-first? Long chained sentences or short declaratives? How do you handle technical depth for mixed audiences? Are there specific constructions you want to avoid (em dashes, passive voice, certain phrases)? This section is where you codify the stuff that a good editor would enforce but that AI doesn't know unless you tell it.

**Positioning Framework** is how your organization talks about itself relative to customers and competitors. Outcome-first or capability-first? Do you name competitors or call out industry failure modes? What's the one differentiator that shows up in every important document? Write it here so it shows up consistently.

**Document Structure** defines the conventions for each document type you produce. Not full templates, just the structural rules: what a SOW opens with, how an RFP response is organized, what an executive summary includes, how long a case study should be. These are the guardrails that keep every document recognizable as yours regardless of who (or what) drafted it.

**Audience Calibration** is how the voice adjusts by reader. Your CTO audience gets different depth than your procurement audience. Write down the specific adjustments for each audience segment your organization serves, so the AI doesn't default to one-size-fits-all.

## Reference Documents

The `references/` subdirectory ships with three templates:

- **example-full-document.md** — Template for a complete document that demonstrates your voice end to end. Pick your best recent deliverable, paste it in, and annotate what makes it work.
- **example-annotated-excerpt.md** — Template for a shorter excerpt with detailed annotations. Good for showing specific voice mechanics (sentence rhythm, positioning language, how you handle complexity).
- **anti-patterns.md** — Template for wrong/right pairs organized by failure mode. This is honestly the most useful reference file because it tells the AI what not to do, which turns out to be more effective than telling it what to do.

## The Desktop Bridge Workflow

If you're running Claude Desktop connected to Claude Code via the MCP bridge (`claude mcp serve`), the person who owns your organization's voice can maintain the skill files conversationally. The workflow looks like this:

1. Have a conversation with Claude Desktop about your writing voice, what you like, what you hate, what your strong opinions are, how you'd phrase something differently than the AI's default
2. Tell Desktop to write those preferences into the skill files in your repo (it can Edit files directly through the MCP bridge)
3. The changes are immediately available to Claude Code and to anyone who pulls the repo
4. When the voice evolves (and it will), repeat the process. The repo always has the current version.

This means the voice definition isn't a one-time setup that slowly drifts out of date. It's a living document maintained by the person closest to it, using a conversational interface, with version control built in because it's just files in a git repo.

## Why This Exists

Most AI writing tools treat voice as a prompt engineering problem. You paste a paragraph of instructions at the top of your prompt, hope the model follows them, and fix the output by hand when it doesn't. That works for one-off tasks but it falls apart completely when you have a team of people using AI to generate documents that all need to sound like the same organization wrote them.

This skill treats voice as an infrastructure problem. The voice definition lives in the repo alongside your other operational definitions, it loads automatically when relevant, it's version-controlled, it distributes to the team through git, and it can be maintained conversationally by the person who actually owns the voice. That's a fundamentally different approach and in our experience it produces fundamentally better output.

## License

MIT
