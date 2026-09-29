# 分镜规划

## 目标

根据脚本为每个场景规划分镜，**引用已生成的人设图、背景图和关键物件图**作为视频生成的参考素材，不再单独生成分镜图。

## 重点

- 分镜不再独立生成图片，而是为每幕映射已有的参考图（角色 `selected.jpg`、背景 `selected.jpg`、物件 `selected.jpg`）
- 每幕需要编写视频生成提示词，描述画面动态和镜头运动
- 分镜文档是视频生成阶段的直接输入

## 流程

### 1. 解析脚本与关联素材

读取 `script.md` 提取每幕信息（场景名称、时间码、场景描述、歌词、视觉风格、关键物件）。
结合 `story_concept.md` 中的核心人物描述和各幕场景描述，为每幕标注：

- **出场角色**：场景中出现的角色名 → 对应 `characters/{character_name}/selected.jpg`
- **场景背景**：该幕的场景环境 → 对应 `backgrounds/{bg_name}/selected.jpg`
- **关键物件**：该幕出现的关键物件 → 对应 `props/{item_name}/selected.jpg`

判断规则：
- 场景描述中明确提及角色名或角色特征 → 标注该角色
- 场景描述为纯空镜/风景/物件特写 → 出场角色标注为 `（无）`
- 不确定时倾向于标注角色（宁多勿漏，用户可在预览时修正）

### 2. 生成分镜文档

将每幕信息写入 `storyboard.md`，为每幕生成：
- **出场角色**：该幕出现的角色**目录名**（即 `characters/` 下的子目录名，不是 design.md 中的 H1 显示名）
- **场景背景**：该幕对应的背景**目录名**（即 `backgrounds/` 下的子目录名）
- **关键物件**：该幕出现的关键物件**目录名**（即 `props/` 下的子目录名）
- **场景描述**：中文画面描述（从 script.md 同步）
- **视频提示词**：英文 prompt，描述画面动态、镜头运动、角色动作，引用参考图（如 `image 1 as background, image 2 as character`）
- **参考图列表**：背景 `selected.jpg` + 角色 `selected.jpg`（如有）+ 物件 `selected.jpg`（如有）

### 3. 生成分镜图

为每幕生成分镜合成图，让用户在视频生成前预览实际画面构图。

**生成方式**：使用 `all_in_one_batch_image_generation`（model_name: `all_in_one_pro`）或 `nano_banana_batch_image_generation_v2`（model_name: `nano_banana_2`）批量生成，每幕 1 张。

**参考图传入**：通过 `image_paths` 传入背景 `selected.jpg` + 角色 `selected.jpg`（如有）+ 关键物件 `selected.jpg`（如有），并在提示词中用 `image 1 as background, image 2 as character` 等引用。

**提示词**：基于分镜文档的 `视频提示词：` 字段，但去除镜头运动描述（pan、dolly、tracking 等），仅保留画面构图、角色动作、光线氛围和风格描述。这是**静态画面**提示词，不同于视频提示词。

**宽高比**：统一 `16:9`。

**存储**：保存到 `storyboard/` 目录，命名 `scene_01.jpg`、`scene_02.jpg` 等（序号与幕序一致）。

**写入分镜文档**：在 `storyboard.md` 每幕末尾追加 `候选图：` 和 `选定图：` 字段，记录生成的候选图路径。首次生成后默认选定第一张。

### 4. 用户审阅

调用 MCP 工具 `preview_and_collect_feedback` 启动预览：
- **script**: `.opencode/skills/mv-creator/scripts/render_preview.py`
- **args**: `[".mv/{song_name}/{theme}", "--type", "storyboard", "--lang", "{lang}"]`
- **feedback_path**: `.mv/{song_name}/{theme}/feedback.md`

预览页面按时间线展示各幕分镜卡片，显示每幕的参考图缩略图和视频提示词。
工具返回反馈内容后：
- `LGTM` → 进入视频生成阶段
- 其他 → 按建议修改分镜映射或视频提示词，更新 `storyboard.md`，重新校验和预览

## 输出格式

**严格按用户语言选择对应的 example 和字段名**（参见 SKILL.md「输出控制」和「Markdown 字段名中英对照表」）：
- 中文用户：参考 `references/storyboard-example.md`
- 非中文用户：参考 `references/storyboard-example-en.md`

关键要点：

- 二级标题 `##` 用于每幕场景标题，与 `script.md` 的幕名保持一致
- 时间码行格式：`* M:SS - M:SS (Xs)`，与 `script.md` 一致
- 歌词引用以 `> ` 开头（从 script.md 同步）
- 每幕必须包含以下字段（中文/English）：
  - `出场角色/Characters` — 角色名（逗号分隔），无角色写 `（无）`/`(None)`
  - `场景背景/Scene Background` — 对应的背景名
  - `关键物件/Key Props` — 物件名（逗号分隔），无物件可省略
  - `场景描述/Scene Description` — 画面描述（用户语言），缩进 2 空格
  - `视频提示词/Video Prompt` — 英文 prompt，描述动态和镜头，引用参考图编号，缩进 2 空格
  - `参考图/Reference` — 列表形式，每行注明用途，路径相对 theme 目录
  - `候选图/Candidates` — 列表形式，每行记录候选图文件名和简要说明
  - `选定图/Selected` — 用户选定的最终分镜图文件名
- 场景之间用 `---` 分隔

## 格式校验

storyboard.md 写入后，**必须**运行校验脚本：

```bash
python3 .opencode/skills/mv-creator/scripts/validate_storyboard.py .mv/{song_name}/{theme}/storyboard.md
```

校验规则：场景标题格式、时间码格式、必填字段完整性、出场角色目录及 `selected.jpg` 存在性、场景背景目录及 `selected.jpg` 存在性、关键物件目录及 `selected.jpg` 存在性、与 `script.md` 交叉校验（幕数和时间码一致）。

- **通过** → 启动预览供用户审阅
- **未通过** → 由 LLM 根据校验错误信息自动修正，修复后重新校验

## 文件存储

```
./.mv/{song_name}/{theme}/storyboard.md                    # 分镜规划文档
./.mv/{song_name}/{theme}/storyboard/                      # 分镜图目录
    ├── scene_01.jpg                                        # 各幕分镜图
    ├── scene_02.jpg
    └── ...
```
