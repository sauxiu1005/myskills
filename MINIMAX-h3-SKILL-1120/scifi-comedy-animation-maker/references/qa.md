# QA: Upstream Checks on Real Files

Based on DIRECTOR's "sound → rhythm → camera → directing" and TECHNIQUE §8. Record passed / failed / not_run / blocked with evidence paths; never pre-fill success.

| Item | Actual check |
|---|---|
| Reference and design | Compare the upstream style frame with this film's character sheet and style frames: large eye whites, small pupils, layered features and mouth shapes, readable silhouettes, concrete sets and props, drawing finish matching the reference |
| Upstream material | Screen-space thick lines, three-state 12 fps boil, flat fills with hard clipped shadows; banded skies, device-only glow colors, no smooth-gradient substitutes |
| Acting and camera | Gestures have anticipation, walks/runs have limb poses, expressions follow the voice; absurd reveals get reaction shots; dead-air beats keep only line boil |
| Timing | Lines, subtitles, shots, and SFX in story share one event; random frames match sequential render; 12 fps characters separate from 24 fps camera |
| Sound | Listen to every line and the final mix; cut-offs accurate, no stray bleed; cue-based score and action SFX work; dead air cuts music and reverb tails |
| Subtitles | Size, line breaks, speaker color tags, and reading time per STYLE; inside the bottom safe area, no missing glyphs or face cover, cleared before dead air; `scripts/check_srt.py` passes (ordered, non-empty, no overlap, ≥20 ms gap) |
| Technical | Full decode; measured size/fps/duration/audio track/loudness; no unexpected blank frames or truncated tail. This never replaces visual and sound review |
| Project and delivery | New-film source/assets/licenses/rebuildable build complete; final playback and source editability verified separately |

Review at least two full contact sheets (one frame every 1–2 s), ~0.2 s strips for key actions, adjacent frames for boil and mouths, and one real-time watch-and-listen pass. `ffmpeg fps=1` sampling drifts; judge cut points with the upstream still tool's exact times.

Known false alarm: a reviewer may flag "late SFX" from sampled frames. Measure onset against the event time in the mix before changing anything (verified onset ≤2.4 ms in a 79 s production).

For skill-only maintenance, check bundle hashes, metadata, relative links, initialization and refusal to overwrite, and ZIP integrity. Mark render, TTS, final listening, and final playback as not_run if not done. A passing skill check is not a passing film.
