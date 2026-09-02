# MCP contract and happy-path regression

Date: 2026-08-30
Result: PASS

`pnpm test:mockup-mcp` passed 10/10, including:

- stdio discovery exposes exactly `dresser_get_capabilities` and `dresser_render_png`;
- live capabilities remain `dresser-preset/v1`, `/tools/mockup`, 28 device models, and the existing background/layout bounds;
- a real solid-background PNG export succeeds with the existing artifact fields;
- sequential solid and mesh renders remain isolated;
- overlapping work still returns stable `BUSY`;
- unavailable browser, mirror, render timeout, and download failures retain bounded stable codes;
- path, MIME, schema, color, range, and picture-pack negatives remain enforced.

No public MCP schema, preset schema, stable error code, capability discovery field, or artifact metadata was changed by R1.
