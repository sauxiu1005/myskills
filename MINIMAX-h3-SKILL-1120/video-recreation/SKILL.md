---
name: video-recreation
description: |
  Recreate video action or replace elements from videos, frames, or descriptions. Offer analysis, prompts, or authorized video using domestic-client capabilities. Not for ordinary edits or subtitles.
trigger-words: [复刻视频, 视频复刻, 视频拆解复刻, 复刻提示词, 视频元素替换, 视频换人, 视频换背景, 产品替换视频, 跨物种替换, 视频重绘, recreate video, video recreation, video deconstruction, video element replacement]
---

# Video Recreation

An independent skill with two paths: remake/replace using the original video as generation input, or remake from analysis alone. Extract intent and media facts, ask only for missing decisions, analyze, write prompts, and execute within authorization. An unchanged reference remake is a valid goal. This is not a redirect to two legacy skills.

## Domestic-client adaptation

- Run against the domestic client's currently exposed capabilities and interface for models, display names, input combinations, specifications, sound, and billing. Do not inherit an overseas catalog, a fixed two-model menu, or old price/speed rankings. A Chinese interface does not prove model availability.
- Identify the current model filter and account availability. A filtered capability list is not a complete domestic inventory. Explain when the requested model is unavailable in this session; let the user decide about changing the model filter. Never silently change regions/accounts or call overseas services.
- Enter model selection only for video production. Validate an explicit choice first. Otherwise filter executable models by input path, required references, output, and sound needs, then recommend using the current runtime's recommendation order. Do not claim better speed, cost, or quality without evidence.
- Follow the user's current language for interaction, questions, and prompt instructions. Use Simplified Chinese in Chinese domestic sessions and honor explicit requests for another language. Preserve user-specified dialogue, visible text, and brand copy; client region does not authorize translation or rewriting.
- Prefer real readable paths for uploads and current canvas media. Read public video links only when accessible and permitted in the current environment. Domestic-platform share pages, short links, and login pages are not media files. If access fails, request the original upload; never promise universal downloads or bypass access restrictions.
- Without readable media, provide only bounded analysis and disclose its basis. Never invent downloaded files, sound, or frame-level evidence. Cover/showcase media are neither task references nor runtime dependencies. Migrating them requires a real upload result, not a fabricated domestic-domain replacement.
- Do not bind execution to the author's computer directories, overseas accounts, storage addresses, or credentials. Deliver into the current session project. Reuse subjects through the currently available Subject Library and assets; do not invent library entry points or connection status.
- This section adapts environment and capability discovery only. It preserves A/B input authorization, natural adaptation, review, spending authorization, and per-seam rules; adaptation never authorizes model selection or generation on the user's behalf.

## Core boundaries and session state

- Complete both paths inside this skill. Do not load or redirect to another skill or restart external planning. Analyzing a video is not permission to submit it to generation.
- Path A uses the source video as generation input. Path B uses it for analysis only. The user chooses; an upload, difficulty, or words such as recreation/replacement do not choose the path.
- Use natural-language prompts rather than model-specific or fixed universal templates. Do not mandate headings, shot-field order, or word counts. Model recommendations do not change the writing method.
- Internally check the goal, subject count and relationships, action/timing, actual reference contributions, and necessary spatial/sound requirements. Skip inapplicable checks. This checklist is not a prompt template.
- Do not invent people, props, story, lighting, skin texture, camera work, or a mandatory wide opening. User changes and actual media contributions take priority over model preferences.
- Do not read model prompt-writing cards. Capability discovery is for execution constraints, inputs, and sound, not prompt-format rewriting.
- For video production with no chosen model, ask; runtime defaults cannot bypass this decision. Prompt-only delivery does not require model selection. A recommendation is not generation consent.

### Internal state, not a user questionnaire

| State | Record |
| --- | --- |
| Task and media | Current task, source video, independent references and roles; recheck changed file versions. |
| Deliverable | Unset / analysis only / prompts with necessary plan / video; record extra reports or subtitles separately. |
| Input path | Unset / A source-video input / B analysis only; bind source and range. |
| Content goal | Unset / unchanged reference remake / explicit changes; include retained content, target subjects, and intervals. |
| Specifications and sound | Confirmed model, resolution, duration, frame, original/new/muted sound, and sources. |
| Pending question | At most one; record type, actual option order, affected scope, and next action. |
| Review | Not required / awaiting review / current version accepted; explicit review blocks execution. |
| Generation authorization | Unapproved / approved current scope; record clip count, preview, independent sound, and additional-attempt budget. |
| Execution and results | Unsubmitted / running / successful / failed / unknown / cancelled; task identifiers, outputs, attempts. |
| Segments and seams | Cut evidence, continuity strategy and dependencies for each seam; generated-output version, frame position, retained endpoint, and approved frame use. |

This is session state, not durable preference. Old outputs and authorization do not apply automatically to new tasks. Entry stop points override later general steps: analysis-only ends after STEP 2; prompt-only ends after the necessary path writing, without paid execution.

### Short replies, authorization, and changes

- “First” or “second” maps only to the one current question and its recorded option order, not path numbering or a previous model menu.
- “Use the recommended one” answers only the model question; it does not also approve inputs, a plan, or extra spending. “OK/confirm” accepts only the current explicit matter. Clarify “continue” when no next action is pending; do not auto-generate.
- Record multiple explicit answers supplied together, but ask only one pending question at a time. Handle a clear new request as new intent, not as confirmation of the old question.
- “Generate one” or “generate directly” can authorize the currently known goal. After missing path/model decisions are supplied, do not mechanically ask for the same authorization again. Choosing a model alone creates no authorization.
- “Show the prompt first” retains the video goal but blocks execution until the current plan is accepted. Acceptance lifts review only; valid existing generation consent may then apply unless the user said not to generate yet. Otherwise request generation authorization.
- Revalidate affected parts when path, source, primary subject, model, sound, or duration changes; do not re-ask unrelated facts. Changes to content, inputs, specifications, or spending invalidate the old review version. If prior review was required, show the revision and wait unless the user explicitly authorizes generation with the changes. “Edit the prompt” changes the document only.
- If generation is running, establish execution status first. Use an available cancellation mechanism if possible; if termination cannot be confirmed, explain and wait. Do not submit a revised job concurrently or treat unknown status as failure.

## STEP 1: Lightweight checks and minimal questions

Read the request and existing choices, then obtain real video metadata: duration, frame, resolution, and audio-track presence where tools can prove it. This is a feasibility check; detailed semantic analysis belongs in STEP 2. Reuse facts when the file is unchanged.

Use known attachment paths directly; do not infer content from names. If only a link exists and no readable media is available, disclose that and use available media access or request an upload. Never invent download success. Use media capabilities for media work, not shell/Python substitutes.

### Entry and stop points

- Analysis only: analyze and deliver. Do not ask for a generation input path or model; do not generate.
- Recreation prompts only: record prompt delivery. If a real source video exists and whether generation will see it is unresolved, ask the input-path question. Do not require a generation model or generate.
- Generate a new video: record authorization for the current goal, fill missing path/content/specifications in order, and execute only after all gates pass.
- Attachment plus command, or “recreate this” without a clear deliverable: ask input path first, then prompts-first versus direct generation. Answering the path is not paid-generation authorization.
- Screenshots/descriptions without a video: treat as analysis evidence, not automatic generation inputs. Do not ask an impossible source-video-input question. Path A requires a video if the user insists; still clarify an unknown deliverable.

### First input-path question

Except for analysis-only work, when a real source video exists and its use is unresolved, ask: **When generating the new video, should the uploaded original video be an input to the generation model?**

1. **Use the original video as generation input**: Recommended when the same action is important, to follow motion, camera work, and timing more closely; not a frame-perfect guarantee. Path A, STEP 3A.
2. **Do not use the original video as generation input**: Analyze it only and regenerate from natural language; motion details may vary. Path B, STEP 3B.

Keep this order while letting the user choose. Do not re-ask explicit input permission or prohibition. “Refer to it” and “replace the person” do not settle the path. For multiple videos with unclear roles, clarify which video/range instead of uploading all.

Check feasibility after path selection and before a long plan or paid preparation. Explain oversized inputs or unsupported combinations and offer segmentation/additional media choices; never silently switch paths or trim content. Early feasibility need not resolve exact shot boundaries; final segmentation follows semantic evidence. For production, record accepted call count, assembly goal, and spending scope; one finished video may require multiple calls. For prompts only, state necessary execution limits without demanding generation spending approval or a model choice.

### Ask only for remaining gaps

1. Unknown deliverable: ask **What would you like first?** Offer “Prompts first” (stop at the document) and “Generate directly” (authorize current video scope); also accept analysis-only free text.
2. Pure recreation without requested edits means an unchanged reference remake. If a replacement target, matching subject, or media role is unclear, inspect the relevant region first. Ask only if multiple valid interpretations remain. Both paths allow no content changes.
3. For production with no model, use STEP 4's live selection question. Preserve an existing choice. If resolution is unspecified, use and disclose that model's current runtime default; user specifications take priority, and conflicts require clarification.
4. Fill only execution-critical gaps. Duration and frame can inherit measured source metadata with a short notice. Ask how to handle incompatible sizes/lengths.
5. Honor requested reports or prior review. Otherwise communicate short summaries rather than turning the internal checklist into a questionnaire.

## STEP 2: Analyze as needed; separate checks from deliverables

- Inspect subject count, identity anchors, motion/timeline, setting, camera/cuts, spatial relationships, contact/occlusion, lighting/materials, depth of field, editing rhythm, and audible sound. Metadata proves dimensions/time; semantics proves content.
- For a simple cup/background replacement, inspect the changed object and contact, occlusion, and cross-shot stability. Give a change summary and concrete risks, not an automatic long report.
- Deepen analysis for precise recreation, multiple shots, or an explicit detailed breakdown. Reinspect only missing evidence rather than the whole clip repeatedly.
- For assembled segments, examine every seam: distinguish an original cut from a technical split inside one continuous shot. Decide cuts before tail frames. Inspect ambiguous boundary footage; do not infer continuity from duration, the same person, or a similar setting. A clear cut never uses the previous segment's tail frame as reference or starting frame; follow STEP 5.
- When dense evidence is needed, create contact sheets: typically 10–12 frames for sections up to 15 seconds, denser for rapid changes. Do not duplicate frames merely to meet a quota. Split longer sources into readable contiguous sheets and state counts and time coverage.
- Put actually created contact sheets on the canvas with source linkage. If none were extracted, say so. Frame extraction is not mandatory for every task, and extracted frames are not automatically generation inputs.
- Deliver reports only for requested analysis/reports: evidence, subjects/settings, motion/camera/sound, uncertainties, and risks. Prompt-only means prompts and necessary notes. Video-only does not require extra documents.
- Use stable subject names and examine cross-shot identities, entrances/exits, similar subjects, transparent foregrounds, and contact. Locate risks in specific regions/actions instead of merely saying artifacts are possible.
- Screenshots, descriptions, and inaccessible audio do not prove motion, timing, or sound. Label inference and gaps. Ask the shortest blocking question, or deliver bounded analysis when possible.

## STEP 3A: Remake or replace with source-video input

### Content goal and scope

Path A supports unchanged reference remakes and specified edits. “Remake it without changing anything” is complete: skip replacement-target/media questions. Generation is not a frame-by-frame copy. Edits can replace people, backgrounds, products, objects, or combinations. Subjects may be real people, animals, anthropomorphic characters, puppets, robots, or cartoons; face-only changes are possible. Ask only for actual gaps, never invent replacements.

For edits, establish what changes, which subject, and whole-video versus shot/time range. For unchanged remakes, record retained content. In both cases check required actions, relationships, camera, framing, background, and sound; separately bind similar subjects.

### Fixed natural adaptation

- Use natural adaptation without asking for conservative/natural/complete-remodel intensity levels.
- Preserve primary motion, camera work, framing, editing rhythm, spatial relationships, and story meaning unless the user explicitly changes them.
- Adapt motion to the new species, build, proportions, structure, material, and viewpoint instead of imposing incompatible human anatomy.
- Preserve defining identity, silhouette, costume/equipment, markings, and body extensions. Human hands or clothing in the source do not authorize removing the new subject's defining traits.

### Media fit and task difficulty

Grade replacement/independent references only when they exist. An unchanged remake needs no invented replacement media. Check subject count, identity traits, silhouette completeness, angle, pose, clarity, occlusion, and scale differences:

- A: Clear, with similar angle/composition; directly usable.
- B: Identity is clear but angle, pose, or proportions differ substantially; natural adaptation is needed.
- C: Heavy occlusion, missing key angles, or highly complex motion; suggest more media or a short preview.

Assess task difficulty separately from whether a call is technically legal:

- Low: One subject, small motion, little occlusion, similar reference angle; likely more stable.
- Medium: Noticeable motion, angle changes, partial occlusion, or substantial proportion differences; possible edge instability, flicker, or action deviation.
- High: Multi-person replacement, fast action, complex dance, transparent occlusion, frequent exits, strong perspective, or large cross-species differences. Explain identity drift, anatomy distortion, costume flicker, intersections, and prop drift.
- Extreme: Insufficient media combined with overlapping subjects, fast action, transparency, camera changes, or many targets. Position as testing/creative preview; additional angles, shot separation, masks, or manual finishing may be necessary.

State what can likely be retained, the most vulnerable region/action, likely failure appearance, appropriate use, and whether more references/preview would help. Never promise perfect, frame-exact, artifact-free results. Risk alone does not block execution unless inputs are missing or capabilities do not support it.

### Reference roles and spatial relationships

- Source video: Main action, camera work, temporal structure, spatial relationships, and approved retained sound.
- Character image: Identity, face, hair, clothing, build, character structure, and materials.
- Background image/video: New environment, spatial structure, perspective, and world.
- Product image: Identity, shape, proportions, structure, packaging, materials, and brand details.

Bind every asset to its corresponding subject in actual input order. Character references do not automatically change the background; backgrounds do not change people; product references do not change hand action. Ordinary references are not automatic keyframes.

In natural language, explain changes, retained content, each reference role, spatial scale/motion/occlusion/contact adaptation, cross-shot identity, and sound. These are completeness checks, not required prompt ordering or a template.

### Cross-species and nonhuman subjects

- New species, muzzle/mouth, and body proportions take priority over human anatomy. Retarget lip motion, expression, and action while preserving approved performance emotion and speech rhythm.
- Do not copy human lips, teeth, tongue, or jaw directly onto animals. Preserve ears, tails, paws, horns, wings, and defining silhouettes.
- Adapt standing, holding, interviewing, and occlusion to the new structure rather than removing defining anatomy to fit the old motion.

### Real source-video input

Actually supply the approved source video/segment through a supported video input. Analysis, prompt text, and extracted stills do not satisfy Path A. Keep video, image, and audio inputs in their appropriate media categories.

If the selected operation cannot accept the video, duration, or combination, explain and let the user choose a compatible plan. Never silently degrade to Path B or claim unused video was supplied. Segment long sources by shot continuity and actual limits, sharing identity anchors and recording seams. Clear source cuts do not use previous tail frames; only technical splits within one shot enter STEP 5's continuity assessment. Tail frames cannot replace the promised source-video input.

## STEP 3B: Recreation from analysis without source-video input

### Establish the recreation goal

Honor specified retained content, replacements, and style changes. Without requested edits, recreate evidence-supported subject relationships, action, composition, shot order, rhythm, and sound intent. New characters, products, or worlds come only from user intent and approved assets.

### Natural-language prompts

- Describe intended visuals, action, camera motion, spatial relationships, sound, and continuity in prose organized by actual complexity.
- Divide by necessary shots/time points without fixed headings, fields, or segment lengths. The description must stand alone without the model seeing the source; “copy the original exactly” is not a substitute.
- Group by continuity instead of mechanically splitting every 15 seconds. Compatible subject, setting, action, and sound should stay coherent; split for real cuts, scene/style changes, dependencies, or execution limits.
- Describe the starting state, continuous action, and usable ending state. After clear cuts, generate the new shot's framing/viewpoint/action phase without previous tail-frame references or keyframes. Assess tail-frame continuity only for technical splits without a cut. Prompt-only delivery may describe the plan but cannot claim ungenerated frames exist or passed inspection. These remain checks, not a template.
- Ground camera, lighting, materials, and actions in evidence; empty words such as cinematic/premium are no substitute. Do not impose a wide opening.

### Actual generation-input boundary

- Source video, analysis segments, contact sheets, and extracted frames are analysis-only by default. Never secretly supply them as video/image references or keyframes to bypass the user's choice.
- Separately provided or explicitly approved character, scene, product, and style references can be used. Bind each contribution individually in actual input order rather than listing filenames.
- Record tail frames from newly generated videos separately from source extractions. Generated tail frames may support explained, approved continuation without authorizing source video/frames. Neither tail-frame use applies at a clear cut.
- If the user later approves a specific source still as an image input, clarify that new scope. One approved frame does not authorize the entire source video. It remains Path B while the source video file is not supplied.
- Do not implicitly reuse the source soundtrack. Recreating sound intent is not direct audio reuse; extraction for generation or finishing needs explicit consent.

## STEP 4: Model, sound, and execution gates

### Recommend a model; never choose for the user

For video production without a model choice, ask after the input-path and basic feasibility checks, not after writing a long plan. First discover models and per-model capabilities currently available in the domestic session. Do not read prompt-writing cards or retain a fixed overseas two-model menu.

Ask: **Choose the video generation model for this task.**

- Offer executable models for the current path/media combination, narrowing to a few relevant choices when useful. Do not add incompatible choices to reach two options. The user may specify another model for validation.
- Copy each official display name exactly from the current catalog as the option title. Put specifications, purpose, recommendation, and known limits in the description. Place the recommendation first and mark its description, never append parentheses, resolution, recommendation suffixes, numbering, prices, or aliases to a model name.
- Use the confirmed resolution, otherwise disclose the model's current runtime default. Never transfer one model's specifications, minimum duration, or sound capabilities to another. Resolution alone is not a universal quality ranking.
- Recommend using current runtime ordering and task compatibility, respecting expressed preferences among compatible choices. Speed, price, and quality comparisons need current evidence. Billing follows the current client interface; do not invent credits, currency conversions, or durations.
- Record the actual displayed order and recommendation. “Use the recommended one” accepts only the recommendation explicitly made for this task and still executable. If none was presented, offer a choice rather than reusing a previous session's first option.

### Checks before the model question

- Map current official display names to callable models and filter by path, inputs, outputs, and sound requirements; a same-named menu item alone is insufficient.
- Check that each title exactly matches the catalog and specifications/recommendations remain in descriptions or the question. Keep internal identifiers out of ordinary user communication.
- Do not repeat the question for an already confirmed, executable model just to reintroduce specifications. Preserve choice, path, media, and authorization.
- On question validation failure, distinguish malformed titles, changed catalog entries, and real unavailability. Correct the title or refresh capabilities, then resend the necessary question at most once. No identical retries or paid generation to test the question. If it still fails, explain the blocker without looping, switching models, or changing authorization.
- A failed question is not a failed generation. Say generation was not started only when non-submission is known; do not infer the billing state of other work.

### Capability adaptation and execution specifications

- Let the runtime resolve the selected official model and execution operation from its current catalog. Do not use display text, recommendations, or legacy identifiers as execution parameters. Distinguish standard, fast, and other variants.
- Path A must support actual promised video input and the intended operation. Validate reference-based remaking, source editing, motion transfer, and extension separately; they are not interchangeable merely because they handle video. If motion transfer ignores textual edits, explain this and use it only when the target image already contains the approved appearance/environment. Additional image work or an operation change needs appropriate authorization.
- Path B uses text or approved independent references without the source video. Ordinary references do not automatically become keyframes. Explicit keyframe continuation requires user instruction or plan approval. Check input compatibility and never discard promised references for continuity. Clear cuts still prohibit previous tail frames.
- For each model and operation, validate output duration, individual/aggregate reference durations, counts, formats/sizes, resolution, frame inheritance, sound, and mutually exclusive input groups. Do not use a family's aggregate capability list. Segment by real shots and effective limits, not fixed seconds.
- Distinguish source duration, generated-clip duration, added extension duration, and final extended duration. Obey inherited source duration/frame when required. If the user wants an unsupported change, decide a compatible plan first; never pretend the setting took effect.
- Even with one executable option, explain limits and wait for the choice. With none, preserve analysis/documents and offer more media, adjusted constraints, or prompts-only delivery. Model/path changes, omitted references, segmentation, or changed confirmed specifications require the corresponding decision; do not silently downgrade.
- Revalidate only affected scope when filters/account capabilities change. If an earlier chosen/recommended model is unavailable, “use the recommended one” cannot silently mean the remaining model.
- Prompt-only work needs no model choice. Record an explicit model and necessary limits without starting generation.

### Sound strategy and model capabilities

Track original sound, newly generated sound, and mute separately with scope. Music and dialogue may have different requirements; do not collapse them into one global switch.

- For an unchanged Path A remake or visual-only edit, propose retaining the original soundtrack without remaking dialogue and briefly disclose this before submission. “Change the person, keep the sound” is sufficient; do not re-ask audio permission. Clarify genuine ambiguity or altered source timing.
- Path B recreates sound intent by default, never implicitly extracts the original soundtrack. Direct reuse needs explicit agreement. Clearly established sound intent generated with the main video may belong to current scope; extra paid audio work needs separate disclosure and authorization.
- Replacing a person visually does not replace their voice. Change voices, remove sound classes, or mute only when requested. Nonhuman characters adapt mouth structure without silently changing dialogue.
- No native sound control does not prove silent output. Validate sound generation, soundtrack retention, and audio inputs for the chosen model/operation; never borrow another model's sound controls. Inspect the actual output track and apply approved sound handling. Disclose unknowns rather than asserting silence.
- Prefer deterministic soundtrack replacement to retain original audio, avoiding model-remade dialogue. Verify source/generated timing correspondence first. Reordered, sped-up, or resized timelines cannot receive the full soundtrack blindly; do not alter action without consent to make it fit. Ask if the plan must change.
- If the source has no audio track, say so; retaining it does not mean inventing new sound. Follow explicit new-sound requests separately.
- Copy original audio when container compatibility permits. If re-encoding is necessary, do not claim byte identity. Record timing/sync checks; matching total durations alone does not prove lip sync.
- Subtitles remain off unless requested. Dialogue, narration, or voice replacement does not imply subtitles. Preserve exact text/UI as requested and include necessary deterministic overlays in the approved plan.

### Review and generation authorization

Before submission, check goal, path, source media, model/resolution, count/duration, sound, and spending scope. A brief summary suffices for simple tasks; do not force reports or reconfirm already authorized facts.

**Submit paid generation only when all conditions hold:**

1. The current task requests video and explicit authorization covers the content and call scope.
2. Input path and media-use scope are clear, with a valid content goal, including unchanged remaking.
3. Model, specifications, and sound are settled and capability-valid. For multiple segments, every seam has a cut decision, previous-result dependency decision, and frame role. Explicit starting-frame continuation is approved and the real input combination is legal; never silently remove promised video/other references.
4. No pending review, critical question, or unapproved spending expansion remains.
5. No duplicate work is running or in an unknown state.

For “show prompts, then generate,” deliver the current version and wait. Prompt acceptance permits execution only with valid prior generation authorization. In a document-only task, “OK” accepts the document. “Generate now” expands the deliverable and authorization.

### Previews and extra spending

Full-video authorization does not include an extra paid preview. For high risk, explain preview duration, call count, spending/uncertainty, and that it is not the finished video; obtain agreement before execution.

Track preview and full-production authorization separately. If both phases were explicitly approved, continue after preview checks; otherwise deliver the preview and wait. A failed preview does not trigger full production. Preview lengths must satisfy current model limits; a suggested 4–6 seconds is not universal.

If one finished video needs multiple generated segments, extra identity anchors, or independent audio, explain paid calls and scope first. “Generate one” is not unlimited attempts. Reuse an existing explicit count/budget approval without asking repeatedly.

## STEP 5: Execute and assemble

1. Submit only after STEP 4's gates, recording returned task identifiers, scope, attempts, and results. Authorization does not override model/tool limits; resolve conflicts first.
2. Recheck actual inputs: A includes approved video; B excludes unapproved source video, segments, or extracted evidence. Number images/videos/audio separately and bind each in the prompt to actual supplied media, not unseen files.
3. For long videos, settle segment count/order, identity anchors, cut evidence and continuity at every seam, sound, and spending. Obtain missing media or decisions; saying “consistent” cannot make unrelated generations share identity.
4. Share confirmed anchors within segments. Independent preparation and dependency-free clips may run together. Tail-frame-dependent clips run serially only after the previous real output passes continuation checks. Clear cuts create no tail-frame dependency. Never silently shorten oversized source video; disclose partial output.
5. Generated media already placed on the canvas are not registered or copied again. Enroll only external/path-only outputs as needed. Keep returned filenames and paths; never move or rename generated assets.
6. Use dedicated video merging for assembly. Resolve dimension conflicts first instead of cropping subjects by default. Check order, seams, duration, and sound continuity; do not fill missing audio with accidental noise.
7. Apply only approved audio reuse/mixing and exact-text finishing. Final audio completion replaces the temporary output card rather than delivering two apparent finals. Remove duplicate soundtracks and verify audio/visual correspondence.
8. Stop affected work on failure, unknown status, or review blocks. Preserve successful outputs and never submit work dependent on unusable results.

### Tail-frame decisions at adjacent seams

Assess each seam separately, not just 1→2 and then the entire sequence. Record strategy/evidence internally and explain briefly; no mandatory extra report or prompt template.

**Gate 1: Is there a clear source cut?**

- **Clear cut: never use the previous segment's tail frame as the next segment's ordinary reference or opening frame.** Start the next source shot's framing, viewpoint, shot size, and action phase. The same person, setting, or event does not change this. Use confirmed independent identity/product/scene references. Do not erase cuts, add transitions, or alter rhythm to manufacture apparent seamlessness.
- **No cut, only a technical split within one continuous shot:** assess tail-frame continuation for action phase, position/orientation, prop contact, background space, and camera movement. No cut does not mean a tail frame is mandatory.
- **Unclear evidence:** inspect footage around the seam. Occlusion, whip pans, or matching motion cannot prove a cut/continuity from one still. If still unresolved and material to generation, explain the gap and ask a necessary question.

**Gate 2: Continuation role, capability, and consent.**

- For direct continuation from the same picture, assess an explicit opening frame first. For looser visible-state guidance, assess an ordinary image reference. Ordinary references are not exact opening frames; neither method guarantees seamless action.
- Explain the actual role in the segmentation plan. Explicit opening-frame continuation needs user instruction or approval. Approval of an unchanged whole chain avoids repeated per-segment questions. Generated-result reuse does not expand source-media permission or spending.
- Check supported use, input combinations, counts, dimensions, and frame. If explicit starting frames cannot coexist with promised video/other references, do not discard inputs or silently switch paths. Offer compatible ordinary references or adjusted boundaries, explaining differences from strict keyframe continuation. Obtain decisions for changed inputs, model, duration, edits, or cost.

**Gate 3: Obtain the real continuation frame before dependent generation.**

1. Inspect a short ending section of the successful previous output, not merely a still. The frame must come from the current usable generated result, never the source or an imagined prompt outcome.
2. Default to the last frame of the finally retained picture, recording version, frame position, and retained endpoint. Check black frames, deformation, identity drift, and accidental cuts. Intentional motion blur is not automatically bad. An accidental generated cut is a deviation, not evidence that the original source cut there.
3. Do not propagate a defective ending. If using an earlier good frame, pair it with the corresponding previous-segment endpoint and next starting state. Never play the old ending then jump back to an earlier pose. Obtain a decision if trimming affects confirmed length/action/audio mapping/cost; paid repair or regeneration is not automatic.
4. Update the next starting description from real ending motion: continue the action phase, direction, speed trend, camera motion, and subject/prop relationships without restarting. A still proves state, not motion; inspect the ending footage. Preserve later source action goals rather than inventing story/action for continuity.
5. Bind the actual frame and its role to the next input. Submit only after checks and review gates pass. Without extraction, inspection, and actual input, never claim tail-frame continuation. Prompt-only tasks stop at the plan. Material changes caused by actual endings follow the original review rule.

## STEP 6: Quality checks, failures, and retries

Inspect real results. Clearly mark uninspected work; successful tool completion is not quality validation. Check recreation/replacement correctness, old-element flashes, duplicated/drifting identities, exits/turns/fast action, contact/occlusion/perspective, product structure, edges/materials/lighting, dialogue/lip sync/audio/subtitles, and promised actual inputs.

### Seam quality and dependency updates

- Inspect short ending/starting sections on both sides of every seam, not just two stills. For continuous shots, check position, orientation, pose, contact, background structure, identity/lighting jumps, repeated/paused/reversed action, speed jumps, reversed camera motion, and duplicate-frame stutter. For clear cuts, preserve the new shot and rhythm instead of treating normal viewpoint changes as failure.
- Tail frames do not solve sound continuity. Check repeated/cut-off dialogue or music, gaps, and sync separately. Deduplication, trimming, and sound adjustments stay within approved finishing; do not hide defects with unauthorized transitions or speed changes.
- When a previous output/version/endpoint changes, recheck its directly tail-frame-dependent successor. If that successor changes, continue along actual dependencies. Mark affected results; old downstream outputs are not automatically valid, nor is whole-chain regeneration automatic. Clear cuts have no tail-frame dependency; inspect other real identity/audio dependencies separately.
- Keep unaffected successful segments. Report bad seams and propose targeted repair first; extra spending follows authorization and retry caps. Unknown or unusable previous output blocks dependent work.

### Failure types and resubmission

- **Local validation failure, confirmed before paid submission:** repair inputs/parameters within current authorization without changing constraints. Ask first for expanded cost/scope.
- **Timeout, disconnect, missing result, or unknown billing:** mark unknown and reconcile with existing task/result capabilities before resubmitting. If unverifiable, disclose it; never claim no charge or create duplicate work.
- **Explicit server failure:** check billing and attempt budget. Retry only when no charge and no in-flight request are confirmed, or the user authorized the corresponding retry budget. Otherwise ask about extra attempts.
- **Successful output with unsatisfactory quality:** not a call failure. Paid regeneration needs an explicit edit-and-regenerate request or valid retry budget. Automatic quality checks may report/propose repair, not spend on it.
- Allow at most two targeted retries after the initial submission per work item. This is a ceiling, not spending authorization. Respect stop-on-error requests. Do not rename work to evade the cap.

Repair only the cause: identity/known angles, species-specific mouths, product proportions/structure, contact/occlusion/perspective, action continuation, individual subject bindings, or duplicate/misaligned audio. Preserve successful clips and other confirmed constraints. Do not repeat identical requests, revert to templates, or regenerate all successful work.

When new media, a model change, or major creative changes invalidate results, identify affected scope. A text-only edit is not generation authorization.

## STEP 7: Deliver according to the requested goal

- Analysis only: deliver the breakdown and actually produced evidence with uncertainty; no model selection or generation.
- Prompts: deliver natural-language prompts and short necessary media/specification notes. Add a report or storyboard only when requested; do not default to two documents.
- Video: deliver the authorized finished scope with input path, retained/changed content, duration/frame, sound handling, and known issues. Simple work needs no long analysis; honor explicitly requested reports.
- Label previews, partial segments, temporary silent outputs, and uninspected work truthfully. Do not claim full acceptance. Reference final media by actual returned filenames and follow canvas grouping rules.
- Close pending questions when the task ends/is cancelled. Later “continue” cannot revive old authorization automatically. Revisions affect relevant scope only; new independent tasks do not inherit old path/media/spending permissions.

## Out of scope

Ordinary subtitles, editing, grading, compression/transcoding, film criticism, and static-image animation do not belong here. An attached video alone does not imply recreation. Legacy-entry disabling is an installation fact; this skill does not depend on old entries. Without a reload capability, report saved files only, not hot loading.
