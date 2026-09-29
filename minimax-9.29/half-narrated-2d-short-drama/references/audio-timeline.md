# 音频时间线模板 v2.0

本模板记录旁白/对白的计划和实测区间；估算不等于测量证据。镜内 start/end 为镜头相对秒数，global_start/global_end 为计划全片坐标，区间均为半开 [start,end)。全局坐标不要求生成最终成片。

主文件的旁白交接停止点、局部返工授权与停止规则优先。这里只交付独立音轨及时间资料，不启动最终混音/字幕烧录/导出 QC。任何契约变更先批准，媒体追加生成另行授权；批次修复记录按 voice-presets，不自动作废整集。

## 项目音频锁

~~~yaml
audio_policy:
  dialogue_source_mode: rendered_video_original # 或 input_video_original
  dialogue_replacement_allowed: false
  narration_dialogue_overlap_allowed: false
  minimum_speech_gap_s: 0.20
  narrator_voice_id: selected catalog narrator voice ID
  narrator_speed: 1.15 # 示例；执行时读取已批准项目锁，不以模板覆盖用户值
  narrator_consistency_lock: episode_wide
  narration_source: episode_master_then_slice
  narrator_pitch: 0
  narrator_emotion: "project_locked_baseline"
  narrator_pause_policy: "fixed_punctuation_pauses"
  narrator_volume: 1.0
  narrator_sample_rate: 48000
  narrator_codec: "wav_pcm_s16le"
  narrator_loudness_target_lufs: -16
  narrator_voice_profile_id: ""
  narrator_reference_audio_sha256: ""
  narrator_tts_batch_id: ""
  narration_repair_manifest: []
  delivery_scope: "narration_handoff"
  narration_render_mode: "episode_master_then_slice"
  h3_audio_policy: "dialogue_only; narration_forbidden_in_shot_audio"
  h3_audio_validation_required: true
  audio_render_mode: "separate_narration_master_then_user_editing"
  h3_must_preserve_submitted_audio: true
~~~

dialogue_source_mode 只有两种合法值：输入视频原声，或 H3 片段返回的原声。对白不可用时暂停，不以对白 TTS 兜底。

## 分镜前置音频预算（生成前硬门槛）

旁白窗口是 Shot 设计的一部分，生成前须完成时长估算并锁定对白窗口、0.20 秒间隔和无口型动作。放不下时阻止该镜生成，提出拆句、移窗、拆镜或延长至最多 10 秒的建议；先批准涉及已锁定文字/窗口的变更，不自动生成“补救”素材。

每个 Shot 的分镜行必须写出：`audio_order`、`narration_text`、`narration_start_s`、`narration_end_s`、`narration_duration_estimate`、`dialogue_line_text`、`dialogue_start_s`、`dialogue_end_s`、`silent_action_window` 和 `pre_generation_window_check`。旁白窗口对应动作 / 反应 / 空镜，人物口型只在对白窗口中出现。

## 每镜必填字段

| 字段 | 说明 |
|---|---|
| shot_id | 镜头编号 |
| global_start_s / global_end_s | 镜头在成片中的全局范围 |
| dialogue_source_file | 原声来源文件（mp4/wav） |
| dialogue_source_hash | 原声文件 SHA-256 |
| h3_full_audio_file / h3_full_audio_hash | H3 返回的完整音轨及哈希，必须归档用于排查额外旁白 |
| dialogue_stem_file / dialogue_stem_hash | 若 H3 提供独立对白 stem，记录其路径和哈希；否则填 null |
| speaker / line_text | 说话人和转写文本 |
| dialogue_start_s / dialogue_end_s | 对白在本镜内的真实起止；无对白填 null |
| narration_file | 旁白切片文件；无旁白填 null |
| narration_start_s / narration_end_s | 旁白在本镜内的真实起止；无旁白填 null |
| narration_duration_estimate | 视频生成前依据锁定音色和语速估算的旁白时长 |
| audio_order | narration_first / dialogue_first / narration_only / dialogue_only |
| silent_action_window | 旁白期间的无口型动作、反应或空镜区间 |
| pre_generation_window_check | 视频生成前的旁白 / 对白窗口可行性检查结果 |
| narrator_voice_id | 必须等于项目锁定值 |
| narrator_voice_profile_id / narrator_reference_audio_sha256 | 必须等于项目锁定值，用于发现音色漂移 |
| narrator_tts_batch_id | 当前文件的真实生成批次；首轮统一，授权修复可来自补充批次，禁止伪报相同 session |
| narration_repair_manifest | 原行/区间/文件、替换行/区间/文件、原批次/修复批次、参数锁、授权、检查与批准状态；无修复为空 |
| script_line_id / source_text / source_text_hash | 旁白必须引用已批准脚本行；音频、字幕和 prompt 必须逐字一致 |
| unsolicited_speech_check | `pass` 仅表示完整 H3 音轨中除预期对白外没有额外语音 |
| unsolicited_speech_segments | 额外旁白 / 评论 / 描述性语音的 ASR 区间；无则为空数组 |
| expected_speech_segments | 预期对白和（直出模式下）已提交的旁白区间；额外语音只与此集合之外的片段比较 |
| submitted_audio_bed_file / submitted_audio_bed_hash | 直出模式提交给 H3 的预锁定音频床及哈希；不支持时填 null |
| returned_audio_hash / audio_preservation_check | H3 返回音频哈希及原样保留结果；不一致则 fail |
| audio_gap_s | 两种语音之间的实际间隔 |
| overlap_check | pass / fail / unverified / not_applicable；有待测必需语音区间不得写 pass |

## 时间约束

同一镜头内必须满足：

~~~text
narration_end_s + 0.20 <= dialogue_start_s
或
dialogue_end_s + 0.20 <= narration_start_s
~~~

跨镜头时，先用 global_start_s 加上镜内 start/end 换算到全局时间，再排序。任意相邻语音区间必须满足：

~~~text
next.start_global_s - current.end_global_s >= minimum_speech_gap_s
~~~

语音区间不得超出所属镜头范围。已有镜头环境声/SFX 保留；BGM、后期音效和 ducking 只是后续独立剪辑任务的考虑，本 Skill 不据此新增混音。语音之间始终保留 0.20 秒间隔。

## 可执行校验伪代码

使用下例前须确认所有预期语音均有实测 start/end；只有确实无该语音才可填 null。预期语音缺测、仅有估算或缺文件时标 unverified，不因跳过空字段而宣称通过。该伪代码只检查区间，不证明文字、音色或交付完整性。

~~~python
def validate_voice_windows(rows, min_gap=0.20):
    windows = []
    for row in rows:
        shot_len = row["global_end_s"] - row["global_start_s"]
        for kind in ("narration", "dialogue"):
            start = row.get(f"{kind}_start_s")
            end = row.get(f"{kind}_end_s")
            if start is None or end is None:
                continue
            assert start < end, f"{row['shot_id']} {kind}: invalid interval"
            assert 0 <= start < end <= shot_len
            windows.append((row["global_start_s"] + start,
                            row["global_start_s"] + end,
                            kind, row["shot_id"]))
    windows.sort()
    for current, following in zip(windows, windows[1:]):
        if following[0] - current[1] < min_gap:
            raise ValueError(f"speech overlap/gap failure: {current} -> {following}")
    return "pass"
~~~

保留镜内和全局两套字段，禁止混用。此处验证交接音轨与计划时间线；最终文件复测只在之后独立获授权的剪辑任务中进行，本 Skill 不生成最终文件来跑此检查。

## 冲突修复候选方案（不是自动执行顺序）

1. 定位受影响行/语音区间，区分标注、切片边界与真实内容/时长问题；可修元数据或无损重切时不重新合成。
2. 列出最小改写/拆句、移窗、拆镜或延长（最多 10s）方案，批准已锁定契约的变更。
3. 若确需新增媒体，另行取得受影响行/镜头的次数、费用与范围授权，沿用完整音色锁及修复批次清单；不自动整批重做。
4. 实测替代段，复查受影响全局语音边界；保留兼容素材。需要调整的时间坐标不等于所有后续音频都要重生。
5. 达到目标/授权上限、无改善、外部阻塞、用户停止或下一步需扩大范围时，报告并停止。交接后不进入混音或导出。

不得通过加速、截断、交叉淡化、压低一条语音或静音来伪造通过。对白原声轨始终保留原始内容。

## 原声取证命令示例

输入视频的原声抽取（不改写输入文件）：

~~~bash
ffmpeg -i input.mp4 -map 0:a:0 -c:a pcm_s24le audio/input_dialogue_original.wav
ffprobe -v error -show_entries format=duration -of default=nw=1:nk=1 audio/input_dialogue_original.wav
~~~

H3 片段同样先归档 mp4，再从归档副本抽取 wav；旁白生成并完成 validate_voice_windows 后，将时间线与音频文件交接给用户自行剪辑。本 Skill 不执行最终成片导出后的 QC。
