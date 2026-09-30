# Face Warp — Quality Criteria & Retry Strategy

## Evaluation Prompt

Send original portrait + generated images to `read_media` together:

```
read_media(
  file_paths=[faceless_image, puzzle_image, original_portrait],
  question="Image 1 is a faceless variant, Image 2 is a puzzle variant, Image 3 is the original portrait.

  Rate each variant on a 1-10 scale. Return your evaluation in this exact format:

  FACELESS SCORES:
  face_concealment: [score] — [brief reason]
  character_consistency: [score] — [brief reason]
  natural_appearance: [score] — [brief reason]
  image_quality: [score] — [brief reason]

  PUZZLE SCORES:
  feature_accuracy: [score] — [brief reason]
  skin_tone_consistency: [score] — [brief reason]
  artistic_quality: [score] — [brief reason]
  no_full_face: [score] — [brief reason]

  VERDICT:
  faceless_pass: [true/false]
  puzzle_pass: [true/false]
  lowest_scoring_dimension: [dimension name]

  Scoring criteria below."
)
```

## Scoring Rubric

### Faceless Image

| Dimension | Threshold | What to Check |
|-----------|-----------|---------------|
| **face_concealment** | ≥ 8 | Face area is completely smooth with NO recognizable eyes, nose, mouth, eyebrows |
| **character_consistency** | ≥ 7 | Body, clothing, hair, skin tone match the original portrait |
| **natural_appearance** | ≥ 7 | Smooth face looks natural and photorealistic, not like bad Photoshop |
| **image_quality** | ≥ 7 | Overall photographic quality — sharp, well-lit, no artifacts |

### Puzzle Image

| Dimension | Threshold | What to Check |
|-----------|-----------|---------------|
| **feature_accuracy** | ≥ 7 | Extracted eyes, nose, lips visually match the original portrait |
| **skin_tone_consistency** | ≥ 7 | Skin tone of each feature piece matches the original |
| **artistic_quality** | ≥ 7 | Puzzle/collage is clean, well-arranged, and visually appealing |
| **no_full_face** | ≥ 8 | Must NOT show a complete recognizable face — only separated features |

## Pass/Fail Logic

```
PASS = all dimensions ≥ their threshold
FAIL = any dimension below threshold → retry ONLY that image
```

- Retry only the failing image, not both
- Maximum 2 retries per image
- After 2 retries, keep the best-scoring version

## Retry Prompt Adjustment Strategy

When retrying, append reinforcement keywords to the original prompt based on which dimension failed:

| Failed Dimension | Prompt Reinforcement |
|------------------|---------------------|
| face_concealment | `completely smooth featureless skin, absolutely no facial features, mannequin-like blank face` |
| character_consistency | `maintain exact same clothing, hair, body proportions as reference` |
| natural_appearance | `seamless, photorealistic skin texture, natural transition, no editing artifacts` |
| feature_accuracy | Strengthen specific feature descriptors, add `matching the reference portrait exactly` |
| skin_tone_consistency | Emphasize exact skin tone from profile, add `{skin_tone} skin matching reference` |
| artistic_quality | Add `clean composition, professional studio photography, minimal and elegant` |
| no_full_face | `no complete face, only isolated individual features with gaps between them, no connected skin` |

## Score Tracking

Keep track of scores across retries to select best version:

```
./.face-warp/{project_name}/quality_log.md

# Quality Log

## Faceless
| Attempt | face_concealment | character_consistency | natural_appearance | image_quality | Pass |
|---------|-----------------|----------------------|--------------------|---------------|------|
| 1       | ?               | ?                    | ?                  | ?             | ?    |

## Puzzle
| Attempt | feature_accuracy | skin_tone_consistency | artistic_quality | no_full_face | Pass |
|---------|-----------------|----------------------|------------------|--------------|------|
| 1       | ?               | ?                    | ?                | ?            | ?    |
```
