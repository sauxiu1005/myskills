# Director's Proposal Contract

> Governing workflow: read `production-workflow.md`. Speech language, subtitles and music require explicit pre-video approval; none is a default. Historical English/voice/music examples are conditional illustrations. Default video model: MiniMax H3. Character and shot-keyframe approvals precede video; clips require user review before final assembly. No unsolicited generated-media acceptance inspections or autonomous paid retries.
> 优先遵循 `production-workflow.md`：旁白语言、字幕和配乐在视频前明确确认，均无默认值。历史英文、音色和音乐内容仅作条件示例。默认视频模型为 MiniMax H3；角色和镜头关键帧先确认，片段审阅后再组装。不主动验收自有生成媒体或自行付费重试。


Use this contract for Phase A. Present a readable production proposal and stop for confirmation before writing model prompts. Refer to `references/style-catalog.md` for style specifications.


Style 5 (Cozy Storytelling / 治愈故事风) uses `cozy-storytelling.md`. In Phase A name a different recognizable main setting for each new ten-second segment by default, plus wide/close/moving shots inside it. Lock character design, important props and narration; scenery changes intentionally. Respect an explicit single-location request or approved callback. Do not call this style hand-drawn or require the same table/room across all segments.

## Rewrite the source

If narration is approved, write natural speech in the confirmed language at the approved pace. English may start around 20–25 words per ten seconds; Chinese needs its own timing and pauses. If speech is disabled, omit narration and voice-profile requirements.

- Preserve the source's core claim, names, numbers, and factual meaning.
- Strengthen a weak opening with an immediate hook.
- Remove repetition and secondary branches from long sources.
- Expand short sources with a relevant example, progression, reframe, or callback.
- Prefer clear spoken language in the approved language to literal translation.
- Simplify wording before increasing speaking speed.
- Do not invent research, statistics, quotations, product claims, or factual details.

Use the user's language for planning explanations. Use the confirmed narration language and add a reference translation only when needed.

## Header contract

Present these items in order:

1. Title in the approved work language, with a reference translation when needed
2. Core message and opening hook
3. Chosen aspect ratio (`16:9` or `9:16`), target duration (in 10s multiples), and visual style/theme (Style 1 Classic Light, Style 2 Classic Dark, Style 3 Modern Studio Tech, Style 4 Cinematic Story, Style 5 Cozy Storytelling)
4. Explicit narration yes/no and language choice; when enabled, narrator's complete video-level voice profile from `voice-continuity.md` (identity/age, accent, timbre, register, resonance, texture, delivery, pace and recording treatment), language-appropriate speech budget, and estimated duration
5. Palette in ordinary language: Style 1 accent limit, Style 2 dark polarity, Style 3 studio, Style 4 cinematic story, Style 5 location moods
6. Explicit subtitles yes/no, language and form; explicit music yes/no and, when enabled, its direction, instrumentation, motif, tempo, emotional arc and whether added in post or generated in clips
7. Cast cards, location/prop continuity and approved character references. Style 5: segment settings/cuts. List keyframes to approve before video.

When narration is explicitly enabled and its language confirmed, propose a source-appropriate female, male or other coherent voice profile for approval, not a mandatory universal baritone. Expand short preferences such as "male voice" into the complete fields in `voice-continuity.md`. Different videos may choose different voices, but one video's clips share its frozen profile. Separate the narrative emotional arc from stable vocal identity and delivery. Infer tone and palette from the source when the user did not specify them.

## Narrative patterns: High-Completion 5-Stage Heartbeat Engine

For suitable explanatory subjects, use this narrative progression without claiming a guaranteed completion rate. Adapt the ending to the approved story; do not force controversy or unsupported revelations:

1. **Stage 1: Golden Hook (黄金钩子)**
   - **Timing**: Flexible based on duration (in short 30s/60s videos, delivered rapidly within the first 2–5 seconds / `[0–3s]` of Clip 1; in 3–5min videos, establishes the premise across the first 5–15 seconds).
   - **Goal**: Ask an unexpected, counter-intuitive question or present a striking visual paradox that instantly creates an irresistible information gap. Never open with slow throat-clearing.
2. **Stage 2: Disrupting Assumptions (打破常识)**
   - **Goal**: Articulate the common belief or conventional wisdom that everyone assumes to be true, then shatter it in a single decisive sentence to create cognitive conflict and suspense.
3. **Stage 3: Unveiling Insider Secrets (拉出内幕)**
   - **Goal**: Pull back the curtain on a little-known technical mechanism, hidden friction, or systemic secret that keeps the audience captivated and curious.
4. **Stage 4: Ultimate Truth Revelation (真相揭秘)**
   - **Goal**: Deliver the underlying business logic, scientific mechanism, or human psychological truth with complete clarity. Give the audience the satisfying "aha!" breakthrough.
5. **Stage 5: Elevation & High-Engagement Discussion (升华互动)**
   - **Goal**: Crystallize the takeaway into a memorable punchline, and finish with a provocative, open-ended discussion question that compels viewers to take sides and debate in the comments.

### Dynamic Clip Allocation by Duration ($N = \text{duration} / 10$)

- **30s (3 clips)**:
  - Clip 1: Lightning hook (0–3s) → Establish conflict
  - Clip 2: Unveil hidden reality & mechanics
  - Clip 3: Ultimate truth + Comment-debate prompt
- **60s (6 clips, default)**:
  - Clip 1: Golden Hook (counter-intuitive question) → Premise
  - Clip 2: Disrupt Assumptions (shatter conventional wisdom)
  - Clip 3: Unveil Insider Secrets (hidden friction)
  - Clips 4–5: Mechanism & Ultimate Truth (cognitive satisfaction)
  - Clip 6: Elevation punchline + Irresistible comment question
- **90s (9 clips)**:
  - Clip 1: Golden Hook
  - Clips 2–3: Disrupt Assumptions
  - Clips 4–6: Unveil Insider Secrets
  - Clips 7–8: Ultimate Truth Revelation
  - Clip 9: Elevation & Comment Discussion
- **180s+ (3–5 min)**:
  - Hook (Clip 1) → Assumptions (15–20%) → Insider Secrets (35–40%) → Ultimate Truth (30–35%) → Elevation & Discussion (final 1–2 clips)

## Storyboard contract

Produce exactly N approximately ten-second rows (where N = target duration in seconds / 10; default: 6 rows for 60s):

| Time | Narrative purpose | Stick-figure scene | Motion, camera, and transition | Approved-language VO / no narration | Reference translation | BGM / SFX |
|---|---|---|---|---|---|---|

Give each row a different narrative job aligned with the 5-stage engine. When narration is enabled, fit the approved language, pace and reaction pauses to the row; English 20–25 words is only a starting estimate. No speech means no spoken text.

## Visual-density recipe

Build every row from three sequential beats:

- `0–3s`: establish or inherit the visual premise.
- `3–7s`: transform, escalate, or explain the metaphor through physical character actions.
- `7–10s`: deliver a climax and create the next transition.

Use at least four relevant devices per row:

- expressive stick-figure action (running, jumping, touching glass, drawing lines)
- environmental transformation
- concrete visual metaphor
- diagram, arrow, or icon-only symbol
- particles, energy, fluid, explosion, or light
- camera push, pull, pan, orbit, shake, or tracking move
- foreground wipe or object crossing the lens
- match cut, shape morph, or motion-matched transition
- interaction with another figure or oversized object

Require a perceptible visual change every two to three seconds. Make every effect clarify or intensify the spoken idea; omit unrelated spectacle. Avoid abstract liquid morphing.

## Palette and text

Keep the background and stick figure monochrome according to the selected theme (for Style 1), or the dark polarity of Style 2; use high-key studio/cinematic settings for Styles 3/4; Style 5 follow their own palette rules. For Style 1, use no more than three saturated accent colors across the video. Assign semantic meaning such as anxiety, danger, energy, discovery, or success.

Name colors only with ordinary descriptive language. Do not use hexadecimal, RGB, HSL, Pantone, or other technical color notation anywhere in the proposal or production prompts.

Default the generated video to no visible words, letters, numbers, captions, subtitles, interface copy, or technical annotations. Make message bubbles, content cards, meters, clocks, and notifications icon-only. After the storyboard, optionally list concise short overlays in the approved language for post-production, including their target clips and safe placement; never carry those overlays into the video-generation prompts.

## Composition by aspect ratio

- `16:9`: use left-center-right staging, lateral tracking, horizontal match cuts, and deliberate negative space. Reserve clean space for optional post-production overlays when useful.
- `9:16`: use foreground/background depth, vertical reveals, stacked motion, foreground passes, and interface-safe overlay space.

Changing ratio requires new staging, camera paths, transition geometry, and overlay-safe negative space. Changing theme or style requires updated color balance and contrast checks.

## Continuity

End each row with a visible interface that the next row inherits: a pose, moving object, filled frame, travel direction, shape, or camera motion. Name both sides of every connection in the proposal. For Style 5, an approved location cut or time jump may replace literal background matching: state what continues (character, prop, direction or story action) and what changes (place/time). Do not spend all N clips at the same desk unless explicitly requested.

## Confirmation ending

End Phase A by asking the user to:

- approve the current proposal and proceed to character and keyframe confirmation (not directly to video generation);
- revise a named scene or narration passage; or
- change a global setting such as aspect ratio, duration, style, theme, palette, voice, or tone.

Do not include final model prompts. A global change invalidates approval and requires a revised Phase A.

## Phase A checks

- Source, aspect ratio (`16:9` or `9:16`), duration, and style/theme are known.
- Narrative structure fits the approved intent and any style-specific override.
- Ending supports the central takeaway; no forced controversy.
- Narration yes/no and language, subtitles yes/no/language/form, and music yes/no/direction are explicitly confirmed; enabled speech fits duration.
- Exactly N storyboard rows have distinct narrative purposes (N = duration / 10).
- Every row has three beats, at least four visual devices, audio, and a transition.
- Visual change occurs approximately every two to three seconds.
- No more than three saturated accent colors are used (for Style 1), or the palette rules of the selected Style 2–5 are followed.
- No technical color notation is present.
- Any proposed text is clearly separated as a post-production overlay and absent from generated scenes.
- Every adjacent pair has a named continuity connection.
- The ending returns to the central message and CTA.
- No unsupported factual detail was added.
- If narration is enabled, one complete approved voice profile is used for the whole video, independent of visual style; scene-specific audio notes do not contradict it. Any approved multiple speakers have separate stable profiles and explicit line assignments.
