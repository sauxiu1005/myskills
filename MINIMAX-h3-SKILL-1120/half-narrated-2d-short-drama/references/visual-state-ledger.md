# Visual State Ledger Template

Use this ledger to keep continuity stable across a 2D half-narrated short drama. Every entry must be **2D cel + webtoon** language — no 3D, no photoreal, no live-action drift.

The main Skill's narration-handoff boundary and scoped rework/stop rules override this reference. This ledger provides evidence, not authorization to regenerate clips, change an approved contract, or start final assembly/export. Preserve unaffected approved assets and record actual dependency impact separately from suspected drift.

## Per-shot ledger fields

- Shot ID
- Character pose and position
- Screen-space position (left / center / right)
- Depth layer (foreground / midground / background)
- Facing direction and eyeline target
- 180-degree axis and entry / exit direction
- Character expression
- Prop state and orientation
- Scene layout
- Lighting direction
- Time of day
- Background motion
- Emotional state
- **Style check** (one-line confirmation that the shot stays within the locked sub-mode)
- **First-frame anchor** (cross-reference to storyboard, kept short here)
  - `first_frame_source`: file path
  - `referenced_asset_ids`: character / scene / prop IDs used by the shot
  - `asset_bindings`: visible entity -> asset ID mapping
  - `backend`: `the platform’s currently available video capability`
  - `generation_mode`: `platform-supported reference mode`
  - `resolution`: `768P` or `2K`, selected before generation

## Secondary-character continuity gate

Every visible secondary character or extra must map to its stable character-card asset ID in `asset_manifest`, with position, facing, eyeline, and identity/wardrobe distinction recorded. A missing binding blocks that shot's submission. Observed drift fails qualification of that shot, not delivery of the existing narration handoff materials with clear findings. Record shot/time evidence, inspect neighboring handoffs and real reference dependencies, and request scoped repair only for proven invalidated outputs; never automatically rerender a continuous chain.
  - `reset_anchor`: `true` / `false`
- What must remain unchanged
- What must change in the next shot

## Continuity rules

- Write concrete visual facts, not moods.
- Each entry must be usable as the next shot's opening state.
- Keep identity anchors separate from transient motion.
- Mark any reusable prop or scene state explicitly.
- **Style block consistency**: compare the actual image and approved style, not wording alone. A differently worded check is a possible issue to inspect, not proof that media failed. If a prompt correction is needed, propose and approve the affected contract change; do not rewrite the ledger to conceal drift or regenerate without authorization.
- **Optional reference consistency**: when a shot uses `first_frame_source` or `last_frame`, the ledger path must match the storyboard and generation request. If no image reference is used, spatial layout and asset bindings remain mandatory.
- **Last-frame archive**: after the shot is generated, write down the path to `clips/shot_NN_last.png` so the next-shot ledger entry can reference it.
