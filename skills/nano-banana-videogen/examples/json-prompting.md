# JSON-Structured Prompting (Advanced)

**Status**: Experimental community-discovered technique
**Benefit**: 300%+ improvement in consistency and quality over traditional text prompts

## What is JSON Prompting?

JSON prompting is an advanced technique where you structure your video prompt as a JSON object instead of free-form text. This provides:

- **Explicit structure** for every parameter
- **Easy iteration** on specific elements
- **Version control** friendly
- **Reproducible** results
- **Programmatic generation** capability

## When to Use JSON Prompting

✅ **Use JSON prompting for:**
- Complex multi-element scenes
- Precise control over timing and camera movements
- Maintaining consistency across multiple shots
- Collaborative projects where prompts need to be shared/versioned
- Iterating on specific aspects without rewriting entire prompts

❌ **Use traditional text prompts for:**
- Quick test generations
- Simple single-subject scenes
- When learning Veo's capabilities
- When prompts are under 100 words

## JSON Prompt Schema

The basic structure of a JSON prompt:

```json
{
  "version": "veo-3.1",
  "output": {
    "duration_sec": 8,
    "fps": 24,
    "resolution": "1080p"
  },
  "global_style": {
    "look": "Overall aesthetic description",
    "color": "Color palette and grading",
    "mood": "Emotional atmosphere"
  },
  "continuity": {
    "characters": [
      {
        "id": "character_id",
        "description": "Physical appearance",
        "wardrobe": "Clothing details"
      }
    ],
    "props": ["List of important objects"],
    "lighting": "Consistent lighting approach"
  },
  "scenes": [
    {
      "timing": "Timeframe description",
      "camera": {
        "movement": "Camera motion type",
        "shot_type": "Framing description",
        "lens": "Lens characteristics"
      },
      "subject": {
        "character_id": "character_id",
        "action": "What they're doing",
        "expression": "Facial expression/emotion"
      },
      "environment": "Location and setting",
      "lighting": "Specific lighting for this scene",
      "audio": {
        "dialogue": "Character says: 'Exact words'",
        "sfx": ["Sound effects with timing"],
        "ambient": ["Background sounds"],
        "music": "Music description (optional)"
      }
    }
  ],
  "negative_prompt": ["Things to avoid"],
  "notes": ["Additional guidance"]
}
```

## Complete Examples

### Example 1: Product Commercial

Save this as `product-commercial.json`:

```json
{
  "version": "veo-3.1",
  "output": {
    "duration_sec": 8,
    "fps": 24,
    "resolution": "1080p"
  },
  "global_style": {
    "look": "Cinematic commercial quality, Apple-style minimalist aesthetic",
    "color": "Clean whites and silvers, high contrast, subtle blue tints",
    "mood": "Premium, sophisticated, aspirational"
  },
  "scenes": [
    {
      "timing": "0-8 seconds, smooth continuous motion",
      "camera": {
        "movement": "Slow 360-degree orbit around product over 8 seconds",
        "shot_type": "Medium close-up on product, shallow depth of field",
        "lens": "50mm equivalent, f/2.0 for creamy background bokeh"
      },
      "subject": {
        "object": "Sleek modern smartphone, silver aluminum frame, edge-to-edge display",
        "action": "Resting on white marble pedestal, screen shows abstract colorful gradient wallpaper",
        "details": "Reflections of studio lights visible on glossy screen surface"
      },
      "environment": "Infinity curve white studio background, minimalist, no visible horizon",
      "lighting": "Three-point lighting: key light top-left creating subtle shadow, soft fill from right, rim light from behind highlighting edges",
      "audio": {
        "sfx": [],
        "ambient": ["Subtle high-tech ambient hum"],
        "music": "Minimalist electronic soundtrack, subtle synth pad"
      }
    }
  ],
  "negative_prompt": [
    "text overlays",
    "logos",
    "subtitles",
    "fingerprints",
    "scratches",
    "dust",
    "people",
    "hands"
  ],
  "notes": [
    "Product must remain perfectly centered in frame throughout rotation",
    "Maintain consistent lighting as camera orbits",
    "Screen should be clearly visible at all angles",
    "Background must remain pure white infinity curve"
  ]
}
```

**Usage with nano-banana:**

```bash
# Save JSON to file first
nano-banana --video "Generate video from this structured JSON specification:

$(cat product-commercial.json)" \
--duration 8 \
--resolution 1080p \
--aspect 16:9 \
--no-audio \
--output product-orbit.mp4
```

### Example 2: Character Introduction with Dialogue

Save as `character-intro.json`:

```json
{
  "version": "veo-3.1",
  "output": {
    "duration_sec": 8,
    "fps": 24,
    "resolution": "1080p"
  },
  "global_style": {
    "look": "Cinematic commercial, professional production quality",
    "color": "Warm tones, golden hour palette, high contrast, rich saturation",
    "mood": "Uplifting, aspirational, intimate yet professional"
  },
  "continuity": {
    "characters": [
      {
        "id": "maya",
        "description": "Woman in her 30s, shoulder-length black hair in loose waves, warm brown eyes, friendly smile, South Asian features",
        "wardrobe": "Hunter green bomber jacket over cream turtleneck sweater, small gold hoop earrings"
      }
    ],
    "props": ["Hardcover book with navy blue cover", "Ceramic coffee cup, cream colored"],
    "lighting": "Soft window light from camera left, creating gentle rim lighting on hair"
  },
  "scenes": [
    {
      "timing": "0-8 seconds total duration",
      "camera": {
        "movement": "Slow dolly-in from medium shot to medium close-up over 8 seconds",
        "shot_type": "Starts at chest-up framing, ends at head-and-shoulders close-up",
        "lens": "85mm portrait lens equivalent, f/1.8 for shallow depth of field"
      },
      "subject": {
        "character_id": "maya",
        "action": "Sitting at cafe table, reading a book. At 2 seconds, turns a page. At 5 seconds, looks up from book making eye contact with camera. At 6 seconds, warm genuine smile spreads across face.",
        "expression": "Initially concentrated on reading, transitions to surprised recognition, then warm welcoming smile"
      },
      "environment": "Cozy neighborhood cafe, warm wood tables, soft leather chairs. Large window with natural light visible in soft-focus background. Other cafe patrons blurred in background bokeh.",
      "lighting": "Soft diffused window light from camera left creates gentle rim light on hair and shoulder. Warm interior cafe lighting fills shadows. Golden hour quality light, warm color temperature around 3500K.",
      "audio": {
        "dialogue": "Maya says: 'I've been waiting for you.' Warm, welcoming tone with slight smile in voice.",
        "sfx": ["Page turn at 2 seconds, soft rustle of paper", "Book placed down gently at 6 seconds"],
        "ambient": ["Quiet cafe murmur, conversational hum", "Distant espresso machine steaming milk", "Soft acoustic guitar music playing overhead"],
        "music": "Gentle indie acoustic guitar, supporting not overpowering, warm and intimate"
      }
    }
  ],
  "negative_prompt": [
    "subtitles",
    "text overlays",
    "captions",
    "blurry faces",
    "awkward expressions",
    "harsh lighting",
    "overexposed windows",
    "empty cafe (need background activity)"
  ],
  "notes": [
    "Prioritize the natural eye contact moment at 5 seconds - this is the emotional peak",
    "Ensure dolly movement is perfectly smooth and steady throughout",
    "Dialogue lip-sync is critical - 'I've been waiting for you' must match mouth movements precisely",
    "Audio layers: ambient sounds lowest volume, SFX clear and distinct, music subtle emotional undertone",
    "Character should appear relaxed and genuine, not posed or artificial",
    "Background cafe activity should be visible but not distracting",
    "Maintain shallow depth of field throughout to keep focus on character"
  ]
}
```

**Usage with nano-banana:**

```bash
nano-banana --video "Generate video from this structured JSON specification:

$(cat character-intro.json)" \
--duration 8 \
--resolution 1080p \
--aspect 16:9 \
--output character-intro.mp4
```

### Example 3: Nature Documentary Scene

Save as `nature-scene.json`:

```json
{
  "version": "veo-3.1",
  "output": {
    "duration_sec": 8,
    "fps": 24,
    "resolution": "1080p"
  },
  "global_style": {
    "look": "Planet Earth documentary quality, BBC Natural History Unit aesthetic",
    "color": "Rich natural colors, slight desaturation, earthy tones, morning light warmth",
    "mood": "Peaceful, contemplative, awe-inspiring"
  },
  "scenes": [
    {
      "timing": "0-8 seconds continuous motion",
      "camera": {
        "movement": "Slow pan right across the landscape, 60 degrees total over 8 seconds",
        "shot_type": "Wide establishing shot, everything in focus (deep depth of field)",
        "lens": "24mm wide-angle equivalent, f/8 for maximum depth of field"
      },
      "subject": {
        "object": "Mountain range at sunrise, snow-capped peaks emerging from morning mist",
        "action": "Static landscape, subtle mist movement in valley, sun rays breaking through clouds",
        "details": "Pine forest visible on lower slopes, distant eagle soaring at 5-second mark"
      },
      "environment": "Alpine mountain range, pristine wilderness, no human structures visible. Valley filled with morning mist below peaks. Clear blue sky above with few wispy clouds catching golden light.",
      "lighting": "Early morning golden hour, sun just breaking over horizon from camera right. Dramatic side-lighting on mountain peaks, long shadows in valleys. Warm 2800K color temperature on peaks, cool blue shadows in mist.",
      "audio": {
        "sfx": ["Eagle cry at 5 seconds, clear and distinct"],
        "ambient": [
          "Mountain wind, gentle breeze sounds",
          "Distant waterfall in valley",
          "Morning bird calls, varied species",
          "Subtle rustle of pine trees"
        ],
        "music": "Subtle orchestral swell, cellos and violins, building very gradually, majestic and understated"
      }
    }
  ],
  "negative_prompt": [
    "buildings",
    "people",
    "roads",
    "power lines",
    "aircraft",
    "text",
    "logos",
    "unnatural colors",
    "oversaturation"
  ],
  "notes": [
    "Camera movement must be perfectly smooth, tripod-stable pan",
    "Mist should have realistic volumetric quality, not flat or artificial",
    "Eagle should appear natural and distant, not cartoonish or too prominent",
    "Audio mix: ambient sounds should create immersive soundscape, music supporting not dominating",
    "Lighting should capture that brief golden hour quality before harsh daylight",
    "Maintain cinematic 2.39:1 letterbox feel even in 16:9 frame"
  ]
}
```

**Usage:**

```bash
nano-banana --video "Generate video from this structured JSON specification:

$(cat nature-scene.json)" \
--duration 8 \
--resolution 1080p \
--aspect 16:9 \
--output nature-documentary.mp4
```

## Benefits of JSON Prompting

### 1. Precision and Control

**Traditional text prompt:**
```
A woman sits in a cafe, reading a book, then looks up and smiles.
Golden hour lighting, cinematic, warm tones. Dolly in camera movement.
```

**JSON equivalent:**
- Specifies exact timing: "At 5 seconds, looks up"
- Separates camera, subject, lighting, and audio
- Explicit negative prompts
- Clear notes for the model

### 2. Easy Iteration

Want to change just the lighting? Modify the `lighting` field:

```bash
# Original
"lighting": "Soft window light from left"

# Updated for different mood
"lighting": "Harsh overhead fluorescent, stark shadows, film noir aesthetic"
```

The rest of the prompt remains unchanged.

### 3. Version Control

JSON prompts are perfect for git:

```bash
git add character-intro.json
git commit -m "Update character wardrobe from blue to green jacket"
git diff HEAD~1 character-intro.json  # See exactly what changed
```

### 4. Programmatic Generation

Generate prompts from templates:

```bash
#!/bin/bash

for color in "blue" "green" "red"; do
  cat template.json | \
  sed "s/JACKET_COLOR/$color/" | \
  nano-banana --video "$(cat -)" --output jacket-${color}.mp4
done
```

## Best Practices for JSON Prompting

### 1. Start with a Template

Create a base template and modify it rather than starting from scratch each time.

### 2. Be Specific in Notes

The `notes` array is where you can add nuanced guidance:

```json
"notes": [
  "Prioritize the eye contact moment - this is the emotional peak",
  "Background activity should be visible but not distracting",
  "Maintain shallow depth of field throughout"
]
```

### 3. Use Negative Prompts Aggressively

Always include common unwanted elements:

```json
"negative_prompt": [
  "subtitles",
  "text overlays",
  "captions",
  "blurry",
  "low-resolution",
  "distorted faces",
  "watermarks"
]
```

### 4. Structure Audio Layers

Separate audio into logical layers:

```json
"audio": {
  "dialogue": "Character dialogue with timing",
  "sfx": ["Specific sound effects with timing"],
  "ambient": ["Background environmental sounds"],
  "music": "Musical score description (optional)"
}
```

### 5. Include Timing Details

Be explicit about when things happen:

```json
"action": "At 2 seconds, turns a page. At 5 seconds, looks up. At 6 seconds, smiles."
```

## Limitations and Caveats

### 1. Experimental Feature

JSON prompting is a community-discovered technique, not officially documented by Google.

- **Risk**: May break in future API updates
- **Mitigation**: Have fallback text prompts ready
- **Benefit**: Works well as of December 2025

### 2. Not All Fields Are Guaranteed

Veo treats JSON as a structured text prompt, not as strict parameters.

- Some fields may have more influence than others
- The model still interprets content creatively
- Results may vary between generations

### 3. Verbose Prompts Can Be Costly

Longer prompts take more processing time (minor impact).

- Keep JSON concise where possible
- Don't duplicate information across fields
- Remove empty optional fields

## Converting Text Prompts to JSON

Take this text prompt:

```
Slow dolly-in on a woman reading in a cafe. She looks up at 5 seconds
and smiles. Golden hour lighting from window. Warm, cozy atmosphere.
Ambient cafe sounds. No subtitles.
```

Structured JSON version:

```json
{
  "version": "veo-3.1",
  "output": { "duration_sec": 8, "fps": 24, "resolution": "1080p" },
  "global_style": {
    "look": "Cinematic commercial quality",
    "color": "Warm golden hour tones",
    "mood": "Cozy and welcoming"
  },
  "scenes": [{
    "camera": {
      "movement": "Slow dolly-in over 8 seconds",
      "shot_type": "Medium shot to close-up"
    },
    "subject": {
      "character_id": "woman",
      "action": "Reading book, looks up at 5 seconds, smiles at 6 seconds"
    },
    "environment": "Cozy cafe interior",
    "lighting": "Golden hour window light from left",
    "audio": {
      "ambient": ["Cafe murmur", "Espresso machine", "Quiet music"]
    }
  }],
  "negative_prompt": ["subtitles", "text overlays"]
}
```

## Troubleshooting

### Issue: JSON syntax errors

**Solution**: Validate your JSON before using:

```bash
cat prompt.json | python3 -m json.tool
# or
cat prompt.json | jq .
```

### Issue: Results don't match JSON structure

**Remember**: Veo interprets JSON as structured text, not as strict parameters. Some creative interpretation is expected.

### Issue: Prompt too long for CLI

**Solution**: Use `--prompt-file` (if supported) or save to a file and use `$(cat file.json)`.

## Further Reading

- See `prompting-guide.md` for general prompting best practices
- See `dialogue-and-audio.md` for audio-specific guidance
- See `cinematic-shots.md` for camera movement examples

## Summary

JSON prompting provides:
- ✅ Better organization for complex prompts
- ✅ Easier iteration and version control
- ✅ More explicit control over scene elements
- ✅ 300%+ improvement in consistency (community reports)

But it's:
- ⚠️ Experimental (may change or break)
- ⚠️ More verbose than text prompts
- ⚠️ Not officially supported by Google

**Recommendation**: Use JSON prompting for complex, multi-element scenes where precision matters. Use traditional text prompts for quick iterations and simple scenes.
