# Dresser browser MCP

Local stdio MCP for the exact mirror in `.local/dresser-mirror`. It launches that mirror on a random loopback port and controls an isolated disposable Chrome profile. It never calls the public Dresser site and never substitutes a browser screenshot for Dresser’s own PNG download.

## Start

```bash
pnpm mockup-mcp
```

An MCP client should start that command with the repository root as its working directory. The server writes protocol messages only to stdio and exposes exactly two tools:

- `dresser_get_capabilities` opens the mirror and returns the current `dresser-preset/v1` IDs, defaults, bounds, picture packs, and mirror-manifest identity.
- `dresser_render_png` accepts one absolute canonical local PNG/JPEG path plus a closed `dresser-preset/v1` object. It returns an absolute path and PNG metadata.

Imported screen media uses `fitMode: contain`. When a screenshot and the selected device have different aspect ratios, the MCP normalizes the source to the device viewport and extends its outermost edge pixels into the unused area. Dresser therefore preserves the complete source width and side safe areas without introducing black letterbox bars or using the mirror's default destructive `cover` crop.

Call `dresser_get_capabilities` first and use only returned IDs. `layout.padding` is currently fixed at `72` (`min = max = default`) because this exact mirror does not expose a padding control. The other numeric ranges come from the live editor controls.

Example render input:

```json
{
  "sourcePath": "/absolute/path/to/screenshot.png",
  "preset": {
    "version": "dresser-preset/v1",
    "device": {
      "modelId": "iPhone 17",
      "colorId": "iphone-17-black"
    },
    "background": {
      "mode": "mesh",
      "colors": ["#120A2A", "#7C35FF", "#FFE066"]
    },
    "layout": {
      "aspectRatioId": "1:1",
      "padding": 72,
      "deviceScale": 90,
      "x": 120,
      "y": -100
    }
  }
}
```

Successful artifacts are new UUID-named `.png` files below `.local/dresser-mcp-output`. Callers cannot choose an output path and existing files are never overwritten. Source bytes, base64 media, full source paths, raw CDP messages, and credentials are not logged or returned in errors.

## Validation

```bash
pnpm test:mockup-mcp
pnpm lint:mockup-mcp
pnpm build:mockup-mcp
```

Chrome can be overridden with `DRESSER_CHROME_PATH`. The MCP remains loopback-only; there is no HTTP MCP transport, authentication, cloud storage, or deployment in this MVP.
