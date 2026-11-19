# Style Catalog: Visual Styles & Prompt Formulas

> Governing workflow: read `production-workflow.md`. Speech language, subtitles and music require explicit pre-video approval; none is a default. Historical English/voice/music examples are conditional illustrations. Default video model: MiniMax H3. Character and shot-keyframe approvals precede video; clips require user review before final assembly. No unsolicited generated-media acceptance inspections or autonomous paid retries.
> 优先遵循 `production-workflow.md`：旁白语言、字幕和配乐在视频前明确确认，均无默认值。历史英文、音色和音乐内容仅作条件示例。默认视频模型为 MiniMax H3；角色和镜头关键帧先确认，片段审阅后再组装。不主动验收自有生成媒体或自行付费重试。


This catalog defines the supported visual styles for `stickman-animation-shorts`, including character DNA locks, environment specifications, motion pacing, and negative constraints.

---

## 1. Style Matrix Overview

The selectable styles are five independent visual variants. Never present the five styles as lettered sub-options in the user choice step.

| Style Key | Style Name | Visual Theme | Best For | Character Design |
|---|---|---|---|---|
| **Style 1** | Classic Minimalist Light | Pure white or black canvas, monochrome lines, up to 3 saturated accent colors | High-density explainers, pure logic, mental models, fast-paced cognitive concepts | Light: solid black faceless round head and thin black single-line limbs; Dark: solid white outlined head with simple expressive face and thicker rounded white tube-like body/limbs |
| **Style 3** | Modern Character - Studio Tech (极简科技风) | Pure white high-key studio, subtle light-gray perspective grid, glowing cyan/blue glass UI | Tech tutorials, AI tool breakdowns, career insights, methodology breakthroughs | Pale lavender low-saturation long-sleeved shirt, white round head and small white hands, thin black legs and chunky black boots; no hat, hair, backpack or straps |
| **Style 4** | Modern Character - Cinematic Story (彩色故事风) | Full-color narrative environments, cinematic lighting & depth (warm room, dusk, desert, summit) | Emotional storytelling, personal growth, motivational journeys, narrative hooks | Same pale-lavender character as Style 3: low-saturation long sleeves, white round head, small white hands, thin black legs and chunky black boots; no hat, hair, backpack or straps |
| **Style 5** | Cozy Storytelling (治愈故事风) | Full-color 2D cartoon locations, gentle atmospheric light, varied cinematic shots | Relatable life stories, emotional growth, educational storytelling | White filled round head, white bell-shaped torso wider toward the bottom, dark thin limbs, simple face with optional freckles/blush, no hair or clothing |


For Style 5 read `cozy-storytelling.md`. Treat locations as story beats, not one universal room. Its English display name is **Cozy Storytelling**; do not rename it Sketchbook Stories, hand-drawn.

---

## 2. Style 1: Classic Minimalist

### Polarity & Background
- **Light Theme**: Flat, uniform, digitally pure-white canvas. Strictly forbid gray tint, paper texture, gradients, shadows, lighting, bloom, fog, or 3D depth.
- **Dark Theme**: Flat, uniform, pitch-black canvas. Pure white line art with high-contrast accent colors.

### Character DNA

**Classic Light — original demo anchor:**
```text
Use a flat digitally pure-white 2D canvas. Show a consistent minimalist black stick figure with a solid black circular head, no face, no hair, no clothing, and thin black single-line limbs. Exactly two arms and two legs are visible; each limb appears only in its current pose.
```

**Classic Dark — original demo anchor:**
```text
Use a flat pitch-black 2D canvas. Show a consistent minimalist white stick figure with a solid white round head and thin black outline, simple exaggerated line expression, and thicker rounded white tube-like body and limbs with rounded hands and feet. Exactly two arms and two legs are visible; each limb appears only in its current pose.
```

Light and Dark are separate demo-locked variants. Do not turn Light into an outlined expressive figure or Dark into thin hollow-head line art. Keep action, props and accent graphics outside the character anchor.

Choose the theme, then freeze its full anchor and repeat it verbatim in every clip. Do not expand it into numeric ratios, skeleton/rig definitions, pen paths, separate hand/foot shapes or body-volume descriptions. Keep pose, movement, props and camera in the timed sequence, not in competing character definitions. The current-pose rule applies to every limb; if the approved story uses a left-arm lead action, adjust the handedness once before freezing, never clip by clip. Preserve energetic actions and rich effects; draw motion trails on props or detached graphics, not as additional limb poses.

Occasional simple line expressions are allowed by default. Before freezing either base anchor, replace only "no face, no eyes, no mouth," with "occasional simple line expressions, no detailed facial features," and keep the prompt's negative constraints compatible with that choice. If the user explicitly requests a faceless character, keep the base unchanged. Expressions never change head fill, head outline, body structure or proportions; no detailed eyes, pupils or realistic facial rendering.

2026-10-13 Flow retest: a historical model (not the current default), 16:9, 720p, independent 10s clips for a paper-airplane/perfectionism story. The final Dark base was used in three clips plus two repeated high-risk clips; the Light base was used in two clips. Browser-sampled action frames did not show extra limbs or sudden head enlargement in these final samples. Hand/foot endpoints and cross-clip line weight can still vary; this is not frame-by-frame certification or a guarantee for future generations. The expression-enabled and left-handed variants were not separately tested. Detailed scope and asset IDs are in `tests/reports/classic-character.md` at repository level. Prop continuity and audio were not accepted by this character-only check.

### Palette Contract
- Maximum of three saturated accent colors named with ordinary words (e.g., vivid red, electric blue, warm gold).
- No technical color notations (hex, RGB, Pantone).

---

## 3. Style 3/4: Modern Character

### Shared character DNA anchor — Styles 3 and 4

Styles 3 and 4 use exactly the same character identity, clothing, proportions, line weight and approved reference image. Their visual-style distinction is ONLY environment/background: Style 3 is a white grid studio with cyan/blue glass UI; Style 4 is a full-color story setting with cinematic lighting. Environment changes never redesign the character.

**Shared pale-lavender anchor (user-approved):**
```text
A minimalist 2D animated stick figure with a white round head, thin black outline, small black dot eyes and a simple curved mouth line; a soft low-saturation pale lavender long-sleeved shirt, small white hands, thin black legs and chunky black boots. No hat, no hair, no backpack and no shoulder straps. Exactly two arms and two legs, each limb shown only in its current pose. Flat clean 2D colors, identical proportions and constant line weight at every camera distance.
```

Shared character master for both styles: `assets/style-3-lavender-character.png`. The filename is historical; this is the common Style 3/4 master. This image locks appearance only, not the story background. Keep lavender soft and muted, not fluorescent. No hat, hair, backpack or shoulder straps.

The old red-hat/yellow-shirt characters are superseded and must never override the shared master.

No detailed pupils, photorealistic faces, extra limbs or pose trails. Camera distance changes do not redesign the character. Reuse approved references; add no unapproved accessories.

---

### Style 3 Environment: Modern Studio Tech (极简科技风)

Style selection card: `assets/style-3-tech-reference.png` shows the shared lavender character together with the white perspective grid studio and cyan/blue glass UI. Use this scene card for user-facing style selection; keep `assets/style-3-lavender-character.png` as the common character master for Styles 3 and 4.

**In Plain Language**: Apple 发布会式极简科技风。纯白亮面高光空间 + 极淡浅灰透视地砖网格 + 悬浮青蓝半透明玻璃 UI/微光质感。

#### Environment Specification
```text
in a modern bright white studio space with subtle light-gray perspective grid lines on the floor plane. High-key studio lighting, clean white negative space, sleek glowing cyan and electric blue glass holographic UI elements.
```

#### Mandatory Negative Constraints (Anti-Clutter)
Without explicit negative constraints, diffusion models tend to generate motherboard circuitry, spaceship corridors, and cracked concrete. **Always append this negative clause in Style 3 prompts:**
```text
Negative constraints: strictly minimalist studio aesthetic, no circuit board textures, no sci-fi wall panels, no spaceship corridors, no cracked concrete, no grunge textures, no photorealistic human skin, no speech bubbles, no dialogue text boxes.
```

#### Motion Dynamics (Anti-Stutter & Anti-Lag)
- **Do not use abstract liquid/morphing transformations** (e.g., stairs melting into a clock), which trigger latent flicker and stuttering.
- **Use physical, character-driven interactions**:
  - Leaping and bumping an invisible glass ceiling with a comedic bounce.
  - Tapping a black boot onto the floor grid to emit an expanding cyan ripple wave.
  - Pulling out a glowing light-pen to draw a crisp luminous line bridge across an abyss.
  - Touching a sleek floating glass panel to reveal an icon-only illuminated lock.
  - Pushing open a heavy minimalist vault door to step forward into bright horizon light.
- **Pacing**: Every 10-second clip must feature distinct actions across `[0–3s]`, `[3–7s]`, and `[7–10s]`. Never let the character stand idle or stare at the camera for multiple seconds.

---

### Style 4 Environment: Cinematic Story (彩色故事风)

Style selection card: `assets/style-4-cinematic-reference.png` shows the shared lavender character within a full-color dusk street scene, warm window light against cool sky, foreground framing and layered cinematic depth. Use it for user-facing style selection, not as a mandatory story location. Both styles continue to use `assets/style-3-lavender-character.png` as the character master.

**In Plain Language**: Pixar 故事短片风。全彩沉浸式场景（暖光台灯卧室、黄昏窗前、荒野公路、云端山顶）+ 电影叙事光影。

#### Environment Specification
```text
in a rich full-color cinematic environment [describe setting: e.g., a dimly lit cozy bedroom with warm lamplight / a vast open desert highway under a glowing dusk sky / a dramatic mountain ridge above rolling golden clouds]. Cinematic volumetric lighting, soft depth of field, atmospheric narrative mood.
```

#### Character & Style Consistency
- The character is exactly the shared pale-lavender Style 3/4 figure above; cinematic backgrounds do not add a hat, backpack or change the clothing.
- Maintain smooth 2D vector animation aesthetics for the character even within a textured, atmospheric background.

#### Negative Constraints
```text
Negative constraints: no photorealistic human skin or faces, no 3D humanoid CGI uncanny valley models, no chaotic line glitches, no speech bubbles, no dialogue text boxes.
```

---

## 4. Style 5: Cozy Storytelling (治愈故事风)

Minimalist expressive characters inside colorful cartoon worlds: an office, a metro platform, a street-side cafe, a park or another story-appropriate setting. Use close action inserts, wide establishing views, lateral tracking and motivated location cuts. Warmth belongs to the visual treatment; preserve the source's conflict and meaning rather than making every topic cheerful.

Each new ten-second segment normally establishes a different location. Keep the character, important props, screen direction and full voice profile consistent, while deliberately changing scenery. A new camera angle on the same desk is not a substitute for a new story location. Single-location requests and approved callbacks remain valid exceptions.

Use the full character anchor, prop-state rules and acceptance checklist in `cozy-storytelling.md`; do not inherit Style 1's hollow-head/no-face/no-filled-body bans or Style 3's crude sketch/animal-hide rules.

---

## 5. Universal Audio Continuity Contract

Voice continuity is a shared foundation for **all styles**, including Styles 3 and 4. Apply `voice-continuity.md` before style-specific music rules. Different videos can choose different voices, while all clips of one video repeat one complete approved voice profile. Keep voice identity separate from the musical arc.

### Narrator Voice Lock
```text
One off-screen adult male narrator throughout. General American accent, warm clean baritone, medium-low pitch, gentle chest resonance, no raspiness or breathiness. Calm conversational delivery, restrained pitch variation, steady speaking pace, and close, dry studio sound. Keep the same vocal timbre, register, accent, pace, and recording quality throughout. Emotional progression belongs to the visuals and music; do not change the narrator's voice or switch to character dialogue.
```
This is the user-accepted male example, not a compulsory voice for every project. For female, older, youthful or other approved voices, resolve a complete coherent profile using `voice-continuity.md`, then repeat it verbatim across every clip. Do not use only "same narrator" or inherit a prior clip by name. Keep narration audio-only, voice-first, with no speech bubbles or dialogue boxes. Actual listening acceptance exists for the Style 3 Hope sample; other profiles/styles remain untested for audio matching.

### BGM Continuity Lock
Phase A defines one video-level music plan (instrumentation, motif, tempo and any planned turn with its clip). The piano blocks below are the default for Styles 1 and 2 when the source gives no other cue; Style 3 and Style 4 choose a story-appropriate score under their own files. Whatever the plan, clip 1 establishes it and clips 2–N explicitly continue the identical music.

- **Clip 1** (default):
  ```text
  Audio: Voiceover clearly audible over quiet, thoughtful piano and subtle soft ambient synth, building gentle optimistic momentum.
  ```
- **Clips 2–N** (default):
  ```text
  Audio: Voiceover seamlessly continues the identical quiet, thoughtful piano and subtle soft ambient synth from clip 1, maintaining identical tempo, instrumentation, and optimistic narrative momentum. Synchronized crisp SFX on physical actions.
  ```

---

## 6. Visual Beat Pacing Template (10-Second Clip)

Every prompt must divide its 10 seconds into three active narrative beats:

```text
Timed Synchronized Visual Beats:
- [0–3s] (VO: "..."): [Setup / premise action — character enters, acts, or inherits momentum from previous clip]
- [3–7s] (VO: "..."): [Escalation / discovery — character interacts with environment or solves visual obstacle]
- [7–10s] (VO: "..."): [Climax & outgoing transition — character delivers payoff and initiates outgoing motion for next clip]
```
