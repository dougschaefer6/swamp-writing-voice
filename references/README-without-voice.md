# swamp-writing-voice

A Swamp skill extension that enables organizations to define and maintain consistent writing voice standards for AI-generated documents.

## Overview

When using AI tools to generate client-facing documents, maintaining a consistent organizational voice can be challenging. Without clear voice guidelines, AI-generated content tends to be generic and lacks the distinctive character that differentiates your organization's communications.

**swamp-writing-voice** provides a structured framework for defining your organization's writing voice, tone, and document generation standards. It integrates seamlessly with Claude Code and can be maintained through the Claude Desktop MCP bridge.

### Key Features

- **Structured voice definition** — A comprehensive SKILL.md template with five key sections for defining your organization's unique voice
- **Three-tier voice framework** — Configurable tiers (Communications, Documentation, Legal) for calibrating formality by document type
- **Reference document templates** — Templates for annotated writing samples, complete document examples, and anti-pattern catalogs
- **Desktop bridge support** — Maintain voice definitions conversationally through Claude Desktop's MCP bridge integration
- **Team distribution** — Voice definitions travel with your repo, ensuring consistency across team members

## Installation

```bash
swamp extension install @dougschaefer6/writing-voice
```

This will install the skill scaffold into your repo's `.claude/skills/writing-voice/` directory.

## Getting Started

After installation, you'll need to populate the skill with your organization's voice definitions.

### Step 1: Define Your Voice Identity

Open `SKILL.md` and fill in the Voice Identity section. This should include:

- Your organization's persona and authority level
- The tone and style of your voice
- What your voice should never sound like
- Your voice tier definitions

### Step 2: Establish Prose Rules

Document your mechanical writing conventions:

- Paragraph vs. bullet point preferences
- Sentence structure guidelines
- Technical depth handling
- Constructions to avoid

### Step 3: Set Your Positioning Framework

Define how your organization positions itself:

- Outcome-first vs. capability-first approach
- Core differentiators
- Competitive positioning strategy
- Claim substantiation requirements

### Step 4: Configure Document Structure

For each document type (SOW, Proposal, Executive Summary, etc.), define:

- Opening conventions
- Body organization
- Mandatory sections
- Length guidelines
- Closing conventions

### Step 5: Calibrate for Audiences

Define voice adjustments for different reader segments:

- Executive leadership
- Technical directors
- Procurement
- Technical staff

### Step 6: Add Reference Documents

Populate the `references/` subdirectory with:

- A full-length document example
- Annotated writing excerpts
- Anti-pattern documentation with wrong/right pairs

## Reference Document Templates

The following templates are provided in the `references/` directory:

| Template | Purpose |
|----------|---------|
| `example-full-document.md` | Complete document demonstrating voice end to end |
| `example-annotated-excerpt.md` | Shorter excerpt with detailed voice annotations |
| `anti-patterns.md` | Wrong/right pairs organized by failure mode |

## Desktop Bridge Workflow

If you're using Claude Desktop with the MCP bridge, you can maintain voice definitions conversationally:

1. Connect Claude Desktop to Claude Code via `claude mcp serve`
2. Discuss writing preferences with Claude Desktop
3. Direct Desktop to update the skill files in your repo
4. Changes are immediately available to all team members

This enables iterative voice refinement without requiring direct file editing.

## Architecture

```
.claude/skills/writing-voice/
├── SKILL.md                              # Voice definition (5 sections)
└── references/
    ├── example-full-document.md          # Complete document example
    ├── example-annotated-excerpt.md      # Annotated excerpt
    └── anti-patterns.md                  # Wrong/right failure modes
```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

MIT
