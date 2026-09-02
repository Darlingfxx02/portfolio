# Interface reference research — TASK-DRESSER-FIGMA-002

Date: 2026-08-31

## Mobbin limitation

Mobbin MCP is not installed or callable in this environment. The intended direct query was:

`desktop design plugin screenshot mockup configure preview insert canvas`

- Platform: desktop.
- Product job: turn one selected design frame into a device mockup.
- Flow: selection validation → configure mockup → preview → insert beside source.
- States: no selection, loading, ready, stale preview, rendering, inserted, recoverable error.

No Mobbin screen/flow ID, URL, screenshot, temporary preview, or durable asset ID was invented. This remains explicit research debt at preflight and visual approval.

## Approved rebaseline

After being shown the recommended `TASK-DRESSER-FIGMA-002` visual contract and an explicit request to confirm continuation without Mobbin, the user responded: `делай делай без мобина`.

This is recorded as:

- approval of the `recommended` compact Dresser tool-panel concept;
- an explicit waiver of unavailable Mobbin research for this local MVP;
- authorization to use the inspected current Dresser plus official Figma documentation as the frozen UX/UI controls;
- no authorization to invent Mobbin IDs, links, images, or durable assets.

The implementation task is therefore rebaselined as a tightly specified realization of an approved contract. It must not introduce new flow, hierarchy, state, default, validation, or recovery decisions beyond that contract.

## Inspected current product

Evidence image: `.local/dresser-mirror/qa-loaded.png`, 1440×1000 PNG, SHA-256 `ff311cebf112fc033ed7492348cbe2daa5f6c2682bff1ded2fc47552f9bc1d6c`.

Observed UX structure:

- Large preview dominates; configuration is ordered device → color/layout → aspect ratio → background → reset/download.
- Background selection uses progressive disclosure: content mode first, then solid/photo/mesh settings.
- The final action is visually isolated at the bottom; reset remains secondary.

Applied UX decision: preserve those control groups and conditional settings, but reorder for the Figma job as selection status → compact preview → device → background → layout → sticky update/insert actions. Changing a setting makes the preview explicitly stale; update refreshes it, and insert refreshes first when needed.

Observed UI language:

- Dark neutral canvas, compact labeled controls, low-contrast dividers, segmented choices, small radii, and a high-contrast primary action.
- The existing wide fixed side rail does not fit a Figma plugin panel and is not copied.

Applied UI decision: retain Dresser's dark, restrained tool character and clear preview, then use a single 360 px column, host theme variables, tighter spacing, and a sticky footer suitable for a Figma plugin modal.

## Official Figma references

- [showUI](https://developers.figma.com/docs/plugins/api/properties/figma-showui/): `__html__`, explicit width/height, later resize, and `themeColors` support the 360×640 default and approved expanded state.
- [Creating a User Interface](https://developers.figma.com/docs/plugins/creating-ui/): main/UI communication uses `pluginMessage`; `Uint8Array` is supported while Blob and other typed arrays are not.
- [Plugin manifest](https://developers.figma.com/docs/plugins/manifest/): `documentAccess: "dynamic-page"`, `editorType: ["figma"]`, and a production-denied/dev-loopback network policy.
- [exportAsync](https://developers.figma.com/docs/plugins/api/properties/nodes-exportasync/): selected Frame export is the source-image boundary.
- [createImage](https://developers.figma.com/docs/plugins/api/properties/figma-createimage/): inserted PNG bytes create an Image handle and image dimensions are limited to 4096 px per side.
- [Resource links](https://developers.figma.com/docs/plugins/resource-links/): extra assets cannot be shipped as ordinary relative resources, supporting the local companion instead of a 71 MB embedded asset pack.

UX references control only flow, hierarchy, progressive disclosure, states, validation, and recovery. UI references control only typography, density, spacing, color, surfaces, iconography, and responsive treatment.
