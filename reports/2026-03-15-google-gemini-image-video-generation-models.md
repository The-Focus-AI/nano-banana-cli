# Google Gemini Image & Video Generation Models -- March 2026

## Abstract

This report provides a comprehensive inventory of Google's image and video generation models available via the Gemini API and Vertex AI as of March 2026. The landscape has expanded significantly since late 2025, with three distinct product lines now serving different use cases: **Imagen 4** for dedicated text-to-image generation, **Gemini Image models** (branded "Nano Banana") for multimodal conversational image generation and editing, and **Veo** for video generation. Key developments include the launch of Imagen 4 (GA, August 2025), Veo 3.1 (October 2025), Gemini 3 Pro Image / "Nano Banana Pro" (late 2025), and Gemini 3.1 Flash Image / "Nano Banana 2" (February 2026). Several older models have been deprecated, including all Gemini 2.0 Flash image variants and Veo preview endpoints. This report catalogs every current model ID, its capabilities, pricing, and status to inform API integration decisions.

---

## 1. Imagen 4 Models (Dedicated Image Generation)

Imagen 4 is Google's dedicated text-to-image generation family, released as generally available in [August 2025](https://developers.googleblog.com/announcing-imagen-4-fast-and-imagen-4-family-generally-available-in-the-gemini-api/). Unlike the Gemini Image models, Imagen does **not** support image editing, inpainting, outpainting, or conversational multi-turn workflows. It is optimized for single-shot, high-quality text-to-image generation.

### 1.1 Model IDs

| Model ID | Variant | Status | Max Resolution |
|---|---|---|---|
| `imagen-4.0-generate-001` | Standard | **GA** | 2K (2048x2048) |
| `imagen-4.0-fast-generate-001` | Fast | **GA** | 1K (1024x1024) |
| `imagen-4.0-ultra-generate-001` | Ultra | **GA** | 2K (2048x2048) |

**Deprecated preview models** (removed November 30, 2025 per [Vertex AI docs](https://docs.cloud.google.com/vertex-ai/generative-ai/docs/model-reference/imagen-api)):
- `imagen-4.0-generate-preview-06-06`
- `imagen-4.0-fast-generate-preview-06-06`
- `imagen-4.0-ultra-generate-preview-06-06`

### 1.2 Capabilities

All three Imagen 4 variants share these capabilities:
- Text-to-image generation (1-4 images per request)
- Digital watermarking (SynthID) and Content Credentials (C2PA)
- Person generation support
- Prompt rewriting (preview)
- Configurable safety settings

**Not supported**: Image editing, inpainting, outpainting, object insertion/removal, style transfer, image customization.

### 1.3 Resolution & Aspect Ratios

**Standard and Ultra** support: 1024x1024, 896x1280, 1280x896, 768x1408, 1408x768, 2048x2048, 1792x2560, 2560x1792, 1536x2816, 2816x1536

**Fast** supports: 1024x1024, 896x1280, 1280x896, 768x1408, 1408x768

Aspect ratios: 1:1, 3:4, 4:3, 9:16, 16:9

### 1.4 Pricing

Per [Gemini API pricing](https://ai.google.dev/gemini-api/docs/pricing):
| Variant | Price per Image |
|---|---|
| Imagen 4 Fast | $0.02 |
| Imagen 4 Standard | $0.04 |
| Imagen 4 Ultra | $0.06 |

### 1.5 Older Imagen Models (Still Available on Vertex AI)

| Model ID | Status | Notes |
|---|---|---|
| `imagen-3.0-generate-002` | GA | Previous generation |
| `imagen-3.0-generate-001` | GA | Supports editing capabilities |
| `imagen-3.0-fast-generate-001` | GA | Fast variant of Imagen 3 |
| `imagen-3.0-capability-001` | GA | Editing/customization features |

---

## 2. Gemini Image Models ("Nano Banana" Family)

The Gemini Image models represent Google's multimodal approach to image generation, where a large language model natively generates images as part of a conversational workflow. These models support multi-turn editing, reference images, text rendering, and grounding via Google Search. Google has branded these models under the **"Nano Banana"** codename.

### 2.1 Model IDs

| Model ID | Brand Name | Status | Release | Discontinuation |
|---|---|---|---|---|
| `gemini-3.1-flash-image-preview` | **Nano Banana 2** | Preview | Feb 26, 2026 | TBD |
| `gemini-3-pro-image-preview` | **Nano Banana Pro** | Preview | Late 2025 | TBD |
| `gemini-2.5-flash-image` | **Nano Banana** | **GA** | Oct 2, 2025 | Oct 2, 2026 |

### 2.2 Gemini 3.1 Flash Image (Nano Banana 2) -- NEWEST

Launched [February 26, 2026](https://blog.google/innovation-and-ai/technology/ai/nano-banana-2/), this is Google's latest image generation model, ranking #1 on the Artificial Analysis Image Arena upon release.

**Model ID**: `gemini-3.1-flash-image-preview`

**Key capabilities**:
- Text-to-image and conversational image editing
- Output resolutions: 512 (0.5K), 1K (default), 2K, 4K
- Aspect ratios: 1:1, 1:4, 1:8, 2:3, 3:2, 3:4, 4:1, 4:3, 4:5, 5:4, 8:1, 9:16, 16:9, 21:9
- Up to 14 reference images per prompt
- Thinking mode supported
- Grounding with Google Search (text + image search)
- SynthID watermarking
- Batch API supported
- Input token limit: 131,072 / Output: 32,768

**Pricing** (per [Gemini API pricing](https://ai.google.dev/gemini-api/docs/pricing)):
| Resolution | Approx. Cost per Image |
|---|---|
| 512px (0.5K) | ~$0.045 |
| 1024px (1K) | ~$0.067 |
| 2048px (2K) | ~$0.101 |
| 4096px (4K) | ~$0.151 |

Batch API applies a 50% discount.

### 2.3 Gemini 3 Pro Image (Nano Banana Pro)

The highest-quality Gemini image model, designed for professional asset production with advanced reasoning capabilities according to [Google's documentation](https://docs.cloud.google.com/vertex-ai/generative-ai/docs/models/gemini/3-pro-image).

**Model ID**: `gemini-3-pro-image-preview`

**Key capabilities**:
- Professional-grade image generation with "multi-stage planning and self-correction"
- Industry-leading text rendering (long passages, multilingual)
- Output resolutions: 1K, 2K, 4K
- Up to 14 reference images (6 objects + 5 characters)
- Aspect ratios: 1:1, 3:2, 2:3, 3:4, 4:3, 4:5, 5:4, 9:16, 16:9, 21:9
- Grounding with Google Search
- Thinking mode supported

**Pricing**:
| Resolution | Approx. Cost per Image |
|---|---|
| 1024px (1K) | ~$0.134 |
| 2048px (2K) | ~$0.134 |
| 4096px (4K) | ~$0.24 |

**Not supported**: Code execution, function calling, context caching, RAG Engine, Gemini Live API.

### 2.4 Gemini 2.5 Flash Image (Nano Banana)

The original "Nano Banana" model, now in GA status per [Vertex AI documentation](https://docs.cloud.google.com/vertex-ai/generative-ai/docs/models/gemini/2-5-flash-image). Optimized for high-volume, low-latency use cases.

**Model ID**: `gemini-2.5-flash-image`

**Key capabilities**:
- Text-to-image and conversational image editing
- Output resolution: 1K (1024x1024 default)
- Each output image = 1,290 tokens
- Up to 10 output images per prompt
- Aspect ratios: 1:1, 3:2, 2:3, 3:4, 4:3, 4:5, 5:4, 9:16, 16:9, 21:9
- SynthID watermarking, C2PA
- Input: 32,768 tokens / Output: 32,768 tokens

**Pricing**: ~$0.039 per image (1,290 tokens at $30/1M output tokens). Batch: ~$0.0195.

**Deprecated preview**: `gemini-2.5-flash-image-preview` was shut down January 15, 2026.

### 2.5 Deprecated Gemini Image Models

| Model ID | Status | Notes |
|---|---|---|
| `gemini-2.0-flash-exp` | **Deprecated** | Original experimental image generation model |
| `gemini-2.0-flash-exp-image-generation` | **Deprecated** | Removed, returns 404 |
| `gemini-2.0-flash-preview-image-generation` | **Deprecated** | Shut down |
| `gemini-2.5-flash-image-preview` | **Deprecated** | Shut down Jan 15, 2026 |

---

## 3. Veo Video Generation Models

Veo is Google's video generation model family. As of March 2026, three generations are available: Veo 2, Veo 3, and Veo 3.1.

### 3.1 Model IDs

| Model ID | Generation | Status | Max Resolution |
|---|---|---|---|
| `veo-3.1-generate-001` | Veo 3.1 | **GA** | 1080p |
| `veo-3.1-fast-generate-001` | Veo 3.1 Fast | **GA** | 1080p |
| `veo-3.1-generate-preview` | Veo 3.1 | Preview | 4K |
| `veo-3.1-fast-generate-preview` | Veo 3.1 Fast | Preview | 4K |
| `veo-3.0-generate-001` | Veo 3 | **GA** | 1080p |
| `veo-3.0-fast-generate-001` | Veo 3 Fast | **GA** | 1080p |
| `veo-2.0-generate-001` | Veo 2 | **GA** | 720p |

**Deprecated** (removal April 2, 2026):
- `veo-3.0-generate-preview` (shut down Nov 12, 2025)
- `veo-3.0-fast-generate-preview` (shut down Nov 12, 2025)
- `veo-2.0-generate-exp`
- `veo-2.0-generate-preview`

### 3.2 Veo 3.1 -- LATEST

Introduced [October 2025](https://developers.googleblog.com/introducing-veo-3-1-and-new-creative-capabilities-in-the-gemini-api/), Veo 3.1 is Google's most advanced video generation model.

**Key capabilities**:
- Text-to-video, image-to-video, video-to-video
- **Native audio generation** (dialogue, sound effects, ambient sounds, music)
- Video extension (up to 7 seconds per extension, 20 extensions max = 2+ minutes)
- First/last frame generation for transitions
- Up to 3 reference images for content guidance
- Portrait (9:16) and landscape (16:9) support
- 24 FPS, MP4 output

**Resolution/Duration options**:
| Resolution | Duration Options | Notes |
|---|---|---|
| 720p | 4s, 6s, 8s | Supports extension |
| 1080p | 8s | Higher latency |
| 4K | 8s | Preview models only |

**Pricing** per [Gemini API pricing](https://ai.google.dev/gemini-api/docs/pricing):
| Model | 720p/1080p | 4K |
|---|---|---|
| Veo 3.1 | $0.40/sec | $0.60/sec |
| Veo 3.1 Fast | $0.15/sec | $0.35/sec |

An 8-second video at 1080p costs: $3.20 (standard) or $1.20 (fast).

### 3.3 Veo 3

The predecessor to Veo 3.1, with similar capabilities but fewer creative controls per [Vertex AI documentation](https://docs.cloud.google.com/vertex-ai/generative-ai/docs/models/veo/3-0-generate).

**Key capabilities**:
- Text-to-video, image-to-video
- Native audio generation (sound + dialogue)
- Prompt rewriting
- Duration: 4, 6, or 8 seconds
- Resolution: 720p, 1080p
- Up to 4 output videos per prompt (GA)

**Not supported** (in Veo 3, but added in 3.1): Video extension, frame-based generation, reference image guidance.

**Pricing**: Same as Veo 3.1 ($0.40/sec standard, $0.15/sec fast for 720p/1080p).

### 3.4 Veo 2

The previous generation, still available for simpler use cases per [Vertex AI documentation](https://docs.cloud.google.com/vertex-ai/generative-ai/docs/models/veo/2-0-generate).

**Model ID**: `veo-2.0-generate-001`

**Key capabilities**:
- Text-to-video, image-to-video
- Reference image guidance
- Object insertion/removal (preview)
- Duration: 5-8 seconds
- Resolution: 720p only
- English-only input
- No audio generation
- No video extension

**Pricing**: $0.35/sec

---

## 4. Timeline of Recent Releases

| Date | Event |
|---|---|
| **June 2025** | Imagen 4 preview models released |
| **August 2025** | Imagen 4 family reaches GA (Fast, Standard, Ultra) |
| **October 2025** | Gemini 2.5 Flash Image reaches GA; Veo 3.1 released in preview |
| **November 2025** | Imagen 4 preview models deprecated; Veo 3.0 previews shut down; Gemini 2.5 Flash Image input tokens reduced (1290 to 258 for editing) |
| **January 2026** | Veo 4K output and portrait video support added; `gemini-2.5-flash-image-preview` shut down |
| **February 2026** | Gemini 3.1 Flash Image (Nano Banana 2) launched; Imagen 4 preview-06-06 models removed |
| **March 2026** | Gemini 3 Pro Preview (text model) deprecated |
| **April 2026** | Veo 2 preview/exp endpoints scheduled for removal |
| **June 2026** | Gemini 2.0 Flash/Flash-Lite scheduled for retirement |
| **October 2026** | Gemini 2.5 Flash Image scheduled for discontinuation |

---

## 5. Model Selection Guide

### For Image Generation

| Use Case | Recommended Model | Model ID | Why |
|---|---|---|---|
| **Cheapest per image** | Imagen 4 Fast | `imagen-4.0-fast-generate-001` | $0.02/image, fast |
| **Best quality, single-shot** | Imagen 4 Ultra | `imagen-4.0-ultra-generate-001` | Highest detail, 2K |
| **Conversational editing** | Nano Banana 2 | `gemini-3.1-flash-image-preview` | Multi-turn, search grounding, 4K |
| **Professional/complex layouts** | Nano Banana Pro | `gemini-3-pro-image-preview` | Best text rendering, reasoning |
| **High-volume, low-cost** | Nano Banana | `gemini-2.5-flash-image` | GA stable, ~$0.039/image |
| **Batch processing** | Nano Banana + Batch API | `gemini-2.5-flash-image` | 50% discount = ~$0.0195 |

### For Video Generation

| Use Case | Recommended Model | Model ID | Why |
|---|---|---|---|
| **Best quality + audio** | Veo 3.1 | `veo-3.1-generate-001` | Full audio, 1080p, extensions |
| **4K video** | Veo 3.1 Preview | `veo-3.1-generate-preview` | Only model with 4K |
| **Fast/cheap video** | Veo 3.1 Fast | `veo-3.1-fast-generate-001` | $0.15/sec vs $0.40/sec |
| **Long videos (2+ min)** | Veo 3.1 | `veo-3.1-generate-001` | 20 extensions x 7s |
| **Budget video** | Veo 2 | `veo-2.0-generate-001` | $0.35/sec, 720p, no audio |

---

## 6. Complete Model ID Reference (Quick Lookup)

### Image Generation -- Currently Available

```
# Imagen 4 (text-to-image only, no editing)
imagen-4.0-generate-001          # Standard, GA
imagen-4.0-fast-generate-001     # Fast, GA
imagen-4.0-ultra-generate-001    # Ultra, GA

# Imagen 3 (legacy, still available on Vertex AI)
imagen-3.0-generate-002          # GA
imagen-3.0-generate-001          # GA
imagen-3.0-fast-generate-001     # GA
imagen-3.0-capability-001        # GA, editing features

# Gemini Image / Nano Banana (multimodal, supports editing)
gemini-3.1-flash-image-preview   # Nano Banana 2, Preview (newest)
gemini-3-pro-image-preview       # Nano Banana Pro, Preview
gemini-2.5-flash-image           # Nano Banana, GA (discontinues Oct 2026)
```

### Video Generation -- Currently Available

```
# Veo 3.1
veo-3.1-generate-001             # GA, up to 1080p
veo-3.1-fast-generate-001        # GA, up to 1080p
veo-3.1-generate-preview         # Preview, up to 4K
veo-3.1-fast-generate-preview    # Preview, up to 4K

# Veo 3
veo-3.0-generate-001             # GA, up to 1080p
veo-3.0-fast-generate-001        # GA, up to 1080p

# Veo 2
veo-2.0-generate-001             # GA, 720p only
```

### Deprecated / Shutting Down

```
# Already shut down
gemini-2.0-flash-exp                          # Deprecated
gemini-2.0-flash-exp-image-generation         # Deprecated
gemini-2.0-flash-preview-image-generation     # Deprecated
gemini-2.5-flash-image-preview                # Shut down Jan 15, 2026
imagen-4.0-generate-preview-06-06             # Removed
imagen-4.0-fast-generate-preview-06-06        # Removed
imagen-4.0-ultra-generate-preview-06-06       # Removed
veo-3.0-generate-preview                      # Shut down Nov 12, 2025
veo-3.0-fast-generate-preview                 # Shut down Nov 12, 2025

# Scheduled for removal
veo-2.0-generate-exp                          # April 2, 2026
veo-2.0-generate-preview                      # April 2, 2026
```

---

## References

1. [Imagen 4 -- Gemini API Documentation](https://ai.google.dev/gemini-api/docs/models/imagen)
2. [Imagen 4 -- Vertex AI Documentation](https://docs.cloud.google.com/vertex-ai/generative-ai/docs/models/imagen/4-0-generate)
3. [Imagen API Reference -- Vertex AI](https://docs.cloud.google.com/vertex-ai/generative-ai/docs/model-reference/imagen-api)
4. [Announcing Imagen 4 Fast and GA -- Google Developers Blog](https://developers.googleblog.com/announcing-imagen-4-fast-and-imagen-4-family-generally-available-in-the-gemini-api/)
5. [Nano Banana Image Generation -- Gemini API](https://ai.google.dev/gemini-api/docs/image-generation)
6. [Gemini 3.1 Flash Image Preview -- Gemini API](https://ai.google.dev/gemini-api/docs/models/gemini-3.1-flash-image-preview)
7. [Nano Banana 2 Announcement -- Google Blog](https://blog.google/innovation-and-ai/technology/ai/nano-banana-2/)
8. [Introducing Gemini 2.5 Flash Image -- Google Developers Blog](https://developers.googleblog.com/en/introducing-gemini-2-5-flash-image/)
9. [Gemini 2.5 Flash Image -- Vertex AI](https://docs.cloud.google.com/vertex-ai/generative-ai/docs/models/gemini/2-5-flash-image)
10. [Gemini 3 Pro Image -- Vertex AI](https://docs.cloud.google.com/vertex-ai/generative-ai/docs/models/gemini/3-pro-image)
11. [Veo 3.1 -- Vertex AI](https://docs.cloud.google.com/vertex-ai/generative-ai/docs/models/veo/3-1-generate)
12. [Veo 3 -- Vertex AI](https://docs.cloud.google.com/vertex-ai/generative-ai/docs/models/veo/3-0-generate)
13. [Veo 2 -- Vertex AI](https://docs.cloud.google.com/vertex-ai/generative-ai/docs/models/veo/2-0-generate)
14. [Introducing Veo 3.1 -- Google Developers Blog](https://developers.googleblog.com/introducing-veo-3-1-and-new-creative-capabilities-in-the-gemini-api/)
15. [Generate Videos with Veo 3.1 -- Gemini API](https://ai.google.dev/gemini-api/docs/video)
16. [Gemini API Pricing](https://ai.google.dev/gemini-api/docs/pricing)
17. [Gemini API Models Overview](https://ai.google.dev/gemini-api/docs/models)
18. [Gemini API Release Notes / Changelog](https://ai.google.dev/gemini-api/docs/changelog)
19. [Firebase AI Logic -- Supported Models](https://firebase.google.com/docs/ai-logic/models)
20. [Veo -- Google DeepMind](https://deepmind.google/models/veo/)
21. [Imagen -- Google DeepMind](https://deepmind.google/models/imagen/)
22. [Nano Banana 2 Pricing -- OpenRouter](https://openrouter.ai/google/gemini-3.1-flash-image-preview)
