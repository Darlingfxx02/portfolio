# Independent preflight — TASK-DRESSER-FIGMA-001-R1

Date: 2026-08-31  
Mode: preflight  
Verdict: PASS

## Provenance and budget

- The source task is `TASK-DRESSER-FIGMA-001`, currently `implemented-unverified`, and its integration evidence records exactly four failing requests under two frozen transport requirements: three cross-route CORS preflights and one non-empty chunked shutdown body.
- The remediation packet declares source `TASK-DRESSER-FIGMA-001`, attempt 1, dependency depth 1. This is within the Railway maximum remediation depth of two and is the first bounded remediation.
- The task directly removes the named integration blocker and unlocks final verification of the bridge plus handoff to `TASK-DRESSER-FIGMA-002`; it adds no unrelated product requirement.
- MVP packet budget is respected: 7 acceptance criteria (limit 10), 11 commands plus checks (limit 12), and 7 evidence requirements (limit 10).
- Schema-v4 local tracking is valid for this local-only remediation and invents no external provider identity.

## Exact blocker closure

- The route-method-header matrix is frozen without caller reflection:
  - `/v1/capabilities`: `GET` with `authorization` only.
  - `/v1/render`: `POST` with `authorization`, `content-type`, and `x-dresser-preset` only.
  - `/v1/shutdown`: `POST` with `authorization` only.
- Required headers may vary only by case/order; missing or extra headers are denied. Unknown OPTIONS routes, cross-route methods, and invalid header sets must expose no allow-method or allow-header permission and invoke neither manager nor shutdown.
- Shutdown acceptance is exact at the decoded-body boundary: explicit `Content-Length: 0` and empty chunked streams succeed only after end-of-stream; any decoded byte, including chunked input, yields `INVALID_BODY` and cannot schedule shutdown or alter listener/runtime state.
- Slow, incomplete, aborted, stream-error, and parser-rejected conflicting framing are explicitly frozen as negative/liveness cases. This closes the body-framing gap without changing existing endpoint payloads or authentication behavior.

## Feasibility and ownership

- Current code reproduces both causes: `validatePreflight` accepts any GET/POST and reflects requested permitted headers; shutdown checks only a positive `Content-Length` before queuing shutdown.
- The two fixes are feasible inside the four owned files. `protocol.mjs` can hold the explicit policy and bounded empty-body reader; `server.mjs` can pass the route and await full-body validation; the two owned tests can exercise raw chunked and parser-level framing.
- Package scripts already exist, so every frozen command is real. No dependency or package metadata change is required.
- Scope is narrower than the source task and excludes runtime-state, MCP, mirror, plugin, portfolio, package metadata, generated assets, deployment, and Git delivery. No parallel ownership conflict exists because R1 depends on the source task.
- Rollback is reversible and data-free: revert only the four remediation files and stop only a test-owned listener/runtime state.

## Fresh checks

- Schema validator in `compile` phase: exit 0, `valid: true`, no errors.
- Existing bridge baseline: 5/5 tests passed.
- Existing bridge lint and syntax build: exit 0.
- `git diff --check`: exit 0.
- Port `127.0.0.1:4783` had no listener after checks.

The passing baseline does not invalidate the remediation: the source integration reproducer proves the current five-test harness omits the four failing transport variants, and this task explicitly adds them.

## Dirty-worktree boundary

The worktree contains extensive unrelated user changes and untracked source-task files. Preflight wrote only this task's compile, review, and verdict artifacts. It did not modify bridge production code, tests, package metadata, MCP, mirror, plugin, portfolio, generated assets, or source-task evidence.
