# Background Design Format Example

Below is the standard format for a single background's `{bg_name}/design.md`. Each background has its own directory and file.

```markdown
# Desert Highway

## Scene Description

- Environment type: Outdoor / Open terrain
- Terrain/Space: Straight two-lane highway stretching to the distant horizon, flat sandy desert on both sides
- Palette/Atmosphere: Warm yellow desert base, golden hour sunlight, purple-red horizon
- Key elements: Road surface cracks and heat haze, distant red rock mesa silhouettes, dried grass and fallen road signs on the shoulder
- Weather/Time: Clear and cloudless, around dusk

## Scene List

Scene 1 (Dawn Departure), Scene 2 (Highway Solitude), Scene 7 (Looking Back at the End)

## Image Settings

Prompt:
  A long straight desert highway stretching to the horizon, cracked asphalt
  with heat haze, flat sandy terrain on both sides, distant red rock mesas,
  dried grass and a tilted road sign on the shoulder. Golden hour warm light,
  purple-red sky at the horizon. Cinematic, 35mm film, warm amber tones,
  wide establishing shot, no people.
  single scene, no split screen, no multiple panels, no collage.

Model: nano_banana_2
Reference: style_cache/cinematic/01_highway.png

## Candidates

- candidate_01.jpg — nano_banana_2, ultra-wide horizon stretch
- candidate_02.jpg — nano_banana_2, low angle road close-up
- candidate_03.jpg — nano_banana_2, dusk backlit panorama

## Selected

selected.jpg (Candidate 01)
```

## Format Notes

- H1 `#` for background name
- H2 `##` for each section, must include these 5 sections:
  - `## Scene Description` — itemized list: environment type, terrain/space, palette/atmosphere, key elements, weather/time
  - `## Scene List` — which scenes this background appears in (extracted from script.md)
  - `## Image Settings` — contains three sub-fields:
    - `Prompt:` — English, combining scene description with art style keywords, must include `no people`
    - `Model:` — image generation model name
    - `Reference:` — art style reference image path (relative to theme directory)
  - `## Candidates` — all generated candidate image paths (relative to background directory), with model and composition notes
  - `## Selected` — final selected image path (chosen by user in preview page)
- Images stored in the background's directory (candidate_*.jpg, selected.jpg)
- Before user selection, `## Selected` section is left empty
- **Aspect ratio: always 16:9 widescreen** (`aspect_ratio: "16:9"`) to showcase full scene

## File Organization

```
./.mv/{song_name}/{theme}/
  backgrounds/
    {bg_name_1}/
      design.md            # Background design document
      candidate_01.jpg     # Candidate images
      candidate_02.jpg
      selected.jpg         # Final selected image
    {bg_name_2}/
      design.md
      candidate_01.jpg
      selected.jpg
```
