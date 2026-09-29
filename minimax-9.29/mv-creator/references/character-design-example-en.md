# Character Design Format Example

Below is the standard format for a single character's `{character_name}/design.md`. Each character has its own directory and file.

```markdown
# The Traveller

## Appearance

- Age/Gender: Male, early 30s
- Build: Medium-lean, broad shoulders
- Hair: Dark brown, slightly curly, somewhat long
- Face: Short stubble, defined features
- Clothing: Red-grey plaid flannel shirt, worn brown cowboy boots, naturally faded jeans with knee wear
- Accessories: Old leather-strap watch on left wrist

## Personality

Calm and free-spirited, with world-weariness in his eyes but no defeat.
Unhurried movements, as if long accustomed to the open road and solitude.

## Signature Items

- Martin D-28 natural wood guitar (with wear marks and stickers)
- Beat-up dark blue Ford F-150 pickup truck

## Image Settings

Prompt:
  A rugged man in his 30s with short stubble and slightly curly brown hair,
  wearing a red-grey plaid flannel shirt and worn cowboy boots, carrying a
  Martin acoustic guitar. Cinematic, 35mm film, warm amber tones, natural lighting.
  single character, single view, no split screen, no multiple panels, no collage, no reference sheet.

Model: Midjourney V7 --ar 2:3
Reference: style_cache/cinematic/01_highway.png

## Candidates

- candidate_01.jpg — Midjourney V7, full body standing pose
- candidate_02.jpg — Kling, upper body close-up
- candidate_03.jpg — Midjourney V7, playing guitar side view

## Selected

selected.jpg (Candidate 01)
```

## Format Notes

- H1 `#` for character name
- H2 `##` for each section, must include these 6 sections:
  - `## Appearance` — itemized list: age/gender, build, hair, face, clothing, accessories
  - `## Personality` — expression, posture, overall temperament description
  - `## Signature Items` — character-specific recognizable objects, list format
  - `## Image Settings` — contains three sub-fields:
    - `Prompt:` — English, combining character description with art style keywords
    - `Model:` — image generation model name
    - `Reference:` — art style reference image path (relative to theme directory)
  - `## Candidates` — all generated candidate image paths (relative to character directory), with model and composition notes
  - `## Selected` — final selected image path (chosen by user in preview page)
- Images stored in the character's directory (candidate_*.jpg, selected.jpg)
- Before user selection, `## Selected` section is left empty

## File Organization

```
./.mv/{song_name}/{theme}/
  characters/
    {character_name_1}/
      design.md            # Character design document
      candidate_01.jpg     # Candidate images
      candidate_02.jpg
      selected.jpg         # Final selected image
    {character_name_2}/
      design.md
      candidate_01.jpg
      selected.jpg
```
