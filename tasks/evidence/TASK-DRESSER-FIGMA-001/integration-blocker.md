# Integration blocker — TASK-DRESSER-FIGMA-001

Date: 2026-08-31  
Status: BLOCKED

Fresh integration reran every frozen bridge, MCP, mirror, live-render, cleanup, route, TypeScript, and Vite build check. All passed except two uncovered transport cases required by the frozen security contract.

## Reproducer results

- `OPTIONS /v1/render` requesting `GET` returned `204` and `Allow-Methods: GET`, although the route supports only `POST`.
- `OPTIONS /v1/capabilities` requesting `POST` returned `204`, although the route supports only `GET`.
- `OPTIONS /v1/shutdown` requesting `GET` returned `204`, although the route supports only `POST`.
- Authenticated `POST /v1/shutdown` with a non-empty chunked body returned `202`; only `Content-Length` is checked.

These outcomes conflict with the frozen narrowly scoped CORS, unsupported-method rejection, and empty-shutdown-body requirements. Existing tests do not cover these variants.

## Bounded remediation request

1. Validate preflight against the exact method allowed by each route.
2. Reject non-empty or chunked shutdown bodies with a stable redacted error before shutdown.
3. Add regression tests for the four requests above.
4. Rerun the existing bridge, MCP, mirror, live-render, and cleanup gates.

No Figma UI, mirror, MCP schema, portfolio, deployment, publication, or Git delivery work belongs to this remediation.

## Passing neighboring evidence

- Bridge suite 5/5, scoped lint, and syntax/build passed.
- MCP suite 10/10, scoped lint, and build passed.
- Mirror manifest passed 474/474.
- Real Chrome returned exact live capabilities and a browser-exported 3230×3230 PNG with matching size and SHA-256.
- Runtime, input, output delta, listener, and task temp baseline were clean after stop.
- `/tools/mockup`, `/`, TypeScript, and external-directory Vite build passed.
- Repo lint reproduced only the frozen 10 out-of-scope errors.
