# Negative paths

Status: PASS

- Relative and traversal-bearing paths: `INVALID_SOURCE_PATH`.
- Missing path: `SOURCE_NOT_FOUND`.
- Directory/non-regular input: `SOURCE_NOT_REGULAR`.
- Spoofed bytes and unsupported extension: `SOURCE_MEDIA_UNSUPPORTED`.
- File larger than 25 MiB: `SOURCE_SIZE_UNSUPPORTED`.
- Unknown properties, non-finite numbers, malformed mesh, unknown model/color/aspect/picture IDs, and out-of-range values: rejected before target-source browser mutation.
- Unavailable Chrome/CDP: `BROWSER_UNAVAILABLE`.
- Mirror startup, render-timeout, and failed-download branches preserve stable `MIRROR_UNAVAILABLE`, `RENDER_TIMEOUT`, and `DOWNLOAD_FAILED` codes and create no output artifact.
- Public MCP errors contain only stable code/message JSON; tested source errors contain neither the basename nor parent path.
