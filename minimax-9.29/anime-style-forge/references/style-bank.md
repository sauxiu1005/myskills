# 风格档案库 (Style Bank)

每个风格包含：视觉特征、Prompt 模板、负向提示词、推荐参数、适用场景、代表作品、常见踩坑。

Prompt 模板中 `{content}` 为角色/场景描述占位符。

---

## 🇯🇵 日系

### jp_cel — 赛璐璃 / TV 动画

**视觉特征**：干净描边 + 均匀平涂 + 二分阴影 + 大眼 + 夸张发色 + 高光硬边块
**代表**：京阿尼日常番、新番截图感

**Prompt 模板**：
```
anime cel shading, {content}, clean black outlines, flat color fill, hard shadow, anime screencap, detailed anime eyes, vibrant hair color, studio anime quality, 2D animation, anime key visual
```

**负向**：
```
3d render, realistic, photograph, oil painting, watercolor, blurry, thick paint, semi-realistic
```

**参数**：CFG 7-8 / DPM++ 2M Karras / 28-35 步
**适用**：头像、番剧截图感、角色展示
**踩坑**：加 `anime screencap` 避免"AI糖水片"感；不要加 `highly detailed`，会破坏平涂感

**⚠️ 与 jp_ln（轻小说）的差异化技巧**（Benchmark S3.1 实测）：
两者使用同一引擎时容易趋同。拉开差距的关键：
- 赛璃璃加强：`hard shadow, vibrant saturated colors, bold outlines, high contrast` + 低风格化参数（= 更硬朗）
- 赛璃璃负向追加：`soft, pastel, gentle, gradient, watercolor`（排斥轻小说特征）
- 色彩饱和度是核心差异——赛璃璃追求"鲜艳刺激"，轻小说追求"柔淡安静"

---

### jp_ghibli — 吉卜力 / 宫崎骏

**视觉特征**：水彩底色 + 暖色调 + 自然背景 + 圆润线条 + 温柔表情 + 留白
**代表**：《千与千寻》《龙猫》《哈尔的移动城堡》

**Prompt 模板**：
```
studio ghibli style, {content}, soft watercolor texture, warm natural lighting, lush green scenery, gentle rounded features, hand-drawn animation feel, Hayao Miyazaki aesthetic, pastel and earth tones, whimsical atmosphere, detailed nature background
```

**负向**：
```
dark, horror, cyberpunk, neon, sharp edges, 3d render, photorealistic, violent, cel shading, hard shadow
```

**参数**：CFG 6-7 / Euler a / 30-40 步
**适用**：治愈系、自然场景、温馨人物
**踩坑**：色调是灵魂——偏暖偏绿偏土；加 `hand-drawn feel` 防止数码感过重；背景要描述具体自然元素

---

### jp_90s — 90 年代复古

**视觉特征**：高对比阴影 + 锐利线条 + 修长比例 + 暗色调 + 胶片颗粒感
**代表**：《EVA》《美少女战士》《灌篮高手》《星际牛仔》

**Prompt 模板**：
```
1990s retro anime, {content}, bold outlines, dramatic high contrast shadows, VHS film grain, nostalgic muted color palette, elongated proportions, sharp facial features, 90s cel animation aesthetic, analog texture, old school anime
```

**负向**：
```
modern anime, smooth gradient, 3d, bright neon, pastel, chibi, cute, clean digital art
```

**参数**：CFG 7-9 / DPM++ 2M Karras / 30 步
**适用**：怀旧风、硬核角色、复古头像
**踩坑**：`film grain` 和 `VHS` 是关键差异化标签；人物比例要偏修长而非可爱

---

### jp_gacha — 手游立绘 / 厚涂

**视觉特征**：精细厚涂 + 华丽服装 + 动态姿势 + 粒子光效 + 极致细节
**代表**：《原神》《崩铁》《FGO》《明日方舟》角色卡

**Prompt 模板**：
```
anime game splash art, {content}, highly detailed painted illustration, dynamic action pose, intricate fantasy outfit with fine details, flowing hair and fabric, particle effects and light accents, gacha game character art, cinematic dramatic lighting, jewel-like eyes, ornate accessories
```

**负向**：
```
flat color, simple, minimalist, chibi, sketch, rough, low detail, plain background, cel shading
```

**参数**：CFG 8-10 / DPM++ 2M SDE Karras / 35-45 步
**适用**：角色立绘、卡面、角色展示海报
**踩坑**：服装描述要极其具体（材质+颜色+配饰+纹理），这是品质分水岭

---

### jp_ln — 轻小说插图

**视觉特征**：清新淡雅 + 简约线条 + 日常场景 + 自然光 + 适度留白
**代表**：轻小说封面/插图、日常番原画

**Prompt 模板**：
```
light novel illustration, {content}, soft pastel shading, clean delicate linework, gentle natural lighting, slice of life atmosphere, Japanese novel cover art, light and airy composition, subtle expression
```

**负向**：
```
dark, dramatic, horror, heavy shading, 3d, thick outlines, action, dynamic, intense
```

**参数**：CFG 6-8 / Euler a / 25-30 步
**适用**：轻小说封面、日常系插图、清新角色
**踩坑**：和赛璃璐的区别是"更柔更淡更安静"；不要堆太多修饰词

**⚠️ 与 jp_cel（赛璃璃）的差异化技巧**（Benchmark S3.1 实测）：
两者使用同一引擎时容易趋同。拉开差距的关键：
- 轻小说加强：`muted desaturated palette, negative space, quiet contemplative, light and airy` + 高风格化参数（= 更柔美）
- 轻小说负向追加：`bold outlines, hard shadow, vivid saturated, dynamic, cel shading`（排斥赛璃璃特征）
- 构图留白是核心差异——轻小说追求"空气感"和"透气感"，画面不要填满

---

### jp_shinkai — 新海诚风

**视觉特征**：极致光影（逆光/黄昏）+ 照片级背景 + 高饱和天空 + 光线粒子 + 水滴细节
**代表**：《你的名字》《天气之子》《铃芽之旅》

**Prompt 模板**：
```
Makoto Shinkai style, {content}, photorealistic detailed background, dramatic golden hour lighting, vivid blue sky with clouds, lens flare and light particles, anime character in realistic setting, rain drops and water reflections, cinematic color grading, breathtaking scenery
```

**负向**：
```
dark, indoor, simple background, flat color, chibi, cartoon, low detail background
```

**参数**：CFG 7-9 / DPM++ 2M SDE Karras / 35-45 步
**适用**：壁纸、场景图、情感氛围图
**踩坑**：背景要单独详细描述——新海诚风的灵魂在背景不在人物

---

## 🇨🇳 国漫

### cn_xuan3d — 玄幻 3D 建模

**视觉特征**：3D 渲染 + 飘逸长发 + 华丽古装 + 炫酷特效 + 大气场景
**代表**：《完美世界》《斗破苍穹》《吞噬星空》

**Prompt 模板**：
```
Chinese fantasy 3D CGI animation, {content}, Unreal Engine 5 render quality, cinematic volumetric lighting, flowing silk robes with embroidery, ethereal spirit energy effects, dramatic cloud sea background, ancient Chinese cultivation world, subsurface scattering skin, traditional Chinese ornamental details, jade crown and hair accessories
```

**负向**：
```
2d flat, cartoon, anime cel shading, watercolor, Western medieval, low poly, sketch, European fantasy armor
```

**参数**：CFG 8-10 / DPM++ 2M SDE Karras / 35-45 步
**适用**：玄幻角色、网文封面、国漫概念
**踩坑**：必须加 `Chinese` 和中式元素关键词（汉服/道袍/玉冠/流苏），否则出成欧美 CG；特效描述要具体（雷电/剑气/灵力）

---

### cn_ink — 古风水墨

**视觉特征**：大面积留白 + 墨色晕染 + 淡雅配色 + 写意笔触 + 诗意构图
**代表**：《大鱼海棠》《中国奇谭》、古风插画

**Prompt 模板**：
```
Chinese ink wash painting, {content}, sumi-e brushwork, xuan rice paper texture, elegant negative space, misty mountains and water, ink gradient from dark to light, traditional Chinese aesthetic, ethereal minimalist composition, calligraphic brush strokes, subtle ink splatter
```

**负向**：
```
colorful, neon, vibrant saturated, anime, 3d render, photorealistic, oil painting, Western art, busy composition, no negative space
```

**参数**：CFG 6-8 / Euler a / 30-40 步
**适用**：古风插图、诗词配图、国风海报
**踩坑**：留白是灵魂——prompt 不要塞太多元素；`rice paper texture` 增加纸质感；色彩只用墨/白/青/赭

---

### cn_wuxia — 武侠 / 仙侠

**视觉特征**：半写实 + 暗沉古典色调 + 飘逸但有分量 + 江湖氛围
**代表**：《天官赐福》《魔道祖师》动画版

**Prompt 模板**：
```
Chinese wuxia martial arts illustration, {content}, semi-realistic donghua style, flowing silk robes with weight, ancient Chinese architecture, misty bamboo forest, moody cinematic lighting, sword and spiritual energy, traditional ink influence with modern rendering, dark elegant color palette
```

**负向**：
```
cute, chibi, bright colorful, modern clothing, Western fantasy, sci-fi, 3d cartoon, flat simple
```

**参数**：CFG 7-9 / DPM++ 2M Karras / 30-40 步
**适用**：武侠角色、古装场景
**踩坑**：和 cn_xuan3d 的区别是更"沉"更"实"——少特效多氛围，色调偏暗

---

## 🇰🇷 韩系

### kr_watercolor — 淡彩水彩言情

**视觉特征**：低饱和柔和色调 + 极致面部精细 + 水彩晕染 + 花瓣光斑 + 朦胧美
**代表**：韩漫言情封面、少女漫画

**Prompt 模板**：
```
Korean manhwa watercolor style, {content}, soft pastel watercolor wash, delicate facial features with long eyelashes, dreamy bokeh background, flower petals floating, romantic ethereal atmosphere, transparent color layers, gentle light diffusion, subtle blush, pearl-like skin
```

**负向**：
```
bold outlines, sharp edges, dark colors, horror, cel shading, thick lines, saturated, harsh lighting
```

**参数**：CFG 5-7 / Euler a / 30-35 步
**适用**：言情封面、浪漫插图、唯美头像
**踩坑**：CFG 不能高否则失去柔和感；色彩要克制——低饱和是灵魂

---

### kr_webtoon — Webtoon / 条漫

**视觉特征**：干净数码勾线 + 明快平涂 + 简洁背景 + 生动表情
**代表**：《独自升级》《外貌至上主义》

**Prompt 模板**：
```
Korean webtoon art style, {content}, clean digital black lineart, flat bright coloring, simple or gradient background, expressive character face, modern setting, vertical scroll comic style, clear readable composition, casual contemporary outfit
```

**负向**：
```
painterly, watercolor, oil painting, 3d, photorealistic, complex busy background, dark atmosphere, thick paint
```

**参数**：CFG 7-8 / DPM++ 2M Karras / 25-30 步
**适用**：条漫角色、社媒配图、Webtoon 风头像
**踩坑**：简洁是核心——背景不要复杂，角色要突出，线条要干净

---

### kr_paint — 韩系厚涂 / 唯美

**视觉特征**：极精致面部 + 多层眼睛反光 + 通透皮肤 + 丰富色彩层次 + 半写实美化
**代表**：Kidmo、Warmtail 等画师风格

**Prompt 模板**：
```
Korean digital painting portrait, {content}, extremely detailed face and eyes, multiple light reflections in iris, luminous translucent skin, rich color depth and subtle gradients, semi-realistic beautiful features, detailed individual hair strands, artstation masterpiece quality, soft glamorous lighting
```

**负向**：
```
flat color, anime cel shading, cartoon, simple, sketch, rough, low detail, plain
```

**参数**：CFG 8-10 / DPM++ 2M SDE Karras / 35-45 步
**适用**：角色肖像、唯美头像、概念设计
**踩坑**：面部和眼睛的描述要极其详细——这是韩系厚涂的灵魂所在

---

## 🎨 其他

### us_comic — 欧美漫画

**视觉特征**：粗黑描边 + 强明暗对比 + 肌肉感 + 动态构图 + 浓烈色彩
**代表**：Marvel/DC 漫画

**Prompt 模板**：
```
American comic book art, {content}, bold black ink outlines, dramatic chiaroscuro shading, vivid saturated colors, dynamic foreshortened action pose, heroic muscular proportions, halftone dot texture, comic panel composition, superhero art style, strong contrast
```

**负向**：
```
anime, pastel, soft, watercolor, cute, chibi, flat minimalist, realistic photograph, gentle
```

**参数**：CFG 8-10 / DPM++ 2M SDE Karras / 30-35 步
**适用**：英雄角色、漫画封面、力量感海报

---

### chibi — Q 版 / 可爱

**视觉特征**：2-3 头身 + 大圆头小身 + 简化四肢 + 夸张表情 + 圆润线条
**代表**：Q 版周边、表情包、SD 手办

**Prompt 模板**：
```
chibi character, {content}, 2-head-tall super deformed proportions, big round head tiny body, adorable exaggerated expression, rounded simple linework, simplified hands and feet, kawaii cute style, pastel soft background, SD character
```

**负向**：
```
realistic proportions, detailed anatomy, serious, dark, horror, muscular, mature, tall, normal proportions
```

**参数**：CFG 6-8 / Euler a / 25-30 步
**适用**：表情包、贴纸、Q 版立绘、周边设计
**踩坑**：必须强调 `2-head-tall` 或 `super deformed` 否则比例不够 Q

---

### il_pixel — 像素风

**视觉特征**：可见像素方块 + 有限色板 + 复古游戏感 + 无抗锯齿
**代表**：《星露谷》《传说之下》像素角色

**Prompt 模板**：
```
pixel art character, {content}, 16-bit retro game sprite, limited color palette, crisp visible pixels, no anti-aliasing, classic JRPG character style, nostalgic pixel aesthetic
```

**负向**：
```
smooth, realistic, high resolution detail, photograph, 3d render, blurry, anti-aliased, modern
```

**参数**：CFG 8-10 / 20-25 步 / 建议小尺寸生成后最近邻放大
**适用**：游戏素材、像素头像、复古风

---

## 通用负向提示词（所有风格追加）

```
worst quality, low quality, lowres, bad anatomy, bad hands, error, missing fingers, extra digit, fewer digits, cropped, watermark, signature, text, username
```

## 画质增强词（所有风格追加）

```
masterpiece, best quality, high resolution
```

⚠️ 注意：`highly detailed` 仅在厚涂/立绘类风格使用；赛璃璐/扁平/像素风禁用。

---

## 多角色场景 Prompt 策略（Benchmark S4.3 实测）

多角色场景（双胞胎、团队、对手等）需要额外的差异化描述，否则模型会让所有角色趋同。

**核心问题**：模型倾向于让多个角色共享同一面孔/发色/服装，特别是当描述中使用了"双胞胎"等暗示相似的词汇时。

**解决策略**：
1. **显式差异标注**：不写"双胞胎一黑一白"，而是写"left character: long BLACK hair / right character: long WHITE hair"——用位置+大写强调差异
2. **分区描述**：将画面分为左右/前后区域，每个区域独立描述一个角色的完整特征
3. **对比强化词**：加入 `contrasting, opposite, mirror symmetry, distinct` 等词汇强调差异
4. **负向排斥趋同**：`--no same hair color, identical, matching outfits`（排斥模型的趋同倾向）

**示例（双胞胎黑白发）**：
```
twin sisters standing back to back, LEFT twin has long BLACK hair wearing a BLACK school uniform, RIGHT twin has long WHITE hair wearing a WHITE school uniform, contrasting mirror symmetry, identical faces but completely different hair colors and outfit colors
--no same hair color, same outfit color
```
