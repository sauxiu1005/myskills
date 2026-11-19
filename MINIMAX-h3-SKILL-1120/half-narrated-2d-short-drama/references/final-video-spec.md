# 旁白交接规格与后续剪辑意图模板 v2.1

高成本生成前确认本规格。确认后，旁白/对白分离与原声政策不可放宽。主文件的停止点和授权规则优先；本模板记录的成片、字幕和平台意图不授权制作最终成片。

首轮统一旁白与授权局部补录按 voice-presets 执行；本规格不要求所有修复文件伪装为同一批次，也不因局部缺陷宣布整集作废。

~~~yaml
drama_title: ""
delivery_scope: "narration_handoff"
stop_after: "narration_handoff"
final_assembly_authorized: false
narration_repair_policy: "authorized_affected_lines_only"
narration_repair_manifest: []
rework_authorizations: []
episode_number: 1
aspect_ratio: "9:16"
target_duration_s: 90
output_language: "zh-CN"
visual_style_lock: "2D-cel-webtoon"
visual_sub_mode: "guoman-webtoon"
narrative_dialogue_balance: "60% / 40%"
narrator_voice_id: "selected catalog narrator voice ID"
narrator_voice_preset_label: "经典抖音解说"
narrator_speed: 1.15
narrator_pitch: 0
narrator_emotion: "fast_short_drama_commentary"
narrator_pause_policy: "compressed_punctuation_pauses"
narrator_delivery_style: "brisk_clear_hook_forwarding"
narrator_volume: 1.0
narrator_sample_rate: 48000
narrator_codec: "wav_pcm_s16le"
narrator_loudness_target_lufs: -16
narrator_voice_profile_id: ""
narrator_reference_audio_sha256: ""
narrator_tts_batch_id: ""
narration_render_mode: "episode_master_then_slice"
script_source_of_truth: "approved_script_manifest"
prompt_generation_mode: "mechanical_from_shot_manifest"
prompt_script_match_required: true
h3_audio_policy: "dialogue_only; narration_forbidden_in_shot_audio"
h3_audio_validation_required: true
audio_render_mode: "separate_narration_master_then_user_editing"
h3_must_preserve_submitted_audio: true
audio_policy:
  dialogue_source_mode: "rendered_video_original"
  dialogue_replacement_allowed: false
  narration_dialogue_overlap_allowed: false
  minimum_speech_gap_s: 0.20
  dialogue_voice_map: {}
  audio_timing_mode: "dialogue-first-then-narration-gaps"
backend: "the platform’s currently available video capability"
generation_mode: "platform-supported reference mode"
video_input_mode: "h3_reference_mode"
resolution: "user_selected_768P_or_2K"
asset_binding_required: true
source_policy:
  uploaded_image_mode: "user_confirmed_direct_or_reference"
  plot_fidelity: "preserve_original_plot"
  missing_asset_policy: "audit_then_generate_before_storyboard"
subtitle_mode: "hard-burn"
delivery_platform: "douyin"
no_text_overlay_in_shot_render: true
no_watermark_in_shot_render: true
no_baked_in_bgm_in_shot_render: true
~~~

## 锁定规则

1. 对白只使用输入视频或 H3 片段的原始语音轨；禁止另行对白 TTS、重配或覆盖。
2. 先测量对白真实窗口，再生成旁白；每个语音区间至少相隔 0.20s。
3. 本 Skill 实测分离音轨及交接时间线，不接受“听起来没有重叠”代替区间证据。最终导出后复测仅属于用户之后明确委托的独立剪辑任务；在本交接检查中标为不适用，不触发导出。
4. 镜头音轨禁止自动旁白；首轮旁白统一独立母轨/批次，锁定完整音色参数。局部修复需授权与来源清单，整集换音色/重做需单独全量授权；不改变未受影响视频或对白原声。交接后停止，不自动装配。
5. 生成前先询问清晰度 `768P` 或 `2K`，确认后整集锁定；镜头时长 4–10s，超过 10s 必须拆镜。
6. 每镜必须记录角色、场景、道具等实际使用资产的 `asset_manifest` ID / 路径 / SHA-256；缺少对应资产时先补齐再生成。首帧图不是必需输入。
7. 上传剧本只允许结构化分析，不得未经批准改动剧情；上传图片先按用户选择直接使用、参考重生成或混合使用。
