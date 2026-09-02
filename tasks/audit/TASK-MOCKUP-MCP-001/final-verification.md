# Final verification — TASK-MOCKUP-MCP-001

Status: **FAIL**

Independent final verification was run against the frozen `tasks/TASK-MOCKUP-MCP-001/task.json`; executor and integrator conclusions were not used as proof.

## Fresh passing checks

- `pnpm test:mockup-mcp`: 9/9 tests passed.
- `pnpm lint:mockup-mcp`: passed.
- `pnpm build:mockup-mcp`: passed.
- `cd .local/dresser-mirror && shasum -a 256 -c MANIFEST.sha256`: every manifest entry passed.
- `git diff --check`: passed.
- `pnpm lint`: reproduced exactly the frozen 10 errors in the same five out-of-scope files and no MCP-owned finding.
- Repository identity is `git@github.com:Darlingfxx02/portfolio.git`, branch `main`, HEAD `dbb8da5`; the frozen packet explicitly requires local-only delivery and no commit or push.

## Independent live MCP reproduction

A fresh official-SDK stdio client started `server/mockup-mcp/server.mjs` and discovered exactly `dresser_get_capabilities` and `dresser_render_png`, both with object input/output schemas. Live capability discovery returned `dresser-preset/v1`, route `/tools/mockup`, manifest SHA-256 `50363797dfae069048924ddef79cbc6e29c31338e84562c8fd822cf4608380e7`, 28 device models, four background modes, four aspect ratios, and the documented numeric bounds.

The same independent client produced and visually inspected these new Dresser-exported artifacts:

- Solid: `.local/dresser-mcp-output/8751bdee-a848-498d-8ad9-ce71e632aa93.png`, 455143 bytes, 2079×1170, SHA-256 `bf95d1c55173ce327ebd4993ad08af863ce8b22574d2d4c4de08d17fa1b78048`. It visibly has the requested `#C84B31` solid field and black iPhone 17 framing.
- Mesh: `.local/dresser-mcp-output/f1fa348d-5a64-49c1-939a-fe77fc7f2877.png`, 1048095 bytes, 2080×2080, SHA-256 `54369978357ac0f933e8554aff11562673fd812fb7c4f3eaa648de84e8c4b95d`. It visibly has the requested dark/purple/yellow mesh, iPad framing, square ratio, smaller scale, and changed position.

The hashes and paths differ. A concurrent second call returned stable `BUSY` while the first completed. A missing source named with a private marker returned only `SOURCE_NOT_FOUND` / `Source file was not found`; neither response nor stderr contained the path or marker. Normal discovery/render left zero `dresser-mcp-*` temporary directories and emitted zero stderr bytes. Source inspection found no `Page.captureScreenshot`; export uses `Browser.downloadWillBegin` and `Browser.downloadProgress`.

An actual unavailable Chrome executable was also exercised through the public stdio server and returned a bounded `BROWSER_UNAVAILABLE` response with zero stderr and no executable-path disclosure.

## Release blocker: live timeout crashes the process

The frozen acceptance requires render timeout and failed-download paths to return bounded MCP errors and remove temporary state. A fresh live-browser reproduction instantiated the supported `BrowserSessionManager({ timeoutMs: 1 })`, discovered real capabilities, and rendered a valid source/preset. Instead of rejecting the render with a catchable bounded error, Node terminated with an unhandled rejection:

```text
DresserError: Controlled browser operation timed out
code: 'DOWNLOAD_FAILED'
at browser-session.mjs:53
Node.js v22.23.1
```

The cause is `exportPng`: line 537 starts the timeout-bearing `Browser.downloadWillBegin` promise, lines 538–543 await a separate CDP evaluation, and only line 545 attaches the await/handler to the first promise. When the timeout expires during that intervening await, Node observes an unhandled rejection and exits. The surrounding render `try/finally` cannot complete after process termination.

The crash left the verifier-created mirror process alive and listening on `127.0.0.1:5187` (PID 89964), proving cleanup did not complete. The verifier killed only this demonstrably verifier-created orphan after recording it; the user's existing mirror on port 5173 was not touched. No final PNG was created by the failed timeout attempt.

The current test at `server/mockup-mcp/tests/mcp-live.test.mjs:72-97` does not execute the real timeout or download branch: for all three codes it replaces `launch()` with a function that immediately throws. This is a test-harness defect and explains why 9/9 tests pass despite the live failure.

## Scope, safety, and rollback

Production changes are confined to the frozen package metadata plus `server/mockup-mcp/`; the mirror manifest is unchanged. The checkout contains substantial unrelated user-owned dirty work and task evidence, all preserved. Normal network enforcement is loopback/blob/data-only and normal public errors/logs were redacted. Rollback remains bounded to the task-owned server directory and package additions.

Final conclusion: the successful vertical slice is real, but acceptance 6 and 7 fail because the required timeout path can crash the MCP runtime and leave a loopback mirror process. This is a release blocker for the MVP, not accepted debt.

`validate_verdict.py tasks/audit/TASK-MOCKUP-MCP-001/verdict.json --task tasks/TASK-MOCKUP-MCP-001/task.json` completed with `valid: true` and no schema errors.
