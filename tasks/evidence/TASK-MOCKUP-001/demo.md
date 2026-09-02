# Demo — TASK-MOCKUP-001

Status: PASS

Viewport: 1440 × 900, Chrome headless, local Vite server.

1. Direct-opened `http://127.0.0.1:5173/tools/mockup`. The route rendered the empty editor with a 1200 × 1200 canvas and disabled export. The resource list contains the mockup chunk and does not contain `App`, `SiteBoot`, portfolio media inventory, or portfolio UI modules.
2. Imported a local 375 × 800 JPEG through the file input. The UI reported only dimensions, never the filename.
3. Changed all composition inputs: background `#7c5cff`, padding `180`, scale `132%`, horizontal `46`, vertical `-28`.
4. Exported `mockup-studio.png`. It is 1200 × 1200. Its SHA-256 exactly matches a PNG blob encoded from the visible canvas immediately before export: `4cd4a415708790c33670b093170d5b527089fcaab3138dbe39deb0d17e178fd3`.
5. Direct-opened the ordinary portfolio route separately. It rendered the existing SiteBoot state, confirming the route remained connected to its normal boot behavior.

Artifacts:

- `editor-empty.png`
- `editor-loaded-adjusted.png`
- `mockup-studio.png`
- `portfolio-route.png`
- `browser-report.json`

The implementation and visual assets are original clean-room work. No Dresser source, copy, media, brand, or device artwork appears in `src/main.tsx` or `src/tools/mockup/`.
