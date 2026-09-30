# Script Format Example

Below is the standard format for `script.md`. The HTML preview parser depends on this format — follow it strictly.

```markdown
# MV Script — Song Name

Song: Song Name

## Scene 1: Dawn Departure

* 0:00 - 0:12 (12s)

**Scene Description:**
In the early morning mist, the traveller crouches beside the pickup truck bed tightening luggage straps, then stands and wipes sweat from his forehead with the back of his hand.
He turns and opens the driver's door. Sitting in the driver's seat, he grips the steering wheel with both hands, takes a deep breath, and turns the key.
The moment the engine starts, the rear-view mirror reflects the small town silhouette behind him gradually swallowed by morning fog.
The camera slowly pulls back from the side window as the pickup drives onto the open road, wheels kicking up a trail of dust.

**Visual Style:** Warm golden morning light, 35mm film grain, backlit silhouette, shallow depth of field

**Key Props:** Old pickup truck (dark blue, rusted patches, canvas bag strapped to roof rack)

**Transition:** Wheel close-up match cut to next scene's aerial highway view

---

## Scene 2: Highway Solitude

* 0:12 - 0:23 (11s)

> First lyric line
> Second lyric line

**Scene Description:**
Interior car POV — the traveller steers with one hand while the other taps the door panel to the rhythm.
Sunlight through the windshield casts moving light patches on his face; he squints slightly, corners of his mouth lifting unconsciously.
A guitar sits on the passenger seat, its strings vibrating faintly with each bump, producing a low hum.
The camera slowly pushes in from his profile to an eye close-up, the straight road ahead reflected in his pupils.

**Visual Style:** Warm amber tones, natural light entering from the right, handheld slight shake

**Key Props:** Old pickup truck (same as above), guitar (natural wood folk guitar, faded stickers on body)

**Transition:** Dissolve to aerial shot

---

## Scene 3: Campfire in the Wild

* 0:23 - 0:35 (12s)

> Third lyric line
> Fourth lyric line

**Scene Description:**
Dusk in the wilderness — the traveller takes the guitar from the passenger seat and carries it toward a small campfire just lit.
He sits on a rock, head down tuning strings, left hand sliding along frets testing notes.
He looks up at the last strip of orange sunset on the distant ridge line, his expression shifting from concentration to release.
Wind sweeps across the grass, the campfire flames tilt and flicker rightward, sparks drifting up toward the dark blue sky.
The camera tilts up slowly from a fretboard close-up to his face, then continues up to a sky full of stars.

**Visual Style:** Warm-cool boundary tones (campfire warmth vs cool blue sky), telephoto compression

**Key Props:** Guitar (same as above)

**Transition:** Starry sky match cut to next scene
```

## Format Notes

- H1 `#` is used only for the file title (`MV Script — Song Name`), followed by a `Song: Song Name` line
- H2 `##` is used for each scene title (e.g. `## Scene 1: Dawn Departure`)
- Timecode line format: `* M:SS - M:SS (Xs)`
  - Not bold, no segment type labels (Verse/Chorus etc.)
  - Duration in parentheses (seconds), must be an **integer between 4-15**
- Lyric quotes start with `> `, instrumental scenes have no lyric quotes
- Each scene must contain four fields: `**Scene Description:**`, `**Visual Style:**`, `**Key Props:**`, `**Transition:**`
- `**Key Props:**` lists important non-character visual elements, prop name + brief appearance in parentheses, comma-separated; write `None` if no key props
- Scene Description **must include specific dynamics**, generic static descriptions are prohibited:
  - Specify character body movements and motion paths
  - Specify expression/emotion changes
  - Specify character interaction with objects/environment
  - Specify camera movement (tilt up, push in, pan, pull back, etc.)
  - Specify environmental dynamics (wind, light changes, flames, water, etc.)
- Scenes separated by `---`
- Script timespans can split or merge lyric segments — they don't need to match lyric.md one-to-one
- Each phase's output is independent: modifying the script doesn't require changing lyrics
