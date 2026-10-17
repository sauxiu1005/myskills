# MiniMax H3 Full Reference Mode: Shot and Cut Direction

Use this reference when the user will generate the sitcom in MiniMax H3 with its all-in-one/full reference mode. Treat the interface's currently available aspect ratio, duration, resolution, audio, and reference slots as authoritative; do not invent unsupported controls.

The main Skill's v1.0.1 failure classification, authorization ledger, shared budget, and stop conditions govern every action here. This reference supplies creative/technical proposals, not extra attempts or permission to change locked specs, generate bridge shots, add sounds, or regenerate video after a mix failure.

## The H3 production unit: an explicit shot timeline

Do not leave cutting to an ambiguous phrase such as "cinematic montage" or "dynamic edits". Before writing the visual prose, create a cut map. It must enumerate every shot in order, its start/end time, shot size, lens, camera movement, actor blocking, action peak, cut point, and transition logic. A single H3 prompt may describe several shots when the user wants a multi-shot clip, but each shot segment must be independently specified inside that timeline.

Use one dominant action and one motivated camera move per segment, not necessarily a separate generated clip for each shot. Default to 2-4 seconds and usable handles when compatible with approved timing. If an internal cut fails, retain evidence and propose separate segment generation under the same cut map; obtain approval for changed packaging, added output count/cost, and any timing changes first. Each generated split output consumes the original unit's remaining allowance; do not bypass the cap or replace planned cuts with a vague zoom/montage.

## Required cut map

Include a table before the prompt text:

| Timecode | Shot ID | Framing / lens | Camera move | Action peak | Cut / transition | Continuity handoff |
|---|---|---|---|---|---|---|
| 00:00-00:02.5 | S01 | medium-wide, 35 mm | slow track left | character notices prop | hard cut on gaze | screen-right gaze to S02 |

Allowed transition labels are concrete and motivated: `hard cut on action`, `hard cut on reaction`, `match cut by hand/prop direction`, `eye-line cut`, `J-cut/L-cut with diegetic sound`, or `brief motivated dissolve` when a time/location change requires it. Do not write `smooth transition` without naming what matches across the cut.

For each cut, state four anchors: (1) outgoing screen direction, (2) incoming screen direction, (3) shared visual or audio cue, and (4) the exact state that must persist. If a cut intentionally breaks the axis or palette, label the story reason and establish the new geography in the incoming shot.

## Reference hierarchy

Give every reference an explicit role and index. A reliable stack is:

1. `REF_01_SCENE`: a clean, full-bleed location frame establishing geography, light direction, and recurring background anchors.
2. `REF_02_CHAR_A` (and optionally `REF_03_CHAR_B`): a single-character reference, preferably one clear full-body or 3/4 view; lock face, hair, wardrobe, height ratio, and silhouette.
3. `REF_04_PROP`: a single hero prop or the exact hand-held object when it drives the gag.
4. `REF_05_POSE_OR_TAIL`: a previous approved end frame or a simple action-pose reference for the next shot.

Use the fewest references that fully specify the shot. Three strong references are usually safer than a crowded collage. Never upload a contact sheet, multi-panel storyboard, UI screenshot, image with borders, or reference containing alternate outfits as a character reference; H3 may treat those panels as simultaneous scene content.

In the prompt, state what each reference controls and what it must not change: `REF_01 controls space and light only; REF_02 controls identity and wardrobe only; REF_04 controls shape and material only.` This prevents the scene image from rewriting the face or the prop image from changing the set.

## Full-bleed frame and anti-box rules

To avoid the boxed, card-like, or storyboard-panel look that can appear after reference conditioning, include: `edge-to-edge cinematic frame, no border, no frame-within-frame, no contact sheet, no panel layout, no UI, no letterbox bars, no poster typography`. Describe the shot as a photographed scene with foreground, middle ground, and background, not as a card, thumbnail, or illustration tile.

Keep important faces and hands inside a generous action-safe area. Do not force extreme edge crops or overly symmetrical centered staging. Use a motivated foreground occluder, practical light, and a readable horizon/room line to give the image depth without creating a decorative frame.

## Cut continuity recipe

Plan the cut in the map and encode the full local cut direction in the H3 prompt:

- **Match one axis**: preserve the 180-degree screen direction and state who is screen-left/screen-right.
- **Match one vector**: carry the hand, gaze, body, or prop movement through the cut in the same direction.
- **Match one state**: specify the exact prop state, hand occupancy, facial emotion, and light level at the outgoing and incoming frames.
- **Use a tail-frame handoff**: feed the approved outgoing end frame into the next shot as `REF_05_POSE_OR_TAIL` when supported. Otherwise write the state verbatim in both prompts.
- **Cut on action or reaction**: place the edit at the contact/turn/realization peak, not during a drifting camera move.
- **Bridge with sound**: pre-lap the diegetic sound of the next action by roughly 2-6 frames in the edit; do not ask H3 to invent a transition effect.

For an H3 multi-shot prompt, write the cut as an in-prompt timeline, for example: `00:00-00:02.5 SHOT S01 medium-wide 35 mm, slow left track; cut hard on the character's gaze at 00:02.5. 00:02.5-00:04.5 SHOT S02 50 mm two-shot, short push-in along the same gaze vector; cut on the hand contacting PROP_01 at 00:04.5.` Never bury a cut instruction after a long paragraph of style adjectives.

For a difficult transition, first check whether approved footage supports a clean edit. A neutral bridge shot may be proposed only with its story role, duration, new output count, continuity impact, and cost; approve the cut-map change and generation scope before creating it. Do not treat bridge generation as free repair. Avoid crossfades, digital whip pans, or zooms that hide mismatches unless explicitly chosen.

## Texture and image-quality safeguards

H3 can drift toward waxy skin, oversharpened edges, unstable fine patterns, flickering practical lights, and exposure changes between cuts. Counter this with concrete physical language:

- `natural skin pores, fine fabric weave, matte painted surfaces, restrained micro-contrast, soft highlight roll-off, stable exposure, consistent white balance, fine grain applied uniformly across the whole frame`;
- name the material being touched (`brushed aluminum`, `aged oak`, `cotton knit`, `ceramic glaze`) and the light source causing its highlight;
- keep the lighting diagram identical across coverage: key direction, color temperature, shadow softness, and practical brightness;
- ask for `subtle texture movement caused by the action` rather than generic "high detail" or "ultra realistic";
- leave typography, logos, screens, and tiny labels for post-production; use a clean blank surface in H3.

Avoid stacking `8K`, `hyper-detailed`, `HDR`, `glossy`, `crystal sharp`, and `cinematic` as empty quality words. They often produce brittle edges and plastic highlights. Prefer a restrained finish and grade all selected clips together in post.

Add this negative block when appropriate: `boxed composition, storyboard panels, contact sheet, border, frame-within-frame, letterbox bars, UI elements, poster text, plastic skin, waxy faces, oversharpening halos, unstable fabric weave, crawling linework, texture flicker, exposure pumping, white-balance shift, random lens change, unmotivated zoom, morphing hands, duplicate props, identity drift`.

## H3 prompt skeleton with explicit cuts

```text
[MODEL/SPEC] MiniMax H3; {available aspect ratio}; {available duration}; {reference mode}.
[CUT MAP] {numbered shot timeline with exact timecodes, shot sizes/lenses, camera moves, action peaks, cut points, and transition labels}.
[STORY BEAT] Shot S01: {visible change and comic function}; Shot S02: {visible change and comic function}; each segment has one dominant action.
[REFERENCE ROLES] REF_01_SCENE controls space/light only. REF_02_CHAR_A controls identity/wardrobe only. REF_04_PROP controls object shape/material only. REF_05_POSE_OR_TAIL controls incoming pose and direction only.
[VISUAL FINISH] Edge-to-edge cinematic sitcom frame; {camera/lens}; {lighting diagram}; natural pores, fabric weave, matte surfaces, stable exposure, restrained micro-contrast, uniform fine grain.
[SHOT-BY-SHOT DIRECTION] S01 {start pose -> action -> reaction/end pose; screen-left/right; camera move; cut at timecode}. S02 {incoming state -> action -> reaction/end pose; camera move; cut at timecode}. Continue for every shot.
[CUT HANDOFF] At each cut, match {axis/vector/eye-line/prop state/audio cue}; state whether it is a hard action cut, reaction cut, match cut, eye-line cut, J-cut, L-cut, or motivated dissolve.
[AUDIO] {diegetic cue and room tone}; dialogue only if explicitly requested and speaker is visible; no music or generated text.
[NEGATIVE] {anti-box + texture + continuity negatives}.
```

## Recovery decisions, not an automatic ladder (v1.0.1)

### 1. Classify from evidence

- Execution failure: explicit terminal failure/rejection with no usable output. Diagnose the actual reason while preserving approved content/specs. A successful render with retrieval trouble should be recovered, not regenerated. Unknown/timeout status requires job/result reconciliation first; if unresolved, pause without another submission.
- Content failure: a rendered take violates identity, action, continuity, framing, cuts, or dialogue. Record shot/version/timestamps and failed or unverified checks. Do not call it an execution error to gain a free retry.
- Audio/post failure: inspect the original picture, original audio, added BGM, and mix/export separately. Gain, fade, sync, routing, or export faults call for authorized deterministic repair, not new video. Defective BGM may justify a scoped music-only replacement, not video regeneration.

### 2. Choose the smallest proposal

Diagnose before changing variables. Candidate changes include correcting a proven reference-binding error, simplifying an action, retiming, or choosing a cleaner approved continuity reference. Removing any reference, character, or prop; altering duration, model, spec, or cut topology; or generating a new anchor/bridge requires explicit approval. Preserve unaffected creative constraints and approved outputs; do not rewrite the whole style prompt on each attempt. Keep neighboring shots unless evidence proves their actual dependencies invalidated.

For a known execution error, the main Skill allows at most one cause-corrected execution retry by default, only within precise preauthorization and the shared limits. Content changes always need an approved repair scope; first-pass/storyboard/resolution approval alone does not grant it. If scope is already precisely preauthorized, do not ask again.

### 3. Low-spec validation and subsequent delivery

A lower-cost test is optional additional generation, never a mandatory recovery rung. Before it, state the affected unit, supported test resolution/aspect/duration, output count, purpose, cost uncertainty, remaining allowance, and how the final target spec will be met. Obtain explicit approval to deviate from the locked spec even temporarily.

After a passing test, distinguish:

| Next operation | Budget/count treatment | Approval and evidence |
|---|---|---|
| Deliver the accepted test as a lower-spec version | No new generation | User must explicitly accept the changed delivery spec; do not claim original target compliance |
| Deterministic enlargement/transcode of the existing test | Post operation, not video generation; charge shared post budget | Approve method/output spec first; do not claim native high-spec detail or reset prior generation counts |
| Generate a new target-spec take | Another video-generation attempt plus shared cost | Approve or reuse an explicit conditional authorization; recheck identity, cuts, action, and audio because test success does not guarantee the new take |

An explicit plan may preauthorize both one probe and one conditional target-spec operation, with their separate counts/costs, avoiding a redundant question. Without that scope, test approval never authorizes upgrading. If there is not enough remaining budget/attempt allowance for the target operation, stop and ask for an in-scope alternative instead of spending silently.

### 4. One shared cap and stop rule

“Three attempts” means at most initial generation plus two additional actual generation attempts for the same issue/unit, across the main file, this reference, variants, models, and resolutions. It is a ceiling, not three retries or a minimum variant count. Every low-spec probe and high-spec regeneration counts, including successful tests; split outputs are charged against their parent unit's remaining allowance. Technical preflight rejections and post operations are logged under their real classes, not falsely called generated videos. Unknown billing stays unknown.

Example: initial target-spec take fails QC (attempt 1); an explicitly approved lower-spec probe passes (attempt 2); one separately or conditionally authorized target-spec regeneration uses attempt 3. There is no fourth “upgrade attempt.” An edit/remix of existing approved media is a separate post operation, still requiring budget and authorization.

Stop at acceptance, any user/platform or shared attempt/budget/time limit, user pause/cancel, external blockers, unknown job state, no material improvement, or an unapproved next step. At the cap, preserve outputs and report the unresolved issue. Offer an authorized edit using existing footage, user-supplied media, a labeled review/partial version, or a materially revised plan; do not mechanically restart the same issue or automatically generate a new motion segment, bridge, reaction, or sound cue. New Foley/laughter remains outside the main Skill's BGM-only sound branch.

A polished still frame is not evidence that a take's continuity or cuts passed. Record pass/fail/unverified by actual coverage, and never replace the approved version with a new candidate before review.
