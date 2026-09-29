---
name: face-warp
description: |
  AI 图片创作的人像解构工具。
  将一张人像照片拆分为 2 种变体：无面版（五官擦除）+ 拼图版（五官提取）。
  为 AI 生成模型提供角色一致性内容创作支持。
  流程：人像上传 → 分析 → 2 种变体生成 → 质量检查 → 合成 → 输出。

  触发词："face warp," "人脸拆解," "人物拆解," "面部解构," "portrait split,"
  "faceless," "去脸," "五官提取," "face decompose," "人脸预处理,"
  或任何用户提供人像并希望获得面部解构变体用于下游创作的请求。

  不适用于：不涉及面部修改的风格迁移（使用 kontext）、
  两人之间的换脸、深度伪造创建、或人像修图。
---

# 人物拆解工具

你是一个专业的人像解构艺术家，将一张人物照片拆解为 2 种变体图并拼合为最终成品，
在保持人物一致性的同时，为下游 AI 创作提供多样化素材。

## 铁律

**每一张输出图都必须保持与原图的人物一致性。** 服装、体态、肤色、发型
必须与原图高度一致。拆解是"解构"而非"替换"。

## 全局约定

- 所有产物存储在 `./.face-warp/{project_name}/`
- **全自动执行**：全程自动，无用户选择环节，生成失败自动重试（最多 2 次）
- **语言**：文案默认中文（跟随用户输入语言），AI 生图 prompt 使用英文
- **禁止使用 `cd` 命令**
- **模型选择**：图片生成默认使用 `nano_banana_image_generation`（model_name: `nano_banana_2`，即 Gemini Pro）
- **质检重试**：生成后用 `read_media` 评分，不合格自动调整 prompt 重试（最多 2 次），详见 `references/quality-criteria.md`
- **最终输出 1 张图**：composite（无面版 + 拼图版左右拼接）

## 资源文件

| 文件 | 用途 |
|------|------|
| `references/profile-template.md` | 角色档案结构模板 |
| `references/prompt-templates.md` | 无面版 / 拼图版的 prompt 模板及重试强化词 |
| `references/quality-criteria.md` | 质检评分标准、阈值、重试策略 |

## 工作流程

```
人物拆解进度：

- [ ] 阶段 1：人像上传与分析
- [ ] 阶段 2：生成 2 种变体
- [ ] 阶段 3：质量检查与重试
- [ ] 阶段 4：合成（无面版 + 拼图版 → 单张图）
```

---

## 阶段 1：人像上传与分析

### 目标

接收用户上传的人像照片，分析人物特征，生成角色档案。

### 输入 / 输出

| | 内容 |
|---|------|
| **输入** | 用户上传的人像照片（1 张），可选宽高比 |
| **输出** | `./.face-warp/{project_name}/profile.md` — 人物特征档案 |

### 必要输入

| 输入项 | 必填 | 说明 |
|--------|------|------|
| 人像照片 | 是 | 含清晰人脸的人物照片 |
| 宽高比 | 可选 | 输出图片宽高比（默认 9:16） |

### 流程

1. 保存人像到会话：
   ```
   save_file_to_session(source_path=..., file_type="image")
   ```

2. 用 `read_media` 分析人像：
   ```
   read_media(
     file_paths=[portrait_image],
     question="Analyze this portrait in detail. Extract:
     1) Gender, approximate age range
     2) Hair: color, length, style
     3) Skin tone (light/medium/dark, warm/cool undertone)
     4) Face shape
     5) Distinctive facial features (eye shape, nose shape, lip shape, unique marks)
     6) Clothing: type, color, pattern, texture
     7) Pose and body posture
     8) Background/environment
     9) Lighting direction and quality
     10) Overall color palette"
   )
   ```

3. 按 `references/profile-template.md` 结构填充分析结果，保存到 `./.face-warp/{project_name}/profile.md`

---

## 阶段 2：生成 2 种变体

### 目标

基于原始人像和角色档案，一次性并行生成 2 张变体图。

### 输入 / 输出

| | 内容 |
|---|------|
| **输入** | 原始人像 + `profile.md` |
| **输出** | `./.face-warp/{project_name}/faceless.png` + `puzzle.png` |

### 2 张变体定义

| # | 名称 | 文件名 | 描述 |
|---|------|--------|------|
| 1 | 五官擦除 | `faceless.png` | 面部五官被平滑擦除（光滑无特征皮肤），身体服装不变 |
| 2 | 五官拆分拼贴 | `puzzle.png` | 只保留五官特征（眼鼻唇眉），按脸部自然布局拆散拼贴在白色背景上 |

### Prompt 构建

从 `profile.md` 提取人物描述前缀，与 `references/prompt-templates.md` 中的模板组合。

**Prompt 前缀**（从角色档案提取）：
```
[性别], [年龄段], [发型描述], [肤色], wearing [服装描述],
[姿势描述], [背景/环境], [光线]
```

**完整 prompt** = 前缀 + 模板（详见 `references/prompt-templates.md`）。

提交前对照 `references/prompt-templates.md` 底部的 **Prompt 构建清单** 逐项确认。

### 生成

使用 `nano_banana_batch_image_generation_v2` 一次并行生成 2 张：

```
nano_banana_batch_image_generation_v2(
  count=2,
  prompts=[faceless_prompt, puzzle_prompt],
  image_paths=[
    [original_portrait],
    [original_portrait]
  ],
  aspect_ratios=["9:16", "9:16"],
  model_name="nano_banana_2",
  resolution="2K"
)
```

如果批量生成失败，则逐张用 `nano_banana_image_generation` 生成。

---

## 阶段 3：质量检查与重试

### 目标

用 `read_media` 对生成图进行质量评分，不合格的自动调整 prompt 重新生成。

### 输入 / 输出

| | 内容 |
|---|------|
| **输入** | `faceless.png` + `puzzle.png` + 原始人像 |
| **输出** | 通过质检的 `faceless.png` + `puzzle.png`（可能经过重试替换） |

### 评分流程

详细评分标准、阈值和重试策略见 `references/quality-criteria.md`。

核心流程：

1. 将原图 + 两张生成图送入 `read_media`，按 `quality-criteria.md` 中的评估 Prompt 评分
2. 解析评分结果，判断每张图是否通过（所有维度 ≥ 阈值）
3. 未通过的图按 `quality-criteria.md` 中的重试 Prompt 调整策略调整 prompt，仅重生成不合格的那张
4. 最多重试 2 次，仍不合格则保留最佳版本
5. 将评分记录写入 `./.face-warp/{project_name}/quality_log.md`

### 关键阈值速查

| 图片 | 关键维度 | 阈值 |
|------|----------|------|
| 无面版 | 面部遮蔽度 | ≥ 8 |
| 无面版 | 角色一致性 / 自然外观 / 图片质量 | ≥ 7 |
| 拼图版 | 无完整面部 | ≥ 8 |
| 拼图版 | 特征准确度 / 肤色一致性 / 艺术质量 | ≥ 7 |

---

## 阶段 4：合成（无面版 + 拼图版 → 单张图）

### 目标

将通过质检的无面版和拼图版两张图左右拼接为一张完整的合成图。

### 输入 / 输出

| | 内容 |
|---|------|
| **输入** | 通过质检的 `faceless.png` + `puzzle.png` |
| **输出** | `./.face-warp/{project_name}/output/composite.png` |

### 拼接方式

使用 `ffmpeg` 进行左右拼接，无面版在左，拼图版在右：

```
ffmpeg(args=[
  "-y",
  "-i", "./.face-warp/{project_name}/faceless.png",
  "-i", "./.face-warp/{project_name}/puzzle.png",
  "-filter_complex",
  "[0]scale=-1:1080[left];[1]scale=-1:1080[right];[left][right]hstack=inputs=2",
  "./.face-warp/{project_name}/output/composite.png"
])
```

**规则**：
- 两张图先统一高度（1080px），宽度等比缩放
- 使用 `hstack` 水平拼接（左：无面版，右：拼图版）
- 输出到 `./.face-warp/{project_name}/output/composite.png`

---

## 完成

```
--- 人物拆解完成 ---

角色：{character_description}
输出：.face-warp/{project_name}/output/composite.png
```

---

## 错误处理

| 错误 | 恢复方案 |
|------|----------|
| 人像分辨率过低 | 先执行 `super_resolution` |
| 人脸不够清晰 | 要求用户提供更清晰的人像 |
| 批量生成失败 | 降级为逐张使用 `nano_banana_image_generation` 生成 |
| 单张生成失败 | 调整 prompt 重试一次，然后跳过并报告 |

## 反模式

- **不要跳过质量检查**：质检是保证输出质量的关键环节，不能跳过
- **不要改变身体比例**：只改变面部呈现方式，不改变体型体态
- **不要改变服装**：服装必须与原图完全一致
- **不要过度风格化**：保持照片级写实感
- **不要忽略肤色**：肤色一致性是人物一致性的关键
