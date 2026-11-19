# MiniMax H3 Production Prompt Contract

> Governing workflow: read `production-workflow.md`. Speech language, subtitles and music require explicit pre-video approval; none is a default. Historical English/voice/music examples are conditional illustrations. Default video model: MiniMax H3. Character and shot-keyframe approvals precede video; clips require user review before final assembly. No unsolicited generated-media acceptance inspections or autonomous paid retries.
> 优先遵循 `production-workflow.md`：旁白语言、字幕和配乐在视频前明确确认，均无默认值。历史英文、音色和音乐内容仅作条件示例。默认视频模型为 MiniMax H3；角色和镜头关键帧先确认，片段审阅后再组装。不主动验收自有生成媒体或自行付费重试。


Use this contract only after approval of the current proposal, character references, shot keyframes and narration/subtitle/music decisions. Default video model: MiniMax H3. Read current model capabilities rather than assuming fixed technical settings. Refer to `references/style-catalog.md` for full style specifications and prompt blueprints. Apply `voice-continuity.md` to every style; visual-style overrides never replace its complete video-level voice profile.


Style 5 (Cozy Storytelling / 治愈故事风): read `cozy-storytelling.md`. Repeat full character and voice anchors, but give each segment its approved new setting. Describe each scene opening as a recognizable new location, then connect action/prop/screen direction or a named time cut. Do not repeat one global room layout, inherit Style 1's no-face/filled-body bans, or require hand-drawn/paper aesthetics. Keep movable-object appearance separate from initial positions and timed state changes.

## Production package order

Deliver these sections in order:

1. Global continuity block
2. N standalone production prompts with approved-language speech or no speech (where N = target duration / 10; default 6 clips for 60s)
3. Stitching guide
4. Voice and music continuity note

## Global continuity block

State the chosen aspect ratio (`16:9` or `9:16`), target duration, selected visual style (Style 1 Classic Light, Style 2 Classic Dark, Style 3 Studio Tech, Style 4 Cinematic Story, Style 5 Cozy Storytelling), character anchor design, palette or environment definition, narrator identity, audio arc, and continuity strategy. Treat this block as a review summary; each prompt still repeats all critical locks.

## Standalone prompt order

Write every prompt in this order:

1. Output specification: approximately ten seconds, chosen aspect ratio (`16:9` or `9:16`), approved resolution/frame rate when supported; audio according to approved narration/music/SFX choices
2. Environment and background definition:
   - For Style 1 Light: flat, uniform, digitally pure-white canvas with no shading or 3D depth
   - For Style 2 Dark: flat, uniform, pitch-black canvas with pure white line art
   - For Style 3 (Studio Tech): modern bright white studio space with subtle light-gray perspective grid lines on the floor plane, high-key lighting, clean white negative space, sleek glowing cyan/blue glass elements
   - For Style 4 (Cinematic Story): rich full-color cinematic environment with volumetric lighting and depth of field
   - For Style 5 (Cozy Storytelling): full-color 2D cartoon environment and a segment-specific setting, with varied wide/close/moving shots; new segment means an intentional scene change unless otherwise approved
3. Character lock:
   - For Style 1: repeat the concise frozen character anchor from `style-catalog.md`, including the chosen polarity and expression setting; no "same character" shortcuts, numeric anatomy recipes, skeleton/rig definitions or pen paths. Keep Style 1's head solid black and faceless; use the separate filled white expressive anchor for Style 2, proportions and line weight stable, and only the current pose of each of the two arms and two legs. A raised arm replaces its old lowered line. Keep accents on props/graphics, never recolor the figure. Do not let action or camera wording redefine the drawing; preserve rich motion and effects separately.
   - For Style 3 or Style 4: repeat the same complete shared pale-lavender character anchor and approved character image from `style-catalog.md`. Both use pale lavender long sleeves, no hat/hair/backpack/straps, small white hands, thin black legs and chunky black boots. Their only visual-style difference is environment/background. Never revert either to historical red-hat/yellow-shirt demos, shorten the anchor or redesign the character.
   - For Style 5: repeat its full frozen character anchor from `cozy-storytelling.md`, including white head/torso fill, dark limbs and simple facial marks. Location and expression changes do not redesign the character.
4. Palette and accent roles (expressed only with ordinary color names, no hex or technical codes)
5. Composition strategy for the chosen ratio (`16:9` or `9:16`)
6. Opening state connected to the prior ending or named scene/time cut; keyframes can depict intermediate beats
7. `[0–3s]`, `[3–7s]`, and `[7–10s]` visual beats tied to spoken ideas
8. If narration is approved, exact audio-only lines in the confirmed language; otherwise no speech. No speech bubbles/dialogue boxes
9. Only when narration is enabled: complete frozen voice block specifying the approved spoken language from `voice-continuity.md`, verbatim in every clip: identity/age, accent, timbre, register, resonance, texture, delivery, pace and recording treatment; no "same narrator" shortcuts or clip-specific recasting
10. Approved audio plan: no music if disabled or planned for post; approved native music only if explicitly chosen. Preserve approved SFX and voice-first mixing
11. Final-frame transition state inherited by the next clip
12. Negative constraints (including style-specific clutter/deformation bans)

Make each prompt self-contained and usable without any external context.

When generation is authorized and the tool accepts image references, attach the approved shot keyframe and character reference sheet to every relevant clip, naming their distinct purposes, and add one sentence to the character lock stating that the reference image locks the character's appearance, line weight and proportions. Keep the full text anchor as well. Do not attach earlier generated clips as references unless the user asks for continuation.

## Style language

Use this wording to request density without character drift:

> rapid scene changes, kinetic motion-graphic transformations, and frequent visual events, while preserving an identical stick-figure design, constant line weight, and strict temporal consistency

Avoid `rapid style changes`, which can invite model changes to drawing style, line weight, or character design.

## Timed visual sequence & motion dynamics

Translate the approved storyboard row into three connected physical events:

- `[0–3s]`: establish or inherit the visual premise.
- `[3–7s]`: transform, escalate, or explain the metaphor through character action.
- `[7–10s]`: deliver a climax and create the next transition.

### Anti-Stutter & Anti-Lag Guidelines:
- Do not use abstract liquid or object shape morphing (e.g., stairs melting into a clock), as these cause diffusion latent jitter and frame drops.
- Drive motion with concrete character actions (leaping, touching glass, drawing luminous lines, opening heavy doors).
- Ensure continuous character engagement; never leave the character standing idle or staring at the camera for multiple seconds.

## Dialogue and visual text

Only when narration is enabled, quote the approved-language VO exactly once as audio-only dialogue. When disabled, request no speech and omit narrator instructions:
```text
Audio voiceover only, strictly no speech bubbles, no dialogue boxes.
```
Instruct the model not to add, omit, paraphrase, repeat, reorder, caption, subtitle, or visually transcribe words.

Default every generated clip to no visible words, letters, numbers, captions, subtitles, interface copy, palette labels, production annotations, logos, or watermarks. Require icon-only message bubbles, content cards, clocks, meters, and notifications. Put optional approved phrases in a separate post-production overlay list outside the prompts.

## Palette notation

Use ordinary descriptive color names such as vivid red, electric blue, or warm gold. Never put hexadecimal, RGB, HSL, Pantone, or other technical color notation in a generation prompt. Models may reproduce prominent notation literally as unwanted interface text.

## Audio continuity contract

Use `voice-continuity.md` for all five styles only when narration is approved. Freeze the full profile per video or speaker, including language, and repeat it verbatim. No default narrator or character dialogue. Repetition is not a guarantee of exact voice matching.

BGM has no default: if disabled, request no music; if post-production music is approved, request score-free clips retaining voice/SFX. Only for explicitly approved native music, repeat the approved instrumentation, tempo, motif and arc without promising identical independent scores. No default piano or BPM. Never stack existing and new music without the approved decision. Follow `production-workflow.md`.

## Negative contract

Forbid:

- photorealism and unwanted 3D humanoid rendering
- facial features (pupils, realistic eyes, lips) or hair unless approved
- extra limbs, malformed anatomy, disconnected lines, or changed proportions
- broken or changing line weight
- **For Style 1**: preserve its approved solid black faceless head, thin limbs and proportions; no extra limbs or retained poses. Do not impose its drawing on Style 2. Present generated footage for user review; no unsolicited self-inspection.
- inverted theme polarity or unexplained colors
- unintended characters or irrelevant spectacle
- visible words, letters, numbers, technical color notation, palette labels, interface copy, captions, subtitles, logos, or watermarks
- altered, omitted, repeated, reordered, or added dialogue
- speech bubbles, comic dialog balloons, or visual text boxes
- **For Style 3 specifically**: `strictly minimalist studio aesthetic, no circuit board textures, no sci-fi wall panels, no spaceship corridors, no cracked concrete, no grunge textures`
- **For Style 4 specifically**: `no photorealistic human skin, no 3D humanoid CGI models, no chaotic line glitches`

## Stitching guide

List all N clips in order. For every cut, repeat the ending state and its continuing action/prop/direction, or state the approved location/time change. Style 5 changes scenery intentionally rather than requiring identical backgrounds. Include any trim, short audio crossfade, or match-cut note needed for assembly; use actual durations for assembly and present the joins for user review; requested wipe timing is not guaranteed.

## Audio continuity note

Start with prompt-level consistency, rather than immediately routing voice drift to external dubbing:

1. Before execution, check authored prompts for complete non-conflicting profiles and exact approved-language lines.
2. Present clips for user review. For reported drift, propose a targeted correction and get approval before paid retests. Do not conduct unsolicited output-quality analysis.
3. Supported audio references or one continuous external narration track in the approved language are optional further controls requiring approval. Do not claim an unused reference was supplied.
4. Follow the approved subtitle/music plan and report ASR or audio-separation limitations.

## Phase B checks

- Current proposal, characters, keyframes and explicit narration/language, subtitles/language/form and music/direction decisions are approved before video.
- Exactly N standalone prompts are present (matching approved Phase A duration).
- Each prompt repeats ratio (`16:9` or `9:16`), style/theme, character, palette, voice, audio, transition, and negative locks.
- Style 1 prompts repeat one identical full character block and contain no contradictory appearance instructions. Simple-expression allowance agrees with the negative constraints. Generated consistency is checked separately from prompt compliance.
- Each prompt has all three timed beats and at least four relevant visual devices.
- Every ending connects to the next opening through a planned action/prop/direction or an approved location/time cut. Style 5 does not repeat one room unless requested.
- Dialogue exactly matches the approved narration.
- Dialogue is explicitly audio-only and is never displayed visually.
- Standalone prompts contain no hexadecimal, RGB, HSL, Pantone, or other technical color notation.
- Every style repeats its approved full character anchor and actual references, without borrowing another style's costume. Audio instructions follow explicit choices.
- If generation uses image references, every clip with a recurring character carries the same approved reference sheet.
- When narration is enabled, all styles repeat an identical complete voice block per video (or per approved recurring speaker); no unresolved profile fields, abbreviated voice references or contradictory per-scene vocal directions remain. Actual audio acceptance is recorded separately from prompt compliance.
- Generated scenes contain no visible writing; optional overlay phrases are listed separately for post-production.
