# Dialogue and Audio Examples

Complete prompt examples for videos with speech, sound effects, and ambient audio.

## Simple Dialogue

### Greeting

```bash
nano-banana --video "Static medium shot, eye level.

A friendly hotel receptionist, woman in her 30s, neat uniform,
professional smile, says: 'Welcome to the Grand Hotel. How may I help you?'

Standing behind a polished reception desk, elegant lobby visible behind.
Warm interior lighting, professional hospitality setting.

Natural lip-sync, genuine warmth in delivery.
Ambient: Quiet lobby atmosphere, soft classical music.

No subtitles, no text overlay."
```

### Short Announcement

```bash
nano-banana --video "Medium close-up, slight low angle (authority framing).

A news anchor, professional man in his 40s, navy suit, serious expression,
says: 'Breaking news tonight from the capital.'

Newsroom desk setting, monitors visible in background.
Professional broadcast lighting, clean key light from front.

Authoritative delivery, measured pace.
No background sound, clean studio audio.

Broadcast quality. No subtitles."
```

## Emotional Dialogue

### Happy/Excited

```bash
nano-banana --video "Slow push-in from medium to medium close-up.

A young woman in her 20s, bright eyes, wide smile, bouncing slightly
with excitement, says: 'I got the job! I actually got the job!'

Standing in a sunlit apartment, phone in hand (just received the news).
Golden afternoon light, warm color grading.

Joyful, authentic performance. Slight laugh after the line.
Ambient: City sounds through open window, birds chirping.

Uplifting, celebratory mood. No subtitles."
```

### Serious/Concerned

```bash
nano-banana --video "Static tight close-up, eye level.

A doctor, woman in her 50s, white coat, compassionate but serious expression,
says: 'We need to discuss your test results.'

Medical office setting, soft professional lighting.
Calm, measured delivery with underlying concern.

Sound: Quiet office hum, distant hospital sounds.

Dramatic, realistic medical drama tone. No subtitles."
```

### Whispered/Secret

```bash
nano-banana --video "Static extreme close-up, Dutch angle (10 degrees).

A teenage girl, cautious expression, glancing around nervously,
whispers: 'Meet me at midnight. Tell no one.'

Dim school hallway, lockers visible in blurred background.
Low-key lighting, mysterious shadows.

Hushed, urgent whisper delivery.
Ambient: Distant hallway echoes, fluorescent light hum.

Thriller/mystery atmosphere. No subtitles."
```

## Multiple Audio Layers

### Cafe Scene (Full Audio Design)

```bash
nano-banana --video "Tracking shot following a barista preparing coffee.

A skilled barista, man in his 30s, tattoo sleeves, focused concentration,
prepares an espresso drink behind the counter.

0-2s: Grounds into portafilter, tamping sound
2-4s: Machine engaged, espresso extraction, rich crema forming
4-6s: Milk steaming (loud hiss)
6-8s: Pour and latte art, cup placed on counter

Busy cafe environment, exposed brick, warm lighting.

Sound effects (precise timing as above):
- Portafilter click at 1s
- Espresso machine whir at 2.5s
- Steam wand hiss 4-6s
- Ceramic cup on saucer at 7.5s

Ambient: Cafe chatter, indie music (low volume), door chime.

Satisfying ASMR-style audio. No subtitles."
```

### Outdoor Scene (Nature Soundscape)

```bash
nano-banana --video "Slow pan right across a forest stream.

A peaceful woodland scene: crystal clear stream flowing over rocks,
dappled sunlight through leaves, ferns along the banks.
A bird lands on a branch at 5-second mark.

Camera pans slowly, revealing more of the serene landscape.

Layered nature audio:
- Water: Continuous gentle stream babble, occasional splash
- Birds: Songbirds in trees, the landing bird chirps at 5.5s
- Wind: Gentle breeze rustling leaves throughout
- Insects: Soft background buzz of summer insects

ASMR nature documentary quality.
No music, pure nature sounds. No subtitles."
```

### Urban Scene (City Atmosphere)

```bash
nano-banana --video "Static wide shot of a busy intersection.

A vibrant city intersection at golden hour. Pedestrians cross,
taxis pass, life flows in all directions. Steam rises from a
street grate. A vendor calls out at 4 seconds.

Street-level urban photography style.

Layered city audio:
- Traffic: Cars passing, occasional horn, bus air brakes
- People: Footsteps, indistinct conversation murmur
- Vendor: Calls 'Fresh pretzels!' at 4-second mark
- Ambient: Distant siren, subway rumble underfoot
- Music: Jazz saxophone from a street performer (low in mix)

Authentic New York energy. No subtitles."
```

## Dialogue with Sound Effects

### Action Response

```bash
nano-banana --video "Static medium shot with subtle push-in.

A detective, man in his 40s, trench coat, stands in a rainy alley.
Phone buzzes at 2 seconds. He answers, listens briefly, then says:
'I'm on my way.'

Night scene, wet pavement reflecting neon signs, rain falling.

Sound timeline:
- 0-2s: Rain falling, distant traffic
- 2s: Phone vibrates/rings
- 2.5s: Click of answering
- 4s: Muffled voice from phone (unintelligible)
- 5.5s: Dialogue delivery
- 7s: Phone snaps closed

Film noir atmosphere, moody and tense. No subtitles."
```

### Reaction Shot

```bash
nano-banana --video "Static close-up on face, slight dolly-in.

A woman in her 30s receives unexpected news. Her expression shifts
from neutral to shocked as she reads something off-screen.
At 4 seconds, she gasps softly. At 6 seconds, she says: 'This changes everything.'

Indoor setting, natural window light, intimate framing.

Sound design:
- 0-3s: Quiet room tone
- 4s: Sharp intake of breath (gasp)
- 4.5s: Paper being set down
- 6s: Dialogue, voice slightly trembling

Emotional drama, restrained performance. No subtitles."
```

## Music Integration

### With Dialogue (Music Ducking)

```bash
nano-banana --video "Slow crane shot descending on a wedding couple.

Bride and groom stand facing each other, hands clasped.
She smiles and says: 'I've waited my whole life for this moment.'
He smiles warmly in response.

Beautiful outdoor ceremony, flower arch, soft evening light.

Audio design:
- Music: Romantic string quartet, full volume 0-3s
- Music ducks at 3.5s as dialogue approaches
- Dialogue at 4-6s, music at -15dB underneath
- Music returns to full at 7s

Wedding video quality, emotional and romantic. No subtitles."
```

### Pure Music Scene (No Dialogue)

```bash
nano-banana --video "Montage-style tracking shot through a recording studio.

Camera glides through a professional music studio. Musicians visible
at different stations: drummer, guitarist, vocalist in booth.
Everyone focused, creative energy palpable.

Warm studio lighting, acoustic panels, vintage equipment.

Audio: Full band performance of an upbeat rock track,
music drives the entire piece, building to crescendo.
Mix includes all instruments clearly.

Music video aesthetic, energetic and inspiring. No dialogue, no subtitles."
```

## Audio-Only Focus (No Dialogue)

### ASMR Style

```bash
nano-banana --video "Extreme close-up macro shots of coffee preparation.

Tight shots of: coffee beans falling into grinder, grounds poured,
water dripping through filter, coffee streaming into cup.
Rich browns and warm tones throughout.

Studio lighting, shallow depth of field on each element.

ASMR audio focus:
- Beans: Clicking, rattling into grinder
- Grinder: Mechanical whir, crushing sound
- Pour: Water splashing, trickling
- Drip: Each drop audible, liquid filling cup
- Final: Steam rising, cup placed on saucer

Satisfying, meditative sound design. No music, no speech, no subtitles."
```
