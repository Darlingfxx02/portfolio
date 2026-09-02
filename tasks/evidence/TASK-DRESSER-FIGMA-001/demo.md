# Authenticated live demo

Status: PASS

- Started the fixed `127.0.0.1:4783` companion and read its private runtime identity in-process; no token or runtime path was printed.
- Authenticated `GET /v1/capabilities` returned HTTP 200 from the real browser-backed mirror: dresser-preset/v1, 28 models, 69 color variants, and 5 picture packs.
- Authenticated `POST /v1/render` used the mirror QA PNG plus an iPad/mesh/1:1 preset with scale 90, x 120, and y -100.
- Response: HTTP 200, PNG signature `89504e470d0a1a0a`, 3230 by 3230, 2,341,322 bytes; SHA-256 response header matched the returned bytes.
- The response came from `BrowserSessionManager.render`'s downloaded browser export. The exact task-owned artifact was read and deleted without persisting or reporting its local path.
- The pre-existing MCP output directory listing was identical before and after the request.
- After stop: runtime removed, input directory removed, port closed, and zero `dresser-mcp-*` temporary browser sessions remained.

No request bytes, token, preset payload, local path, source name, CDP data, or stack trace was emitted.
