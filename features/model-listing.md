---
name: model-listing
status: completed
completed: 2025-12-05
updated: 2025-12-05
depends: []
---

# Overview

List available Gemini and Veo models using the `--list-models` flag.

# Specification

## Command Interface

```
nano-banana --list-models
```

## Behavior

1. Validate `GEMINI_API_KEY` is set
2. Fetch models from Google API: `https://generativelanguage.googleapis.com/v1beta/models`
3. Parse response and extract model names
4. Categorize models into two groups:
   - **Image Generation**: Models without "veo" in name
   - **Video Generation (Veo)**: Models with "veo" in name
5. Display sorted lists

## Output Format

```
Available models:

Image Generation:
  gemini-2.0-flash
  gemini-2.0-flash-exp
  nano-banana-pro-preview
  ...

Video Generation (Veo):
  veo-2.0-generate-001
  veo-3.1-fast-generate-preview
  veo-3.1-generate-preview
```

## Error Handling

| Condition | Behavior |
|-----------|----------|
| Missing `GEMINI_API_KEY` | Exit 1 with error message |
| API fetch error | Exit 1 with error details |
| No models in response | Display "Error fetching models" |

## Model Name Processing

- Strips `models/` prefix from API response
- Sorts alphabetically within each category
- Filters based on presence of "veo" substring

# Knowledge Required

- None - self-documenting feature

# Context Requirements

- [x] `GEMINI_API_KEY` environment variable set
- [x] Network access to Google API

### Success Metrics

- **Functional Correctness**: Models are listed correctly
  - Both image and video models shown
  - Models are sorted alphabetically
  - Categorization is accurate
- **Spec Adherence**:
  - `models/` prefix stripped
  - Two distinct sections in output
- **Quality Gates**:
  - Clean, readable output
  - Helpful for model selection

### Validation Commands

```bash
# Basic listing
nano-banana --list-models | grep -q "Available models" && echo "PASS: Header shown"

# Image models section
nano-banana --list-models | grep -q "Image Generation" && echo "PASS: Image section shown"

# Video models section
nano-banana --list-models | grep -q "Video Generation" && echo "PASS: Video section shown"

# Veo models in correct section
nano-banana --list-models | grep -A20 "Video Generation" | grep -q "veo" && echo "PASS: Veo models categorized"

# Error case: no API key
unset GEMINI_API_KEY && nano-banana --list-models 2>&1 | grep -q "GEMINI_API_KEY" && echo "PASS: API key required"
```
