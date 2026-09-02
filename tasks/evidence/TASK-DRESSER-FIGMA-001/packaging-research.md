# Packaging research — TASK-DRESSER-FIGMA-001

Date: 2026-08-31

## Repository evidence

- Exact local mirror: `.local/dresser-mirror`, 146 MB total.
- PNG-relevant mockup plus static picture assets: 438 files, about 71 MB.
- Full mirror asset surface also includes 18 video-background files and large browser bundles.
- Mirror integrity anchor: `.local/dresser-mirror/MANIFEST.sha256`; SHA-256 of that manifest file is `50363797dfae069048924ddef79cbc6e29c31338e84562c8fd822cf4608380e7`.
- Existing renderer: `server/mockup-mcp/browser-session.mjs` already discovers capabilities, validates `dresser-preset/v1`, drives an isolated exact mirror in Chrome, and returns Dresser's own downloaded PNG.

## Official Figma constraints inspected

- [Plugin manifest](https://developers.figma.com/docs/plugins/manifest/): new plugins use `documentAccess: "dynamic-page"`; `networkAccess.allowedDomains: ["none"]` disables production network access and `devAllowedDomains` can narrowly permit a development loopback origin.
- [Libraries and bundling](https://developers.figma.com/docs/plugins/libraries-and-bundling/): plugin code and UI dependencies should be bundled.
- [Resource links](https://developers.figma.com/docs/plugins/resource-links/): additional resources cannot be shipped as ordinary relative linked files; they must be embedded or loaded by absolute HTTP(S) URL.

## Reversible MVP decision

Do not duplicate or base64-inline the 146 MB mirror or 71 MB PNG asset subset into `ui.html`. Add a separate token-protected `127.0.0.1:4783` development companion that accepts a bounded Frame PNG body plus `dresser-preset/v1`, calls the existing exact browser renderer, and returns PNG bytes. The dependent manifest keeps production `allowedDomains` at `none` and permits only that fixed loopback origin in `devAllowedDomains`.

This keeps the plugin bundle compact, preserves all capabilities that the current browser mirror actually exposes, leaves `.local/dresser-mirror` and MCP behavior unchanged, and is removable without data migration. It is a first-demo packaging strategy, not a Figma Community or standalone distribution claim.
