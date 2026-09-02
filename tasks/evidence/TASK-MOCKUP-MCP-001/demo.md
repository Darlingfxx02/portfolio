# Browser-backed Dresser MCP demo

Status: PASS (locally implemented; independent final verification still required)

1. An official-SDK MCP client started `node server/mockup-mcp/server.mjs` over stdio.
2. `tools/list` returned exactly `dresser_get_capabilities` and `dresser_render_png`, both with object input/output schemas.
3. `dresser_get_capabilities` opened the exact loopback mirror and returned `dresser-preset/v1`, manifest SHA-256 `50363797dfae069048924ddef79cbc6e29c31338e84562c8fd822cf4608380e7`, 28 device-model options, 69 model-specific color variants, four aspect ratios, five picture packs, and numeric bounds.
4. `dresser_render_png` imported `public/zinda/series/main-mobile.jpg` through the page file input and invoked `.sidebar-export`. The adapter waits for `Browser.downloadWillBegin`/`Browser.downloadProgress`; it never invokes `Page.captureScreenshot`.

## Solid render

- Preset: iPhone 17 / Black, solid `#C84B31`, `16:9`, padding `72`, scale `130`, x `-80`, y `60`.
- Evidence: `solid-render.png`
- SHA-256: `214155892ad1605c569521663ef454b9be00aa16cfc949393b0d53f6c4a30fe9`
- Dimensions: 2079 × 1170; size: 455063 bytes; PNG signature valid.
- Visual inspection: requested orange background, black iPhone frame, imported screenshot, and shifted/scaled layout are present.

## Mesh render

- Preset: iPad Pro 11-inch (M4) / Space Black, mesh `#120A2A`, `#7C35FF`, `#FFE066`, `1:1`, padding `72`, scale `90`, x `120`, y `-100`.
- Evidence: `mesh-render.png`
- SHA-256: `54369978357ac0f933e8554aff11562673fd812fb7c4f3eaa648de84e8c4b95d`
- Dimensions: 2080 × 2080; size: 1048095 bytes; PNG signature valid.
- Visual inspection: purple/navy/yellow mesh, Space Black iPad frame, square canvas, and distinct shifted/scaled composition are present.
