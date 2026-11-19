# Glass craft notes — what made the glass actually read

Lessons from five review rounds of the Oriel film (source: `toolkit/demos/oriel/`, report: `oriel-production-report.md`).
Independent jury scores rose from 5/4/5/5/4 (v1) to 7/6/7/7/7 (v5) mainly through the items below. Pass the relevant
ones to the coding agent with every brief.

## 1. The lens must refract the composited picture, not just the background
- Failure (v1): the lens was drawn over the aurora only and the UI lived in CSS `backdrop-filter` cards, so the lens
  barely deformed anything. Viewers and the client said "the glass is not obvious".
- Fix: render aurora + cards + text into one WebGL render target (draw UI with Canvas 2D into textures, updated as a
  pure function of t), then run the lens shader on that composite.
- Lens recipe that read clearly: SDF height field → normal → displacement; centre magnification ~1.55× (text stays
  readable); strong compression/bending toward the rim (pulls outside content in); 6–8 px RGB dispersion at the rim;
  specular highlight + fresnel rim. Displacement 25–40 px at the rim.
- Choreograph the lens to stop over text (e.g. the input prompt, then the multi-line reply) so straight card borders and
  glyphs visibly bend. Stretch along velocity while moving, damped-spring rebound when it stops.
- Clamp or mirror refraction samples into the frame (`inFrame()`), and keep the lens ≥ 200 px from frame edges, otherwise
  it sucks black borders into the glass.

## 2. Cards must look like slabs of glass, not translucent rectangles
- Backdrop blur ~35 px, +5 % saturation of what is behind, 7 % white fill, ~2 % frost grain fixed to the pane.
- Thickness: bevel lighting, 40 % bright stroke on the lit side, fresnel edge, top-left specular.
- ~16 px edge refraction band that samples the sharp composite, so the background visibly bends at the card edges.
- Light direction follows the card normal: entry tilt and settle wobble make highlights and fresnel slide.
- 1–2 px warm/cool fringe on the stroke (offset R/B samples), stronger when lit.
- Dust motes sharp outside cards, frosted behind them — the in/out contrast sells the glass.
- One diagonal light sweep that lights cards one after another (shows depth order).

## 3. Layout — keep it clean, never stack cards to fake depth
- Client rejected v3/v4 because cards overlapped in a staircase and the new grid looked worse than v1.
- Use a calm two-column layout (inputs left, conversation/result right, small notification top), cards never overlapping,
  ≥ 96 px from the frame edge. Depth comes from scale, z/defocus and parallax — glass-over-glass is shown by the lens
  passing over cards, not by cards covering each other.
- Audit geometry every frame (projected bounding boxes): 0 overlaps, edge distance, wordmark area clean.
- Content appears with its card (no empty card for 0.4 s).

## 4. Do not add narrative gimmicks unless asked
- v4 added "question turns into light streams flowing into the orb" and "lens projects the reply with beams". The client
  removed both: the brief was only to make the glass obvious. Ask before adding story devices; the lens itself is the
  hero.

## 5. Lens birth and logo settle
- Birth inside the frame from a UI focal point (e.g. the input bar's orb swells and a bright drop detaches), growing to
  working size in ~0.5 s (ease-out). Never a small dark bubble — bright core, halo, fresnel rim from the first frame.
- Contract to the logo slowly (sine-dominant curve), +15 % refraction pulse and a small damped wobble at merge, no snap.
- Cards exit inside the frame: recede in z, tilt back, defocus, fade (ease-in) — never clipped by the frame edge. Overlap
  the exit with the lens contraction; the wordmark area must be clean when the wordmark appears, and no dead gap.
- End lockup: logo + light wordmark + tagline (≥ 90 % opacity, tracking ~0.06 em, dark halo for contrast), hold ≥ 1.2 s with
  breathing and slow dispersion inside the logo.

## 6. Banding in dark aurora gradients
- The lossless master was clean; banding came from x264 quantising away the grain in flat dark areas (8×8/16×16 steps).
- Picture: keep ~1.2 % mono dither + soft-light grain, and add linear grain below ~0.3 luma (soft-light grain vanishes
  near black).
- Encode: render lossless with `--mkv`, then `scripts/encode_final.sh` (error-diffusion RGB→YUV, two-pass ~37 Mb/s,
  `-tune grain`, aq-mode 3 / aq-strength 1.3, deadzone 0, no dct-decimate). ~45 MB for 10 s.
- Check: lift dark areas 3–7× and compare against the master; `scripts/band_metric.py master.mkv out.mp4 t…` (target
  worst lf99 < 1 LSB). Fully zero banding needs 10-bit (High 10), which hurts compatibility — ask the user first.

## 7. Sound
- mgaudio `ambient` recipe, `flavor='glass'`, D major, no drums; warm low layer (v1 was thin and bright).
- Glass transients at lens birth / text passes / merge; a VCSL wine-glass rub (re-pitched in key) while the lens glides.
- UI ticks must survive a phone speaker: simulate mono + 300 Hz high-pass + small-speaker EQ and confirm every cue is
  audible; keep 2–5 kHz around ≤ 10 % so it is not harsh. Master −14 LUFS, TP ≤ −1 dBTP.
- `scripts/check_audio.py` checks onsets against `out/hits.json` (adjacent cues < 60 ms apart can be mis-picked).

## 8. Review honestly
- The coding agent's self-scores ran 2–3 points above an independent jury every round. Always get an independent review
  (`rubric.md`) before claiming quality, and report the jury's numbers to the user.
