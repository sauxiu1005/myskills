# 歌词拆解

## 目标

将歌曲音频转为带时间戳的歌词段落，标注纯音乐段（前奏/间奏/尾奏）。

## 输入

| 输入 | 必需 | 说明 |
|------|------|------|
| 音频文件 | 是 | 歌曲音频文件路径 |
| LRC 文件 | 否 | 如提供则直接解析，跳过 ASR |

## 处理流程

如果用户未提供音频文件，直接在对话中向用户提问，要求提供音频文件路径。音频文件是整个 MV 创作流程的前提，必须先获取。

音频文件确认后，扫描 `.mv/*/lyric.md` 中的 `音频：`/`Audio:` 字段，检查是否已有该音频路径对应的歌词拆解：

- **已存在** → 读取已有的 `lyric.md` 内容，展示给用户，通过 `AskUserQuestion` 询问用户：
  - 直接使用已有歌词拆解，进入下一阶段
  - 重新拆解（覆盖已有文件）
- **不存在** → 继续正常拆解流程

正常拆解流程：如果用户未提供 LRC 文件，通过 `AskUserQuestion` 询问用户是否有 LRC 文件可以提供（选项：有/没有）。
- 用户提供了 → 走路线 A
- 用户没有 → 走路线 B（ASR 兜底）

### 路线 A：用户提供 LRC 文件

直接解析 LRC 文件，提取时间戳和歌词文本。

### 路线 B：ASR + LLM（兜底方案）

1. **获取音频时长**：通过 ffprobe 获取音频总时长
   ```bash
   ffprobe -v error -show_entries format=duration -of csv=p=0 <audio_path>
   ```
2. **音频预处理**：检查文件大小，如果超过 5MB 则先压缩再调用 ASR（`hilo_tools_audio_transcribe_lyrics` 限制 10MB）
   ```bash
   # 检查文件大小（字节）
   stat -f%z <audio_path>          # macOS
   stat -c%s <audio_path>          # Linux
   wc -c < <audio_path>            # 跨平台
   (Get-Item <audio_path>).Length   # Windows PowerShell
   # 如果 > 5242880（5MB），压缩为 64kbps 单声道
   ffmpeg -y -i <audio_path> -b:a 64k -ar 16000 -ac 1 <compressed_path>
   ```
   压缩后使用 `<compressed_path>` 调用 ASR，原始音频保留用于后续阶段。
3. **ASR 识别**：调用 MCP 工具 `hilo_tools_audio_transcribe_lyrics`，获取词级时间戳
   - 中文自动使用 Tencent Cloud ASR，其他语言使用 Whisper ASR
   - 返回的 JSON 包含 segments（时间戳 + 歌词 + 词级信息）
4. **纯音乐段检测**：工具自动识别并标注无歌词段落
   - 开头无歌词 > 0.5s → `[prelude]`
   - 歌词间间隙 > 5s → `[interlude]`
   - 结尾无歌词 > 0.5s → `[outro]`
5. **歌词矫正**：调用 MCP 工具 `hilo_tools_read_media` 传入音频文件，获取对音频内容的听写结果，然后 LLM 结合 ASR 结果和听写结果进行歌词矫正（纠正错别字、断句、标点等）

## 输出格式

每个段落包含时间码和歌词文本，纯音乐段用方括号标记。**文件头部必须包含音频文件路径**（相对项目根目录），用于后续阶段引用和歌词拆解去重判断。

完整示例见 `references/lyric-example.md`（非中文用户参考 `references/lyric-example-en.md`）。

> 注：每个时间段的歌词按实际演唱的句子逐行拆分，一句一行。

## 格式校验

歌词写入 `lyric.md` 后，**必须**运行校验脚本：

```bash
python3 .opencode/skills/mv-creator/scripts/validate_lyric.py .mv/{song_name}/lyric.md
```

校验规则：时间码格式、时间段连续性、单段建议不超过 20 秒（WARN）、纯音乐段无歌词、歌词段非空。

- **通过** → 调用 MCP 工具 `preview_and_collect_feedback` 启动预览：
  - **script**: `.opencode/skills/mv-creator/scripts/render_preview.py`
  - **args**: `[".mv/{song_name}/lyric.md", "--type", "lyric", "--lang", "{lang}"]`
  - **feedback_path**: `.mv/{song_name}/feedback.md`

  工具会启动预览服务器、打开浏览器，等待用户提交反馈后直接返回反馈内容：
  - 内容为 `LGTM` → 用户确认无修改，进入下一阶段
  - 其他内容 → 用户的编辑建议，按建议修改后重新校验和预览
- **未通过** → 通过 `AskUserQuestion` 询问用户处理方式：
  - **用户手动修改**：暂停流程，等待用户修改 `lyric.md` 后重新校验
  - **重新 ASR**：重新执行 ASR 识别和 LLM 矫正，覆盖当前文件
  - **模型自动修复**：由 LLM 根据校验错误信息自动修正 `lyric.md`，修复后重新校验
  - **中止流程**：终止 MV 创作流程

## 文件存储

```
./.mv/{song_name}/lyric.md
```
