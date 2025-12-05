---
name: cost-estimation
status: completed
completed: 2025-12-05
updated: 2025-12-05
depends:
  - text-to-video
---

# Overview

Estimate video generation costs without actually generating, using the `--estimate-cost` flag.

# Specification

## Command Interface

```
nano-banana --video "<prompt>" --estimate-cost [options]
```

## Behavior

1. Parse video configuration from CLI options
2. Calculate cost based on model, duration, and audio settings
3. Display detailed cost breakdown
4. Exit without generating

## Cost Calculation

### Base Rates (per second)

| Model | Base Rate | Audio Multiplier |
|-------|-----------|------------------|
| `veo-3.1-generate-preview` | $0.50 | 1.5x |
| `veo-3.1-fast-generate-preview` | $0.10 | 1.5x |
| `veo-2.0-generate-001` | $0.35 | 1.0x (no audio) |

### Formula

```
cost = duration × perSecond × (hasAudio ? audioMultiplier : 1.0)
min = cost × 0.9
max = cost × 1.1
```

## Output Format

```
Cost Estimate:
  Model: <model-display-name>
  Duration: <duration> seconds
  Audio: enabled|disabled
  Resolution: <resolution>
  Aspect Ratio: <ratio>

  Estimated cost: $<min> - $<max>

To generate this video, remove the --estimate-cost flag.
```

## Parameters

All video parameters are accepted for accurate estimation:
- `--video-model` / `--video-fast`
- `--duration`
- `--audio` / `--no-audio`
- `--resolution`
- `--aspect`

## Use Cases

1. **Budget planning**: Estimate before committing
2. **Option comparison**: Compare fast vs premium models
3. **Development**: Plan iteration costs

# Knowledge Required

- [lib/cost.ts](../lib/cost.ts) - Cost calculation implementation

# Context Requirements

- [x] None - works without API key (local calculation)

### Success Metrics

- **Functional Correctness**: Accurate cost estimates
  - Matches documented pricing
  - Correctly applies audio multiplier
  - Range reflects ±10% variance
- **Spec Adherence**:
  - No API calls made
  - No video generated
  - All video options respected in calculation
- **Quality Gates**:
  - Clear, readable output format
  - Actionable guidance to generate

### Validation Commands

```bash
# Basic estimate (no API key needed)
nano-banana --video "test" --estimate-cost | grep -q "Estimated cost" && echo "PASS: Shows estimate"

# Premium model estimate (8s with audio = ~$6)
nano-banana --video "test" --estimate-cost --duration 8 2>&1 | grep -q '\$[456]' && echo "PASS: Premium pricing"

# Fast model estimate (8s with audio = ~$1.20)
nano-banana --video "test" --estimate-cost --video-fast --duration 8 2>&1 | grep -q '\$1' && echo "PASS: Fast pricing"

# No audio reduces cost
nano-banana --video "test" --estimate-cost --video-fast --no-audio 2>&1 | grep -q "disabled" && echo "PASS: No-audio shown"

# Verify no video created
nano-banana --video "test" --estimate-cost
test ! -f output/video-*.mp4 && echo "PASS: No video generated"
```
