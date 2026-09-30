# Art Style Format Example

Below is the standard format for `art_style.md`.

```markdown
Art Style: Cinematic Realism

Style Description:
  Warm film tones, primarily natural lighting, 35mm film grain texture.
  Referenced from the visual language of Into the Wild and Nomadland.
  Widescreen ratio, anamorphic lens oval bokeh and soft edges.

Keywords: cinematic, film grain, natural lighting, warm amber tones, 35mm film, anamorphic
Palette: warm yellow, amber, deep brown, golden hour gold
Lighting: natural light, golden hour, backlit silhouette, Tyndall effect

Recommended Model: Midjourney V7 (best for cinematic texture) / Kling (character realism)

Reference:
  - style_cache/cinematic/01_highway.png
  - style_cache/cinematic/02_bar.png
  - style_cache/cinematic/03_canyon.png
  - style_cache/cinematic/04_starry.png

Style JSON:
  {
    "visual_style_analysis": {
      "color_palette": ["#D4A574", "#8B6914", "#2C1810", "#E8C98E", "#4A3728"],
      "color_mood": "warm amber and golden tones with deep brown shadows",
      "lighting_and_shadows": "natural golden hour lighting, strong rim light, Tyndall effect, soft diffused shadows",
      "texture": "35mm film grain, slight lens aberration, organic noise",
      "composition_style": "wide anamorphic framing, rule of thirds, deep depth of field for landscapes",
      "line_style": "soft organic edges, no hard outlines, photographic realism",
      "art_style_keywords": ["cinematic", "film grain", "golden hour", "anamorphic", "warm amber", "natural lighting", "35mm film", "photorealistic"]
    }
  }
```

## Format Notes

- First line format: `Art Style: ` + style name
- `Style Description:` 2-4 sentences describing the visual language, may reference films/works
- `Keywords:` comma-separated English keywords, used for subsequent image generation prompts
- `Palette:` list main color tendencies
- `Lighting:` list lighting and shadow characteristics
- `Recommended Model:` recommend the most suitable model based on style, with brief rationale
- `Reference:` list selected reference image paths (relative to project directory), one per line, starting with `- `. Built-in presets are auto-cached to `style_cache/{style}/{filename}.png` by the script; custom styles may point to local files under `style_references/`
- `Style JSON:` structured style data returned by `read_media` analysis of reference images (JSON format), injected into prompts for character and prop image generation
- Content indented 2 spaces for visual alignment
