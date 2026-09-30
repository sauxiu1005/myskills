---
name: beat-sync-editor
description: |
  音乐卡点剪辑 Skill。输入音乐（URL / 本地文件 / AI 生成）+ 视频或图片素材，
  自动完成情绪张力分析 → 智能裁剪 → 节拍分析 → 卡点时间轴生成 → 素材匹配 → ffmpeg 拼接合成，
  输出与音乐完美对齐的卡点视频成片。
  支持图片幻灯片、视频片段、混合素材三种输入，支持每 N 拍换素材、
  前奏/副歌自动分段、用户手动标注关键点等多种卡点模式。
  触发词包括：音乐卡点、卡点剪辑、beat sync、beat-sync video、
  节拍剪辑、卡点视频、音乐节奏剪辑、节奏卡点、beat detection、
  按节拍剪辑、自动卡点、music sync edit。
trigger-words:
  - 音乐卡点
  - 卡点剪辑
  - 卡点视频
  - 节拍剪辑
  - 自动卡点
  - beat sync
  - beat-sync video
  - beat detection
  - music sync edit
  - 按节拍剪辑
---

# Beat-Sync Editor — 音乐卡点剪辑

当用户想要「把一批图片/视频素材配上音乐，按节拍自动切换」时，使用此 Skill。
核心流程：**音乐来源确认 → 情绪张力分析 → 目标时长裁剪 → 节拍分析 → 时间轴规划 → 素材分配 → ffmpeg 拼接 → 成片**。

---

## STEP 0: 收集输入

确认以下三项输入，缺哪项就问用户：

### 0a. 音乐来源（三选一）

| 类型 | 操作 |
|------|------|
| HTTP/HTTPS URL | 用 `curl -L -o music.ext <url>` 下载到会话目录，记录本地路径 |
| 本地文件路径 | 直接使用，调用 `save_file_to_session` 注册到会话 |
| AI 生成音乐 | 调用 **audio agent**，告知风格/BPM/时长需求，获取生成后的本地路径 |

> **注意**：下载后用 `ffprobe` 验证文件时长，记录 `total_duration`（秒）。

### 0b. 素材列表

支持三种类型（可混合）：

- **图片**（jpg/png/webp）：每张图将被处理成一段静态视频片段
- **视频片段**（mp4/mov）：直接按时间轴截取或整段使用
- **AI 生图补充**：若用户素材数量少于节拍数，告知用户并询问是否调用 image agent 自动补充生图

记录所有素材的本地路径列表。

### 0c. 卡点参数

询问用户（若未指定）：

| 参数 | 默认值 | 说明 |
|------|--------|------|
| 检测模式 | `beat` | `beat`=标准节拍 / `onset`=音头（更敏感） / `segment`=自动分段 |
| 每 N 拍换一次 | `1` | `2` 表示每 2 拍换一次素材，节奏感更舒缓 |
| 手动关键点 | 无 | 用户可提供额外时间点（秒），强制在此处切换素材 |
| 输出比例 | `9:16` | 竖屏短视频 / `16:9` 横屏 / `1:1` 方形 |

---

## STEP 0.5: 情绪张力分析 + 目标时长裁剪

> **触发条件**：音频时长 > 用户预期的成片时长，或用户未指定时长但音频超过 60s。
> 若音频已经很短（≤ 30s）或用户明确说"用整首歌"，跳过此步骤直接进入 STEP 1。

### 0.5a. 运行情绪张力分析脚本

使用内置脚本 `scripts/energy_analyze.py`，分析音频的能量分布，找出情绪张力最强的区段：

```bash
python scripts/energy_analyze.py <音乐本地路径> \
  --targets "15,30,60" \
  --out json
```

脚本输出：
- `energy_peak`：全曲能量峰值时间点（秒）
- `sections`：各段落的能量得分排序（高→低）
- `trim_options`：针对每个目标时长（15s / 30s / 60s）的**最佳裁剪窗口**（start, end, energy_score, description）

> **脚本路径**：`scripts/energy_analyze.py`（与 SKILL.md 同目录）

### 0.5b. 向用户展示裁剪方案

将分析结果整理成选项，**用 question 组件**呈现给用户选择：

展示格式示例：
```
🎵 音频总时长：202s | BPM：143 | 情绪峰值点：87.3s

请选择成片时长：

  ① 15秒  ▎起 80.1s → 95.1s  ▏张力 ★★★★★  覆盖最强爆发点，情绪张力最高
  ② 30秒  ▎起 72.0s → 102.0s ▏张力 ★★★★☆  副歌完整段落
  ③ 60秒  ▎起 62.0s → 122.0s ▏张力 ★★★☆☆  含前奏引入 + 完整副歌
  ④ 使用完整音频（202秒）
  ⑤ 自定义时间段（手动输入 start/end）
```

**能量星级换算**：energy_score ≥ 0.85 = ★★★★★，≥ 0.70 = ★★★★☆，≥ 0.55 = ★★★☆☆，其余 = ★★☆☆☆

**默认推荐**：高亮显示 energy_score 最高的选项（通常是时长最短的那个，因为窗口越小越容易聚焦高能区）。

### 0.5c. 按用户选择裁剪音频

用户确认后，用 ffmpeg 裁剪音频为目标片段，后续所有步骤（节拍分析、素材分配、合成）均基于裁剪后的音频：

```bash
ffmpeg -i <原始音频> -ss <start> -to <end> -c copy <audio_trimmed.mp3>
```

> **为什么裁剪后再做节拍分析**：节拍分析的计算量与音频时长成正比；
> 同时裁剪后的 beat_times 直接对应最终视频的时间轴，无需再做偏移换算。

---

## STEP 1: 节拍分析

使用内置脚本 `scripts/beat_detect.py` 进行节拍检测：

```bash
# 安装依赖（首次运行）
pip install librosa soundfile

# 运行检测
python scripts/beat_detect.py <音乐本地路径> \
  --mode <beat|onset|segment> \
  --every-n <N> \
  --manual "<t1,t2,...>" \
  --min-gap 0.25 \
  --out json > beat_result.json
```

脚本输出 JSON，包含：
- `bpm`：检测到的 BPM
- `total_duration`：音乐总时长（秒）
- `beat_count`：有效节拍数
- `beat_times`：节拍时间点列表（秒）
- `sections`（仅 segment 模式）：段落分析结果

> **脚本路径**：`scripts/beat_detect.py`（与 SKILL.md 同目录）

向用户展示检测摘要：BPM、节拍数、时长，确认是否合理后继续。

---

## STEP 2: 时间轴规划

根据节拍分析结果，**在 orchestrator 自行计算**每个素材片段的时间区间：

```
segments = []
for i in range(len(beat_times)):
    start = beat_times[i]
    end   = beat_times[i+1] if i+1 < len(beat_times) else total_duration
    duration = end - start
    segments.append({ "index": i, "start": start, "end": end, "duration": duration })
```

**素材分配规则**：
- 素材数量 ≥ 节拍数：按顺序取前 N 个，多余的丢弃
- 素材数量 < 节拍数：**循环复用**（`material_index = segment_index % len(materials)`），并告知用户有复用
- 若用户不接受复用：提示调用 image agent 按缺口数量补充生图

**segment 模式额外逻辑**：
- 前奏/尾奏（`intro`/`outro`）节拍间隔较宽，建议每拍分配一张素材（慢切）
- 副歌/高潮（含"chorus"的 label）节拍间隔较窄，建议保持原始节拍密度（快切）
- 若用户提供了手动关键点，这些位置强制切换，不受 every-N 参数影响

向用户展示规划摘要表（前 5 行 + 总计），确认继续。

---

## STEP 3: 素材预处理

调用 **editing agent** 批量处理所有素材，统一规格：

告知 editing agent：

> 「请帮我处理以下 N 个素材文件，将每个文件转换为以下规格：
> - 分辨率：[目标宽x高，根据输出比例决定，如 1080x1920]
> - 帧率：30fps
> - 编码：h264，像素格式 yuv420p
> - 对于**图片**：转为 [duration]s 的静态视频（duration 来自时间轴规划）
> - 对于**视频**：截取前 [duration]s，若片段不足则 loop 补齐或 pad 黑帧
> - 对于**尺寸不匹配**：使用 scale+pad（保持原始比例，黑边补齐）
> 输出文件命名：`clip_001.mp4`, `clip_002.mp4` ...」

**为什么预处理**：ffmpeg concat 要求所有片段分辨率、帧率、编码完全一致，否则合成会报错或产生画面撕裂。

---

## STEP 4: 确认预览（可选）

若用户明确要求预览，或素材数量 > 20，**在合成前**展示：
- 时间轴规划表（序号 / 素材文件名 / 开始时间 / 时长）
- 总成片时长预估

询问用户是否有调整：
- 更换某个位置的素材
- 调整 every-N 参数重新规划
- 手动添加/删除关键卡点

如有调整，回到 STEP 2 重新规划，无需重新做节拍分析。

---

## STEP 5: ffmpeg 拼接合成

调用 **editing agent**，提供以下信息：

> 「请将以下片段按顺序拼接，并混入音轨：
>
> 片段列表：`clip_001.mp4`, `clip_002.mp4`, ... `clip_N.mp4`
> （按 STEP 3 生成的文件顺序）
>
> 音轨：`<音乐本地路径>`
>
> 要求：
> - 使用 ffmpeg concat（不转码，直接流合并）
> - 音频使用原始音乐，视频合成后去掉所有素材的原始音轨（-an），避免叠音
> - 音乐若长于视频则截断（`-shortest`），若短于视频则循环（`-stream_loop -1`）
> - 输出文件：`beat_sync_output.mp4`
> - 编码：h264 + aac，质量 CRF 18」

**为什么去掉素材原始音轨**：合成步骤会将音乐轨叠加进来，若保留素材原音会产生双重音频。

---

## STEP 6: 展示成片

向用户展示 `beat_sync_output.mp4`，并附上摘要：

```
✅ 卡点视频生成完成

🎵 音乐：<文件名> | BPM: <bpm>
🎬 素材：<N> 个（图片 X 张 + 视频 Y 段）
⏱ 成片时长：<duration>s
📐 输出比例：<ratio>
🔄 素材是否有复用：<是/否>
```

若用户对成片有以下调整需求：
- **换素材**：更换指定位置的素材 → 回 STEP 3 只重处理该素材，再回 STEP 5 合成
- **调节奏**（改 every-N）→ 回 STEP 2 重新规划
- **换音乐**：全流程重来（STEP 1 起）
- **加转场效果**（淡入淡出等）：告知 editing agent 在合成时对每个片段加 fade filter

---

## 技术说明

### 依赖安装
```bash
pip install librosa soundfile  # 两个脚本共用
```

### energy_analyze.py 脚本参数速查

| 参数 | 说明 | 示例 |
|------|------|------|
| `--targets "15,30,60"` | 要计算的目标时长列表（秒） | 根据场景调整，如 `"30,45,90"` |
| `--out json` | 输出格式（json / text） | text 适合快速调试 |

**能量分析维度**（加权合成）：
- 响度（RMS）× 0.5 — 最直接反映音量强弱
- 节拍冲击强度（Onset Strength）× 0.3 — 反映鼓点/节拍爆发感
- 音色明亮度（Spectral Centroid）× 0.2 — 高能段通常高频更丰富

### beat_detect.py 脚本参数速查

| 参数 | 说明 | 示例 |
|------|------|------|
| `--mode beat` | 标准节拍跟踪（默认） | 流行/电子音乐 |
| `--mode onset` | 音头检测，对打击乐更敏感 | 说唱/鼓点密集曲目 |
| `--mode segment` | 分段分析，自动识别前奏/副歌 | 有明显段落的流行曲 |
| `--every-n 2` | 每 2 拍输出一个切点 | 素材少、节奏舒缓时 |
| `--manual "8.5,32.0"` | 强制在 8.5s 和 32.0s 处加切点 | 用户有特定关键帧需求 |
| `--min-gap 0.5` | 相邻切点最少间隔 0.5s | 防止切换过快 |

### 常见问题

**Q: 情绪分析找到的"高能段"感觉不准？**
→ 可能是弦乐/人声主导的歌曲，能量特征不如打击乐明显。让用户选"自定义时间段"手动输入。

**Q: 检测到的节拍太多，画面切换太快？**
→ 增大 `--every-n`，或增大 `--min-gap`，或换 `segment` 模式

**Q: 某段音乐节拍检测不准（如弦乐、人声段落）？**
→ 改用 `--mode onset`，或让用户手动提供关键时间点 `--manual`

**Q: 素材数量远少于节拍数？**
→ 默认循环复用；或询问用户是否调用 image agent 按差额数量 AI 生图

**Q: ffmpeg 合成报错"Stream codec parameters not set"？**
→ STEP 3 预处理中可能有文件转换失败，让 editing agent 检查并重新处理失败的素材
