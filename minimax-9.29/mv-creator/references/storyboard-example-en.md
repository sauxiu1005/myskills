# Storyboard Format Example

Below is the standard format for `storyboard.md`. Each scene corresponds to a scene in the script, referencing generated background, character, and prop images, with video generation prompts.

```markdown
# Song Name — MV Storyboard

## Scene 1: Dawn Departure

* 0:00 - 0:12 (12s)

Characters: traveller
Scene Background: Desert Highway
Key Props: Old Pickup Truck

Scene Description:
  A man stands beside a beat-up pickup truck, dawn light pouring from the horizon,
  backlighting his and the guitar's silhouette.
  In the distance lies an empty desert highway stretching to the horizon.

Video Prompt:
  use image 1 as the background, image 2 as the character reference,
  image 3 as the prop reference. A rugged man stands beside a vintage
  blue pickup truck at dawn. Golden hour backlight creates silhouette.
  He reaches into the truck bed to grab his guitar. Camera slowly
  dollies in from wide establishing shot. Warm amber tones, 35mm film grain.

Reference:
  - backgrounds/desert_highway/selected.jpg (background reference)
  - characters/traveller/selected.jpg (character reference)
  - props/old_pickup/selected.jpg (prop reference)

Candidates:
  - scene_01.jpg — nano_banana_2, ultra-wide pickup panorama

Selected:
  scene_01.jpg

---

## Scene 2: Highway Solitude

* 0:12 - 0:23 (11s)

> Wind blows across the edge of the wasteland
> I hear the distance calling

Characters: traveller
Scene Background: Desert Highway

Scene Description:
  The pickup drives down a straight highway, window half open, the man steers
  with one hand while the other rests on the window frame. Sunlight falls on
  his face, expression calm and determined.

Video Prompt:
  use image 1 as the background, image 2 as the character reference.
  A man driving a vintage pickup truck on a straight desert highway,
  one hand on steering wheel, other arm resting on open window.
  Sunlight on his face, calm determined expression. Interior car shot,
  shallow depth of field. Camera slowly pans from dashboard to his profile.
  Cinematic, 35mm film grain, warm amber palette.

Reference:
  - backgrounds/desert_highway/selected.jpg (background reference)
  - characters/traveller/selected.jpg (character reference)

Candidates:
  - scene_02.jpg — nano_banana_2, interior profile close-up

Selected:
  scene_02.jpg

---

## Scene 3: Starlit Camp

* 0:23 - 0:35 (12s)

> Stars fall beside the campfire
> Lighting the path you came from

Characters: (none)
Scene Background: Starlit Camp

Scene Description:
  An empty wilderness campsite, a campfire burning faintly, sparks scattering
  toward the Milky Way. The pickup sits in the distance, headlights off,
  moonlight washing over the sandy ground.

Video Prompt:
  use image 1 as the background scene. A solitary campfire burning
  in vast desert wilderness at night, embers floating up toward
  milky way galaxy. Gentle wind makes flames flicker. No people.
  Camera slowly tilts up from campfire to starry sky. Cool blue
  shadows, warm fire glow contrast, long exposure stars effect.

Reference:
  - backgrounds/starlit_camp/selected.jpg (background reference)

Candidates:
  - scene_03.jpg — nano_banana_2, campfire starry panorama

Selected:
  scene_03.jpg
```

## Format Notes

- H1 `#` used only for the file title (Song Name — MV Storyboard)
- H2 `##` for each scene title, matching scene names from `script.md`
- Timecode line format: `* M:SS - M:SS (Xs)`, consistent with `script.md`
- Lyric quotes start with `> ` (synced from script.md), instrumental scenes have no lyrics
- Each scene contains these fields:
  - `Characters:` — characters appearing in the scene (comma-separated), write `(none)` if no characters
  - `Scene Background:` — corresponding background name (matching `backgrounds/` directory name)
  - `Key Props:` — prop names (comma-separated), may be omitted if none
  - `Scene Description:` — description of the visual scene, indented 2 spaces, may span multiple lines
  - `Video Prompt:` — English prompt, referencing image numbers + describing dynamics and camera, indented 2 spaces
  - `Reference:` — list format, each line noting purpose (background/character/prop reference), paths relative to theme directory
  - `Candidates:` — list format, each line recording storyboard image filename (in `storyboard/` directory) with composition notes
  - `Selected:` — user-selected final storyboard image filename
- Scenes separated by `---`

## Reference Image Strategy

| Scene Type | Reference Images |
|------------|-----------------|
| Character scene | Background `selected.jpg` + Character `selected.jpg` |
| Character + prop scene | Background `selected.jpg` + Character `selected.jpg` + Prop `selected.jpg` |
| Multi-character | Background `selected.jpg` + Multiple character `selected.jpg` |
| Empty scene / landscape | Background `selected.jpg` only |

## File Organization

```
./.mv/{song_name}/{theme}/
  storyboard.md                          # Storyboard document
  storyboard/                            # Storyboard images directory
    scene_01.jpg
    scene_02.jpg
    ...
```
