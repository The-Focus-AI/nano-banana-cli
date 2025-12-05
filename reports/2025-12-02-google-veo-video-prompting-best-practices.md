---
title: "Google Veo Video Generation: Comprehensive Prompting Best Practices"
date: 2025-12-02
topic: veo-video-prompting
recommendation: Google Veo 3.1 with JSON Prompting
version_researched: Veo 3.1 (December 2025)
use_when:
  - Creating cinematic AI videos with precise camera control
  - Need synchronized audio and dialogue with lip-sync
  - Building multi-shot narratives with character consistency
  - Require professional-grade output for commercial projects
  - Extending nano-banana-cli from images to video generation
avoid_when:
  - Budget severely limited (costs $0.15-$0.75 per second)
  - Need perfect character consistency across extreme angle changes
  - Require videos longer than 148 seconds without manual editing
  - Content includes copyrighted characters or restricted material
  - Need immediate real-time generation (takes 2-4 minutes per 8-second clip)
project_context:
  language: TypeScript/JavaScript
  relevant_dependencies: ["@google/genai ^1.30.0"]
  current_capabilities: ["Image generation with Gemini", "Image editing", "CLI tool"]
---

## Summary

This comprehensive guide covers Google Veo 3.1's advanced prompting techniques across six critical areas: camera movements, dialog and audio, reference images, character consistency, scene extension, and general best practices. Veo 3.1, released in October 2025, represents Google DeepMind's state-of-the-art video generation model with native audio synthesis, achieving 99.8% lip-sync accuracy and industry-leading prompt adherence[1][2].

The breakthrough discovery of late 2025 was JSON-structured prompting, which provides 300%+ improvement in consistency and quality compared to traditional text prompts[3]. This guide provides specific, actionable examples for each technique, optimized for integration into the nano-banana-cli project which currently uses the @google/genai SDK for image generation.

Veo 3.1 generates 4-8 second clips at 720p-1080p resolution (24fps) with extension capabilities up to 148 seconds total[4]. The model excels at understanding cinematic terminology (dolly shots, crane movements, rack focus) and maintains temporal coherence across frames while respecting real-world physics[5]. Cost ranges from $0.15/second (Veo 3.1 Fast) to $0.75/second (Veo 3.1 with audio)[6].

## Philosophy & Mental Model

### Core Design Principles

Veo 3.1 operates on a **five-part structured prompt formula**[7]:

```
[Cinematography] + [Subject] + [Action] + [Context] + [Style & Ambiance]
```

This structure mirrors professional film production workflows: you're not just describing what happens, but also how it's filmed, lit, and edited. Think of Veo as a virtual film crew that understands industry terminology but requires explicit direction[8].

### Key Mental Models

1. **Front-Loading Information**: Veo weights early words heavily. Place the core shot type, subject, and action first, then add style and camera details[9]. Don't bury critical information at the end.

2. **Layered Audio Generation**: Unlike competitors, Veo generates video and audio simultaneously, not as separate passes. The model understands that footsteps must sync with foot placement, dialogue requires lip movement, and environmental sounds should match the scene[10].

3. **Independent Generation Per Shot**: Each video generation is completely independent. Characters don't persist automatically between shots—you must explicitly re-describe identity anchors (wardrobe, hair, facial features) every single time[11].

4. **Show, Don't Tell**: Visual descriptions ("golden hour lighting with long shadows") outperform abstract concepts ("beautiful lighting"). Be cinematically specific[12].

5. **Temporal Anchoring**: Scene extensions use the final second (24 frames) of the previous clip as a visual anchor. This creates continuity but also means motion/composition in that final second heavily influences what comes next[13].

## Setup

### Prerequisites

Already covered in the main Veo report (`2025-12-02-google-veo-video-generation.md`), but quick checklist:

- @google/genai ^1.30.0 installed (already in nano-banana-cli)
- GEMINI_API_KEY environment variable set
- Node.js >= 18.0.0

### Additional Configuration for Advanced Prompting

Create a prompting configuration file:

```typescript
// config/veo-prompting.ts
export interface VeoPromptConfig {
  version: string;
  defaultModel: string;
  costOptimized: boolean;
  presets: {
    aspectRatios: Record<string, string>;
    cameraMovements: Record<string, string>;
    lightingStyles: Record<string, string>;
  };
}

export const veoConfig: VeoPromptConfig = {
  version: "veo-3.1",
  defaultModel: "veo-3.1-generate-preview",
  costOptimized: false, // Set true to use Fast model
  presets: {
    aspectRatios: {
      landscape: "16:9",
      portrait: "9:16",
      square: "1:1" // If supported
    },
    cameraMovements: {
      static: "Static shot on tripod",
      dollyIn: "Slow dolly-in",
      dollyOut: "Smooth dolly-out",
      panLeft: "Slow pan left",
      panRight: "Slow pan right",
      tiltUp: "Gentle tilt up",
      tiltDown: "Gentle tilt down",
      crane: "Crane shot",
      tracking: "Tracking shot following subject",
      handheld: "Handheld camera, slight shake"
    },
    lightingStyles: {
      goldenHour: "Golden hour lighting, warm tones, long shadows",
      blueHour: "Blue hour lighting, cool tones, twilight atmosphere",
      dramatic: "Dramatic side lighting, high contrast, deep shadows",
      soft: "Soft diffused lighting, even illumination, gentle shadows",
      studio: "Professional studio lighting, three-point setup",
      natural: "Natural window light, realistic ambient lighting"
    }
  }
};
```

## Core Usage Patterns

### Pattern 1: Camera Movements & Cinematic Techniques

Veo 3.1 understands professional cinematography terminology. Use specific camera movement terms for precise control.

#### Supported Camera Movements

According to Google's official documentation, Veo supports these camera operations[14]:

**Static Shot**
```typescript
const prompt = `Static shot on tripod. A ceramic coffee cup sits on a wooden table,
steam rising from the hot liquid. Morning sunlight streams through a nearby window,
creating a gentle backlight. Shallow depth of field, 50mm equivalent lens. Peaceful,
quiet atmosphere. No camera movement.`;
```

**Pan (Horizontal Rotation)**
```typescript
const prompt = `Slow pan left across a city skyline at dusk. Camera rotates smoothly
from right to left, revealing towering skyscrapers silhouetted against an orange
sunset. 24mm wide-angle lens. Cinematic, establishing shot aesthetic. 8-second
duration covering approximately 90 degrees of rotation.`;
```

**Tilt (Vertical Rotation)**
```typescript
const prompt = `Tilt down from a character's shocked face to the revealing letter in
their hands. Camera starts on a tight close-up of wide eyes and open mouth, then
smoothly tilts downward to show hands holding a crumpled envelope. Dramatic lighting,
high contrast. Suspenseful mood.`;
```

**Dolly In/Out (Camera Physically Moves)**
```typescript
// Dolly In - creates intimacy, emphasis
const dollyInPrompt = `Slow dolly-in on a woman sitting at a cafe table reading a
book. Camera physically moves closer over 8 seconds, starting from medium shot and
ending on close-up. Smooth gimbal movement, no shake. She remains absorbed in reading
until the final moment when she looks up. Soft afternoon window light.`;

// Dolly Out - creates isolation, reveals context
const dollyOutPrompt = `Dolly-out from a lone figure standing on a cliff edge. Camera
starts close on the character's back, then pulls away steadily to reveal the vast,
misty canyon surrounding them. Emphasizes isolation and scale. Epic fantasy
atmosphere, moody lighting.`;
```

**Tracking Shot (Camera Moves Parallel to Subject)**
```typescript
const prompt = `Tracking shot, camera trucks right following a character as they walk
along a busy sidewalk. Camera maintains consistent distance and framing (medium shot)
while moving parallel to the subject. Background pedestrians blur slightly, creating
depth. Urban, energetic atmosphere. Natural daylight.`;
```

**Crane Shot (Sweeping Vertical Movement)**
```typescript
const prompt = `Crane shot starting low on a lone hiker and ascending high above,
revealing they are standing on the edge of a colossal, mist-filled canyon at sunrise.
Epic fantasy style, awe-inspiring scale. Camera rises smoothly in a sweeping arc,
constantly adjusting angle to keep subject visible while showing environment. Soft
morning light, dramatic reveal.`;
```

**Aerial/Drone Shot**
```typescript
const prompt = `Sweeping aerial drone shot flying over a tropical island chain. Camera
glides smoothly above turquoise water, palm-covered islands visible below. Starts
high and gradually descends toward the main island. Golden hour lighting, paradise
aesthetic. Smooth, stabilized footage, no sudden movements.`;
```

**Handheld/Shaky Cam (Realism, Urgency)**
```typescript
const prompt = `Handheld camera shot during a chaotic marketplace chase. Camera
follows behind a running character, slight bounce and shake conveying urgency and
realism. Quick side-to-side adjustments as the character weaves through crowds.
Documentary style, gritty atmosphere. Natural lighting, fast-paced energy.`;
```

**Vertigo Effect (Dolly Zoom)**
```typescript
const prompt = `Vertigo effect dolly zoom on a character standing at the edge of a
cliff, the background rushing away. Camera dollies backward while simultaneously
zooming in, keeping the subject the same size while the background appears to stretch
and distort. Hitchcockian technique. Creates disorientation and psychological tension.
Dramatic moment of realization.`;
```

#### Advanced Camera Techniques

**Rack Focus**
```typescript
const prompt = `Rack focus technique. Shot starts with a coffee cup in sharp focus on
the foreground table, background blurred. Focus then shifts smoothly to a character
in the background who was initially out of focus, now clearly visible and looking
concerned. The coffee cup blurs as background sharpens. 50mm lens, shallow depth of
field. Cinematic storytelling technique.`;
```

**Dutch Angle (Tilted Frame)**
```typescript
const prompt = `Dutch angle shot (camera tilted approximately 30 degrees). A character
looks around nervously in a dimly lit alleyway. The tilted horizon creates unease and
disorientation. Noir aesthetic, dramatic shadows, high contrast. The angled framing
emphasizes psychological tension.`;
```

#### Important Camera Movement Guidelines

From professional prompting guides[15][16]:

1. **One primary movement**: Don't mix "dolly-in while panning left"—choose one main verb
2. **Specify speed**: "Slow dolly-in" vs. "Quick dolly-in" affects the mood
3. **Anchor static shots**: If you want NO movement, explicitly say "static on tripod"
4. **Use simple verbs**: "slow pan," "gentle dolly-in" work better than complex stacked instructions

#### Example: Building a Complete Camera Shot

```typescript
interface CameraShot {
  movement: string;
  subject: string;
  action: string;
  lens: string;
  lighting: string;
  mood: string;
  duration: number;
}

function buildCinematicPrompt(shot: CameraShot): string {
  return `${shot.movement}. ${shot.subject} ${shot.action}. ${shot.lens}.
${shot.lighting}. ${shot.mood}. No subtitles, no text overlay.`;
}

// Example usage
const shot: CameraShot = {
  movement: "Slow dolly-in from medium to close-up",
  subject: "A chef in a professional kitchen",
  action: "carefully plates a gourmet dish, focused and precise movements",
  lens: "35mm lens, shallow depth of field, background softly blurred",
  lighting: "Overhead studio lighting with warm practicals, slight rim light from back",
  mood: "Professional, meticulous, artisanal atmosphere",
  duration: 8
};

const prompt = buildCinematicPrompt(shot);
console.log(prompt);
// Output: "Slow dolly-in from medium to close-up. A chef in a professional kitchen
// carefully plates a gourmet dish, focused and precise movements. 35mm lens, shallow
// depth of field, background softly blurred. Overhead studio lighting with warm
// practicals, slight rim light from back. Professional, meticulous, artisanal
// atmosphere. No subtitles, no text overlay."
```

### Pattern 2: Dialog and Audio Generation

Veo 3.1's native audio generation supports synchronized dialogue, sound effects, and ambient sounds with 99.8% lip-sync accuracy[17].

#### Dialogue Formatting (Critical)

**Format with colon** - this tells Veo to use exact words[18]:

```typescript
// CORRECT: Use colon before quoted dialogue
const correctDialogue = `A friendly young woman, excited and cheerful, says:
"Hey there! Welcome to the park." Standing in a sunny park with trees in background,
golden hour lighting. Medium close-up, static shot. Natural lip-sync, genuine smile.
No subtitles, no text overlay.`;

// INCORRECT: Using quotes without colon
const incorrectDialogue = `A woman says "Hey there! Welcome to the park."`;
// This may lead to imprecise dialogue or weird phrasing
```

#### Dialogue Length Guidelines

Keep dialogue short for 8-second clips[19]:

- **6-12 words** for 8 seconds (most reliable)
- **3-5 words** for 4 seconds
- **15-18 words maximum** for 8 seconds (risks fast/unnatural speech)

```typescript
// GOOD: Appropriate length for 8 seconds
const goodLength = `A teacher says: "Today we'll explore quantum mechanics."
Friendly, welcoming tone, standing at whiteboard with equations. Professional
classroom setting, natural lighting.`;

// BAD: Too much dialogue for 8 seconds
const badLength = `A teacher says: "Welcome everyone to today's comprehensive lesson
on the fundamental principles of quantum mechanics and how they relate to our
understanding of the universe." ...`; // Will sound rushed or cut off
```

#### Emotional Tone and Voice Guidance

While Veo doesn't have predefined voice presets, you can guide tone through character description[20]:

```typescript
interface DialogueCharacter {
  age: string;
  emotion: string;
  voice: string;
  physicalState: string;
}

function buildDialoguePrompt(
  char: DialogueCharacter,
  dialogue: string,
  environment: string
): string {
  return `${char.age}, ${char.emotion}, ${char.voice}, speaking directly to camera
saying: "${dialogue}" ${char.physicalState}. ${environment}. Natural lip-sync,
realistic facial expressions. No subtitles, no text overlay.`;
}

// Example: Confident business presentation
const businessChar: DialogueCharacter = {
  age: "Professional businesswoman in her 40s",
  emotion: "confident and authoritative",
  voice: "clear, projected voice with slight warmth",
  physicalState: "standing tall, good posture, maintaining eye contact"
};

const businessPrompt = buildDialoguePrompt(
  businessChar,
  "The results exceeded our expectations.",
  "Modern conference room, presenting to colleagues, bright office lighting"
);

// Example: Whispering secret
const whisperChar: DialogueCharacter = {
  age: "Young woman in her 20s",
  emotion: "secretive and cautious",
  voice: "hushed whisper, intimate tone",
  physicalState: "leaning in close, glancing around nervously"
};

const whisperPrompt = buildDialoguePrompt(
  whisperChar,
  "I found the hidden letter.",
  "Dimly lit library, shadows in background, mysterious atmosphere"
);
```

#### Layered Audio Design

Veo generates multiple audio layers simultaneously[21]. Structure your prompts to prioritize:

1. **Dialogue** (highest priority - always clear)
2. **Sound Effects** (specific, timed actions)
3. **Ambient Sounds** (background atmosphere, 3-5 elements max)
4. **Music** (lowest priority, often "ducks under" dialogue)

```typescript
interface AudioLayers {
  dialogue?: string;
  soundEffects: string[];
  ambient: string[];
  music?: string;
}

function buildAudioPrompt(audio: AudioLayers): string {
  const parts: string[] = [];

  if (audio.dialogue) {
    parts.push(`Speaking: "${audio.dialogue}"`);
  }

  if (audio.soundEffects.length > 0) {
    parts.push(`Sound effects: ${audio.soundEffects.join(", ")}`);
  }

  if (audio.ambient.length > 0) {
    parts.push(`Ambient sounds: ${audio.ambient.join(", ")}`);
  }

  if (audio.music) {
    parts.push(`Background music: ${audio.music}`);
  }

  return parts.join(". ");
}

// Example: Complex audio scene
const audioLayers: AudioLayers = {
  dialogue: "I've been expecting you.",
  soundEffects: [
    "Door creaking closed at 2-second mark",
    "Glass of whiskey set down on table at 5 seconds",
    "Leather chair creaking as character sits"
  ],
  ambient: [
    "Quiet fireplace crackling",
    "Rain pattering on windows",
    "Distant thunder rumble",
    "Faint clock ticking"
  ],
  music: "Low, ominous cello drone, ducks under dialogue, noir atmosphere"
};

const fullPrompt = `Static shot. A detective in a dark office, illuminated only by
desk lamp and fireplace. ${buildAudioPrompt(audioLayers)}. Film noir aesthetic,
dramatic shadows, high contrast. No subtitles, no text overlay.`;
```

#### Audio Precision vs. Vagueness

From prompting best practices[22]:

```typescript
// VAGUE: Produces generic, unmemorable audio
const vague = `A person in a creepy place. Spooky sounds. Dark atmosphere.`;

// PRECISE: Generates scene-specific, immersive audio
const precise = `A person walks through an abandoned factory. Faint transformer buzz
in background, occasional metal creak echoing, low ventilation system hum, distant
water dripping, footsteps echo on concrete floor. Industrial decay atmosphere, eerie
and unsettling.`;
```

#### Implicit vs. Explicit Dialogue

You can let Veo generate dialogue content OR specify exact words[23]:

```typescript
// IMPLICIT: Veo decides what's said
const implicit = `A standup comedian on stage tells a joke and the audience laughs.
Comedy club setting, spotlight on performer, casual and funny atmosphere.`;

// EXPLICIT: You control exact words
const explicit = `A standup comedian on stage says: "Why did the AI cross the road?
To get to the other dataset!" Pauses, then smiles as audience laughs. Comedy club
setting, spotlight, casual atmosphere. No subtitles.`;
```

**When to use each**:
- Implicit: Quick iterations, natural variety, don't need specific script
- Explicit: Precise messaging, brand scripts, narrative consistency across shots

#### Suppressing Unwanted Subtitles

Veo was trained on videos with baked-in subtitles, so it often generates them automatically[24]. Always include:

```typescript
const prompt = `${yourPromptContent}. No subtitles, no text overlay, no captions.`;
```

Also helps to use the colon format: `says: "dialogue"` rather than quote-heavy narration.

### Pattern 3: Reference Images & Asset Guidance

Veo 3.1 supports up to 3 reference images per generation for character/object consistency and style guidance[25].

#### Reference Image Types

1. **Asset/Subject Guidance**: Maintains character, object, or scene appearance
2. **Style Guidance**: Applies color grading, artistic style, or texture (only on veo-2.0-generate-exp)[26]

**Important**: Veo 3.1 models don't support style reference images—only asset/subject references[27]. Use veo-2.0-generate-exp if you need style transfer.

#### Image Preparation Best Practices

From character consistency research[28][29]:

```typescript
interface ReferenceImagePrep {
  count: 2 | 3;
  angles: string[];
  lighting: string;
  wardrobe: string;
  resolution: string;
  aspectRatio: string;
}

const idealPrep: ReferenceImagePrep = {
  count: 3,
  angles: [
    "Front-facing portrait (neutral expression)",
    "Three-quarter profile (slight angle)",
    "Side profile"
  ],
  lighting: "Neutral, even lighting (avoid dramatic shadows or colored gels)",
  wardrobe: "Consistent outfit across all references (e.g., 'red scarf, leather jacket')",
  resolution: "720p minimum (1280x720), higher preferred",
  aspectRatio: "16:9 or 9:16 (will be cropped if different)"
};
```

#### Using Reference Images in Code

```typescript
import * as fs from "node:fs";
import { GoogleGenAI } from "@google/genai";

interface ReferenceImage {
  path: string;
  type: "asset" | "style";
}

async function generateWithReferences(
  prompt: string,
  references: ReferenceImage[],
  config: { aspectRatio: string; durationSeconds: number; resolution: string }
) {
  if (references.length > 3) {
    throw new Error("Maximum 3 reference images allowed");
  }

  const ai = new GoogleGenAI({});

  // Load and encode images
  const referenceData = references.map(ref => ({
    bytesBase64Encoded: fs.readFileSync(ref.path, "base64"),
    mimeType: "image/jpeg", // or image/png
    type: ref.type
  }));

  const operation = await ai.models.generateVideos({
    model: "veo-3.1-generate-preview",
    prompt: prompt,
    referenceImages: referenceData,
    config: config
  });

  // Poll for completion...
  return operation;
}

// Example: Multi-shot character consistency
const characterRefs: ReferenceImage[] = [
  { path: "refs/character-front.jpg", type: "asset" },
  { path: "refs/character-three-quarter.jpg", type: "asset" },
  { path: "refs/character-profile.jpg", type: "asset" }
];

// Shot 1: Character in cafe
const shot1 = await generateWithReferences(
  `The same woman from the references, wearing identical green bomber jacket and
shoulder-length wavy black hair, sits at a cafe table reading. Soft window light,
warm atmosphere. Static shot. No subtitles.`,
  characterRefs,
  { aspectRatio: "16:9", durationSeconds: 8, resolution: "1080p" }
);

// Shot 2: Character in office (reuse same references)
const shot2 = await generateWithReferences(
  `The same woman from the references, wearing identical green bomber jacket and
shoulder-length wavy black hair, presents in a modern office. Bright office lighting,
professional atmosphere. Slow dolly-in. No subtitles.`,
  characterRefs,
  { aspectRatio: "16:9", durationSeconds: 8, resolution: "1080p" }
);
```

#### Reference Image Limitations

Even with references, consistency has limits[30][31]:

```typescript
// What HELPS consistency:
const helpfulFactors = [
  "Using 2-3 high-quality reference images",
  "Keeping wardrobe identical in prompt and references",
  "Maintaining similar lighting conditions across shots",
  "Avoiding extreme angle changes (close-up → wide → extreme close-up)",
  "Explicitly re-stating identity anchors in every prompt",
  "Using the same seed value across generations (helps but not guaranteed)"
];

// What BREAKS consistency:
const breakingFactors = [
  "Drastic lighting changes (bright daylight → dark night)",
  "Strong occlusions (character hidden then revealed)",
  "Changing hairstyle, age, or wardrobe between shots",
  "Extreme camera angle shifts",
  "Reference images with stylized filters or makeup"
];
```

**Real-world expectation**: Characters will look like "close relatives" rather than "identical twins" across different contexts[32]. Plan for minor drift and use editing/color grading to smooth inconsistencies.

#### Style Reference Images (Veo 2.0 Only)

```typescript
// Style guidance only works with older model
const styleOperation = await ai.models.generateVideos({
  model: "veo-2.0-generate-exp", // NOT veo-3.1!
  prompt: "A cat walking through a garden",
  referenceImages: [{
    bytesBase64Encoded: fs.readFileSync("style-reference.jpg", "base64"),
    mimeType: "image/jpeg",
    type: "style" // Applies color, texture, artistic style
  }],
  config: { durationSeconds: 8 }
});
```

### Pattern 4: Character Consistency Across Multiple Shots

Building on reference images, here's a complete workflow for maintaining character identity across a multi-shot narrative.

#### The Identity Anchor Technique

Re-state specific, unchanging details in every prompt[33]:

```typescript
interface CharacterIdentity {
  coreDescription: string; // Never changes
  outfit: string;          // Consistent across all shots
  features: string[];      // Persistent traits
}

const heroCharacter: CharacterIdentity = {
  coreDescription: "Woman in her early 30s, shoulder-length wavy black hair",
  outfit: "green bomber jacket over white shirt, gold hoop earrings",
  features: [
    "warm smile",
    "expressive brown eyes",
    "confident posture"
  ]
};

function buildCharacterPrompt(
  character: CharacterIdentity,
  action: string,
  environment: string,
  camera: string
): string {
  const identityAnchor = `${character.coreDescription}, ${character.outfit}, ${character.features.join(", ")}`;
  return `${camera}. ${identityAnchor}, ${action}. ${environment}. No subtitles, no text overlay.`;
}

// Shot 1: Cafe scene
const shot1Prompt = buildCharacterPrompt(
  heroCharacter,
  "sits at a cafe table reading a book, absorbed in the story, occasionally sipping coffee",
  "Cozy cafe interior, soft window light from left, warm color grading, intimate atmosphere",
  "Slow dolly-in from medium to close-up"
);

// Shot 2: Office scene (SAME character description)
const shot2Prompt = buildCharacterPrompt(
  heroCharacter,
  "stands at a whiteboard presenting to colleagues, gesturing enthusiastically, confident body language",
  "Modern office conference room, bright professional lighting, clean minimalist design",
  "Static medium shot, slightly off-center composition"
);

// Shot 3: Outdoor scene (SAME character description)
const shot3Prompt = buildCharacterPrompt(
  heroCharacter,
  "walks through a park, looking around at autumn leaves, pausing to take a deep breath",
  "Sunny park with colorful fall foliage, golden hour lighting, peaceful natural setting",
  "Tracking shot following from the side, matching her walking speed"
);
```

#### Multi-Prompt Storytelling Workflow

```typescript
interface StoryShot {
  id: string;
  prompt: string;
  references: string[]; // Paths to reference images
  config: {
    aspectRatio: string;
    durationSeconds: number;
    resolution: string;
  };
}

async function generateMultiShotStory(
  character: CharacterIdentity,
  shots: Omit<StoryShot, "prompt">[],
  referenceImages: string[]
): Promise<string[]> {
  const ai = new GoogleGenAI({});
  const outputPaths: string[] = [];

  for (const [index, shot] of shots.entries()) {
    console.log(`Generating shot ${index + 1}/${shots.length}...`);

    // Build prompt with consistent character description
    const fullPrompt = buildCharacterPrompt(
      character,
      shot.action,
      shot.environment,
      shot.camera
    );

    // Load reference images
    const refs = referenceImages.map(path => ({
      bytesBase64Encoded: fs.readFileSync(path, "base64"),
      mimeType: "image/jpeg",
      type: "asset" as const
    }));

    // Generate video
    let operation = await ai.models.generateVideos({
      model: "veo-3.1-generate-preview",
      prompt: fullPrompt,
      referenceImages: refs,
      config: shot.config
    });

    // Poll for completion
    while (!operation.done) {
      await new Promise(resolve => setTimeout(resolve, 10000));
      operation = await ai.operations.getVideosOperation({ operation });
    }

    // Download result
    const outputPath = `output/shot-${shot.id}.mp4`;
    await ai.files.download({
      file: operation.response.generatedVideos[0].video,
      downloadPath: outputPath
    });

    outputPaths.push(outputPath);
    console.log(`Shot ${index + 1} complete: ${outputPath}`);
  }

  return outputPaths;
}

// Example usage
const storyShots = [
  {
    id: "01-cafe",
    action: "sits at cafe reading, looks up and smiles warmly at camera",
    environment: "Cozy cafe, soft window light",
    camera: "Slow dolly-in",
    config: { aspectRatio: "16:9", durationSeconds: 8, resolution: "1080p" }
  },
  {
    id: "02-office",
    action: "presents at whiteboard, gesturing enthusiastically",
    environment: "Modern office, bright lighting",
    camera: "Static medium shot",
    config: { aspectRatio: "16:9", durationSeconds: 8, resolution: "1080p" }
  },
  {
    id: "03-park",
    action: "walks through autumn park, pausing to enjoy the scenery",
    environment: "Park with fall colors, golden hour",
    camera: "Tracking shot from side",
    config: { aspectRatio: "16:9", durationSeconds: 8, resolution: "1080p" }
  }
];

const characterReferences = [
  "refs/hero-front.jpg",
  "refs/hero-three-quarter.jpg",
  "refs/hero-profile.jpg"
];

const clips = await generateMultiShotStory(
  heroCharacter,
  storyShots,
  characterReferences
);
```

#### When Character Consistency Fails

**Problem**: "Identity drift"—character looks different across shots[34]

**Solutions**:
1. **Reduce variables**: Keep lighting style constant even if environment changes
2. **Test references**: Generate test clips to verify reference images work well
3. **Use seeds**: Same seed + same prompt = similar output (but doesn't guarantee cross-shot identity)
4. **Post-production**: Use AI tools like RunwayML's face swap or color grading to unify appearance
5. **Accept "family resemblance"**: Treat variations as "same actor, different lighting" rather than expecting pixel-perfect consistency

### Pattern 5: Scene Extension & Video Stitching

Create videos longer than 8 seconds by extending scenes up to 148 seconds total[35][36].

#### How Scene Extension Works

- Initial generation: 8 seconds
- Each extension: adds ~7 seconds (8-second window, 1-second overlap)
- Maximum: 20 extensions = 8 + (20 × 7) = 148 seconds[37]

The extension uses the **final second (24 frames)** of the previous clip as an anchor, maintaining visual continuity[38].

#### Basic Extension Pattern

```typescript
async function extendScene(
  initialPrompt: string,
  extensionPrompts: string[],
  config: { aspectRatio: string; resolution: string }
): Promise<string[]> {
  const ai = new GoogleGenAI({});
  const clips: string[] = [];

  // Generate initial clip
  console.log("Generating initial clip...");
  let operation = await ai.models.generateVideos({
    model: "veo-3.1-generate-preview",
    prompt: initialPrompt,
    config: { ...config, durationSeconds: 8 }
  });

  // Wait for completion
  while (!operation.done) {
    await new Promise(resolve => setTimeout(resolve, 10000));
    operation = await ai.operations.getVideosOperation({ operation });
  }

  // Save initial clip
  const clip1Path = "output/clip-0-initial.mp4";
  await ai.files.download({
    file: operation.response.generatedVideos[0].video,
    downloadPath: clip1Path
  });
  clips.push(clip1Path);

  let previousVideoUri = operation.response.generatedVideos[0].video;

  // Generate extensions
  for (const [index, extensionPrompt] of extensionPrompts.entries()) {
    console.log(`Generating extension ${index + 1}/${extensionPrompts.length}...`);

    operation = await ai.models.generateVideos({
      model: "veo-3.1-generate-preview",
      prompt: extensionPrompt,
      video: {
        gcsUri: previousVideoUri // Reference previous clip
      },
      config: {
        aspectRatio: config.aspectRatio, // MUST match original
        durationSeconds: 8, // Extension still generates 8s, adds ~7s
        resolution: "720p" // Extensions require 720p
      }
    });

    // Wait for completion
    while (!operation.done) {
      await new Promise(resolve => setTimeout(resolve, 10000));
      operation = await ai.operations.getVideosOperation({ operation });
    }

    // Save extension
    const clipPath = `output/clip-${index + 1}-extension.mp4`;
    await ai.files.download({
      file: operation.response.generatedVideos[0].video,
      downloadPath: clipPath
    });
    clips.push(clipPath);

    // Update reference for next extension
    previousVideoUri = operation.response.generatedVideos[0].video;
  }

  return clips;
}

// Example: 24-second aerial shot
const initialPrompt = `Aerial drone shot, starting high above a tropical island chain.
Camera slowly descends toward the main island, turquoise water visible below. Golden
hour lighting, paradise aesthetic. Smooth, stabilized movement.`;

const extensions = [
  `Continue the descent smoothly, camera now at tree-top level, revealing palm trees
swaying in the breeze. Waves crashing on pristine beach becoming visible. Maintain
smooth downward motion.`,

  `Camera reaches beach level, now panning across the shoreline. White sand, gentle
waves washing ashore. Camera dollies right along the beach, revealing a secluded cove.
Sunset colors intensify in sky.`
];

const clips = await extendScene(
  initialPrompt,
  extensions,
  { aspectRatio: "16:9", resolution: "1080p" }
);

console.log(`Generated ${clips.length} clips, total ~${clips.length * 7 + 1} seconds`);
```

#### Extension Best Practices

From extension guides[39][40]:

```typescript
interface ExtensionGuidelines {
  bestFor: string[];
  avoidFor: string[];
  tips: string[];
}

const guidelines: ExtensionGuidelines = {
  bestFor: [
    "Continuous camera movements (fly-throughs, tracking shots, pans)",
    "Establishing shots (revealing environment gradually)",
    "Slow transformations (sunset progressing, fog rolling in)",
    "Ambient scenes (nature, cityscapes with gentle motion)"
  ],
  avoidFor: [
    "Complex dialogue scenes (quality degrades after 5-10 extensions)",
    "Fast-paced action (motion artifacts accumulate)",
    "Scenes requiring precise timing (hard to control exact moments)",
    "Character-focused narratives (identity drift increases with each hop)"
  ],
  tips: [
    "Describe continuity explicitly: 'continue the motion', 'maintain the same camera angle'",
    "Reference the previous shot's ending: 'continuing from the beach, camera now...'",
    "Keep lighting/style consistent across extensions to reduce drift",
    "Expect slight quality degradation after 10+ extensions",
    "Use extensions for B-roll and environment shots, not critical story moments"
  ]
};
```

#### Extension Input Constraints

```typescript
interface ExtensionConstraints {
  inputVideo: {
    source: string;
    maxLength: string;
    aspectRatio: string[];
    resolution: string;
  };
  output: {
    resolution: string;
    actualAddedDuration: string;
  };
}

const constraints: ExtensionConstraints = {
  inputVideo: {
    source: "Must be Veo-generated (cannot extend arbitrary uploaded videos)",
    maxLength: "≤141 seconds",
    aspectRatio: ["16:9", "9:16"],
    resolution: "720p minimum"
  },
  output: {
    resolution: "720p (even if original was 1080p)",
    actualAddedDuration: "~7 seconds per extension (8s generation, 1s overlap)"
  }
};
```

#### Handling Extension Seams

Sometimes extensions have visible "jumps" between clips. Mitigation strategies:

```typescript
async function smoothExtensionSeams(
  clips: string[],
  outputPath: string
): Promise<void> {
  // Use ffmpeg to apply cross-fade transitions between clips
  const ffmpegCommand = `
    ffmpeg -i ${clips[0]} -i ${clips[1]} -i ${clips[2]} \\
    -filter_complex "
      [0:v]fade=out:st=${(8 - 0.5)}:d=0.5[v0];
      [1:v]fade=in:st=0:d=0.5,fade=out:st=${(8 - 0.5)}:d=0.5[v1];
      [2:v]fade=in:st=0:d=0.5[v2];
      [v0][v1]xfade=transition=fade:duration=0.5:offset=${(8 - 0.5)}[vt1];
      [vt1][v2]xfade=transition=fade:duration=0.5:offset=${(16 - 0.5)}[vout]
    " -map "[vout]" -map 0:a ${outputPath}
  `;

  // Execute ffmpeg (pseudo-code, actual implementation would use child_process)
  console.log("Smoothing transitions with ffmpeg...");
  // await execAsync(ffmpegCommand);
}
```

### Pattern 6: JSON-Structured Prompting (Advanced)

The breakthrough technique of late 2025: JSON prompts provide 300%+ improvement over text prompts[41][42].

#### Why JSON Prompting

Traditional text prompts:
- Ambiguous structure
- Hard to iterate on specific elements
- Difficult to maintain consistency
- No clear separation of concerns

JSON prompts:
- Explicit structure for every parameter
- Easy to modify specific fields
- Version-controllable
- Reproducible
- Enables programmatic generation

#### Complete JSON Schema

```typescript
interface VeoJSONPrompt {
  version: "veo-3.1";
  output: {
    duration_sec: 4 | 6 | 8;
    fps: 24;
    resolution: "720p" | "1080p";
  };
  global_style: {
    look: string;        // Overall aesthetic (e.g., "cinematic", "documentary", "commercial")
    color: string;       // Color palette and grading
    mood: string;        // Emotional atmosphere
    safety: string;      // Brand-safe guidelines
  };
  continuity: {
    characters: Array<{
      id: string;
      description: string;
      wardrobe: string;
      personality?: string;
    }>;
    props: string[];
    lighting: string;    // Consistent lighting approach
  };
  scenes: Array<{
    id: string;
    start: number;       // Start time in seconds
    end: number;         // End time in seconds
    shot: {
      type: string;      // Camera movement type
      framing: string;   // How subject is framed
      camera: string;    // Camera characteristics
      movement: string;  // Detailed movement description
      lens: string;      // Lens type and properties
    };
    action: string;      // What happens in the shot
    environment: string; // Setting and background
    lighting: string;    // Specific lighting for this shot
    audio: {
      dialogue?: string;
      sfx: string[];
      ambient: string[];
      music?: string;
    };
  }>;
  negative_prompt: string[];
  notes: string[];       // Additional guidance for the model
}
```

#### Full JSON Prompt Example

```typescript
const jsonPrompt: VeoJSONPrompt = {
  version: "veo-3.1",
  output: {
    duration_sec: 8,
    fps: 24,
    resolution: "1080p"
  },
  global_style: {
    look: "Cinematic commercial, professional production quality",
    color: "Warm tones, golden hour palette, high contrast, rich saturation",
    mood: "Uplifting, aspirational, intimate yet professional",
    safety: "Brand-safe, no text overlays, no logos, appropriate for all audiences"
  },
  continuity: {
    characters: [
      {
        id: "hero",
        description: "Woman in her early 30s, shoulder-length wavy black hair, warm expressive brown eyes",
        wardrobe: "Green bomber jacket over white shirt, gold hoop earrings, minimal makeup",
        personality: "Confident yet approachable, genuine smile, relaxed body language"
      }
    ],
    props: [
      "Ceramic coffee mug (white with subtle texture)",
      "Hardcover book with worn cover",
      "Wooden table (natural oak finish)"
    ],
    lighting: "Soft natural window light from camera-left creating gentle shadows and rim light"
  },
  scenes: [
    {
      id: "s1",
      start: 0.0,
      end: 8.0,
      shot: {
        type: "dolly-in",
        framing: "Medium close-up (shoulders to top of head)",
        camera: "Smooth gimbal movement, professional stabilization",
        movement: "Slow push from medium shot (waist up) to close-up (shoulders up) over full 8 seconds",
        lens: "50mm equivalent, f/2.8 for shallow depth of field, bokeh effect on background"
      },
      action: "Character sits at corner cafe table, absorbed in reading a hardcover book. At 2-second mark, she turns a page. At 5-second mark, she looks up from book, makes direct eye contact with camera, and forms a genuine warm smile. At 6.5 seconds, she glances back down at book briefly before looking back up at 7.5 seconds with a slight head tilt.",
      environment: "Corner table by large window in cozy independent coffee shop. Blurred cafe patrons in soft-focus background create depth without distraction. Bokeh light streaks from background window lights. Warm wood tones, plants on windowsill, artisanal aesthetic.",
      lighting: "Primary: Soft afternoon sunlight through window camera-left (key light) creates gentle rim light on hair and left side of face. Fill: Ambient warm interior cafe lighting from camera-right balances cooler window light. Backlight: Subtle glow from background creates separation from environment. Shadows are soft and natural, defining facial features without harshness.",
      audio: {
        dialogue: "", // No spoken dialogue in this shot
        sfx: [
          "Soft page turn sound at 2-second mark (paper rustling)",
          "Ceramic mug set down gently on wooden table at 6-second mark (light ceramic-on-wood contact)"
        ],
        ambient: [
          "Quiet cafe conversation murmur (distant, unintelligible, creates atmosphere without distraction)",
          "Espresso machine hissing occasionally in background (2-3 seconds duration, mid-volume)",
          "Acoustic guitar instrumental music, soft and warm, folk-inspired melody"
        ],
        music: "Gentle acoustic guitar melody, 80-100 BPM, warm and inviting, ducked -12dB under sound effects and ambient, creates emotional foundation without overwhelming"
      }
    }
  ],
  negative_prompt: [
    "text overlays",
    "subtitles",
    "captions",
    "watermarks",
    "logos",
    "brand names",
    "blurry footage",
    "low-resolution",
    "cartoonish",
    "animated",
    "harsh shadows",
    "neon colors",
    "oversaturated",
    "extra fingers",
    "distorted faces",
    "unnatural skin tones",
    "camera shake",
    "abrupt movements"
  ],
  notes: [
    "Prioritize the natural eye contact moment at 5 seconds - this is the emotional peak",
    "Ensure dolly movement is perfectly smooth and steady throughout",
    "Audio layers: ambient sounds lowest volume, SFX clear and distinct, music subtle emotional undertone",
    "Character should appear relaxed and genuine, not posed or artificial",
    "Background cafe activity should be visible but not distracting",
    "Maintain shallow depth of field throughout to keep focus on character"
  ]
};
```

#### Generating from JSON

```typescript
async function generateFromJSON(
  jsonPrompt: VeoJSONPrompt,
  referenceImages?: string[]
): Promise<string> {
  const ai = new GoogleGenAI({});

  // Serialize JSON to string for Veo
  const promptString = JSON.stringify(jsonPrompt, null, 2);

  // Prepare reference images if provided
  const refs = referenceImages?.map(path => ({
    bytesBase64Encoded: fs.readFileSync(path, "base64"),
    mimeType: "image/jpeg",
    type: "asset" as const
  }));

  // Generate with JSON prompt
  let operation = await ai.models.generateVideos({
    model: "veo-3.1-generate-preview",
    prompt: `Generate video from this structured JSON specification:\n\n${promptString}`,
    ...(refs && { referenceImages: refs }),
    config: {
      aspectRatio: "16:9",
      durationSeconds: jsonPrompt.output.duration_sec,
      resolution: jsonPrompt.output.resolution,
      generateAudio: true,
      negativePrompt: jsonPrompt.negative_prompt.join(", ")
    }
  });

  // Poll for completion
  while (!operation.done) {
    await new Promise(resolve => setTimeout(resolve, 10000));
    operation = await ai.operations.getVideosOperation({ operation });
  }

  // Download result
  const outputPath = `output/json-${Date.now()}.mp4`;
  await ai.files.download({
    file: operation.response.generatedVideos[0].video,
    downloadPath: outputPath
  });

  return outputPath;
}

// Generate the video
const outputPath = await generateFromJSON(jsonPrompt, [
  "refs/character-front.jpg",
  "refs/character-profile.jpg"
]);

console.log(`Video generated: ${outputPath}`);
```

#### JSON Prompt Builder Utility

```typescript
class VeoJSONBuilder {
  private prompt: Partial<VeoJSONPrompt> = {
    version: "veo-3.1",
    scenes: [],
    negative_prompt: [
      "text overlays", "subtitles", "captions", "blurry",
      "low-resolution", "distorted faces"
    ],
    notes: []
  };

  setOutput(duration: 4 | 6 | 8, resolution: "720p" | "1080p"): this {
    this.prompt.output = { duration_sec: duration, fps: 24, resolution };
    return this;
  }

  setGlobalStyle(look: string, color: string, mood: string): this {
    this.prompt.global_style = {
      look,
      color,
      mood,
      safety: "Brand-safe, no text overlays, appropriate for all audiences"
    };
    return this;
  }

  addCharacter(id: string, description: string, wardrobe: string): this {
    if (!this.prompt.continuity) {
      this.prompt.continuity = { characters: [], props: [], lighting: "" };
    }
    this.prompt.continuity.characters.push({ id, description, wardrobe });
    return this;
  }

  addScene(scene: VeoJSONPrompt['scenes'][0]): this {
    this.prompt.scenes!.push(scene);
    return this;
  }

  addNegativePrompt(...terms: string[]): this {
    this.prompt.negative_prompt!.push(...terms);
    return this;
  }

  addNote(note: string): this {
    this.prompt.notes!.push(note);
    return this;
  }

  build(): VeoJSONPrompt {
    return this.prompt as VeoJSONPrompt;
  }
}

// Example usage
const builder = new VeoJSONBuilder()
  .setOutput(8, "1080p")
  .setGlobalStyle(
    "Cinematic commercial quality",
    "Warm golden hour tones, high contrast",
    "Uplifting and aspirational"
  )
  .addCharacter(
    "hero",
    "Woman in her 30s, shoulder-length black hair",
    "Green bomber jacket, white shirt"
  )
  .addScene({
    id: "s1",
    start: 0,
    end: 8,
    shot: {
      type: "dolly-in",
      framing: "Medium close-up",
      camera: "Smooth gimbal",
      movement: "Slow push from medium to close-up",
      lens: "50mm, f/2.8, shallow DOF"
    },
    action: "Character reads, looks up at 5s, smiles warmly",
    environment: "Cozy cafe, window light, warm atmosphere",
    lighting: "Soft window light from left, warm interior fill",
    audio: {
      sfx: ["Page turn at 2s"],
      ambient: ["Cafe chatter", "Espresso machine", "Acoustic guitar"],
    }
  })
  .addNote("Prioritize eye contact at 5-second mark")
  .build();

const videoPath = await generateFromJSON(builder);
```

## Anti-Patterns & Pitfalls

### ❌ Don't: Neglect "No Subtitles" Directive

```typescript
// BAD: Missing subtitle suppression
const badPrompt = `A woman says: "Welcome to our store!" Smiling, friendly tone.`;
// Result: Veo generates poorly-spelled subtitles burned into video
```

**Why it's wrong**: Veo was trained on YouTube videos with baked-in subtitles, so it frequently adds them automatically with incorrect spelling[43].

### ✅ Instead: Always Suppress Subtitles

```typescript
// GOOD: Explicit suppression
const goodPrompt = `A woman says: "Welcome to our store!" Smiling, friendly tone.
No subtitles, no text overlay, no captions.`;
```

### ❌ Don't: Use Conflicting Camera Movements

```typescript
// BAD: Multiple competing movements
const badPrompt = `Dolly-in while panning left and zooming out on a character...`;
// Result: Muddy, unfocused motion or model averaging to something generic
```

**Why it's wrong**: Veo struggles with multiple simultaneous camera operations[44].

### ✅ Instead: Choose One Primary Movement

```typescript
// GOOD: Single, clear camera action
const goodPrompt = `Slow dolly-in on a character standing in a doorway. Camera
physically moves closer over 8 seconds, starting from wide shot and ending on
close-up. Smooth, steady gimbal movement.`;
```

### ❌ Don't: Forget to Re-State Character Identity

```typescript
// BAD: Vague reference to previous shot
const shot1 = `A woman in a cafe`;
const shot2 = `The same woman in an office`; // "Same" is too vague!
```

**Why it's wrong**: Each generation is independent; "same woman" will result in different-looking characters[45].

### ✅ Instead: Repeat Full Description Every Time

```typescript
// GOOD: Explicit identity anchors
const characterDesc = "Woman in her early 30s, shoulder-length wavy black hair, green bomber jacket, gold hoop earrings";

const shot1 = `${characterDesc} sits at a cafe table reading. Soft window light.`;
const shot2 = `${characterDesc} presents in an office. Bright professional lighting.`;
// Also use reference images for best results
```

### ❌ Don't: Overload Audio with Too Many Elements

```typescript
// BAD: Audio soup - too many competing sounds
const badAudio = `Ambient sounds: traffic, construction, sirens, car horns, people
talking, music playing, dogs barking, helicopter overhead, train passing, church
bells, wind, rain, thunder...`;
// Result: Muddy, overwhelming audio where nothing is clear
```

**Why it's wrong**: More than 5-6 ambient elements create "audio mud" where sounds compete[46].

### ✅ Instead: Prioritize and Layer Audio Strategically

```typescript
// GOOD: Focused audio design with clear hierarchy
const goodAudio = `Ambient sounds (background, low volume): Distant traffic hum,
occasional car horn. Sound effects (mid-volume, clear): Footsteps on pavement,
door opening at 3-second mark. Music (subtle, -12dB): Upbeat jazz, ducks under
dialogue.`;
// Result: Clear, immersive audio with distinct layers
```

### ❌ Don't: Use Generic, Vague Descriptions

```typescript
// BAD: Vague and unmemorable
const badPrompt = `A person in a room. Nice lighting. Cool atmosphere.`;
// Result: Generic, unpredictable output
```

**Why it's wrong**: Vague terms like "nice" or "cool" force the model to guess[47].

### ✅ Instead: Be Cinematically Specific

```typescript
// GOOD: Precise visual language
const goodPrompt = `A detective in a dimly lit office, illuminated only by a green
banker's lamp on the desk. Film noir aesthetic, high contrast shadows, dramatic
chiaroscuro lighting. Smoke from cigarette creates atmosphere in the light beam.
1940s period detail.`;
```

## General Prompting Tips

### Optimal Prompt Length

Aim for **100-150 words** or **3-6 sentences**[48]:

```typescript
interface PromptLengthGuidelines {
  tooShort: string;     // <50 words
  optimal: string;      // 100-150 words
  tooLong: string;      // >200 words
}

const examples: PromptLengthGuidelines = {
  tooShort: "A woman in a cafe.",
  // Risks: Generic output, model fills in details randomly

  optimal: `Slow dolly-in shot. A woman in her 30s, shoulder-length wavy black hair,
green bomber jacket, sits at a cafe table reading a book. She looks up at the
camera at 5-second mark and smiles warmly. Soft afternoon sunlight streams through
the window creating gentle shadows. Ambient cafe sounds: quiet conversation murmur,
espresso machine hissing, acoustic guitar music. Cinematic, warm color grading,
35mm film aesthetic. No subtitles, no text overlay.`,
  // Perfect balance: Enough detail for control, concise enough to parse

  tooLong: "A woman sits at a table in a cafe... (continues for 300 words)",
  // Risks: Model confusion, trying to do too much, losing focus
};
```

### Prompt Structure Template

```typescript
interface PromptStructure {
  opening: string;      // Camera movement and shot type
  subject: string;      // Who/what is the focus
  action: string;       // What happens
  environment: string;  // Where it takes place
  lighting: string;     // How it's lit
  audio: string;        // Sound design
  style: string;        // Overall aesthetic
  closing: string;      // Suppression directives
}

function buildStructuredPrompt(p: PromptStructure): string {
  return `${p.opening}. ${p.subject} ${p.action}. ${p.environment}. ${p.lighting}.
${p.audio}. ${p.style}. ${p.closing}`;
}

// Example
const prompt = buildStructuredPrompt({
  opening: "Tracking shot from the side, camera moves parallel to subject",
  subject: "A runner in athletic gear",
  action: "jogs along a coastal path, breathing steadily, focused expression",
  environment: "Ocean cliffside trail at sunrise, waves crashing below, rugged coastline",
  lighting: "Golden hour sidelight, warm tones, long shadows, high contrast",
  audio: "Ocean waves crashing, seabirds calling, rhythmic breathing, footsteps on gravel path",
  style: "Inspirational commercial aesthetic, cinematic, aspirational mood",
  closing: "No subtitles, no text overlay"
});
```

### Keywords That Trigger Better Results

From prompting research[49][50]:

```typescript
const powerKeywords = {
  cinematography: [
    "dolly-in", "dolly-out", "crane shot", "tracking shot",
    "rack focus", "vertigo effect", "Dutch angle"
  ],
  lighting: [
    "golden hour", "blue hour", "chiaroscuro", "rim light",
    "three-point lighting", "dramatic side lighting", "soft diffused"
  ],
  lensAndCamera: [
    "35mm lens", "50mm equivalent", "shallow depth of field",
    "bokeh effect", "gimbal stabilized", "handheld"
  ],
  mood: [
    "cinematic", "noir", "aspirational", "intimate",
    "suspenseful", "uplifting", "melancholic"
  ],
  filmReferences: [
    "35mm film aesthetic", "vintage film look", "documentary style",
    "professional commercial", "music video quality"
  ],
  audioDescriptors: [
    "ducks under dialogue", "ambient murmur", "occasional",
    "distant", "clear", "rhythmic", "synchronized"
  ]
};
```

### Common Mistakes to Avoid

```typescript
interface CommonMistakes {
  mistake: string;
  why: string;
  fix: string;
}

const mistakes: CommonMistakes[] = [
  {
    mistake: "Mixing mutually exclusive cues (e.g., 'dark noir' + 'bright sunny')",
    why: "Model averages opposites, resulting in muddy look or confused motion",
    fix: "Choose one consistent aesthetic and stick to it throughout the prompt"
  },
  {
    mistake: "Forgetting to specify camera position",
    why: "Default camera placement is often generic or inappropriate",
    fix: "Always specify: 'Camera positioned at eye level', 'Low angle looking up', etc."
  },
  {
    mistake: "Using instructive language in negative prompts ('no walls', 'don't show')",
    why: "Model may misinterpret; Google recommends descriptive lists instead",
    fix: "List unwanted elements directly: 'walls, text, captions, blurry'"
  },
  {
    mistake: "Packing too much action into 8 seconds",
    why: "Rushed pacing, unclear storytelling, motion artifacts",
    fix: "Focus on ONE key moment or beat per clip; use extensions for complex sequences"
  },
  {
    mistake: "Ignoring the final second of clips (for extensions)",
    why: "Extensions anchor on final second; bad composition there ruins continuity",
    fix: "Design clips with extensions in mind; ensure final frame has good composition"
  }
];
```

### Cost Optimization Strategy

```typescript
interface CostStrategy {
  development: {
    model: string;
    resolution: string;
    audio: boolean;
    estimatedCost: string;
  };
  production: {
    model: string;
    resolution: string;
    audio: boolean;
    estimatedCost: string;
  };
}

const strategy: CostStrategy = {
  development: {
    model: "veo-3.1-fast-generate-preview",
    resolution: "720p",
    audio: false,
    estimatedCost: "$0.10/sec = $0.80 per 8-second clip"
  },
  production: {
    model: "veo-3.1-generate-preview",
    resolution: "1080p",
    audio: true,
    estimatedCost: "$0.75/sec = $6.00 per 8-second clip"
  }
};

// Workflow: Iterate with Fast model, finalize with standard
async function costOptimizedWorkflow(prompt: string): Promise<string> {
  const isDev = process.env.NODE_ENV === "development";

  const model = isDev
    ? strategy.development.model
    : strategy.production.model;

  const config = {
    aspectRatio: "16:9" as const,
    durationSeconds: 8 as const,
    resolution: isDev ? strategy.development.resolution : strategy.production.resolution,
    generateAudio: isDev ? strategy.development.audio : strategy.production.audio
  };

  console.log(`Using ${model} - Estimated cost: ${
    isDev ? strategy.development.estimatedCost : strategy.production.estimatedCost
  }`);

  // Generate video...
  // (implementation from previous patterns)
}
```

## Caveats

### Caveat 1: Character Consistency Has Limits

**Reality Check**: Even with 3 reference images and explicit prompts, characters can look like "close relatives" rather than "identical twins" across shots with different lighting, angles, or contexts[51].

**Workaround**:
- Keep lighting consistent
- Avoid extreme angle changes
- Use color grading in post to unify appearance
- Accept "family resemblance" as the current state of the art

### Caveat 2: JSON Prompting Is Still Experimental

**Reality Check**: JSON prompting is a community-discovered technique, not officially documented by Google. Support may vary[52].

**Workaround**:
- Test JSON prompts thoroughly
- Have fallback text prompts ready
- Monitor for API changes that might break JSON parsing
- Join community forums (Reddit r/VeoAI, Discord servers) for latest techniques

### Caveat 3: Audio Generation Can't Be Fully Controlled

**Reality Check**: While you can guide audio with descriptions, you can't specify exact frequencies, specific music tracks, or precise timing beyond rough descriptions[53].

**Workaround**:
- Generate video with audio as a guide
- Replace audio in post-production with professional sound design
- Use generateAudio: false and add audio separately for full control

### Caveat 4: Extensions Accumulate Quality Degradation

**Reality Check**: After 10+ extensions (~70+ seconds), visual quality and coherence decline noticeably[54].

**Workaround**:
- Limit extensions to 5-7 for critical content
- Use extensions primarily for B-roll and ambient shots
- Generate separate clips and edit together in post for longer narratives
- Accept that 148-second max is theoretical; practical limit is ~60-70 seconds

### Caveat 5: Cost Accumulates Rapidly

**Reality Check**: At $0.75/second with audio, creating a 60-second commercial with multiple takes costs $45-$90+ per clip[55].

**Workaround**:
- Use the Fast model ($0.15/sec) for all iterations
- Only generate final renders with premium model
- Disable audio during development (saves 33%)
- Plan shots carefully to minimize re-generation

### Caveat 6: Safety Filters Are Aggressive and Opaque

**Reality Check**: Veo blocks not just obvious NSFW content but also artistic depictions, certain cultural references, and sometimes innocuous prompts misclassified as problematic[56]. There's no appeal process.

**Workaround**:
- Test prompts incrementally (build up detail to find what triggers blocks)
- Use generic descriptions instead of specific names/brands
- Have fallback prompts ready
- Consider alternative models (Runway, Kling) for edgier content

### Caveat 7: No Frame-Level Control

**Reality Check**: You can't specify "at exactly 3.5 seconds, the character should turn"—timing is approximate at best[57].

**Workaround**:
- Use relative timing descriptions: "early in the clip," "halfway through"
- Generate shorter clips (4 seconds) for more predictable timing
- Iterate multiple times to get desired timing
- Edit in post to trim to exact moments

## References

[1] [Google Veo 3.1: The Ultimate Guide to AI Video Generation in 2025](https://www.voxfor.com/google-veo-3-the-ultimate-guide-to-ai-video-generation-in-2025/) - Overview of Veo 3.1 capabilities and specifications

[2] [How to Prompt for Speaking (Lip‑Synced Dialogue) in Google Veo 3](https://skywork.ai/blog/how-to-prompt-lip-synced-dialogue-google-veo-3/) - Lip-sync accuracy metrics

[3] [Google Veo 3 Prompting Best Practices: The Complete Professional Guide (2025)](https://superprompt.com/blog/veo3-prompting-best-practices) - JSON prompting breakthrough

[4] [Google Veo 3 & 3.1: Complete Guide to Pricing, Access & Features [2025]](https://ai-basics.com/veo-3-faq/) - Technical specifications

[5] [Veo on Vertex AI video generation prompt guide](https://docs.cloud.google.com/vertex-ai/generative-ai/docs/video/video-gen-prompt-guide) - Official Google documentation on camera movements

[6] [Veo 3.1 Pricing & Access (2025)](https://skywork.ai/blog/veo-3-1-pricing-access-2025/) - Pricing details

[7] [Ultimate prompting guide for Veo 3.1 | Google Cloud Blog](https://cloud.google.com/blog/products/ai-machine-learning/ultimate-prompting-guide-for-veo-3-1) - Five-part prompt formula

[8] [Veo 3: A Detailed Prompting Guide](https://medium.com/google-cloud/veo-3-a-detailed-prompting-guide-867985b46018) - Mental model for Veo

[9] [26 Essential Veo 3.1 Prompt Patterns (2025)](https://skywork.ai/blog/veo-3-1-prompt-patterns-shot-lists-camera-moves-lighting-cues/) - Word ordering importance

[10] [How to Get Matching Soundscapes with Audio-Aware Prompting in Veo 3.1](https://skywork.ai/blog/how-to-audio-aware-prompting-veo-3-1-guide/) - Native audio generation

[11] [Veo 3.1 Multi-Prompt Storytelling Best Practices (2025)](https://skywork.ai/blog/multi-prompt-multi-shot-consistency-veo-3-1-best-practices/) - Independent generation per shot

[12] [18 Essential Google Veo 3 Prompt Examples (2025)](https://skywork.ai/blog/google-veo-3-prompt-examples-2025/) - Show, don't tell principle

[13] [Extend Veo on Vertex AI-generated videos](https://cloud.google.com/vertex-ai/generative-ai/docs/video/extend-a-veo-video) - Temporal anchoring mechanics

[14] [Veo on Vertex AI video generation prompt guide](https://docs.cloud.google.com/vertex-ai/generative-ai/docs/video/video-gen-prompt-guide) - Official camera movement documentation

[15] [26 Essential Veo 3.1 Prompt Patterns (2025)](https://skywork.ai/blog/veo-3-1-prompt-patterns-shot-lists-camera-moves-lighting-cues/) - Camera movement guidelines

[16] [18 Best Veo 3 Prompts (2025)](https://skywork.ai/blog/best-veo-3-prompts-2025/) - Camera prompting best practices

[17] [[2025 Guide] How to Prompt for Speaking in Veo 3](https://nutstudio.imyfone.com/llm-tips/veo-3-promts/) - Lip-sync accuracy

[18] [How to Prompt for Speaking (Lip‑Synced Dialogue) in Google Veo 3](https://skywork.ai/blog/how-to-prompt-lip-synced-dialogue-google-veo-3/) - Dialogue formatting with colons

[19] [[2025 Guide] How to Prompt for Speaking in Veo 3](https://nutstudio.imyfone.com/llm-tips/veo-3-promts/) - Dialogue length guidelines

[20] [Google Veo 3 Prompting Best Practices](https://superprompt.com/blog/veo3-prompting-best-practices) - Voice guidance techniques

[21] [How to Get Matching Soundscapes with Audio-Aware Prompting in Veo 3.1](https://skywork.ai/blog/how-to-audio-aware-prompting-veo-3-1-guide/) - Layered audio design

[22] [How to Get Matching Soundscapes with Audio-Aware Prompting in Veo 3.1](https://skywork.ai/blog/how-to-audio-aware-prompting-veo-3-1-guide/) - Audio precision vs. vagueness

[23] [[2025 Guide] How to Prompt for Speaking in Veo 3](https://nutstudio.imyfone.com/llm-tips/veo-3-promts/) - Implicit vs. explicit dialogue

[24] [How to prompt Veo 3 for the best results – Replicate blog](https://replicate.com/blog/using-and-prompting-veo-3) - Subtitle suppression

[25] [Direct Veo video generation using a reference image](https://cloud.google.com/vertex-ai/generative-ai/docs/video/use-reference-images-to-guide-video-generation) - Reference image system

[26] [Veo on Vertex AI video generation API](https://docs.cloud.google.com/vertex-ai/generative-ai/docs/model-reference/veo-video-generation) - Reference image types

[27] [Veo on Vertex AI video generation API](https://docs.cloud.google.com/vertex-ai/generative-ai/docs/model-reference/veo-video-generation) - Style reference limitations

[28] [Google Veo 3.1 Review (2025): Does It Nail Character Consistency?](https://skywork.ai/blog/google-veo-3-1-2025-character-consistency-review/) - Reference image preparation

[29] [Veo 3.1 Multi-Prompt Storytelling Best Practices (2025)](https://skywork.ai/blog/multi-prompt-multi-shot-consistency-veo-3-1-best-practices/) - Character consistency techniques

[30] [Google Veo 3.1 Review (2025): Does It Nail Character Consistency?](https://skywork.ai/blog/google-veo-3-1-2025-character-consistency-review/) - Consistency challenges

[31] [Veo 3.1 Multi-Prompt Storytelling Best Practices (2025)](https://skywork.ai/blog/multi-prompt-multi-shot-consistency-veo-3-1-best-practices/) - What breaks consistency

[32] [Google Veo 3.1 Review (2025)](https://skywork.ai/blog/google-veo-3-1-2025-character-consistency-review/) - "Cousins not twins" observation

[33] [Veo 3.1 Multi-Prompt Storytelling Best Practices (2025)](https://skywork.ai/blog/multi-prompt-multi-shot-consistency-veo-3-1-best-practices/) - Identity anchor technique

[34] [Veo 3 Character consistency, a multi-modal, forensically-inspired approach](https://medium.com/google-cloud/veo-3-character-consistency-a-multi-modal-forensically-inspired-approach-972e4c1ceae5) - Identity drift analysis

[35] [How to Extend a Scene in Veo 3.1: Seamless Style-Match Guide](https://skywork.ai/blog/how-to-extend-veo-3-1-scene-guide/) - Scene extension overview

[36] [Extend Veo on Vertex AI-generated videos](https://cloud.google.com/vertex-ai/generative-ai/docs/video/extend-a-veo-video) - Official extension documentation

[37] [Extend Veo on Vertex AI-generated videos](https://cloud.google.com/vertex-ai/generative-ai/docs/video/extend-a-veo-video) - Maximum extension count

[38] [Extend Veo on Vertex AI-generated videos](https://cloud.google.com/vertex-ai/generative-ai/docs/video/extend-a-veo-video) - Extension anchoring mechanism

[39] [How to Extend a Scene in Veo 3.1](https://skywork.ai/blog/how-to-extend-veo-3-1-scene-guide/) - Extension best practices

[40] [Flow Scenebuilder Extend Shots](https://digiwebinsight.com/flow-scenebuilder-extend-shots/) - Extension use cases

[41] [7 Incredible Google Veo 3 JSON Prompt Examples](https://jzcreates.com/blog/7-incredible-google-veo-3-json-prompt-examples/) - JSON prompting discovery

[42] [JSON Prompting Guide for Veo 3 | ImagineArt](https://www.imagine.art/blogs/veo-3-json-prompting-guide) - JSON prompting benefits

[43] [How to prompt Veo 3 for the best results](https://replicate.com/blog/using-and-prompting-veo-3) - Subtitle generation issue

[44] [26 Essential Veo 3.1 Prompt Patterns (2025)](https://skywork.ai/blog/veo-3-1-prompt-patterns-shot-lists-camera-moves-lighting-cues/) - Camera movement conflicts

[45] [Veo 3.1 Multi-Prompt Storytelling Best Practices (2025)](https://skywork.ai/blog/multi-prompt-multi-shot-consistency-veo-3-1-best-practices/) - Character re-description necessity

[46] [How to Get Matching Soundscapes with Audio-Aware Prompting in Veo 3.1](https://skywork.ai/blog/how-to-audio-aware-prompting-veo-3-1-guide/) - Audio mud problem

[47] [18 Essential Google Veo 3 Prompt Examples (2025)](https://skywork.ai/blog/google-veo-3-prompt-examples-2025/) - Specificity importance

[48] [Google Veo 3 Prompting Best Practices](https://superprompt.com/blog/veo3-prompting-best-practices) - Optimal prompt length

[49] [18 Best Veo 3 Prompts (2025)](https://skywork.ai/blog/best-veo-3-prompts-2025/) - Power keywords

[50] [Ultimate prompting guide for Veo 3.1](https://cloud.google.com/blog/products/ai-machine-learning/ultimate-prompting-guide-for-veo-3-1) - Effective terminology

[51] [Google Veo 3.1 Review (2025)](https://skywork.ai/blog/google-veo-3-1-2025-character-consistency-review/) - Character consistency limits

[52] [7 Incredible Google Veo 3 JSON Prompt Examples](https://jzcreates.com/blog/7-incredible-google-veo-3-json-prompt-examples/) - JSON experimental status

[53] [How to Get Matching Soundscapes with Audio-Aware Prompting in Veo 3.1](https://skywork.ai/blog/how-to-audio-aware-prompting-veo-3-1-guide/) - Audio control limitations

[54] [How to Extend a Scene in Veo 3.1](https://skywork.ai/blog/how-to-extend-veo-3-1-scene-guide/) - Extension quality degradation

[55] [Veo 3.1 Pricing & Access (2025)](https://skywork.ai/blog/veo-3-1-pricing-access-2025/) - Cost accumulation

[56] [10 Most Common Veo 3.1 Prompting Mistakes (2025) & How to Fix Them](https://skywork.ai/blog/veo-3-1-prompting-mistakes-fixes/) - Safety filter issues

[57] [Introducing Veo 3.1 and new creative capabilities in the Gemini API](https://developers.googleblog.com/en/introducing-veo-3-1-and-new-creative-capabilities-in-the-gemini-api/) - Frame control capabilities
