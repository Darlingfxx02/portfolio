# Owned state cleanup

Status: PASS

- Success: unique bridge input and the exact UUID-named BrowserSessionManager output were removed before the PNG response completed.
- Invalid preset/PNG/body: no browser mutation and no temporary input/output.
- Overlap: losing request returned BUSY and removed its unique input; winning output was removed.
- Post-body disconnect: the in-flight operation settled and its unique input/output were removed.
- Browser timeout/failure: existing MCP live tests confirmed Chrome, mirror child, profile, downloads, and output cleanup.
- SIGINT process shutdown: runtime mode was 0600 while active; afterward port 4783 was closed, runtime and inputs were absent, and zero `dresser-mcp-*` temporary sessions remained.
- Restart/occupied-port: fail-closed startup did not replace the incumbent listener or leave runtime state.
- A before/after listing proved pre-existing MCP PNG artifacts were unchanged.

Only bridge-recorded source and returned UUID output paths are eligible for deletion.
