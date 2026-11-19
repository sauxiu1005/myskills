# Design Platform Adapter

How the upstream newsreel pipeline maps onto MiniMax Design. Platform capability names change between releases; describe and choose the capability by what it does, discover what the current session really exposes, and never invent a tool, field, voice ID or model name.

## 1. Where things live

- `skillRoot`: the installed Skill directory. `vendor/lemo-opuscar/` is a read-only pinned snapshot; never edit it.
- `projectRoot`: a new folder inside the current Design project workspace, created with `scripts/init_project.py`. Everything for the film (runtime copy, raw downloads, assets, voice, music, renders, QA) lives there.
- Generated or imported media that should appear on the canvas must be inside the workspace. Paths on the author's machine are never delivery URLs.
- Record `skillRoot`, `projectRoot`, language, size/fps, voice route, music route and every real tool/model used in `film/QA.md`.

## 2. Reuse the runtime that is already installed

Run `python3 scripts/check_runtime.py <projectRoot>` once at the start (read-only). On a typical Design desktop host it finds:

| Need | What Design normally already has | Project-local step only when missing |
|---|---|---|
| Node >= 20 | the platform Node runtime | none |
| Python >= 3.11 with numpy, scipy, Pillow | the platform Python runtime | none |
| FFmpeg / ffprobe with libx264, loudnorm, ebur128, hqdn3d | the FFmpeg bundled with the Design app | none |
| Headless Chromium matching playwright-core | the cached chromium-headless-shell build | do not download another browser; set `PLAYWRIGHT_CHROME` only if the cached build differs |
| playwright-core for `core/render` | the copy inside the platform Python playwright package (same 1.63.0 as the lock file) | `init_project.py` links it into `runtime/node_modules/`; only without a matching copy run `npm ci --omit=dev` if npm exists (the platform Node ships without npm) |
| soundfile, soxr (sampler, audio prep) | often missing | `python3 -m venv --system-site-packages runtime/.venv`, then install only these two |
| numba (fast plucked banjo) | often missing | install only if `pluck.py` is actually used |
| Kokoro / edge-tts / faster-whisper | usually missing | prefer platform speech and transcription; install locally only when the user requires the original engine |

`init_project.py` also patches the project's own copy of `mux.sh` (never the vendor file) for two FFmpeg 6.0 bugs seen with the bundled build: the decoded-length check reads a plain decode pass, and the output audio layout is pinned to stereo before AAC. Both are listed in `project.json` under `runtime_patches`.

Do not reinstall the upstream tool stack, do not run a full `requirements-voice.txt` install by default, do not update global packages, and do not retry a failing install more than twice. A completed install is not proof: run the actual command once (for example one still frame) and record the result.

## 3. Capability substitution table

Keep each stage's result and quality bar; the implementation may change. Record "upstream step -> real tool -> kept -> known difference" in `QA.md`. Equivalent substitutions inside the user's authorisation need no extra confirmation.

| Upstream step | Design route | Must still hold |
|---|---|---|
| `footage.py` search / fetch | `footage.py` with the platform Python (stdlib only), the in-app browser for catalogue pages and file pages, the public web-media downloader for public video pages, direct media import for direct file URLs | catalogue page read, licence template read, real file viewed, source in/out recorded |
| Generic image search | only as a lead to an archive page; never as evidence or as footage without a verified source page and licence | provenance and licence per file |
| Kokoro / edge-tts announcer | the user's recording first; otherwise platform speech synthesis with a catalogue voice chosen through the platform voice search (English male, bright, energetic). Generate one test line, measure it, then the batch with the same voice | one voice for the film; every line exported as `<id>.wav`; measured `dur.json` |
| faster-whisper `asr_check.py` / `final_asr.py` | platform subtitle transcription of the dry voice and of the finished film, compared line by line against the script; plus an actual listen | names, numbers and dates match; mismatches fixed by rephrasing, never by changing facts |
| Sampled / modelled band (`sampler.py`, `pluck.py`, `mix.py`) | first choice: the code band (original melody, project-local samples fetched one library at a time with checksums). Alternative: platform instrumental music, then cut it to the timeline in code so the dead stop, button and cue points land | 190-220 BPM feel, tuba/banjo/trombone/snare/piano/trumpet/clarinet palette, two near-silences, original music |
| Foley (`sfx.py`) | the procedural code foley; platform sound generation only as a supplement | one sound per visible move; projector bed from first to last frame |
| Canvas2D page + `video.mjs` + `mux.sh` | the bundled renderer with the platform Node, cached headless browser and bundled FFmpeg | deterministic `render(t)`, two layers, gate, real source frames advancing |
| Contact sheets, media facts | `still.mjs` + `sheet.py`; `scripts/delivery_check.py`; platform media inspection for a second opinion | thumbnails never replace a normal-speed viewing |
| Delivery | import the final MP4 onto the canvas, then play it in the canvas player | file decode, upload and canvas playback recorded separately |

Never replace archive footage, print or records with generated images or generated video, and never use AI restoration, colourisation or upscaling to fake period material. Generation may only be used for clearly non-archive work that the user asks for (for example a poster variant), and is labelled as such.

## 4. Real colour footage

Genuine colour film or video (for example later chapters of a long history) may be used. Convert it with the same base grade as every other source (greyscale -> percentile stretch -> S-curve -> 14-238, one level set per clip) so the whole film sits in one warm silver. Colourised, AI-enhanced or "restored" versions of black-and-white material remain excluded. Place-and-date cards always show the real date of the material, so a retrospective told in 1920s grammar never passes later footage off as 1920s footage.

## 5. Browser use

The bundled renderer starts its own headless Chromium against a loopback server inside the project. Use it only where the host allows it; never attach to the user's browser debugging port. The in-app browser is for reading archive catalogue pages, licence pages and for a visual check of HTML previews; it is not a substitute for the deterministic frame renderer.

## 6. Canvas delivery

1. Run `scripts/delivery_check.py film.mp4 --srt film.srt --out film/QA_delivery.json`: real width/height/fps/duration/audio, full decode with zero errors, loudness about -14 LUFS with true peak <= -1 dBFS, black segments explained (gate, iris and end card are normal), faststart.
2. The grained master can be large (film grain is costly for H.264). Keep the master locally. When it is too large for a smooth canvas upload (over about 50 MiB, or the platform rejects it), make a delivery encode of the same master (same size, fps, audio and duration; H.264 yuv420p, a higher CRF or a capped bitrate, AAC, faststart), run `delivery_check.py` on it as well, and record both files. Never drop resolution, frame rate or audio silently.
3. Import the final MP4 onto the canvas as one media node. Do not import intermediate frames, stems or proxy renders. Do not call a poster, a ZIP attachment or a finished progress bar a playable film.
4. Canvas playback check on the actual node: playback advances time and picture; pause then resume; while paused seek to mid film and wait for the target frame, then play; play the ending. If the agent cannot operate the canvas player itself, record `canvas_playback=needs_user_check` and ask the user to run exactly these four checks; never report it as passed.
5. Also place the poster and, when subtitles exist, the SRT; and one canvas text note summarising sources, facts, QA status and where the editable project is.
6. Editable project: run `scripts/pack_project.py <projectRoot> <zip>`. If it is at most 50 MiB, import it alongside the film; if larger, keep it local and put its absolute path, size, contents and rebuild command (`sh build.sh`) into the canvas note. Call it a local editable project, never an online editor link.
7. Never publish, share publicly or widen access.

Status words in QA: `passed`, `failed`, `not_run`, `blocked`, `needs_user_check`. Structure checks of this Skill are not a Design upload, a full render or a canvas acceptance.
