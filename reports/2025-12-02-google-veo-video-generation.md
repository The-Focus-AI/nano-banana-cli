---
title: "Video Generation: Google Veo"
date: 2025-12-02
topic: video-generation
recommendation: Google Veo via Gemini API
version_researched: Veo 3.1 (latest as of Dec 2025)
use_when:
  - Need high-quality video generation (up to 4K resolution)
  - Want native audio generation synchronized with video
  - Building applications that integrate with Google's ecosystem
  - Require cinematic quality with realistic physics simulation
  - Need API access with enterprise-grade reliability (Vertex AI)
  - Want to extend existing image generation to video workflows
avoid_when:
  - Budget is limited (pricing starts at $0.10-0.75 per second)
  - Need completely uncensored content (strict safety filters)
  - Require videos longer than 8 seconds per generation (requires stitching)
  - Need immediate availability (some models in paid preview)
  - Operating in regions where Veo is not available
  - Require mature API with extensive third-party tooling (Runway more mature)
project_context:
  language: TypeScript/JavaScript
  relevant_dependencies: ["@google/genai", "dotenv"]
  current_capabilities: Image generation and editing with Gemini models
---

## Summary

Google Veo is a state-of-the-art video generation model family that creates high-quality videos from text prompts, images, or combinations of both. As of December 2025, Veo 3.1 and Veo 3.1 Fast represent the latest models, offering up to 1080p resolution, native audio generation, and 8-second video clips with scene extension capabilities[1][2]. The models are accessible through both the Gemini API (consumer-friendly, API key authentication) and Vertex AI (enterprise-grade, Google Cloud integration)[3][4].

Veo 3.1 leads the market in photorealism and audio-video synchronization, particularly excelling at following complex prompts, maintaining character consistency, and simulating realistic physics[5][6]. The model generates videos at 720p or 1080p resolution at 24-30 fps, with GitHub-level popularity metrics unavailable as it's a proprietary Google service. The latest release (Veo 3.1) was announced on October 15, 2025, with general availability through Google AI Studio[7].

For the nano-banana-cli project, Veo represents a natural extension from image to video generation using the same @google/genai SDK (v1.30.0+) that currently powers image workflows[8]. The SDK reached General Availability in May 2025 and is the only recommended path for accessing Veo, as legacy libraries (@google/generative-ai) are deprecated and lack Veo support[9].

## Philosophy & Mental Model

### Core Concepts

Veo operates on a **multimodal foundation** that merges scene understanding, physics simulation, and audio synthesis into a unified generation pipeline[10]. Unlike image models that produce static outputs, Veo must maintain temporal coherence across frames while respecting real-world physics, lighting changes, and camera motion.

Key mental model principles:

1. **Prompt-Driven Cinematography**: Veo understands cinematic terminology (dolly shots, crane movements, Dutch angles) and translates these into actual camera behaviors[11]. Think of prompts as director's notes rather than simple descriptions.

2. **Long-Running Operations Pattern**: Video generation is inherently slow (2-4 minutes for 8 seconds)[12]. The API uses an asynchronous pattern where you submit a request, receive an operation ID, and poll for completion. This differs from Gemini's synchronous image generation.

3. **Scene Extension Architecture**: Longer videos aren't generated as single clips but as connected 8-second segments[13]. The model uses the final second of the previous clip as a visual anchor, maintaining continuity. Maximum total length is ~148 seconds (20 extensions × 7 seconds + initial 8 seconds).

4. **Reference-Guided Generation**: Veo can accept up to 3 reference images to guide character appearance, object style, or scene composition[14]. These act as visual constraints alongside the text prompt.

5. **Native Audio Synthesis**: Unlike competitors, Veo 3+ generates synchronized audio (dialogue, sound effects, ambient noise) as part of the core generation process, not as a separate step[15]. The audio model understands prompt instructions like "whisper" or "echoing cave."

### Design Philosophy

Google designed Veo with three priorities:

- **Prompt Adherence**: The model prioritizes following instructions accurately over creative interpretation[16]
- **Physics Realism**: Extensive training on real-world video ensures believable motion, lighting, and object interactions[17]
- **Safety-First**: Aggressive content filtering prevents NSFW, violent, or policy-violating generations[18]

This makes Veo ideal for professional content creation but potentially frustrating for experimental or edgy creative work.

## Setup

### Prerequisites

1. **API Key or Google Cloud Project**:
   - Consumer path: Get a Gemini API key from [Google AI Studio](https://aistudio.google.com/apikey)
   - Enterprise path: Enable Vertex AI in a Google Cloud project with billing

2. **Subscription Requirements** (as of Dec 2025):
   - **Google AI Pro**: $19.99/month - Access to Veo 3 Fast via Gemini app/Flow[19]
   - **Google AI Ultra**: $249/month - Full access to Veo 3.1 via Gemini app/Flow[20]
   - **Pay-per-use**: Available through Gemini API (no subscription required)[21]

### Installation

Update your existing nano-banana-cli dependencies:

```bash
# Ensure you have the latest @google/genai SDK
npm install @google/genai@latest

# Current version should be >=1.30.0
npm list @google/genai
```

No additional packages required - video generation is built into the same SDK.

### Configuration

Add Gemini API key to your `.env` file (already configured for image generation):

```bash
# .env
GEMINI_API_KEY=your_api_key_here
```

For Vertex AI (enterprise path), you'll need Google Cloud credentials:

```bash
# Set up Google Cloud authentication
gcloud auth application-default login

# Set your project ID
export GOOGLE_CLOUD_PROJECT="your-project-id"
```

### Verification

Test API access with a minimal script:

```typescript
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const ai = new GoogleGenAI({});

// List available models to verify access
const models = await ai.models.list();
console.log("Available video models:");
models.models
  .filter(m => m.name.includes("veo"))
  .forEach(m => console.log(`  ${m.name}`));
```

You should see output listing Veo models:
```
Available video models:
  veo-3.1-generate-preview
  veo-3.1-fast-generate-preview
  veo-2.0-generate-001
```

## Core Usage Patterns

### Pattern 1: Text-to-Video Generation

**When to use**: Create videos from scratch using only text descriptions.

```typescript
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({});

// Generate a video from text prompt
const operation = await ai.models.generateVideos({
  model: "veo-3.1-generate-preview",
  prompt: "A golden retriever puppy playing in a sunlit meadow, " +
          "slow motion, cinematic lighting, 24mm wide angle lens. " +
          "The puppy jumps to catch a frisbee, camera follows the motion.",
  config: {
    aspectRatio: "16:9",
    durationSeconds: 8,
    resolution: "1080p",
    generateAudio: true,  // Include natural sounds
    seed: 42,             // For reproducibility
  }
});

// Poll until complete
while (!operation.done) {
  console.log("Generating video...");
  await new Promise(resolve => setTimeout(resolve, 10000)); // 10s intervals
  operation = await ai.operations.getVideosOperation({ operation });
}

// Download the result
await ai.files.download({
  file: operation.response.generatedVideos[0].video,
  downloadPath: "output/puppy-frisbee.mp4"
});

// Access audio track if needed
if (operation.response.generatedVideos[0].audio) {
  await ai.files.download({
    file: operation.response.generatedVideos[0].audio,
    downloadPath: "output/puppy-frisbee-audio.mp3"
  });
}
```

**Key considerations**:
- Use specific cinematic terms (lens type, camera movement) for better control
- `generateAudio: true` adds ~33% to cost but provides synchronized sound
- Polling interval should be 10+ seconds (shorter intervals waste API calls)

### Pattern 2: Image-to-Video Generation

**When to use**: Animate existing images or extend your image generation workflow to video.

```typescript
import * as fs from "node:fs";

// Start from a generated or existing image
const imageBuffer = fs.readFileSync("input/character-portrait.png");
const imageBase64 = imageBuffer.toString("base64");

const operation = await ai.models.generateVideos({
  model: "veo-3.1-generate-preview",
  prompt: "The character slowly turns their head to look at the camera, " +
          "slight smile forming. Subtle background movement, " +
          "professional film quality.",
  image: {
    bytesBase64Encoded: imageBase64,
    mimeType: "image/png"
  },
  config: {
    aspectRatio: "9:16",      // Vertical video for social media
    durationSeconds: 6,
    resolution: "1080p",
    generateAudio: false,     // Silent animation
    resizeMode: "pad",        // Maintain aspect, add padding if needed
  }
});

// Poll and download as in Pattern 1
```

**Integration with nano-banana-cli**:
```typescript
// Generate image first
const imageResponse = await ai.models.generateContent({
  model: "nano-banana-pro-preview",
  contents: [{ text: "Portrait of a cyberpunk hacker" }],
  config: { responseModalities: ["Image"] }
});

// Extract image data
const imageData = imageResponse.candidates[0].content.parts[0].inlineData.data;

// Animate it
const videoOp = await ai.models.generateVideos({
  model: "veo-3.1-fast-generate-preview",
  prompt: "Subject's eyes glow with code reflections, " +
          "slight head tilt, dramatic neon lighting flickers",
  image: {
    bytesBase64Encoded: imageData,
    mimeType: "image/png"
  }
});
```

### Pattern 3: Scene Extension (Creating Longer Videos)

**When to use**: Create videos longer than 8 seconds by chaining generations.

```typescript
// Generate initial clip
let operation = await ai.models.generateVideos({
  model: "veo-3.1-generate-preview",
  prompt: "A spaceship approaches a distant planet, " +
          "cruising through space, stars in background",
  config: { durationSeconds: 8 }
});

// Wait for completion
while (!operation.done) {
  await new Promise(resolve => setTimeout(resolve, 10000));
  operation = await ai.operations.getVideosOperation({ operation });
}

const firstClipUri = operation.response.generatedVideos[0].video;

// Extend the scene (adds 7 seconds)
operation = await ai.models.generateVideos({
  model: "veo-3.1-generate-preview",
  prompt: "The spaceship gets closer to the planet, " +
          "details of the surface becoming visible, " +
          "continuing the previous motion seamlessly",
  video: {
    gcsUri: firstClipUri  // Reference the first clip
  },
  config: {
    durationSeconds: 8,  // Extension adds ~7 seconds
    aspectRatio: "16:9"  // Must match original
  }
});

// Can chain up to 20 extensions for ~148 seconds total
```

**Important constraints**:
- Must use same aspect ratio as original clip
- Input video must be Veo-generated (can't extend arbitrary videos)
- Resolution must be 720p for extensions
- Total length capped at ~148 seconds (initial 8s + 20×7s)

### Pattern 4: Reference-Guided Generation

**When to use**: Maintain character/object consistency across multiple video generations.

```typescript
// Prepare reference images (character, style, environment)
const characterImg = fs.readFileSync("refs/hero-character.png");
const styleImg = fs.readFileSync("refs/art-direction.png");

const operation = await ai.models.generateVideos({
  model: "veo-3.1-generate-preview",
  prompt: "The hero walks through a foggy forest, " +
          "looking around cautiously, hand on sword hilt",
  referenceImages: [
    {
      bytesBase64Encoded: characterImg.toString("base64"),
      mimeType: "image/png",
      type: "asset"  // Character/object reference
    },
    {
      bytesBase64Encoded: styleImg.toString("base64"),
      mimeType: "image/png",
      type: "style"  // Visual style reference
    }
  ],
  config: {
    durationSeconds: 8,
    resolution: "1080p"
  }
});
```

**Reference image limits**:
- Up to 3 asset references OR 1 style reference
- Asset refs help maintain character/object appearance
- Style refs guide overall visual aesthetic
- Still experimental - consistency not guaranteed across extreme angle changes

### Pattern 5: Negative Prompting and Safety Controls

**When to use**: Prevent unwanted content or generation patterns.

```typescript
const operation = await ai.models.generateVideos({
  model: "veo-3.1-generate-preview",
  prompt: "A busy city street at night, neon signs, " +
          "pedestrians walking, realistic urban atmosphere",
  config: {
    negativePrompt: "cars, vehicles, traffic, accidents, violence", // Exclude these
    personGeneration: "allow_adult",  // or "dont_allow"
    durationSeconds: 8
  }
});
```

**Available safety controls**:
- `negativePrompt`: Specify what NOT to generate (not 100% reliable)
- `personGeneration`: Control whether people/faces appear
- Built-in filters reject NSFW, violent, copyrighted content

## Anti-Patterns & Pitfalls

### ❌ Don't: Poll Too Frequently

```typescript
// BAD - wastes API quota
while (!operation.done) {
  await new Promise(resolve => setTimeout(resolve, 1000)); // 1 second!
  operation = await ai.operations.getVideosOperation({ operation });
}
```

**Why it's wrong**: Video generation takes 2-4 minutes. Polling every second makes 120-240 unnecessary API calls, consuming your quota and potentially triggering rate limits (10 requests/minute default)[22].

### ✅ Instead: Use Appropriate Intervals

```typescript
// GOOD - reasonable polling
const POLL_INTERVAL_MS = 10000; // 10 seconds
const MAX_WAIT_MS = 5 * 60 * 1000; // 5 minutes timeout

const startTime = Date.now();
while (!operation.done) {
  if (Date.now() - startTime > MAX_WAIT_MS) {
    throw new Error("Video generation timeout");
  }

  console.log(`Waiting... (${Math.floor((Date.now() - startTime) / 1000)}s elapsed)`);
  await new Promise(resolve => setTimeout(resolve, POLL_INTERVAL_MS));
  operation = await ai.operations.getVideosOperation({ operation });
}
```

### ❌ Don't: Ignore Cost Accumulation

```typescript
// BAD - expensive mistake
const promises = [];
for (let i = 0; i < 100; i++) {
  promises.push(ai.models.generateVideos({
    model: "veo-3.1-generate-preview", // $0.75/second
    prompt: prompts[i],
    config: { durationSeconds: 8, generateAudio: true }
  }));
}
await Promise.all(promises); // Just spent $600 (100 × 8s × $0.75)!
```

**Why it's wrong**: At $0.75/second with audio, 8-second videos cost $6 each. Batch operations can quickly reach hundreds of dollars.

### ✅ Instead: Use Fast Model for Iteration

```typescript
// GOOD - cost-conscious workflow
const isDevelopment = process.env.NODE_ENV === "development";

const operation = await ai.models.generateVideos({
  // Use cheap model for testing, premium for production
  model: isDevelopment
    ? "veo-3.1-fast-generate-preview"  // $0.10-0.15/second
    : "veo-3.1-generate-preview",       // $0.50-0.75/second
  prompt: prompt,
  config: {
    durationSeconds: 8,
    // Disable audio during development (saves 33%)
    generateAudio: !isDevelopment,
    resolution: isDevelopment ? "720p" : "1080p"
  }
});

console.log(`Estimated cost: $${
  isDevelopment ? (8 * 0.15).toFixed(2) : (8 * 0.75).toFixed(2)
}`);
```

### ❌ Don't: Expect Immediate Results

```typescript
// BAD - treating like image generation
async function generateVideo(prompt: string): Promise<Buffer> {
  const response = await ai.models.generateVideos({
    model: "veo-3.1-generate-preview",
    prompt: prompt
  });
  // Error: response is an operation, not the video!
  return response.data;
}
```

**Why it's wrong**: Unlike image generation (30-60 seconds), video generation is asynchronous by design. The initial response is an operation handle, not the video data.

### ✅ Instead: Implement Proper Async Handling

```typescript
// GOOD - async-aware design
async function generateVideo(
  prompt: string,
  onProgress?: (elapsed: number) => void
): Promise<string> {
  let operation = await ai.models.generateVideos({
    model: "veo-3.1-generate-preview",
    prompt: prompt
  });

  const startTime = Date.now();
  while (!operation.done) {
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    onProgress?.(elapsed);

    await new Promise(resolve => setTimeout(resolve, 10000));
    operation = await ai.operations.getVideosOperation({ operation });
  }

  const outputPath = `output/video-${Date.now()}.mp4`;
  await ai.files.download({
    file: operation.response.generatedVideos[0].video,
    downloadPath: outputPath
  });

  return outputPath;
}

// Usage with progress feedback
const path = await generateVideo(
  "A sunset over mountains",
  (elapsed) => console.log(`Generating... ${elapsed}s`)
);
```

### ❌ Don't: Assume Videos Can Be Arbitrarily Long

```typescript
// BAD - requesting impossible duration
const operation = await ai.models.generateVideos({
  model: "veo-3.1-generate-preview",
  prompt: "A 60-second documentary about climate change",
  config: {
    durationSeconds: 60  // Error: max is 8 seconds!
  }
});
```

**Why it's wrong**: Veo generates 8-second clips maximum per generation[23]. Longer videos require scene extension (up to 20 extensions = ~148 seconds) or client-side stitching.

### ✅ Instead: Plan Multi-Segment Workflows

```typescript
// GOOD - segmented approach for long videos
interface VideoSegment {
  prompt: string;
  duration: 8;
}

async function generateLongVideo(
  segments: VideoSegment[]
): Promise<string[]> {
  const clips: string[] = [];
  let previousClipUri: string | null = null;

  for (const [index, segment] of segments.entries()) {
    console.log(`Generating segment ${index + 1}/${segments.length}`);

    let operation = await ai.models.generateVideos({
      model: "veo-3.1-generate-preview",
      prompt: segment.prompt,
      ...(previousClipUri && {
        video: { gcsUri: previousClipUri } // Extend previous clip
      }),
      config: { durationSeconds: 8 }
    });

    // Poll for completion
    while (!operation.done) {
      await new Promise(resolve => setTimeout(resolve, 10000));
      operation = await ai.operations.getVideosOperation({ operation });
    }

    const clipPath = `output/segment-${index}.mp4`;
    await ai.files.download({
      file: operation.response.generatedVideos[0].video,
      downloadPath: clipPath
    });

    clips.push(clipPath);
    previousClipUri = operation.response.generatedVideos[0].video;
  }

  return clips;
}

// Generate 3-segment video (24 seconds total)
const segments = [
  { prompt: "Opening shot: mountain landscape at dawn", duration: 8 },
  { prompt: "Camera pans across the valley, mist rising", duration: 8 },
  { prompt: "Sun breaks over the peak, golden light spreads", duration: 8 }
];
const clips = await generateLongVideo(segments);

// Stitch with ffmpeg (separate process)
// ffmpeg -i segment-0.mp4 -i segment-1.mp4 -i segment-2.mp4 -filter_complex concat=n=3:v=1:a=1 final.mp4
```

### ❌ Don't: Ignore Safety Filter Errors

```typescript
// BAD - no error handling for blocked content
const operation = await ai.models.generateVideos({
  model: "veo-3.1-generate-preview",
  prompt: "A person fighting in slow motion, blood spatters"
});
// May be rejected by safety filters without clear error message
```

**Why it's wrong**: Veo has aggressive safety filters that reject violence, NSFW content, copyrighted material, and certain person depictions[24]. Failed generations still consume development time and may count toward quotas.

### ✅ Instead: Handle Safety Rejections Gracefully

```typescript
// GOOD - defensive prompt design with fallbacks
async function safeGenerateVideo(
  prompt: string,
  maxRetries = 2
): Promise<string | null> {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const operation = await ai.models.generateVideos({
        model: "veo-3.1-generate-preview",
        prompt: prompt,
        config: {
          personGeneration: "dont_allow", // Reduce rejection risk
          negativePrompt: "violence, weapons, blood, nudity"
        }
      });

      while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, 10000));
        operation = await ai.operations.getVideosOperation({ operation });
      }

      // Check for safety filter rejection in response
      if (operation.response.error) {
        console.warn(`Attempt ${attempt + 1} rejected: ${operation.response.error}`);

        if (attempt < maxRetries) {
          // Modify prompt to be safer
          prompt = sanitizePrompt(prompt);
          console.log(`Retrying with sanitized prompt: ${prompt}`);
          continue;
        }
        return null;
      }

      const outputPath = `output/video-${Date.now()}.mp4`;
      await ai.files.download({
        file: operation.response.generatedVideos[0].video,
        downloadPath: outputPath
      });

      return outputPath;

    } catch (error) {
      console.error(`Generation error:`, error);
      if (attempt === maxRetries) return null;
    }
  }

  return null;
}

function sanitizePrompt(prompt: string): string {
  // Remove potentially problematic words
  const blockedTerms = ["fight", "attack", "weapon", "blood", "kill"];
  let clean = prompt;
  blockedTerms.forEach(term => {
    clean = clean.replace(new RegExp(term, "gi"), "");
  });
  return clean.trim();
}
```

## Caveats

### When Veo Is NOT the Right Choice

**1. Strict Budget Constraints ($0.10-0.75 per second)**

Veo pricing makes it expensive for high-volume applications. At $0.75/second with audio (Veo 3.1), a 1-minute video costs $45. For projects generating hundreds of videos, this quickly becomes prohibitive[25].

**Alternative**: Use Kling AI ($0.05-0.15/second) for budget-conscious projects, or Veo 3.1 Fast ($0.10-0.15/second) without audio for 75% cost reduction[26]. Reserve premium Veo 3.1 for final deliverables only.

**2. Need for Uncensored or Edgy Content**

Google's safety filters are notoriously strict, blocking not just NSFW content but also violence, certain artistic depictions, copyrighted references, and sometimes innocuous prompts misclassified as problematic[27][28]. There's no way to disable these filters.

**Alternative**: Use Runway Gen-3 or open-source models (Stable Video Diffusion) with configurable safety settings. Runway offers more permissive content policies for professional use cases.

**3. Real-Time or Low-Latency Requirements**

Generation takes 2-4 minutes for 8-second clips[29]. The asynchronous polling pattern adds complexity and makes real-time applications (live streaming, interactive experiences) infeasible.

**Alternative**: Pre-generate video assets, or use faster models like Veo 3.1 Fast (still 1-2 minutes). For true real-time, consider procedural animation or pre-rendered libraries.

**4. Videos Longer Than 2-3 Minutes**

While scene extension allows up to ~148 seconds (2.5 minutes), maintaining narrative coherence across 20+ extensions is challenging. Each extension costs separately, and visual drift accumulates[30].

**Alternative**: Generate key scenes with Veo, then use traditional editing tools (Premiere Pro, DaVinci Resolve) to combine with stock footage, transitions, and effects. Or consider Sora (supports longer generations in single shots).

**5. Precise Character/Object Consistency**

Despite reference images, Veo struggles with perfect consistency across extreme angle changes, lighting variations, or occlusions. Characters may look like "cousins rather than identical twins" in different shots[31].

**Alternative**: Use 3D rendering pipelines (Blender, Unreal Engine) for projects requiring perfect consistency. Or generate static images with Gemini image models (excellent consistency) and animate subtly with image-to-video.

**6. Limited Google Cloud/API Experience**

Veo requires either Gemini API (simpler but limited features) or Vertex AI (powerful but complex Google Cloud setup with IAM, billing, GCS buckets). The learning curve is steep for non-Google developers[32].

**Alternative**: Runway Gen-3 has more beginner-friendly documentation and UI. Or use third-party platforms (Replicate, fal.ai) that wrap Veo with simpler interfaces.

**7. Open-Source or Self-Hosted Requirements**

Veo is a proprietary cloud service with no self-hosting option. You're dependent on Google's availability, pricing changes, and policy decisions.

**Alternative**: Use open-source models like Stable Video Diffusion, CogVideoX, or AnimateDiff that can run on your infrastructure. Trade quality for control and cost predictability.

**8. Mature Ecosystem and Third-Party Tools**

Runway has been in market longer with extensive third-party integrations, plugins, and community tools. Veo's ecosystem is still developing[33].

**Alternative**: Choose Runway Gen-3 if you need proven workflows, Adobe integrations, or rely on community plugins.

### Technical Limitations

- **No arbitrary video input**: Can only extend Veo-generated videos, not user-uploaded content[34]
- **Watermarking**: Videos include visible AI-generated watermarks (removable only for Ultra plan users)[35]
- **Rate limits**: 10 requests/minute default, quota increases require business justification[36]
- **Region availability**: Some features limited to specific Google Cloud regions (primarily us-central1)
- **Audio generation**: Only available with Veo 3+, not retroactively added to Veo 2 videos
- **Resolution limits**: 4K capability exists but most API access limited to 720p/1080p
- **Format constraints**: Outputs MP4 only, no control over codec or bitrate (beyond "optimized" vs "lossless")

### Comparison to Alternatives

| Feature | Veo 3.1 | Sora 2 | Runway Gen-3 | Kling AI |
|---------|---------|--------|--------------|----------|
| **Max Resolution** | 4K (1080p API) | 1080p | 4K upscale | 4K premium |
| **Native Audio** | Yes | No | Yes (separate tool) | Manual process |
| **Max Duration** | 8s (+extensions) | 20s single shot | 10s standard | 10s |
| **API Maturity** | Moderate | Limited | High | Growing |
| **Pricing** | $0.10-0.75/s | $0.60-0.80/s | $0.30-0.50/s | $0.05-0.15/s |
| **Content Filters** | Very strict | Strict | Moderate | Permissive |
| **Physics Realism** | Excellent | Excellent | Good | Very good |
| **Prompt Adherence** | Excellent | Good | Good | Moderate |
| **Best For** | Cinematic quality with audio | Long single-shot scenes | Professional workflows | Budget-conscious projects |

Choose Veo when audio-video synchronization, prompt accuracy, and Google ecosystem integration outweigh cost and flexibility concerns.

## References

[1] [Generate videos with Veo 3.1 in Gemini API](https://ai.google.dev/gemini-api/docs/video) - Official Gemini API documentation for Veo 3.1

[2] [Introducing Veo 3.1 and new creative capabilities in the Gemini API](https://developers.googleblog.com/en/introducing-veo-3-1-and-new-creative-capabilities-in-the-gemini-api/) - Google Developers Blog announcement

[3] [Veo on Vertex AI video generation API](https://docs.cloud.google.com/vertex-ai/generative-ai/docs/model-reference/veo-video-generation) - Vertex AI API reference

[4] [Generate videos with Veo on Vertex AI](https://docs.cloud.google.com/vertex-ai/generative-ai/docs/video/overview) - Vertex AI overview documentation

[5] [Veo - Google DeepMind](https://deepmind.google/models/veo/) - Official model information from DeepMind

[6] [Complete Guide to Google Veo 2 API](https://www.cursor-ide.com/blog/veo2-api-complete-guide-2025) - Third-party comprehensive guide

[7] [Veo 2 video generation now generally available](https://developers.googleblog.com/en/veo-2-video-generation-now-generally-available/) - GA announcement

[8] [@google/genai - npm](https://www.npmjs.com/package/@google/genai) - Official npm package

[9] [Build with Veo 3, now available in the Gemini API](https://developers.googleblog.com/en/veo-3-now-available-gemini-api/) - SDK availability announcement

[10] [Veo 3.1 vs Sora 2 - A Comprehensive Comparison](https://www.imagine.art/blogs/veo-3-1-vs-sora-2) - Technical comparison

[11] [Veo 2 model capabilities](https://deepmind.google/technologies/veo/veo-2) - DeepMind technical details

[12] [Veo 3.1 Pricing & Plans](https://www.veo3gen.app/blog/veo-3-1-pricing-plans) - Generation time and pricing details

[13] [Veo on Vertex AI API Reference - Scene Extension](https://docs.cloud.google.com/vertex-ai/generative-ai/docs/model-reference/veo-video-generation) - Extension documentation

[14] [Veo 3.1 API Documentation](https://veo3api.com/docs) - Third-party API guide with reference image details

[15] [Sora 2 vs Veo 3.1: Which Text-to-Video Model Looks More Realistic](https://www.juheapi.com/blog/sora-2-vs-veo-3-1-realistic-text-to-video-comparison) - Audio comparison

[16] [Google Veo 3 Vs Veo 2: Full Comparison](https://templytic.com/google-veo-3-vs-veo-2/) - Model differences

[17] [Veo 3 Review 2025: Features That Make It a Game-Changer](https://www.allaboutai.com/ai-reviews/veo/) - Physics simulation analysis

[18] [Responsible AI for Veo on Vertex AI](https://cloud.google.com/vertex-ai/generative-ai/docs/video/responsible-ai-and-usage-guidelines) - Official safety guidelines

[19] [Veo 3.1 Pricing & Access (2025): Paid Preview, Plans, and Limits](https://skywork.ai/blog/veo-3-1-pricing-access-2025/) - Subscription plan details

[20] [How Much does Veo 3 Cost?](https://www.cometapi.com/how-much-does-veo-3-cost-all-you-need-to-know/) - Comprehensive pricing breakdown

[21] [Google Veo Pricing Calculator & Cost Guide](https://costgoat.com/pricing/google-veo) - Usage-based pricing details

[22] [VEO 3 API Pricing Breakdown 2025](https://www.aifreeapi.com/en/posts/veo3-api-pricing-comprehensive-guide-2025) - Rate limits and quotas

[23] [google/veo-2 | Run with an API on Replicate](https://replicate.com/google/veo-2) - Duration constraints

[24] [Can Google Veo 3 Generate Adult Content?](http://anakin.ai/blog/can-google-veo-3-generate-adult-content/) - Safety filter analysis

[25] [Veo 3 and Veo 3 Fast – new pricing, new configurations](https://developers.googleblog.com/en/veo-3-and-veo-3-fast-new-pricing-new-configurations-and-better-resolution/) - Official pricing announcement

[26] [Veo 3 API Pricing Comparison](https://kie.ai/v3-api-pricing) - Cost optimization strategies

[27] [Video generation beta using Veo2 - prudish safety rules](https://discuss.ai.google.dev/t/video-generation-beta-using-veo2-prudish-safety-rules/80214) - Community discussion on filters

[28] [Google Veo 3 NSFW: AI Content Moderation Solutions](https://reelmind.ai/blog/google-veo-3-nsfw-ai-content-moderation-solutions) - Content policy deep dive

[29] [Sora 2 vs Veo 3.1: Head-to-Head Comparison](https://www.veo3gen.app/blog/veo-3-1-vs-sora-2-comparison) - Generation speed comparison

[30] [How to Access Veo 3.1 in 2025](https://skywork.ai/blog/how-to-access-veo-3-1-2025-guide/) - Extension limitations

[31] [Sora 2 vs Veo 3/3.1 vs Visla: What's the Difference](https://www.visla.us/blog/guides/sora-2-vs-veo-3-3-1-vs-visla-whats-the-difference-and-which-should-you-use/) - Consistency challenges

[32] [How to Use Veo 3.1 API](https://apidog.com/blog/veo-3-1-api/) - Setup complexity discussion

[33] [Veo 3 vs Top AI Video Generators](https://www.imagine.art/blogs/veo-3-vs-top-ai-video-generators) - Ecosystem comparison

[34] [How to Use Google Veo 2 API](https://apidog.com/blog/use-google-veo-2-api/) - Input constraints documentation

[35] [How to Use Google Veo 3 Without Any Restrictions](https://anakin.ai/blog/how-to-use-google-veo-3-without-any-restrictions-2025-guide/) - Watermarking details

[36] [Best AI Video Generation APIs in 2025](https://www.edenai.co/post/best-ai-video-generation-apis-in-2025) - Rate limiting comparison
