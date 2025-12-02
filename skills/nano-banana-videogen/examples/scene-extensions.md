# Scene Extension Examples

Creating videos longer than 8 seconds by extending scenes up to 148 seconds total.

## How Scene Extensions Work

- **Initial generation**: 8 seconds
- **Each extension**: Adds ~7 seconds (8-second window with 1-second overlap)
- **Maximum**: 20 extensions = 8 + (20 × 7) = 148 seconds
- **Visual anchor**: Uses the final second (24 frames) of the previous clip
- **Resolution**: Extensions require 720p (even if original was 1080p)

## Best Use Cases

Scene extensions work best for:

✅ **Continuous camera movements** (fly-throughs, tracking shots, pans)
✅ **Establishing shots** (revealing environment gradually)
✅ **Slow transformations** (sunset progressing, fog rolling in)
✅ **Ambient scenes** (nature, cityscapes with gentle motion)

Avoid extensions for:

❌ **Complex dialogue scenes** (quality degrades after 5-10 extensions)
❌ **Fast-paced action** (motion artifacts accumulate)
❌ **Scenes requiring precise timing** (hard to control exact moments)
❌ **Character-focused narratives** (identity drift increases)

## Extension Workflow

### Step 1: Generate Initial Clip

```bash
nano-banana --video "Aerial drone shot, starting high above a tropical island chain.
Camera slowly descends toward the main island, turquoise water visible below.
Golden hour lighting, paradise aesthetic. Smooth, stabilized movement.

8-second duration. 16:9 cinematic. No subtitles." \
--duration 8 \
--aspect 16:9 \
--output output/island-initial.mp4
```

This generates `island-initial.mp4` (8 seconds) and `island-initial.uri` (for extensions).

### Step 2: First Extension (~15 seconds total)

```bash
nano-banana --video "Continue the descent smoothly, camera now at tree-top level.
Revealing palm trees swaying in the breeze. Waves crashing on pristine beach becoming visible.
Maintain smooth downward motion from the previous shot.

Same golden hour lighting. Continue the paradise aesthetic.
No subtitles." \
--extend output/island-initial.mp4 \
--output output/island-ext1.mp4
```

**Note**: Resolution automatically forced to 720p for extensions.

### Step 3: Second Extension (~22 seconds total)

```bash
nano-banana --video "Camera reaches beach level, now panning across the shoreline.
White sand, gentle waves lapping the shore. Coconut palms casting long shadows.
Sunset colors intensify in sky. Continue smooth camera movement.

Paradise beach documentary style. No subtitles." \
--extend output/island-ext1.mp4 \
--output output/island-ext2.mp4
```

### Step 4: Optional Post-Processing

If you want seamless playback, concatenate the clips:

```bash
# Create a file list
echo "file 'island-initial.mp4'" > filelist.txt
echo "file 'island-ext1.mp4'" >> filelist.txt
echo "file 'island-ext2.mp4'" >> filelist.txt

# Concatenate with ffmpeg
ffmpeg -f concat -safe 0 -i filelist.txt -c copy output/island-complete.mp4
```

## Complete Extension Examples

### Example 1: Flythrough Tour (30 seconds)

**Initial Clip (8s):**
```bash
nano-banana --video "Slow forward dolly through a misty forest at dawn.
Camera glides between ancient trees, shafts of golden light cutting through fog.
Ferns and moss-covered ground visible below. Ethereal, mystical atmosphere.

Smooth gimbal movement. Nature documentary quality. Ambient forest sounds.
No subtitles." \
--duration 8 \
--output output/forest-01.mp4
```

**Extension 1 (~15s total):**
```bash
nano-banana --video "Continue gliding forward through the forest.
A small creek becomes visible ahead, water babbling over rocks.
Morning light grows slightly brighter. Maintain smooth forward motion.

Same mystical forest atmosphere. Continue ambient nature sounds.
No subtitles." \
--extend output/forest-01.mp4 \
--output output/forest-02.mp4
```

**Extension 2 (~22s total):**
```bash
nano-banana --video "Camera crosses over the creek, continuing forward.
Forest opens slightly, revealing dappled sunlight patterns on the ground.
Bird visible flying through frame. Maintain peaceful, unhurried pace.

Dawn light continuing to brighten. Forest ambiance with bird calls.
No subtitles." \
--extend output/forest-02.mp4 \
--output output/forest-03.mp4
```

**Extension 3 (~30s total):**
```bash
nano-banana --video "Forest path ahead curves gently to the right.
Camera follows the curve, revealing a small woodland clearing in the distance.
Deer visible at the clearing edge. Continue smooth forward motion.

Golden hour forest lighting. Peaceful nature documentary feel.
No subtitles." \
--extend output/forest-03.mp4 \
--output output/forest-04.mp4
```

### Example 2: Urban Timelapse Extension (24 seconds)

**Initial Clip (8s):**
```bash
nano-banana --video "Static shot of a city intersection at dusk.
Traffic flows steadily, headlights and taillights creating light trails.
Buildings lit up as twilight deepens. Timelapse effect, slightly accelerated motion.

Urban documentary style. City ambiance with traffic sounds.
No subtitles." \
--duration 8 \
--output output/city-01.mp4
```

**Extension 1 (~15s total):**
```bash
nano-banana --video "Continue the timelapse effect, night fully arriving.
Street lights now dominant, building windows illuminated.
Traffic flow continues, more headlights visible as it gets darker.

Same urban intersection, continuing the transition to night.
City sounds, traffic ambiance. No subtitles." \
--extend output/city-01.mp4 \
--output output/city-02.mp4
```

**Extension 2 (~24s total):**
```bash
nano-banana --video "Complete transition to full night.
Neon signs on buildings now prominent, vibrant city lights.
Traffic continues flowing. Stars barely visible in dark sky above.

Night city atmosphere, urban documentary. Continue city ambiance.
No subtitles." \
--extend output/city-02.mp4 \
--output output/city-03.mp4
```

### Example 3: Product Reveal Extension (16 seconds)

**Initial Clip (8s):**
```bash
nano-banana --video "Slow orbit shot around a luxury watch on a marble pedestal.
Camera rotates 45 degrees clockwise around the watch over 8 seconds.
Studio lighting creates gleaming reflections on the metal.

Premium product commercial aesthetic. Clean white background.
No sound, pure visual. No subtitles." \
--duration 8 \
--no-audio \
--output output/watch-01.mp4
```

**Extension 1 (~16s total):**
```bash
nano-banana --video "Continue the clockwise orbit around the watch.
Camera rotates another 45 degrees, revealing the watch face and crown detail.
Lighting continues to highlight premium materials and craftsmanship.

Same studio lighting and white background. Continue smooth orbit motion.
No sound. No subtitles." \
--extend output/watch-01.mp4 \
--no-audio \
--output output/watch-02.mp4
```

## Extension Best Practices

### 1. Describe Continuity Explicitly

❌ **Weak**: "The camera is now lower"
✅ **Strong**: "Continue the descent smoothly, camera now at tree-top level"

### 2. Reference the Previous Shot

Include phrases like:
- "Continue the motion..."
- "Maintaining the same camera angle..."
- "Continuing from the beach, camera now..."
- "Same lighting and atmosphere..."

### 3. Keep Lighting/Style Consistent

Don't change:
- Time of day (unless that's the creative intent)
- Weather conditions abruptly
- Color grading or visual style
- Camera movement type (dolly → don't switch to crane)

### 4. Design Final Frames Intentionally

The last second of each clip becomes the anchor for the next extension.

✅ **Good final frame**: Smooth motion, clear composition, good lighting
❌ **Bad final frame**: Motion blur, awkward composition, extreme close-up

### 5. Expect Quality Degradation

- **Extensions 1-5**: Generally excellent quality
- **Extensions 6-10**: Slight quality reduction, acceptable for most uses
- **Extensions 11+**: Noticeable degradation, best for ambient B-roll

## Constraints & Limitations

### Technical Constraints

- **Can only extend Veo-generated videos** (need the `.uri` file)
- **Resolution forced to 720p** for all extensions
- **Aspect ratio must match** the original (16:9 stays 16:9)
- **Maximum 20 extensions** (~148 seconds total)

### Creative Limitations

- Each extension adds ~7 seconds (not exactly 8)
- Identity drift accumulates with character-focused content
- Motion artifacts can appear after many extensions
- Audio quality may degrade faster than video
- Cannot extend non-nano-banana videos

## Cost Considerations

Each extension costs the same as initial generation:

- **veo-3.1-fast-generate-preview**: $0.15/second = ~$1.05 per extension
- **veo-3.1-generate-preview**: $0.50/second = ~$3.50 per extension
- **With audio enabled**: 1.5x cost multiplier

A 30-second video (4 extensions) with audio costs:
- Fast model: ~$6.30
- Premium model: ~$21.00

**Cost optimization tips:**
- Use `--video-fast` for development iterations
- Use `--no-audio` if audio isn't critical
- Test with shorter durations before committing to many extensions
- Generate separate clips and edit together if budget is tight

## Troubleshooting Extensions

### Problem: "URI file not found"

**Solution**: You can only extend videos generated by nano-banana. The `.uri` file must exist alongside the video file.

### Problem: "Cannot use --reference with --extend"

**Solution**: Reference images and video extension are mutually exclusive. Choose one approach.

### Problem: Visible "jump" between clips

**Solutions**:
1. Use ffmpeg cross-fade transitions (see post-processing example)
2. Ensure final frame of previous clip has smooth motion
3. Describe continuity more explicitly in extension prompt

### Problem: Quality degrades quickly

**Solutions**:
1. Limit extensions to 5-7 for critical content
2. Use extensions for ambient shots, not key story moments
3. Generate separate clips and edit together for longer narratives
4. Accept that quality degradation is inherent to the chaining approach
