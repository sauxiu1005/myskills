# 事件表与声音（Cue Sheet & Audio）

把已确认的语义分镜转成**唯一事件表** `cues.json`。画面渲染、字幕、音效/音乐/旁白混音都只读这一份时间表；任何模块都不再自己硬编码同一个落点（例如"落地在第 66 帧"只写在事件表里一次）。

## 1. 结构

```json
{
  "schema": "retro-pixel-cues/1",
  "title": "…",
  "fps": 24,
  "duration_frames": 480,
  "timing_status": "planned",
  "audio": null,
  "shots": [{"id": 1, "start": 0, "end": 96}],
  "events": [
    {"id": "s1-buy", "shot_id": 1, "frame": 40, "duration_frames": 12,
     "semantic_trigger": "卖出三个面包", "visual": "三个面包离架，计数 3 弹出",
     "subtitle": {"text": "…"}, "sfx": {"name": "门铃", "gain_db": -6},
     "music": null, "palette": null}
  ],
  "sync_report": []
}
```

| 字段 | 规则 |
|---|---|
| `fps` | 正整数，或有理数字符串 `"24000/1001"` / `{"num":24000,"den":1001}`；禁止 23.976 这类小数近似 |
| `duration_frames` | 正整数，总长；所有区间为 `[start, end)` |
| `timing_status` | `planned`（拟定，无实测音频）或 `measured`（已按实测音频对齐）；`audio` 为空时只能是 `planned` |
| `audio` | 可空。非空时写 `path`、`sample_rate`、`trim_start_samples`（素材裁掉的开头采样数）、`offset_frames`（音频第 0 采样对应的视频帧），以及 `measured_by`（如何测得） |
| `shots` | 与分镜一致，按顺序连续覆盖 `[0, duration_frames)` |
| `events[]` | `id` 唯一；`shot_id` 必须存在；`frame` 为整数；可选 `duration_frames`；事件区间必须落在其镜头内；`semantic_trigger` 写句意触发点，`visual` 写画面动作 |
| 可选通道 | `subtitle {text}`、`sfx {name, gain_db}`、`music {action, name}`、`palette {to, transition_frames, light?}` |

校验：`python3 scripts/check_cues.py <cues.json> --storyboard <storyboard.json>`。

## 2. 时间换算

- 内部一律整数帧。秒→帧只在边界做一次（读入旁白/歌词时间码、导出字幕时间码）。
- 帧→音频采样：`sample = round_half_up(frame × sample_rate / fps) + trim_start_samples − offset_samples`，用有理数计算（fps 为 24000/1001 时不能用 23.976）。
- 音频素材被裁切或延后放置时，`trim_start_samples` 与 `offset_frames` 必须写明，否则所有落点都会整体偏移。

## 3. 拟定与实测

- 没有音频：`timing_status: planned`，交付中写"时间为拟定，未做声画同步"。
- 有旁白或歌曲：以**实测音频**为准（旁白分句时间、歌词时间、实测节拍/起音），再改事件帧；不为了贴 BPM 而切断句意或包袱。
- 只有逐条测过的事件才能在 `sync_report` 中标 `measured`。

## 4. 声音分层

| 层 | 内容 | 规则 |
|---|---|---|
| 旁白/人声 | 讲解、叙事、歌词演唱 | 最高优先；其他层按 §6.1 相对旁白定电平并侧链闪避（旁白区音乐低 ≥15 LU） |
| 音乐 | 配乐、节奏底 | 风格按内容选：科普多用克制器乐，MV 用歌曲本身；8-bit/chiptune 只是可选项，不是默认 |
| 音效 | 语义关键动作 | 只给推动句意的动作配音效（计数、落地、门铃、揭示）；不要每个粒子、每步像素都响 |
| 环境 | 雨、街声、机房嗡鸣 | 低电平铺底，跟随场景切换 |

## 5. 实测同步报告字段

```json
{"event_id": "s3-stack-1", "target_frame": 204,
 "video_frame_measured": 204, "audio_onset_sample": 408000, "audio_onset_s": 8.5,
 "error_frames": 0.0, "status": "measured", "method": "逐帧查看 + 波形起音检测"}
```
建议瞬态（冲击、门铃、计数）误差 ≤ 1 个输出帧。未测量的事件 `status: "not_measured"`，不填数值，不写"已同步"。

## 6. 响度

响度与真峰值遵循交付平台或用户要求。未知时可以**建议**一个常见的流媒体参考值并注明是建议，不当作通用硬性标准。未实测不报告响度通过。

### 6.1 旁白优先混音（0.4.7，硬性约束）

测试反馈：讲解片“旁白太小、BGM 太大”。原因是对整条混音只做一次响度归一，把音乐和旁白一起抬高，相对电平没有被控制。有旁白时必须按下面的规则混音：

**顺序固定**：旁白归一 → 旁白预限幅 → 音乐、音效**相对旁白**定电平并闪避 → 总线归一 → 限幅。不要只对整条混音做一次 loudnorm。

| 层 | 默认 | 硬性下限 |
|---|---|---|
| 旁白 | 高通 80Hz；3kHz +2–3dB；轻压缩 2.5:1；归一 -16 LUFS 后预限幅 -4 dBFS；不变速不变调 | 全片最响的一层 |
| 音乐 | 闪避前比旁白低约 4 LU；2.5kHz 让出约 4dB；旁白驱动的侧链闪避 15–18dB（起 40ms、释放 350ms、保持 300ms 盖住句内停顿、预读 30ms，dB 域平滑不抽吸） | 旁白区内比旁白低 **≥15 LU**；空隙与结尾定格可回升，但仍比旁白低 **≥6 LU** |
| 音效 | 旁白期间整体再压 6dB；每个事件同时限峰值与有效值（方波“哔哔”类峰均比低，只限峰值不够） | 旁白期间峰值比旁白低 **≥6 dB**（建议 7），有效值低 ≥9 dB；不盖住正在说的字 |
| 总线 | 短视频平台默认 -14 LUFS / 真峰值 ≤ -1.0 dBTP；限幅器设在目标以下约 0.8dB，抵消 AAC 过冲 | 用户或平台另有要求时从其要求 |

**必须实测并报告**（`mix_report.json` + `cues.json` 的 `sync_report`）：输出旁白、音乐、音效三条分轨（32 位浮点 WAV 测量）；分别给出它们在“旁白区”和“非旁白区”的 LUFS、旁白与音乐的 LU 差、逐句音效峰值差，以及最终成片 AAC 音轨的整体 LUFS 与真峰值。任何一项未达到硬性下限，不交付，先改混音。只有数值没有试听时注明“未主观试听”。
