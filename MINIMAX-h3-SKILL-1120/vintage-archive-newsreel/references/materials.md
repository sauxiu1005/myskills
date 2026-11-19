# Material Research and Records

This is an edit-and-documentary style. Order: **item source -> catalogue description -> watch the material -> log usable ranges -> story treatment**. Never write the story first and look for pictures that seem to prove it.

## Sources

User archive first, then by subject NARA, Internet Archive, Wikimedia Commons, LOC / Chronicling America, the relevant national archive; maps from Natural Earth; period records from UCSB / Internet Archive / LOC National Jukebox.

- Check federal works, donated collections and contractor films separately; an archive website does not make everything public domain.
- Internet Archive: check the original institution, author, item licence and upload provenance; skip unsourced reposts, video-site mirrors, colourised and AI-enhanced versions.
- Commons: read the licence template on the file page; "no known restrictions" is not a licence. Tool-filled licence fields are leads, not conclusions.
- Default scope: confirmed PD, CC0, CC BY, OFL. Other licences: read their real terms together with the user's own rights. Never relabel PD as CC0.
- Upstream thresholds (US print before 1931, US recordings before 1926) were valid in 2026 for the US. Recheck every time against the current date, work type, place of publication and place of use. Check recording and composition separately.
- Read the whole newspaper page, then crop to the relevant fold. Cut archive slates and white flashes; choose clean legal originals; never remove a rights watermark.
- Historical public figures and people in news events may appear as in the material; ordinary people's faces are never slowed, mocked or made the close-up subject.
- Genuine colour material is allowed and is graded to the common warm silver; its real date stays on the place card.

## Before downloading

Tell the user briefly what will be fetched, from where, under which licence, for what use and roughly how big; keep `raw/` under about 1.5 GB. Within an authorisation already given, do not stop and wait for this routine step.

## The bundled footage tool

`film/tools/footage.py` uses only the Python standard library (ffprobe for media facts). Replace queries and IDs with verified ones; never treat the examples as chosen material.

```sh
cd "$PROJECT/film"
python3 tools/footage.py search archive 'early automobile assembly' --type video -n 8
python3 tools/footage.py search commons '1908 automobile' --type image -n 8
python3 tools/footage.py files archive:VERIFIED_IDENTIFIER
python3 tools/footage.py fetch archive:VERIFIED_IDENTIFIER/VERIFIED_FILE --name archive01 --max-mb 200
python3 tools/footage.py used archive01 'source 12.0-15.5 s -> film 3.2-6.7 s; action verified against catalogue'
python3 tools/footage.py md
```

`fetch` without a file picks a large candidate, so list files first. `--max-mb` only pre-checks Content-Length; an unknown length is not a hard cap. Interrupted downloads may leave partial files: verify before reuse. Never use the tool's example `--license` string as a rights status. For public video pages the platform's web-media downloader may be used instead, and the same record is written by hand.

Search hits are not viewing. The log states what was actually seen: source timecode, people, action, on-screen text, real year, unknowns.

## Project records

Keep the native `SOURCES.jsonl` fields `name, file, url, input, page, title, date, credit, license, note, used, fetched` plus probed width/height/fps/duration/audio; optionally `catalogue_url, rights_url, rights_checked_on, source_in, source_out, film_in, film_out`. Unknown stays empty. `used` holds source range and film range; `SOURCES.md` is generated from it.

`FACTS.md` row: `claim_id | exact on-screen or spoken wording | source URL | page / catalogue paragraph / timecode | short excerpt or measurement | verified / source claim / editorial comment / unknown`. Separate fact, what an old paper claimed, and today's editorial joke. Weak sources mean the claim is cut or softened, never carried by a confident announcer.

`CREDITS` lists every film, photo, scan, map, recording, sample, font, engine and licence actually used, with notable modifications. The upstream MIT notice stays in the source code; the demo's author/model end card never enters the user's film.

`QA.md` records method, result, evidence path and open items for: material check, readable text, subtitles, sync, full decode, listening, canvas playback and editable project. Unrun items are `not_run`; capability limits are `blocked`; checks only the user can do are `needs_user_check`.
