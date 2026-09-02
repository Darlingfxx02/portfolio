# Scope and lint baseline

Date: 2026-08-30
Result: PASS

R1 production changes are limited to:

- `server/mockup-mcp/browser-session.mjs`
- `server/mockup-mcp/tests/mcp-live.test.mjs`

The MCP tree is currently untracked as part of the parent local-only task, so `git diff` cannot represent its internal delta. R1 executor ownership and edits were restricted to the two frozen files above; no other production file was edited during remediation. Evidence files live only under this R1 evidence directory.

Comparison against `preflight-baseline.sha256` reports `FAILED` only for the two allowed files above. All six excluded MCP files report `OK`: preset schema JSON, preset implementation, README, server entry point, preset tests, and source-validation tests. The checksum command exits nonzero by design because the two in-scope hashes changed (and the baseline includes one non-checksum note line).

`pnpm lint` exit: 1, reproducing exactly the accepted 10 errors in the same five out-of-scope files and no MCP finding:

- `src/components/ScrollBar/ScrollBar.tsx`: 1
- `src/components/UsageHeatmap/UsageHeatmap.tsx`: 1
- `src/components/case/VideoPlayer.tsx`: 1
- `src/lib/i18n.tsx`: 2
- `src/lib/personalization.tsx`: 5

Totals: 10 errors, 0 warnings. `pnpm lint:mockup-mcp` passes with zero warnings/errors. `git diff --check` passes.
