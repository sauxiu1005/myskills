# 背景图生成

## 目标

基于脚本中的场景描述，为每个独立场景环境生成统一背景参考图。每一幕都需要对应一个背景，相似场景可合并复用同一背景。

## 背景类别

- **室外场景**：公路、荒野、山谷、海滩、街道等开阔环境
- **室内场景**：酒馆、卧室、教室、工厂等封闭空间
- **特殊环境**：梦境、回忆、超现实场景等

## 流程

### 1. 自动提取与去重

读取 `script.md` 中所有场景描述，提取每幕的场景环境。将相似的场景环境归并为同一背景（如第一幕和第七幕都在"荒漠公路"则合并），列出去重后的背景列表，附带每个背景的出场幕列表和环境描述摘要。

**每一幕都必须被覆盖** — 确保所有幕的场景环境都被归类到某个背景中。

### 2. 生成参考图

为每个背景生成 2～3 张候选图。**宽高比统一使用 16:9 宽屏**（`aspect_ratio: "16:9"`），展示场景全貌。

使用 `art_style.md` 中 `推荐生图模型：` 指定的模型生成候选图。提示词融合：场景环境描述（从 script.md 汇总）+ 美术风格关键词。**风格统一通过注入 `art_style.md` 的 `风格JSON：` 字段实现**（在提示词末尾追加 `Art style: {JSON 内容}`），**不直接通过 `image_paths` 传参考图**——避免预设图为 CDN 路径时无法被生图工具读取。如确需传图作为风格参考，必须使用 `art_style.md` 中本地路径（如 `style_cache/{style}/01_highway.png` 或 `style_references/user_ref.png`），并在提示词中说明该图仅用于风格参考（如 `use the reference image for art style only`）。

**提示词必须包含 `no people`**，确保背景图不包含人物，以便后续视频生成阶段单独叠加角色参考。

**Midjourney 四宫格裁切**：当推荐模型为 Midjourney 时，`midjourney_image_generation` 输出为 2x2 四宫格拼图，生成后**必须**用 ffmpeg 裁切为 4 张独立图片（1 次 MJ 调用 = 4 张候选图产出）。裁切方法：先用 `ffprobe` 获取宽高，再用 `crop` 滤镜分别截取左上、右上、左下、右下四个象限。

### 3. 用户选图

启动预览，展示背景卡片和候选图网格，用户为每个背景选定最终参考图。调用 MCP 工具 `preview_and_collect_feedback`：
- **script**: `.opencode/skills/mv-creator/scripts/render_preview.py`
- **args**: `[".mv/{song_name}/{theme}", "--type", "backgrounds", "--lang", "{lang}"]`
- **feedback_path**: `.mv/{song_name}/{theme}/feedback.md`

预览页面展示各背景信息卡片和候选图。
反馈处理逻辑同人设图阶段：
- 以 `LGTM` 开头 → 将各背景的选定候选图复制为 `selected.jpg`，更新 `design.md`，进入下一阶段
- 包含 `修改建议：` → 解析建议，调整 prompt 重新生成候选图，更新后重新校验和预览

## 输出格式

每个背景独立一个目录和设计文件。**严格按用户语言选择对应的 example 和字段名**（参见 SKILL.md「输出控制」和「Markdown 字段名中英对照表」）：
- 中文用户：参考 `references/background-design-example.md`，字段用中文（`场景描述`、`出场幕列表`、`生图设定`、`候选图`、`选定图`），内容用中文
- 非中文用户：参考 `references/background-design-example-en.md`，字段用英文（`Scene Description`、`Scene List`、`Image Settings`、`Candidates`、`Selected`），内容用对应语言

关键要点：
- 一级标题 `#` 用于背景名
- 场景描述/Scene Description 用列表逐项描述（环境类型、地形/空间、色调/氛围、关键元素、天气/时段）
- 生图设定/Image Settings 包含三个子字段：`提示词/Prompt`（英文，必须包含 `no people`）、`模型/Model`、`参考图/Reference`

## 格式校验

design.md 写入后，**必须**运行校验脚本：

```bash
# 校验单个背景
python3 .opencode/skills/mv-creator/scripts/validate_background_design.py .mv/{song_name}/{theme}/backgrounds/{bg_name}/design.md

# 校验所有背景
python3 .opencode/skills/mv-creator/scripts/validate_background_design.py .mv/{song_name}/{theme}/backgrounds/
```

校验规则：必需分区完整性、场景描述列表项、生图设定子字段、候选图非空且文件存在。

- **通过** → 启动预览供用户选图
- **未通过** → 由 LLM 根据校验错误信息自动修正，修复后重新校验

## 文件存储

**目录名规则**：`{bg_name}` 统一使用英文小写 + 下划线（如 `desert_highway`、`neon_bar`），不使用中文或显示名。该目录名是分镜阶段引用背景的唯一标识。

```
./.mv/{song_name}/{theme}/backgrounds/
├── {bg_name}/
│   ├── design.md            # 背景设计说明
│   ├── candidate_01.jpg     # 候选图
│   ├── candidate_02.jpg
│   └── selected.jpg         # 最终选定图（用户挑选）
```
