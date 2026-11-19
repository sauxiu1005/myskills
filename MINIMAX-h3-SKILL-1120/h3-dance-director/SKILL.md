---
name: h3-dance-director
description: Dedicated TikTok, K-Pop, street hip-hop, suit shuffle, ancient flowing-sleeve fusion, and ACG rhythm dance prompt director and dataset captioner for MiniMax H3. Synthesizes 3-phase beat-chain choreography (hit-stop freezes, asymmetric hand framing, chest-pop and abdominal body waves, high knee-hop kicks, wide lunging slides, and acrobatic cartwheel finishers), audio-visual BPM/bass/snare synchronization, and multi-segment split-clip continuation (0.00s mid-groove entry and in-motion exit) across all 5 H3 formats (T2VA, I2VA, FL2VA, L2VA, and 6-section Ref2VA). Use whenever the user asks to write dance video prompts, choreograph TikTok/K-Pop/cosplay dances for H3, or caption dance video datasets.
---
# MiniMax H3 Dance Director (TikTok Beat-Sync x K-Pop Groove x Multi-Segment Continuation)

Act as a master commercial dance choreographer, K-Pop performance director, music-video rhythm analyst, and MiniMax H3 prompt compiler. Convert user dance concepts, character references, music tracks, or multi-part video segments into high-precision, audio-visual synchronized H3 prompts with **crisp hit-stop freezes, clean hand and finger geometry, distinct torso-and-hip isolations, rooted footwork, and seamless multi-segment continuity**.

## When to Use

- The user wants to generate a TikTok rhythm dance, K-Pop street dance, hip-hop isolation routine, suit footwork shuffle, ancient flowing-sleeve rhythm fusion, or ACG/cosplay bouncy dance prompt for MiniMax H3.
- The user provides character reference images (`@图片1`/`<Picture 1>`), scene references (`<Picture 2>`), dance motion reference videos (`<Video 1>`), or music audio references (`<Audio 1>`) and needs automatic routing to **T2VA**, **I2VA**, **FL2VA**, **L2VA**, or **6-section Ref2VA**.
- The user wants a **long dance split into multiple segments** (e.g., a 15s to 45s dance split into 6s-11s clips where Segment 2+ must start directly from a mid-groove pose at `0.00s` with zero static pause).
- The user uploads dance video clips (`.mp4` / `.zip`) and wants standardized, audio-visual synchronized H3 `.txt` training captions.

## Step 1: Detect H3 Input Mode and Select the Official Envelope

Inspect the user's request and reference assets to select the exact H3 format (see `references/h3-dance-modes-and-split-clip-templates.md` for complete templates):

1. **T2VA (Text-to-Video+Audio, no reference assets)**:
   - Output `integrated_multimodal_description:`, `overall_soundscape:`, and `non_diegetic_music:`.
2. **I2VA (First-Frame Image-to-Video+Audio, 1 opening frame or tail-frame continuation)**:
   - First line MUST be:
     `For the target video, at 0.00 seconds into the target video, <Picture 1> (from [Shot 1]) is fully referenced.`

   - Follow with a blank line and the three core fields. Anchor `<Picture 1>`'s exact 0.00s posture (whether a poised starting stance or a mid-groove continuation pose) at the start of `[Shot 1]`.
3. **FL2VA (First-and-Last-Frame Video+Audio, 2 keyframes)**:
   - First line MUST be:
     `How the reference pictures align with the target video - Picture 1 (from Shot 1) aligns with the 0.00-second mark of the target video; Picture 2 (from Shot N) aligns with the S.SS-second mark of the target video.`

4. **L2VA (Last-Frame Video+Audio, 1 ending pose frame)**:
   - First line MUST be:
     `How the reference pictures align with the target video - <Picture 1> (from [Shot N]) aligns with the S.SS-second mark of the target video.`

5. **Ref2VA (Full Multi-Reference Mode - Character Image + Dance Structure Video + Music Audio)**:
   - Output the **6-section H3 Ref2VA structure** in exact order:
     `subject_definitions:` -> `summary:` -> `retention_analysis:` -> `detailed_description:` -> `overall_soundscape:` -> `non_diegetic_music:`.

   - When a motion reference video `<Video 1>` or music track `<Audio 1>` is provided, declare `<Video 1>` as the structural choreography reference (`partially_preserved` or `fully_preserved` for motion trajectory) and `<Audio 1>` as `reference` for beat and BPM alignment.

## Step 2: Select the Dance Archetype (8 Core Choreography Modes from the 104-Clip Corpus)

Route the routine to one of the 8 proven dance archetypes derived from the 104-clip H3 dance corpus (`D1.zip`–`D5.zip` + `6.zip`, or blend them as requested):

1. **Archetype A: Hard-Hitting K-Pop & Hip-Hop Street Power (力量型街舞/K-Pop大框架卡点 - `Clips 16, 63–65, 95–97, 102`, ~90-105 BPM)**:
   - **Signature Moves**: Touching cap brim at start -> stepping into a wide lunging stance while whipping one arm high on a sharp diagonal -> springing into a single-leg high-knee hop (`right/left knee lifted high`) with forearms crossed tightly in front of the chest -> dropping into a wide low horse stance (`马步`) with horizontal forearm locks and chest-pop isolations -> finishing with a 90-degree pivot into a clean side-profile freeze.
   - **Wardrobe Physics**: Oversized graphic T-shirts and wide-leg track/cargo/sweatpants that carry visible secondary fabric inertia on every whip and lunge.
2. **Archetype B: Explosive 808 Sub-Bass Midriff Wave & Low-Lunge Slide (重低音腹波与低蹲大滑步 - `Clips 28–30, 68–70, 98–99`, ~95-115 BPM)**:
   - **Signature Moves**: Deep top-to-bottom torso and abdominal body waves (`abdominal body rolls`) -> snapping both elbows wide on the 808 bass drop for a crisp chest-pop freeze -> dropping into a wide low crouch while sweeping one arm straight out -> rebounding into an explosive high knee-hop kick -> lunging low to one side while extending the opposite leg in a wide sliding stride with a diagonal counterbalance arm.
3. **Archetype C: Slick R&B / Hip-Hop Pocket Groove & S-Curve Isolation (酷飒松弛律动与S型肩胯分离 - `Clips 6–7, 14–15, 19, 46–47, 86–87, 90, 100–101`, ~105-125 BPM)**:
   - **Signature Moves**: Wide stance with one elbow raised overhead and the other hand at the hip -> smooth left-right weight transfers with subtle shoulder rolls and S-curve ribcage slides -> pivoting 90 degrees into side profile to kick the lead heel out while swinging the arms in a relaxed pocket groove -> framing both hands behind the head/neck with flared elbows -> cross-legged hop turn.
4. **Archetype D: Bouncy ACG / Cosplay / JK Sweet Hand-Framing & Skirt-Sway (甜酷二次元/JK手势摆胯弹跳舞 - `Clips 1–5, 8–11, 22–27, 31–38, 41–45, 50–52, 66–67, 82–85, 88–89, 103–104`, ~120-156 BPM)**:
   - **Signature Moves**: Clasping or framing hands at the chest and cheeks with playful head tilts -> symmetrical open-palm wrist waves beside the waist paired with continuous left-and-right hip sways that make pleated skirts or twin-tails flutter -> alternating one-legged hop kicks with wrist flicks -> 360-degree skirt-flaring spin or a joyful mid-air two-foot vertical jump with one arm raised overhead and both knees slightly tucked in the air.
5. **Archetype E: Male Suit Shuffle, Footwork & Colonnade Groove (西装滑步与纵深柱廊律动 - `Clips 71–78`, ~115-152 BPM)**:
   - **Signature Moves**: Crisp heel-toe footwork glides and cross-step shuffles along a receding architectural colonnade -> relaxed single-hand lapel/tie touches and pocket-groove knee bounces -> sharp two-hand pointing accents toward the lens -> 90-degree side pivots with heel kicks and suit-jacket hemline inertia.
6. **Archetype F: Xianxia / Ancient Flowing-Sleeve Rhythm Fusion (古风仙侠水袖卡点融合舞 - `Clip 53`, ~156 BPM / 78 BPM Half-Time)**:
   - **Signature Moves**: Classical wide-sleeve (*shuixiu*) circular sweeps fused with modern pop beat-drops -> whipping long translucent sleeves in wide overhead arcs -> crisp waist twists and wrist flicks on snare transients -> ethereal final pose as multi-layered silk sleeves trail with aerodynamic delay.
7. **Archetype G: K-Pop Synchronized Ensemble & Camera Push-In Finale (女团队形齐舞与推镜C位收尾 - `Clips 12–13`, ~99-105 BPM)**:
   - **Signature Moves**: Five-dancer V-formation executing synchronized chest pops, unison arm whips, and formation knee bounces -> smooth camera dolly push-in during Part 2 toward the center lead dancer in a leather jacket and knee-high boots for a charismatic close-medium body-wave and hair-framing finale.
8. **Archetype H: Underground Garage Power Squat, Tuck-Jump & Lateral Cartwheel Finisher (地下车库力量深蹲收腹跳与教室侧手翻终结技 - `Clips 39–40, 48–49, 79–81, 91–92`, ~105-152 BPM)**:
   - **Signature Moves**: Wide-stance street hip-hop bounces under industrial garage or mirrored studio lights -> dropping into a deep low squat on the bass drop and rebounding into an explosive two-foot vertical tuck jump (`39–40`) or driving laterally across the floor into a full two-hand acrobatic cartwheel with legs fully extended in mid-air before locking into a clean landing pose (`48–49`).

## Step 3: Enforce the 3-Phase Beat Chain & Biomechanical Anti-Melting Locks

To prevent H3 from drifting into mushy "jellyfish swaying" or melting fingers after 3 seconds, structure every 6-to-12 second prompt as a **3-Phase Beat Chain** with explicit biomechanical locks:

1. **Phase 1 (0.0s - 3.0s | Opening Entry & First Hit-Stop)**:
   - Establish the exact framing (`vertical 9:16 medium-full shot` or `full-body shot`), lighting, and 0.00s posture, followed by the opening 1-2 beat arm whip and the first **0.2-second muscular hit-stop freeze (`locks into a crisp hit-stop freeze precisely on the snare/bass hit`)**.
2. **Phase 2 (3.0s - 6.5s | Asymmetric Hand Framing & Torso-Hip Isolation)**:
   - **Anti-Prayer-Hands Rule**: Never write vague phrases like `moves hands around` or `dances happily`. Specify asymmetric left/right arm geometry (`whips her left arm high on a diagonal while her right hand frames her waist`, `crosses her wrists cleanly in front of her collarbone`, `opens both palms beside her waist in symmetrical wrist waves`) with `crisp finger articulation`.
   - **Axis Isolation**: Explicitly state which body part stays anchored while another isolates (`keeping her head centered on the vertical axis while executing two sharp chest-pop isolations and a right hip hit`).
3. **Phase 3 (6.5s - 10.0s+ | High-Energy Climax & Ending State Clause)**:
   - Culminate in the highest-energy move (an explosive high-knee hop kick, a wide low sliding lunge, a celebratory mid-air jump, or a lateral cartwheel) and resolve into the exact **Ending State**:
     - *For a standalone or final segment*: `locks into a clean side-profile / front-facing ending pose on the final snare hit with her gaze locked on the lens.`
     - *For a split-clip Part 1 or middle segment*: `maintaining continuous rhythmic momentum as she transitions into a [specific mid-groove pose] at the end of the clip.`

## Step 4: Multi-Segment Split-Clip Continuation Protocol (分段裁剪无缝续接法则)

When captioning or generating a longer dance (15s to 45s) split into multiple clips (`Part 1` to `Part 8`):

1. **Zero Cross-Clip Meta-Language**: Every segment prompt must be 100% self-contained. Never write `continuing from the previous clip`.
2. **Part 1 (In-Motion Exit)**: End Part 1's description on the exact transitional pose at the cut point without inventing a fake ending freeze.
3. **Part 2+ (0.00s Mid-Groove Entry)**: Open Part 2's `[Shot 1]` by explicitly locking the dancer's **active mid-groove posture at 0.00 seconds** (e.g., `opens directly mid-groove at 0.00 seconds with her right knee lifted high and her wrists crossed in front of her chest, immediately catching the downbeat to...`), and start `non_diegetic_music:` with `Entering directly in the active groove / chorus of a [BPM] [genre] track...`. This eliminates the 0.5-second static reset freeze between segments.

## Step 5: Audio-Visual Beat Synchronization (`overall_soundscape` & `non_diegetic_music`)

Never leave `overall_soundscape` or `non_diegetic_music` as `None` when training or generating audio-visual dance clips:

- **`overall_soundscape`**: Specify `The audio is driven by a clean, direct music track tightly synchronized to every on-screen hit-stop freeze, chest pop, hip isolation, and footwork step, with no false impact sounds.`
- **`non_diegetic_music`**: Always specify the **exact BPM range, half-time/full-time feel, bass character (`deep 808 sub-bass drops` vs `warm rounded bassline`), percussion transients (`crisp snare cracks on beats 2 and 4`), and vocal/synth hooks** that lock to the visual hit-stops.

## Gotchas

- **Decouple Post-Production Overlays & Transitions in Training Captions**: If a training clip contains a face emoji sticker (`11月3日-3.mp4`) or a whip-pan transition blur at 0.00s (`11月3日-85.mp4`), explicitly name it in natural language so the LoRA isolates it from clean dance generation.
- **Never omit costume silhouette geometry**: Always mention whether the dancer wears `wide-leg track/cargo pants`, `a tailored suit`, `flowing xianxia sleeves`, or `a pleated mini-skirt with twin-tails`, because H3 uses garment silhouette physics to amplify hip hits, knee hops, and airborne jumps.
- **Never allow slow-motion drift**: Always include `without slow motion` at the end of `integrated_multimodal_description` / `detailed_description` so H3 preserves crisp real-time beat snapping.
