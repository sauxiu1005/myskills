# Production: One Project, One Timeline

## 1. Initialise and reuse the runtime

`vendor/lemo-opuscar/` is the pinned source. Initialisation copies only the needed runtime, licences and the footage tool, creates an empty film folder and probes the host. It does not download, install, write a demo story or render.

```sh
python3 "$SKILL/scripts/init_project.py" "$WORKSPACE/newsreel-<slug>"
python3 "$SKILL/scripts/check_runtime.py" "$WORKSPACE/newsreel-<slug>"
```

Structure:

```text
newsreel-<slug>/
  project.json          relative paths, defaults, upstream commit, runtime probe
  runtime/              core, dependency lists, sample/model fetcher, licence
  film/
    tools/footage.py    research tool usable before the treatment
    raw/ assets/ fonts/ voice/ audio/ out/ stills/
    SOURCES.jsonl SOURCES.md FACTS.md CREDITS TREATMENT.md QA.md
```

The script refuses an existing target, so a film is never overwritten; to continue an existing project use its files. `film/` then receives this film's own `index.html`, `timeline.json`, `audio/mix.py`, voice script and `build.sh`. It is not a template that renders after a title change.

Minimal project-local setup, run from `runtime/` only for tiers the film uses:

```sh
# playwright-core is already linked from the platform by init_project.py; `npm ci --omit=dev` only if not
python3 -m venv --system-site-packages .venv        # reuses platform numpy / scipy / Pillow
.venv/bin/python -m pip install soundfile soxr      # only for sampler.py and audio prep
```

`init_project.py` also applies the FFmpeg 6.0 compatibility patches to the project copy of `mux.sh` (see the adapter). The cached chromium-headless-shell is found by playwright-core automatically when versions match (`check_runtime.py` prints both). Set `PLAYWRIGHT_CHROME=/path/to/chrome-headless-shell` only for a mismatch. If no browser is cached, ask before installing one. FFmpeg may not be on `PATH` (it is bundled with the Design app); export its directory in `build.sh` so `mux.sh` finds `ffmpeg` and `ffprobe`.

Sound tiers, only when needed:

- User recording or platform speech: export one WAV per line plus measured durations; no Kokoro model.
- Local Kokoro / edge-tts / faster-whisper: install the specific package only when the user requires that engine. English Kokoro also needs `sh tools/fetch.sh voice`.
- Plucked banjo model: numba is an accelerator; check what the code really imports.
- Real samples: read `core/audio/INSTRUMENTS.md` first and fetch one library at a time (`sh tools/fetch.sh instruments freepats`); never `all` by default. Checksum mismatch stops the step; never skip verification.

## 2. Borrowing from the reference source

Read these only after `TREATMENT.md` exists, and borrow functions, not the film. The upstream `demo/build.sh` downloads the demo archive and rebuilds the demo topic; do not run it.

| Source (relative to vendor/lemo-opuscar) | Borrow | Rewrite for this film |
|---|---|---|
| `styles/newsreel/demo/index.html` | `filmLook`, two-layer compositing, ident, `pencil/ring`, transitions, `subBand`, `TEXTS/SUBCHECK` | scenes, material, cards, brand, hard-coded durations and 1920 coordinates |
| `styles/newsreel/demo/tools/prep.py` | clip-wide grade, denoise/scale, frame sequences, print grading | file names, crops, source ranges, map projection, places, records |
| `styles/newsreel/demo/tools/timeline.py` | bars/beats -> seconds, shot/label/record placement | the whole rhythm and shot list |
| `styles/newsreel/demo/audio/mix.py` | optical announcer, band/record ducking, projector, paper/pencil foley, left-right trading | melody, harmony, arrangement, cues, source recordings |
| `styles/newsreel/demo/tools/voice.py` | Kokoro voice blending | lines, voice, speed |
| `cues.py`, `subcheck.mjs`, `final_asr.py` | duration-driven subtitles, width check, final speech check | language, paths, subtitle structure |

The demo's `HERE.parents[...]` paths and file names do not port. Project scripts read the runtime via `LIB`, e.g. `Path(os.environ['LIB'])`; the page loads `/core/lib.js` from the runtime root through the bundled server. The demo `audio/mix.py` ignores `LIB`; edit your copy, never the vendor file. Run every ported script once before relying on it.

## 3. Time and picture contract

One `timeline.json` holds at least `duration, fps, size, sections, shots, hits, lines, tags, clips` (names are the film's choice; every consumer agrees). Each clip records source in, source out, rate and source ID; records also store measured beats, final chord and needle events. Frame counts are derived from duration and fps and checked against the output.

```js
window.DUR = duration;
window.render = (t) => { /* draw every state from absolute time */ };
window.EV = events;
window.TEXTS = (t) => visibleLabelsWithFullTextAndBounds(t);
window.SUBCHECK = () => measuredSubtitleWidths();
window.READY = true; // only after every required asset and font has loaded
```

A failed required image blocks delivery, even though the upstream tool only prints `optional file missing`. `render(t)` never depends on previous frames, wall clock or unseeded randomness; the same `t` renders identically. Footage becomes 24 fps JPEG sequences indexed by `floor((t - shotStart) * 24) + sourceOffset`, clamped to the real frame count. Confirm in a contact strip that moving footage really moves.

Marks use one world->screen transform. Default gate unchanged; other frames use `gateW = min(W, H*1480/1080)`, `gateH = gateW*1080/1480`, centred and scaled in gate units. Vertical delivery that makes subtitles too small is re-laid-out and recorded as a deviation; never stretch the 1920 hard-coded page.

## 4. Picture, sound and check details

Base grade: greyscale -> percentile stretch -> mild S-curve `x + 0.18*(x-0.5)*(1-abs(2x-1))` -> 14-238. One percentile set per clip; print black lifted to 26-30. Real colour sources are converted by the same grade. Picture-layer warm silver `multiply #efe7d6`, `screen #17140f`, flicker +/-3.5 % plus 3 Hz drift, gate weave about +/-1.6/+/-2.2 px, a few 9-frame scratches and single-frame dust. Fill transparent iris corners with `destination-over` black.

Optical announcer: high-pass 260 Hz, low-pass 3.7 kHz, +4 dB at 1.5-2.3 kHz, tanh drive 2, 4:1 compression, 0.55 Hz/0.22 % wow, 6.3 Hz/0.07 % flutter, 31/67 ms reflections. Clarity first. Band limited 95-7500 Hz, ducked 4-5 dB under the voice; record noise only while the needle is down.

Subtitles come from measured voice durations, never from character-count estimates. One line per language. `TEXTS(t)` reports each label's complete string and bounds from its first visible frame; `SUBCHECK` and the SRT cover subtitle widths. If an entry animation is counted as reading time, compute hold from entry end to exit start rather than deleting the check.

## 5. The film's build script

Tail of a project `build.sh`, after assets, voice, timeline and the film's own `audio/mix.py` exist. Earlier stages call this film's prep, voice/check and timeline updates; reuse existing voice files.

```sh
#!/bin/sh
set -eu
PROJECT=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
LIB="$PROJECT/runtime"; FILM="$PROJECT/film"; export LIB
FFDIR=$(python3 -c "import json;print(__import__('os').path.dirname(json.load(open('$PROJECT/project.json'))['runtime_probe']['ffmpeg']['path']))")
export PATH="$FFDIR:$PATH"
PY="$LIB/.venv/bin/python"; [ -x "$PY" ] || PY=python3
cd "$LIB"
node core/render/readcheck.mjs "$FILM" --size 1920x1080
node core/render/events.mjs "$FILM"
node core/render/video.mjs "$FILM" --fps 24 --size 1920x1080 --workers 3 --out "$FILM/out/video.mp4"
"$PY" "$FILM/audio/mix.py"
"$PY" core/render/srt.py "$FILM/out/cues.json" "$PROJECT/film.srt"
sh core/render/mux.sh "$FILM/out/video.mp4" "$FILM/out/mix.wav" "$PROJECT/film.mp4" 24 7
```

`cues.json` must come from this film's subtitle stage; remove the SRT step for a no-subtitle variant. A silent variant encodes without `mix.wav`. Other sizes/fps change every render, frame index, subtitle, safe area and mux argument together. For broad player compatibility, `LEMO_COLOR=bt709` may be set for the mux and recorded.

Checks (from `runtime/`, real paths):

```sh
node core/render/still.mjs "$FILM" --range 0:60:1.5
node core/render/still.mjs "$FILM" --range 8:9:0.2 --prefix action_
"$PY" core/render/sheet.py "$PROJECT/contact.jpg" "$FILM"/stills/t_*.jpg
python3 "$SKILL/scripts/delivery_check.py" "$PROJECT/film.mp4" --srt "$PROJECT/film.srt" --out "$FILM/QA_delivery.json"
```

Thumbnails existing, exit code 0 or structure checks never replace watching and listening at normal speed. With no audio playback available, record "not listened".

The source package contains code, timeline, assets with licences, build script and version record; it excludes `node_modules`, `.venv`, caches and raw downloads that can be recovered legally from `SOURCES.jsonl` (state any rebuild limits).
