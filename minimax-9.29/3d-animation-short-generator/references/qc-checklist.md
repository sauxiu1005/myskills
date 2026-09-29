# Assembly, Final Review, and Asset Discipline (v1.1 — Audio-Mode Aware)

## STEP 8: Full Film Assembly, BGM Match, and Final Output

After all single-shot clips are approved, concatenate them in table order into the complete main video. Then generate one continuous BGM track that matches the story mood and embed it into the assembled video.

Assembly and BGM rules:

- Preserve the exact shot order from the approved table.
- Match BGM to the assembled video's actual pacing, emotional arc, comedy beats, chase rhythm, and ending tone.
- Duck BGM under dialogue, non-language reactions, narration, and important SFX.
- Preserve existing clip audio and SFX unless the user asks to replace them.
- Do not generate BGM per shot.
- Do not add subtitles or text unless the user explicitly asks.
- Output the final video with clean animation visuals and no storyboard traces, including no `[char:…] [scene:…] [shot:…] [audio_mode:…] [speaker:…]` labels.

**v1.1.1 audio-mode-aware assembly**: the two primary modes for 3D animation are `silent` and `dialogue-led`; `narration-led` is a rare opt-in.

- For `silent` projects (the most common 3D animation mode), no voice bus is needed; the final mix is BGM + SFX only. Lip-sync risk is zero by construction.
- For `dialogue-led` projects, verify the dialogue bus is consistent and the speaker is identifiable per shot. The QC hard gate below will catch mis-binding. This is the most common lip-sync-risk case in 3D animation.
- For `narration-led` projects (rare in 3D animation), the narration is mixed in by H3 (when H3 is the chosen model) or comes in via the per-shot audio. Verify the narration mix is consistent across the assembled film; if any shot's narration is too loud or too quiet, normalize the narration bus to -3dB below the dialogue bus and duck under SFX.

Then show a user choice card:

- Approve final film (recommended)
- Regenerate BGM
- Adjust BGM mix
- Re-render selected clip
- **v1.1: re-mix narration bus (narration-led projects only)**

## STEP 9: Final Review (v1.1 = 12 hard checks, was 10)

Create a short final review text node if the user asks for diagnosis or if there are visible risks.

**v1.1.11 verdict boundary**: the 12 checks determine whether a version can be labeled a qualified final. A failure blocks that label, not the duty to report findings and show available outputs. A check never authorizes additional generation or recompositing. Follow `fallback-policy.md` for scoped approval, cumulative attempt limits, affected-only repair, and stop conditions.

**Hard-gate checks (failure prevents qualified-final status; no automatic rework)**:

- **Check 11: Speaker identity correctness** — for each dialogue interval, the moving mouth must belong to the named storyboard speaker. Record wrong-character motion as fail with shot ID and timestamps. Sampling 2-3 seconds may detect a defect but cannot prove unsampled intervals pass; mark incomplete coverage unverified. A failed row becomes a targeted proposal under `fallback-policy.md`, not an automatic Step 7 render.

- **Check 12: Mouth-state consistency** — for every second of every row, the on-screen mouth state matches the row's `Mouth State` from the storyboard:
  - `narration` rows: every on-screen character's mouth is closed for every second.
  - `dialogue` and `mixed` rows: only the named speaker's mouth is open during their dialogue seconds; every other on-screen character's mouth is closed for every second.
  - `silent` rows: every on-screen character's mouth is closed for every second.
   Record failed and unverified intervals separately; offer a targeted proposal under `fallback-policy.md`. Do not launch its candidate strategies without scoped authorization.

**Standard v1.0 checks (kept, reordered)**:

1. Character consistency — face, hair, costume, body proportions match the character cards.
2. Scene continuity (verify against the `Reference Anchors` column — did every landmark land where the table said it would?).
3. Emotional anchor payoff — the ending reuses an earlier emotional anchor.
4. Shot purpose clarity — every shot has a clear narrative job.
5. Dialogue intelligibility — when audio is present, the dialogue is audible and the speaker is identifiable (now supplemented by Check 11).
6. Foley/SFX sync (against the `Audio & Dialogue Track` column).
7. BGM balance — BGM ducks under dialogue, narration, and SFX.
8. No storyboard artifacts in final video: no panel borders, sketch lines, arrows, labels, handwritten notes, timing marks, pose ghosts, storyboard text, AND no double-binding labels (`[char:…]`, `[scene:…]`, `[shot:…]`, `[dur:…]`, `[hook:…]`, `[audio_mode:…]`, `[speaker:…]`).
9. Missing or weak clips — any clip marked `placeholder: ...` is documented.
10. Any asset that may need regeneration.

**v1.1.1 audio-mode-specific checks (corrected priority)**: in addition to the 12 above.

- For `silent` projects (the most common 3D animation mode): verify no on-screen mouth movement and no dialogue/narration audio; if present, it contradicts the Step 0 choice.
- For `dialogue-led` projects (the other primary 3D animation mode): verify that every dialogue beat has a paired reaction shot within 1-2 shots; if not, the shot table needs revision.
- For `narration-led` projects (rare in 3D animation): verify that the total narration duration is between 50% and 70% of total runtime (the 60% target with ±10% tolerance); if outside the band, the audio-spine map from Step 2 needs to be revised.

## QC record and delivery decision (v1.1.11)

For each check, record pass / fail / unverified / not applicable, shot/version, evidence or missing evidence, reviewed time range, severity, and actual dependency impact. Keep that record separate from a rework authorization ledger. Do not claim full-second coverage from a few sampled frames or from prompt text. Review all required content only to the extent supported by the available evidence; disclose coverage limits.

- All applicable checks verified and passed, version approved: deliver as a qualified final.
- Any failed or unverified item: present existing usable outputs and a concise defect/coverage report. Label them review-only, known-defect, or incomplete as appropriate; do not claim qualification.
- If the user accepts an existing version with known defects, preserve those QC failures in the record and label the delivery accordingly. Acceptance is not a retroactive pass.
- For missing required clips or placeholders, do not call the film complete. Report the missing shot IDs and offer a labeled partial delivery or a scoped repair proposal.
- Only after valid authorization may affected clips or audio be regenerated or recomposited. Default authorization is one additional attempt per listed artifact; total for the same shot/issue is at most initial + two further attempts, shared across fallback routes. Preserve any stricter budget/time limits.
- Stop on acceptance target, authorization/cumulative limit, user pause/cancel, external blocker, no material improvement, or a scope-changing next step. Preserve outputs and report next choices instead of running until all checks pass.

Final-film, BGM, mix, and clip choice cards must distinguish accepting existing outputs from authorizing additional work. A choice such as “re-render selected clip” must first resolve which shots, how many attempts, changed constraints, and cost exposure, unless all are already explicitly authorized. Apply the same rule to BGM regeneration and recompositing. No automatic film-wide rerender follows a failed check.

## Canvas Ordering and Grouping Discipline

Whenever a durable artifact is created, write it to the canvas immediately in the sequence defined in STEP 0. If a generation tool automatically adds outputs to canvas, do not duplicate them.

Group every production section on canvas:

- Group project brief and story outline as `<title> story planning` when both exist.
- Group character cards as `<title> character cards`.
- Group scene cards as `<title> scene cards`.
- Group the standardized shot table as `<title> shot table`.
- Group the text storyboards document as `<title> text storyboards` (default mode, one document). Extracted standalone text storyboard nodes and pencil storyboards (visualization mode) are separate groups: `<title> extracted text storyboards` and `<title> multi-panel pencil storyboards`. Keep all storyboard groups separate from rendered clips because storyboards contain double-binding labels, shot numbers, camera icons, arrows, and sketch lines.
- Keep storyboard groups separate from rendered clips because storyboards contain double-binding labels, shot numbers, camera icons, arrows, and sketch lines.
- Group single-shot video clips as `<title> shot clips`; the label must not hard-code a model name.
- Group assembled main video, matched BGM, and final composited video as `<title> final delivery` when they exist.

If a generation round produces two or more outputs, group recent outputs immediately with a clear title. If the renderer has not flushed positions and grouping fails, tell the user to click/drag any canvas node once, then retry grouping before continuing to the next costly stage when possible.

**v1.1.1 canvas bus nodes (corrected)**: add audio-bus group nodes only when the audio mode requires them.

- For `dialogue-led` projects, add a `dialogue bus` group node named `<title> dialogue audio` to track the per-shot dialogue assets.
- For `narration-led` projects (rare in 3D animation), add a `narration bus` group node named `<title> narration audio` to track the per-shot VO assets.
- For `silent` projects (the most common 3D animation mode), neither bus is needed.

These groups are referenced by the audio-mode-specific checks above.

## User Choice Card Discipline

Use a choice card for every place that requires user confirmation. Do not replace these confirmations with plain chat questions or prose. Required choice-card gates:

- Immediately after intake, before any next step, to choose screen size / aspect ratio
- Immediately after intake, before any next step, to choose total duration
- **v1.1: Immediately after intake, before any next step, to choose audio mode (narration-led / dialogue-led / silent)**
- After project brief (and after the audio-spine summary)
- After story outline (and after the audio-spine map)
- After character cards (and after the `speaks_on_screen` flags)
- After scene cards
- After standardized shot table (gate 1: approve table before self-check)
- After shot-table self-check passes (gate 2: approve self-check, then immediately choose storyboard mode: text only / text + pencil image)
- After single-shot storyboards (text storyboards document by default with optional extracted standalone nodes; pencil images if the user opted in)
- Before single-shot video-clip rendering, confirm H3 as the default or an explicitly selected alternate model.
- Before single-shot video-clip rendering, to choose video resolution
- After single-shot video clips (now including a "Speaker identity verified" gate)
- After full-film assembly, BGM match, and final composite (now including the 12 hard checks, with speaker-identity and mouth-state as the gating pair)

Put the recommended option first and allow custom input. An unscoped “continue” is not additional-generation authorization. It can confirm a clearly displayed bounded operation only when its shots, changes, outputs/attempts, and limits are explicit; otherwise clarify without generating. Reuse precise existing authorization rather than asking for it again.
For rework authorization, this scoped rule takes precedence over generic proceed/choice-card language elsewhere in the Skill; it does not remove unrelated creative approval gates.

## Regeneration and Latest-Asset Discipline

Track the latest approved version separately from the latest generated candidate. A newer candidate does not become approved automatically. Assess actual dependency invalidation before replacing downstream inputs; unaffected approved assets remain locked.

Rules:

- Character/scene-card change: list shots actually referencing the changed trait or scene structure; inspect them and their handoffs. Mark only incompatible dependent assets as needing attention. A changed speaking flag triggers speaker-binding review of affected rows, not blanket regeneration.
- Shot-table change: patch corresponding storyboard sections and check the affected rows, adjoining handoffs, and any impacted whole-table constraints. Preserve the other rows. A project-wide audio-mode change requires an explicit scope decision, never an automatic fallback.
- Storyboard-section change: the affected section (or its extracted node) remains the planning source of truth. A mouth-state edit triggers comparison with the existing clip; propose a rerender only when the clip no longer matches. Obtain generation authorization first.
- Extracted text changes: reintegrate the approved section without rewriting other shots. Extraction/reintegration alone never invalidates media.
- Pencil-only redraw: keep video bound to the text storyboard. Authorize any extra image generation separately; do not rerender video merely because visualization changed.
- Clip replacement: review the generated candidate and obtain approval before marking it current. Recheck its relevant QC and both boundary handoffs; regenerate neighbors only when actual failure evidence and separate scope authorization justify it. Reassembly requires authorization and replaces only approved affected clips.
- Model change: record the explicitly approved per-shot change, preserving the global model choice for unrelated shots. All attempts for the same issue remain in the shared ledger.
- BGM/mix change: reuse approved visuals. A clip change does not automatically require new BGM; inspect timing and mood first. A newly generated BGM must be approved before authorized recompositing.

After any regeneration:

1. Mark the output as a candidate pending review, and retain the last approved version.
2. Record the attempt, evidence, result, consumed/remaining authorization, and stop reason if applicable.
3. Only after approval, mark the selected filename/version current and use it for the affected downstream operations.
4. Reuse unaffected approved versions; make the final version selection explicit. Mixed creation dates are acceptable when assets remain compatible and approved, but silent substitution is not.
5. Recheck only affected QC and continuity, plus the assembled delivery checks where relevant. A new finding returns to reporting and authorization, never an automatic regeneration loop.
