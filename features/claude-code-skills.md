---
name: claude-code-skills
status: completed
completed: 2025-12-05
updated: 2025-12-05
depends:
  - image-generation
  - image-editing
  - text-to-video
  - image-to-video
---

# Overview

Expose nano-banana image and video generation as Claude Code skills, distributed through the Focus marketplace.

# Specification

## Plugin Structure

The project must have a Claude Code plugin structure at the root:

```
nano-banana-cli/
├── .claude-plugin/
│   └── plugin.json              # Plugin manifest
└── skills/
    ├── nano-banana-imagegen/
    │   ├── SKILL.md             # Skill definition with triggers
    │   ├── prompting-guide.md   # Detailed prompt crafting
    │   └── examples/            # Use-case examples
    └── nano-banana-videogen/
        ├── SKILL.md             # Skill definition with triggers
        ├── prompting-guide.md   # Video prompt crafting
        └── examples/            # Use-case examples
```

## plugin.json Requirements

| Field | Value |
|-------|-------|
| `name` | `nano-banana` |
| `version` | `1.0.0` |
| `description` | Covers both image AND video generation |
| `author` | Focus.AI |
| `repository` | GitHub repo URL |
| `keywords` | gemini, image-generation, video-generation, veo, ai-media |

## SKILL.md Format

Each skill has YAML frontmatter:

```yaml
---
name: Human Readable Name
description: What it does. Trigger phrases for automatic activation.
---
```

### Image Skill Triggers
- "create an image", "generate a picture", "make a logo"
- "edit this photo", "add X to this image"
- "generate artwork", "create a header"

### Video Skill Triggers
- "create a video", "generate footage", "make a clip"
- "animate this image", "add motion"
- "produce a short film"

## Marketplace Integration

The plugin is listed in `focus-marketplace` at `/Users/wschenk/The-Focus-AI/claude-marketplace/.claude-plugin/marketplace.json`:

```json
{
  "name": "nano-banana",
  "source": {
    "source": "github",
    "repo": "The-Focus-AI/nano-banana-cli"
  },
  "version": "1.0.0",
  "description": "Generate images and videos using Google Gemini and Veo models"
}
```

## Installation

Users install via:
```bash
/plugin marketplace add The-Focus-AI/claude-marketplace
/plugin install nano-banana
```

Or if they've already added the marketplace:
```bash
/plugin install nano-banana@focus-marketplace
```

## Local Development Testing

### Install from Local Path

To test the plugin before publishing:

```bash
# From any directory, install the local plugin
claude /plugin install /Users/wschenk/The-Focus-AI/nano-banana-cli

# Or from within the nano-banana-cli directory
claude /plugin install .
```

### Verify Plugin Loaded

```bash
# Run claude with debug flag to see plugin loading
claude --debug

# Check installed plugins
claude /plugin list
```

### Test Skill Activation

Start a Claude Code session and test trigger phrases:

```bash
claude
```

Then try:
- "Create an image of a sunset over mountains" → should trigger imagegen skill
- "Generate a video of waves on a beach" → should trigger videogen skill
- "Edit this photo and add a rainbow" → should trigger imagegen skill
- "Animate this image with subtle motion" → should trigger videogen skill

### Verify Skill Content Loaded

In a Claude Code session, you can check if skills are available:

```bash
# List available skills
claude /skill list
```

### Debug Skill Issues

If skills aren't activating:

```bash
# Check for loading errors
claude --debug 2>&1 | grep -i skill

# Verify SKILL.md is valid YAML frontmatter
head -10 skills/nano-banana-imagegen/SKILL.md
head -10 skills/nano-banana-videogen/SKILL.md
```

### Uninstall for Clean Testing

```bash
claude /plugin uninstall nano-banana
```

# Knowledge Required

- [Claude Code Skills Guide](https://code.claude.com/docs/en/skills.md)
- [Claude Code Plugins Guide](https://code.claude.com/docs/en/plugins.md)
- [Plugin Marketplaces Guide](https://code.claude.com/docs/en/plugin-marketplaces.md)
- [reports/2025-12-02-google-veo-video-prompting-best-practices.md](../reports/2025-12-02-google-veo-video-prompting-best-practices.md)

# Context Requirements

- [x] nano-banana CLI published to npm as `@the-focus-ai/nano-banana`
- [x] Image generation feature completed
- [x] Video generation feature completed
- [x] Plugin listed in focus-marketplace
- [x] plugin.json updated to cover both skills
- [x] Marketplace entry description updated

### Success Metrics

- **Functional Correctness**: Skills activate on trigger phrases
  - Claude Code recognizes "create an image" and invokes imagegen skill
  - Claude Code recognizes "create a video" and invokes videogen skill
- **Spec Adherence**: Plugin structure follows Claude Code conventions
  - SKILL.md has required frontmatter
  - Description includes trigger phrases
- **Quality Gates**:
  - Skills load without errors (`claude --debug`)
  - Generated commands execute successfully

### Validation Commands

```bash
# Verify plugin structure
test -f .claude-plugin/plugin.json && echo "PASS: plugin.json exists"

# Verify skills exist
test -f skills/nano-banana-imagegen/SKILL.md && echo "PASS: Image skill exists"
test -f skills/nano-banana-videogen/SKILL.md && echo "PASS: Video skill exists"

# Verify SKILL.md frontmatter
grep -q "^name:" skills/nano-banana-imagegen/SKILL.md && echo "PASS: Image skill has name"
grep -q "^description:" skills/nano-banana-imagegen/SKILL.md && echo "PASS: Image skill has description"
grep -q "^name:" skills/nano-banana-videogen/SKILL.md && echo "PASS: Video skill has name"
grep -q "^description:" skills/nano-banana-videogen/SKILL.md && echo "PASS: Video skill has description"

# Verify supporting files
test -f skills/nano-banana-imagegen/prompting-guide.md && echo "PASS: Image prompting guide exists"
test -f skills/nano-banana-videogen/prompting-guide.md && echo "PASS: Video prompting guide exists"
test -d skills/nano-banana-imagegen/examples && echo "PASS: Image examples exist"
test -d skills/nano-banana-videogen/examples && echo "PASS: Video examples exist"

# Verify plugin.json covers both skills
grep -q "video" .claude-plugin/plugin.json && echo "PASS: plugin.json mentions video" || echo "FAIL: plugin.json missing video"
```
