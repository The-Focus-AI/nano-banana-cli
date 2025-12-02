# Video Prompting Guide

Comprehensive guide to crafting effective prompts for Google Veo video generation.

## The Five-Part Formula

Every effective video prompt contains these elements:

```
[Camera Movement] + [Subject] + [Action] + [Environment] + [Style/Audio]
```

**Example breakdown:**
```
Slow dolly-in shot.          # Camera Movement
A chef in professional whites # Subject
carefully plates a gourmet dish, precise movements  # Action
in a modern restaurant kitchen, stainless steel surfaces  # Environment
Soft overhead lighting, ambient kitchen sounds, no subtitles.  # Style/Audio
```

## Camera Movements

Use specific cinematography terms for precise control. Veo understands professional film terminology.

### Static Shot
No camera movement. Best for dialogue scenes or detailed subjects.

```
Static shot on tripod. A ceramic coffee cup sits on a wooden table,
steam rising from the hot liquid. Morning sunlight streams through
a nearby window. Shallow depth of field, 50mm lens. Peaceful atmosphere.
No camera movement.
```

### Pan (Horizontal Rotation)
Camera rotates left or right while position stays fixed.

```
Slow pan left across a city skyline at dusk. Camera rotates smoothly
from right to left, revealing towering skyscrapers silhouetted against
an orange sunset. 24mm wide-angle lens. Cinematic establishing shot.
8-second duration covering approximately 90 degrees.
```

### Tilt (Vertical Rotation)
Camera rotates up or down while position stays fixed.

```
Tilt down from a character's shocked face to the letter in their hands.
Camera starts on a tight close-up of wide eyes, then smoothly tilts
downward to show hands holding a crumpled envelope. Dramatic lighting,
high contrast. Suspenseful mood.
```

### Dolly In/Out (Physical Movement)
Camera physically moves closer or farther from subject.

```
Slow dolly-in on a woman sitting at a cafe table reading. Camera
physically moves closer over 8 seconds, starting from medium shot
and ending on close-up. Smooth gimbal movement. Soft afternoon light.
At 5 seconds, she looks up and smiles warmly at camera.
```

```
Dolly-out from a lone figure standing on a cliff edge. Camera starts
close on the character's back, then pulls away to reveal the vast
misty canyon. Emphasizes isolation and scale. Epic fantasy atmosphere.
```

### Tracking Shot (Parallel Movement)
Camera moves alongside the subject.

```
Tracking shot, camera trucks right following a character walking
along a busy sidewalk. Camera maintains consistent distance (medium shot)
while moving parallel. Background pedestrians blur slightly. Urban energy.
Natural daylight.
```

### Crane Shot (Sweeping Vertical)
Camera rises or descends on a vertical arc.

```
Crane shot starting low on a lone hiker, ascending high above to reveal
they're standing on the edge of a colossal mist-filled canyon at sunrise.
Camera rises smoothly in sweeping arc, constantly adjusting angle to keep
subject visible while showing environment. Awe-inspiring scale.
```

### Aerial/Drone Shot
Bird's eye view with smooth gliding motion.

```
Sweeping aerial drone shot flying over a tropical island chain. Camera
glides smoothly above turquoise water, palm-covered islands below.
Starts high, gradually descends toward the main island. Golden hour
lighting, paradise aesthetic. Smooth stabilized footage.
```

### Handheld (Realistic Shake)
Conveys urgency, realism, documentary feel.

```
Handheld camera shot during a marketplace scene. Camera follows behind
character, slight bounce and shake conveying realism. Quick adjustments
as they weave through crowds. Documentary style, gritty atmosphere.
Natural lighting.
```

### Dutch Angle (Tilted Frame)
Camera tilted to create unease or disorientation.

```
Dutch angle shot, camera tilted approximately 30 degrees. A character
looks around nervously in a dimly lit alleyway. The tilted horizon
creates unease. Noir aesthetic, dramatic shadows, high contrast.
Psychological tension.
```

### Rack Focus
Focus shifts between foreground and background.

```
Rack focus technique. Shot starts with coffee cup in sharp focus on
foreground table, background blurred. Focus shifts smoothly to character
in background who was out of focus, now clearly visible. 50mm lens,
shallow depth of field. Cinematic storytelling.
```

## Important Camera Rules

1. **One movement per shot** - Don't combine "dolly-in while panning left"
2. **Specify speed** - "Slow dolly-in" vs "Quick dolly-in" affects mood
3. **Anchor static shots** - If no movement wanted, say "static on tripod"
4. **Use simple verbs** - "slow pan", "gentle dolly-in" work better than complex instructions

## Dialogue and Audio

### Dialogue Formatting

**Critical**: Use a colon before quoted dialogue. This tells Veo to use exact words.

```
# CORRECT
A friendly shopkeeper says: "Welcome! How can I help you today?"

# INCORRECT (may get wrong words)
A shopkeeper saying "Welcome! How can I help you today?"
```

### Dialogue Length

Keep dialogue short for reliable lip-sync:

| Duration | Recommended Words |
|----------|-------------------|
| 4 seconds | 3-5 words |
| 6 seconds | 5-8 words |
| 8 seconds | 6-12 words |

More than 15 words in 8 seconds risks rushed/unnatural speech.

### Guiding Voice Tone

Describe the speaker's characteristics:

```
A professional businesswoman in her 40s, confident and authoritative,
clear projected voice with slight warmth, says: "The results exceeded
our expectations." Standing tall, good posture, maintaining eye contact.
Modern conference room, bright office lighting.
```

```
A young woman in her 20s, secretive and cautious, hushed whisper,
intimate tone, leaning in close, says: "I found the hidden letter."
Dimly lit library, shadows in background, mysterious atmosphere.
```

### Audio Layers

Structure audio in priority order:

1. **Dialogue** - Always clear, highest priority
2. **Sound Effects** - Specific, timed to actions
3. **Ambient** - Background atmosphere (3-5 elements max)
4. **Music** - Lowest priority, "ducks under dialogue"

```
Static shot. A detective in a dark office, illuminated by desk lamp.

Speaking: "I've been expecting you."

Sound effects: Door creaking closed at 2-second mark,
glass of whiskey set down at 5 seconds.

Ambient sounds: Quiet fireplace crackling, rain on windows,
distant thunder, faint clock ticking.

Background music: Low ominous cello drone, ducks under dialogue,
noir atmosphere.

No subtitles, no text overlay.
```

### Audio Precision

Be specific, not vague:

```
# VAGUE (unpredictable results)
A person in a creepy place. Spooky sounds.

# SPECIFIC (immersive audio)
A person walks through an abandoned factory. Faint transformer buzz,
occasional metal creak echoing, low ventilation hum, distant water
dripping, footsteps echo on concrete. Industrial decay atmosphere.
```

## Subject Description

### Character Identity Anchors

Re-describe characters completely in every prompt for consistency:

```
Woman in her early 30s, shoulder-length wavy black hair, warm expressive
brown eyes, green bomber jacket over white shirt, gold hoop earrings,
confident yet approachable demeanor, genuine smile.
```

Use this exact description in every shot featuring this character.

### What to Include

- **Age range** - "in her 30s", "elderly man"
- **Hair** - Color, length, style
- **Wardrobe** - Specific clothing items and colors
- **Distinctive features** - Accessories, expressions
- **Body language** - Posture, demeanor

## Action and Timing

### Describe Specific Actions

```
# WEAK
The character reacts to something.

# STRONG
At 2-second mark, the character's eyes widen slightly. At 4 seconds,
they set down their coffee cup with a soft ceramic-on-wood sound.
At 6 seconds, they look up toward camera, forming a warm smile.
```

### Pacing

For 8-second clips, plan 2-3 distinct beats:
- 0-3s: Establishing moment
- 3-6s: Main action or change
- 6-8s: Resolution or reaction

## Environment and Lighting

### Be Cinematically Specific

```
# WEAK
Nice lighting in a room.

# STRONG
Soft afternoon sunlight streams through a large window camera-left,
creating gentle rim light on the subject's hair. Warm interior fill
from practical lamps camera-right balances the cooler window light.
Cozy cafe interior, exposed brick walls, plants on windowsill.
```

### Lighting Terms Veo Understands

- **Golden hour** - Warm, long shadows, sunset/sunrise
- **Blue hour** - Cool twilight tones
- **Chiaroscuro** - Strong light/dark contrast
- **Rim light** - Backlight creating edge glow
- **Three-point lighting** - Professional studio setup
- **Practical lights** - In-scene light sources

## Style and Mood

### Use Specific References

```
# WEAK
Make it look good.

# STRONG
Cinematic commercial quality. 35mm film aesthetic, shallow depth
of field with creamy bokeh. Warm color grading, slight film grain.
Aspirational, intimate mood. Professional production value.
```

### Mood Keywords

- **Cinematic** - Film-quality, professional
- **Documentary** - Realistic, observational
- **Commercial** - Clean, aspirational
- **Noir** - High contrast, shadows, mysterious
- **Intimate** - Close, personal, warm
- **Epic** - Grand scale, awe-inspiring
- **Suspenseful** - Tension, unease

## Negative Guidance

### Always Include

End every prompt with suppression directives:

```
No subtitles, no text overlay, no captions.
```

### Additional Negative Guidance

```
Avoid: blurry footage, camera shake, distorted faces, harsh shadows,
neon colors, text overlays, watermarks, cartoonish style.
```

## Complete Example Prompts

### Cinematic Product Shot

```
Slow dolly-in shot from medium to close-up over 8 seconds.

A ceramic coffee mug sits on a rustic wooden table. Steam rises
gently from the hot liquid, catching soft morning sunlight streaming
through a nearby window. The background shows a cozy kitchen interior,
softly out of focus with warm bokeh.

35mm lens, f/2.8, shallow depth of field. Warm color grading,
commercial product photography aesthetic.

Ambient sounds: Quiet morning atmosphere, distant birds, soft
coffee shop music at low volume.

No camera shake, smooth gimbal movement. No subtitles, no text overlay.
```

### Character Dialogue Scene

```
Static shot, medium close-up, eye level.

A friendly barista in her 20s, short brown hair, green apron,
warm genuine smile, says: "Your usual today?"

She's standing behind a coffee counter, espresso machine visible
in background. Bright cafe lighting, morning atmosphere.

Sound effects: Espresso machine hiss, cup placed on counter.
Ambient: Quiet cafe conversation murmur, acoustic guitar music.

Natural lip-sync, relaxed body language. No subtitles, no text overlay.
```

### Epic Landscape Reveal

```
Crane shot starting at ground level, ascending over 8 seconds.

Camera begins low, showing rocky terrain and sparse vegetation.
As it rises, reveals a vast canyon stretching to the horizon,
morning mist filling the valleys below. A lone hiker stands at
the cliff edge, tiny against the immense landscape.

Golden hour lighting, warm tones, dramatic scale. Epic nature
documentary aesthetic. Hans Zimmer-style orchestral swell builds
throughout, conveying awe and wonder.

Smooth sweeping motion, no camera shake. No subtitles.
```

### Image-to-Video Animation

When animating a still image:

```
The portrait comes alive with subtle motion over 8 seconds.

The subject's eyes shift slightly to look directly at camera at
2-second mark. At 4 seconds, a gentle smile begins to form.
At 6 seconds, slight head tilt to the right with warm expression.

Maintain exact appearance from the reference image. Subtle natural
movement, photorealistic, no dramatic changes. Soft ambient lighting
consistent with the original image.

No subtitles, no text overlay.
```

## Common Mistakes to Avoid

1. **Mixing conflicting cues** - "dark noir" + "bright sunny"
2. **Too much action** - Keep to ONE main beat per 8 seconds
3. **Vague descriptions** - "nice" and "good" mean nothing
4. **Forgetting subtitles suppression** - Veo adds them by default
5. **Multiple camera movements** - Pick ONE movement type
6. **Overloaded audio** - Max 5-6 ambient elements
7. **Not re-describing characters** - Each generation is independent

## Quick Reference Card

```
STRUCTURE:
[Camera] + [Subject] + [Action] + [Environment] + [Audio] + [Suppression]

CAMERA (pick ONE):
static | pan left/right | tilt up/down | dolly in/out | tracking | crane | handheld

LENS TERMS:
35mm wide | 50mm standard | 85mm portrait | shallow DOF | bokeh

LIGHTING:
golden hour | blue hour | chiaroscuro | rim light | soft diffused | practical

AUDIO LAYERS:
1. Dialogue (says: "exact words")
2. SFX (action at X-second mark)
3. Ambient (3-5 elements)
4. Music (ducks under dialogue)

ALWAYS END WITH:
No subtitles, no text overlay, no captions.

DIALOGUE LENGTH:
4s = 3-5 words | 6s = 5-8 words | 8s = 6-12 words
```
