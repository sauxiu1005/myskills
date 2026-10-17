# Deliver generated media to the canvas

## Descriptive names are a delivery requirement

This rule applies to every output in every request, including images, videos, batches and recovered web results. Every canvas title and final filename must describe the media in readable words in the user's language. Derive the description from the actual subject, scene, action or intended role, keeping it short enough to scan on the canvas. Preserve a user-supplied meaningful name; do not invent visual details that have not been verified. Use neutral content wording when only the requested subject is known. No specific subject or example name is a template for unrelated outputs.

CDN hashes, UUIDs, task IDs, URL parameters and resize suffixes are internal locators only. Never use them as canvas titles, filenames presented to the user, or final response labels. Do not merely prefix a hash with a descriptive word. For similar outputs use a meaningful distinction or a short sequence number, preserve the actual media extension, and check for naming collisions without overwriting another asset.

Resolve and save each output's descriptive name by output index in the private job directory **before any canvas-producing import**. Reuse this mapping on retries. Use a direct-URL importer only if it can set the descriptive name before creating a visible node. Otherwise download the same completed result to the private job directory and use the publication helper below to expose only the completed, descriptively named file. Do not first place a hash-named node and then rename it as the normal delivery path. If the host offers neither named import nor private download plus local import, retain the result privately and explain the delivery limitation instead of exposing a hash-named node.

After import, read back the real node title and registered filename for every output and verify that both are descriptive and contain no internal locator. Save those verified values with the stable asset/node identifiers in `delivery.json`. A successful download or import response alone does not pass this naming check. An unexpected hash title is a delivery defect: repair the existing node through the host's rename capability and verify it before claiming completion; do not create a second node or regenerate the media.

For already delivered assets, rename through the host so the asset ID, canvas references and file path stay consistent. Save the old-to-new mapping privately before changing anything; after each successful rename, update `delivery.json` with the actual returned path/name while retaining the node/output identity. Verify the original node still resolves and the underlying media bytes are unchanged. If renaming fails, keep the existing asset and receipt and report the naming issue; do not regenerate. Staged files bound by a recovery receipt stay at their recorded paths.

## Import successful outputs

After Jimeng reports success, identify the actual final image or video URLs in its response and preserve their order. Use only outputs from that submission or a uniquely matched user-created replacement accepted through the recovery flow below. Do not substitute thumbnails, invent URLs, or import a result-page HTML link as media.

Use the host's available external-media import capability to download, register and place each result in the current workspace. Preserve relationships with the reference assets when the host supports them. Follow the live capability description for accepted inputs and batch limits.

Require explicit import success and a real canvas node identifier for each delivered output. Immediately save its output index, registered asset path, node identifier and original task receipt in the job's `delivery.json`. Use atomic file writing; do not store expiring signed URLs or authentication material.

When resuming, import only output indices without a verified successful delivery record. An importer's duplicate check alone may not detect that the same URL was previously downloaded to a different file. Preserve already delivered outputs when another output fails.

Use the host's media inspection capabilities when quality, duration or dimensions need validation. Do not add shell media analysis or postprocessing to this workflow. A completed generation or a downloaded file alone is not evidence of canvas delivery.

## Local files and recovery

When the user requests local files, or direct URL import cannot set a descriptive name before placement or retrieve an output, use the official client's result-download capability for the same task receipt. Stage incomplete downloads inside the private job directory; only completed final media may be copied/imported into the visible asset library. Verify existence, nonzero size and media type through the host's available file and media capabilities.

Use the publication helper below for private CLI downloads. Wait for the host to discover and register the named file, then reuse its automatically placed node; only place the registered asset if no node exists. Do not assume that a file's presence in the workspace makes it a registered asset. If the required registration capability is unavailable, retain the local result and report the concrete delivery blocker; do not edit an asset database or repeatedly retry an unsupported import path.

If an output URL expires, query the same task receipt for a fresh URL. Download or canvas errors never justify another paid generation. After registration, use only the supported host rename flow above; never move registered files directly on disk.

## Publish a local output exactly once

Naming or registration is not media editing. Do not transcode, remux, or create a derivative with FFmpeg just to obtain a named canvas asset: editing can expose both the input and output. Retain the raw download privately; source relationships refer to the user's creative references, not an internal duplicate of the same result.

After the original submission is confirmed `generated` (or its verified recovery receipt exists), save `output.json` in the private job directory with `index` (zero-based output index), `localPath` (absolute completed media path directly inside this job), and `filename` (short content description plus the original media extension). Use the same mapping on retries. Then run:

```text
node <skill-dir>/scripts/publish-output.mjs <absolute-request.json> <absolute-output.json>
```

The helper preserves the original bytes and recovery path, saves a private publication receipt, and atomically publishes only the complete named file into the workspace. It never calls the CLI, processes media, overwrites another file, or marks canvas delivery complete. A repeat for the same index reuses its recorded filename; changing the name after publication is rejected. The header check is basic type validation, not proof of creative quality or a complete playable download; verify the completed download through the host's media inspection first.

`published_pending_canvas` means wait for host asset discovery, look up the returned path, and reuse the existing node. If registered but not placed, place it once with duplicate creation disabled. If the host cannot discover/register it, preserve this receipt and report that delivery blocker; do not create a second file or use editing as an import fallback. `already_delivered` means resolve the recorded node and reuse it. Read back the actual title and filename before writing verified `delivery.json`.

A one-output request must finish with one visible final-media node. Check the whole current job's node set, not just the newest node. If an earlier attempt exposed both the private source and its named copy, verify they belong to this exact output, keep the named final node, and remove only the redundant private-source node through the host. Keep its file and receipts; do not delete creative references or unrelated nodes. A leftover source copy is a delivery defect, not an extra deliverable.

## Completion

Before the final reply, perform the fresh post-generation credit lookup defined in step 6 of the skill and report the remaining balance (or that the lookup failed). This also applies when generation failed or delivery is blocked. Keep this information in chat, never as a canvas asset.

Check each delivered asset against the requested output count, media type and creative requirements. Reference the exact returned filenames in the final response using the host's asset-linking convention. Report any undelivered outputs accurately and retain their recovery records.


## Web acceleration or regeneration recovery

A web action can cancel the original queued task and create a separate VIP generation. Preserve the original `submit_id`; do not overwrite it with a guessed web identifier. Query the original receipt once when its status is unresolved. The inspected CLI's `list_task` lists saved CLI tasks; it is not evidence that all web generations are visible. An empty successful-task list cannot establish that the web result is absent.

1. Check current live CLI help and the available history for a uniquely matching replacement. Match the full prompt, reference identities/order, time window, model and output settings. A newest item, a matching duration, or a screenshot alone is insufficient. If a replacement is visible through the CLI, query its observed ID without submitting; keep both original and replacement identities in the private recovery evidence.
2. When CLI history does not expose it, inspect the existing Jimeng page using the host's supported browser capability. Respect its browser skill and access boundary. CLI login and browser login may be separate; reuse an accessible signed-in page. If login is needed, ask only for that login, never copy cookies or tokens between browsers.
3. Locate the completed card matching the request and inspect its preview/details. If several candidates remain plausible, ask which one; do not import all of them. Download the actual finished media from that card, or extract its direct media URL through supported browser capabilities. Do not click accelerate, regenerate, upscale or other paid actions during recovery. Do not treat HTML, a thumbnail or a screenshot of the result as the final video.
4. Apply the descriptive-name requirement before any canvas placement. Use direct URL import only when it accepts that name before placement; otherwise use the private download path above. Then save original task identity, replacement identity when exposed, matching evidence, and actual returned asset/node IDs in the private delivery record. If downloaded locally, stage a copy in the private job directory, validate duration/dimensions and content through the host's media capabilities, then use the helper flow below. Do not invent an ID when the browser does not expose one.
5. Import/register the completed local media through the host and place it on the current canvas, preserving reference relationships when supported. First check existing delivery records and canvas assets to avoid duplicate import after an interruption. Persist each successful output immediately. Keep the staged media until its delivery is verified; never move the file referenced by a recovery receipt.

For one recovered local output, write `web-result.json` beside the original request with `localPath` (absolute completed-media path in the same private job directory), `sourcePage` (the observed official Jimeng page), and `matchEvidence` (concrete facts establishing the unique match). Then run:

```text
node <skill-dir>/scripts/dreamina-runtime.mjs recover-local <absolute-request.json> <absolute-web-result.json>
```

The helper validates the original fingerprint, local media type/signature and file hash, then saves a separate `recovery.json`. It never submits a task and leaves the original state untouched. Repeated `run` now returns this recovered media instead of querying the cancelled original. Its basic file signature check does not replace the host's duration, dimensions and visual verification. This helper binds one replacement per job; for a multi-output batch, use per-output delivery records and preserve successful indices instead of rebinding the job repeatedly.

If neither CLI nor the accessible browser can retrieve the matched media, explain the specific missing access and ask for the smallest necessary handoff, such as opening that result in the supported browser or providing its download. Do not claim fully automatic cross-browser recovery when the host cannot access the browser containing the result.

## Keep internal records off the canvas

Only requested final media are deliverables. `request.json`, `state.json`, `recovery.json`, `web-result.json`, `delivery.json`, parameter notes, logs and locks stay under `.hilo/dreamina-jobs/`; never pass them to an asset importer or canvas writer. Asset auto-enrollment can happen immediately after a shell write, so hiding them only in the final response is insufficient.

For an older polluted job, preserve and migrate its full records before cleaning up. Inspect node details and remove only nodes whose backing paths belong to that job's internal files; do not remove unrelated user documents merely because they share a filename. Use the host's canvas removal capability, preserve a private recovery copy, and verify no internal nodes reappear after the next state update.
