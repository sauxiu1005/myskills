# Production Readiness and Delivery

## Boundary

The upstream STYLE, DIRECTOR, and TECHNIQUE define what is made. Being able to write code or export an MP4 does not prove the style, drawing, or acting has been achieved. A model name is not evidence of quality.

The upstream route is code-drawn, frame-by-frame rendering. Do not silently switch to image-to-video, geometric placeholder animation, or slideshows. If the user explicitly chooses another route, explain how it differs from the upstream route and what remains editable.

## Project and Environment

1. Locate the real skillRoot and target projectRoot. Run `scripts/verify_bundle.py` to check the 55 upstream files. `scripts/init_project.py` copies the full bundled snapshot to `runtime/` in a new project; the new film lives in `film/`.
2. Verify that source, reference images, fonts and audio are readable in the execution environment, and view the upstream style frame before visual work. A path alone is not evidence that an asset is available.
3. Check Node, Python, FFmpeg, a headless browser, and fonts on the actual execution side. Follow TECHNIQUE dependency versions with project-local installs. Bundle-external plugin setup, tools/fetch, or other styles are not available. See production.md for local project layout and verified fallbacks.
4. If the upstream default voice tool is unavailable, use an available, authorized TTS voice or user recordings. Still produce one audio file per line ID, measure its duration, and extract lip data. If a tool returns several lines in one file, cut and review each line before it enters the timeline; never mix a combined file as one character track. For an intentionally silent film, omit dialogue-driven mouth data and preserve the approved silent sound plan.

## Delivery and Acceptance

Deliver the final MP4, cover, SRT when applicable, TREATMENT, CREDITS, source assets and a rebuildable `build.sh`. Verify that the supplied files are readable and correspond to the approved version.

Verify playback, pause/resume, mid-film seek and the ending in the intended player. A source ZIP is an editable source package, not an online editor; only provide a project link that exists and was verified. Report export, playback and visual acceptance separately. For skill-only maintenance, report film checks as not run; an older version's test does not pass a new version. Application installation, package import and upload mechanisms belong to the host runtime and are not required steps in this creative workflow.
