# Independent preflight — TASK-DRESSER-FIGMA-002

Date: 2026-08-31  
Mode: preflight  
Delivery: MVP  
Verdict: FAIL

## Frozen inputs reviewed

- `tasks/TASK-DRESSER-FIGMA-002/task.json`
- `tasks/visual/TASK-DRESSER-FIGMA-002/{baseline.md,concept-recommended.md,visual-contract.json}`
- `tasks/evidence/TASK-DRESSER-FIGMA-002/{reference-research.md,mobbin-waiver.md,icon-system.md,compile-validation.json}`
- `tasks/audit/TASK-DRESSER-FIGMA-001-R1/{verdict.json,final-verification.md}`
- `server/figma-plugin-bridge/{server.mjs,protocol.mjs,runtime-state.mjs}` and `server/mockup-mcp/preset-schema.mjs`
- current branch, remote, dirty worktree, package scripts/dependencies, `.gitignore`, and exact mirror evidence
- current official Figma manifest, `showUI`, UI messaging, `exportAsync`, and `createImage` documentation

The sibling schema-v4 validator passed in compile phase with no errors:

`python3 /Users/darlingfxx/.codex/plugins/cache/railway-local/railway/0.1.0+codex.20260826203550/skills/railway-compile-task/scripts/validate_task.py tasks/TASK-DRESSER-FIGMA-002/task.json --phase compile`

## Approved interface and Mobbin waiver

The user message `делай делай без мобина` is recorded verbatim in both the visual contract approval object and the dedicated waiver evidence. It explicitly approves the recommended compact concept and waives unavailable Mobbin for this local MVP. No Mobbin identity, link, preview, or asset was invented. The contract freezes one 360x640 single-column flow, a 420x720 expanded state, exact browser-rendered previews, stale/update behavior, and beside-source insertion.

The visual contract's top-level `status` remains `pending`, but its embedded approval is `approved`, the task approval is `approved`, and the dedicated waiver contains the exact user message. This stale field should be normalized before execution evidence is finalized, but it is not the reason for the FAIL verdict.

## Feasibility that passes

- Official Figma documentation supports a bundled `ui.html` through `__html__`, a 360x640 themed `showUI`, `Uint8Array` message transfer, PNG `exportAsync`, and `createImage(Uint8Array)`.
- Official Figma documentation confirms the 4096 px maximum per image dimension. The packet explicitly requires proportional source export bounding, output-header/PNG validation, matching preview/insert dimensions, and rejection before mutation.
- The manifest plan is bounded to `editorType: ["figma"]`, `documentAccess: "dynamic-page"`, production `allowedDomains: ["none"]`, and development-only `http://127.0.0.1:4783`.
- The verified companion R1 is loopback-only, checks `Host` and opaque `Origin: null`, enforces route-specific CORS, a 25 MiB PNG limit, strict PNG CRC/dimensions, strict `dresser-preset/v1`, serialized/BUSY rendering, redacted errors, and owned input/output cleanup. Its independent final verdict is `PASS_WITH_DEBT`; the only debt is historical Git provenance, not behavior.
- Source name and bounds can remain in the Figma main thread while only bounded PNG bytes and preset data cross to the UI/companion. Insertion can create one new rectangle on the current page without modifying the source.
- `@phosphor-icons/react` is already present, and the packet freezes named imports, a typed resolver, Question fallback, accessible names, and no full-catalog import.
- The plugin directory does not yet exist. The current worktree is broadly dirty, so the explicit allowlist and out-of-scope protections are necessary and adequate for an isolated executor.

## Release blocker: no compliant bearer-token handoff

The frozen end-to-end path cannot authenticate:

1. `runtime-state.mjs` creates a fresh random token and writes it to `.local/dresser-figma/runtime.json` with owner-only permissions.
2. The verified bridge requires that bearer token for both `/v1/capabilities` and `/v1/render` and deliberately never serves or logs it.
3. A normal Figma plugin main thread has no Node/filesystem access, and its iframe UI cannot read that private local runtime file.
4. The task requires one command to start the companion and build/load the plugin, but does not define any IPC or user-mediated handoff that can supply the token at runtime.
5. Injecting the token into generated `main.js`, `ui.html`, or a manifest/runtime overlay would persist it and violates acceptance 9 and the explicit no-token-persistence constraint. Printing/copying it would violate the same boundary.
6. Adding an unauthenticated bootstrap endpoint, changing authentication, or otherwise exposing the token would modify the TASK-DRESSER-FIGMA-001 bridge protocol/server behavior, which is explicitly outside this task's scope.

Therefore acceptance 1 and acceptance 2 cannot both pass under the frozen scope and privacy constraints, and `risk:data-privacy` fails. This is a product/security release blocker for the first demo, not a missing test harness.

## Required rebaseline

PM must rebaseline one bounded authentication-handoff design before dispatch. Valid directions include either (a) explicitly scope a narrowly secured one-time bootstrap/IPC change into the companion with its own negative tests, or (b) explicitly permit a task-owned ignored runtime artifact containing only the ephemeral token and define deletion/rotation guarantees. The verifier does not select or implement either option.

No production file, dependency, manifest, bridge behavior, Figma document, remote, or Git history was changed during this review.
