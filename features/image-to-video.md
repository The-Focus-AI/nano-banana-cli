---
name: image-to-video
status: completed
completed: 2025-12-05
updated: 2025-12-05
depends:
  - text-to-video
---

# Overview

Animate static images into video using Google Veo by combining `--video` with `--file` parameters.

# Specification

## Command Interface

```
nano-banana --video "<motion description>" --file <input-image> [options]
```

## Behavior

1. Load input image from `--file` path
2. Determine MIME type using `file --mime-type` command
3. Encode image as base64
4. Build video request with image in `image` field:
   ```json
   {
     "image": {
       "bytesBase64Encoded": "<base64>",
       "mimeType": "<detected-type>"
     }
   }
   ```
5. Generate video that animates the static image
6. Save output with suffix `-animated.mp4`

## Parameters

All parameters from text-to-video apply, plus:

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `--file <path>` | string | required | Input image to animate |

## Output

- Default: `output/<original-filename>-animated.mp4`
- Custom: Path specified by `--output`
- URI file created alongside for potential extension

## Motion Description Best Practices

The prompt should describe how the image should move:
- "The character slowly turns their head and smiles"
- "The scene comes alive with subtle wind movement"
- "Zoom out to reveal the full landscape"
- "Gentle parallax motion, foreground moves faster"

## Constraints

- Input must be a valid image file
- Cannot be combined with `--extend` (mutually exclusive)
- Reference images can still be used for character consistency

## Error Handling

| Condition | Behavior |
|-----------|----------|
| File not found | Exit 1 with "File not found at <path>" |
| Combined with `--extend` | Exit 1 with "Cannot use --file with --extend" |
| API error | Exit 1 with error details |

# Knowledge Required

- [skills/nano-banana-videogen/examples/image-to-video.md](../skills/nano-banana-videogen/examples/image-to-video.md) - Animation patterns

# Context Requirements

- [x] `GEMINI_API_KEY` environment variable set
- [x] Input image file exists and is valid
- [x] Sufficient API credits for video generation

### Success Metrics

- **Functional Correctness**: Static image is animated
  - Input image appears in video
  - Motion matches prompt description
  - Output is valid MP4
- **Spec Adherence**:
  - Output filename includes `-animated` suffix
  - All video options work with image input
- **Quality Gates**:
  - Input image preserved (not modified)
  - Smooth animation without artifacts

### Validation Commands

```bash
# Create source image
nano-banana "a portrait of a person looking forward" --output /tmp/portrait.png

# Animate the image
nano-banana --video "The person slowly smiles" --file /tmp/portrait.png --video-fast --no-audio

# Check output naming
test -f output/portrait-animated.mp4 && echo "PASS: Animated video created"

# Verify cannot combine with --extend
nano-banana --video "test" --file /tmp/portrait.png --extend /tmp/other.mp4 2>&1 | grep -q "Cannot use" && echo "PASS: Mutual exclusion enforced"
```
