# Video Generation Implementation Specification

## Executive Summary

This specification details the implementation plan for adding video generation capabilities to the nano-banana-cli project using Google Veo 3.1. The design extends the existing image generation architecture while addressing the fundamental differences between synchronous image generation and asynchronous video generation.

**Key Decisions:**

1. **Single CLI, Extended** - Extend `cli.ts` with `--video` flag rather than creating a separate CLI
2. **Separate Skill** - Create a new `nano-banana-videogen` skill alongside the existing image skill
3. **Shared Core** - Extract shared utilities (API client, file handling) into a common module

---

## 1. Architecture Decision

### Decision: Extend Existing CLI

**Rationale:**

1. **User Experience Consistency**: Users already familiar with `nano-banana "prompt"` can naturally extend to `nano-banana --video "prompt"`. The mental model remains "nano-banana generates media from prompts."

2. **Code Reuse**: Significant overlap exists:
   - API key handling and authentication
   - Output directory management
   - Model selection patterns (`--model`, `--list-models`)
   - File path resolution and MIME type detection
   - Error handling and user feedback

3. **Simpler Distribution**: Single npm package, single binary entry point, single version to maintain.

4. **Discoverability**: Users running `nano-banana --help` see both image and video capabilities.

### File Structure After Implementation

```
nano-banana-cli/
├── cli.ts                  # Extended with video support
├── cli.js                  # Wrapper (unchanged)
├── lib/
│   ├── types.ts            # Shared type definitions
│   ├── client.ts           # Shared GoogleGenAI client wrapper
│   ├── progress.ts         # Progress display utilities
│   └── cost.ts             # Cost estimation utilities
├── skills/
│   ├── nano-banana-imagegen/  # Existing skill (unchanged)
│   └── nano-banana-videogen/  # New skill for video
│       ├── SKILL.md
│       ├── prompting-guide.md
│       └── examples/
│           ├── cinematic-shots.md
│           ├── dialogue-and-audio.md
│           ├── scene-extensions.md
│           ├── image-to-video.md
│           └── json-prompting.md
└── specs/
    └── video-generation-spec.md  # This document
```

---

## 2. CLI Interface Design

### New Flags and Options

```
Usage: nano-banana <prompt> [options]

Image Generation (default):
  --file <image>       Input image to edit (omit for text-to-image)
  --output <file>      Output file path (default: output/generated-<timestamp>.png)
  --model <name>       Gemini model to use (default: nano-banana-pro-preview)
  --flash              Use gemini-2.0-flash model

Video Generation:
  --video              Enable video generation mode
  --video-model <name> Veo model to use (default: veo-3.1-generate-preview)
  --video-fast         Use veo-3.1-fast-generate-preview (cheaper, faster)
  --duration <sec>     Video duration in seconds (4, 6, or 8; default: 8)
  --aspect <ratio>     Aspect ratio: 16:9, 9:16 (default: 16:9)
  --resolution <res>   Resolution: 720p, 1080p (default: 1080p)
  --audio              Generate synchronized audio (default: true)
  --no-audio           Disable audio generation (saves cost)
  --reference <image>  Reference image for character/style consistency (max 3)
  --extend <video>     Extend a previously generated video
  --seed <number>      Seed for reproducibility
  --estimate-cost      Show cost estimate without generating

Common Options:
  --output <file>      Output file path
  --prompt-file <path> Read prompt from file instead of argument
  --list-models        List all available models (images and video)
  --help, -h           Show this help message
```

### Command Examples

```bash
# Basic video generation
nano-banana --video "A golden retriever playing in a meadow, cinematic lighting"

# Video with specific settings
nano-banana --video "A sunset over mountains" \
  --duration 8 \
  --aspect 16:9 \
  --resolution 1080p \
  --output sunset.mp4

# Cost-optimized development workflow
nano-banana --video "Quick test scene" --video-fast --no-audio --resolution 720p

# Image-to-video (animate an existing image)
nano-banana --video "The character slowly turns and smiles" --file portrait.png

# Video with reference images for consistency
nano-banana --video "The hero walks through a forest" \
  --reference hero-front.jpg \
  --reference hero-profile.jpg

# Extend a previous video
nano-banana --video "Continue the journey, camera follows the path" \
  --extend output/video-123.mp4

# Estimate cost before generating
nano-banana --video "Complex scene" --duration 8 --audio --estimate-cost
```

---

## 3. Skill Structure Design

### Decision: Separate Skill for Video

**Rationale:**

1. **Context Size Management**: Video prompting guidance is extensive. Combining with image prompting would create an unwieldy context.

2. **Distinct Trigger Patterns**:
   - Image: "create an image", "generate a picture", "make me a logo"
   - Video: "create a video", "animate this", "make a clip", "generate footage"

3. **Specialized Guidance**: Video prompting requires teaching:
   - Camera movements (dolly, pan, crane, tracking)
   - Audio design (dialogue with colons, SFX, ambient layers)
   - Scene extension workflow
   - Cost awareness (significantly more expensive)

4. **Independent Updates**: Video capabilities evolve rapidly; separate skill allows independent versioning.

### Skill Triggers (SKILL.md frontmatter)

```yaml
---
name: Nano Banana Video Generation
description: Generate videos using Google Veo models via the nano-banana CLI. Use this skill when the user asks to create, generate, animate, or produce videos with AI. Supports text-to-video, image-to-video animation, dialogue with lip-sync, and scene extensions. Trigger on requests like "create a video", "animate this image", "make a video clip", "generate footage", "produce a short film", "add motion to this".
---
```

---

## 4. Skill Content Requirements

### SKILL.md Must Cover

1. **Prerequisites** - Same API key as images, no additional config

2. **Quick Reference** - Basic command patterns for common tasks

3. **Understanding the Request** - Video-specific questions:
   - What's the core action or scene?
   - Is this cinematic, documentary, commercial, or casual?
   - Should there be dialogue or just ambient sound?
   - What camera movement serves the story?
   - What's the target duration?
   - Is character consistency important across shots?

4. **Workflow Steps**:
   - Step 1: Craft cinematic prompt (camera + subject + action + environment + audio)
   - Step 2: Consider cost and choose model (fast vs premium)
   - Step 3: Generate and wait for completion (2-4 minutes)
   - Step 4: Review and iterate

5. **Camera Movement Quick Reference** - Table lookup

6. **Audio Design Basics** - Dialogue formatting with colons, layered audio

7. **Cost Awareness** - Pricing table, optimization tips

8. **Always Include** - "No subtitles, no text overlay, no captions"

### prompting-guide.md Must Cover

1. **The Five-Part Formula**:
   ```
   [Camera Movement] + [Subject] + [Action] + [Environment] + [Audio Design]
   ```

2. **Camera Movements** with examples:
   - Static, Pan, Tilt, Dolly In/Out, Tracking, Crane, Handheld, Dutch Angle

3. **Dialogue Formatting**:
   - Use colon format: `Character says: "Exact dialogue here."`
   - Keep to 6-12 words for 8 seconds
   - Describe voice characteristics in character description

4. **Audio Layers**:
   - Dialogue (highest priority)
   - Sound effects (specific, timed)
   - Ambient (3-5 elements max)
   - Music (lowest priority, "ducks under dialogue")

5. **Reference Images**:
   - Maximum 3 asset references
   - Ideal: front, three-quarter, profile angles

6. **Scene Extension**:
   - Maximum 148 seconds (20 extensions)
   - Best for: continuous camera movements, establishing shots
   - Avoid for: dialogue-heavy or action scenes

7. **JSON Prompting** (advanced):
   - Structured format for complex shots

---

## 5. Implementation Phases

### Phase 1: Core Infrastructure

**Goal**: Basic video generation with progress display.

**Files to Create/Modify**:
- `lib/types.ts` - Shared type definitions
- `lib/client.ts` - GoogleGenAI client wrapper
- `lib/progress.ts` - CLI progress spinner
- `lib/cost.ts` - Cost estimation
- `cli.ts` - Add `--video` flag and routing

**Deliverable**: `nano-banana --video "prompt"` works.

### Phase 2: Image-to-Video and References

**Goal**: Animate images and use reference images.

**Changes**:
- Handle `--file` in video mode (image-to-video)
- Add `--reference` flag support (max 3)
- Image loading and encoding

**Deliverable**: Can animate images and use references.

### Phase 3: Scene Extension

**Goal**: Support videos beyond 8 seconds.

**Changes**:
- Add `--extend` flag
- Extension workflow with URI chaining
- Resolution constraints (720p for extensions)

**Deliverable**: Can extend videos up to 148 seconds.

### Phase 4: Skill Documentation

**Goal**: Complete LLM guidance.

**Files to Create**:
- `skills/nano-banana-videogen/SKILL.md`
- `skills/nano-banana-videogen/prompting-guide.md`
- `skills/nano-banana-videogen/examples/*.md`

**Deliverable**: Full skill ready for LLM consumption.

### Phase 5: Polish and Testing

**Goal**: Production-ready release.

**Changes**:
- `--estimate-cost` implementation
- `--list-models` includes video models
- Updated help text
- Cost confirmation prompts
- Updated package.json and README

---

## 6. Technical Implementation Details

### Polling Strategy

```typescript
const POLL_INTERVAL_MS = 10_000; // 10 seconds
const MAX_WAIT_MS = 5 * 60 * 1000; // 5 minutes timeout

async function waitForCompletion(
  ai: GoogleGenAI,
  operation: VideoOperation,
  onProgress?: (elapsed: number, status: string) => void
): Promise<VideoOperation> {
  const startTime = Date.now();

  while (!operation.done) {
    const elapsed = Math.floor((Date.now() - startTime) / 1000);

    if (Date.now() - startTime > MAX_WAIT_MS) {
      throw new Error(`Video generation timeout after ${elapsed}s`);
    }

    onProgress?.(elapsed, 'Generating...');

    await new Promise(resolve => setTimeout(resolve, POLL_INTERVAL_MS));
    operation = await ai.operations.getVideosOperation({ operation });
  }

  return operation;
}
```

### Progress Display

```typescript
function showProgress(elapsed: number, status: string): void {
  const spinner = ['|', '/', '-', '\\'][Math.floor(elapsed) % 4];
  process.stdout.write(`\r${spinner} ${status} (${elapsed}s elapsed)`);
}

function clearProgress(): void {
  process.stdout.write('\r\x1b[K'); // Clear line
}
```

### Cost Estimation

```typescript
const COSTS = {
  'veo-3.1-generate-preview': { perSecond: 0.50, audioMultiplier: 1.5 },
  'veo-3.1-fast-generate-preview': { perSecond: 0.10, audioMultiplier: 1.5 },
  'veo-2.0-generate-001': { perSecond: 0.35, audioMultiplier: 1.0 },
};

function estimateCost(model: string, duration: number, audio: boolean): string {
  const base = COSTS[model] || COSTS['veo-3.1-fast-generate-preview'];
  const perSecond = audio ? base.perSecond * base.audioMultiplier : base.perSecond;
  const total = duration * perSecond;
  return `$${total.toFixed(2)}`;
}
```

---

## 7. Risk Mitigations

| Risk | Mitigation |
|------|------------|
| API changes (preview) | Isolate API calls behind abstraction layer |
| Cost surprises | Show estimates, confirm expensive operations |
| Long wait times (2-4 min) | Clear progress indicator, set expectations in docs |
| Skill context bloat | Separate skill, examples in subdirectory |
| Extension failures | Validate inputs, clear error messages |

---

## 8. Success Criteria

1. **Functional**: Users can generate videos via CLI
2. **Integrated**: Video follows same patterns as image generation
3. **Documented**: LLM skill provides effective prompting guidance
4. **Cost-Aware**: Users understand and can control costs
5. **Extensible**: Architecture supports future features

---

## 9. Key Files to Reference

| File | Purpose |
|------|---------|
| `cli.ts` | Core CLI to extend |
| `skills/nano-banana-imagegen/SKILL.md` | Pattern for skill structure |
| `skills/nano-banana-imagegen/prompting-guide.md` | Template for prompting guide |
| `reports/2025-12-02-google-veo-video-prompting-best-practices.md` | Source for video prompting content |
| `reports/2025-12-02-google-veo-video-generation.md` | Technical API details |
