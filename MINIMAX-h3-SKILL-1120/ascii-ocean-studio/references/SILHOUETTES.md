# Drawing a silhouette for a named creature

Use this when the user only names a creature that is not built in. The SVG is read like a photo, so shape and contrast decide the ASCII result.

## Rules
- **Whole body, side view** for swimmers, head pointing **left**; front or top view only for jellyfish, octopus and rays.
- **Solid fills, no outlines, gradients, text or background objects.** Plain white background; leave 5–10 % margin.
- **Mid-tone body** (luminance ~35–65 %), so it becomes dense glyphs instead of empty space or solid `@`.
- **One clearly darker eye** (near black) → `@` pupil glyph. A small white dot inside it → `o` highlight.
- **Recognizable features as silhouette shapes**: fins, tail fork, horn, tentacles, shell plates. Use 2–3 tones of the same hue to separate body parts (e.g. lighter belly, darker fins).
- **Proportions**: swimmers wider than tall (2:1 to 4:1); pulse creatures roughly as tall as wide or taller.
- `viewBox` around 400×300 for swimmers and 300×360 for pulse creatures; render size does not matter.

## Example — sunfish (swim, head left)
```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300">
  <rect width="400" height="300" fill="#fff"/>
  <g fill="#7a8fa6">
    <ellipse cx="190" cy="150" rx="140" ry="105"/>
    <path d="M180 60 L215 0 L240 70Z"/>
    <path d="M180 240 L215 300 L240 230Z"/>
    <path d="M320 95 Q360 150 320 205Z"/>
  </g>
  <circle cx="100" cy="125" r="13" fill="#111"/>
  <circle cx="96" cy="121" r="4" fill="#fff"/>
</svg>
```

## Example — lantern jellyfish (pulse)
```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 360">
  <rect width="300" height="360" fill="#fff"/>
  <path d="M40 150 Q150 10 260 150 Q150 175 40 150Z" fill="#8a7fb8"/>
  <g stroke="#a99fd1" stroke-width="10" stroke-linecap="round" fill="none">
    <path d="M80 160 Q70 240 90 330"/><path d="M130 165 Q140 250 120 340"/>
    <path d="M170 165 Q160 250 180 340"/><path d="M220 160 Q230 240 210 330"/>
  </g>
  <circle cx="150" cy="105" r="16" fill="#f4f1ff"/>
</svg>
```

Save as `<name>.svg` in the output folder and pass it as `image=` to `scripts/make.py`. If the result looks empty, darken the body; if it looks like a solid block, lighten it or add tone variation.
