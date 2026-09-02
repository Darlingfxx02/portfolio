# Full repository lint baseline

Status: PASS as frozen accepted MVP debt (the command itself exits 1)

Fresh `pnpm lint` reproduced exactly 10 errors in the same five pre-existing out-of-scope files recorded by preflight:

- `src/components/ScrollBar/ScrollBar.tsx:49:5`
- `src/components/UsageHeatmap/UsageHeatmap.tsx:381:17`
- `src/components/case/VideoPlayer.tsx:137:18`
- `src/lib/i18n.tsx:21:14`, `28:17`
- `src/lib/personalization.tsx:33:14`, `39:17`, `45:23`, `64:17`, `76:14`

No new error and no `server/mockup-mcp` error appeared. `pnpm lint:mockup-mcp` passes independently.
