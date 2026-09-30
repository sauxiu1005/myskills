# Photography Style Mapping — 摄影风格映射

## Visual Medium — 视觉介质

**先选介质，再选风格。** Visual Medium 决定画面的整体质感和瑕疵体系。低保真介质让超现实内容更可信——观众的潜意识会认为"这是拍到的，不是做出来的"。

| 介质 | Prompt 关键词 | 特有瑕疵 | 适合调性 | 去 AI 感强度 |
|------|-------------|---------|---------|------------|
| **VHS** | `VHS recording, analog video, magnetic tape` | scan lines, tracking errors, color bleeding, RGB ghosting, date stamp, CRT glow, horizontal jitter | Provocative, Playful | ★★★★★ |
| **16mm Film** | `16mm film, Bolex H16, Kodak Vision3` | heavy grain, gate weave, warm color shift, sprocket marks, vignetting, flicker | Sublime, Provocative | ★★★★ |
| **Super 8** | `Super 8mm film, home movie footage` | extreme grain, overexposed highlights, color fade, film splice marks, rounded corners | Playful, nostalgic | ★★★★★ |
| **Phone Camera** | `phone camera photo, casual snapshot, low quality` | slight motion blur, digital noise, flash reflection on glass, VSCO color grade, unintentional framing | Playful, Provocative | ★★★★ |
| **Polaroid** | `Polaroid SX-70, instant film photo` | color fade, white border, chemical bloom, uneven development, warm cast | Playful, intimate | ★★★★ |
| **35mm Film** | `[specific camera + lens from Emotional Tone table below]` | film grain, natural vignetting, bokeh, light leaks | All tones | ★★★ |

**选择逻辑**：
- 潮牌/街头/年轻品牌 → VHS 或 Phone Camera（原生感、社媒语言）
- 奢侈品/手表/美妆 → 16mm Film（画廊级质感但不完美）
- 食品/生活方式 → Super 8 或 Polaroid（温暖怀旧）
- 科技/实验品牌 → VHS 或 16mm Film（复古未来感）
- 如果产品调性无法匹配以上 → 35mm Film（最通用，用下方 Emotional Tone 表细化）

**Prompt 模板**：
```
[scene description], [Visual Medium 关键词], [介质特有瑕疵 2-3 个],
[色彩基调], [参考风格] aesthetic, editorial photography,
no text, no watermark, no logo
```

---

根据 **Emotional Tone × 产品品类** 进一步细化。选 35mm Film 介质时必须使用下表；选其他介质时可选用下表的色彩基调和参考风格作为叠加层。

---

## Playful（玩味）

适合：年轻品牌、食品、运动、快消、生活家居

| 品类 | 相机 + 镜头 | 色彩基调 | 参考风格 | 瑕疵特征 |
|------|------------|---------|---------|---------|
| 运动/潮牌 | Contax T3, Zeiss Sonnar 35mm f/2.8 | Cross-processed Velvia, 偏绿偏黄 | Juergen Teller casual editorial | 闪光灯直打, 轻微过曝, 业余快照感 |
| 食品/饮品 | Pentax 67, SMC 105mm f/2.4 | Kodak Ektar 100, 高饱和暖调 | Martin Parr saturated documentary | 强烈日光, 硬阴影, 色彩过饱和 |
| 家居/生活 | Olympus Mju II, 35mm f/2.8 | Fujifilm Superia 400, 日常暖调 | Wolfgang Tillmans intimate snapshots | 自然光窗光, 轻微运动模糊, 随意构图感 |
| 科技/电子 | Ricoh GR III, 28mm f/2.8 | Ilford HP5 pushed to 1600, 高对比黑白 | Daido Moriyama grainy street | 粗颗粒, 高对比, 暗角, 偶尔失焦 |

---

## Sublime（庄严）

适合：奢侈品、美妆、手表、建筑、高端家居

| 品类 | 相机 + 镜头 | 色彩基调 | 参考风格 | 瑕疵特征 |
|------|------------|---------|---------|---------|
| 奢侈品/手表 | Hasselblad 500C/M, Zeiss Planar 80mm f/2.8 | Kodak Portra 160, 低饱和柔和 | Paolo Roversi diffused ethereal | 极浅景深, 柔焦边缘, 自然暗角 |
| 香水/美妆 | Mamiya RZ67, 110mm f/2.8 | Fujifilm Pro 400H, 冷调柔和 | Tim Walker fantastical editorial | 轻微过曝高光, 柔和阴影过渡, 胶片颗粒 |
| 建筑/空间 | Linhof Technika, Schneider 150mm f/5.6 | Kodak Portra 400, 自然还原 | Andreas Gursky large format precision | 极致锐度中心 + 边缘自然衰减, 透视校正 |
| 高端家居 | Phase One IQ4, Schneider 80mm f/2.8 | Kodak Ektar 100, 精确色彩 | François Halard interior editorial | 自然窗光, 长曝光轻微运动, 建筑透视 |

---

## Provocative（冒犯）

适合：潮牌、科技、有态度的品牌、实验性产品

| 品类 | 相机 + 镜头 | 色彩基调 | 参考风格 | 瑕疵特征 |
|------|------------|---------|---------|---------|
| 潮牌/街头 | Yashica T4, Zeiss Tessar 35mm f/3.5 | Cinestill 800T, 钨丝灯偏色 | Terry Richardson flash-heavy raw | 直闪红眼, 皮肤高光过曝, 粗犷 |
| 科技/数码 | Canon AE-1, FD 50mm f/1.4 | Lomography Color 400, 漏光偏色 | Petra Collins dreamy haze | 漏光, 色彩偏移, 柔焦, 颗粒感 |
| 家居/生活方式 | Leica M6, Summicron 35mm f/2 | Kodak Tri-X 400, 经典黑白 | Helmut Newton dramatic contrast | 强侧光, 深黑阴影, 戏剧性反差 |
| 食品/实验 | Holga 120, plastic lens | Fujifilm Velvia 50 cross-processed | David LaChapelle hyper-surreal | 严重暗角, 焦点不可预测, 色彩扭曲 |

---

## 使用方式

Phase 2 确定 Emotional Tone 后：
1. **先选 Visual Medium**（VHS / 16mm / Super 8 / Phone / Polaroid / 35mm）—— 根据品牌调性和目标受众
2. **再选风格细节**（色彩基调、参考风格）—— 从上方 Emotional Tone 表
3. 将 **Visual Medium + 介质瑕疵 + 色彩基调 + 参考风格** 写入 concept.md 的 Visual Style 字段

**35mm 介质 Prompt 模板**：
```
[scene description], shot on [相机], [镜头], [色彩基调] color palette,
[瑕疵特征], [参考风格] aesthetic, editorial photography,
no text, no watermark, no logo
```

**其他介质 Prompt 模板**：
```
[scene description], [Visual Medium 关键词], [介质瑕疵 2-3 个],
[色彩基调] color palette, [参考风格] aesthetic,
editorial photography, no text, no watermark, no logo
```

**绝对禁止写入 prompt 的词**：
- 8K, 4K, ultra HD, UHD
- hyper-realistic, ultra-realistic
- masterpiece, best quality
- highly detailed, intricate details
- octane render, unreal engine
- perfect lighting, perfect composition

这些词是 AI 生成图片的"指纹"，会立即暴露 AI 感。用具体的介质/相机/胶片/摄影师替代它们。
