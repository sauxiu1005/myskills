# Interaction model (v8)
- Free swim: waypoints chosen away from other creatures; pivot turns on head or tail with hysteresis; wide arcs toward the open side.
- Soft collisions: slight overlap allowed; separation only when gaps drop below half the summed radii (max 0.6 px/step). Goal: no clumping.
- Center card: not a wall; creatures pass under it with a feathered fade (min ~0.35 opacity).
- Feeding: click open water (not the card); food lives 20 s, max 15 on screen, up to 3 eaters per crumb; a much closer idle creature can take over a claim; turning sharpens within 90 px of the mouth.
- Hover lens: radius 100 px, magnification up to 11 %.
- Giant visitor: every 46 s (first at 5 s), deterministic lane farthest from others; residents predict its path and side-step; the fish school scatters.
- Custom creatures: `swim` reuses shark physics with a tail-weighted body wave; `pulse` reuses octopus physics with bell pulse and lower sway. Capsule radius and mouth are derived from the grid aspect ratio.

# Page API (for checks)
`window.ocean`: `renderAt(t)`, `feed(x,y)` (returns null inside the chat card), `getState()` (agents, creatures, foods, feedLog, invalidGlyphCount, visitor), `visitorGap()`, `setPointer(x,y)`, `hitTest(x,y)`. Append `?render=1` to the URL for deterministic stepping.
