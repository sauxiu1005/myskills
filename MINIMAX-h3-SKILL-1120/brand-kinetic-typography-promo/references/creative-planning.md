# Creative Planning / 创意规划

How to turn a brand, theme, selling points and product facts into a scene list.

## 1. Message hierarchy (do this first)

From the user's material write down, in order of importance:
1. **One-line promise** (hook): the emotional claim, 2 short lines max.
2. **Selling points** (3–5): each compressed to 2–6 Chinese characters or 1–2 English words for big type; keep the fuller sentence for callouts.
3. **Proof**: numbers the user supplied (stat scenes only use real data), product image, scenarios.
4. **Close**: brand name, date/offer/slogan, CTA.

Never invent numbers, certifications, prices or dates. If proof is missing, use `shape_morph` or `kinetic_words` instead of `stat`.

## 2. Arc templates (120 BPM, 1 beat = 0.5 s)

**Product launch 15 s (30 beats)**
hook 3 → kinetic_words(3 points) 4 → product_hero 5 → stat 4 → rapid_cuts 4 → dot_field 4 → slice_type 3 → end_card 3

**Brand / theme film 15 s (30 beats)**
hook 3 → kinetic_words 4 → shape_morph 4 → dot_field 4 → path_trace 4 → outline_echo 4 → rapid_cuts 4 → end_card 3

**Short social 10 s (20 beats)**
hook 3 → kinetic_words 4 → product_hero or stat 5 → rapid_cuts 4 → end_card 4

**30 s (60 beats)**: double the middle; use each module at most twice and never back-to-back with the same module.

Always sum beats and run `validate`.

**Opt-in only**: `depth_tunnel` (纵深隧道) and `ribbon_loop` (条纹色带) are never default picks — not in templates, not as fallbacks. Use them only when the motion itself matches the product or brand (see `motion-library.md` §2 step 6), and say why in the plan.

## 3. Rhythm rules

- Alternate background roles so every cut is a visible value change: dark → accent → dark → light …
- Put the biggest visual (rapid_cuts, style_cuts or slice_type) in the last third before the end card, this is the energy peak.
- End card gets ≥3 beats so the CTA is readable; keep the logo on screen ≥1 s.
- One idea per scene. If a scene needs more than one sentence, split it.
- Portrait (9:16): prefer fewer, larger words; product_hero stacks callouts under the product.

## 4. Style ↔ brand fit

| Brand tone | Style | Palettes |
|---|---|---|
| Sports, gaming, launches, youth | punch | ember, cyber |
| Premium tech, design, architecture, finance | swiss | mono, bauhaus |
| AI, hardware, SaaS, security, data | hud | cyber, mono |
| Food, kids, lifestyle, social, pets | bouncy | candy, earth |

Recommend one, but let the user choose. Brand colors always beat presets.

**Motion library** (`motion-library.md`): 45 motions tagged by narrative role and tone, from the original showreel and four analysed reference reels. For most themes, start from the 28-row industry table and the Best-for column (§2 there) and present 2–3 options in the format of §2b, rather than only the arc templates above; use a carrier element and the library's self hand-offs for a one-take feel.

## 5. Music

- `synth` (free, sample-exact sync, styled per motion style) is the default.
- Platform AI music: request an instrumental at the spec BPM, mood matching the style, at least duration + 3 s. Then `analyze-audio`, set `format.bpm` to the measured value and `audio.start` to a suggested start so beat 1 hits the first cut.
- User music: only with rights confirmed; same analysis step.
