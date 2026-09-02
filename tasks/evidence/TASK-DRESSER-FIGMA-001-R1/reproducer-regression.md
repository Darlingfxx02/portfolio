# Exact integration reproducers

Status: PASS

Against a task-owned bridge with stub manager and shutdown observer:

- `OPTIONS /v1/render` requesting GET returned `403 INVALID_PREFLIGHT`.
- `OPTIONS /v1/capabilities` requesting POST returned `403 INVALID_PREFLIGHT`.
- `OPTIONS /v1/shutdown` requesting GET returned `403 INVALID_PREFLIGHT`.
- Authenticated `POST /v1/shutdown` with a decoded one-byte chunked body returned `400 INVALID_BODY`, never returned 202, and did not invoke shutdown.

Every rejected preflight omitted `Access-Control-Allow-Methods` and `Access-Control-Allow-Headers`. Manager calls and shutdown callbacks remained zero; the listener and private runtime record remained live until test-owned cleanup. Responses contained no token, request body, path, or stack trace.
