# 视频剪辑

## 目标

将所有生成的视频片段按脚本时间线拼接，嵌入歌曲音频，输出完整 MV 成片。

## 工具

本阶段全部使用本地 `ffmpeg` / `ffprobe` 命令完成，不调用任何远程 MCP 工具。

## 流程

### 1. 素材校验

检查 `clips/` 目录下所有视频片段是否齐全（与 `storyboard.md` 幕数一致），通过 `ffprobe` 检查分辨率/帧率是否统一。如有不一致，先用 `ffmpeg` 统一转码：

```bash
# 检查视频信息
ffprobe -v error -select_streams v:0 -show_entries stream=width,height,r_frame_rate,codec_name -of csv=p=0 <input.mp4>

# 统一转码（示例：统一为 1280x720, 30fps）
ffmpeg -i <input.mp4> -vf "scale=1280:720:force_original_aspect_ratio=decrease,pad=1280:720:(ow-iw)/2:(oh-ih)/2" -r 30 -c:v libx264 -preset medium -crf 18 -an <output.mp4>
```

### 2. 裁剪时长

根据脚本时间码，用 `ffmpeg` 将每个视频片段裁剪至对应幕的精确时长：

```bash
ffmpeg -i <input.mp4> -t <duration_seconds> -c copy <output.mp4>
```

如裁剪后需要重编码（例如精确到帧），去掉 `-c copy`。

### 3. 拼接视频

使用 `ffmpeg` concat demuxer 将所有裁剪后的视频片段按脚本顺序拼接：

```bash
# 1. 生成 filelist.txt
echo "file 'clip_01.mp4'" > filelist.txt
echo "file 'clip_02.mp4'" >> filelist.txt
# ... 按顺序列出所有片段

# 2. 拼接
ffmpeg -f concat -safe 0 -i filelist.txt -c copy <merged.mp4>
```

如果片段编码参数不完全一致，改用重编码拼接：

```bash
ffmpeg -f concat -safe 0 -i filelist.txt -c:v libx264 -preset medium -crf 18 -an <merged.mp4>
```

### 4. 嵌入音频

用 `ffmpeg` 将歌曲音频嵌入拼接后的视频，替换原有音频（如有）：

```bash
ffmpeg -i <merged.mp4> -i <audio_file> -c:v copy -c:a aac -b:a 192k -map 0:v:0 -map 1:a:0 -shortest <output_with_audio.mp4>
```

音频文件路径从 `lyric.md` 的 `音频：` / `Audio:` 行读取。

### 5. 字幕烧录（可选）

通过 `AskUserQuestion` 询问用户是否需要烧录歌词字幕（选项：需要 / 不需要）。

- **需要** → 先从 `lyric.md` 提取时间码和歌词，生成 SRT 字幕文件，再用 `ffmpeg` 烧录：

```bash
# 烧录字幕（硬字幕）
ffmpeg -i <input.mp4> -vf "subtitles=<subtitle.srt>:force_style='FontSize=24,PrimaryColour=&HFFFFFF,OutlineColour=&H000000,Outline=2,Alignment=2'" -c:v libx264 -preset medium -crf 18 -c:a copy <output.mp4>
```

- **不需要** → 跳过此步

### 6. 输出成片

将最终成片保存到 `output/final.mp4`。

向用户输出项目总结（见下方「完成总结」模板），包含所有阶段的关键产物路径和统计信息。

## 完成总结

成片输出后，向用户汇报以下信息：

```
MV 创作完成总结
-----------------
歌曲：{song_name}
主题：{theme}
总时长：M:SS
总幕数：N 幕

项目目录：.mv/{song_name}/{theme}/
├── 歌词拆解：lyric.md
├── 故事概念：story_concept.md
├── 脚本：script.md（N 幕，含动态描述）
├── 美术风格：art_style.md
├── 角色设计：{character_count} 个角色
├── 背景图：{background_count} 个场景背景
├── 关键物件：{props_count} 个物件（如有）
├── 分镜规划：storyboard.md（N 幕）
├── 视频片段：clips/（N 段）
└── 成片：output/final.mp4

成片路径：.mv/{song_name}/{theme}/output/final.mp4
```

## 文件存储

```
./.mv/{song_name}/{theme}/output/final.mp4                  # 最终成片
```
