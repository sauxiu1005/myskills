# 人设图生成

## 目标

基于确定的美术风格，为核心人物生成角色设计图。

## 重点

- 每个角色独立一个目录和设计文件
- **统一使用 `all_in_one_image_generation`（model_name: `all_in_one_pro`）/ `nano_banana_image_generation`（model_name: `nano_banana_2`）生成候选图**
- 保留每张图和对应的用户指令（prompt / 描述）
- 最终由用户在预览页面中挑选人设图
- **宽高比统一使用 2:3 竖版**（`aspect_ratio: "2:3"`）
- **禁止生成 N 宫图**（多视角拼合图）：提示词中必须包含 `single character, single view, no split screen, no multiple panels, no collage, no reference sheet`

## 流程

1. 根据故事概念中的核心人物描述 + 美术风格，生成角色设计 prompt（提示词末尾追加反 N 宫图指令）
2. **风格 JSON 注入**：从 `art_style.md` 的 `风格JSON：` 字段读取结构化风格数据，将 JSON 内容融入生图提示词中（如在提示词末尾附加 `Art style: {JSON 内容}`）
3. 使用 `all_in_one_image_generation`（model_name: `all_in_one_pro`）或 `nano_banana_image_generation`（model_name: `nano_banana_2`）生成多版本候选图，**aspect_ratio 统一设为 2:3**
4. 将角色信息和候选图写入各角色的 `design.md`

## 输出格式

每个角色独立一个目录和设计文件。**严格按用户语言选择对应的 example 和字段名**（参见 SKILL.md「输出控制」和「Markdown 字段名中英对照表」）：
- 中文用户：参考 `references/character-design-example.md`，字段用中文（`外貌特征`、`性格气质`、`标志物件`、`生图设定`、`候选图`、`选定图`），内容用中文
- 非中文用户：参考 `references/character-design-example-en.md`，字段用英文（`Appearance`、`Personality`、`Signature Items`、`Image Settings`、`Candidates`、`Selected`），内容用对应语言

关键要点：
- 外貌特征/Appearance 用列表逐项描述（年龄/性别、体型、发型、面部、服装、配饰）
- 生图设定/Image Settings 包含三个子字段：`提示词/Prompt`（英文）、`模型/Model`、`参考图/Reference`
- 候选图/Candidates 记录文件名、模型和构图说明
- `选定图/Selected` 生成后留空，待用户在预览页面中挑选

## 格式校验

design.md 写入后，**必须**运行校验脚本：

```bash
# 校验单个角色
python3 .opencode/skills/mv-creator/scripts/validate_character_design.py .mv/{song_name}/{theme}/characters/{character_name}/design.md

# 校验 theme 下所有角色
python3 .opencode/skills/mv-creator/scripts/validate_character_design.py .mv/{song_name}/{theme}/
```

校验规则：必需分区完整性、外貌特征列表项、生图设定子字段、候选图非空且文件存在。

- **通过** → 调用 MCP 工具 `preview_and_collect_feedback` 启动预览：
  - **script**: `.opencode/skills/mv-creator/scripts/render_preview.py`
  - **args**: `[".mv/{song_name}/{theme}", "--type", "character_design", "--lang", "{lang}"]`
  - **feedback_path**: `.mv/{song_name}/{theme}/feedback.md`

  预览页面展示各角色信息卡片和候选图网格。
  每个角色默认选中第一张候选图作为兜底，用户点击图片直接切换选定。
  角色卡片的每张候选图有 `@` 按钮，点击可将 `@角色目录/候选图文件名` 插入底部反馈框，用于引用特定候选图。
  工具返回反馈内容后：
  - 以 `LGTM` 开头 → 将各角色的选定候选图复制为 `selected.jpg`，更新 `design.md`，进入下一阶段
  - 包含 `修改建议：` → 先处理选图，再解析建议中的 `@` 引用（候选图 `@角色/候选图` 或上传参考图 `@上传路径`）和修改意见，调整 prompt 重新生成候选图。更新 `design.md`，重新校验和预览
- **未通过** → 由 LLM 根据校验错误信息自动修正，修复后重新校验

## 文件存储

**目录名规则**：`{character_name}` 统一使用英文小写 + 下划线（如 `traveller`、`bar_owner`），不使用中文或显示名。该目录名是后续阶段（分镜、视频生成）引用角色的唯一标识。

```
./.mv/{song_name}/{theme}/characters/{character_name}/
├── design.md            # 角色设计说明
├── candidate_01.jpg     # 候选图
├── candidate_02.jpg
└── selected.jpg         # 最终选定图（用户挑选）
```
