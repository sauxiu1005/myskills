# Swiss Motion Style Bible — 瑞士动态排版风格手册

Loaded on demand from STEP 2–6. Shared by SKILL.md and SKILL.cn.md. Paste the sections a step needs into the coding brief verbatim: the coding sub-agent cannot open this file.

Source: adapted from the "Swiss Motion Graphics" style prompt and demo notes of the open-source lemo-opuscar project by Lemomo / LemoLab (github.com/lemomo-ai/lemo-opuscar, code and docs under MIT). Use it as grammar only. Films made with this Skill belong to the user and carry no LemoLab credit, and never copy the LemoLab demo (*Five Rules for a Poster*): its story, shots, props or timings.

## 0. Essence, and what it is not
- International Typographic Style in motion: a modular grid, one typeface family, one signal colour, and movement as exact as a printing press.
- Grammar references: 1950s–70s Zurich posters (Müller-Brockmann, Hofmann, Gerstner, Crouwel) for grid, flush-left type, scale contrast and "designing programmes"; modern identity systems in motion (Experimental Jetset, Pentagram) for snaps on the beat.
- **Every element snaps to the grid, every move lands on a beat, nothing bounces.**
- **Rigor with one exception**: the whole frame obeys a system, so the one element that doesn't becomes a character.
- **Extreme scale contrast**: a giant numeral next to tiny technical notes.
- Not a keynote (no gradients, glow, device renders); not lyric kinetic typography (words don't fly, spin or bounce); not data visualisation (bars have mass as graphic form unless the grid gives them a meaning); not a Bauhaus pastiche of primary shapes.
- Never copy a specific historical poster composition (no concentric-circle or fan layouts lifted from Müller-Brockmann). Never use Helvetica or Akzidenz font files. Never name a real institution on an invented poster; real brands appear only with the user's own assets and facts.

## 1. Frame & grid presets (all 24 fps)
| Ratio | Canvas | Frame grid | Spread logic |
|---|---|---|---|
| 16:9 (default) | 1920×1080 | 12 columns, 96 px side margins, 24 px gutters (≈122 px columns), 24 px baseline | left page cols 1–6 = programme (numeral, rule text, notes); right page cols 8–12 = artifact |
| 1:1 | 1080×1080 | 8 columns, 64 px margins, 20 px gutters, 20 px baseline | programme in the top band, artifact below or cols 4–8 |
| 9:16 | 1080×1920 | 6 columns, 64 px sides, 160 px top/bottom (platform UI), 20 px gutters, 24 px baseline | stacked spread: programme on top half, artifact on bottom half; pans run vertically |
- **Artifact grid** is derived from the content (Gerstner): what columns and rows *mean* is a design decision. Choose module sizes that give elements mass. Too many thin columns make the layout look like a chart: use fewer, wider modules for the artifact and keep the standard frame grid for the page.
- Artifact proportion: a poster near the Swiss world format (≈0.70 width/height), a spec sheet, a timetable, a stamp sheet, a screen — whatever the topic's artifact is.

## 2. Materials & rendering
- Surfaces only: page, paper, ink, one signal colour, grid lines in two or three light greys (on page, while building, on paper). No gradients, shadows, particles, grain or glow.
- Bars and blocks are flat rectangles. Consecutive cells of one unit merge into one bar, overdrawn 1 px at seams (antialiasing shows hairlines, especially when rotated or scaled).
- A **secondary voice** can be light-grey elements under the black ones: depth without a second colour.
- One **2D camera matrix** (centre, scale, rotation) drives every move.
- Every frame is a pure function of time; fixed seeds only; deterministic render.

## 3. Colour logic
- Paper, ink, greys and **one** signal colour. Only one thing carries the signal colour, which makes it the protagonist and the only thing allowed to be inexact.
- Overprint allowed: black type on the signal colour.
- Signal colour can be red, orange, ultramarine or green; choose it for the topic (or the user's brand colour), then never add a second.
- Palette examples: `#EAE9E5` page / `#FFFFFF` paper / `#111111` ink / signal `#E30613`, grid `#CFCEC9` on page, `#C9C8C2` while building, `#E2E1DC` on paper; or `#F2F0EA` / `#141414` / signal `#FF5A00`; or `#E9ECEF` / `#0B0B0B` / signal `#1F3FFF`.
- A user's brand colour that is pale or low-chroma does not work as a signal: say so and propose using it as the page tint while picking a saturated signal.

## 4. Type & subtitles
- **One family for the whole film**, an OFL neo-grotesque with several weights (Archivo, Inter, Schibsted Grotesk, Instrument Sans…). Chinese / Japanese / Korean text uses one OFL CJK sans (Noto Sans SC/TC/JP/KR or Source Han Sans) matched in weight to the Latin family; no second display face.
- Letter-spacing ≈ −2 % at ≥ 90 px for Latin; CJK at 0 to −1 %. Latin headlines may be lowercase. Load every weight before the first frame is drawn, and measure text only after the font and letter-spacing are set.
- **Flush left, ragged right**; everything on a grid line; large white space is part of the layout. Giant numerals are **optically** flush left (subtract the glyph's left bearing).
- Typical scale: chapter numeral ≈ 980 px font size (≈700 px figure height) bottom-aligned with the artifact; headline 120 px Bold; statement 76 px Bold; lead-in 30 px Medium grey; notes 19 px Medium with a 1 px rule above.
- **Subtitles are part of the layout**, never a bar at the bottom: each line sits at a column start of the current composition (a small grey lead-in + a large bold statement, or a museum-label caption under an artifact). Each word (CJK: each word or short phrase, never mid-word) clip-reveals on its spoken timestamp. Hold ≥ max(1.8 s, speech + 0.6 s) and check it in code.
- **Caption rows**: small notes with a 1 px rule above; technical notes in a corner (module sizes, counts, a bar counter like `bar 04.3`).
- Chinese copy: correct full-width punctuation, no orphan punctuation at line start, natural phrasing; don't translate rule sentences word for word.

## 5. Motion quality
- **Two curves only**: precise ease `cubic-bezier(.7,0,.2,1)` for snaps; linear for lines being drawn, playheads and the exception. No overshoot, spring or bounce.
- **Durations are note values** at the film's tempo (120 BPM at 24 fps: 1 beat = 0.5 s = 12 frames, 1/8 = 6 frames, 1/16 = 3 frames). A snap starts one note value early and **lands on the beat**. Put every visual onset on a whole frame.
- **Entrances are wipes or clip-reveals, never fades**: words rise out of a clip rect from below the baseline (1/16) and leave upward (1/8); lines grow along their length; paper appears by a wipe; giant numerals climb in 4 eased steps ("one module at a time").
- **Deletions are knife cuts**: a 2 px line crosses the element in 1/16, then the element collapses to its midline in 1/8.
- **Ripples are ordered by distance** from their cause, a couple of units per subdivision, nearest first.
- **The exception moves differently**: linear, unsnapped, may pause one eighth mid-flight (a glance back), may grow as it travels. A coordinate readout beside it can turn from `col 5.00 row 0.00 · on grid` to signal-coloured `off grid` with non-integer values.
- Smooth 24 fps, no stepped animation: digital precision, not hand-made.

## 6. Camera grammar
A vocabulary, not a route. The camera moves only with the precise ease and only on beats. Transitions are wipes, knife cuts, camera moves and re-flows; never dissolves.

| Move | Expresses | Can serve |
|---|---|---|
| Locked spread | cause (left) → effect (right) | a rule applied; before/after; comparison |
| Hard pan by one page or column | next step in a system | sequence; catalogue; timeline |
| Rotate 90° and stop | the same thing read another way | a poster as a score; a chart as a map |
| Pull out to a wall of artifacts | one programme, many outputs | brand system; product range; series |
| Push into one module | detail; the unit of the system | a pixel; a letter; one data point |
| Grid extends past the page | the system is bigger than the artifact | scale; ambition; breaking constraints |
| Split frame into equal cells | parallel cases | options; variants; team members |
| Vertical scroll through a column | reading; a list | manifesto; spec sheet; timetable |

## 7. Native moves (a menu — use what the story needs)
- **The grid means something**: columns and rows become a quantity (notes, hours, floors, years, features). Strongest at the peak.
- **Snap = beat**: every arrival is a percussion hit.
- **Programme**: rules applied one by one to one artifact, then the same programme generating many (the Gerstner reveal).
- **Extreme scale contrast**: a giant element as chapter card beside tiny notes.
- **The exception**: one element breaks the grid, linear and unsnapped.
- **Knife cut**: an element deleted by a line (budget cuts, editing, removing a feature).
- **Re-flow**: everything else rearranges around a change, nearest first.

Adapting any topic = **a system plus one exception**. Product launch: the spec sheet assembles on a grid, one feature breaks out. Company history: each decade is a rule added to one poster. Love story: two signal elements on two grids; the film ends when one leaves its grid. Some topics need no exception — then the "grid means something" reveal carries the peak.

Reference emotional arc (30–60 s): order being built (curious, crisp) → order complete (correct, a bit dull — say it) → hesitation (the signal element twitches and snaps back) → the break (the only unsnapped, linear move; drums drop) → re-flow around it, visibly better (band returns) → reveal (the grid means something) → scale reveal (same system, many outputs) → back to the hero artifact on the end card.

## 8. Variation space (stay far from any earlier film)
- Structures: a timetable (24 rows of hours fill with the topic's day, one row per beat); an alphabet (A–Z, each letter a module, completing as a specimen sheet); a comparison (two systems on a split spread until one element crosses the gutter); a catalogue (hard pans column by column).
- Openings: a single dot placed on the page, the grid growing from it; the finished artifact dismantled into its rules; a giant numeral filling the frame that turns out to be a detail of a small layout; a signal line striking across with columns growing out of it.
- Endings: the empty grid after every element is cut away; a single word flush left in a corner; the exception leaves the frame and the system closes over its space; return to the opening spread with the hero artifact.

## 9. Sound palette
- **Music with a grid of its own**: a steady pulse whose subdivisions give snap durations. Options: motorik / krautrock kit and bass, minimal techno, marimba or vibraphone patterns, mechanical piano ostinato, drum machine + glockenspiel. One instrument added per new rule is a clear build. Avoid a generic piano-and-strings bed.
- **Picture and music share one data file** (column → pitch, row → onset, length → duration), so a graphic can literally be the score; in that case audio onsets must match visual onsets within 5 ms.
- Techniques: drop the drums for the one bar of the exception; one near-silent bar (bass pedal + quarter tick) before a reveal; thin the band during a reveal so every note is audible; a hard stop of everything on a downbeat makes the next snap an event.
- **Foley follows print materials**, dry and close, no reverb: letterpress clack, ruling-pen "tss", guillotine snick, paper slap and slide, numeral thunk per step, block snap, felt thump for a landing, rubber stamp, typewriter carriage.
- The exception can be the only element that *sings* (a sine glide following its position).
- **Voice**: cool, crisp, rule-like sentences ("Rule one. Build a grid." / "第一条：先搭网格。"); prefer voices with bright, clear consonants and an even, unhurried delivery.
- **Mix**: voice compressed and ≥ 6 dB above music, music ducked ≈ 10 dB under voice, master −14 LUFS integrated, true peak ≤ −1 dBTP. Foley sits between music and voice, never masks a word.

## 10. Pitfalls & fixes (from production)
- Too many thin columns look like a chart → fewer, wider modules.
- The "better" composition isn't obviously better → one strong diagonal with long/short rhythm, the signal element at ≈2× scale, bleeds off the paper edge, type overprinting the signal colour. Merely tilting is not enough.
- Rotating and labelling at once reads as noise → rotate (≈1.5 beats), hold, then grid lines, labels, playhead.
- Merged bars show seams after rotation → overdraw 1 px.
- Elements sharing the camera matrix leak into other shots → draw them only while on screen.
- Labels collide with the header caption row in rotated shots → hide the caption row first.
- Knife cuts across a wall must follow the line in screen space → shrink from the side the line enters.
- Canvas letter-spacing changes text measurement → measure after setting font and spacing.
- Onsets between frames flicker → snap onsets to whole frames.
- Speech-to-text word timings split or merge words and pad the first word → align by characters to the script, clamp at 0.
- Subtitle holds missing the minimum by milliseconds → nudge start times, assert in code.

## 11. Delivery checks
- Exact duration and frame count, 24 fps, resolution of the chosen ratio, H.264 MP4 (yuv420p) + AAC 48 kHz stereo; file < 50 MB.
- −14 LUFS integrated, true peak ≤ −1 dBTP; voice ≥ 6 dB over music on every line.
- Every snap lands on a beat frame; audio onsets aligned to picture within ±1 frame.
- No gradients, shadows, grain, fades or dissolves anywhere; only one element in the signal colour.
- Every subtitle line is inside the layout, on a column start, and meets its hold time; no clipped glyphs at the margins.
- Fonts listed with licences (OFL only); a short CREDITS note.
