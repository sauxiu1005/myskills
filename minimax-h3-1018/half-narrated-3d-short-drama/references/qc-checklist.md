# QC Checklist Template (3D Manhua Half-Narrated Short Drama · v2.0)

Use this checklist before delivery. A hard failure prevents a qualified-final claim, not a labeled review/partial handoff. No failure authorizes extra generation. Write results in the user's current language.

## Delivery and Local Repair Contract (v1.0.1)

This contract governs both main files and all bundled references. Old thresholds, examples, repair tips, and automatic completion wording cannot override it.

1. **Evidence and coverage.** For each shot/file version record checked time intervals, modality, source evidence, expected contract, actual observation, and pass/warning/fail/unverified/not-applicable with reasons. Inspect mouth action over time with actual dialogue and the separate narration's planned placement; inspect style against approved anchors and sub-mode. Metadata alone does not prove lip action or style, and text edits do not repair rendered pixels. Sampling supports only sampled claims; unobserved intervals remain unverified.
2. **Delivery scope.** Deliver complete approved clips directly joined with their native dialogue/production sound, plus separate narration audio, transcript, measured placement timing, and QC report. Do not composite narration automatically. A narrator-window check is a placement review against the separate audio, not evidence of a produced narrated master. Music/subtitles are checked only if explicitly requested and actually produced. Unproduced deliverables are not marked passed.
3. **Result states.** Qualified delivery requires evidence for all applicable hard gates and no unresolved hard failures. Usable minor timing warnings can be delivered with their actual offsets. Failure/unverified cases may be handed over as review/partial assets with blocked items and next decisions; never stamp “complete,” “100% preserved,” or “all passed” from a template. User acceptance of a known defect is recorded as a waiver, not a factual QC pass.
4. **Mouth hard failure.** Verified unapproved speaking-mouth action during a reserved narration window, a character reciting narrator text, or simultaneous visible speakers fails the affected shot. Pure-narration shots use the same severity, not a weaker warning. Ordinary breathing or a surprised open-mouth expression alone does not prove speech; inspect the interval or mark unverified. “Must redo” means the defect must be repaired before qualification; it is not authorization to rerender. Muting speech cannot fix wrong visible speaking.
5. **One timing rule.** Default planning is around 10s; normal 6–10s, combat/fast cuts 4–6s, ceiling 10s, with exact approved values supported by the selected capability. Example 7/8/9s values and default 10/6s are not conflicting runtime mandates. Unsupported locked values require a decision before generation, not silent rounding or cropping. Measure signed start/end/duration offsets; compare the largest absolute relevant offset with its corresponding reserved window. Accept ≤1.5s OR ≤20% of that window when content is complete, intelligible, contained, and has no critical overlap; either numerical test suffices. Zero-length windows use the absolute test only. Larger but usable drift is a warning to retain, not a rerender mandate. Missing lines, critical overlap, or unusable timing require a local proposal. Numeric tolerance never excuses mouth, style, or story failures.
6. **One style rule.** `3D-manhua-cel` names the 3D manhua family; `guoman-3d-render`, `pixar-disney` (rounded family-animation with manhua composition), and `semi-painterly-3d` are mutually exclusive approved Q4 sub-modes. Default is guoman. Evaluate actual form, material, depth, composition, identity, and approved design, not a keyword alone. Rounded features or brush texture within their explicitly locked modes are not forbidden drift. Pure 2D, photoreal/live-action replacement, loss of 3D form, and unintended cross-mode changes are failures. Lighting/expression variation within the approved style is not automatically drift.
7. **Minimal diagnosis.** Separate missing evidence, execution failures, content defects, and deterministic post faults. Recover existing successful media on retrieval errors; reconcile unknown jobs before submitting more work. For style/identity, inspect anchor identity, view, binding, and prompt before choosing a correction. Repair only evidenced affected shots/assets. Check true downstream dependencies; sharing a character or residing in the same batch does not invalidate every neighbor. Preserve narration, qualified shots, source files, and the last approved version; a new output is a candidate pending review.
8. **Authorization and ledger.** Before new production list defect/evidence, shot/file/version, retained items, proposed changes, actual invalidated dependencies, operation type, exact output count, attempts, known or unknown cost, remaining allowance, and stop conditions. Mere budget balance is insufficient. Reuse precise unspent authorization for this exact repair without redundant questions; otherwise obtain explicit approval. Default approval permits one attempt per listed artifact. First-pass approval, a failed review, unscoped “continue,” and silence never authorize further generation. Diagnose before submitting; identical retries are forbidden.
9. **Bounded attempts.** Same problem/unit: initial plus at most two changed generation attempts, three total; stricter user/platform limits prevail. Technical execution retry is at most one by default and only after cause correction and authorization. Model/spec changes, split outputs, new anchors, and low-cost tests consume the same project's applicable allowance, not a new free loop. Every added output has a ledger entry; unknown cost is not zero. Deterministic post repairs are separately classified and also bounded by explicit budget/attempt scope, with at most initial plus two corrected attempts for the same fault.
10. **Stops and dependencies.** Stop at acceptance, scope/attempt/budget/time exhaustion, no material improvement, unknown job state, blockers, or user pause/cancel. Report usable versions and unresolved items rather than silently restarting at STEP 5/6. A proposed shorter shot, new bridge/anchor, changed sub-mode, camera, story, or speaker needs explicit scope approval. Preserve full-shot joins and source text; do not trim story, delete lines, or rerecord the episode to eliminate minor drift.

Required QC report columns: artifact/shot/version; checked interval and evidence; expected/actual; status; hard-failure category; retained assets; affected dependencies; proposed local action; authorization source and remaining attempts/budget; delivery state. An accepted warning or user waiver stays visible in the report.

Operational examples:
- A 1.2s offset with complete, clear, non-overlapping contained speech: retain and update actual timing; no rerender.
- A 2.6s offset that remains usable: warning and handoff note, not automatic split or regeneration.
- Shot 04 silently mouths narrator text: hard-fail shot 04, retain its good narration and shots 01–03/05+, request or reuse exact local-repair authorization.
- A style defect in shot 07: compare the approved sub-mode and anchor; propose shot 07 only unless a recorded dependency proves another output invalid.
- No repair allowance remains: deliver clearly labeled existing assets and issues, pause; never mark the failure passed.

## Story

- [ ] Story hook is clear in the first 3 seconds
- [ ] Narration and dialogue are balanced (default 60% / 40%)
- [ ] The 5-beat chain is preserved (Setup → Pressure → Response → Turn → Cliffhanger/Payoff)
- [ ] Emotional arc from hook to ending is intentional, not accidental
- [ ] Episode actually resolves or teases as planned (no accidental softening of cliffhanger)

## Story preservation **[HARD GATE]** [NEW for v2.0]

- [ ] **[HARD GATE]** No original story beat from the script is deleted, compressed away, or rewritten to fit timing — the script fed in is the script delivered
- [ ] **[HARD GATE]** Every plot point, dialogue line, and reversal that exists in the input script still appears in the final storyboard and final cut
- [ ] **[HARD GATE]** If narration and dialogue would overlap in one shot, the shot is split, extended, or windows are offset — never hard-stacked and never resolved by deleting content
- [ ] **[HARD GATE]** STEP 5.6 (narration-first) was entered only after the story spine, beat chain, per-shot lines, and STEP 5.5 reconciliation were all complete (narration-first is a timing lock, not a story-patching tool)
- [ ] **[HARD GATE]** STEP 5.5 (script reconciliation) ran before STEP 5.6: every plot point from the original script is marked `covered` / `user-approved-deleted` / `moved-to-next-episode` in `script_reconciliation_table`; silently-dropped plot points are forbidden
- [ ] **[HARD GATE, NEW narration-first Guardrail 1/3]** STEP 2 narration completeness self-check was passed (5 self-check items all ✅)
- [ ] **[HARD GATE, NEW narration-first Guardrail 2/3]** STEP 5 narration word-count pre-check was passed (no shot's narration exceeds the per-shot cap: 28 chars normal / 32 chars key emotion / 36 chars long inner)
- [ ] **[HARD GATE, NEW narration-first Guardrail 3/3]** Story-completeness-first priority was honored at STEP 5.6: ⚠️ narrations preferred shot-duration adjustment; 🔴 narrations went back to STEP 5 (not narration text rewriting). Verify no narration words were deleted in STEP 5.6 to fix timing drift.

## Continuity

- [ ] Character identity stays stable (face / hair / wardrobe)
- [ ] Scene layout stays stable (architecture, room layout, location markers)
- [ ] Props do not drift (color, orientation, presence)
- [ ] Each shot's "next-shot handoff" was honored
- [ ] No accidental state changes between adjacent shots
- [ ] **3D Manhua specific [HARD GATE]**: 3D material block stays stable across same-character shots (skin, hair, fabric, accessories don't shift material type)

## First-frame anchors **[HARD GATE]**

- [ ] **[HARD GATE]** Every shot has a `first_frame_source` recorded in the storyboard (no nulls, no empty strings)
- [ ] **[HARD GATE]** Every shot video was generated in image-to-video mode with `opening_frame_image` set (no pure text-to-video shots)
- [ ] **[HARD GATE]** Every shot has a corresponding `clips/shot_NN_last.png` archived after generation
- [ ] **[HARD GATE]** Reset-anchor cadence (3D manhua, LONGER than 2D): protagonist every 4 shots, supporting character every 6 shots, scene every 5 shots, with `reset_anchor: true` flagged on the right shot
- [ ] **[HARD GATE]** Reverse-angle cuts and time jumps are flagged as `reset_anchor: true` (natural resets)
- [ ] **[HARD GATE]** The protagonist main card, every supporting character main card, every scene main card, AND every scene auxiliary card have a clean canonical file in `provided_assets/` or `assets/` and at least one shot actually used each as a first_frame
- [ ] **[HARD GATE, NEW for 3D]** Every main character has a `three_view_sheet` (front + side + back) generated in Step A, and at least one side-tracking / back-view / orbit shot actually used the matching 3-view card as `first_frame_source`
- [ ] **[HARD GATE, NEW for 3D]** Every shot's `shot_camera_angle` and `first_frame_anchor_role` are angle-matched: side-tracking shots use `character_3view_side`, back-view shots use `character_3view_back`, front-facing shots use `character_main_card`, scene variety shots use `scene_aux_card`. Mismatched angles are an instant hard fail.
- [ ] **[HARD GATE]** Asset count matches the simplified STEP 6 plan: per main character = 1 main card + 1 three-view sheet; per main scene = 1 main card + 1 auxiliary card; plus ≤1 prop card. No expression sheets, no pose sheets, no lighting variants, no costume-change sheets, no 360° turntables, no full lighting-variant scene sheets.
- [ ] Approved supported shot durations are preserved: normal 6–10s, fast cuts 4–6s, ceiling 10s. A longer-shot proposal requires explicit revised planning, not a justification that silently overrides the limit.

## Visual style **[HARD GATE]**

- [ ] **[HARD GATE]** `visual_style_lock == 3D-manhua-cel` is honored across every shot
- [ ] **[HARD GATE]** Every shot matches the one approved sub-mode (guoman-3d-render / pixar-disney / semi-painterly-3d), with actual visual evidence rather than a prompt-only check.
- [ ] **[HARD GATE]** No 2D / flat-illustration drift in any shot (no clean 2D line art, no 2D webtoon, no flat color fills with no 3D shading)
- [ ] **[HARD GATE]** No unintended cartoon-mode replacement of the selected style. Rounded proportions/soft materials in an explicitly approved rounded-manhua mode are legitimate, not failures.
- [ ] **[HARD GATE]** No photoreal CG / live-action drift in any shot (no skin pores, no lens flares, no photoreal hair strands, no photographic texture)
- [ ] **[HARD GATE]** No accidental style mixing (no 2D-character-on-3D-background, no Pixar-shape-with-PBR-realistic-materials)
- [ ] **[HARD GATE]** No watermark, no baked-in platform text, no baked-in title overlays in any shot
- [ ] **[HARD GATE]** No unintended flat 2D/watercolor/ink-wash replacement; surface brush texture is allowed within the approved painterly-3D mode while retaining 3D form.
- [ ] Camera changes support the beat chain (not random / not static). 3D manhua may use orbit / tracking / push-pull but each must serve the story.
- [ ] Style block was applied to every prompt (verify a sample of 5+ prompts)
- [ ] **[HARD GATE]** Actual materials, depth, and composition match the approved sub-mode and anchors. Prompt keywords support prevention but are not proof of a rendered pass.

## Audio **[HARD GATE]**

- [ ] **[HARD GATE]** STEP 5.6 (narration-first) was run before STEP 6: every shot's narration audio exists at `audio/shot_NN_narration.mp3` before any shot video is generated
- [ ] **[HARD GATE]** Narration is generated in STEP 5.6 and handed off separately at STEP 7; no automatic narration compositing or duplicate generation. Authorized local replacements preserve source versions and provenance.
- [ ] **[HARD GATE]** `narration_timing_table` was produced and `shot_timing_table` was locked before STEP 6 started
- [ ] **[HARD GATE]** No shot in the final `shot_timing_table` exceeds 10s (combat / fast-cut 4–6s is allowed)
- [ ] **[HARD GATE]** `narrator_voice_id` is identical across every narration clip in the episode (no mid-episode swap)
- [ ] **[HARD GATE]** `narrator_speed` is within ±10% of the per-episode default
- [ ] **[HARD GATE]** No narration/dialogue overlap in any shot, unless the user explicitly approved it
- [ ] **[HARD GATE]** Dialogue audio defaults to the video render's original spoken audio
- [ ] **[HARD GATE, NEW for v2.0]** Dialogue duration estimate (max_dialogue = shot_duration × 0.6) was checked at STEP 5.6 and no shot exceeded the safety margin (narration_real + dialogue_estimate + 0.5s_buffer ≤ shot_duration). If exceeded, the shot was split or extended before STEP 6.
- [ ] Actual dialogue timing was measured and recorded under the shared ≤1.5s OR ≤20% usable-drift rule; larger usable offsets remain warnings. No requirement to repair every offset over 1s.
- [ ] **[HARD GATE, NEW for v2.0]** `narrator_gender_match` was honored: the voice gender matches the genre track's auto-recommend (no gender-mismatch, e.g. female-frequency romance with male voice)
- [ ] **[HARD GATE, NEW for v2.0.1]** `narrator_volume` was set to 1.8 (or 1.2-2.0 range per user) — NOT 1.0. Default 1.0 makes narration inaudible in noisy viewing environments and breaks the half-narrated function. Verify by spot-checking 3 random narration mp3 files: their peak amplitude should be noticeably louder than the dialogue peak amplitude in the same shots.
- [ ] **[HARD GATE, NEW for v2.0.2]** `shot_audio_schedule` was produced in STEP 5.6 with TTS preview for BOTH narration and dialogue (not narration alone). Every shot's prompt in STEP 6 includes the `audio_schedule` block with explicit `narration_window` and `dialogue_window` timestamps from the schedule. Spot-check 3 random shots: their `shot_audio_schedule.fits_in_shot` is `true`.
- [ ] STEP 6.5 reports actual checked coverage, offsets, and usability. No historical success/intervention percentage is a QC gate. Only evidenced hard failures or unusable timing need a scoped repair proposal; never delete dialogue or generate merely to meet a percentage.
- [ ] Audio is intelligible (dialogue clear over background)
- [ ] Subtitles are readable (font size, contrast, position)
- [ ] Voice preset name is recorded in the final spec for next-episode reuse

## Format / backend

- [ ] Selected capability supports the approved per-shot duration and spec. Default planning around 10s does not replace a supported approved 6–10s normal or 4–6s fast-cut duration.
- [ ] Aspect ratio matches the locked spec
- [ ] Duration matches the locked target
- [ ] Subtitle mode matches the locked choice
- [ ] Final assembly matches the spec

## Canvas gate **[HARD GATE]** [NEW for v2.0]

- [ ] **[HARD GATE]** Final spec is on canvas for user review before any expensive generation
- [ ] **[HARD GATE]** Every core asset produced before video generation (character cards, three-view sheets, scene cards, scene auxiliary cards, prop card, storyboard) was placed on canvas **immediately after generation** for user inspection and adjustment
- [ ] **[HARD GATE]** Video generation (STEP 6 Step B) was not started until the user has confirmed the on-canvas assets

## Video model policy (MiniMax-H3 by default) **[HARD GATE]**

> 默认模型与首帧策略沿用主文件，具体规格以已批准逐镜时间表和当前能力为准。执行重试只在原因修正、已有精确额度或新确认后进行；仍失败停止报告，换模型另需批准。内容返工只限有证据的镜头。

- [ ] **[HARD GATE]** 每个镜头默认使用 `model = "MiniMax-H3"`；如用户明确选择其他模型，已完成能力检查并记录结果。
- [ ] **[HARD GATE, NEW for v2.0.6]** **Every shot has a non-empty `opening_frame_image`** (first_frame reference). No pure text-to-video shots. Spot-check 3 random shots: their `opening_frame_image` points to a real anchor (character main card / character three-view side/back / scene main card / scene auxiliary card / last_frame / prop card).
- [ ] **[HARD GATE, NEW for v2.0.6]** **`frame_role = "first_frame"` for every shot** (not `"last_frame"` for first-frame shots; not text-only).
- [ ] Every generated shot uses its approved supported duration, not a forced 10/6 override; normal 6–10s, fast-cut 4–6s, with the shared 10s ceiling.
- [ ] **[HARD GATE, NEW for v2.0.6]** **Multimodal refs all used**: at least one of (character main card, character three-view sheet, scene main card, scene auxiliary card, prop card) must be generated in Step A and at least one shot must have used each as a first_frame. Spot-check: list all generated anchor assets and verify each appears as some shot's `opening_frame_image`.
- [ ] **[HARD GATE, NEW for v2.0.6]** **No text-to-video fallback without explicit user approval**. If any shot was generated via text-to-video, the storyboard must contain a `text_to_video_approval: true` flag with the user's confirmation.

## Audio hard rules (mouth / BGM / ducking) **[HARD GATE]** [NEW for v2.0.4 / v2.0.5]

These three rules apply to **every** mixed-mode (narration + dialogue) episode, regardless of sub-mode. They are inherited from the wool-felt-story-short skill design.

### Mouth-state constraint [HARD GATE]

- [ ] **[HARD GATE, NEW for v2.0.4]** **Single-speaker rule per shot**: in every shot, at most ONE character is allowed to move their mouth to speak. Other visible characters must keep their mouth closed or perform reaction actions (nod, frown, eye movement).
- [ ] **[HARD GATE]** No verified speaking-mouth action or narrator recitation in the reserved narration window. Narration text is not character speech. Confirmed violation fails that shot and needs local repair before qualification, subject to scoped authorization; “must redo” never authorizes immediate generation.
- [ ] **[HARD GATE]** Narration-only windows follow the same rule. Check the interval to distinguish ordinary expression from speech; insufficient evidence is unverified, not an automatic fail or pass.

### BGM handling [HARD GATE]

- [ ] **[HARD GATE, NEW for v2.0.4]** **BGM is post-positioned**: the no-BGM cut must be completed and user-reviewed first; BGM is only added after user approval.
- [ ] **[HARD GATE, NEW for v2.0.4]** **BGM alignment without stretching**: BGM too long → trim to cut duration with natural decay; BGM too short → loop as needed and trim to cut duration. **Forced stretching of BGM is forbidden**.
- [ ] If an authorized BGM asset is delivered, check that asset and its handoff timing. Narration ducking in a user-edited master is a recommendation, not a checked result of this Skill; mark unproduced master-mix checks not applicable.
- [ ] **[HARD GATE, NEW for v2.0.4]** **BGM is an independent asset**: BGM version must be output as a NEW asset; never overwrite the no-BGM version. The no-BGM version is a required independent deliverable.

### Ducking (audio sidechain) constraint [HARD GATE]

- [ ] **[HARD GATE, NEW for v2.0.4]** **Ducking is for ambience / SFX only**: allowed use cases — street noise ducks when narration speaks, SFX ducks narration/BGM. Forbidden use case — using ducking to make narration and dialogue "both play but distinguishable" (must use time-window separation instead).
- [ ] **[HARD GATE, NEW for v2.0.4]** **No ducking-induced inaudibility**: if ducking makes narration or dialogue inaudible, it's a fail. Either reduce ducking depth or extend the time-window gap.

## User-language following **[HARD GATE]** [v2.0.3: 4 → 8 items, full systemization]

> **Complete ULF spec**: `references/user-language-rules.md`. The 8 hard gates below are the QC-checkable subset.

- [ ] **[HARD GATE]** Every `question` call (options, descriptions, defaults, placeholders) is written in `user_language`. Internal `id` keys stay machine-readable.
- [ ] **[HARD GATE]** Every progress update, step-completion message, decision summary, and error / warning is in `user_language`.
- [ ] **[HARD GATE]** Final delivery message (STEP 8) is entirely in `user_language` (the 🎬 template, with technical IDs appended as plain string but not translated).
- [ ] **[HARD GATE]** Exact user-provided text (character names, scene names, narration text, dialogue text, plot point text, style direction words) is preserved verbatim across all outputs. No translation, no paraphrase, no synonym substitution.
- [ ] **[HARD GATE]** Voice preset labels (`voice_preset_label`) use the platform's localized display name matching `user_language`. `voice_id` stays as the platform's machine-readable ID.
- [ ] **[HARD GATE]** Subtitle output language matches the user's `output_language` field in the spec (default = `user_language`).
- [ ] **[HARD GATE]** H3-facing style block stays English (H3's training data is English-dominant; English style blocks produce the most stable output). User-facing prompt explanations are in `user_language`.
- [ ] **[HARD GATE]** When the user speaks in a non-default language, the Skill defaults to following it (no fallback to Chinese). Only when language is undetectable does the Skill default to `zh-CN`.

## Output

- [ ] Final episode or assembly guidance produced
- [ ] Reusable character / scene / prop cards delivered (per character: main + 3-view; per scene: main + aux; ≤1 prop if used)
- [ ] Storyboard or shot prompt package delivered
- [ ] Continuity warnings and repair notes delivered
- [ ] Voice preset name recorded in delivery summary (so the user can reuse on the next episode)

## Final delivery message template (**must be in user's current language**)

> 🎬 第 X 集：<合格 / 带可用性警告 / 待审或部分交接 / 阻塞>；实际产物与时长 <清单>；检查覆盖 <范围>；失败/未核验 <清单>
> - 视觉：3D 漫剧渲染（<sub_mode>）
> - 旁白音色：<voice_name> (<voice_id>)
> - 后端：平台当前可用的视频能力（10s 模式）
> - 锚点：主角每 4 镜/配角每 6 镜/场景每 5 镜重置一次；三视图（正/侧/背）+ 场景辅卡支撑运镜
> - 流水线：narration-first（旁白先生成，STEP 6 按真实时长拍镜头）
> - 剧情：<已核验覆盖数/总数、批准变更、未核验项>；旁白独立交付，不宣称旁白母版已混音验收。
> - 旁白对白：全镜非重叠（默认）
> - 下一步建议：<一键出下一集 / 调 BGM / 出 3 平台投流剪辑 / 调整画幅出海>


## Complete-shot direct-join hard gate

- [ ] Every shot is preserved from its first frame through its last frame.
- [ ] All complete shot clips are directly joined in the confirmed order; no shot footage is trimmed, shortened, speed-ramped, cropped away, or replaced for pacing or audio convenience.
- [ ] Any end card is appended only after the complete final shot.
