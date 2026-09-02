# Visual-gate review — TASK-DRESSER-FIGMA-002

Date: 2026-08-31

Verdict: **PASS** (`approved`).

## Approval mapping

The user was presented with one named direction, `recommended` — the compact Dresser tool panel — together with the request to approve that direction and explicitly decide whether work may continue without Mobbin. The immediate response was:

> делай делай без мобина

In context, this is an explicit instruction to proceed with the presented `recommended` concept and an explicit waiver of unavailable Mobbin research. It does not approve any alternate concept or authorize new UX decisions. The frozen implementation boundary remains the hierarchy, states, defaults, validation, recovery, dimensions, responsive treatment, and invariants in `visual-contract.json` and `concept-recommended.md`.

## Evidence reviewed

- `tasks/visual/TASK-DRESSER-FIGMA-002/visual-contract.json`
- `tasks/visual/TASK-DRESSER-FIGMA-002/baseline.md`
- `tasks/visual/TASK-DRESSER-FIGMA-002/concept-recommended.md`
- `tasks/evidence/TASK-DRESSER-FIGMA-002/reference-research.md`
- `tasks/evidence/TASK-DRESSER-FIGMA-002/mobbin-waiver.md`
- `tasks/evidence/TASK-DRESSER-FIGMA-002/icon-system.md`
- `tasks/TASK-DRESSER-FIGMA-002/task.json` interface, constraints, acceptance criteria, and validation plan
- `.local/dresser-mirror/qa-loaded.png`, visually inspected and verified as 1440×1000 with SHA-256 `ff311cebf112fc033ed7492348cbe2daa5f6c2682bff1ded2fc47552f9bc1d6c`
- Installed `@phosphor-icons/react` 2.1.10 metadata and MIT license

## Gate checks

- Baseline is reproducible: source image path, dimensions, hash, state, source viewport, target viewport, and preserved regions are recorded.
- The change region is bounded to the new local plugin panel and one newly inserted PNG rectangle; the existing Dresser mirror, MCP, portfolio, source Frame, parent, and unrelated nodes are invariants.
- UX and UI references are separate and each lists the decisions it controls. Mobbin is neither claimed nor fabricated.
- The missing Mobbin reference is acceptable for this gate because the task is classified as a small, frozen implementation rather than a large new interface, and the user explicitly waived Mobbin for this local MVP.
- The selected concept is singular and named `recommended`; there is no ambiguous alternate direction.
- Icon strategy is concrete and testable: named Phosphor imports, typed resolver, `Question` fallback, accessible names, decorative hiding, and no emoji or placeholder glyphs.

## Testability of the frozen contract

- Geometry: launch at 360×640 and 420×720; verify a 44 px header, one vertical scroll region, stable sticky footer, full-width preview, and no horizontal clipping.
- Hierarchy: verify selection status → exact preview → Device → Background → Layout → Reset/Update/Insert, with only active background controls disclosed.
- State behavior: exercise no, multiple, non-Frame, removed/stale selection, loading, ready, stale preview, rendering, inserted, and recoverable error states.
- Fidelity: compare the final displayed preview bytes/pixels and preset identity with the inserted image; control changes must mark the preview stale and Insert must refresh first when needed.
- Canvas mutation: verify one named rectangle at source absolute x + width + 80 and source y; select it and prove the source Frame, parent, and unrelated nodes are unchanged.
- Capability coverage: reconcile every visible PNG-relevant model, color, background, mesh palette, picture pack, ratio, fixed padding, scale, and position control against authenticated live capabilities.
- Theme and accessibility: compare light/dark host themes, keyboard order, visible 2 px focus, labels, status announcements, contrast, accessible icon names, and reduced-motion behavior.
- Failure and privacy boundaries: test companion/token/BUSY/timeout/invalid-PNG/oversize/duplicate-insert cases; verify no partial node, silent fallback, sensitive logging, persistence, or non-loopback traffic.

## Frozen implementation rule

Production implementation may realize only the approved `recommended` contract. Any change to flow, hierarchy, defaults, validation, recovery, panel dimensions, responsive behavior, or source-preservation rules requires a new visual decision.
