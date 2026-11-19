# clip runtime (from huashu-art-motion)

Source: https://github.com/alchaincyf/huashu-art-motion — `scripts/engine/`, commit `57d6760` (2026-10-08).
License: MIT, see `LICENSE` in this folder. The fonts the grammars draw with are not here: each template copies
the ones it needs from the repository's `fonts/` into the project's `assets/fonts/` (SIL OFL 1.1, see
`fonts/LICENSES.md` and `fonts/OFL.txt`, which are copied along).

What is here:

- `lib/util.js paint.js kit.js motion.js camera.js diagram.js typo.js chart.js ui.js collage.js toon.js` — unchanged copies of upstream `scripts/engine/lib/`.
- `grammars/<grammar>.js` — the 8 parameterized grammars from upstream `scripts/engine/clips/` (t1_3b1b, t2_keynote_ui,
  t3_finance_chart, y1_kurzgesagt, y2_vox, y3_whiteboard, y4_storytime, y5_kinetic_type).
- `clip.js` — rewritten from upstream `scripts/engine/clip.js`.
- `cues.js` — new: pace, narration-word anchors, film length (pure functions, tested in `test/`).

Changes from upstream:

- `clip.js` reads the spec from the project's `<script type="application/json" id="clip-spec">` instead of a URL
  parameter / `window.CLIP_SPEC`; the grammar file is loaded with a plain `<script src>` instead of a synchronous
  XHR + `eval`. It fills `"{{variable}}"` placeholders from the composition variables, anchors cues to
  narration words (`om voice` → `om-cues`), drives `renderFrame(t)` from the GSAP timeline through `OM.clock`, adds
  `scene:` labels and `OM.region` pickable regions, and holds the renderer's capture (`OM.ready`) until fonts,
  images and the grammar's layout are ready. The canvas size comes from the root's `data-width` / `data-height`.
  Only the fonts a grammar uses are loaded (from `assets/fonts/`); problems the author should fix (broken JSON in a
  variable, a word missing from the narration, a boot error) are written on the frame. The preview scrubber UI is gone.
- Every grammar gained `faces` (the font families it draws with), `scenes(ctx)` and `regions(ctx)`, and calls
  `CLIP.mark(...)` where it draws a pickable thing. These record boxes only; they draw nothing. Default specs render
  pixel-identical to upstream (checked frame by frame against `render.py --spec` output).
- Small theme hooks, inert when unset: `y1_kurzgesagt` reads `data.planetColor`, `y2_vox` reads `data.accent` (the red
  string and circles), `y3_whiteboard` reads `data.accent` (the orange).
- `t2_keynote_ui`'s `imgContent()` returns the box of the active highlight so it can be picked.
