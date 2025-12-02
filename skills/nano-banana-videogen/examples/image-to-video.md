# Image-to-Video Examples

Prompt examples for animating still images with the `--file` flag.

## Basic Usage

```bash
# Animate a portrait
nano-banana --video "The subject slowly turns and smiles" --file portrait.png

# Animate a landscape
nano-banana --video "Gentle wind movement through the scene" --file landscape.jpg

# Animate a product
nano-banana --video "Slow rotation revealing all angles" --file product.png
```

## Portrait Animation

### Subtle Head Turn

```bash
nano-banana --video "The portrait comes alive with subtle motion over 8 seconds.

At 2-second mark, eyes shift slightly to look directly at camera.
At 4 seconds, a gentle, warm smile begins to form.
At 6 seconds, slight head turn to the left (about 10 degrees).

Maintain exact appearance from the reference image: same lighting,
same colors, same style. Natural, photorealistic movement.
Subtle hair movement as if from gentle breeze.

No dramatic changes, just bringing the still image to life.
No subtitles, no text overlay." --file portrait.jpg
```

### Eye Contact

```bash
nano-banana --video "The subject's eyes come alive.

Starting with the existing gaze direction, eyes slowly track
toward camera over 3 seconds, making direct eye contact.
At 4 seconds, eyebrows raise slightly in recognition.
At 6 seconds, a knowing smile forms.

Keep all other elements static. Photorealistic eye movement.
Exact preservation of original image appearance and lighting.

Intimate, engaging connection with viewer. No subtitles." --file headshot.png
```

### Speaking Animation

```bash
nano-banana --video "The portrait speaks directly to camera.

The subject says: 'Hello, welcome to my channel.'

Natural lip-sync animation, slight head movement while speaking,
eyes maintain engagement with camera. Expression matches friendly
tone of the greeting.

Preserve exact appearance from reference: hair, skin, clothing, lighting.
Realistic mouth movement, subtle facial muscle engagement.

No subtitles, clean delivery." --file youtube-thumbnail.jpg
```

## Landscape Animation

### Wind and Movement

```bash
nano-banana --video "The landscape scene comes alive with gentle motion.

Trees sway softly in a light breeze, leaves rustling.
Grass in foreground ripples in wind waves.
Clouds drift slowly across the sky (time-lapse speed).
Distant birds fly across the frame at 4-second mark.

Water in the lake has gentle ripples catching sunlight.

Ambient nature sounds: Wind in trees, birdsong, water lapping.

Maintain original color grading and lighting. Cinemagraph style.
No subtitles." --file nature-scene.jpg
```

### Water Animation

```bash
nano-banana --video "The water comes alive while surroundings remain mostly still.

Ocean waves roll gently toward shore, foam forming and receding.
Reflections on water surface shimmer and move.
Subtle sand particles shift in the wet zone.

Sky and distant elements remain static (cinemagraph effect).

Sound: Rhythmic wave sounds, gentle ocean ambiance.

Preserve the golden hour lighting from the original image.
Hypnotic, relaxing loop-ready style. No subtitles." --file beach-sunset.jpg
```

### Sky Animation

```bash
nano-banana --video "The sky transforms while ground stays anchored.

Clouds drift slowly across the frame from right to left.
Light rays shift subtly as clouds pass.
Color gradients in sky shift naturally with cloud movement.

Ground elements (buildings, trees) remain completely static.
Time-lapse style cloud movement, compressed time feel.

No sound needed. Contemplative, meditative mood.
Maintain original composition and color palette. No subtitles." --file cityscape.png
```

## Product Animation

### 360-Degree Reveal

```bash
nano-banana --video "Slow elegant rotation of the product.

The product rotates smoothly on its axis, completing a 90-degree
turn over 8 seconds. Each angle reveals different details
and surfaces catching the studio light.

Maintain the original white background and studio lighting.
Professional product photography feel, smooth turntable rotation.

Subtle reflection on surface below product.

No sound, pure visual focus on the product. Commercial quality.
No text, no UI elements." --file product-hero.png
```

### Unboxing Style

```bash
nano-banana --video "The product emerges from shadow into light.

Starting with product partially in shadow (as in reference),
light gradually increases to fully illuminate the product
by 4 seconds. At 6 seconds, subtle sparkle/gleam on key surfaces.

Premium reveal moment, luxury brand aesthetic.
Maintain exact product appearance and studio setting.

Sound: Subtle whoosh of reveal, delicate chime at sparkle moment.

Apple keynote style presentation. No text, no subtitles." --file tech-product.jpg
```

## Artwork Animation

### Painting Coming to Life

```bash
nano-banana --video "The painting subtly comes to life.

Painted leaves flutter gently as if in a breeze.
Painted water shows subtle rippling reflections.
Painted clouds drift almost imperceptibly across the canvas.
Painted figure's clothing shifts slightly.

Maintain brushstroke visibility and painted aesthetic.
Movement should feel dreamlike, not realistic.

Soft ambient music, whimsical and artistic.

Impressionist painting in gentle motion. No subtitles." --file landscape-painting.jpg
```

### Character Illustration

```bash
nano-banana --video "The illustrated character shows subtle life.

Eyes blink once at 3-second mark.
Breathing motion in chest/shoulders (gentle rise and fall).
Hair has slight floating movement (anime style).
Fabric of clothing shifts subtly.

Maintain exact illustration style, line quality, and coloring.
Anime/manga aesthetic preserved throughout.

Ambient: Soft wind sound, gentle background music.

Living illustration style. No subtitles." --file anime-character.png
```

## Tips for Image-to-Video

### What Works Well

- Subtle movements (blinks, smiles, head turns)
- Natural elements (wind, water, clouds)
- Loop-ready cinemagraph effects
- Gentle camera movements on static scenes

### What to Avoid

- Dramatic scene changes
- Elements not visible in the original
- Actions requiring what's not shown
- Contradicting the original lighting/setting

### Best Practices

1. **Match the image** - Describe only what fits the existing image
2. **Start subtle** - Less movement often looks better
3. **Preserve style** - Mention maintaining original appearance
4. **Be specific about timing** - Use "at X-second mark"
5. **Consider loops** - End similar to beginning for seamless loops
