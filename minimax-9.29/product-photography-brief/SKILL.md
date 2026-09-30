---
name: product-photography-brief
description: |
  为电商与创意工作室生成可直接投产的产品摄影 brief。输入产品名、描述、品类或商品页 URL，输出一份 4-6 张的完整拍摄计划：模型路由（Nano Banana Pro、Soul 2.0、GPT Image 2）、按平台分配画幅、镜头/焦段参数、负向 prompt 银行——全部可直接复制粘贴。

  当用户想要产品摄影 brief、电商拍摄 brief、拍摄计划、电商 shot planner，或输入 /product-photography-brief 时使用。
trigger-words: [产品摄影, 电商拍摄, 拍摄brief, shot planner, 摄影计划, 商品图, product photography, ecommerce shoot, shoot brief, shot plan, product shots, photo brief]
allowed-tools: [question, hub_read, hub_write, hub_save_file_to_session, hub_generate_image]
---

# 产品摄影 Brief 工作流

从产品名 / 描述 / URL 规划 4-6 张成套的电商拍摄计划，为每张镜头路由到最合适的图像模型，注入镜头 + 打光语言，可选一键跑完所有生成。

## 工作流

### Step 1：拉现有产品上下文

用户给了 workspace 相对文件路径（产品页抓取、品牌指南、已有 brief）时，先 `hub_read` 进来预填 Step 2：

- `.agents/brand-guidelines.md`
- 用户提到的任何 `product-*.md` 或成分文档
- 要迭代的先前 brief

### Step 2：一次性收集 brief 输入（一个 `question` 打包问完）

发一次 `question` 覆盖：

1. **产品名 & 品类**（如 "Organic Avocado Face Serum"、"极简真皮钱包"）
2. **产品细节** —— 成分 / 质感 / 颜色 / 包装类型 / 标签
3. **品牌美学** —— 极简干净 / 乡村自然 / 高端奢华 / 鲜艳流行 / 暗调情绪
4. **打光原型** —— Soft Studio / Hard Chiaroscuro / Golden Hour Natural
5. **目标平台** —— Amazon / Shopify / Instagram / Pinterest / TikTok / Website（多选）
6. **镜头数量** —— 4 / 5 / 6
7. **模式** —— `brief-only`（只出 Markdown brief）或 `brief-and-shoot`（brief 之后自动跑 `hub_generate_image`）
8. **是否需要清晰包装文字？** —— yes/no（决定包装镜头是否走 `imagegen_2_0`）

字段没答齐之前不推进。

### Step 3：提取上下文、锚定视觉风格

从 Step 1 + Step 2：

- **主角原料 / 材质** —— 代表产品的原始输入（燕麦、皮革纹理、薰衣草）
- **品牌色板** —— 暖中性 / 明亮原色 / 冷蓝-绿
- **打光原型** —— 一次锁定并应用到所有镜头（Soft Studio / Chiaroscuro / Golden Hour）

### Step 4：套用模型路由矩阵（逐镜头）

| 镜头类型 | 需要清晰文字？ | 模型 | Vendor | 理由 |
|---|---|---|---|---|
| Hero / 棚拍主图 | 否 | `nano_banana_pro` / `nano_banana_2` | `nano-banana` | 棚拍光照 + 材质锐利 |
| 微距 / 材质特写 | 否 | `nano_banana_pro` | `nano-banana` | 微观细节渲染 |
| 包装 / 文字细节 | 是 | `imagegen_2_0` | `openai-image` | 文字可读 + 空间控制 |
| 生活方式 / 使用场景 | 否 | `text2image_soul_v2` / `soul_v2` | `soul` | 真实人脸 + 手持上下文 |
| 创意 / 编辑广告 | 否 | `cinematic_studio_2_5` | `cinematic-studio` | 艺术构图 + 戏剧感 |

### Step 5：从 8 类核心镜头挑 4-6 张

按 Step 2 的镜头数量从下述选：

1. **Hero Shot** —— 干净背景 + 商业级打光
2. **微距 / 细节** —— 极近距离，突出材质 / 原料 / 工艺
3. **生活方式 / 场景** —— 产品在真实使用环境
4. **Flat Lay 平铺** —— 俯拍，加原料、工具、道具
5. **开箱 / 包装** —— 外包装、盒面材质、品牌视觉
6. **手 / 人体上下文** —— 一只手拿着 / 倾倒 / 涂抹
7. **系列镜头** —— 多变体 / 规格集合
8. **创意 / 编辑广告 Banner** —— 戏剧光照、概念性艺术方向

### Step 6：映射平台画幅

- Shopify / Amazon 主图 → `1:1`（纯白无缝）
- Instagram 信息流 → `4:5`
- Pinterest / 博客头图 → `2:3`
- Reels / TikTok / Shorts → `9:16`
- 网站 Banner → `16:9` / `21:9`

### Step 7：撰写 brief

每个镜头出一个 Prompt Block：

```markdown
### Shot [N]: [镜头类型名]
- **目标模型**: `[模型名]`
- **Vendor**: `[vendor id]`
- **画幅**: `[如 4:5]`
- **概念**: [1 句场景描述]
- **生成 Prompt**:
  > [投产级 prompt：主体、包装材质、光照、镜头、角度、环境详细描述。]
- **负向 Prompt**:
  > [通用电商排除银行 + 镜头专属排除项]
- **镜头优先级**: `[High / Medium / Low]`
- **拍摄建议**: [关于构图、道具、材质执行的具体建议。]
```

#### 负向 prompt 银行（原文注入）

- **通用电商**：`low resolution, draft, blurry, out of focus, distorted proportions, low quality, noise, grain, ugly, text artifact, double branding, cluttered background, cheap plastic look, artificial shadows.`
- **解剖**（手 / 生活方式）：`extra fingers, deformed hands, mutated fingers, fused digits, double hands, backward hand, claw hand, poor anatomy, unnatural pose.`
- **Amazon 主图**：`shadow, text, logo, watermark, accessory, prop, colored background, off-white, shadow on product, reflection, graphic element.`

#### 镜头 & 焦段说明词（原文注入）

- **微距**：`Captured on 100mm macro lens, f/2.8, shallow depth of field, sharp focus on raw cream texture.`
- **棚拍 / Hero**：`Shot on 85mm prime lens, clean studio lighting, f/8 aperture, razor-sharp edge definition, commercial photography style.`
- **生活方式**：`Shot on 35mm lens, natural daylight, organic shadows, f/4 aperture, high-end editorial lifestyle photography.`

### Step 8：落盘前二次确认

呈现：
- 总镜头数 + 模型分布（如 "3 × nano_banana_pro, 1 × imagegen_2_0, 1 × soul_v2, 1 × cinematic_studio_2_5"）
- 各平台画幅分布
- 文件名 slug
- 是否 `brief-and-shoot` 模式（即 brief 落盘后马上跑生成）

等用户 yes。

### Step 9：保存 brief

1. 调 `hub_write`：
   - `file_path`：workspace 相对 slug（如 `photo-briefs/2026-07-03/serum-brief.md`）
   - `content`：完整 Markdown brief（战略分析 + 含 Prompt Block 的镜头清单）
2. 调 `hub_save_file_to_session`：
   - `file`：同一路径
   - `file_type`：`text`

### Step 10：（可选）跑生成

只在 Step 2 选了 `brief-and-shoot` 才做。对 brief 里**每个**镜头：

1. 调 `hub_generate_image`：
   - `vendor`：从 Step 4 矩阵（`nano-banana` / `openai-image` / `soul` / `cinematic-studio`）
   - `model`：从 Step 4 矩阵（`nano_banana_pro` / `imagegen_2_0` / `soul_v2` / `cinematic_studio_2_5`）
   - `prompt`：该镜头 block 的 Generation Prompt（按 Step 7 拼上负向 prompt 银行）
   - `aspect_ratio`：Step 6
   - `resolution`：hero / 微距 / 编辑广告用 `2k`，生活方式 / 包装 `1k` 可接受
   - `medias`：只有用户提供了产品参考素材时才传，asset ID `role: media_input`
2. 调 `hub_save_file_to_session`：
   - `file`：生成的图片路径
   - `file_type`：`image`

镜头串行发，用户看到一张再决定下一张。某张失败或看着不对，先提议改 prompt 重跑再继续。

## 输出校验清单

交付前确认：

1. 战略分析 —— 简短的品牌契合度 + 美学论证
2. 连贯的镜头清单 —— 4-6 张编号镜头，匹配品牌美学
3. 精确的模型选择 —— 按模型路由矩阵分配
4. 可直接复制的 Prompt —— 含焦段、打光、背景、负向 prompt
5. 多平台画幅 —— 清晰的分发映射

## 常见坑

- **包装文字乱码** → 路由错模型。改到 `imagegen_2_0`，不要用 `nano_banana_pro`。
- **生活方式镜头手部畸形** → 忘了解剖负向银行。原文注入。
- **Amazon 主图被拒** → 漏了 Amazon 专属负向（无阴影、无彩色背景、无反射）。
- **镜头之间不连贯** → 每张镜头自己挑了打光原型。Step 3 锁定**一个**打光原型并复用到所有镜头。

## Hub 适配说明

- Brief 本身是 Markdown 交付物 —— 用 `hub_write` 落盘，再用 `hub_save_file_to_session`（`file_type: text`）注册到会话，方便用户交给生产团队。
- 如果用户希望 skill 直接出图（`brief-and-shoot` 模式），把每个镜头的 prompt 通过 `hub_generate_image` 路由到分配好的 vendor/model（`nano_banana_pro`、`imagegen_2_0`、`soul_v2`、`cinematic_studio_2_5`），产物用 `hub_save_file_to_session`（`file_type: image`）注册。
- 用 `question` 一次性锁定必填输入（产品名、品类、品牌美学、目标平台、模式），不要来回自由问答。
- 用户在会话里给出产品链接或品牌素材路径时，先用 `hub_read` 拉进来。
- 负向 prompt 银行和镜头/焦段说明词是字符串常量——每次调 `hub_generate_image` 时按镜头类型原文注入。
