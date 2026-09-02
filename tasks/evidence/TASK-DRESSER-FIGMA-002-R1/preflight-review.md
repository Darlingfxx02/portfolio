# Independent preflight — TASK-DRESSER-FIGMA-002-R1

Date: 2026-08-31  
Mode: preflight  
Delivery: MVP  
Verdict: PASS

## Provenance and remediation budget

- Source `TASK-DRESSER-FIGMA-002` failed preflight on one reproducible blocker: no compliant transfer of the companion's private bearer token into the Figma sandbox.
- R1 maps directly to that blocker: `source_task_id` is `TASK-DRESSER-FIGMA-002`, `attempt` is 1, and `dependency_depth` is 1. It is the single bounded remediation allowed by Railway policy.
- R1 adds only the companion-served UI and HttpOnly session boundary needed to remove that blocker. The verified legacy bearer path and approved plugin/canvas flow remain explicit invariants.
- The schema-v4 compile validator passed with no errors.

## Inherited visual and reference authority

The source visual gate is approved for the sole `recommended` concept. The exact user message `делай делай без мобина` is preserved as both the approval and the explicit Mobbin waiver. R1 inherits the approved 360x640/420x720 hierarchy, states, controls, copy, icon system, preview freshness, image bounds, insertion placement, and source-preservation rules. It adds no UX discretion and fabricates no Mobbin evidence.

## Browser and Figma feasibility

Current official Figma documentation supports the required mechanics:

- `showUI(__html__, { width, height, themeColors })` for the minimal bundled bootstrap.
- Navigation of the plugin iframe to a custom URL, after which messages to the parent include the real plugin ID and target `https://www.figma.com`.
- `Uint8Array` main/UI transfer, selected-node PNG `exportAsync`, and `createImage(Uint8Array)` with the documented 4096 px per-side limit.
- A development-only loopback origin through `networkAccess.devAllowedDomains`, while production remains `allowedDomains: ["none"]`.

A fresh real-Chrome probe was run without changing repository files:

- Top document: `http://localhost:4793/top`.
- Embedded third-party document: `http://127.0.0.1:4793/plugin`.
- Response cookie attributes: `__Host-dresser_probe=<opaque>; HttpOnly; Secure; SameSite=None; Path=/`.
- The embedded page's subsequent same-origin credentialed fetch reported `COOKIE_ACCEPTED`.
- No cookie value was printed or written to the repository. The temporary listener and Chrome tab were closed after the probe.

This proves that the installed Chrome accepts the exact Secure/HttpOnly/SameSite/__Host attribute family on HTTP loopback in a cross-site iframe. It does not prove Figma Desktop's embedded runtime, cookie policy, or manifest integration. The frozen task correctly makes a real Figma Desktop import and `/plugin` session round trip a release gate. If Figma rejects Secure loopback, third-party cookie issuance/use, navigation, parent messaging, or framing, execution must report `BLOCKED`; it may not expose/persist bearer credentials or weaken HttpOnly, Secure, SameSite, host/origin, fetch-metadata, client-marker, or shutdown boundaries.

The only permitted client residence for the opaque session value is the browser's inaccessible HttpOnly cookie jar and automatic Cookie header. “No storage/leakage” is therefore evaluated as no JavaScript-visible storage, build/runtime artifact, URL, DOM, message, service worker/cache, logging, evidence, or Git exposure. Server state contains only the session hash and expiry.

## Security boundary

- `/plugin` is an exact, no-query document route; all assets must be self-contained and response headers must prevent sniffing/caching and permit framing only by the required Figma parent.
- Cookie authentication is limited to exact same-origin capabilities/render requests with a fixed client marker and consistent browser fetch metadata. It receives no CORS permission and cannot authorize shutdown.
- Legacy bearer plus opaque `Origin: null` remains the only bearer mode. Mixed authentication, null/cross-origin cookie use, missing/conflicting metadata, replay, expiry, and post-restart requests are rejected before manager mutation.
- Random raw session IDs are never retained server-side; bounded hash/expiry entries rotate and disappear on stop/restart. Retained browser cookies become unusable after restart.
- CSP and parent messaging must be verified in Figma Desktop. Self-only applies to UI resource loading; the frame-ancestor policy must narrowly allow the actual Figma parent required by the official custom-URL contract.

## Selection, canvas, and UI coverage

The packet retains all original product acceptance criteria: exactly one Frame, proportional export within 4096 px, typed/stale request identities, full live capability inventory, exact browser PNG previews, render-before-insert when stale, matching result bytes/dimensions, one named image-filled rectangle at absolute source x + width + 80/y, selected result, one undoable mutation, and unchanged source/parent/unrelated nodes.

Negative coverage includes empty/multiple/non-Frame/removed/changed selection, malformed or stale messages, offline/expired/restarted/ambiguous sessions, legacy bad bearer, BUSY/timeout, invalid capabilities/PNG/metadata, oversize output, duplicate insertion, and Figma mutation failure. Every case is required to preserve recoverability and create no partial node.

## Scope and rollback

The current worktree is broadly dirty and both bridge/MCP trees are untracked. R1's allowlist is explicit; portfolio source/dist, mirror, MCP schema/renderer, source evidence, Community/deployment/remote delivery, and unrelated work are excluded. The rollback removes only task-owned plugin/session/runtime state and the disposable inserted node, then reruns bridge, MCP, mirror, and cleanup regressions.

No production file, Figma document, dependency, remote, or Git history was changed during preflight.
