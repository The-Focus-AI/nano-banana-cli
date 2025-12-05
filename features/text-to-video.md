---
name: text-to-video
status: completed
completed: 2025-12-05
updated: 2025-12-05
depends: []
---

# Overview

Generate videos from text prompts using Google Veo models via the `nano-banana --video` command.

# Specification

## Command Interface

```
nano-banana --video "<prompt>" [options]
```

## Behavior

1. Parse video configuration from CLI options
2. Show cost estimate (yellow warning)
3. Build video generation request with prompt and config
4. Call `ai.models.generateVideos()` to start generation
5. Poll `ai.operations.getVideosOperation()` every 10 seconds
6. Show progress indicator with elapsed time
7. On completion, download video via `ai.files.download()`
8. Save `.mp4` file and `.uri` file (for scene extension)

## Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `--video` | flag | required | Enable video generation mode |
| `<prompt>` | string | required | Video description |
| `--video-model <name>` | string | `veo-3.1-generate-preview` | Veo model |
| `--video-fast` | flag | false | Use `veo-3.1-fast-generate-preview` |
| `--duration <sec>` | 4\|6\|8 | 8 | Video length in seconds |
| `--aspect <ratio>` | 16:9\|9:16 | 16:9 | Aspect ratio |
| `--resolution <res>` | 720p\|1080p | 1080p | Video quality |
| `--audio` | flag | true | Generate synchronized audio |
| `--no-audio` | flag | false | Disable audio generation |
| `--seed <number>` | integer | random | Reproducibility seed |
| `--reference <image>` | string | - | Reference image (max 3) |
| `--output <path>` | string | `output/video-<timestamp>.mp4` | Output path |

## Output

- Video file: `output/video-<timestamp>.mp4` or `--output` path
- URI file: Same path with `.uri` extension (for scene extension)
- Creates parent directories if needed

## Timing

- Generation takes 2-4 minutes typically
- Maximum wait: 5 minutes (timeout)
- Poll interval: 10 seconds

## Cost Estimation

Displayed before generation starts:

| Model | Per Second | With Audio |
|-------|------------|------------|
| `veo-3.1-generate-preview` | $0.50 | $0.75 |
| `veo-3.1-fast-generate-preview` | $0.10 | $0.15 |
| `veo-2.0-generate-001` | $0.35 | N/A |

## Error Handling

| Condition | Behavior |
|-----------|----------|
| Missing `GEMINI_API_KEY` | Exit 1 with error message |
| Invalid duration value | Exit 1 with "must be 4, 6, or 8" |
| Invalid aspect ratio | Exit 1 with "must be 16:9 or 9:16" |
| Invalid resolution | Exit 1 with "must be 720p or 1080p" |
| More than 3 references | Exit 1 with "Maximum 3 reference images" |
| Timeout after 5 minutes | Exit 1 with timeout error |
| API generation error | Exit 1 with error message |

# Knowledge Required

- [reports/2025-12-02-google-veo-video-generation.md](../reports/2025-12-02-google-veo-video-generation.md) - Veo API details
- [reports/2025-12-02-google-veo-video-prompting-best-practices.md](../reports/2025-12-02-google-veo-video-prompting-best-practices.md) - Prompting patterns

# Context Requirements

- [x] `GEMINI_API_KEY` environment variable set
- [x] Sufficient API credits for video generation
- [x] Network access to Google Veo API

### Success Metrics

- **Functional Correctness**: Video is generated and saved
  - Tests pass: Manual verification of output
  - MP4 file is playable
  - URI file is created alongside
- **Spec Adherence**:
  - Duration matches requested length
  - Aspect ratio matches request
  - Resolution matches request
- **Quality Gates**:
  - Cost warning shown before generation
  - Progress indicator updates during wait
  - Timeout prevents infinite wait

### Validation Commands

```bash
# Cost estimate only (no generation)
nano-banana --video "test scene" --estimate-cost

# Fast/cheap development mode
nano-banana --video "A simple test" --video-fast --no-audio --duration 4 --resolution 720p

# Check output files exist
test -f output/video-*.mp4 && echo "PASS: Video created"
test -f output/video-*.uri && echo "PASS: URI file created"

# Verify duration parameter validation
nano-banana --video "test" --duration 5 2>&1 | grep -q "must be 4, 6, or 8" && echo "PASS: Invalid duration rejected"

# Verify aspect ratio validation
nano-banana --video "test" --aspect 4:3 2>&1 | grep -q "must be 16:9 or 9:16" && echo "PASS: Invalid aspect rejected"
```
