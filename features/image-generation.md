---
name: image-generation
status: completed
completed: 2025-12-05
updated: 2025-12-05
depends: []
---

# Overview

Generate images from text prompts using Google Gemini image models via the `nano-banana` CLI.

# Specification

## Command Interface

```
nano-banana "<prompt>" [options]
```

## Behavior

1. Accept text prompt via positional argument OR `--prompt-file <path>`
2. Validate that `GEMINI_API_KEY` environment variable is set
3. Send prompt to Gemini API with `responseModalities: ["Text", "Image"]`
4. Extract image data from response
5. Save generated PNG to output location

## Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `<prompt>` | string | required | Text description of desired image |
| `--model <name>` | string | `nano-banana-pro-preview` | Gemini model to use |
| `--flash` | flag | false | Use `gemini-2.0-flash` for faster results |
| `--output <path>` | string | `output/generated-<timestamp>.png` | Output file path |
| `--prompt-file <path>` | string | - | Read prompt from file instead of argument |

## Output

- Default: `output/generated-<timestamp>.png`
- Custom: Path specified by `--output`
- Creates parent directories if needed

## Error Handling

| Condition | Behavior |
|-----------|----------|
| Missing `GEMINI_API_KEY` | Exit 1 with error message |
| No prompt provided | Show help and exit 1 |
| Both `--prompt` and `--prompt-file` | Exit 1 with error message |
| No image in API response | Log warning and show raw response |
| API error | Exit 1 with error details |

# Knowledge Required

- [reports/2025-12-02-google-veo-video-prompting-best-practices.md](../reports/2025-12-02-google-veo-video-prompting-best-practices.md) - Prompting patterns

# Context Requirements

- [x] `GEMINI_API_KEY` environment variable set
- [x] Node.js >= 18.0.0
- [x] Network access to Google Gemini API

### Success Metrics

- **Functional Correctness**: Image is generated and saved as PNG
  - Tests pass: Manual verification
  - Output file exists and is valid PNG
- **Spec Adherence**: All parameters work as documented
  - `--model` changes model used
  - `--flash` uses gemini-2.0-flash
  - `--output` saves to specified path
- **Quality Gates**:
  - No API key leakage in logs
  - Graceful handling of API errors

### Validation Commands

```bash
# Basic generation
nano-banana "a simple test image" --output /tmp/test-image.png
test -f /tmp/test-image.png && echo "PASS: Image created"

# With flash model
nano-banana "quick test" --flash --output /tmp/flash-test.png
test -f /tmp/flash-test.png && echo "PASS: Flash model works"

# Prompt from file
echo "a sunset over mountains" > /tmp/prompt.txt
nano-banana --prompt-file /tmp/prompt.txt --output /tmp/file-prompt.png
test -f /tmp/file-prompt.png && echo "PASS: Prompt file works"

# Error case: no API key
unset GEMINI_API_KEY && nano-banana "test" 2>&1 | grep -q "GEMINI_API_KEY" && echo "PASS: API key error shown"
```
