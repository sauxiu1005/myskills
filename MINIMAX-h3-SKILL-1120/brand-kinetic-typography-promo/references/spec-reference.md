# Spec Reference / 规格文件参考

The whole film is one JSON spec rendered by `scripts/mgfx.py`. Edit the spec, never the engine, for content changes.
整条片子由一个 JSON 规格文件驱动；改内容只改 spec，不改引擎代码。

## Top level

```json
{
  "meta":    {"brand": "NOVA 声境"},
  "format":  {"aspect": "16:9", "short_side": 1080, "fps": 60, "bpm": 120, "duration": 16},
  "style":   "punch",
  "palette": {"preset": "cyber"},
  "hud":     {"enabled": true, "label": "NOVA / 2026 新品发布"},
  "audio":   {"mode": "synth", "mood": "energetic"},
  "assets":  {"product": "product.png", "logo": "logo.png"},
  "fonts":   {},
  "recipe":  "dot_reel",
  "carrier": "a1",
  "scenes":  [ ... ]
}
```

| Key | Values | Notes |
|---|---|---|
| `format.aspect` | `16:9` `9:16` `1:1` `4:5` | `short_side` 1080 default (720 for drafts) |
| `format.bpm` | 90–140 typical | All scene lengths are in beats; 120 BPM → 1 beat = 0.5 s |
| `format.duration` | seconds | Must equal Σ beats × 60 / bpm, `validate` enforces it |
| `style` | `punch` `swiss` `hud` `bouncy` | Controls easing, transitions, HUD, post FX, fonts, cut effects, synth mix |
| `palette.preset` | `ember` `bauhaus` `cyber` `candy` `mono` `earth` | |
| `palette.brand` | `["#FF5A28"]` or up to 3 hex | Derives dark/light/accents from brand hue |
| `palette.<role>` | hex | Explicit override of any role: `dark` `light` `a1` `a2` `a3` |
| `hud.enabled` | bool | Frame corners / timecode / scene label / progress |
| `audio.mode` | `synth` `file` `none` | `synth` uses `mood`: `energetic` `bright` `cool` |
| `audio.path` `audio.start` | file, seconds | `file` mode: music starts at `start`; beat 1 of the film = that point |
| `audio.sfx` `audio.sfx_gain` | bool, 0–1 | Layer whooshes/booms/blips over external music (default on, 0.5) |
| `assets` | name → file path | Relative to the spec file. Transparent PNG floats; opaque images get a rounded card |
| `fonts` | `display` / `cjk` / `mono` / `serif` / `cjk_serif` → family or file | Only when the user asks for a specific font |
| `recipe` | `dot_reel` `chapter_reel` `tech_reel` `page_reel` `ignite_reel` | Optional preset that replays a whole source chain (see `motion-library.md`); default transition `cut` |
| `carrier` | palette role | Colour of the carrier element used by library modules (default `a1`); scenes may override |
| `hud.mode` | `frame` `tech` `grid` `dots` `chapter` `pages` `reel` | Override the style's HUD; `chapter` = chapter labels, BPM, frame counter; `pages` = page counter + progress line; `reel` = corner brackets, chapter label, timecode, scrub ruler, REC |

Style presets:

| style | Look | Transition | Post FX |
|---|---|---|---|
| `punch` 冲击快剪 | Condensed heavy type, back-easing overshoot, letters fly from baseline | Diagonal wipe | Beat shake, RGB split, grain, vignette, frame HUD |
| `swiss` 极简瑞士 | Bold grotesk, expo easing, no overshoot, 12-col grid | Staggered vertical panels | Light grain only |
| `hud` 科技HUD | DIN condensed, glyph-decode reveals, glow | Slice glitch | Scanlines, RGB split, data readouts |
| `bouncy` 活泼弹性 | Rounded type, spring easing, rounded shapes | Circle iris | None, scene dots |

Palette roles: each scene picks `bg` from `dark` `light` `a1` `a2` `a3`. Text color is chosen automatically for contrast; accents are the remaining accent roles sorted by contrast.

## Scene modules

Every scene: `type`, `beats`, optional `bg` (default `dark`), `name` (shown in HUD and storyboard), `still` (0–1 fraction used for the storyboard frame).

| type | Purpose | Params | Min length |
|---|---|---|---|
| `hook` | Opening: dot pops, squashes, stretches into a line; line1 rises above, line2 drops below | `line1` (short), `line2` (punchline), `kicker` small mono text, `size1`, `size2` | 3 beats |
| `kinetic_words` | Selling points as giant staggered words over a scrolling marquee, keyframe timeline, easing graph | `words` 2–4, `marquee`, `size` | ≥0.45 s per word, ideal 0.6–1 s |
| `shape_morph` | Shape morphs circle→square→triangle→star, one label per shape: features, scenarios, steps | `labels` 2–4, `blowup` (default true: fills screen at the end) | ≥0.45 s per label |
| `dot_field` | Halftone dot field reacting to a moving wave, then flow lines; 1–2 words in a knock-out | `words` 1–2, `size` | 3 beats |
| `path_trace` | Lissajous ribbons draw on with a coordinate readout; a giant faint background word | `bg_word`, `label` | 3 beats |
| `depth_tunnel` | Z-space tunnel with a spinning wireframe cube or a floating product image | `word`, `image` (asset key), `size` | 2 beats |
| `rapid_cuts` | Word per half-beat; each word animates its own verb | `words` 4–8, `effects` list, `bgs` role list, `size` | ≥0.2 s per word |
| `stat` | Number counts up inside a progress ring with ticks | `value` like `98%` `3x` `40h` `1,000+`, `label`, `kicker` | 3 beats |
| `product_hero` | Product image springs in over rings, callouts draw out to feature labels, title | `image` (asset key, required), `title`, `callouts` 1–4 | 4 beats |
| `product_glow` | Product glows in its own light: tinted silhouette glow + beat rings switch through `cycle` colours, headline + colour readout | `image` (asset key, required), `word` or `words` (swapped in turn), `label`, `cycle` (palette roles, default a1 a2 a3) | 3 beats |
| `end_card` | Lines converge into the logo (image or 3 shapes), title, typed subtitle, CTA pill | `title`, `logo` (asset key, default `logo`), `subtitle`, `cta` | 3 beats |

Motion-library scenes: `dot_split` `snap_type` `shape_spin` `grid_wave3d` `point_ring` `ribbon_loop` `text_ring` `dot_lockup` `ball_drop` `tracking_snap` `grid_ripple` `particle_word` `sphere3d` `data_dash` `serif_flow` `decode_lockup` `select_box` `code_glitch` `cross_ripple` `pillar_wave` `type_ribbons` `infinity_particles` `grid_recap` `split_hero` `text_band` `beat_jelly` `stack_flip` `object_lockup` `comet_burst` `beat_word` `color_matrix` `fluid_blob` `sphere_burst` `ui_cards` `arc_lockup` `prompt_type` `frame_trace` `media_morph` `canvas_zoom` `caret_lockup` `type_prompt` `pixel_word` `media_type` `select_words`. Parameters, roles, tone tags and hand-offs are in `motion-library.md`. They mix freely with the modules above; a library scene finishes its own hand-off, so the cut after it is automatically hard.

Any scene may set `"transition"` to override how it enters: `cut` `scan_glitch` (blue RGB-split glitch flash, best once into the close) `wipe` `slide` `circle` `glitch` `bolt` `speed_lines` `shutter` `whip` `zoom` `iris` (match cut: the next scene already plays inside a circle growing from `iris_at` [x, y] fractions of the frame, default [0.84, 0.52], ringed in the accent colour) `blinds` (8 interleaved bars close from alternating sides, then open the other way).

`rapid_cuts` effects: `rotate` `squash` `stretch` `overshoot` `bounce` `blur` `glitch` `decode` `scale` `loop` `slide` `mask` `track`. Default list comes from the style.

## Text rules

- Latin text is uppercased in `punch` `swiss` `hud`; Chinese is unaffected.
- Big words auto-shrink to fit; still keep them short: ≤8 Chinese characters or ≤12 Latin letters for `kinetic_words`, `dot_field`, `rapid_cuts`, `shape_morph`. Longer copy belongs in `callouts`, `label`, `subtitle`.
- `stat.value` must be a fact the user provided.

## Commands

```
python mgfx.py validate SPEC                 # timeline table, errors, warnings
python mgfx.py palette [--brand "#hex,#hex"] --out palettes.png
python mgfx.py styles  SPEC --out styles.png # same content in all 4 styles
python mgfx.py stills  SPEC --out storyboard.png [--height 720]
python mgfx.py render  SPEC --out film.mp4 [--height 720 --fps 30 --workers N --keep-audio]
python mgfx.py analyze-audio music.mp3       # bpm, first_beat, suggested_starts
```

- `carrier_shape` (top level) or `shape` on `ball_drop`: `"icon"` drops the brand icon square (rounded bottom-left, spins as it falls) instead of a ball — use when the brand mark is a square.
- `fx` (top level): override the style's post FX, keys `shake` `zoom` `rgb` `grain` `vig` `scan`, e.g. `{"shake": 24, "rgb": 12, "grain": 7, "vig": 0.35}` for the reel look.
- R7 reelcraft scenes (`mgfx_reelcraft.py`): `line_split` `marquee_swap` `orbit_morph` `style_cuts` `converge_lockup` `split_flap` `slice_type` `outline_echo` — parameters in `motion-library.md`; `beats` may be fractional (e.g. 2.5). `style_cuts` allows ~0.2 s per word. Example: `references/example-reelcraft.json`.
- `format.min_scene` (default 1.0, floor 0.5): shortest allowed scene in seconds. Lower it (e.g. 0.8 at 150 BPM, 2 beats a scene) only for showreel / showcase cuts that sample many modules; the per-item limit scales with it.
