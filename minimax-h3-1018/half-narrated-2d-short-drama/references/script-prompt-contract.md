# Script / Prompt / Narration Contract v2.0

This contract prevents prompt drift and narration paraphrase. The approved script manifest is the only source of spoken text.

The main Skill's narration-handoff boundary, scoped authorization, and stop rules govern this reference. Contract validation cannot authorize extra synthesis, whole-batch invalidation, final assembly, mixing, subtitle burn-in, or exported-file QC. Approval of a contract revision and approval to generate media are separate decisions.

## Canonical line record

```yaml
script_line_id: "S03-N02"
channel: "narration"
source_text: "那一刻，我终于看清了龙椅后面的人。"
approved_version: 1
source_hash: "sha256:..."
```

`source_text` is immutable after approval. A punctuation, number, name, particle, tense, or word change is a content change and requires a new version plus user approval.

## Shot prompt record

```yaml
shot_id: "03"
script_line_ids: ["S03-N02"]
narration_text: "那一刻，我终于看清了龙椅后面的人。"
dialogue_line_ids: []
referenced_asset_ids: ["char_protagonist", "char_opponent", "scene_throne_room"]
spatial_layout_hash: "sha256:..."
script_manifest_sha256: "sha256:..."
shot_manifest_sha256: "sha256:..."
prompt_text: "...generated mechanically..."
```

The prompt builder must interpolate the exact approved text and IDs. It may add camera, action, spatial, style, and asset-binding instructions, but may not summarize, reorder, or invent story events. Narration text is metadata for the audio pipeline and must not be presented to H3 as character dialogue.

For H3 shots with dialogue, the prompt must include the audio constraint `dialogue-only; no narrator, voiceover, commentary, or descriptive speech`. This constraint is checked in the submitted payload and does not replace post-generation audio validation.

## Preflight and postflight

1. Before H3 or TTS submission, display the line IDs, exact source text, asset IDs, spatial layout, hashes, and rendered prompt for confirmation.
2. Reject any record with a missing line ID, hash mismatch, text mismatch, unbound visible character, or missing asset.
3. After submission, compare the request payload and provider log to the record. Store the exact payload hash.
4. Align narration against `source_text`, verify suspected recognition errors by listening, and record affected line IDs/time ranges. An omission, insertion, substitution, or reordering fails the affected interval, not automatically the entire batch. Missing evidence remains unverified. Apply the local-repair exception in `voice-presets.md` only after scoped authorization; retain qualified audio.
5. For the narration handoff package, verify narration timing sources, narration audio, and shot manifest all reference the same `script_line_id` and source hash. Final subtitle placement and video assembly are user-owned.

## Repair rule

Do not conceal mismatches by silently editing the script/prompt or speeding up speech. If the approved record is correct and only its generated output is defective, preserve that record and propose a repair of the affected audio lines or shot; no new script version is needed merely because generation failed. If the record itself must change, propose the exact delta and affected dependencies, obtain content/contract approval, and increment its version before submission.

Content approval alone does not authorize media regeneration. Separately resolve the concrete outputs, attempts, cost exposure, and stop conditions unless already explicitly authorized. Record real original/repair batch IDs and replacement provenance; do not label a pickup batch as the original session. A whole narration replacement requires evidence or an explicit episode-wide voice-change request plus separate whole-batch generation authorization.

Recheck only affected records and actually changed timing/continuity dependencies; preserve unrelated approved text and media. Respect the main Skill's shared limits and end at narration handoff. Returning to a repair step never restarts the whole episode or opens final post-production.
