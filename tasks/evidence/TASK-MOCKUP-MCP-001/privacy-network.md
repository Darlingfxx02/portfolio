# Privacy and network boundary

Status: PASS

- Browser requests are recorded in memory and checked before a successful capability or render result. Allowed URLs are the session's `127.0.0.1` origin plus `blob:`, `data:`, and `about:blank`; non-GET/HEAD or post-data traffic fails with `NETWORK_POLICY_VIOLATION`.
- The exact mirror CSP remains unchanged and independently reports loopback/blob-only traffic.
- Chrome uses a disposable profile/download root. Test snapshots confirm cleanup; only intentional final PNG files remain.
- The server emits no source bytes, base64, raw CDP/MCP payloads, credentials, or source path in logs/errors. Full source paths are used only inside the local file-input CDP command.
