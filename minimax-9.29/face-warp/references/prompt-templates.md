# Face Warp — Prompt Templates

## Shared Character Prefix

All prompts begin with this prefix, populated from `profile.md`:

```
[gender], [age range], [hair description], [skin tone], wearing [outfit description],
[pose description], [background/environment], [lighting]
```

---

## 1. Faceless (faceless.png)

### Base Prompt

```
{character_prefix}. The face area is completely smooth and featureless — no eyes,
no nose, no mouth, no eyebrows — just smooth blank skin where facial features
should be. The rest of the body, clothing, hair, and background remain
photorealistic and unchanged. Maintain exact same clothing, hair, body proportions,
and skin tone as the reference image. Photorealistic, high detail, 8K.
```

### Retry Reinforcement Keywords

| Failure Reason | Append to Prompt |
|----------------|-----------------|
| Face still visible | `absolutely NO facial features whatsoever, completely smooth featureless skin, mannequin-like blank face` |
| Character inconsistency | `MUST maintain exact same clothing ({outfit}), hair ({hair}), body proportions, and {skin_tone} skin tone as the reference image` |
| Unnatural appearance | `seamless photorealistic skin texture, natural smooth transition from hair to blank face area, no editing artifacts` |

---

## 2. Puzzle (puzzle.png)

### Base Prompt

```
Facial features extracted from the reference portrait, arranged on a clean white
background following the natural face layout — eyes at the top, nose in the middle,
mouth at the bottom — maintaining their correct relative positions as if the face
outline was removed but the features stayed in place. Each feature (eyes, nose,
mouth, eyebrows) is a separate piece with only narrow gaps (2-3mm) between them,
like a face puzzle with thin seams. No face outline, no hair, no body, no skin
filling between features — only the isolated features with small gaps revealing
white background between them. Each piece maintains the original skin tone and
photorealistic texture. {skin_tone} skin, {eye_description} eyes,
{nose_description} nose, {lip_description} lips. Photorealistic, sharp detail,
8K, studio lighting, white background.
```

### Retry Reinforcement Keywords

| Failure Reason | Append to Prompt |
|----------------|-----------------|
| Features don't match | `facial features MUST match the reference portrait exactly — {eye_description} eyes, {nose_description} nose, {lip_description} lips` |
| Skin tone mismatch | `each feature piece must have {skin_tone} skin, matching the reference portrait skin tone exactly` |
| Shows complete face | `NO complete face, NO face outline, NO connected skin between features — only isolated individual features with white gaps between them` |
| Gaps too wide | `features arranged in natural face layout with NARROW gaps (2-3mm thin seams only), maintaining relative positions` |

---

## Prompt Construction Checklist

Before submitting any prompt, verify:

- [ ] Character prefix includes all 7 fields (gender, age, hair, skin, outfit, pose, background/lighting)
- [ ] Faceless prompt explicitly says "no eyes, no nose, no mouth, no eyebrows"
- [ ] Puzzle prompt specifies skin tone, eye/nose/lip descriptions from profile
- [ ] Puzzle prompt includes "narrow gaps (2-3mm)" and "natural face layout"
- [ ] Both prompts end with quality anchors (Photorealistic, high detail, 8K)
