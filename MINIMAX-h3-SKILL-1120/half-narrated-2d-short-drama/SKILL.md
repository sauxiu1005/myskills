---
name: half-narrated-2d-short-drama
description: |
  根据故事、剧本或参考资料制作 2D 国漫半解说短剧，锁定语音窗口、保留原声对白并交付旁白资料供用户剪辑。默认使用 MiniMax-H3；用户明确指定其他模型时先检查能力。
trigger-words: [2D动画半解说短剧, 2D半解说短剧, 手绘动画短剧, 动漫短剧, 国漫webtoon, 赛璐珞短剧, half-narrated 2D drama]
---

# 2D 半解说短剧 v1.0.1

本流程适用于单集 2D 赛璐珞 / 国漫 webtoon 半解说短剧。旁白负责背景、时间跳转和不可直说的内心信息；对白负责冲突、揭示、拒绝、反击和情绪爆点。前面项目锁定流程中用户确认的旁白音色会贯穿全片，默认推荐音色仅在用户未另选时使用。

### 首帧锚点是什么

首帧锚点是可选的连续性参考，不是生成每个镜头的强制输入。视频生成默认使用 H3 全能参考模式；真正的硬要求是每镜将角色、场景、道具等实际使用内容绑定到资产清单，并锁定空间站位与视线关系。

## 交付边界、质检与返工授权（v1.0.1）

本 Skill 的终点是 STEP 7 的旁白交接；STEP 8 只整理已产生的资料，不是新的生成或后期阶段。交付范围为已授权制作的镜头素材、独立旁白、保留的对白原声、文本与时间元数据及检查记录，不包含最终剪辑、视频装配、字幕烧录、BGM/音效混音或最终导出 QC。字幕样式和成片规格只记录用户以后剪辑的意图，不授权本 Skill 执行。所有 references 文档、模板和示例均受本节约束，不能以“成片齐全”“导出后检查”“全部通过”覆盖停止点。用户更早要求停止时，以更早边界为准。

检查结果与执行授权分开记录：逐项标为通过 / 未通过 / 未核验 / 不适用，附脚本行 ID、镜头 ID、版本、时间段与证据；推测或 ASR 疑点不能直接证明整批失效。失败不得冒称合格，但必须报告现有可用结果。存在未解决项时可交接明确标注的待审/部分资料，不声称完成全部校验或成片；不得为达到“全通过”自行追加生成。

追加生成、补录、换模型、全量重做或新增后期操作必须有覆盖该操作的明确授权。先列出具体行/镜头/文件、问题证据、保留项、方案与契约变更、产物数量、次数和费用风险，再确认；费用未知如实说明。已有的选音色、批准文本、批准首轮批次或一般“继续”不自动包含返工。精确且未耗尽的预授权可直接使用，不重复索取同一授权。默认每个列明产物一次追加尝试；同一问题最多初次生成加两次追加尝试，换模型、拆镜、换 session 或改问题名称均不重置，用户/平台更严限制优先。

只修证据支持的受影响行、音频区间、镜头及确实失效的依赖。相邻镜头先复查交接，不因相邻而重生。保留合格旁白、对白原声、镜头和上次批准版本；新产物先作为待审候选，不自动取代旧版。修文档或时间元数据不等于媒体已修好。纯旁白问题不重生画面或对白；重生视频会改变原生对白，须在授权中说明并重新取证，不能沿用旧时间码冒充验证。

首轮旁白仍统一母轨/批次。局部缺陷按 `references/voice-presets.md` 诊断；在相同音色及完整参数锁下，经明确授权可对受影响脚本行建立有记录的修复批次，禁止伪称与首轮同一 session。只有证据表明共享参数错误或整轨不可分离、局部修复无法保持一致性，或用户明确要求整集换音色时，才可提出全量旁白重做；必须另行取得明确覆盖整批范围和费用的授权。未获授权不作废整批、不自动扩大返工。

验收目标达到、授权/预算/时间或累计次数用尽、用户暂停/取消、外部阻塞、同类问题无实质改善或下一步超出范围时，停止追加操作并报告。达到次数上限不机械重启同一问题。到达旁白交接停止点后结束；后续剪辑是新请求，不由引用文档触发。合同或脚本文字需修改时先提交建议稿并批准新版本；批准改文档本身不等于批准重新生成媒体。

## 项目硬锁（不可在后期放宽）

1. `visual_style_lock=2D-cel-webtoon`，默认 `guoman-webtoon`；每条图像 / 视频提示词都带 2D 风格块。
2. backend=MiniMax-H3 且 generation_mode=platform-supported reference mode 为默认。用户明确指定其他模型时，先检查其能力，兼容后遵循选择；失败先记录原因和受影响镜头，重试或切换兼容模型须按本节范围与授权规则执行，不自动切换。
3. `narrator_delivery_lock=fast_short_drama_commentary`：默认语速为 1.15，吐字清晰、起势快速、压缩非必要停顿，并强化钩子、冲突、反转和落点；voice_id、profile、语速、音高、基础情绪、停顿策略、音量、采样率、编码、响度和表达风格整集锁定。
4. `dialogue_source_policy=video_original_only`：对白来自输入视频原声或 H3 片段返回的原声轨；不生成、不替换、不重配对白 TTS。
5. `narration_dialogue_overlap_allowed=false`：旁白与对白绝对不能在同一混合音轨上重合发声；每个语音区间之间至少留 `0.20s` 保护间隔，实测发现重叠就拒绝混音。
6. `narration_generation_policy=single_batch_or_single_master`：首轮整集旁白在同一 TTS 批次 / session 或统一母轨中生成，使用用户锁定的音色及完整语音参数，禁止逐镜临时选音色。经明确授权的局部修复是唯一有记录的补充批次例外，按 `references/voice-presets.md` 执行；不能把该例外用于首轮逐镜零散生成。
7. `audio_track_separation_required`：旁白与视频原生对白在验证完成前必须保持独立音轨；禁止用 ducking、静音、截断、交叉淡化或压低音量掩盖重叠。
8. `dialogue_consistency_scope`：本 Skill 锁定并核验旁白的一致性，但相同参数或批次不等于已证明听感一致；角色对白仍取各镜视频原声，不承诺跨镜音色完全一致。
9. 每镜必须绑定角色、场景、道具等所需资产，并记录资产 ID 与哈希；首帧 / 末帧可作为连续性参考但不是必需输入。
10. `narration_window_first_design=true`：旁白时长和位置必须在分镜设计阶段、视频生成前预留并锁定；没有可行旁白窗口的镜头不得生成。

## STEP 0：项目锁卡

一次询问起点、题材、画幅 / 时长 / 字幕 / 平台、清晰度（`768P` 或 `2K`）、2D 子模式、旁白音色与解说节奏。字幕选择只记录后续用户剪辑意图，不启动烧录。清晰度由用户选择并整集锁定；默认视频模型和参考模式不变，旁白默认语速 1.15、清晰快速、钩子前置。明确指定的其他模型先检查能力；失败只提出有界重试或换模型建议，获授权后执行。

旁白音色步骤必须执行：先分析短剧类型、叙事视角、情绪和目标平台，再给出推荐首选、备选男声和备选女声，用户确认或试听后锁定。不能因为用户上传了素材而跳过这一问。

锁卡至少包含：

```yaml
project_lock:
  delivery_scope: "narration_handoff"
  stop_after: "narration_handoff"
  final_assembly_authorized: false
  narration_repair_policy: "authorized_affected_lines_only"
  narration_repair_manifest: []
  rework_authorizations: []
  aspect_ratio: "9:16"
  target_duration_s: 90
  subtitle_mode: hard-burn
  delivery_target: douyin
  visual_style_lock: 2D-cel-webtoon
  visual_sub_mode: guoman-webtoon
  narrator_voice_id: selected catalog narrator voice ID
  narrator_speed: 1.15
  narrator_pitch: 0
  narrator_emotion: "短剧快节奏解说"
  narrator_pause_policy: "压缩非必要标点停顿，保留转折与爆点停顿"
  narrator_volume: 1.0
  narrator_sample_rate: 48000
  narrator_codec: "wav_pcm_s16le"
  narrator_loudness_target_lufs: -16
  narrator_voice_profile_id: ""
  narrator_delivery_style: "清晰、快速、钩子前置"
  narrator_reference_audio_sha256: ""
  narrator_tts_batch_id: ""
  narration_render_mode: "single_batch_then_timed_slices"
  narration_batch_required: true
  narration_per_shot_generation_allowed: false
  narration_voice_lock_scope: "entire_episode_single_voice_id_profile_speed_volume"
  script_source_of_truth: "approved_script_manifest"
  prompt_generation_mode: "mechanical_from_shot_manifest"
  prompt_script_match_required: true
  h3_audio_policy: "仅对白，或原样保留提交的音频床；不得自动生成旁白"
  h3_audio_validation_required: true
  audio_render_mode: "separate_stems_handoff_no_final_mix"
  narration_dialogue_same_track_overlap: forbidden
  narration_dialogue_mix_gate: "实测时间区间且间隔至少0.20秒"
  h3_must_preserve_submitted_audio: true
  backend: the platform’s currently available video capability
  generation_mode: platform-supported reference mode
  video_input_mode: "h3_reference_mode"
  resolution: "user_selected_768P_or_2K"
  asset_binding_required: true
audio_policy:
  dialogue_source_mode: rendered_video_original # 有输入视频时改为 input_video_original
  dialogue_replacement_allowed: false
  narration_dialogue_overlap_allowed: false
  minimum_speech_gap_s: 0.20
```

锁卡确认前不生成高成本资产。中途换旁白音色先提交新版本与影响清单；若用户要求整集统一换音色，应明确批准整集旁白的重做数量、费用与停止条件，不能把选中音色当成已授权生成。保留原旁白及对白原声，不自动改动视频。

## STEP 1：素材与对白原声审计

建立 `source_manifest`：输入文件、视频时长、音轨数量、对白是否存在、原声文件路径、采样率、声道和校验哈希。

- 有参考 / 成片视频：抽取原始语音轨，标记 `dialogue_source_mode=input_video_original`，禁止覆盖原文件。
- 需要用 H3 生成镜头：标记 `rendered_video_original`；每个片段生成后立即保存返回的原声轨和哈希。
- 原声缺失、只有音乐或对白不可辨认：暂停流程，请用户补视频原声或录音；不自动用 TTS 冒充“视频原声”。

如果用户上传了剧本或图片资产，必须先询问一次：

- 直接使用上传图片资产；
- 只把上传图片作为参考，重新生成符合项目风格的图片；
- 混合使用（指定哪些直接用、哪些重生成）。

用户未确认前不得重绘或替换上传资产。剧本分析只做结构标注、节拍和镜头化，不擅自改动原剧情、人物关系、事件顺序或结局；任何改写先列为“建议稿”，等待用户批准。

同时建立资产缺口表：角色、场景、道具、服装、关键动作和音频来源逐项标记“已有 / 缺失 / 需变体”。缺失资产先补齐并让用户确认，再进入后续分镜与生成。

输出故事前提、开场钩子、冲突脊柱、转折、结尾和 5 条连续性风险。确认后进入 STEP 2。

## STEP 2：故事、旁白稿、对白稿

按“设定 → 压力 → 应对 → 转折 → 悬念 / 收束”拆成 5 节拍。旁白与对白分开写：

- 旁白：背景、时间跳转、内心想法、不能直说的信息。
- 对白：冲突、揭示、拒绝、反击和情绪爆发；短句、口语化。
- 同一事实只保留一个通道，避免旁白复述对白。
- 默认叙事 / 对白占比约 60% / 40%，以可听性和节拍为准，不为比例牺牲冲突。
- 为原剧本每句建立不可变 `script_line_id` 和 `source_text`。旁白稿的 `narration_text` 必须逐字等于已批准脚本行；标点、数字、专名和语气词不得静默改写。需要压缩或拆句时，先提出“建议稿”，获用户批准后生成新版本 ID。
- 镜头 prompt 不手写第二份剧情。prompt 只能由 `shot_manifest` 的 `script_line_id`、`narration_text`、`dialogue_line_text`、动作、站位和资产字段机械拼接，并保存 `script_manifest_sha256` 与 `shot_manifest_sha256`。

## STEP 3：分镜阶段锁定旁白与对白窗口

视频生成前就必须同时规划两条语音通道。每镜先使用项目锁定的旁白音色、语速、语言、停顿策略和表达风格估算旁白时长，再安排对白窗口和至少 0.20 秒保护间隔。每个 Shot 必须直接写明旁白内容、对白内容、两者的相对位置、语音顺序，以及旁白期间可执行的无口型动作 / 反应镜头。不能等视频生成后才寻找旁白位置。

每镜生成前必须通过以下检查：

- `shot_duration_s` 已固定在 4–10 秒内；
- `narration_text`、`narration_start_s`、`narration_end_s` 和预计时长已填写，无旁白时明确填 null；
- `dialogue_line_text`、`dialogue_start_s`、`dialogue_end_s` 和说话人已填写，无对白时明确填 null；
- 旁白、对白和 0.20 秒保护间隔全部落在镜头范围内；
- 旁白窗口对应可读的动作、反应或空镜，角色口型只在对白窗口出现；
- 如果窗口放不下，先阻止该镜生成，并提出拆句、移窗、拆镜或延长至最多 10 秒的最小变更建议；涉及已批准文字、时间窗或镜头契约时先获批准，再更新受影响记录。不得提交“对白太满”的镜头并期待自动腾出空间。

```text
如果旁白在前：narration_end + 0.20s <= dialogue_start
如果对白在前：dialogue_end + 0.20s <= narration_start
跨镜头：next_speech_start_global - current_speech_end_global >= 0.20s
镜头边界：shot_start <= 所有语音区间 <= shot_end
```

每镜至少填写：`shot_id`、`shot_duration_s`、`global_start_s`、`global_end_s`、`audio_order`、`narration_text`、`narration_start/end`、`narration_duration_estimate`、`dialogue_line_text`、`dialogue_start/end`、`silent_action_window`、`dialogue_source_file`、`narrator_voice_id`、`speaker`、`pre_generation_window_check`。跨镜头也要检查，不能只看镜内。

## STEP 4：分镜、视觉状态与锚点

每镜只承担一个主要信息 / 情绪任务，并记录场景、空间站位、走位、镜头轴线、视线方向、前后景层级、起始状态、动作推进、结束交接、首帧来源、引用资产 ID 列表、`reset_anchor` 和完整音频时间码。分镜同时是音频阻挡文档：必须直接规定旁白内容、对白内容、语音顺序、旁白区间、对白区间、预计时长、0.20 秒保护间隔，以及旁白期间的无口型动作 / 反应镜头。旁白不能作为后期才添加的愿望；时间预算不成立时，该镜不得提交生成。

视频生成默认使用 MiniMax-H3 的 `platform-supported reference mode` 模式；用户明确指定其他模型时先检查能力，兼容后遵循选择。生成前先询问清晰度：`768P` 或 `2K`，用户确认后整集锁定。每镜必须在 `asset_manifest` 中绑定所有实际出现或被提及的角色（包括次要角色 / 群演）、场景、道具、服装等资产，记录唯一 ID、路径和 SHA-256；映射缺失或不一致时不得发起生成。每个可见角色还必须有屏幕位置（左 / 中 / 右）、景别 / 深度层、朝向、视线目标、进出画方向和与其他角色的相对关系；相邻镜头不得无理由翻转 180 度轴线。`first_frame_source` / `last_frame` 仅作为可选连续性参考。

每镜提示词固定附加：`2D cel-shaded animation, Chinese-animation webtoon style, clean bold black outlines, flat color fills with cel highlights, dynamic panel composition, no 3D, no photoreal, no live-action, no watermark, no baked-in text`。

提交前执行 `script-prompt-contract`：展示每镜脚本行 ID、旁白 / 对白原文、资产绑定、空间布局、语音顺序、旁白区间、对白区间、无口型动作区、旁白预计时长和最终 prompt，用户确认后才提交 H3；提交的 prompt 必须带脚本行 ID 和清单版本哈希。提交后比对请求日志，缺行、增写、改写、错序、语音预算超满或把旁白写入角色对白均判定失败。

## STEP 5：生成 / 取证对白原声

### 5A 输入视频路径

用无损或高质量方式抽取视频原声，保留原始文件和时间码。对白转写只用于字幕与定位，不能替换原声。

### 5B H3 生成路径

默认采用分离音频路径：H3 镜头原声只允许包含视频原声对白和自然环境声 / 音效，禁止旁白、voice-over、评论或描述性语音。镜头提示中必须同时带出已规划的对白窗口、旁白静默窗口和旁白期间的视觉动作，但只写对白内容和说话人，不把旁白台词送入 H3 音轨。角色口型只在对白窗口内活动，旁白窗口使用动作、反应或空镜。不能默认 H3 返回音轨就是纯对白。片段生成后马上：

1. 同时归档完整 H3 音频和 `audio/shot_NN_dialogue_original.wav`；
2. 对完整音轨执行 ASR / 说话人分段，逐段与预期对白、说话人和脚本行比对，识别额外旁白；
3. 若 H3 提供独立原始对白 stem，只使用该 stem，并保留完整音轨作为证据；
4. 若额外旁白混入唯一音轨，标记该镜音频源不合格并记录证据；先提出仅该镜的重生成或用户补交干净原声方案，获授权且未达限才执行。保留其他合格镜头；新视频须重新取证对白与时间窗，失败/阻塞按停止规则报告；
5. 禁止叠加旁白、任意静音、声源分离或对白 TTS 来掩盖污染；
6. 通过纯对白检查后，才标出真实 `dialogue_start/end`、更新时间线并进入旁白生成。

### 5C 音频分离硬门槛

默认且必须采用分离音频路径：H3 镜头原声只允许包含视频原声对白和自然环境声 / 音效，禁止旁白、voice-over、评论或描述性语音。不要把旁白母轨或旁白切片送进普通镜头生成。这样做是因为独立生成的 H3 镜头音频无法可靠保持同一旁白音色。

如果某镜混入额外旁白、额外说话人或无法追溯到批准对白的语音，记录该镜不合格，不自动重生。获该镜重试授权后，修正造成污染的指令并重新取证；禁止通过静音、声源分离、压低音量或覆盖音轨掩盖污染。预锁定音频床仅在平台明确支持原样保留且用户批准契约例外时使用；不是默认路径，不授权生成旁白、最终混音或跳过交接停止点。

## STEP 6：独立旁白母轨与无重叠修复

分镜窗口可行且对白真实时间码锁定后，在批准的首轮生成范围内，将全部已批准 `narration_text` 按剧本顺序放入同一 TTS 批次 / session 或统一母轨，沿用锁定的 voice_id、profile/参考音频哈希、语速、音高、情绪基线、停顿、音量、采样率、编码、响度及表达风格。每个切片记录脚本行、原文、来源批次、母轨区间及实际文件哈希。用强制对齐 / ASR 配合听检核对文字；无法核验时标未核验，不以识别疑点直接推断整批失效。

漏读、增词、错词、错序或局部听感漂移先定位到受影响行/区间。区分标注错误、切片边界错误和真实生成缺陷；元数据修正或无损重切片可解决时不重新合成语音。真实缺陷的补录按 `references/voice-presets.md` 的局部修复例外执行：先获授权，再锁定相同完整参数和上下文生成受影响行，记录真实修复批次并与保留片段比较，通过后才批准替换。不通过则停止或提交新方案，不自动扩大到整批。

正常切片仍只作无损边界切割，不按镜头改变语速或情绪。测量实际时长并回填时间线；只复查修改行及受影响的全局语音边界，保留未失效素材。确认需全量重做时，先展示证据和局部方案不可行原因并单独获取整批授权；旧母轨和批准版继续归档。

时间冲突的候选方案为改写/拆句、移窗、拆镜或延长镜头（最多 10s），不是自动执行阶梯。先批准影响已锁定脚本/镜头的契约变更；只在媒体确需重生且获授权时执行。禁止加速、截断、交叉淡化人声、ducking、任意静音或压低一条语音掩盖重叠。本阶段只验证分离音轨和计划时间线的至少 0.20s 间隔，不执行最终混音；有冲突就标明并停在交接/决策处，不进入成片导出。

## STEP 7：旁白交接与流程结束

在本次授权范围的旁白完成生成、实测与文字核验后，交接并结束本 Skill；包括首轮统一母轨/批次及获批的局部修复文件，必须附真实逐段来源。若触发停止条件而仍有失败、缺失或未核验项，按总则作部分/待审交接并标明，不强行继续生成。不得自动进入最终视频装配、字幕烧录、BGM 混音、音效混音或导出文件 QC。

向用户交接旁白母轨或旁白切片、旁白时间元数据、保留的对白原声轨、镜头级音频时间线，以及可供剪辑使用的字幕时间码来源。用户自行决定剪辑点、转场、BGM、环境声、音效、字幕样式、ducking 和最终导出。

如果用户之后明确要求剪辑或装配，将其视为新请求，另行确定编辑范围与授权，再转入适用流程或插件；不得自动继续本 Skill。后续编辑须保持旁白与对白分离，实测间隔至少 0.20 秒后才允许混轨。若新请求涉及旁白或对白返工，仅对批准的行/镜头返回 STEP 6 或 STEP 5 重新核验，不重启整集。

## STEP 8：交接包

交接包包含本次范围内的旁白母轨/批次文件、获批局部修复及替代映射、逐段真实来源批次与哈希、每条对应原文与时间元数据、保留的对白原声、`shot_audio_timeline.yaml`、对白及旁白字幕时间码来源、已有镜头/角色/场景/分镜资料、检查记录和未解决项。STEP 8 只整理既有资料，缺项如实说明，不自动补生。不得声称已完成最终视频装配或导出文件 QC。

当本次授权范围的旁白输出、文字/时间检查记录及交接资料在画布可用时，交接完成并停止；失败、未核验或缺失项必须标明，部分交接不等于全量合格。不得为补齐“成片”或字幕成品而越过停止点；最终剪辑与装配由用户自行决定。
