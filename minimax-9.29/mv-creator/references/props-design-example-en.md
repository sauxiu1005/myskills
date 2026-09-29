# Props Design Format Example

Below is the standard format for a single prop's `{prop_name}/design.md`. Each prop has its own directory and file.

```markdown
# Old Pickup Truck

## Appearance

- Type: Vehicle
- Form: 1970s Ford F-150 pickup, boxy and rugged body lines, open truck bed
- Color/Material: Dark blue paint extensively peeled revealing primer and rust, metal body with visible dents
- Size/Scale: Standard full-size pickup, truck bed can seat a person or hold a guitar case
- Details: Spider-web crack on lower-left windshield, faded highway stickers on bumper, old blanket and ropes scattered in truck bed, left taillight wrapped with tape

## Narrative Role

The old pickup is the physical vessel of the traveller's drifting life, carrying all his luggage and memories.
The rust and scars on the body mirror the traveller's own experiences — worn but still running,
suggesting a "not perfect but never giving up" attitude toward life. It appears repeatedly in highway shots,
serving as both transportation and mobile home, one of the film's most central visual symbols.

## Image Settings

Prompt:
  A beat-up 1970s dark blue Ford F-150 pickup truck parked on the shoulder
  of a desert highway at golden hour. Peeling paint revealing rust and primer,
  cracked windshield, faded bumper stickers, old blanket in the truck bed.
  Cinematic, 35mm film, warm amber tones, wide shot.
  single object, no split screen, no multiple panels, no collage.

Model: Midjourney V7 --ar 3:2
Reference: style_cache/cinematic/02_bar.png

## Candidates

- candidate_01.jpg — Midjourney V7, highway side panorama
- candidate_02.jpg — Gemini, front 45-degree close-up
- candidate_03.jpg — Midjourney V7, dusk backlit silhouette

## Selected

selected.jpg (Candidate 01)
```

## Format Notes

- H1 `#` for prop name
- H2 `##` for each section, must include these 5 sections:
  - `## Appearance` — itemized list: type, form, color/material, size/scale, details
  - `## Narrative Role` — a paragraph describing the prop's function and symbolic meaning in the story
  - `## Image Settings` — contains three sub-fields:
    - `Prompt:` — English, combining prop description with art style keywords
    - `Model:` — image generation model name
    - `Reference:` — art style reference image path (relative to theme directory)
  - `## Candidates` — all generated candidate image paths (relative to prop directory), with model and composition notes
  - `## Selected` — final selected image path (chosen by user in preview page)
- Images stored in the prop's directory (candidate_*.jpg, selected.jpg)
- Before user selection, `## Selected` section is left empty

## File Organization

```
./.mv/{song_name}/{theme}/
  props/
    {prop_name_1}/
      design.md            # Prop design document
      candidate_01.jpg     # Candidate images
      candidate_02.jpg
      selected.jpg         # Final selected image
    {prop_name_2}/
      design.md
      candidate_01.jpg
      selected.jpg
```
