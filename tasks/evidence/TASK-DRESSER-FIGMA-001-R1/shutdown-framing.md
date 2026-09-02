# Shutdown framing and liveness

Status: PASS

Rejected before callback:

- positive Content-Length with one decoded byte: `400 INVALID_BODY`;
- non-empty chunked body with one decoded byte: `400 INVALID_BODY`, not 202;
- slow/incomplete chunked body: bounded `BODY_TIMEOUT`;
- aborted chunked request: no callback;
- conflicting Content-Length plus Transfer-Encoding: Node parser returned 400 before handler behavior.

After all application-level rejections, `/health` remained HTTP 200 and the private runtime record remained present. Manager and shutdown callback counts were zero.

Accepted only after end-of-stream validation:

- explicit `Content-Length: 0`: 202, exactly one callback;
- absent body framing with zero decoded bytes: 202, exactly one additional callback;
- empty chunked stream: 202, exactly one additional callback.

The body reader stores no body content, has a fixed timeout, and schedules shutdown only after the zero-byte end event.
