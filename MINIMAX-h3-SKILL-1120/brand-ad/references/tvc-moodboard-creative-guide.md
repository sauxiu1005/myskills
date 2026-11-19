# Advertising scene anchors and storyboard

Use this method for unresolved art direction, a concrete missing visual state or a requested redesign. First inspect supplied reference images, storyboards, closing images and existing project assets. Reuse content that covers the current need, even if it has another filename or layout; a finished board panel may also supply a scene anchor or ending. Prepare consistency anchors and scene anchors only for actual gaps, without a separate KV deliverable. Product identity uses [product-anchor-card.md](product-anchor-card.md) only when existing identity coverage is insufficient; character coverage follows the main Skill's consistency-anchor guidance.

## Keep facts and invention distinct

Use two categories in the existing plan: **must be accurate** (real form, person identity, brand marks, specified text, confirmed states and approved requirements) and **open to creation** (environment, light, composition, palette, visual metaphor, spatial scale and emotion within the brief). Name actual sources for protected facts. Missing facts stay unknown; seek evidence or avoid showing the unsupported detail. Ordinary backgrounds and lighting in a source photo do not restrict art direction. Creative scale or metaphor does not establish physical specifications or product claims.

## Explore complete scene designs

Identify whether a missing image needs to anchor subject consistency or scene design. Consistency anchors preserve people, products and their needed views. Scene anchors establish spatial design, composition, materials, lighting and creative states without product-appearance, logo or text consistency requirements. Do not transfer final-film identity or typography constraints into the scene-image task, or require a scene image to include the real product before it is useful.

For a scene anchor, first evaluate a currently available image model whose strengths are decorative or editorial aesthetics, art-print or painterly direction, abstract experimentation and atmosphere exploration; use it when it satisfies the scene brief and no scene-specific hard output requirement rules it out. This is a recommendation rather than a lock: a capable user-selected model takes precedence, and a capable alternative is valid when necessary references or output limits require it. Use identity-preserving capabilities for consistency anchors. Mix models by role instead of forcing one model across the set. Prefer text-only scene design; add only references needed for the environment or accepted art direction, without automatically feeding in product or character cards or inheriting their ordinary lighting.

Each scene anchor expresses a complete spatial idea with a focal relationship, rather than a collage of unrelated style fragments. An environment without a person or product is valid when it clearly conveys the intended space, light and event. Use a provisional subject only when scale or action relationships require one; it supplies neither verified identity nor new product facts. Decide the expressive purpose before the photographic technique:

| Visual proposition | What it can express |
| --- | --- |
| A small subject in a vast space | Isolation or power through a deliberate scale relationship |
| Extreme proximity to a contact point | Touch through material response and physical interaction |
| Foreground occlusion with a bright area deeper in the frame | Discovery through partial access and a directed gaze |
| Related shapes in two different subjects | An association made visible through form |

These are choices, not required shots. Select camera height, lens, light and palette to realize the chosen proposition. “Premium,” “cinematic” and “high tension” alone are not visual ideas. Preserve verified originals and consistency anchors separately for video production; approval of scene design does not authenticate a provisional subject. When the feature-matched scene route is not used, state the scene-specific requirement that caused the change.

## Shape the set by visual rhythm

A first scene exploration usually starts with **3–4 complementary visual states**, adjusted to actual gaps and the agreed scope. Existing coverage can reduce that number to one or zero; do not add images simply to reach it or apply this count to consistency anchors. Each state should add information, an action change or an emotional contrast.

| Dimension | Question across the set |
| --- | --- |
| Shot scale and subject proportion | Does a change of distance or size reveal something new? |
| Information and action state | What is discovered or changes in each image? |
| Energy and emotion | Where does tension gather, release or turn into another feeling? |

Do not mechanically alternate wide, medium and close shots, or produce several equally intense hero shots. Shared identity and art direction allow different views. Match a viewpoint only when a before/after comparison or a specific transition needs it. Independent proposals can be prepared together; a genuinely dependent state waits for its reference. Different reference roles may use different models. The set is not a fixed shot count, a seconds-per-image plan or a mandatory grid.

## Design the image directly

Before writing an image prompt, decide what the viewer notices, why this view serves the idea and what can happen from it. Put those choices straight into the prompt; no extra visual-reasoning card or mandatory field table.

- **View and hierarchy:** camera height/distance, scale, silhouette, first gaze and where attention goes next. Use asymmetry, framing, negative-space tension, depth corridors, occlusion or scale contrast when they serve the idea.
- **Space:** a useful foreground, subject plane and background, separated by perspective, value, focus or color. Empty space can carry movement or type. Suspended subjects need no invented ground plane or contact shadow.
- **Light and materials:** name the source/direction, hard-soft relationship and controlled bright/dark masses. Show glass thickness/refraction, metal microtexture, liquid surface tension, cloth tension, paper fibers or other relevant tactile evidence. Avoid generic “premium” as the only instruction.
- **Action potential:** an expressive state with room for the intended movement, accessible moving parts and a visible consequence. A still can capture a high-energy instant; it need not be a parked product pose.

A coherent world can contain contrasting locations, scales, lighting states and compositions. Inherit the accepted spatial relationships and art direction without repeating a scene anchor's framing. Preserve a strong aesthetic idea even when the motion requires another viewpoint; subject identity comes from the separate consistency sources.

## Scene anchor prompt template

When a needed scene or state lacks visual coverage, design that environment as a scene anchor. It need not be a complete product advertisement or carry exact lettering. A usable existing scene image or storyboard frame requires no replacement. Do not render an extra combined product-and-scene still merely to bridge into video.

```text
Create one scene-design anchor for {creative idea and needed environment/state}, {canvas}.
Its visual idea is {specific relationship or striking observable event}.
Its role is environment, composition, light and mood, not product identity or exact lettering.
Use {scene/style source, only when needed} for {spatial relationships or look}.
{Optional provisional subject only for scale or action, without identity authority}.
Place the viewer {position, angle and distance}. First read {focal event or spatial feature}, then
lead the eye through {gaze path} to {consequence or revealing detail}.
Build tension through {specific scale, depth, occlusion, value or spatial relationship}.
Foreground {element and role}; focal plane {state and relationship}; background {world}.
Light from {source and direction} shapes {bright/dark masses} and reveals
{specific surface thickness, texture, reflection/refraction and contact}.
The palette follows {brand/material/environment logic}; focus resolves {important plane}.
Leave room for {intended action, subject placement or environmental change}.
One coherent scene image, without requiring product details, logos or readable copy.
```

## Grid storyboard prompt template

Use a supplied storyboard directly when its sequence and visual information support the requested film; retain accepted order and events. A written shot plan can be sufficient without a generated board. If only one state lacks needed visual information, reuse or extract an existing frame first, then supplement that state only when necessary. Create a new board only when unresolved visual relationships would benefit from it or the user asks for one; distinct states alone do not require a new board. The template below applies to new board generation, not to the eligibility of user work.

Select panels for meaningful changes, not one per second or one per generation unit. A panel can represent an accent, a discovery inside a long take, or a recognition state. Panel spacing does not encode shot length. The board explores and communicates the treatment; it is not an immutable sequence of equally long static pictures.

```text
Create a professional commercial storyboard for {subject and concept}, {film duration
and format}, using {readable panel layout chosen for the important visual states}.
Identity: {consistency sources and protected features}. Art direction: {scene-anchor contributions}.
Editorial intent: {how sensation/emotion develops, where density gathers and releases}.

Panel {label}: {what is discovered or felt}; {subject state and action};
{distinct shot scale, viewpoint, focal hierarchy and foreground/background relation};
{physical or stylized light logic and tactile material response};
{motion space and visible relationship to the adjacent state}.
Repeat for the selected states with deliberate differences in scale, perspective,
composition and energy. Keep identity consistent, not the same camera setup.

Render each panel at finished commercial-art quality, not rough thumbnails.
Keep essential geometry readable; reserve any panel labels outside the image areas.
Do not invent packaging text or use tiny panels as the only source for exact marks.
The grid is planning guidance, not a request to animate borders or play equal-length cells.
```

Before using a result, assess the actual available image for identity, focal hierarchy, light/material finish, visual contrast between panels and usable movement. A beautiful grid alone does not prove video rhythm. Develop the final video treatment from the strongest usable states; do not automatically soften the camera to match their stillness.

## Ending card and input selection

When the ad requires logo or brand-name exposure, reuse a supplied ending card, closing storyboard panel or other approved image that already provides the required composition and identity. Create or edit only a missing closing image, grounded in the verified asset or approved original identity. Position it in the upper safe area, legible over a brand-relevant environment/material background that can keep moving or changing light. Preserve mark geometry and spelling; do not use a generic pure-white logo screen unless requested. This is preparation for a specific brand-exposure gap, not a requirement to turn every scene anchor into a branded advertisement. Brand identity enters in image preparation, not as a later overlay.

There is no universal optimal reference count. Check the selected model/mode's actual modality and combination limits. Use a reference when it supplies a missing identity view, visual state, look, motion or sound contribution. Resolve conflicts and similar redundant images. Do not submit the entire preparation library to every clip.

Prefer original identity images and clear selected panels for precision; use a full board only when its detail and role are suitable. Extract a readable panel when possible; separately generate a needed high-resolution state only within the planned scope, not every panel by default. User-required references remain required unless a capability conflict is resolved with them.

Each actual video input gets a plain-language role: a consistency anchor supplies subject identity; a scene anchor supplies space, art direction and state; other relevant inputs may supply an ending, motion or sound. Explain their combination and transfer limits in the video prompt. A provisional scene subject cannot override the real product, person or mark. Use a supported reference combination that keeps these roles distinct. If the selected capability cannot keep them distinct, resolve that specific conflict within the agreed scope instead of automatically generating combined advertising stills. The video prompt supplies movement and editing between states. Ordinary references do not fix first/last frames; exact binding needs intentional creative purpose, supported capability and an explicit plan.
