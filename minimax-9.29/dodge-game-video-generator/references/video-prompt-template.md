# H3 视频 Prompt 模板（10 秒 4:3 横向）

调用 `gen_videos` 时使用的完整 prompt 模板。视频时长锁死 10 秒。视频必须同时参考图1、图2、图3、图4的画面内容，锁定四个方向对应的角色动作、箭头反应和带手臂手掌方向。

---

## 1. prompt 必须包含的 4 大段

```
[段 1: 画风与镜头硬约束]
[段 2: 主角完整描述（来自 subject_brief）]
[段 3: HUD 与场景布局（顶部 HUD + 底部箭头）]
[段 4: 10 秒时间线（节奏分 3 段）]
[段 5: 整体运动 + 结尾反馈]
```

---

## 2. 段 1 · 画风与镜头硬约束（固定不变）

```
A 10-second 4:3 horizontal (landscape) game video in a minimal cute
2D hand-drawn reaction-game style. Fixed camera, NO camera movement,
NO zoom, NO pan, NO dolly. Movement is fast, bouncy, clear, and game-feedback-driven. Clean cream paper-textured background with
subtle paper grain. Crayon and colored pencil strokes throughout with
slight hand-drawn line jitter. Warm, cozy, playful doodle aesthetic.
No text, no subtitles, no modern electronic UI, no realistic
photography, no 3D, no live action. No extra characters, no complex background. Sparse
decorative doodles (paw prints, tiny stars, motion lines) only —
must not block the main character, the hand, or the arrow row.
```

---

## 3. 段 2 · 主角描述（变量 `{{SUBJECT}}` + `{{SUBJECT_BRIEF}}`）

```
The main character is a {{SUBJECT}} — {{SUBJECT_BRIEF}}.

The character must keep a CONSISTENT identity and art style for the
entire 10 seconds, even when the body is stretched, squished, arched,
or side-stepped like a rubber band. Round Q-version (chibi) proportions,
big head, short legs, big droopy or expressive features matching the
subject, soft crayon outlines, slightly squishy body. Default face:
half-closed lazy eyes with a cheeky "you can't catch me" smirk.
```

> `{{SUBJECT_BRIEF}}` 的写法关键：必须用 **2D 蜡笔 Q 版的口吻**描述用户照片提取出的特征。
> 反例（写实）："一只写实风格的成年比格犬"
> 正例（Q 版）："一只圆润 Q 版的皮皮小比格犬，短腿、大耷拉耳、圆润长吻部、短翘尾巴、半眯慵懒欠揍的表情"

---

## 4. 段 3 · HUD 与场景布局（固定不变）

```
Scene layout (must stay consistent across the 10 seconds):

Top HUD (hand-drawn, decorative, never blocks the main action):
- Top-left: three small red-orange crayon hearts
- Top-center: a thin hand-drawn progress bar, the orange-yellow fill
  smoothly advances from ~10% to ~100% as the 10 seconds progress
- Top-right: a small hand-drawn dog bone icon plus a few doodle marks

Bottom row of four hand-drawn arrows (left → right order MUST stay fixed):
↑  ↓  ←  →   (up, down, left, right)
Each beat, exactly one of the four arrows becomes solid-filled and
briefly outlined by a hand-drawn ring ripple plus short radiating
lines, plus a tiny star or paw print — then returns to outline.

Decorations: a few sparse hand-drawn paw prints and small 4-pointed
stars scattered in the empty space. Sparse, not crowded.
```

---

## 5. 段 4 · 10 秒时间线（核心节奏）

> **这是视频能不能"像反应游戏"的关键段**，每拍必须严格遵守"箭头-手掌-动作"对应规则。

### 5.1 0-5 秒 · 固定序列（上、下、上、左、右）

节奏：每个方向约 1 秒，动作清楚利落，每次动作结束有轻微回弹 + 手绘反馈特效。

```
[0.0s-1.0s] BEAT 1 — UP arrow highlighted:
  - The ↑ arrow (bottom-row leftmost) becomes solid-filled with
    a hand-drawn ring ripple, short radiating lines, and a tiny star.
  - A single hand-drawn human hand, fingers spread, REACHES UP
    from BELOW the frame, palm facing up.
  - The main character immediately arches its body UP into an
    exaggerated half-circle bridge (back up, four legs braced,
    belly forming a clear half-circle dome) to make room for the
    hand below.
  - At 1.0s, the character briefly bounces back to a neutral stance.

[1.0s-2.0s] BEAT 2 — DOWN arrow highlighted:
  - The ↓ arrow (bottom-row second-from-left) becomes solid-filled
    with ring ripple, radiating lines, and a tiny star.
  - A hand, fingers spread, PRESSES DOWN from ABOVE the frame,
    palm facing down.
  - The main character immediately DROPS and presses flat against
    the ground (front half squished to the floor, back half still
    raised with tail up, ears flopped flat, head barely lifted to peek).
  - At 2.0s, the character bounces back.

[2.0s-3.0s] BEAT 3 — UP arrow highlighted:
  - The ↑ arrow (bottom-row leftmost) becomes solid-filled with ring ripple, radiating lines, and a tiny star.
  - A hand reaches UP from BELOW the frame, palm facing up.
  - The main character immediately arches its body UP into an exaggerated half-circle bridge, all four limbs suspended, clearly dodging the lower hand.

[3.0s-4.0s] BEAT 4 — LEFT arrow highlighted:
  - The ← arrow (bottom-row second-from-right) becomes solid-filled
    with ring ripple, radiating lines, and a tiny star.
  - A hand, fingers spread, REACHES HORIZONTALLY from the RIGHT
    edge of the frame, palm facing left, swiping left.
  - The main character immediately STRETCHES its body horizontally
    to the LEFT like a rubber band (head left, body elongated sideways,
    ears flapping in the motion direction, front paws gripping,
    tail trailing).
  - At 4.0s, the character springs back.

[4.0s-5.0s] BEAT 5 — RIGHT arrow highlighted:
  - The → arrow (bottom-row rightmost) becomes solid-filled with
    ring ripple, radiating lines, and a tiny star.
  - A hand, fingers spread, REACHES HORIZONTALLY from the LEFT
    edge of the frame, palm facing right, swiping right.
  - The main character immediately COMPRESSES like a coiled spring
    and SLIDES to the RIGHT (back legs squished and bunched up on
    the left side, front half lunging right, body tilted mid-leap).
  - At 5.0s, the character springs back.
```

### 5.2 6.1-9.5 秒 · 随机连打模式

节奏：比前半段更快，方向**完全固化写死**（**不要写"随机"**），每一次仍必须严格遵守"箭头-手掌-动作"对应规则。

```
[6.1s-9.5s] RAPID DODGE SPRINT / RANDOM COMBO MODE:
  Direction order may be randomly arranged, for example LEFT-UP-RIGHT-DOWN-UP or RIGHT-DOWN-LEFT-UP-RIGHT. It does NOT need to be fixed, but every beat MUST obey the gameplay rule:

    IF ↑ arrow is highlighted:
      → hand reaches UP from below
      → character arches body UP into half-circle bridge

    IF ↓ arrow is highlighted:
      → hand presses DOWN from above
      → character flattens to the ground

    IF ← arrow is highlighted:
      → hand reaches horizontally from the RIGHT
      → character stretches/slides LEFT with gripping paws and dust-slide lines

    IF → arrow is highlighted:
      → hand reaches horizontally from the LEFT
      → character twists/slides RIGHT in a funny dodge

  Pacing: faster than the first 5 seconds, like the game difficulty suddenly increases. Bottom arrows switch highlights quickly and stay synchronized with the character's real movement direction: whichever direction the character moves, the matching bottom arrow lights up at the same time. Top progress bar keeps advancing. The character's poses become more exaggerated and comedic, but identity and art style stay consistent.
```

### 5.3 9.5-10 秒 · 通关结算

```
[9.5s-10.0s] FINAL BEAT — LEVEL CLEAR SETTLEMENT:

  All hands completely disappear; no hand remains anywhere in the frame.
  All bottom arrows return to normal outline state, no arrow is highlighted.
  The character stops steadily in the exact center of the frame, facing the camera, keeping its original body scale without zooming or enlarging.
  The character shows a cheeky annoying smirk. Around the character appear hand-drawn stars, paw prints, and a hand-drawn ripple feedback meaning “level clear success” without readable text.
  Top HUD: progress bar reaches ~100% full orange-yellow fill.
```

---

## 6. 段 5 · 整体运动 + 收尾（固定不变）

```
Overall motion feel: FAST, BOUNCY, SNAPPY, CLEAR, with strong game-feedback energy. Every direction must strictly read as: arrow highlights → palm-and-arm suddenly enters → character instantly dodges → quick bounce-back. No slow motion, no dragging, no lingering, no delayed reaction. The character never stays still mid-game except in
the final 0.5 second. The whole video should feel like a tiny cute
reaction game in one cut.

Final 0.5s: tail wags, smirk stays, success doodles fade. End.
```

---

## 7. 完整 prompt 拼装示例

```
[段 1 画风硬约束]
[段 2 主角描述: The main character is {{SUBJECT}} — {{SUBJECT_BRIEF}}. ...]
[段 3 HUD 布局]
[段 4 10 秒时间线（5.1 + 5.2 + 5.3 三段，按拍写）]
[段 5 整体运动 + 收尾]
```

---

## 8. 调用 gen_videos 的参数

```python
gen_videos(requests=[{
  "prompt": "<上面拼装出来的完整 prompt>",
  "output_file_path": "dodge-game/10s-game.mp4",
  "input_image_path": "dodge-game/01-up.png",   # 关键帧 1 作为 first_frame
  "reference_type": "first_frame",
  "duration": 10,
  "resolution": "1080P"
}])
```

- `duration = 10`（锁死）
- `input_image_path` 用关键帧 1（上躲姿态最明显，构图最稳定）
- `reference_type = "first_frame"`
- 视频比例：H3 模型按 first_frame 比例输出，关键帧 1 已经是 4:3

---

## 9. 视频自检（生成后必看）

| 检查项 | 是否通过 |
|---|---|
| 4:3 横向比例 | ☐ |
| 10 秒时长 | ☐ |
| 固定镜头（无运镜） | ☐ |
| 2D 蜡笔 Q 版画风 | ☐ |
| 主角形象 10 秒一致 | ☐ |
| 5 段固定序列：箭头-手掌-动作 全部对应 | ☐ |
| 5-9.5s 随机段：每次仍遵守规则 | ☐ |
| 9.5-10s 收尾：尾巴摆动 + 坏笑 + 星星 | ☐ |
| 无文字 / 无现代 UI / 无写实 | ☐ |
| 进度条平滑推进 | ☐ |

任意一项不通过 → 重新写对应段 prompt，重跑视频。


Additional video constraints:
- The video must read clearly as a fast-paced “press arrow keys to dodge hands” mini-game operation flow: arrow highlight, palm-and-arm entry, and character dodge happen in sync.
- Every interaction hand must include a visible simple arm segment; no detached floating palm is allowed.
- For UP dodge, the palm-and-arm enters from the exact bottom-center and reaches upward.
- Decorations are sparse and cute, and must never block the character, hand, arm, or direction arrows.
- No readable text, no modern electronic UI, no realistic photography effect.


## Four keyframe video reference rule

The video generation must reference all four keyframes:
- Keyframe 1 = UP dodge visual reference: UP arrow highlighted, palm-and-arm from exact bottom-center, character arches upward.
- Keyframe 2 = DOWN dodge visual reference: DOWN arrow highlighted, palm-and-arm from above, character flattens to ground.
- Keyframe 3 = LEFT dodge visual reference: LEFT arrow highlighted, palm-and-arm from right, character stretches/slides left.
- Keyframe 4 = RIGHT dodge visual reference: RIGHT arrow highlighted, palm-and-arm from left, character twists/dodges right.

Use these four references to preserve the exact 2D hand-drawn illustration style, UI icon style, arrow design, background paper grain, sparse character-themed decorations, unified palm-and-arm design, and corresponding dodge poses. The video is a fast-paced “press arrow keys to dodge hands” mini-game operation flow. Every beat must be clear: arrow highlight → palm-and-arm suddenly enters → character instantly dodges → quick rebound. No slow motion, no拖沓, no realistic effect, no 3D, no complex background, no subtitles, no extra characters.


## Single arm continuity rule

- At each dodge beat, only one current-direction palm-and-arm may appear.
- The palm-and-arm should come close to the character body for clear gameplay pressure, but always leave a small visible safety gap; never touch, overlap, cover, collide with, or pass through the character.
- Do not carry over a previous beat's palm-and-arm into the next beat. The previous arm fully exits/disappears before the next direction arm appears.
- When using keyframe #1 as visual reference, keep its style/UI/background/character/hand style, but do not preserve its original UP arm in other direction beats.


## Required video UI / HUD / feedback language

The video must clearly read as a fast-paced “press arrow keys to dodge hands” mini-game operation flow.

- A hand-drawn direction-arrow UI row must remain visible at the bottom of the screen for the entire video. It contains all four directions in fixed order: ↑ ↓ ← →.
- At the start of every operation beat, the corresponding direction arrow rapidly turns into a solid highlighted arrow.
- When an arrow highlights, it must synchronously show hand-drawn feedback: circular ripple rings, short radiating strokes, tiny stars, or paw-print feedback marks.
- Keep a lightweight hand-drawn HUD at the top: three small hearts in the top-left, a thin hand-drawn progress bar at the top-center, and a small character-element icon plus a few doodle marks in the top-right.
- Decorations must be sparse and cute; they must never block the main character, hand, arm, or direction arrows.
- No readable text, no subtitles, no modern electronic UI, no realistic photography effect.


## Real-time arrow sync and slower rapid-combo rule

- The bottom direction key must be strictly synchronized with the character's real-time movement direction. If the character moves up, the UP arrow highlights at the same moment; if down, DOWN highlights; if left, LEFT highlights; if right, RIGHT highlights.
- Never allow an arrow to highlight while the character does not move. Never allow the highlighted arrow direction to differ from the character's actual movement direction.
- The later random combo mode should be only slightly faster than the first half, not too fast. Reduce difficulty to avoid visual chaos.
- Recommended random combo: 4 clear beats instead of 5, each about 0.8-0.9 seconds. Every beat must fully show: arrow highlights → palm-and-arm enters → character dodges → rebound.
- Leave a tiny rebound gap between beats so viewers can clearly read the character direction and matching highlighted key.
