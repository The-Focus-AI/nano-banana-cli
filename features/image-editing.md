---
name: image-editing
status: completed
completed: 2025-12-05
updated: 2025-12-05
depends:
  - image-generation
---

# Overview

Edit existing images using natural language instructions via the `nano-banana` CLI with the `--file` parameter.

# Specification

## Command Interface

```
nano-banana "<edit instruction>" --file <input-image> [options]
```

## Behavior

1. Load input image from `--file` path
2. Determine MIME type using `file --mime-type` command
3. Validate input is an image (MIME type starts with `image/`)
4. Encode image as base64
5. Send prompt + image to Gemini API
6. Save edited PNG to output location

## Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `<edit instruction>` | string | required | Natural language edit command |
| `--file <path>` | string | required | Input image to edit |
| `--model <name>` | string | `nano-banana-pro-preview` | Gemini model to use |
| `--flash` | flag | false | Use `gemini-2.0-flash` |
| `--output <path>` | string | `output/<original>-edited.png` | Output file path |

## Output

- Default: `output/<original-filename>-edited.png`
- Custom: Path specified by `--output`
- Creates parent directories if needed

## Supported Edit Operations

- **Add elements**: "add a hot air balloon in the sky"
- **Remove elements**: "remove the background"
- **Style transfer**: "transform into a watercolor painting"
- **Color changes**: "change the sky to sunset colors"
- **Object modification**: "add sunglasses to the person"

## Error Handling

| Condition | Behavior |
|-----------|----------|
| File not found | Exit 1 with "File not found at <path>" |
| Not an image | Exit 1 with MIME type error |
| Missing `GEMINI_API_KEY` | Exit 1 with error message |
| API error | Exit 1 with error details |

# Knowledge Required

- [skills/nano-banana-imagegen/prompting-guide.md](../skills/nano-banana-imagegen/prompting-guide.md) - Editing prompt patterns

# Context Requirements

- [x] `GEMINI_API_KEY` environment variable set
- [x] Input file exists and is a valid image
- [x] `file` command available for MIME detection

### Success Metrics

- **Functional Correctness**: Image is edited and saved
  - Input image is read correctly
  - Edit instruction is applied
  - Output is valid PNG
- **Spec Adherence**:
  - Original filename preserved in output name
  - MIME validation catches non-images
- **Quality Gates**:
  - No corruption of input file
  - Graceful handling of unsupported formats

### Validation Commands

```bash
# Create test image first
nano-banana "a simple red circle on white background" --output /tmp/original.png

# Basic edit
nano-banana "add a blue border" --file /tmp/original.png --output /tmp/edited.png
test -f /tmp/edited.png && echo "PASS: Edited image created"

# Default output naming
nano-banana "make it grayscale" --file /tmp/original.png
test -f output/original-edited.png && echo "PASS: Default naming works"

# Error case: non-image file
echo "not an image" > /tmp/fake.txt
nano-banana "edit this" --file /tmp/fake.txt 2>&1 | grep -q "not an image" && echo "PASS: Non-image rejected"

# Error case: missing file
nano-banana "edit" --file /tmp/nonexistent.jpg 2>&1 | grep -q "not found" && echo "PASS: Missing file error"
```
