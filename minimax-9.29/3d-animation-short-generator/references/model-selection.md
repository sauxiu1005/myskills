# Video Model Selection and Prompt Shaping (v1.1 — Audio-Mode Aware)

## STEP 7: Video-Model Choice Card + Single-Shot Video Clips

### Video-model choice card (mandatory before any clip render)

Before any clip is rendered, show the video-model choice card. The choice is stored in the Project Brief and reused for every clip in this project unless the user later changes it.

Video model card:

- **H3 (recommended default)** — strong on visual packaging, motion graphics, text/UI clarity, multi-modal context understanding, and cost efficiency (about 1/3 the price of comparable flagship models at 2K, 1/2 at 768P). Native dual-channel audio. Up to 15s per clip at 2K. Best for: stylized 3D animated shorts with strong design language, text overlays, motion-graphic moments, packaging-style transitions, and dialogue-driven beats where the audio is part of the deliverable.
- **Another available model (explicit opt-in)** — use only when the user names a model or H3 cannot satisfy a hard capability requirement. Check its capabilities before use and document the exception.
- **Per-shot mixed (advanced)** — let the user mark `video_model: H3` or another explicitly selected model in the `Shot Description` column. The default for unmarked rows is H3.

**v1.1 audio-mode interaction (corrected in v1.1.1)**: the choice of video model interacts with the audio mode chosen in Step 0.

- For `silent` projects (the **primary mode for visual 3D animation**), either model works; pick by visual-style priority. H3 is usually the better default.
- For `dialogue-led` projects, keep H3 as the default and switch only after checking the selected model's single-speaker and audio capabilities.
- For `narration-led` projects (a **rare opt-in for 3D animation**), H3's dual-channel audio advantage is significant — narration can be generated and mixed in by H3 in a single pass. Recommend H3. **3D animation warning**: most 3D animation projects do not need `narration-led`; if the user picked it without being asked, confirm before continuing.

### Resolution choice card (after video model)

Once the video model is locked, show the resolution choice card:

- 768P (recommended for H3 first pass; cost-efficient)
- 2K (H3 default quality; higher cost, sharper final render)
- 1080p (when required by the selected model)
- 720p (draft when supported)
- Match project / custom resolution

The user must confirm a resolution before the first clip renders. Resolution can be changed per clip later if the user wants a hero shot at higher detail.

### Model selection is not additional-generation authorization (v1.1.11)

Choosing a model or resolution selects a production constraint; it does not approve unlimited renders. Before the first batch, state which approved shot rows and outputs it covers. All additional generation follows `fallback-policy.md`: report QC findings first, verify scoped authorization, and count attempts across model switches rather than starting a new ladder. Default rework approval permits one additional attempt per listed artifact; the same shot/issue is capped at initial + two additional attempts, with stricter user/platform limits prevailing.

A switch to a different model, higher resolution, altered references, different duration, or audio mode requires explicit approval before execution. Record a per-shot exception only for the affected shot; keep the choices and approved outputs for unrelated shots unchanged. Do not drop references because a model cannot use them; report incompatibility and ask. Existing narration/mixed examples do not authorize a narration-led fallback outside the main Skill boundary.

After each authorized attempt, review the candidate, record pass/fail/unverified and evidence, and stop on acceptance target, limit, pause/cancel, blocker, lack of material improvement, or unapproved change. Approval of a candidate and approval of another render are separate decisions. Render only actually affected shots and preserve the rest.

### Single-shot clip rendering

For each approved table row, call the chosen video model to generate the corresponding independent video clip. Each clip must use exactly the matching section from the text storyboards document (extracted standalone node if that section was extracted, otherwise the in-document section), character card(s), and scene card from that row.

Per-shot rules common to all video models:

- Use the text storyboards document as the authoritative per-shot reference for narrative, composition, camera movement, action staging, per-second timing, mouth state, and shot number. For shots that have been extracted to a standalone node, read the extracted node instead. If a pencil image storyboard also exists, use it only for human-side pose / silhouette pre-check; do not let it override the text storyboard.
- Use character cards as the authoritative identity source.
- Use scene cards as the authoritative environment source.
- **Strip all storyboard double-binding labels** (`[char:…]`, `[scene:…]`, `[shot:…]`, `[dur:…]`, `[hook:…]`, `[audio_mode:…]`, `[speaker:…]`) before video render — these labels are storyboard-only reference markers and must NOT appear in the final clip. Pencil image storyboards additionally have their own shot numbers, camera icons, arrows, and notes that must be removed at render time.
- The rendered clip must contain only clean full-color Pixar-inspired 3D animation content.
- No storyboard line art, no hand-drawn sketch texture, no labels, no subtitles unless requested, no watermarks.
- Maintain the approved screen size / aspect ratio and the approved video resolution from the resolution choice card.

### v1.1 Audio-mode-aware prompt shaping (NEW — replaces the v1.0 prompt prefix section)

The v1.0 prompt prefix was one static string per model. **v1.1 rewrites the prompt prefix per audio mode per model** so the model is told explicitly:

- which character is the speaker (for dialogue)
- which characters must keep their mouths closed (non-speakers)
- whether voiceover narration is happening off-screen (and therefore all on-screen mouths must stay closed)

This is the single most effective intervention against AI character-confusion lip-sync errors.

#### Step 1: assemble the per-shot context block

Before generating the model-specific prompt, build a small **lip-sync context block** from the shot table and storyboard. This block is prepended to the prompt and stripped at render time:

```
[AUDIO_MODE] <narration|dialogue|mixed|silent>
[SPEAKER] <exact character card name, or "off-screen narrator" for narration rows, or "n/a" for silent rows>
[NON_SPEAKERS_MOUTH] <comma-separated list of exact character card names whose mouths must stay CLOSED this entire shot, or "all (narration/silent mode)">
[SHOT_DURATION] <N>s
```

For `narration` rows:

```
[AUDIO_MODE] narration
[SPEAKER] off-screen narrator
[NON_SPEAKERS_MOUTH] <every on-screen character by exact name> — keep all mouths closed this entire shot; the narrator voice plays in voiceover, on-screen faces carry the emotion through brows/eyes/jaw only
[SHOT_DURATION] <N>s
```

For `dialogue` rows (single-speaker per shot, enforced by shot-table rules):

```
[AUDIO_MODE] dialogue
[SPEAKER] <character name> — this is the ONLY character with mouth movement this shot
[NON_SPEAKERS_MOUTH] <every other on-screen character by exact name> — mouths must stay CLOSED for the entire shot
[SHOT_DURATION] <N>s
```

For `mixed` rows (rare; usually a hero dialogue beat bookended by voiceover):

```
[AUDIO_MODE] mixed
[SPEAKER] <character name> during dialogue seconds; off-screen narrator during narration seconds
[NON_SPEAKERS_MOUTH] <every other on-screen character> — mouths closed except during their own dialogue seconds
[SHOT_DURATION] <N>s
[SECONDS] 0-1s=narration, 1-3s=dialogue[Mia], 3-5s=dialogue[Grandma], 5-6s=narration
```

For `silent` rows:

```
[AUDIO_MODE] silent
[SPEAKER] n/a
[NON_SPEAKERS_MOUTH] all on-screen characters — keep all mouths closed this entire shot
[SHOT_DURATION] <N>s
```

#### Step 2: prepend the lip-sync context block to the model-specific prompt

The full prompt now has three layers, in order:

1. **Lip-sync context block** (v1.1, audio-mode-aware) — see above
2. **Model-specific prefix** (style baseline) — see below
3. **Per-shot per-second directives** (from the text storyboards, including the `Mouth State` quadrant)

#### H3 prompt prefix (v1.1, audio-mode-aware)

Base style prefix (always included, audio-mode-independent):

```
Pixar-inspired 3D cartoon rendering, C4D + Octane look, stylized Q-version proportions, warm SSS skin, designed-with-detail hair, strong character design language, clean motion, on-brand color palette.
```

Add the following lip-sync suffix based on the shot's audio mode:

- For `narration` rows, append:
  ```
  NARRATION-LOCKED SHOT: voiceover is off-screen. Every on-screen character must keep their mouth CLOSED and STILL for the entire shot. Emotion is expressed through brows, eyes, jaw tension, gaze direction only — no mouth movement, no lip movement, no speech-related micro-motion.
  ```
- For `dialogue` rows, append:
  ```
  DIALOGUE-LOCKED SHOT: only [SPEAKER] speaks this shot. Every other on-screen character must keep their mouth CLOSED and STILL for the entire shot. [SPEAKER]'s mouth moves only during their dialogue seconds as marked in the per-second directives. The shot's narrative beat belongs to [SPEAKER].
  ```
- For `mixed` rows, append:
  ```
  MIXED-AUDIO SHOT: this shot contains both off-screen narration and on-screen dialogue. Follow the per-second mouth-state map strictly. During narration seconds every on-screen character's mouth must stay CLOSED. During dialogue seconds only the named speaker's mouth opens.
  ```
- For `silent` rows, append:
  ```
  SILENT SHOT: no speech, no voiceover. Every on-screen character's mouth must stay CLOSED for the entire shot. Emotion is expressed through body, face above the mouth, and gesture only.
  ```

#### Alternate model prompt prefix (v1.1, audio-mode-aware)

Base style prefix (always included, audio-mode-independent):

```
cinematic Pixar-quality 3D animation, elastic squash-and-stretch performance, Disney-style anticipation and overshoot, dramatic key lighting, lens-specific depth of field.
```

Add the same audio-mode suffixes as H3, adapting wording to the explicitly selected model's camera and performance strengths:

- For `narration` rows, append:
  ```
  This is a NARRATION-LOCKED shot. Voiceover is off-screen; on-screen faces must stay mouth-closed and still. Use the per-second expression-path to deliver emotion: brow furrow, eye-line shift, jaw tension, gaze drop. No speech micro-motion.
  ```
- For `dialogue` rows, append:
  ```
  This is a DIALOGUE-LOCKED shot. [SPEAKER] is the only character whose mouth moves this shot. Use elastic squash-and-stretch on [SPEAKER]'s face and body during their dialogue seconds; every other on-screen character must keep their mouth CLOSED for the entire shot.
  ```
- For `mixed` rows, append:
  ```
  This is a MIXED-AUDIO shot. Honor the per-second mouth-state map. Narration seconds → all on-screen mouths closed, expression path drives the emotion. Dialogue seconds → only the named speaker's mouth opens.
  ```
- For `silent` rows, append:
  ```
  This is a SILENT shot. No speech. All on-screen mouths CLOSED. Drive emotion through elastic body mechanics, squash-and-stretch, and ambient gesture.
  ```

When the user picked `per-shot mixed`, apply the prefix that matches the row's `video_model` field.

### v1.1 Speaker-binding reference image selection (NEW)

For `dialogue` rows, the **speaker's character card** should be used as the primary face reference image when the video model supports face binding. This anchors the model's face ID to the speaker and reduces identity drift mid-shot.

- H3: use the speaker's `main 3/4 view` from the character card as the `face_reference` input. If the character card has a `speaking` reference (v1.1 addition in Step 3), prefer that.
- Alternate selected model: same as H3 — speaker's character card is the face anchor.

For `narration` rows, the **on-screen character's** character card is the face anchor (the narrator is off-screen by definition).

For `silent` rows, face anchoring uses the most prominent on-screen character; this is style-driven, not lip-sync-driven.
