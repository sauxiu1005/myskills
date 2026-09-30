# 美术风格格式示例

以下是 `art_style.md` 的标准格式。

```markdown
美术风格：电影质感写实

风格描述：
  温暖的胶片色调，自然光为主，35mm 胶片颗粒感。
  参考电影《Into the Wild》《Nomadland》的视觉语言。
  宽银幕比例，anamorphic 镜头的椭圆光斑和柔和边缘。

关键词：cinematic, film grain, natural lighting, warm amber tones, 35mm film, anamorphic
色调：暖黄、琥珀色、深棕、golden hour 金色
光影：自然光、golden hour、逆光剪影、丁达尔效应

推荐生图模型：Midjourney V7（电影质感最佳）/ Kling（人物写实）

参考图：
  - style_cache/cinematic/01_highway.png
  - style_cache/cinematic/02_bar.png
  - style_cache/cinematic/03_canyon.png
  - style_cache/cinematic/04_starry.png

风格JSON：
  {
    "visual_style_analysis": {
      "color_palette": ["#D4A574", "#8B6914", "#2C1810", "#E8C98E", "#4A3728"],
      "color_mood": "warm amber and golden tones with deep brown shadows",
      "lighting_and_shadows": "natural golden hour lighting, strong rim light, Tyndall effect, soft diffused shadows",
      "texture": "35mm film grain, slight lens aberration, organic noise",
      "composition_style": "wide anamorphic framing, rule of thirds, deep depth of field for landscapes",
      "line_style": "soft organic edges, no hard outlines, photographic realism",
      "art_style_keywords": ["cinematic", "film grain", "golden hour", "anamorphic", "warm amber", "natural lighting", "35mm film", "photorealistic"]
    }
  }
```

## 格式要点

- 首行格式：`美术风格：` + 风格名称
- `风格描述：` 用 2～4 句话描述视觉语言，可引用参考电影/作品
- `关键词：` 英文逗号分隔，用于后续生图 prompt
- `色调：` 列出主要色彩倾向
- `光影：` 列出光线和阴影特征
- `推荐生图模型：` 根据风格特点推荐最适合的模型，附简短理由
- `参考图：` 列出选定的参考图路径（相对项目目录），每行一个，以 `- ` 开头。内置预设由脚本自动缓存到 `style_cache/{style}/{filename}.png`，自定义风格可指向 `style_references/` 下的本地文件
- `风格JSON：` `read_media` 分析参考图返回的结构化风格数据（JSON 格式），用于人设图和物件图生成时注入提示词
- 内容缩进 2 空格，保持视觉对齐
