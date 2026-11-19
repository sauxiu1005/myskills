# Third-party components

huashu-motion's own code and docs are MIT. These bundled pieces keep their own licenses:

| Component | Where | License |
|---|---|---|
| GSAP 3.14.2 | `templates/blank/vendor/`, copied into new projects | GSAP Standard "no charge" License, see `GSAP-LICENSE.html` next to the file |
| Font library: Noto Sans SC (GB2312 subsets, 500–900), LXGW WenKai, Inter, Playfair Display, Anton and 22 more | `fonts/`, copied into projects by `om new` / `om fonts add` | SIL Open Font License 1.1, per-font copyright in `fonts/LICENSES.md`, full text in `fonts/OFL.txt`; taken from huashu-art-motion |
| huashu-art-motion engine (showcase film) | `examples/showcase/` | MIT, plus per-font licenses kept in that folder |

Not under MIT: the "bean Huashu" (豆子花叔) character drawn in `runtime/clip/lib/toon.js`, and its appearance in the storytime template and demo films, is the author's cartoon likeness. It is included to demonstrate this project only and is not licensed for other uses.

Rendering, stills and the preview use the Chrome (or Chromium / Edge) already installed on the machine; nothing is downloaded. `om voice` downloads the Kokoro model files from the kokoro-onnx releases and whisper.cpp models from Hugging Face on first use; they keep their own licenses and are not redistributed here.
