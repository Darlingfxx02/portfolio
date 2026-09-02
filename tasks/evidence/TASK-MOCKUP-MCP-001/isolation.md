# Isolation and concurrency

Status: PASS

- Each render launches a new mirror process, page, Chrome process, profile, and download directory.
- Solid then mesh renders returned unique UUID paths and different hashes/dimensions; settings and source state did not bleed.
- An overlapping render received stable `BUSY` while the first render completed normally.
- Output uses `COPYFILE_EXCL`; callers cannot choose names and existing files are not overwritten.
- Tests snapshot `dresser-mcp-*` temporary directories before/after MCP discovery and rendering; snapshots match.
