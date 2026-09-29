# Cinematic Aesthetic Prompt Suffix — 电影美学后缀

在所有生图 prompt 的末尾追加以下后缀，确保去 AI 感 + 统一风格基调。

---

## 通用后缀模板

```
[photography style] aesthetic, editorial photography, no text, no watermark, no logo
```

`[photography style]` 从 `references/photography-styles.md` 的参考风格列中选取，例如：
- `Juergen Teller casual editorial`
- `Tim Walker fantastical editorial`
- `Paolo Roversi diffused ethereal`
- `Martin Parr saturated documentary`

---

## 按 Emotional Tone 的推荐后缀

### Playful（玩味）

```
casual snapshot aesthetic, editorial photography, no text, no watermark, no logo
```

关键词：snapshot, casual, candid, everyday, raw

### Sublime（庄严）

```
diffused ethereal aesthetic, editorial photography, no text, no watermark, no logo
```

关键词：ethereal, serene, contemplative, luminous, refined

### Provocative（冒犯）

```
raw confrontational aesthetic, editorial photography, no text, no watermark, no logo
```

关键词：raw, gritty, confrontational, unapologetic, visceral

---

## 绝对禁止的词

以下词汇会触发 AI 模型的"完美均匀"倾向，是 AI 感的直接来源：

| 禁止 | 替代方案 |
|------|---------|
| 8K, 4K, ultra HD | 指定具体相机型号 |
| hyper-realistic, ultra-realistic | 指定具体胶片型号 |
| masterpiece, best quality | 指定具体摄影师风格 |
| highly detailed, intricate details | 指定具体镜头焦段 |
| octane render, unreal engine | 指定具体打光方式 |
| perfect lighting, perfect composition | 描述具体瑕疵（颗粒、暗角、漏光） |
| cinematic lighting | 指定光源类型（自然窗光、闪光灯直打、侧光） |
| professional photo | 指定相机+镜头组合 |

---

## 瑕疵注入

真实摄影的标志是**有选择的不完美**。在后缀中至少包含 1-2 个瑕疵关键词：

| 瑕疵类型 | Prompt 关键词 |
|---------|-------------|
| 胶片颗粒 | `film grain`, `grainy texture` |
| 暗角 | `natural vignetting`, `corner falloff` |
| 漏光 | `light leaks`, `lens flare` |
| 柔焦边缘 | `soft focus edges`, `bokeh falloff` |
| 轻微过曝 | `slight overexposure`, `highlight bloom` |
| 色彩偏移 | `color shifts`, `cross-processed tones` |
| 浅景深 | `shallow depth of field`, `selective focus` |
| 运动模糊 | `slight motion blur` |

**规则**：每张图选 1-2 个与该相机/胶片组合匹配的瑕疵，不要全部堆砌。
