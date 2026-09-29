# 4 张关键帧 Prompt 模板

图1先生成并作为全套视觉锚。图2、图3、图4必须参考图1，保持同一画面风格、UI图标、背景纸张、装饰元素、箭头样式和手掌线稿造型，只改变角色状态与互动手掌/手臂的伸入方向。

---

## 1. 通用画布骨架（必含）

每张图的最终 prompt 由 **5 段拼装**而成：

| 段 | 内容 | 变量 |
|---|---|---|
| A · 画布约束 | 4:3 横向 / 2D 手绘 / 蜡笔 + 彩铅 / 纸张颗粒 / 固定镜头 | 固定不变 |
| B · 顶部 HUD | 3 颗心 + 进度条 + 骨头 + 涂鸦 | 固定不变 |
| C · 主角描述 | 由 subject_brief 决定 | `{{SUBJECT}}` |
| D · 主角动作 | 4 个方向对应 4 种夸张姿态 | `{{DOG_POSE}}` |
| E · 攻击手掌 + 高亮箭头 | 4 个方向对应 4 种带手臂手掌来源 + 4 个箭头位置 | `{{HAND_SOURCE}}` + `{{HAND_ACTION}}` + `{{HIGHLIGHTED_ARROW}}` |

---

## 2. A 段（固定不变）

```
4:3 horizontal composition, 2D hand-drawn illustration style,
warm cream paper texture with subtle paper grain,
crayon and colored pencil strokes with slight hand-drawn jitter,
fixed camera, no zoom, no pan, no camera movement,
clean minimal background, no text, no subtitles. The character always stays centered in the composition; initial body size occupies only 20%~25% of the frame; keep more than 40% empty space around the character; the hand must never touch, collide with, overlap, or cover the character body.

IMPORTANT — what to ALLOW vs what to FORBID:
- ALLOW: hand-drawn decorative HUD (hearts / progress bar / bone icon) and
  bottom 4-direction arrows. These are part of the reaction-game visual,
  not forbidden UI.
- FORBID: any digital / electronic / modern UI (no buttons, no glow,
  no screen reflections, no neon, no vector clean lines, no realistic
  photography, no 3D, no glossy gradients).
```

---

## 3. B 段 HUD（固定不变）

```
Top HUD (hand-drawn, sketchy, decorative only — not a real game UI):
- Top-left: three small red-orange crayon hearts, slightly uneven
- Top-center: a thin hand-drawn progress bar with orange-yellow fill at about 50%, with two small accent strokes at each end
- Top-right: a small hand-drawn dog bone icon plus a few doodle marks
- Decorations must be sparse and cute, must not block the main character, the hand, or the arrow row
```

---

## 4. 4 个方向的具体变量表

> **游戏规则（不可错位）**：箭头高亮方向 = 主角运动方向 = 带手臂手掌来源的**反方向**。
> 也就是说，"按上键"= 主角向上跑 = 躲从下方来的掌。

### 🟢 方向 1 · 上躲（关键帧 #1）

- `{{HIGHLIGHTED_ARROW}}` = `bottom-row leftmost UP arrow (↑) is filled solid black with an outer hand-drawn ring ripple, short radiating lines, and small star/feedback marks`
- `{{HAND_SOURCE}}` = `from the exact bottom-center of the frame with a visible simple arm segment attached, fingers spread, reaching upward, staying safely away from the center character`
- `{{HAND_ACTION}}` = `palm facing up, pushing upward into the scene`
- `{{DOG_POSE}}` = `eyes half-closed; body arches upward into an exaggerated arc-shaped half-circle bridge, all four limbs suspended in the air, clearly dodging the hand below`

### 🔵 方向 2 · 下躲（关键帧 #2）

- `{{HIGHLIGHTED_ARROW}}` = `bottom-row second-from-left DOWN arrow (↓) is filled solid black with an outer hand-drawn ring ripple, short radiating lines, and small star/feedback marks`
- `{{HAND_SOURCE}}` = `from the upper-middle of the frame with a visible simple arm segment attached, fingers spread, pressing downward, staying safely away from the center character`
- `{{HAND_ACTION}}` = `palm facing down, slamming down into the scene`
- `{{DOG_POSE}}` = `body tightly pressed to the ground; front half and head completely flat on the floor, back half lifted high to dodge the hand above`

### 🟡 方向 3 · 左躲（关键帧 #3 · 按左键）

> 关键：按左键 = 主角**向左**移动 = 躲从**右侧**来的掌

- `{{HIGHLIGHTED_ARROW}}` = `bottom-row second-from-right LEFT arrow (←) is filled solid black with an outer hand-drawn ring ripple, short radiating lines, and small star/feedback marks`
- `{{HAND_SOURCE}}` = `from the right side of the frame with a visible simple arm segment attached, fingers spread, reaching horizontally leftward, staying safely away from the center character`
- `{{HAND_ACTION}}` = `palm facing left, sliding/swiping left into the scene`
- `{{DOG_POSE}}` = `fierce-cute eyes; body stretches and slides far to the LEFT with paws gripping the ground, accessories or ears blown backward by speed, several hand-drawn dust-slide lines under the feet`

### 🟣 方向 4 · 右躲（关键帧 #4 · 按右键）

> 关键：按右键 = 主角**向右**移动 = 躲从**左侧**来的掌

- `{{HIGHLIGHTED_ARROW}}` = `bottom-row rightmost RIGHT arrow (→) is filled solid black with an outer hand-drawn ring ripple, short radiating lines, and small star/feedback marks`
- `{{HAND_SOURCE}}` = `from the left side of the frame with a visible simple arm segment attached, fingers spread, reaching horizontally rightward, staying safely away from the center character`
- `{{HAND_ACTION}}` = `palm facing right, sliding/swiping right into the scene`
- `{{DOG_POSE}}` = `playful expression; body twists to the RIGHT in a funny dodging motion, avoiding the hand from the left, with lively motion lines and no contact`

---

## 5. 装饰段（4 张图共用）

```
Around the main character: a few sparse hand-drawn doodles generated from the character's own visual elements, not generic decorations. For example, reuse simplified motifs from the character such as tiny green hat/jewel shapes, beard curls, robe trim swirls, small glowing orb sparkles, matching mascot-themed motion marks. Sparse, not crowded. Must not overlap the main character, the hand, or the arrow row.
```

---

## 6. 完整 prompt 拼装示例

把上面各段拼起来，最终单张 prompt 结构：

```
[A 画布约束段]
[B 顶部 HUD 段]
[主角描述段：The main character is {{SUBJECT}} — {{SUBJECT_BRIEF}}.
 The character keeps a consistent 2D crayon/pencil chibi look:
 round Q-version body, big head, short legs, soft outlines,
 must stay IDENTICAL in identity and art style across the whole 10s video
 even when stretched/squished/arched.]
[本方向 DOG_POSE 段]
[本方向 手掌 + 高亮箭头段：The attack: a single hand-drawn human hand,
 {{HAND_SOURCE}}, {{HAND_ACTION}}. Bottom row of four arrows:
 {{HIGHLIGHTED_ARROW}}, the other three are empty outline arrows.]
[装饰段]
[结尾硬约束：No text. No modern UI. No realistic 3D. No camera movement.
 Must be 4:3 horizontal.]
```

---

## 7. 调用 image_synthesize 的参数

```python
# 4 张图并行调用，input_file_paths 都设为同一张用户照片
image_synthesize(requests=[
  {
    "prompt": "<拼装完的关键帧 #1 prompt>",
    "output_file_path": "dodge-game/01-up.png",
    "input_file_paths": [用户照片绝对路径],
    "aspect_ratio": "4:3",
    "resolution": "2K"
  },
  # ... 关键帧 #2 #3 #4 同上，只换 DOG_POSE / 手掌 / 箭头变量
])
```

- `aspect_ratio` 锁死 `"4:3"`
- `input_file_paths` 锁死同一张用户照片（保证主角身份一致）
- `resolution` 推荐 `"2K"`（H3 视频缩放用）

---

## 8. 4 张图的角色一致性自检（必做）

4 张图生成完，**逐对对比**这 5 点：
1. 主体生物类型一致（不能图 1 是猫图 2 变狗）
2. 主体配色一致（主色块 + 副色块位置一致）
3. 主体辨识特征一致（耳朵形状、眼睛、尾巴、关键配饰）
4. 2D 蜡笔 Q 版画风一致（不能某张突然写实）
5. 底部箭头位置一致（4 个箭头永远从左到右是上/下/左/右，**不能变顺序**）

任意一项不一致 → 重跑该张图，并把 `subject_brief` 的对应描述强化。


## Sequential reference rule

Generation order is mandatory:
1. Generate keyframe #1 from the user photo.
2. Generate keyframes #2, #3, #4 using both the user photo and keyframe #1 as references. They must preserve keyframe #1's visual style, UI icons, arrow style, background paper texture, character-themed sparse decorations, composition, and unified palm-and-arm line-art design. Only change the character dodge pose, the highlighted arrow, and the direction from which the palm-and-arm enters.

Additional hand constraint: every interaction hand must include a visible simple arm segment. It must never be a detached floating palm. For UP dodge, the palm-and-arm enters from the exact bottom-center and reaches upward.


## Single arm rule for image generation

- Each keyframe must contain exactly ONE interaction palm-and-arm, not zero and not multiple.
- The palm-and-arm should extend close to the character body to create clear interaction pressure, but must keep a small visible safety gap; it must never touch, overlap, cover, collide with, or pass through the character.
- After keyframe #1 is generated, keyframes #2, #3, and #4 use keyframe #1 only as style/composition/UI/background/decoration/character/hand-style reference. The original UP palm-and-arm from keyframe #1 must NOT remain visible in keyframes #2-#4.
- Keyframes #2-#4 must show only one current-direction palm-and-arm: DOWN = one arm from above, LEFT = one arm from right, RIGHT = one arm from left.
- When referencing keyframe #1, explicitly remove/ignore its original interaction arm and redraw a single new arm for the current direction.
