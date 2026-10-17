# Production Handbook

This is a domain record convention, not SVML, an API schema, or an editor project. Localize the user's documents to the working language. No external resource must be fetched to execute this handbook.

## Capability mapping

| Task | Native principle | Missing capability |
| --- | --- | --- |
| Project | Inspect selected canvas media and current editor state narrowly | Ask for the actual file or keep plan-only output |
| Media | Measure metadata separately from semantic understanding | Mark unknown facts and unobserved content |
| Timing | Trusted timecodes or transcription of the selected take | Sentence timing or unresolved anchors |
| Generation | Inspect live supported models and reference limits | Approved prompts, not fabricated media |
| Canvas | Generated outputs already appear; register only external/path-only results not already placed | No success claim without returned node |
| Editing | Documented editor operations, actual returned object IDs | Asset package and assembly plan, not fake editable project |
| Postprocessing | Native deterministic trim, merge, caption formatting, rendering | Report missing operation, no hidden installation |
| Recovery | Actual returned job IDs and supported status access | Reconcile existing output, report uncertainty |

Preserve returned paths and filenames. Never duplicate generated nodes. Avoid a canvas-wide enumeration after a successful write. Patch existing text with anchored minimal edits and the latest version token. Preserve user grouping; group two or more current-turn generated assets once after work, never one output. Store no secrets in prompts or production records.

## Authoritative record template

- Brief: purpose, deliverable level, authorization, verified claims, preserve/replace, language, ratio, duration, count, audio, caption opt-in, budget and unknown costs.
- Evidence: real source references and versions, observed ranges, audio access, measured versus estimated facts.
- Script: source (user supplied / source transcription / newly drafted), revision, review status and confirmation evidence, unresolved ambiguities, stable paragraph IDs, exact authoritative lines, speakers and language. If the script was missing, follow script-review.md and obtain user review before dependent media generation.
- Shots: purpose, paragraph/event, planned/actual duration, framing, action, camera, source dependencies, sound/lip sync, requested layers, opening/ending state.
- Assets: logical key, returned node and file, selected take revision, actual media facts, input versions, consumers, status.
- Anchors: exact phrase/occurrence, script revision, selected take, local time, film time, precision/evidence, dependent graphic/sound/caption.
- Assembly: selected clips, trim points, placement, speed, graphic layers, master sound, actual editable project reference when available.
- Versions: requested change axes, preserved assets, overrides, work to redo, acceptance checks, returned final files.
- Jobs: actual returned job IDs, submission result, known cost evidence, success/failure/unknown state.
- QA: observed checks, defects, correction and remaining uncertainty. Planned checks are never passed checks.

Unknown fields stay unknown. A logical dependency is not automatically a recorded generation input. Keep accepted takes traceable; do not overwrite files while claiming the same version.

## Semantic time resolution

1. Assign paragraph P02 and anchor A_PRODUCT, for example. Record exact phrase, occurrence or character range, onset/offset intent, and script revision.
2. Relocate after script edits. Confirm the selected take actually speaks the intended words. Review recognition errors against audio; absent words remain unresolved.
3. Resolve the anchor on the exact take's local clock, then through trimming and placement onto film time.
4. Check repeated phrases, cross-cut events, short reading duration, and clipped-out anchors. Only dependent precision work is blocked by an unresolved anchor.

For constant forward playback:

`filmTime = placementStart + (takeTime - trimIn) / rate`

Example: a word at take time 1.8 s, trimmed at 0.3 s, placed at film time 5.0 s, normal speed, resolves to 6.5 s. Clipped-out events are invalid. Reverse playback, speed ramps, and time remapping require the real editor's mapping.

Precision: planned = intent only; estimated = approximation; measured = supported evidence tied to a take; verified = checked against actual media. Sentence timing is not word timing. Silent animation may have authored intervals; music sync needs actual music evidence. Caption opt-in remains mandatory. Logical shared anchors do not create real tracks automatically.

## Single-artifact prompt template

Current goal and primary shot information; each ordered input's separate slot and purpose; defining identity, product, costume, world and topology; framing and requested text space; opening state -> action -> ending state; camera; audio mode, exact dialogue, speaker/voice/non-speaker state; shared prop/gaze/position/motion; confirmed output constraints; specific observed defect to prevent. Only include relevant fields. Record the actual result separately, not inside the creative prompt.

## Dependency matrix

| Change | Usually reusable | Recheck / redo |
| --- | --- | --- |
| Requested caption style | Video, voice, measured timing | Layout, occlusion, render/export |
| Script, language, voice | Content-independent visuals | Speech, measured events, lip sync, requested captions |
| Presenter identity | Independent graphics and B-roll | Every appearance, related action and composition |
| Product | Unrelated shots | Claims, prop, interface, visuals, speech, ending |
| Ratio | Compatible source media and audio | Reframe, relayout, safety margins, necessary replacement shots |
| Single-shot action | Independent shots | Current shot, state-dependent neighbors, timeline |

List every consumer before changing shared inputs. A one-version edit uses a local override. The matrix is not an instruction to produce three default versions or all combinations.

## Recovery and delivery

Save actual job/result references, then separately mark selected and verified. If status is uncertain, use only supported queries and reconcile known outputs before resubmission. Change the defective request materially; never repeat it unchanged. At most two corrected retries after the initial attempt, within scope. Repeated shared failure pauses affected batch work. Assembly failure reuses good sources. Keep independent authorized work when safe.

Keep unknown pricing unknown. Distinguish generated, selected, failed, exported, and verified counts. Per-version delivery lists actual final files, specifications, checks, and gaps. A rendered video, a genuine editable project, and a plan-only package are different deliverables.

## Illustrated explainer extension

For this mode read illustrated-explainer.md and aspect-ratios.md. Add an evidence-based style card, semantic interaction/action/response, and per-ratio layout boxes and shot overrides to the authoritative record. Separate technical QA from visual QA. Shared audio/time does not imply shared pixel positions. plan_layout.py is an optional standard-library helper; no rendering capability is implied by the presence of a script.


### 轻松线稿 B-roll 的风格验收

记录“简笔造型/夸张表情/轻快动作/气泡图解/少量平涂”五项，先审参考图是否偏写实或精细古典插画。丰富度按行为、互动、反馈衡量，不按线条数量、人体或衣褶细节衡量。H3为用户选择的生成路线时，缺少代码执行能力不阻塞模型生成。多画幅仍独立构图与验收。

## Keyword overlay events

Illustrated explainers use object-bound explanatory labels, not a detached second caption strip. Record the source phrase/revision, explanatory role, associated object or relationship, carrier (tag/card/bubble/sign/callout), connector, object-local anchor/offset, shared transform or actual tracking, exact wording, semantic timing evidence and per-ratio group bounds. Plan carriers in the storyboard and H3 reference; composite exact words into them afterward. Review whether the label explains an identifiable object with bottom captions hidden, and whether that association survives motion. Fixed changing words below the illustration fail this mode. Follow illustrated-explainer.md for detailed composition; reuse accepted media for label-only repairs when suitable. Never call sentence-level timing word-accurate.
