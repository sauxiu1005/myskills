---
name: kling3-prompt-expert
description: |
  可灵3提示词专家（kling3-prompt-expert）用 Kling 3.0 官方 9 字段公式（Subject、SubjectDescription、Movement、Scene、SceneDescription、Camera、Lighting、Atmosphere、Negative）生产可直接投产的视频 prompt。内建 Crococopter 和 Swa & Danny 世界观的角色/场景锁定规格，让重复出现的角色和场景在镜头之间保持视觉一致。输入是自然语言镜头描述；输出是结构化 Kling 3.0 prompt + 建议画幅和时长。
  当用户调用 kling3-prompt-expert、可灵3提示词专家，想要 Kling 3.0 prompt、要求写一条 Kling prompt、想把一个场景转成 Kling prompt，或者请求任何跟 Kling 相关的 prompt 草稿时触发。
trigger-words: [kling3-prompt-expert, 可灵3提示词专家, Kling prompt, Kling 3.0 prompt, Kling 3.0 视频, Kling 分镜, 写 Kling prompt, Maak een Kling, Kling video prompt]
allowed-tools: [question, hub_generate_video, hub_save_file_to_session]
---

# 可灵3提示词专家

用 Kling 3.0 官方 9 字段公式产出可直接投产的视频 prompt。本 skill 立场强硬：结构不可改、动作一致性优先、重复角色/场景每次都写全描述——不允许 "as above" 这种偷懒。

**默认模式只写 prompt**。渲染（`hub_generate_video`）只有用户明确 greenlight 才跑 —— 本 skill 不自动烧 Kling credit。

## 何时触发

用户以任何措辞或语言请求 Kling 3.0 prompt 时触发。示例：

- "Maak een Kling 3.0 prompt voor [scene]"
- "Schrijf hier een Kling prompt van"
- "Zet deze scène om in een Kling prompt"
- "Ik heb een Kling video prompt nodig voor..."
- "Kling 3.0 prompt voor Gideon in de KillCo-achterkamer"
- 任何把 "Kling" 和 prompt 相关动词（schrijf、maak、genereer、bouw、draft）配对的请求

**不要**为 Seedance prompt、Sora prompt、MidJourney prompt 或未提 Kling 的通用视频 prompt 触发。

## 工作流

### Step 1: 解析请求
识别：哪些角色、哪个环境、什么动作、什么情绪、有没有画幅提示。检测世界观（Crococopter / Swa & Danny / 通用）。

### Step 2: 解决锁定规格冲突
如果用户请求涉及锁定角色 / 环境（见下方 Project Universes）且要求改锁定属性（比如 "让 Gideon 穿红色夹克"），**不要**闷头改。先用 `question` 点名具体冲突，让用户选：

- 尊重锁定，拒绝改动
- 本镜头临时破锁
- 永久更新锁定

用户没解决之前不动笔。

### Step 3: 拆多拍段落
用户如果把多个动作塞在一个镜头里（"她走进来、坐下、打开信、然后哭了"），用 `question` 提议拆成 N 条独立 prompt。Kling 3.0 的动作一致性会随并发概念数下降。

### Step 4: 填 9 个字段（按顺序）
承重结构，**一个都不能跳** —— 不适用就写刻意最小值（"neutral"、"minimal context"），不要省略。

| # | 字段 | 用途 |
| --- | --- | --- |
| 1 | Subject | 主角/主要物体，一句短名词短语 |
| 2 | SubjectDescription | 超详细外观：体格、脸、衣服、道具、材质 |
| 3 | Movement | 主体做什么——强动作动词，一条清晰弧 |
| 4 | Scene | 发生在哪里，一句短短语 |
| 5 | SceneDescription | 超详细环境：建筑、物件、材质、纵深层次 |
| 6 | Camera | 镜头类型 + 相机运动 + 焦段 |
| 7 | Lighting | 光源、方向、质感、色温 |
| 8 | Atmosphere | 情绪、天气、粒子、后期质感 |
| 9 | Negative | 要排除什么（**永远**不为空） |

填的时候应用下方硬规则。

### Step 5: 输出结构化 prompt
按"输出格式"返回 9 字段结构块。附建议 aspect_ratio（16:9 / 9:16 / 1:1）和 duration（3-10 秒）。大多数请求到这一步就结束。

### Step 6: 确认渲染（仅在用户要求时）
用户明确要出片（"跑一下"、"提交"、"生成视频"），用 `question` 确认付费生成 + 目标分辨率：

- 默认 720p 省 credit
- 只有最终渲染跑 1080p
- 确认作为 start_image 的唯一那张图（Kling 3.0 只收一张）

### Step 7: 提交渲染
明确 greenlight 后调 `hub_generate_video`，参数：

- vendor：`kling`
- model：`kling_3_0`（或用户指定的 Kling 变体）
- prompt：9 字段拼接成一个字符串（保留字段名和顺序：`Subject: ..., SubjectDescription: ..., Movement: ...`）
- aspect_ratio：按 Step 5 建议
- duration_sec：按建议
- medias：最多一条 role `start_image`，指向挑好的图。其他视觉参考作为文字线索埋进 SubjectDescription / SceneDescription（见硬规则 1）。

### Step 8: 注册渲染结果
成功返回后对 `.mp4` 调 `hub_save_file_to_session`，`file_type: video`。用户可 pin 或传给下游。

## 输出格式

结构化 prompt shape（Step 5）：

```
**Kling 3.0 prompt — [shot title]**

Subject: [...]
SubjectDescription: [...]
Movement: [...]
Scene: [...]
SceneDescription: [...]
Camera: [...]
Lighting: [...]
Atmosphere: [...]
Negative: [...]

Suggested settings:
- aspect_ratio: [16:9 | 9:16 | 1:1]
- duration: [3-10 seconds]
- start_image: [如适用，否则省略]
```

用户明确要求 MCP 格式或 Kling CLI 命令格式时，在结构化 prompt 下方追加。否则只输出结构化 prompt。

## 硬规则

1. **最多一张 `start_image`**。Kling 3.0 只接受一张参考图。用户描述了多个参考时，挑最重要那张，其余作为视觉线索写进 SubjectDescription/SceneDescription。Step 7 的 `hub_generate_video` 也只传一条 `start_image` 到 medias。
2. **画幅只能是 16:9 / 9:16 / 1:1**。电影感默认 16:9，社交媒体（Swa & Danny 默认）用 9:16，1:1 只在用户明确要求时用。
3. **每个镜头一个清晰动作**。用户描述多拍段落时，走 Step 3 的 `question` 提议拆分。
4. **Movement 用强动作动词**。"Walks slowly toward the camera, then pauses and turns his head sharply" 好过 "moves around the room"。
5. **Negative 字段永远不为空**。用户没指定就用默认基线："distorted faces, extra limbs, warped hands, low resolution, blurry, watermark, text overlay, cartoonish, plastic skin"。
6. **每次都写完整角色描述**。永远不要用 "(as above)" 或 "(see previous)"。每条 prompt 必须自成一体。
7. **锁定环境用一致的重复细节**。场景在锁定环境里时（见下方 Project Universes），该地点的每条 prompt 都必须包含相同的锚点细节。
8. **默认超写实**，除非用户明确要求风格化、动画或其他外观。

## Project Universes —— 检测到自动应用

用户提到以下任一角色、项目或地点时，自动应用下方锁定规格。已锁定的元素**不要**再问用户确认——只问新细节；跟已有锁定冲突时走 Step 2 的 `question`。

### Crococopter 世界观

所有 Crococopter prompt 的风格基线：超写实、电影级现实主义、真实世界光照、35mm/50mm/85mm 焦段感。除非剧情明确要求多人，每个镜头一个角色。Gideon 的镜头偏好带环境的广取景——不要总是把他放中间。

Gideon（主角，pre-hitman 阶段）—— 完整锁定：

- Type: humanoid crocodile adult male, fysiek 20-25 jaar
- Hoofd: brede driehoekige krokodillenschedel, matte dark olive/near-black huid, diepe gele ogen met verticale pupillen, zichtbare scherpe tanden, scherpe wenkbrauw-ridge, stevig gespierde nek
- Lichaam: atletisch, gespierd reptiel-menselijk lichaam, donkere matte schubbenhuid, grote klauwhanden, brede borst
- Kleding (pre-hitman/urban functional): zwarte M65 field jacket (gedragen, matte finish), donkergrijs versleten katoenen T-shirt, zwarte tactische cargobroek met patch op knie, zwarte lederen gevechtslaarzen (stoffig), geen handschoenen, zwarte nylon schoudertas met versleten band
- Houding: licht voorovergebogen, schokkerige precieze bewegingen, hoge alertheid
- Trainingsscènes only: blauw trainingspak met witte strepen in plaats van bovenstaande outfit

Vittorio 'Il Rosso' Marcelli（反派）—— 完整锁定：

- Zeer donkerrode, verbrande huid (geen masker — herhalen: GEEN masker)
- Bordeaux driedelig Italiaans pak, scherpe trekken
- Eén zwarte lederen handschoen
- Houding: gecontroleerd, sussend, demonisch charismatisch

其他锁定角色（出场时用完整描述）：Nox de Waker（ex-militair conciërge）、Lucia Glass、Father Bricks（altijd driehoek-symbool, NOOIT kruis）、Slick Benny（tech sidekick）、Helia（jeugdliefde, flashbacks）。

锁定环境 —— 每次都要重复的锚点细节：

- KillCo achterkamer: donkere kamer, bureau, rode neonverlichting, oosterse tapijten op de vloer
- KillCo gang: industriële verweerde gang, natte vloer, zichtbare leidingen aan het plafond
- Junglebunker: elke kamer apart uitgewerkt met eigen detailset, helikoptertoegang via het dak, zware stevige poort, camera's overal
- Wapenbeurs (loods): alle standjes op vaste locaties, naburige standjes altijd subtiel zichtbaar voor continuïteit

### Swa & Danny 世界观

风格基线：佛拉芒荒诞冷面喜剧。默认画幅 9:16（社交媒体）。默认时长 5-10 秒。除非片段是反乌托邦/超现实，用自然主义的佛拉芒村庄或室内场景。

关键角色区分 —— 这地方以前搞错过：

- **Danny = de KALE man in de donkerrode Standard Liège trainingsjas/tracksuit**
- **Swa = de man met de matje (mullet), draagt dark teal Adidas trainingspak**

两人同框时：prompt 里要确认 Danny 是光头 + 红色 Standard Liège、Swa 是 mullet + 青色 Adidas。**不要**缩写这个区分。

其他常出角色：Jan Peeters（骑 Camino moped）、het Liegebeest（绿色毛绒木偶）、Eddy Wally In Space（市场小贩）、Puppet-fox、BUMO（小丑）、ROBOT-A、the Opel Kadett（Danny 永远开车、Swa 永远副驾）。

## 示例

### 例 1 —— Crococopter，锁定环境

用户："Maak een Kling 3.0 prompt waarin Gideon door de KillCo-gang loopt richting de achterkamer."

输出：

```
**Kling 3.0 prompt — Gideon enters KillCo hallway**

Subject: Humanoid crocodile male walking down an industrial hallway
SubjectDescription: Gideon, humanoid crocodile adult male, physically 20-25 years old, ultra photo-realistic. Broad triangular crocodile skull with matte dark olive near-black skin, deep yellow eyes with vertical pupils, visible sharp teeth, sharp brow ridge, muscular neck. Athletic muscular reptile-human body with dark matte scaled skin, large clawed hands, broad chest. Wearing a worn black M65 field jacket with matte finish, dark grey worn cotton T-shirt, black tactical cargo pants with a patch on the knee, dusty black leather combat boots, no gloves, black nylon shoulder bag with frayed strap. Slightly forward-leaning posture, tense and precise.
Movement: Gideon walks slowly down the hallway toward the camera, head turning left then right as he scans the corridor, right hand resting near the strap of his shoulder bag.
Scene: KillCo industrial hallway leading to the back room
SceneDescription: Industrial weathered hallway, exposed pipes and conduits running along the ceiling, wet concrete floor reflecting overhead lights, peeling paint on the walls, single flickering fluorescent fixture halfway down, heavy steel door visible at the far end with a faint red light leaking from underneath.
Camera: Medium-wide shot, slow dolly-in at chest height, 35mm lens
Lighting: Cool fluorescent overheads with one flickering source, hard shadows on the wet floor, faint warm red spill from the door at the end of the corridor, high contrast
Atmosphere: Tense, oppressive, claustrophobic industrial noir, faint steam drifting from the pipes
Negative: distorted faces, extra limbs, warped hands, low resolution, blurry, watermark, text overlay, cartoonish, plastic skin, cross symbols

Suggested settings:
- aspect_ratio: 16:9
- duration: 6 seconds
```

### 例 2 —— Swa & Danny，社交媒体短片

用户："Kling 3.0 prompt: Swa en Danny staan in de regen aan een bushokje, allebei chagrijnig."

输出：

```
**Kling 3.0 prompt — Swa & Danny bus stop in the rain**

Subject: Two Flemish men standing at a small village bus shelter in the rain
SubjectDescription: On the left, Danny — bald man, mid-40s, wearing a dark red Standard Liège tracksuit jacket zipped up, arms crossed, deadpan expression, slight scowl. On the right, Swa — same age, prominent mullet hairstyle, wearing a dark teal Adidas tracksuit top with three white stripes on the sleeves, hands shoved deep in pockets, equally deadpan, faint frown. Both stare straight ahead, motionless, naturalistic Flemish village look.
Movement: Both men stand still. Danny slowly blinks once. Swa exhales through his nose, breath barely visible. Neither turns. Rain runs down the shelter glass behind them.
Scene: Small Flemish village bus shelter on a grey afternoon
SceneDescription: Plexiglass-and-metal bus shelter on a quiet narrow street, wet asphalt, small puddles, a faded yellow De Lijn bus stop sign on the right, low brick houses with closed shutters visible in the background, bare branches of a roadside tree on the left, no other people, no traffic.
Camera: Locked medium two-shot, slight low angle, 50mm lens, no movement
Lighting: Overcast diffuse daylight, no direct sun, soft even shadows, slightly cool color temperature
Atmosphere: Damp, melancholic, absurd-comedy deadpan, faint mist, steady rain
Negative: distorted faces, extra limbs, warped hands, low resolution, blurry, watermark, text overlay, cartoonish, plastic skin, smiling expressions, exaggerated movement

Suggested settings:
- aspect_ratio: 9:16
- duration: 6 seconds
```

## 给助手的提醒

- 永远不要发明不在锁定规格里的角色细节。没锁定的，要么问用户，要么挑一个合理选项并标注出来。
- 用户要同一镜头的多个机位时，产出多条独立的 Kling 3.0 prompt——不要在一条 prompt 里编码多个机位（那不是 Kling 的领域）。
- 场景涉及 Crococopter 锁定环境时，同地点的所有 prompt 都逐字重复锚点细节，哪怕觉得啰嗦。这就是全部意义。

## Hub 适配说明

- 默认模式只写 prompt —— 返回结构化 9 字段文本，**不自动**触发付费生成。只有用户明确 greenlight 出片，才调 `hub_generate_video`（`vendor: kling`, `model: kling_3_0` 或用户指定的 Kling 版本）。
- 出片前先用 `question` 跟用户确认付费生成 + 目标分辨率（默认 720p 省 credit；只有最终渲染跑 1080p）。
- 提交时把 9 字段合并成一个 `prompt` 字符串，`aspect_ratio` 按 "Suggested settings" 段的值填，(唯一的)起始图通过 `medias` 里 `role: start_image` 传入。Kling 3.0 只接受一张参考图——挑最重要的那张，其他的作为视觉线索写进 SubjectDescription/SceneDescription。
- 出片成功的 `.mp4` 用 `hub_save_file_to_session`（`file_type: video`）注册回 session。
- 本 skill 的 Project Universes（Crococopter、Swa & Danny）是锁死的设定 —— 视为不可变。用户如果尝试临时改锁定项（例如 "让 Gideon 穿红色夹克"），先用 `question` 让用户确认冲突再动笔。
- 不要用本 skill 做 Seedance / Sora / MidJourney / 通用视频 prompt —— 都有各自的 skill。
