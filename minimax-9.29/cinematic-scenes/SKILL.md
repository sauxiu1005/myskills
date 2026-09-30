---
name: cinematic-scenes
description: |
  基于一张上传的参考镜头，用 Nano Banana Pro 在"专业电影摄影师 + 首席灯光师"系统角色下生成一批高级电影感的替代覆盖镜头——额外机位和插入镜头。输入是一张参考图（新上传或以往生成结果）加上数量 / 画面比 / 风格幅度设置；输出是 2N 张并行生成的图像（N 个机位 + N 个插入镜头），带 35mm/70mm 胶片美学、动机光设计、Kodak Vision3 风格色彩。
  当用户想要生成替代机位、追加插入镜头、给已有场景补摄影师覆盖、把单帧扩成完整镜头单，或者对参考图施加极端风格化处理（荷兰角、明暗对比、微距探头镜头）时触发。
trigger-words: [电影场景, 电影感机位, 替代机位, 插入镜头, 分镜覆盖, 摄影师覆盖, 荷兰角, 明暗对比, cinematic scenes, cinematic coverage, alternative angles, insert shots, cinematographer coverage, shot coverage, cinematic variants]
allowed-tools: [hub_generate_image, hub_read_media, hub_save_file_to_session, question]
---

# 电影场景生成

在专业摄影师 + 首席灯光师的系统角色下，从一张参考镜头出发，生成高级电影感的机位与插入镜头变体。

## 必需输入

1. **参考图** —— 上传的图像，或之前生成任务的结果。
2. **配置** —— 数量、画面比、风格幅度（Step 1 全部经 `question` 确认）。

## 工作流

### Step 1 —— 用 `question` 做生成前确认（必做）

烧 credit 之前跑三次 `question` 锁死结构化偏好：

Call 1：
- question："想生成多少个替代机位和插入镜头？"
- options: ["各 3 张（共 6）", "各 5 张（共 10）", "各 8 张（共 16）", "自定义"]

Call 2：
- question："这批镜头用什么画面比？"
- options: [
    "16:9 —— Cinematic Landscape",
    "2.39:1 —— Ultra-Cinematic Wide",
    "9:16 —— Vertical Story",
    "1:1 —— Square"
  ]

Call 3：
- question："标准电影覆盖还是极端风格化变体？"
- options: [
    "Standard Coverage（宽景大师镜 / 中景 / 越肩 / 高角度 / 侧面剪影 —— 写实连续）",
    "Extreme Coverage —— Bold & Surreal（荷兰角、明暗对比、negative fill、霓虹、微距探头、表现主义构图）"
  ]

**不要**静默选默认 —— 三题全部等用户回。

### Step 2 —— 用 `hub_read_media` 载入参考图

调用 `hub_read_media`：
- file_path：当前 session 里参考图的路径

确认图像可访问、拿到 asset ID。如果用户在同一 session 刚生成过这张图，直接复用现有 asset —— **不**要重新上传。按 sha256 与以往上传去重，能复用就复用。

### Step 3 —— 构建带强制系统角色块的 prompt

每一条 prompt 都必须**原样**嵌入下面的系统指令块（不要总结，也不要试图提到 hub 层级 system message）：

```
You are a world-class Cinematographer and Master Gaffer. Your goal is to generate images that are indistinguishable from 35mm or 70mm motion picture film. Avoid AI gloss, plastic skin, waxy faces, overprocessed HDR, oversharpened edges, uniform global sharpness, impossible depth of field, perfect symmetry, sterile CGI surfaces, game-engine lighting, inconsistent shadows, floating objects, temporal flicker, morphing geometry, warped hands, smeared hair, unreadable distorted text, fake bokeh, excessive lens flare, neon clipping to white, and hard digital highlight clipping.
Optics: Always default to Arri Alexa 65 or Panavision Millennium DXL2 sensors. Use specific focal lengths (e.g., 35mm for environmental shots, 85mm for portraits). Captured on ARRI Alexa 35 in ARRIRAW LogC4, ARRI REVEAL color science, K445-style subtle organic texture, gentle highlight rolloff, natural skin tones, expert colorist grade. Natural micro-texture, imperfect skin and surfaces, no beauty smoothing, no waxy faces, no global oversharpening, subtle sensor noise and filmic grain embedded in luminance. 24 fps, 180-degree shutter, natural motion blur, physically plausible movement, stable geometry, consistent wardrobe and background details.
Lighting: Implement "Rembrandt lighting," "Negative Fill," or "Motivated Lighting." Ensure high dynamic range with soft highlight roll-off and deep, textured shadows. Motivated cinematography lighting, clear key direction, practical sources, realistic shadow falloff, bounce light, negative fill, atmospheric depth. Layered foreground, midground, and background, atmospheric haze, real parallax, focus plane with natural falloff, no impossible infinite sharpness.
Color Science: Apply a custom Kodak Vision3 5219 film emulation. Prioritize perfect skin tones (natural texture, no "plastic" look) and a professional color grade with rich micro-contrast. Soft ARRI-style highlight rolloff, preserved highlight color, no hard clipping, practical light bloom, subtle halation only around intense sources.
Integration: Every character must be perfectly composited into the environment with matching light direction, bounce light, and atmospheric depth (haze/halation).
```

块后面接每镜的具体方向。按 Step 1 的风格化规则套：

- **Standard 覆盖** —— 逻辑连贯 + 专业覆盖（宽景大师镜、中景、越肩、高角度、侧面剪影）。
- **Extreme 覆盖** —— 大胆激进超现实（极低荷兰角、强烈明暗对比、高对比 negative fill、鲜明霓虹、抽象镜头畸变、微距探头镜头、戏剧化表现主义构图）。

N 个机位 + N 个插入镜头 = 2N 条不同的 prompt，每条末尾接一句具体镜头描述。

### Step 4 —— 烧 credit 前确认

给用户过一遍：
- 数量（2N）与拆分（N 机位 / N 插入）
- Step 1 的画面比 + 风格幅度
- Step 2 的参考图 asset ID
- Vendor `nano-banana`，model `nano_banana_pro`（此工作流锁死）
- 一条代表性示例 prompt（系统块 + 单条镜头方向），让用户过一眼

等用户显式确认。**不要**轮询执行完成状态，除非同一回合下游立即依赖。

### Step 5 —— 通过 `hub_generate_image` 并行批量提交

**所有** 2N 请求一次 `hub_generate_image` 并行提交：

```
hub_generate_image with:
  vendor: nano-banana
  model: nano_banana_pro
  prompt: <系统角色块 + 每镜方向，2N 个变体>
  aspect_ratio: <Step 1>
  resolution: 2k
  medias:
    - role: image
      data: { id: "<参考图 asset ID>", type: "media_input" }
```

遵守 workspace 全局并发上限。2N 超限时切成并发循环（例如两轮各 N），**不要**退回逐张串行。

### Step 6 —— 把产出注册回 session

2N 张返回图逐张调用 `hub_save_file_to_session`：
- file: <返回的图片路径>
- file_type: image

按分类（先机位、后插入）汇报给用户，每张附一句日常语言的构图/机位说明。

## Hub 适配说明

- 所有覆盖生成走 `hub_generate_image`，用 Nano Banana Pro 后端 —— 把 2N 个 prompt 作为一次并行批次提交，遵守 workspace 并发上限。
- 参考图已在 session 中，用 `hub_read_media` 访问（或直接传 asset ID）。用户在同一 session 刚生成的图不要重复上传。
- 每一张机位 / 插入镜头都用 `hub_save_file_to_session` (`file_type: image`) 注册，让整套覆盖以一批的形式落到 workspace 文件面板。
- 用 `question` 跑 STEP 1 的生成前确认（数量、画面比、风格幅度），不要在用户确认前静默选默认值。
- 基础系统角色块必须原样嵌入每一条 prompt，不要总结，也不要尝试提到 hub 层级 system message。
