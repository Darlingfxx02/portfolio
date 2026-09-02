# Transport negative paths

Status: PASS

The bridge test suite verified failures before browser mutation for:

- missing and wrong bearer credentials;
- hostile Host and non-null Origin;
- malformed CORS preflight and unapproved request headers;
- unsupported method, path, query, and content type;
- malformed/non-canonical preset encoding and invalid/unknown preset data;
- invalid PNG signature, corrupt CRC, truncated chunks, absent ending, and trailing input;
- declared oversized body, streamed-over-limit behavior, truncated body, slow body timeout, and client disconnect;
- overlapping render with deterministic HTTP 409 `BUSY`.

Errors use bounded JSON `{code,message}` responses. Non-null origins receive no CORS reflection. Tests assert the manager is not called on pre-mutation failures. Startup with an already occupied port exited 1, wrote no runtime record, and left the existing listener intact.
