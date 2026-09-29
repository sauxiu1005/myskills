# 美术风格

## 目标

在人设图和分镜图生成之前，确定 MV 的整体美术风格，为后续视觉生成提供统一的风格基准。

## 内置风格预设

内置风格的预览图首次预览时由 `scripts/download_style_presets.py` 自动下载到 `.mv/{song_name}/{theme}/style_cache/{style}/` 本地目录，后续直接复用本地缓存。下游 `art_style.md` 的 `参考图：` 字段统一记录本地路径，确保生图工具的 `image_paths` 可直接读取。

| 目录 | 风格 | 说明 |
|------|------|------|
| `cinematic/` | 电影质感写实 | 35mm胶片颗粒、暖琥珀色调、自然光、宽银幕 |
| `oil-painting/` | 油画风格 | 厚重笔触、印象派色彩、painterly 质感 |
| `noir-illustration/` | 黑色插画 | 高对比剪影、图像小说风、琥珀色点缀 |

## 流程

调用 MCP 工具 `preview_and_collect_feedback` 启动美术风格选择页面：
- **script**: `.opencode/skills/mv-creator/scripts/render_preview.py`
- **args**: `[".mv/{song_name}/{theme}", "--type", "art_style", "--lang", "{lang}"]`
- **feedback_path**: `.mv/{song_name}/{theme}/feedback.md`

页面是一个交互式选择界面，包含：

- **内置风格展示区**：脚本首次启动时通过 `download_style_presets.py` 把内置风格预设图缓存到 `.mv/{song_name}/{theme}/style_cache/{style}/`，按分类展示，附风格关键词标签
- **自定义风格区**：允许输入 **风格描述文字**、上传 **1 张** 自定义参考图，或两者兼用（上传后保存到项目 `style_references/` 目录）
- **选择提交区**：用户选定风格方向后提交

工具返回反馈内容后：

- **选择内置预设** → 直接结合预设信息生成 `art_style.md`
- **选择自定义风格** → 根据用户提供的内容生成 `art_style.md`：
  - 仅文字描述 → 基于描述提取风格关键词，生成 `art_style.md`
  - 仅参考图 → 用 `read_media` MCP 工具分析参考图的美术风格特征（线条、色彩、构图、质感等），再基于分析结果生成
  - 文字 + 参考图 → 结合文字描述和参考图分析结果，综合生成

**确保参考图可用**：`art_style.md` 的 `参考图：` 列表必须包含至少一张图片。
如果用户选择的是纯文本自定义风格（无内置预设图、无上传参考图），则在生成 `art_style.md` 之前，先用 Midjourney 根据风格关键词生成一张风格参考图，保存到 `style_references/` 目录，并写入 `参考图：` 列表。这确保后续人设图和分镜图生成阶段始终有可用的风格参考图。**此处 MJ 生成的四宫格不需要裁切**，仅需一张完整图作为风格参考即可。

生成的 `art_style.md` 记录：

- 风格名称和描述
- 选定的参考图路径（**至少一张**）
- 色调、光影、质感等关键词
- 适用的生图模型推荐

**风格 JSON 提取**：`art_style.md` 生成后，**必须**从参考图中提取结构化的风格 JSON。调用 `read_media` MCP 工具，传入参考图路径和以下提示词：

```
请以专业的艺术品鉴观角，深度分析这张图片的视觉风格。请忽略画面具体内容（比如人物、剧情），色彩风格、色彩调色板（hex代码）、构图风格、纹理质感、材质效果、线条风格、艺术风格关键词。请将分析结果输出为一段精简的 JSON 格式或描述，不要任何解读，就只要 JSON 结构。
```

将返回的 JSON 结果写入 `art_style.md` 的 `风格JSON：` 字段中。此 JSON 将在后续人设图、背景图和关键物件图生成时作为风格描述注入提示词，替代直接传入参考图。

## 输出格式

完整格式示例见 `references/art-style-example.md`（非中文用户参考 `references/art-style-example-en.md`）。关键要点：

- 首行 `美术风格：` + 风格名称
- 包含字段：`风格描述：`、`关键词：`、`色调：`、`光影：`、`推荐生图模型：`、`参考图：`、`风格JSON：`
- 关键词使用英文，用于后续生图 prompt
- 参考图路径相对项目目录，每行一个
- 风格JSON 为 `read_media` 分析参考图返回的结构化风格数据

## 文件存储

```
./.mv/{song_name}/{theme}/art_style.md                     # 美术风格说明
./.mv/{song_name}/{theme}/style_cache/                     # 内置风格预设 CDN 缓存（首次预览自动下载）
./.mv/{song_name}/{theme}/style_references/                # 用户上传的参考图（如有）
```

## 风格路由

美术风格确定后，判断风格是否属于**写实类**，决定后续工作流：

**写实类判定**：以下情况视为写实风格：
- 用户选择了内置预设「电影质感写实（cinematic）」
- 用户自定义风格的描述或关键词偏向写实（如包含 photorealistic / realistic / cinematic / 写实 / 真人 / 实拍 等特征）

**路由规则**：
- **写实风格** → 停止 mv-creator 主流程，告知用户写实风格将使用写实分支流程（支持口型同步等写实 MV 能力）。读取 `phases/realistic-pipeline.md`，从 STEP 0 开始执行，将已有的音频文件路径和歌词数据（`.mv/{song_name}/lyric.md`）传递过去，跳过已完成的音频获取和歌词提取步骤
- **非写实风格（油画、插画、动画、自定义非写实等）** → 继续 mv-creator 的下一阶段（脚本生成）
