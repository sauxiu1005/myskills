# Generation Failure and Drift Fallback Policy (v1.1 — Audio-Mode Aware)

## Failure modes (v1.1 expanded taxonomy)

A clip can fail in five ways. v1.0 covered two of them; v1.1 adds the three character-confusion modes that are the dominant failure type for 3D animated shorts with dialogue.

| Failure mode | What it looks like | Most likely cause | v1.1 addition |
|---|---|---|---|
| **Render failure** | Clip doesn't generate at all, errors out, or returns blank. | Model outage, prompt parse error, reference image issue. | (v1.0) |
| **Visual drift** | Spatial anchor violation: door-frame on the wrong side, lighting flipped, character exits the wrong edge, scene doesn't match the scene card. | Prompt too long, model mis-parsed the reference anchors. | (v1.0) |
| **Character-identity drift** | The on-screen character looks like a different character than the one named in the row (wrong face, wrong costume, wrong hair). | Reference image was not bound, prompt was ambiguous about identity. | (v1.0) |
| **Character-confusion lip-sync (v1.1 NEW)** | The on-screen speaker is the wrong character — A's dialogue line plays while B's mouth is moving, or both A and B are mouthing the same line, or A's mouth moves when no one is speaking. | Prompt did not specify the speaker explicitly, or the row violated the single-speaker rule. | v1.1 |
| **Mouth-state violation (v1.1 NEW)** | A character's mouth is open / moving when it should be closed (during narration, during a listening second, during a silent beat), or the speaker's mouth is closed when their line is playing. | Prompt did not include the audio-mode lock, or the row's `Mouth State` quadrant was empty. | v1.1 |

## Bounded rework contract (v1.1.11; applies to every ladder)

QC verdicts and authorization are separate records. A failed render, drift, mouth-state violation, or failed quality gate never grants permission for another generation. First report pass / fail / unverified / not applicable with shot IDs, artifact versions, evidence time ranges, and the effect on delivery. Do not infer a cause from a symptom alone; the causes above are hypotheses to check.

Before extra image/video/audio generation or recompositing, verify explicit authorization for the affected artifacts, operation, model/spec/reference changes, number of outputs/attempts, cost exposure, and stop conditions. If absent, show the rework card below. First-pass approval and a generic “continue” do not authorize a fallback ladder. A precise existing authorization may be reused only within its remaining scope and limits.

- Default: one approval permits one additional generation per named artifact. A bounded batch may be explicitly preauthorized; never assume permission for all strategy levels.
- Maximum for a shot and the same issue: initial generation + at most two additional attempts (three total). Count actual attempts, including unusable renders and generated candidates that fail QC. Keep one cumulative ledger across generic, lip-sync, mouth-state, and visualization strategies; do not restart the same issue's count on model switches, shot splits, renamed failures, or document edits. Split outputs must fit the remaining authorized output/attempt budget; otherwise stop and present a materially different plan, not a disguised retry reset. Stricter platform limits prevail.
- Stop at the acceptance target, authorized attempt/budget/time limit, cumulative cap, cancellation/pause, external blocker, no material improvement of the same defect, or any unapproved change. Do not invoke later rungs automatically. At the cap, close the round and report; do not restart the same issue through another permission card.
- Preserve approved unaffected outputs and the last approved versions. Patch only affected rows/sections; inspect adjacent handoffs without automatically regenerating adjacent clips. Reassemble only after a replacement is approved and reassembly is authorized. Reuse BGM if timing and mood remain suitable.
- Changing model, dropping references/characters/props, simplifying required action, splitting shots, changing duration/audio mode, skipping a shot, or adding new media requires explicit change approval. First revise and approve only affected planning sections, then obtain generation authorization. Never turn dialogue into narration as an automatic fallback: narration-led production is outside this Skill.

## Candidate strategy ladder — not an execution queue

1. **Diagnosis and local repair proposal**: check real source bindings, failed timestamps, speaker, mouth-state, and continuity. Prefer a document-only correction or local edit when it solves the problem; a text fix is not a media fix. Do not generate during diagnosis.
2. **Same-contract targeted retry**: only after authorization, change the prompt in a substantive, evidence-backed way while preserving approved story, cast, refs, duration, audio mode, and model. Produce only the affected artifact, then inspect it and report the result. Stop if it meets the agreed target.
3. **Changed-contract alternative**: only if still below the attempt cap and an authorized retry materially helped, propose the smallest needed change. Model switch, split, shorter shot, altered references, or altered cast are choices for the user, never automatic second/third retries. Explain continuity, cost, and spec consequences before acting.
4. **Close or hand off**: when blocked, capped, or not improving, retain outputs and offer diagnosis-only, a clearly labeled review version, user-provided media, or a separately approved materially different plan. A placeholder is not a rendered clip and does not count as completion.

Target-specific proposals within that shared ladder:

| Observed issue | Same-contract candidate | Changed-contract candidate requiring approval |
|---|---|---|
| Render failure / spatial or identity drift | Correct a proven binding or prompt error; restate the affected reference anchors without discarding the other refs | Different supported model, simplified action, or revised shot structure |
| Dialogue assigned to the wrong character | Restate the exact speaker and all non-speakers' closed-mouth intervals; verify the approved speaker reference | Split the dialogue into single-speaker sub-shots or change framing, with corresponding row/section approval |
| Mouth-state violation | Carry the exact per-second mouth-state intent and correct its actual contradiction | Shorter shot or changed composition; never silently remove supporting characters |
| Silent shot contains speech-like motion | Remove contradictory speech instructions and preserve all required silent action and cast | Revised staging approved by the user; never assume silent mode cannot fail |
| Imported narration/mixed content conflicts with project locks | Report the conflict and pause the affected shot | Confirm a scope change or an appropriate handoff; do not silently activate narration-led production |

## Rework choice card and ledger

Before the card, show: affected shot/artifact versions; failed or unverified check and evidence; proposed change and preserved content; exact outputs and additional attempt count; model/spec/reference changes; known cost or “cost unknown”; remaining limits and stop conditions.

- Authorize one targeted retry of the listed artifacts under the displayed scope (only while below all limits).
- Revise the proposal or choose a materially different plan (approval here is planning-only unless generation scope is explicitly included).
- Keep current outputs for review with defects/unverified items clearly labeled; do not generate.
- Supply replacement media for inspection; do not generate.
- Stop and retain current outputs and findings.

Record each authorization, attempt, source/output version, result, consumed/remaining limit, and stop reason. User acceptance of a known defect may authorize delivery labeled with that defect; it never changes a failed QC result into a pass.

## After all clips are rendered

Place the rendered clips on canvas in shot order, group them as `<title> shot clips` (no longer hard-coded to a single model name), and show a user choice card:

- Approve clips and composite full film (recommended)
- Re-render selected clip (with the same or a different video model)
- Fix character mismatch
- Fix scene mismatch
- Strengthen storyboard cleanup
- Fix spatial anchor drift across clips
- **v1.1 NEW: Fix speaker-binding issue on selected clip**
- **v1.1 NEW: Fix mouth-state violation on selected clip**

Clip review records findings first. Selecting “fix” opens a scoped proposal unless a precise authorization already exists. A drift or speaker-binding failure does not trigger rendering or model switching automatically. Keep defective clips out of qualified-final assembly; an explicitly requested review assembly may include them only with clear defect notes and its own authorized scope.

## Storyboard visualization fallback (opt-in images only)

Use the same authorization, cumulative limits, and stop conditions above. Report the failing shot/panel and retain the authoritative text storyboard. First propose a clearer layout and the existing identity, scene, audio, and mouth-state bindings for that image only. Do not redraw other shots or regenerate their videos.

Simplifying labels, changing panel count, block-color visualization, or omitting a pencil image are alternatives for explicit approval, not automatic rungs. Preserve complete timing, audio/anchor information, and mouth-state intent in the authoritative text; never silently drop beats or alter shot duration. Changing the actual shot structure requires the affected Step 5 rows and Step 6 sections to be approved before rendering. Dropping an optional pencil image does not itself invalidate a valid video.

In default text-only mode, repair only inconsistent sections/rows within the requested text-edit scope, recheck those sections and their handoffs once, and report unresolved issues instead of looping. Text repair does not authorize media generation. `storyboard-guidelines.md` reuses this policy; do not maintain a separate retry count or ladder there.
