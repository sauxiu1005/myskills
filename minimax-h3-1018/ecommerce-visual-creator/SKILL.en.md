---
name: ecommerce-visual-creator
description: "Turn product facts and refs into e-commerce visuals, PDP copy, Listing/A+, audits, localized briefs, editable Photoshop sources and optional promo videos. Never invent claims or evidence."
trigger-words: [e-commerce visuals, PDP, product promo, product promotional video, 商品宣传片, 产品宣传视频]
---

# E-commerce Visual Planning and Execution

Use the user/session language for interaction and the confirmed target-market language for customer-facing content.


## Core principles

1. **Evidence first**: user-provided product/packaging/qualification data > verified current official platform rules > bundled references > explicit assumptions.
2. **Route by intent**: deliver only the layer the user needs. Do not force the full workflow when the task is an audit, a storyboard, or a one-shot delivery.
3. **Never turn assumptions into facts**: do not invent certificates, tests, patents, sales, reviews, rankings, claims, or platform rules.
4. **Lock visual identity before execution**: product identity, composition, palette, lighting, typography, background, reference fidelity, and negative constraints must stay consistent.
5. **Treat platform rules as time-sensitive**: verify current official sources when the answer depends on present-day image rules, category policies, dimensions, claims, or qualifications.
6. **Do not provide final legal conclusions** for regulated or high-risk categories.

- **Canvas first, Photoshop after final approval:** First create complete main images and detail-page artwork on the canvas, including their intended copy, typography, labels and layout. Do not call Photoshop for connection checks, previews, font discovery, typesetting, image edits or source preparation before the user explicitly approves the finished artwork and its exact scope. After that approval, default delivery includes Photoshop multilayer sources and matching finished previews. Planning, copywriting, prompt-only and audit tasks do not trigger source production; respect an explicit flat-image-only request.
- **Video model selection is mandatory:** The two standard choices are MiniMax H3 and SD 2.0; neither is selected automatically. For each new actual video-production task, verify live availability and show an interactive single-choice question card before the first video generation: “Which model should be used for this video?” with exactly two standard options, “MiniMax H3” and “SD 2.0”, in that order. Wait for the user's explicit choice; do not infer it from silence, “continue”, an old task, or the previous automatic default. Record the selection for this task and use it consistently for all shots and retries; do not ask again for each shot or on continuation of the same task. A new video task requires a new card. If a candidate is unavailable or incompatible, disclose the limitation and obtain an explicit compatible decision; do not silently select the other model or substitute a different variant. A user request outside these two options is an explicit exception to resolve, not an automatic third option. Model selection does not waive artwork, creative, storyboard or complete shot-visual approval and does not authorize generating media from planning-only or Skill-editing requests. Preserve live catalog display names and validate duration, reference capacity, frame and resolution for the chosen model; do not reuse the old model's settings blindly.

## Execution modes

### Standard
Use when direction is ambiguous, production cost is high, or the user explicitly asks to review strategy/storyboard first.

### One-shot
If the user explicitly asks for a complete answer in one pass, or the inputs are already clear, complete strategy, storyboard, execution cards, and canvas artwork without unnecessary intermediate pauses. For video requests, also follow the creative and storyboard approval gates in the promotional-video branch. This does not waive final artwork approval before Photoshop: a request to finish a set does not approve images that have not yet been shown.

### Audit / revision
When the user already has images, copy, prompts, or a detail page, identify the highest-impact problems and make the minimum necessary changes rather than rebuilding everything.

### Designer handoff
Use `references/output-contracts.md` for structured deliverables that a designer or image-generation model can execute without guessing.

## Workflow

### Step 0 — Route the task

Identify the requested surface: main images, PDP/detail page, Amazon Listing/A+, ad creative, on-image copy, storyboard, image prompts, compliance review, cross-border localization, or product promotional video.

Collect only blocking inputs: product, target platform/market, audience, core features, available evidence, and visual references. Ask at most three questions when missing information would materially change positioning or compliance. Otherwise proceed with explicit assumptions.

### Step 1 — Build an evidence ledger

Classify every important claim as:

- **Verified** — directly supported by user materials or a reliable source.
- **Supported** — can be translated from verified facts without expanding scope.
- **Needs proof** — requires a test, certificate, official rule, approval scope, or other evidence.
- **Disallowed** — fabricated, misleading, unsupported regulated claims, or false endorsements.

Only Verified and Supported claims may appear as facts in the final output.

### Step 2 — Select the conversion driver

Choose one primary and at most one secondary driver:

- Visual / sensory
- Pain point / efficiency
- Rational / parameter-led
- Trust / evidence-led
- Emotional / identity-led

Translate the top three purchase reasons with `Feature -> Advantage -> Benefit -> Evidence`.

### Step 3 — Lock the Campaign Style

Define:

- Product identity and immutable details
- Composition and viewing angle
- Color system
- Lighting system
- Typography and information density
- Background and scenario system
- Reference Fidelity: what must stay vs. what may change
- Negative Constraints

When the user provides product or packaging images, fidelity to the real product takes priority over decorative improvements.

### Step 4 — Plan the storyboard

Do not hard-code five images. Five is only a useful default.

Common roles:

- Hero / KV
- Benefit
- Proof
- Comparison / selection
- Scene / lifestyle
- Spec / CTA

For platform-specific strategy, load `references/platform-playbooks.md`. If the user asks about a current platform rule, verify the latest official source when possible.

### Step 5 — Execute

For each image/module deliver:

1. Visual task
2. Scene/composition description
3. On-image copy
4. Design rationale
5. Image-generation prompt
6. Negative prompt / forbidden changes
7. Evidence note for data, claims, qualifications, or comparisons

For cross-border work, localize instead of literally translating. Preserve factual scope while adapting units, use cases, language length, and purchase reasoning.

### Canvas artwork before Photoshop

1. When actual image production is authorized, use the available canvas image-creation and editing capabilities to make complete customer-facing artwork, with the approved copy, typography, numerical information and layout integrated into each main image or detail-page module.
2. Show the finished designs on the canvas for review. Bare photographic backgrounds, copy documents, storyboards, prompts and internal contact sheets do not substitute for finished artwork. Preparatory references may support creation, but must not become a detour into early Photoshop typesetting.
3. Apply beauty, composition, copy and typography revisions to canvas artwork first. Do not alternate between generating a bare image and opening Photoshop to finish each preview. If the canvas route cannot complete a required treatment, report the limitation instead of silently bypassing the approval gate.
4. Stop for final user approval of the actual finished main images and detail images. Record which displayed versions were approved. Approval of a brief, style, sample or a direction to continue the remaining images is not final approval of the unseen set.

### Preserve inputs for later layered production

Retain original references, reusable visual inputs, exact copy and the final canvas designs without starting Photoshop. A composed or flattened canvas result is acceptable for final visual review; editable sources are reconstructed only after approval. In that later phase, rebuild copy as live text and prepare replaceable subjects, masks or smart objects where appropriate. Disclose what had to be reconstructed and what remains integrated in a photograph; a flattened visual target does not prove that original editable layers exist.

### Step 6 — Quality gate

Hard blockers:

- Invented or untraceable evidence
- Product identity conflicts with source images/materials
- “Needs proof” claims written as facts
- Unverified current platform rules stated as certain requirements
- Unsupported medical, health, or guaranteed-effect claims

Five Pass/Fail dimensions:

- Evidence & compliance
- Conversion logic
- Visual hierarchy
- Consistency
- Executability

Fix every Fail before delivery. If the user explicitly wants numerical scoring, use anchored 1–5 scores instead of arbitrary 80/100-style precision.

### Final artwork approval gate

Internal quality checks do not count as user approval. Present the finished canvas images and ask the user to accept these specific versions before Photoshop. A brief or style confirmation, acceptance of one sample followed by a request to complete the set, or a request to continue beautifying must remain in canvas production. An explicit approval such as "These finished main images and detail pages are final; proceed to Photoshop" unlocks only the identified versions. If only a subset is explicitly finalized for source delivery, process that subset alone; do not infer approval for the rest. A later revision reopens canvas review for the affected image before its Photoshop version is updated.

### Step 7 — Photoshop layered sources and canvas delivery

1. Enter only after the finished canvas artwork passes quality checks AND the user explicitly gives final approval of the identified versions. Then proceed to Photoshop without asking for PSD authorization again. Reproduce the approved main images and detail images faithfully; do not use this phase for new art direction, unapproved copy changes or trial designs.
2. Only after that approval, verify actual Photoshop editing, saving and source-file delivery capabilities. Check the delivery route before batch source production. Neither a software name nor an export request proves completion; if source files cannot be delivered, disclose the blocker and obtain a user-approved alternative rather than claiming canvas source delivery.
3. Organize meaningful named layers/groups for existing backgrounds, products, people, decoration, text, marks and effects. Preserve live text, replaceable smart objects, non-destructive masks and adjustment layers where appropriate. Do not create empty or duplicate layers merely to increase layer count.
4. If only flattened artwork is available, separate or reconstruct required elements and remove baked-in text before rebuilding it. Disclose reconstructed or unrecoverable areas; do not claim recovery of original layers that never existed.
5. Deliver separate PSDs for independent designs by default. Organize long detail pages into editable module groups. Use an appropriate Photoshop large-document format when actual PSD limits require it, and explain the choice.
6. Reopen saved files and verify layer structure, text editing, asset replacement, masks, missing fonts/links and visual fidelity against approved artwork. A PSD containing one flattened image or repeated whole-image layers is not an editable design source.
7. Save real sources in the current project and display openable/downloadable file nodes with corresponding previews on the canvas. A preview or chat path alone does not complete source delivery. Do not duplicate automatically registered assets.
8. If Photoshop, export or canvas file delivery is unavailable, retain completed flat artwork and report the precise blocker. Offer connection, retry or a user-approved alternative. Never fake a PSD, rename a PNG as PSD, or silently substitute another application while claiming Photoshop execution.

### Artwork-to-video handoff — mandatory order

1. Complete the requested e-commerce main images and detail artwork, show the finished versions, and obtain the user's final approval of the exact artwork scope before developing video content. A raw product reference, a style approval, a storyboard or an unfinished draft does not satisfy this gate. Reuse already finished and approved e-commerce artwork rather than generating it again.
2. Immediately after final artwork approval, ask once whether the user wants a promotional video based on these images, with clear yes / no / later choices. This offer is not generation authorization. If the user already explicitly requested video, do not ask again; continue to missing-input intake. Respect a decline and do not repeat the offer unless the user reopens the request.
3. Plan every storyboard shot as 5 seconds and the full film as 15–30 seconds, including titles, transitions and ending. Offer 15 / 20 / 25 / 30 seconds (3 / 4 / 5 / 6 shots) when unknown. An out-of-range or non-multiple-of-five request needs a compatible-duration choice or explicit timing-scope exception, never silent alteration. Validate each final shot and the actual total export duration.
4. If video is wanted but requirements are unclear, show a question card before video planning or production. Ask only unresolved items, up to three questions per round: (a) exact duration within 15–30 seconds using five-second shots, (b) video aspect ratio / orientation and any explicit pixel-size need, (c) music choice: generated music, user-supplied music or no music, including mood when needed. Examples such as 15 / 20 / 25 / 30 seconds and 16:9 / 9:16 / 1:1 are choices, not defaults. Existing still-image dimensions do not automatically lock video framing. Reuse explicit confirmed video choices; resolve voice or sound effects only when requested or necessary, and keep subtitles opt-in. Never fill unknown duration, framing or music with unapproved assumptions. Other missing creative inputs are collected only if blocking.
5. Build video content from the approved artwork: map selected main/detail images to hook, visible surface/details, verified specifications, use scenes and CTA. Reuse their product identity, approved copy, design language and intended market; motion must not invent unseen structure or factual claims. Video creative and full-duration storyboard approval remain required. Every shot needs an approved visual reference before video production; reuse adequate finished artwork, and batch-create only missing storyboard visuals. Planning images never replace approved artwork or its factual authority.
6. If video is requested before artwork exists or is finalized, explain the prerequisite and finish/review the artwork first. If the user supplies suitable completed artwork, ask only whether those exact versions are final unless approval is already explicit. A no-still-generation request can proceed with such approved existing artwork; if none exists, pause to request it or clarify scope instead of generating unauthorized stills or bypassing the gate. Planning-only requests may deliver a provisional document but cannot unlock video production.
7. The video offer does not cancel or block agreed still-image source delivery. Approved flat artwork is sufficient for video reference; PSD reconstruction is not a prerequisite for video. A video request does not authorize new PSD work or rework of unrelated artwork.

### Five-second shot production supplement

Read `references/product-promo-production-supplement.md` for every promotional-video task. Apply script → storyboard with audio plan → approved per-shot visuals → per-shot videos → approved audio layers → resource-ready edit and export. Its 5-second shots, 15–30-second total and per-shot visual coverage supersede older segment defaults, without bypassing approval, evidence or source-matching gates.

### Match every video shot to finalized detail artwork

The finalized detail artwork is the shot-level authority for product composition, the demonstrated feature, explanatory copy and visual treatment, not merely an identity or color reference. Apply composition matching even to text-free video. An explicitly approved departure takes precedence only for the identified shot and property; do not infer a redesign from a request to animate.

1. **Bind sources before writing shots.** For every shot, identify the exact approved artwork/version and, for a long page, its module or region. Record what each source contributes: product identity, composition, demonstrated feature, copy or visual treatment. A detail-demonstration shot must use its corresponding detail module; an approved main image may support an opening or ending. Do not arbitrarily borrow another module's copy. A page may supply several shots and one shot may combine compatible sources, but their contributions and any approved departures must be explicit. Cover all user-required modules; selection or compression follows the approved scope, not a silent omission.
2. **Carry concrete composition and visible design.** Record the source product view/orientation, open or closed state, scale within the frame, placement, crop, key parts, relation to people/props, background structure, lighting character, negative space and visual reading order. Preserve the relevant product-to-text relationship, close-up/inset arrangement, arrows and label endpoints. Let the actual artwork carry palette and fine visual detail. Do not reduce a close-up detail module to an unrelated generic centered hero shot or replace its setting with a new studio template merely for convenience.
3. **Make the words describe the visible subject now.** Reuse accurate approved wording from the bound module, with its verified facts, units and qualifications. While a feature label is readable, its named part or use must be visible and unambiguous; keep leader lines attached to that part throughout motion. A mechanism explanation must show that mechanism, not another surface or a beauty shot. Do not attach one module's dimensions, component name or performance claim to another. A picture alone is not evidence of material composition or performance. Follow the existing typography rules for exact copy, font verification and approved substitutions; text-free requests remain text-free.
4. **Adapt to time and frame, not a new campaign.** In the full-duration storyboard, specify the source-matched composition during the main readable hold and the allowed entrance, exit, camera or product movement. For a new aspect ratio, preserve relative hierarchy, product recognizability, the named detail and product-to-copy association through proportionate reframing, spacing and line wrapping. Do not stretch the product, crop out the proof detail, recreate unsupported hidden structures or replace the source design with a generic overlay. If the requested motion or ratio genuinely conflicts with those anchors, show the specific adaptation for approval before production. Previously approved identical decisions are reused.
5. **Carry the mapping into actual production.** Each shot brief and production reference set must carry its bound artwork, concrete composition anchors, corresponding feature, exact approved copy and permitted motion. Attach the actual source images, not filenames or a prose summary alone. Additional clean product images and planning boards supplement, but never displace, the bound detail artwork; if reference limits prevent carrying required sources, resolve the route before generation. Ordinary references do not become exact opening or ending keyframes unless the user requests that timing. Separately composited text must still match the source design and the moving part it explains.
6. **Approve a complete correspondence table.** Include the table below within the existing storyboard review, not an extra duplicate approval round. Missing bindings, unreadable relevant source detail, conflicting versions or unresolved deviations block the affected shot. Request a readable replacement or the smallest needed decision; do not guess, silently drop a required module or use a generic substitute. A full source-to-shot mapping is required before video production, and all existing creative, artwork and storyboard gates remain.
7. **Verify shots against their own source.** Review each shot's representative composition/readable-hold frame beside its bound module, then play its motion and text timing. Check product state/view/scale/placement, visible feature, setting, composition, exact copy, typography, arrows, hierarchy, readable association and approved adaptations. A matching product with unrelated composition, or readable words describing an absent part, fails. Record per-shot pass/fail/unchecked with source version; repair only the failed shot or overlay and preserve accepted footage. Metadata and successful export do not prove visual matching; disclose unavailable review instead of passing it. This rule does not authorize regenerating existing media.

| Shot / time | Source artwork / version / module | Product composition and visible feature | Exact approved copy / evidence | Typography and product-to-text relationship | Motion, readable hold and frame adaptation | Approved departures / review result |
|---|---|---|---|---|---|---|
| Complete for each planned shot | Identify actual source and each contribution | View, state, size, position, crop, background and named detail | Use approved wording or explicitly text-free | Hierarchy, position, labels and leader endpoints | Keep the matching detail visible while its words are readable | None, approved change, or unresolved; pass/fail/unchecked after rendering |

### Video typography must inherit the finalized artwork

Apply this rule whenever the approved promotional video needs on-screen advertising copy, specifications, labels or a CTA. It does not add text to a text-free video or authorize dialogue subtitles.

1. **Use the finished design as authority.** Before composing overlays, inspect the relevant finalized main/detail images and available approved copy or editable sources. Bind each text-bearing shot to a specific source artwork/version. Reuse its exact approved wording, language, numbers, units and qualifications. Select relevant existing text rather than copying the entire page. Verify uncertain letters or figures against the approved copy/source or ask; do not trust visual guessing. Shortening, translation, new facts or a new CTA require explicit approval in the storyboard. Do not resurrect unsupported claims merely because they appear in an image.
2. **Carry the whole typography system, not just the words.** Record headline/subheading/specification hierarchy, font family when verifiable, serif/sans character, weight, relative size, tracking, line spacing, line breaks, case, alignment, text position, margins, color relationships and any existing strokes, shadows, labels or background shapes. Let the source images carry their visual palette. Different shots may inherit different module roles, but they must form the same campaign system. Resolve genuinely conflicting approved styles with the user rather than mixing them arbitrarily.
3. **Adapt the layout to motion without redesigning it.** Retain source hierarchy, alignment, relative placement and whitespace; adapt size, wrapping and position only for the confirmed video frame, readable hold and subject movement. Keep text within safe areas and away from products, faces, paws and action paths. Use restrained entrance, hold and exit that fit the source design. Scene-attached or tracked lettering is used only when approved and technically feasible, not as a default effect. Do not replace the source treatment with generic white subtitles on a dark translucent rectangle, boxed parameter cards or decorative fonts unless that treatment belongs to the approved artwork or the user approves a change.
4. **Verify fonts and production capability.** Prefer a known, available and authorized original font or authorized supplied typography assets. A raster image alone does not prove the font name. If the exact font is unknown, unavailable or unsupported, disclose that limitation and request the font/source or approval of a visually matched substitute. Do not silently fall back to a system font or claim exact reproduction. If the current rendering route cannot reproduce the approved typography, resolve a supported composition route or an approved alternative before rendering; do not lower the design standard merely for convenience.
5. **Make it reviewable and render accurately.** The video storyboard records source artwork, exact copy, type hierarchy/style, placement, animation and readable timing for each overlay. Include typography in storyboard approval; a changed style needs a focused preview or review before final composition. Prefer clean footage with a separately composited, source-matched text layer when generated lettering cannot stay accurate. Do not paste a flattened whole poster over moving footage, duplicate baked-in text, or accept invented lettering. Reuse already approved style decisions without asking again.
6. **Compare the rendered result with the artwork.** Inspect representative video frames side by side with the source designs, and play the text entrance, hold and exit. Check wording, numbers, hierarchy, font appearance, spacing, alignment, palette, shapes, readability and moving-subject occlusion. Metadata or successful export alone cannot establish visual consistency. Repair only the affected overlay/shot; preserve valid footage. If verification is unavailable, say what remains unchecked. All existing artwork approval, Photoshop boundaries, opt-in subtitles and the 30-second total cap still apply; adding this rule does not authorize regenerating existing media.

### Product promotional video branch

When the user requests a product promotional video, read and execute `references/product-promo-workflow.md` in this Skill. It embeds the user-supplied promo-video process: source validation → product visuals and creative approval → full-duration Hook-Body-CTA storyboard approval → capability checks → approved per-shot visuals → five-second shot videos and approved audio layers → resource-ready assembly/export → final-cut review and delivery. Do not substitute a single immediate full-film generation for this process.

Apply the mandatory video model selection card above: MiniMax H3 or SD 2.0, with no automatic default. Reuse only the model choice explicitly confirmed for this same video task; before generation, stop if that choice is missing. Reuse confirmed intake, product identity and campaign decisions. When direction is unset, propose three options and resolve product-only versus model use. Quick draft/one-shot modes do not waive creative and storyboard gates. Respect a no-still-generation request by reusing finalized, user-approved e-commerce artwork and per-shot visual references; if any shot lacks adequate visuals, request them or an explicit scope change; if no approved artwork exists, pause at the artwork prerequisite; conditional planning images never unlock Photoshop. Resolve audio before dependent production, keep subtitles opt-in, and obtain unresolved production/assembly decisions before spending. Plan-only requests stay document-only; a Skill modification never authorizes media generation. Do not claim quality acceptance from file metadata or a timed-out review.

## Reference loading

- `references/product-promo-workflow.md` — required only for product promotional-video requests; full integrated production and approval flow.

- `references/compliance-rules.md` — claims, evidence, regulated/high-risk categories.
- `references/platform-playbooks.md` — platform and cross-border differences.
- `references/output-contracts.md` — strategy, storyboard, execution, audit, and localization templates.
- `examples/README.md` — example inputs and expected behavior.

<!-- local-adaptation-3.3.1 -->

*E-commerce Visual Copywriting v3.3.1 · Canonical entrypoint: SKILL.md*
