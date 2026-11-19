# Morph Craft Reference — 形变技法参考

Loaded on demand from STEP 2–8. Shared by SKILL.md and SKILL.cn.md. Values are proven defaults from a delivered film; adjust only with a reason.

## 1. Aspect-ratio presets (all 30 fps; duration from §1b)
| Ratio | Canvas | Safe margin (≈5 % short side) | Hero shape height | Lockup layout |
|---|---|---|---|---|
| 16:9 | 1920×1080 | 96 px | ≈ 40 % of height (≈420 px) | mark left + wordmark right, tagline one line |
| 9:16 | 1080×1920 | 64 px sides / 160 px top-bottom (platform UI) | ≈ 55 % of width | mark above, wordmark below, tagline stacked |
| 1:1 | 1080×1080 | 64 px | ≈ 45 % of height | mark above or left, compact |
| 4:3 | 1440×1080 | 80 px | ≈ 40 % of height | like 16:9, tighter gap |
| 3:4 | 1080×1440 | 72 px | ≈ 50 % of width | like 9:16, tagline under wordmark |
Vertical ratios: travelling moves (flights, drops) run along the long axis; wipes should prefer vertical direction. Hero sits at optical centre (slightly above geometric centre).

## 1b. Duration presets — 时长预设 (120 BPM, 1 beat = 15 frames, 30 fps)
| Duration | Frames | Best for | Shapes (incl. mark) | Hero (60–75 %) | Mark lands | End hold | Video bitrate (≤ 50 MB) |
|---|---|---|---|---|---|---|---|
| 5 s | 150 (f0–149) | logo sting, bumper, ad end card | 3–4 | ≈ f90–105 | ≈ f120 | f126–149 (≈ 0.8 s) | ≈ 30 Mbps |
| 10 s | 300 (f0–299) | keynote morph chain, teaser (default) | 6–8 | ≈ f195 | ≈ f240 | f264–299 (≈ 1.2 s) | ≈ 25–30 Mbps |
| 15 s | 450 (f0–449) | feature explainer, social ad, event promo | 8–10 | ≈ f285–315 | ≈ f375 | f405–449 (≈ 1.5 s) | ≈ 20 Mbps |
| 20 s | 600 (f0–599) | brand story, opening film | 10–12 | ≈ f390–420 | ≈ f510 | f540–599 (≈ 2.0 s) | ≈ 15–16 Mbps |

Pacing per duration:
- **5 s**: land every beat (f30, 45 or 60, 90); one short build of 2–4 beats; the hero and the mark may be the same gesture. Keep the wordmark reveal ≤ 0.6 s.
- **10 s**: land every 2 beats in the first half; a 3-beat build into the hero; mark 3 beats after the hero.
- **15 s**: intro (land every 2 beats) → calm breather of 2–4 beats (half-time, one slow travelling move) → double-time run of quick morphs → build → hero → mark. Consider one musical modulation or an added layer at the breather exit.
- **20 s**: two acts. Act 1 (≈ f0–270) sets up the chain and ends on a mini-climax; a breather (≈ 1–1.5 s) resets; Act 2 escalates to the hero, then the mark and a longer lockup. Music needs sections (intro / A / breakdown / B + drop / outro), not one loop.
- Keep each morph half at 8–12 frames regardless of duration; longer films get more morphs and more contrast, not slower morphs.
- Encode bitrates above keep a 1080p file under the 50 MB delivery limit with headroom for audio; always check the final size.

## 2. Path alignment (prevents knots)
- Resample every closed contour by arc length to the same vertex count: main body ≈ 400–420, sub-parts ≈ 72, holes ≈ 72.
- Fix the start vertex at the top (12 o'clock), same winding direction for all shapes.
- For each pair, choose the cyclic shift minimising the summed vertex distance (equivalent to AE "Set First Vertex"; flubber/polymorph use the same idea and are acceptable).
- A→intermediate: map the contour onto the circle/capsule by polar angle order, so the interpolation can never cross itself.
- Mirrored shapes (rolls, flips): reverse winding before matching.
- Holes (handles, pin eyes, counters) are separate contours that shrink to a point inside the body and grow back out — never pop.
- Verification: sample every 0.25 frame across the whole film and test for self-intersection; target is 0. Also render each morph mid-point as a still.

## 3. Morph grammar (apply to every morph)
- A → circle/capsule (8–12 f) → B (8–12 f). Capsule for elongated subjects (plane, pin, bird); circle for round ones.
- Easing cubic-bezier(0.7,0,0.3,1), remapped so the shape is exactly half-way at the mid frame; ~3-frame cushions at start/end.
- Anticipation: ~7-frame counter-move (tilt/compress opposite to the coming motion).
- Squash & stretch 10–15 % along the motion vector, volume-preserving (sx·sy ≈ 1), peaking mid-morph.
- Rotation 15–40°, peaking mid-morph, settling to 0.
- Landing: damped squash + one overshoot; heavy impacts (drop, hero) may reach 20–30 %.
- Travel along arcs, never straight lines, unless mechanical by design.
- Sub-parts relay in sync (e.g. steam → rays → waves → wings). Extra parts retract into the body and emerge again; counts may differ, appearance may not pop.

## 4. Colour fields
- One field per icon; change on every landing via shape-carried motion: iris grow from shape centre, hard-edge wipe, impact ripple, or iris close. Never a crossfade.
- The shape's own colour changes by an inner iris timed with the field.
- Wipes use a shorter shutter (~30 %) than shapes so their edges stay crisp.
- Avoid a visible second-colour "target/eye" at morph mid-points: keep the inner iris either < 15 % or > 85 % of radius at the mid frame (known weakness of v1).

## 5. Finish
- Flat solid shapes, soft contact shadow (raise to 12–15 % on light fields; 8 % was too faint), seeded grain 1–1.5 % to prevent banding.
- Motion blur: temporal supersampling, 8–16 subframes, 180° shutter.
- Fonts: only locally bundled OFL/Apache fonts (e.g. Manrope / Inter / Noto Sans SC). Never rely on system fonts.

## 6. Sound recipe (beat-locked)
- Tempo default 120 BPM → 1 beat = 15 frames at 30 fps; landings on beat frames.
- Plucky arpeggio (Karplus-Strong or FM pluck) + soft bass; octave up at the escalation point.
- Per morph: pitched whoosh rising into the landing (falling for downward moves), sub thump + click on the landing frame.
- Build before hero: riser + filter opening + 8ths → 16ths fill. Hero: full chord + impact + crash. Resolve chord on the logo landing; small plucks per letter cluster; ring out about 0.05 s before the last frame (e.g. 9.95 s for 10 s, 19.95 s for 20 s).
- Master: −14 LUFS integrated, true peak ≤ −1 dBTP (oversampled true-peak limiter). Keep the drop the loudest moment — avoid the ending being louder than the hero (known weakness of v1).
- Verify audio onsets against landing frames (target ±1 frame, ideally 0).

## 7. Final checks
exact chosen duration and frame count (5 s/150, 10 s/300, 15 s/450, 20 s/600), file size < 50 MB, chosen resolution, 30 fps, H.264 yuv420p + AAC 48 kHz stereo, loudness and true peak, no black or empty opening frame, no fallback fonts/tofu, nothing clipped at edges, no thin-line shimmer, no banding, determinism (same frame rendered twice is identical).

## 8. Known weak spots to pre-empt
- Mid-morph blobs look generic: add secondary detail (sub-parts in flight, rotation, colour iris timing) so mid frames still read as designed.
- "Shrink then grow" sub-part handoffs look cheap: prefer visible folding/travel (waves physically curling into wings).
- Small travelling subjects lose presence: keep travelling hero ≥ 70 % of resting size.
- Build sections without visual change rely on audio: add visible escalation (pulses with rings, field tension, camera push).
- The invented mark must be distinctive at small size: test it at 120 px before lockup.
