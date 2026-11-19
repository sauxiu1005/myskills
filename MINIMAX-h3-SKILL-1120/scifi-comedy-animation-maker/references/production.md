# Running the Bundled Animation Code

Upstream implementation and tool usage live in vendor `TECHNIQUE.md`, `core/README.md`, and `styles/scifi-toon/demo/`. This file only covers wiring a new project; it does not change the upstream style.

## Layout and Initialization

```sh
python3 /path/to/scifi-comedy-animation-maker/scripts/verify_bundle.py
python3 /path/to/scifi-comedy-animation-maker/scripts/init_project.py /path/to/new-film
```

Output:
- `runtime/`: the 55 upstream files with original layout and bytes, including the complete `styles/scifi-toon/demo/`, STYLE, DEMO, DIRECTOR, TECHNIQUE, core, and dependency lists.
- `film/`: the new-film directory with upstream `toon.js`, LICENSE, an ES-module package.json, asset subdirectories, and `tools/` (verified fallbacks, see below). Characters, worlds, timeline, page, and build script still have to be written.
- `upstream-manifest.json`, `project.json`: source hashes, real paths, and the "initialized only" status. Initialization does not use the network, install dependencies, run TTS, or render.

The demo path topology is kept inside runtime, but its external fonts, voice WAVs, and models are not shipped, so it is not an out-of-the-box reproduction. The new film runs from its own paths; edit the working copy, never the installed skill.

## File Mapping

| Upstream file | Use in the new film |
|---|---|
| toon.js | Matrix stack, curve paths, screen-space constant line width, boil, clipped hard shadows; keep the default `frame(t)` |
| chars.js | Parametric eyes/lids/brows, mouth open/wide/round/curl, hands, curved limbs, costume and props; design original characters with these techniques |
| worlds.js | Concrete spaces, objects, creatures, palettes, and portals; rewrite world content for the theme |
| story.js, main.js | Line starts, shots, acting, effects, subtitles, and music events share one time source |
| lines.json, voice.py, asr.py | Per-line voice, per-character processing, interruption trims, 48 kHz output, measured dur/lips, text check |
| music/score.py, mix.py, levels.py | Cue-based score, procedural SFX, dialogue ducking, ambience, dead air, stem measurement |
| srt.mjs, build.sh, sheet.sh, strip.sh | Subtitles, build, full contact sheet, continuous action strips; repoint to the new project |

After reading the demo, do not reuse its character names, sets, music, or timing. Use the upstream reference images to judge complexity and look; parameters come from the source code.

## Paths and Dependencies

In the new `build.sh`, derive `HERE` from the script location and use the sibling `runtime` as `LIB` for Python/Node scripts; replace hard-coded demo paths and `../../../core` with the real LIB. Pages still load the runtime through `/core/lib.js`, film modules use relative URLs, and everything is served by the upstream render server.

Target Node ≥20, Python ≥3.11, FFmpeg ≥7. Install runtime npm dependencies, a matching browser, and a project venv per task, following the upstream requirements; the lip script also needs librosa. Prepare Kokoro/ASR models only for that voice route; a platform TTS voice must satisfy the same per-line WAV contract. Do not run the unbundled setup or full-repo downloader.

`fonts/fonts.css` references font binaries that are not shipped. See the demo CREDITS for fonts and licenses; load them only after they are actually provided. For other languages choose a font with full glyph coverage. Set READY only after fonts load.

Keep the upstream toon.js 1920×1080 base and default boil/line width; never add the v1.0.1 `amp: 0` override. For other aspect ratios, change layout and render size per TECHNIQUE instead of stretching output.

## Timeline and Voice

Record each line ID, character, TTS text vs subtitle text, audio file, and source in/out points, then measure the processed duration. Audio may come from the platform, but mouths must be re-extracted (RMS and spectral centroid) from this film's own per-line recordings. One story timeline drives picture, subtitles, music, and SFX; never reuse the demo's dur/lips/words.

If the spoken form must differ from the on-screen text (for example a dial reading "66 MILLION YEARS AGO" spoken as "sixty-six million"), keep the subtitle text and add a separate spoken field in lines.json for TTS.

Pages expose `window.DUR`, a deterministic `window.render(t)`, `window.READY`, and EV/TEXTS as needed. Use still/events/video/readcheck, score/mix/SRT, and mux per TECHNIQUE; flat toons set mux grain to 0. Rebuild with the finished voice files unless regeneration is requested, because new TTS lengths break the timeline.

Render sketch (only after the page, assets, and timeline are complete):

```sh
cd /path/to/new-film/runtime
node core/render/still.mjs ../film 0.5 5 12 --out ../film/stills
node core/render/events.mjs ../film
node core/render/video.mjs ../film --fps 24 --workers 2 --out ../film/out/picture.mp4
sh core/render/mux.sh ../film/out/picture.mp4 ../film/audio/mix.wav ../film/out/film.mp4 24 0
```

Record actual dependencies, assets, and licenses in the new CREDITS. Do not carry the demo LemoLab/model end credits into the user's film by default.

## Verified Environment Fallbacks

Found during a 79-second production on macOS with ffmpeg 6.0. Use the upstream path first; switch only on the matching symptom and record the switch in BUILD notes.

| Symptom | Fallback |
|---|---|
| `mux.sh` aborts with "only X s of the Y s could be decoded" on ffmpeg 6.x, or the scipy-written WAV has no channel layout | `sh film/tools/mux_compat.sh picture.mp4 mix.wav out.mp4 DUR 24`: two-pass loudnorm (−14 LUFS, TP −1.2) for finite measurements; skip normalization for silent/non-finite input, adds `aformat=channel_layouts=stereo`, cuts with `atrim=0:DUR` instead of `-shortest`, grain 0 |
| `soundfile` (or soxr) cannot be installed | Put `film/tools` first on `PYTHONPATH`; `soundfile.py` provides `read`/`write` via scipy. Remove it once the real package is installed |
| Adjacent subtitle cues overlap after millisecond rounding | Add a guard in the film's SRT export (ordered, non-empty, end ≤ next start − 20 ms, abort otherwise) and run `python3 film/tools/check_srt.py out/film.srt` |
| `timeout` command missing on macOS | Bound long renders with the tool's own limits or a background job plus polling; do not depend on GNU `timeout` |
| Cover image needed | Add a `?view=cover` branch to the film page and render it with the upstream still tool, rather than grabbing a video frame |
| Dense miniature shots read as clutter at 1080p | Lower line width locally for that group (for example a per-shot `lwScale`) instead of changing toon.js defaults |
