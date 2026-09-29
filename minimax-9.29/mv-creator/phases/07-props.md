# 关键物件图生成

## 目标

基于脚本中标注的关键物件，为需要跨镜头保持视觉一致的非人物元素生成统一参考图。

## 物件类别

- **道具**：武器、信物、乐器、书信等手持/随身物品
- **载具**：马、车、船、摩托等交通工具
- **场景地标**：反复出现的特定建筑、标志性场所、门牌等
- **动物/宠物**：有辨识度的伴随动物

## 流程

### 1. 自动提取

读取 `script.md` 中所有 `**关键物件：**` 字段，汇总并去重。列出在 **2 幕及以上** 重复出现的物件，附带每个物件的出场幕列表和外观描述摘要。

### 2. 用户确认

通过 `AskUserQuestion` 让用户确认/增删物件列表（选项：确认当前列表 / 我要增减物件）。

如果最终列表为空（脚本中无跨镜头物件），通过 `AskUserQuestion` 确认后跳过此阶段。

### 3. 生成参考图

为每个物件生成 2～3 张候选图。宽高比根据物件类型选择：

| 物件类型 | 宽高比 | 说明 |
|----------|--------|------|
| 道具/小物件 | **1:1** | 正方形，突出物件细节 |
| 载具/动物 | **3:2** 横版 | 展示整体形态和比例 |
| 场景地标 | **16:9** 宽屏 | 展示建筑/场所全貌 |

使用 `all_in_one_image_generation`（model_name: `all_in_one_pro`）或 `nano_banana_image_generation`（model_name: `nano_banana_2`）生成候选图。提示词融合：物件外观描述（从 script.md 汇总）+ 美术风格关键词 + `art_style.md` 的 `风格JSON：` 内容（如在提示词末尾附加 `Art style: {JSON 内容}`）。

### 4. 用户选图

启动预览，展示物件卡片和候选图网格，用户为每个物件选定最终参考图。调用 MCP 工具 `preview_and_collect_feedback`：
- **script**: `.opencode/skills/mv-creator/scripts/render_preview.py`
- **args**: `[".mv/{song_name}/{theme}", "--type", "props", "--lang", "{lang}"]`
- **feedback_path**: `.mv/{song_name}/{theme}/feedback.md`

预览页面展示各物件信息卡片和候选图。
每个物件默认选中第一张候选图作为兜底，用户点击图片切换选定。
反馈处理逻辑同人设图阶段：
- 以 `LGTM` 开头 → 将各物件的选定候选图复制为 `selected.jpg`，更新 `design.md`，进入下一阶段
- 包含 `修改建议：` → 解析建议，调整 prompt 重新生成候选图，更新后重新校验和预览

## 输出格式

每个物件独立一个目录和设计文件。**严格按用户语言选择对应的 example 和字段名**（参见 SKILL.md「输出控制」和「Markdown 字段名中英对照表」）：
- 中文用户：参考 `references/props-design-example.md`，字段用中文（`外观描述`、`叙事作用`、`生图设定`、`候选图`、`选定图`），内容用中文
- 非中文用户：参考 `references/props-design-example-en.md`，字段用英文（`Appearance`、`Narrative Role`、`Image Settings`、`Candidates`、`Selected`），内容用对应语言

关键要点：
- 一级标题 `#` 用于物件名
- 外观描述/Appearance 用列表逐项描述（类型、形态、颜色/材质、尺寸/比例、细节特征）
- 生图设定/Image Settings 包含三个子字段：`提示词/Prompt`（英文）、`模型/Model`、`参考图/Reference`

## 格式校验

design.md 写入后，**必须**运行校验脚本：

```bash
# 校验单个物件
python3 .opencode/skills/mv-creator/scripts/validate_props_design.py .mv/{song_name}/{theme}/props/{item_name}/design.md

# 校验所有物件
python3 .opencode/skills/mv-creator/scripts/validate_props_design.py .mv/{song_name}/{theme}/props/
```

校验规则：必需分区完整性、外观描述列表项、生图设定子字段、候选图非空且文件存在。

- **通过** → 启动预览供用户选图
- **未通过** → 由 LLM 根据校验错误信息自动修正，修复后重新校验

## 文件存储

**目录名规则**：`{item_name}` 统一使用英文小写 + 下划线（如 `guitar`、`pickup_truck`），不使用中文或显示名。该目录名是分镜阶段引用物件的唯一标识。

```
./.mv/{song_name}/{theme}/props/
├── {item_name}/
│   ├── design.md            # 物件设计说明
│   ├── candidate_01.jpg     # 候选图
│   ├── candidate_02.jpg
│   └── selected.jpg         # 最终选定图（用户挑选）
```
