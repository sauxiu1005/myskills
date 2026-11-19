# Provenance and Adapter Scope

Upstream author: LemoLab / Lemomo. [Upstream repository](https://github.com/lemomo-ai/lemo-opuscar); [reference showcase](https://lemomo-ai.github.io/lemo-opuscar/). This package is an independent Design adapter, not an official upstream plugin.

- Version: 1.1.2; updated 2026-10-30.
- Pinned to commit `f17136060781a0068a7951245a3aa7835a7230de`; later main-branch style changes are not mixed in.
- [Upstream STYLE](https://github.com/lemomo-ai/lemo-opuscar/blob/f17136060781a0068a7951245a3aa7835a7230de/styles/scifi-toon/STYLE.md), DEMO, DIRECTOR, TECHNIQUE, and bundled source are kept verbatim.
- [upstream-manifest.json](upstream-manifest.json) records size and SHA-256 for 55 upstream files: the complete selected style directory plus the core modules and dependency lists this route uses. It is not a full repository mirror.
- The [upstream MIT license](../vendor/lemo-opuscar/LICENSE) is preserved. Third-party fonts, voices/models, and new-film assets are recorded by their real sources.

Skill package author: MiniMax Design; source category: official-featured. The current market version is in `meta.yaml`; the version history below describes the imported package. Upstream authorship and source license are retained separately.

## Added by This Adapter

The market revision removes application import/canvas requirements from the creative workflow and uses [delivery.md](delivery.md) for file delivery and playback acceptance. Silent/non-finite loudness measurements bypass normalization in the compatibility mux. Bundled upstream files remain byte-identical; the local fallback has dedicated FFmpeg regressions.

SKILL entry files (English `SKILL.md`, Chinese `SKILL.cn.md`), Design environment wiring, path and missing-dependency notes, QA index, metadata, bundle verification, the initializer, and verified fallback tools (`scripts/compat/soundfile.py`, `scripts/mux_compat.sh`, `scripts/check_srt.py`). v1.1.0 removed the separate visual-direction.md and the v1.0.1 overrides of jitter, line width, shading, color, and deformation; upstream STYLE is again the style authority. v1.1.2 adapts the package to platform conventions (bilingual entry files, structured market metadata, English references with `.cn.md` Chinese counterparts) and adds fallbacks verified during a 79-second production. No file under `vendor/` is modified.

## Not Bundled

The upstream repository does not ship the demo voice WAVs, referenced font binaries, TTS/ASR models, or the final demo MP4; this package does not fake them. Font and voice-model names belong to the demo environment; Design is not required to use the same services. Platform voices can satisfy the upstream per-line audio / timeline / lip contract.

Sections of DIRECTOR/TECHNIQUE about full-repo setup, other styles, 3D, and sample libraries are outside this package. They are kept for understanding only; prepare the dependencies this 2D style needs per production.md.

The demo "Coffee Run" and its style frame are for studying technique and quality. Do not reuse its characters, coffee-run story, music, shot timing, or LemoLab end card. User requirements and task scope take priority; do not turn upstream asset wording into extra approval steps.
