# Reference research — TASK-MOCKUP-001

## Scope and waiver

- Destination tracking reference: `TASK-MOCKUP-001` (approved local-only tracking).
- Mobbin MCP was not available in the active tool inventory on 2026-08-30.
- The user explicitly approved continuing without Mobbin: `без мобина просто форкай`.
- This is a prototype-only waiver and recorded validation debt, not a claim that Mobbin research was completed.

## UX reference: Dresser

- Source: https://dresser.mishanaer.com/
- Inspected behavior from the supplied reference and prior conversation research: a browser-local mockup editor accepts user media, composes it inside a device presentation, exposes background/layout adjustment, and exports the visible result.
- Applied only to the shortest core sequence: open editor, choose a still image, adjust composition, export PNG.
- Controls: flow, screen structure, state transitions, defaults, validation, error recovery.
- Explicit exclusion: do not copy Dresser JavaScript, CSS, UI source, name, text, media, device artwork, or branded assets.

## UI reference: existing portfolio

- Source: repository files `src/index.css`, `src/App.module.css`, and existing controls using `@phosphor-icons/react`.
- Applied to typography, neutral dark surfaces, spacing tokens, focus treatment, and icon geometry.
- The editor UI must be original. The phone shell must use generic geometry drawn by our own CSS/canvas code, with no vendor marks or sourced device assets.

## Prototype boundary

One desktop-only route, one uploaded still image, one generic phone frame, one solid-color background, padding/scale/position controls, and PNG export. Video, multiple devices/screens, responsive mobile adaptation, persistence, and production polish are deferred.
