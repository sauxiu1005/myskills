# Photography Style Mapping — 摄影风格映射

根据 **情绪基调 × 产品品类** 选择摄影风格。每个组合指定：相机系统、镜头、色彩基调、摄影师/杂志参考、以及真实瑕疵特征。

**禁止使用**：8K、4K、ultra HD、hyper-realistic、masterpiece 等 AI 标志性词汇。这些词触发 AI 模型的"完美均匀"倾向，正是 AI 感的来源。

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

Phase 2 确定 Emotional Tone 后，根据产品品类在上表中找到对应行，将 **相机 + 镜头 + 色彩基调 + 瑕疵特征** 写入 concept.md 的 Visual Style 字段，并嵌入 key frame prompt。

**Prompt 模板**：
```
[scene description], shot on [相机], [镜头], [色彩基调] color palette,
[瑕疵特征], [参考风格] aesthetic, editorial photography,
no text, no watermark, no logo
```

**绝对禁止写入 prompt 的词**：
- 8K, 4K, ultra HD, UHD
- hyper-realistic, ultra-realistic
- masterpiece, best quality
- highly detailed, intricate details
- octane render, unreal engine
- perfect lighting, perfect composition

这些词是 AI 生成图片的"指纹"，会立即暴露 AI 感。用具体的相机/胶片/摄影师替代它们。
