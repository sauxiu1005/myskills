# Provenance and Adaptation Boundary

Upstream author: LemoLab / Lemomo. Repository: https://github.com/lemomo-ai/lemo-opuscar. This package is an independent adaptation for MiniMax Design, not an official upstream release.

- Pinned commit: `413a6bd6d78ebd3bdd5abaec9538a26867f890df` (read 2026-10-27).
- Style: `styles/newsreel` (edit and documentary family; distinct from `styles/silent-film`).
- Demo: "Knock-Knee Alert", 54.6 s; notes and source are bundled for study only.
- The upstream MIT licence is kept in full at the package root `LICENSE` and in `vendor/lemo-opuscar/LICENSE`. Font licences and archive credits are in the demo `fonts/`, `CREDITS`, `SOURCES.md`. MIT does not license external archive material.
- `upstream-manifest.json` lists every vendor file with SHA-256; the vendor tree is an unmodified snapshot and `scripts/validate_skill.py` verifies it.

## Version history

- 1.0.1: Codex-host adaptation (Chinese entry, Codex agent manifest).
- 1.1.0: Design-native package. Bilingual runtime (`SKILL.md` English, `SKILL.cn.md` Chinese), Hub `meta.yaml`, platform capability mapping, reuse of the platform Node/Python/FFmpeg/headless browser (`check_runtime.py`), versioned `init_project.py`, `delivery_check.py`, `pack_project.py`, `validate_skill.py`, playwright-core linked from the platform Python package, FFmpeg 6.0 compatibility patches applied to the project copy of `mux.sh`, real-colour-footage rule, delivery encode for large masters, canvas playback and large-project delivery rules. The Codex `agents/openai.yaml` is dropped because Design does not read it. Vendor unchanged.

## Workflow mapping

| Upstream rule | Where |
|---|---|
| Brief -> Treatment -> Look -> optional Storyboard -> Produce -> Self-check | SKILL STEP 1-8; research comes before the treatment |
| DIRECTOR 2-4: references, three structures, own treatment | STEP 3 |
| DIRECTOR 5: three real style frames, optional 6-9 storyboard frames | STEP 4 |
| STYLE 1-6: real material, 1.37 gate, silver, sharp type layer, news editing | STEP 2, 4 and STYLE |
| STYLE 7-8: announcer, hot band, records, dead stops, native moves | STEP 5-6 and STYLE |
| STYLE 9: search, catalogue check, FACTS/SOURCES | materials.md, `footage.py` |
| TECHNIQUE: render(t), one timeline, stems, frame render, mux | production.md and bundled core |
| DIRECTOR 11: contact sheets, action strips, full viewing, one fix round | STEP 7 |

## Deliberate differences

1. No library-wide style picker, plugin install, custom-style saving or auto-update; only the newsreel style.
2. Upstream says the style was tuned with a particular coding model; that is background, not a requirement. Record the real tools used.
3. The code renderer stays the exact implementation; Design capabilities replace unavailable local tools; Design handles material organisation and canvas delivery.
4. Upstream `setup.sh` clone/update is replaced by the pinned snapshot plus project-local, minimal installs that reuse platform runtimes.
5. Topic and language follow the user; default is the conversation language; bilingual subtitles only when wanted.
6. Where the general director guide conflicts with the style, the style wins (beat hard cuts, at most one item card of at least 2.5 s, real images as the subject); reading-time rules still apply.
7. Public-domain years are rechecked at execution time; PD labels are never changed to CC0.
8. Upstream "remove watermarks" becomes "choose clean legal originals or cut archive slates"; rights watermarks are never removed.
9. Real colour footage may be desaturated into the common warm silver; colourised or AI-enhanced versions stay excluded.
10. The demo channel name, institutional names and author/model end card never travel into user films; source licences stay.

Stored code is not proof that dependencies, downloads or a full film work on the current host. Structure check, script compile, local render, platform import and canvas playback are reported separately.
