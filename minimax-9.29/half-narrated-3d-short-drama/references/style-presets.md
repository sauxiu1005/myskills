# Style Presets — 3D-Rendered Manhua / Chinese-Animation Webtoon (v2.0)

This file defines the 3D-rendered manhua family and the three mutually exclusive Q4 sub-modes. The approved Project Lock selects one: guoman-3d-render (default), pixar-disney (rounded family-animation plus manhua composition), or semi-painterly-3d. Examples from other modes never overwrite the selected one. QC, local repair, budget, and delivery follow the Delivery and Local Repair Contract (v1.0.1) in `references/qc-checklist.md`.

Pure 2D, photoreal/live-action replacement, or cartoons without the manhua composition are outside this family. Rounded anatomy in the approved rounded mode and brush-textured surfaces in the approved painterly mode are legitimate. Do not classify them as drift because another mode forbids them.

For every finding compare actual form/depth/material/composition and approved anchors; record evidence and uncertainty. A changed prompt is not a repaired shot. Preserve qualified neighbors and old versions; only evidenced affected shots/assets enter an approved local repair. No automatic mode switch or generation until exact existing allowance or new scoped approval covers it.

## Locked Family (do not break)

- **Always 3D-rendered** — every frame is a 3D render, NOT 2D illustration. PBR / NPR materials, real lighting, real depth.
- **Always non-photoreal** — even when materials are PBR, the finish is stylized (cel outlines, non-photoreal lighting, no skin pores, no lens flares).
- **Always 3D characters** — characters are 3D models, not drawn. Faces have 3D geometry, hair has 3D strands (or stylized hair cards), cloth drapes with 3D simulation.
- **Always 3D scenes** — environments are 3D models with real depth, perspective, and occlusion. No 2D-painted backgrounds.
- **Always manhua panel composition** — frames should feel like a manhua / webtoon panel, even in motion (dynamic angles, strong vertical lines, dramatic close-ups).
- **Never bake unwanted text, watermark, or background music** into the rendered shot.
- **Always preserve the story [HARD GATE, v2.0]** — no style choice is allowed to silently cut or rewrite a plot point; if a style can't carry a shot, surface the conflict.

## Sub-Mode 1: 国漫 3D 渲染流 (default)

**Closest references**: 《灵笼》《眷思量》《伍六七之玄武国篇》类国漫 3D 短剧
**Default for**: 古风玄幻 / 异世界冒险 / 都市悬疑 / 末世 / 惊悚

### Visual DNA
- **3D rendered characters** with clean dark outlines layered on top of the 3D shading (the "cel-look" — render first, then outline pass)
- **Soft PBR materials with non-photoreal finish** — skin has slight subsurface scattering, fabric drapes naturally but with stylization
- **Strong cinematic light/shadow contrast** — hard key light, dramatic shadows
- **Manhua panel composition** — vertical-scroll-friendly framing, dynamic angles, often 9:16
- Backgrounds have **3D depth with painterly simplicity** — real perspective and occlusion, but stylized colors and simplified geometry
- Emotion conveyed through **3D micro-expressions + manhua-style effects** (sweat drops, impact frames, sparkle) layered on top
- Color logic: dramatic; one warm / cool dominance per scene

### Prompt Block (paste into every image/video prompt)

```
3D rendered, Chinese-animation manhua-cel look, clean dark outlines on top of 3D shading, soft PBR materials with non-photoreal finish, dynamic manhua panel composition, dramatic cinematic light, webtoon-friendly vertical framing, expressive manhua emotion cues (sweat drops, impact frames, sparkle), no live-action, no Pixar-style CG, no 2D flat illustration, no watermark, no baked-in text
```

### Per-Shot Sub-Block Examples

- **Mid-shot dialogue**:
  > `[shot content]`, 3D rendered, Chinese-animation manhua-cel look, clean dark outlines on top of 3D shading, soft PBR materials with non-photoreal finish, dynamic manhua panel composition, dramatic cinematic light, webtoon-friendly vertical framing, no live-action, no Pixar-style CG, no 2D flat illustration, no watermark, no baked-in text
- **Establishing shot (palace / city / forest)**:
  > `Wide establishing shot of [location]`, 3D rendered, Chinese-animation manhua-cel look, clean dark outlines on architecture, soft PBR materials with non-photoreal finish, dramatic cinematic light, manhua panel composition with strong vertical lines, no live-action, no Pixar-style CG, no 2D flat illustration, no watermark, no baked-in text
- **Emotional close-up (crying / angry / shocked)**:
  > `Close-up of [character] with [emotion]`, 3D rendered, Chinese-animation manhua-cel look, clean dark outlines on top of 3D shading, soft PBR materials with subtle subsurface scattering, expressive manhua emotion cues (sweat drops / impact frames / sparkling tears), dramatic cinematic light, no live-action, no Pixar-style CG, no 2D flat illustration, no watermark, no baked-in text
- **Tracking shot (side angle)**:
  > `[tracking content]`, 3D rendered side view, Chinese-animation manhua-cel look, clean dark outlines on top of 3D shading, soft PBR materials with non-photoreal finish, dynamic manhua panel composition, side-angle camera framing, dramatic cinematic light, no live-action, no Pixar-style CG, no 2D flat illustration, no watermark, no baked-in text

---

## Sub-Mode 2: 皮克斯 Disney 流

**Closest references**: Pixar / Disney 3D 短片质感 + 漫剧分镜
**Default for**: 校园 / 治愈 / 奇幻冒险 / 轻松向

### Visual DNA
- **3D rendered Pixar/Disney-style** — rounded soft shapes, large expressive eyes
- **Stylized non-photoreal materials** — not PBR-real, but clean stylized surfaces
- **Soft cinematic lighting** — less hard shadow, more atmospheric and warm
- Larger head-to-body ratio than 国漫 3D 流
- Camera work: more **classical Pixar shot grammar** overlaid with **manhua panel composition** (dynamic angles for action)
- Emotion: more **3D micro-expressions**; manhua-style impact frames sparingly

### Prompt Block

```
3D rendered Pixar/Disney-style, rounded soft shapes, large expressive eyes, soft cinematic lighting, stylized non-photoreal materials, manhua panel composition with dynamic angles, no live-action, no 2D flat illustration, no watermark, no baked-in text
```

### Per-Shot Sub-Block Examples

- **Mid-shot dialogue**:
  > `[shot content]`, 3D rendered Pixar/Disney-style, rounded soft shapes, large expressive eyes, soft cinematic lighting, stylized non-photoreal materials, manhua panel composition, no live-action, no 2D flat illustration, no watermark, no baked-in text
- **Action shot**:
  > `[action content]`, 3D rendered Pixar/Disney-style, dynamic angle, stylized non-photoreal materials, soft cinematic lighting, manhua panel composition, no live-action, no 2D flat illustration, no watermark, no baked-in text

---

## Sub-Mode 3: 半厚涂 3D 写实流

**Closest references**: 《最终幻想 7 Advent Children》《阿凡达：水之道》类日式 / 西方 3D 写实但带手绘厚涂感的作品 + 漫剧分镜
**Default for**: 权谋 / 商战 / 偏写实的成人向 / 重工业题材

### Visual DNA
- **3D rendered with painterly thick-coating** — PBR materials with brushstroke texture
- **Semi-realistic proportions** — closer to real human anatomy
- **Dramatic cinematic light** — strong key, deep shadow, atmospheric
- Materials show **subtle brushwork overlay**
- Camera work: classical cinematic + manhua panel composition
- Emotion: more **subtle facial micro-expressions**; less cartoon exaggeration

### Prompt Block

```
3D rendered with painterly thick-coating, semi-realistic proportions, PBR materials with brushstroke texture, dramatic cinematic light, manhua panel composition, webtoon-friendly framing, no live-action, no 2D flat illustration, no Pixar/Disney cartoon, no watermark, no baked-in text
```

### Per-Shot Sub-Block Examples

- **Mid-shot dialogue**:
  > `[shot content]`, 3D rendered with painterly thick-coating, semi-realistic proportions, PBR materials with brushstroke texture, dramatic cinematic light, manhua panel composition, no live-action, no 2D flat illustration, no Pixar/Disney cartoon, no watermark, no baked-in text
- **Establishing shot (industrial / palace)**:
  > `[location]`, 3D rendered with painterly thick-coating, semi-realistic proportions, PBR materials with brushstroke texture, dramatic cinematic light, manhua panel composition with strong vertical lines, no live-action, no 2D flat illustration, no Pixar/Disney cartoon, no watermark, no baked-in text

---

## Style Drift Watch List (stop and surface, do not silently fix)

If actual evidence confirms a violation of the selected mode, mark that shot/asset failed and block only dependent unapproved work. The list below diagnoses candidates, not an automatic retry queue. Unclear observations remain unverified; compatible variations are not defects.

- ❌ **2D / flat illustration drift** — clean 2D line art, flat color fills with no 3D shading, painterly watercolor look
- ❌ **Unintended cartoon-mode replacement** — rounded/chibi traits replacing a guoman/painterly lock, or loss of required manhua composition. Approved rounded-mode shape/material traits are allowed.
- ❌ **Photoreal / live-action drift** — skin pores, lens flares, real-world photographic texture, photoreal hair strands
- ❌ **Flat painting replacement** — painted texture destroys 3D form/depth. Approved painterly surface texture retaining 3D geometry is allowed.
- ❌ **Ink-wash / 水墨 drift** — sumi-e brush effects, no clean 3D form
- ❌ **Missing required outline** — only when visible outlines are part of the approved mode/anchor. Do not impose guoman outline thickness on rounded or painterly modes that never required it.
- ❌ **Half-style drift** — some elements 3D, some 2D in the same frame
- ❌ **Watermark / text baked in** — accidental logos, platform watermarks, generation tool text
- ❌ **Cross-sub-mode drift** — 国漫 3D 渲染流 in one shot, 皮克斯 Disney 流 in the next
- ❌ **3D manhua specific**: rendered 3D but lost the manhua panel composition (became generic Pixar / Disney without dynamic angles) — usually happens when sub-mode is mis-declared
- ❌ **Story loss via style [NEW for v2.0]**: a style choice causes a plot point to be cut or rewritten — instead, surface the conflict to the user

Diagnose the actual source before selecting a repair: wrong sub-mode block, conflicting anchor, view mismatch, or a generated deviation. Correct only the implicated variable under scoped authorization. Do not mechanically strengthen negatives that forbid the user's selected rounded/painterly mode, switch modes, or rerun identical prompts. At budget/attempt limits or no improvement, stop with evidence and usable assets.

---

## Continuity Block (paste after the style block, before shot content)

To keep identity stable across shots, append a continuity block that names the locked character/scene:

```
[continuity anchors: protagonist wearing [exact wardrobe], hair in [exact style], face shape [exact description]; scene layout [exact layout description]; 3D material: skin soft PBR non-photoreal, fabric [type] with [drape behavior]; lighting direction [left/right/top/etc]; color palette [warm/cool/neutral]]
```

This block stays the same across every shot of a character/scene; only the **action / camera** change.

---

## Quick Style Comparison (for the user in STEP 0)

| | 国漫 3D 渲染流（默认） | 皮克斯 Disney 流 | 半厚涂 3D 写实流 |
|---|---|---|---|
| 描边 | 干净深色叠在 3D 渲染上 | 干净深色，较细 | 干净深色，较粗 |
| 材质 | 软 PBR 非写实完成面 | 风格化非 PBR | PBR + 笔触覆盖 |
| 光影 | 强对比电影光 | 较柔电影光 | 强对比 + 体积感 |
| 人物比例 | 国漫 3D 标准 | Q 版 / 大眼 | 半写实 |
| 情绪表达 | 3D 微表情 + 漫剧汗珠/冲击框 | 大眼表情 / 少量漫剧效果 | 细腻写实微表情 |
| 镜头 | 漫剧分镜 + 3D 运镜 | 经典 Pixar + 漫剧分镜 | 经典电影 + 漫剧分镜 |
| 最适合 | 古风玄幻/权谋/末世/惊悚 | 校园/奇幻/治愈 | 权谋/商战/重工业 |

## Style Block Anti-Patterns (NEVER paste these into 3D manhua prompts)

- ❌ `2D cel-shaded animation` — 2D drift
- ❌ `hand-drawn, flat color fills, no 3D` — explicitly wrong
- ❌ Rounded/cartoon style terms in a non-rounded mode; these terms are not forbidden when the rounded-manhua sub-mode is explicitly locked.
- ❌ `photorealistic, photographic, lens flare, skin pores` — photoreal drift
- ❌ `watercolor, ink-wash, sumi-e` — style drift out of 3D manhua
- ❌ `anime 2D, manga style, webtoon 2D` — these all mean 2D, not 3D
- ❌ `cinematic 3D, realistic 3D render` — too generic, no manhua panel composition
- ❌ **[NEW for v2.0] Style choices that cause a plot point to be cut or rewritten** — surface to the user instead
