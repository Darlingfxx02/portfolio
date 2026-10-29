# Portfolio glass controls

The header uses `@glass-sdk/liquid-glass` with a reproducible pnpm patch in
`patches/@glass-sdk__liquid-glass@0.0.2.patch`. `pnpm install --frozen-lockfile`
applies it automatically. Do not edit `node_modules` to tune the design.

## Tune the material

Open `http://127.0.0.1:5173/?glass=1#explorations` during `pnpm dev`.
The development panel independently edits the outer shell and the selected
segment. Hover over a control for its explanation. Values update the existing
surface, preserving selection motion and the live, scrolling background.

Local adjustments persist in `portfolio:glass:v1` in localStorage, including
across tuning tabs. The ordinary portfolio always uses the maintained defaults,
so experimental values do not affect an open portfolio tab. “Сбросить всё”
restores the maintained defaults. The JSON
section exposes the complete settings for copying into
`src/lib/glass/glassSettings.ts`, under `GLASS_DEFAULTS`. Those source defaults
are the production settings. The panel and local overrides are disabled in a
production build.

## Figma correspondence

Primary sources:
- [Figma: Apply effects to layers — Glass](https://help.figma.com/hc/en-us/articles/360041488473-Apply-effects-to-layers)
- [Figma Plugin API: GlassEffect](https://developers.figma.com/docs/plugins/api/Effect/#glasseffect)

| Setting | Range here | What actually changes |
| --- | --- | --- |
| Light angle | -180…180 degrees | Light direction in the WGSL material map; 0 = top, clockwise positive |
| Light intensity | 0…1 | Specular and diffuse rim energy, independently of background tone |
| Refraction | 0…1 | Background displacement; 0 disables bending, 1 = 50 CSS px maximum edge sampling offset |
| Depth | 1…100 CSS px | Inward reach of the curved edge in the displacement map |
| Dispersion | 0…1 | Separate RGB displacement samples; maximum ±15% refraction spread |
| Frost | 0…24 CSS px | Gaussian background blur in the optical SVG graph before refraction |
| Splay | 0…1 | Width of a continuous light lobe; higher values soften angular falloff |

Figma publishes the control meanings, not its renderer or full mathematical
calibration. These are corresponding controls in a web implementation; equal
numbers are not a promise of identical Figma pixels. `Frost` corresponds to
`GlassEffect.radius` in the Plugin API; Splay is documented in the editor help.

Additional controls are separate from the seven optical controls:
- Brightness and saturation affect the transmitted background only.
- Shadow lift raises dark input values; 0 preserves black. This replaces the
  SDK's otherwise fixed clear-material lift of 0.157 (or 0.237 when nested).
- Fill color and opacity produce a uniform CSS fill, independent of optics.
  There is no CSS gradient or extra stroke disguising the material's light.

## Rendering and maintenance

`data-glass-optics` carries validated numeric settings on each existing SDK
surface. The patch reads changes in the SDK's own frame, before geometry and
material maps are resolved. WGSL maps include depth, angle, intensity and splay
in their cache key, including capsule maps and persisted maps. Configured
lighting uses continuous angular lobes with a weak full-contour component,
so highlights fade smoothly around the sides instead of crossing a hard gate. Frost, tone and
chromatic samples are composed in the same SVG material graph. Labels are
siblings above the optical paint and remain sharp.

`GlassBackdrop` keeps the actual page aligned beneath the fixed control,
including scroll, images and live video converted to canvas. Its source must
stay mounted when adjusting controls; a separate wrapper filter can invalidate
old source refs during hot reload. Change optical settings, not the backdrop's
DOM structure. After changing the package patch, restart Vite with `--force`
to discard its cached dependency prebundle.

When upgrading the SDK, explicitly port and review the patch before updating
the lockfile. Run `pnpm test:glass`, `pnpm build`, and verify the real browser:
zero light, zero refraction, strong Frost, dispersion, layer independence,
scrolling and tab selection. Compilation alone cannot prove the visual effect.

## No Type product card

`NoTypePromo` uses the same shared shell material for its linked card and the
indicator material for its circular arrow. Both are SDK surfaces, with the
logo and text kept above their optical layers. Since this card is in normal
document flow over a uniform page, its scene samples the page colour with a
refraction gutter. It does not mirror its own containing document. The native
anchor, analytics handlers and reduced-motion logo remain intact.

## Language menu

`LanguageMenu` replaces the header's text toggle with the local Phosphor Translate
asset and a menu of the existing English and Russian translations. Both share
one scene with the navigation's shell optics and a bounded live backdrop.
`liquidMenuFlow.ts` plans a shared signed-distance field for the button and
panel. The source compresses, narrows and stretches as the panel pulls out;
their neck thins until the field separates. `liquidMenu.ts` advances one
critically damped spring and supplies this contour to the optical renderer,
scene clip and uniform tint together. The blue tint follows only the moving
button head, while the icon follows its displacement and scale.
The button has no independent glass surface or background over a moving copy.
While joined, the first optical surface owns the entire body and the second is
invisible. At the split, ownership passes to the two separate contours without
crossfading duplicate source or panel surfaces. Fields are prepared at rest;
an immediate cold opening holds its last complete pose while required maps warm.

The Phosphor silhouette uses a solid theme-aware mask, slightly heavier in light
mode. Labels reveal at their normal size only when the panel has room.
The button's blue tint and blue icon color follow the
open state: selecting a language or dismissing the menu starts their return to
neutral immediately. The panel remains mounted until the closing spring rests
and emits `glass:exited`; reversing preserves its current pose and velocity.
System reduced motion snaps to the destination.
Keyboard focus waits for visible content; menu keys do not reach section
navigation. Selected, hovered and keyboard-focused rows use the same fill as
the active navigation segment. Their content stays on one WebKit compositing
layer through blur-to-clear.
`tests/glass-menu.test.mjs` covers source deformation, field
ownership, continuity at separation, coupled paint, reversal, and cold maps.
Contour sampling starts at the upper-left support point. Choosing only the
highest point is ambiguous on a horizontal edge and can swap its ends between
stops, folding the interpolated panel inward just before it opens. A dense
area check over the final motion catches this on desktop and mobile layouts.

Case navigation shares this same scene. A second spring pulls a matching round
Back button out to the right of the language control using the rotated menu
field, and rejoins it when leaving cases. The source field is still owned by
one surface; a third surface takes the arrow only after separation. If the
language menu is open when the case state changes, it closes before the arrow
moves. Once the arrow rests, the menu can open normally beside it. Both springs
retain velocity on reversal and respect reduced motion. The mobile dock reserves
space for the pair; desktop keeps them in the upper-left corner. Back calls the
existing Work return action, preserving its scroll position.

The motion follows Apple's [Meet Liquid Glass, 4:32–5:23](https://developer.apple.com/videos/play/wwdc2025/219/?time=272):
a control changes shape to reveal its menu and preserve the relationship with
the point of interaction. This is the web implementation, not Apple's renderer.

## Selection motion

The selected indicator is one native capsule throughout its movement. It never
splits, develops a neck, or spans both source and destination at once.
`src/lib/glass/liquidFlow.ts` interpolates its position and width; its height
remains fixed. `liquidSelection.ts` writes that live box in the SDK's own frame,
before optical geometry is sampled. No morph waypoints need to be generated or
prepared, so a gesture can start moving the indicator immediately.

The SDK's filter graph updates in every frame where a surface's box changes.
Its 15 ms throttle applies only to animation without a geometry change. Applying
that throttle to moving boxes made the DOM fill advance ahead of its optical
rim on high-refresh displays, producing a second edge near the end of a slide.

Material requests and their delayed image warm-up callbacks are checked against
both the requested and current geometry keys before they can commit. A narrow
Home texture used to arrive after a cached wide capsule map and overwrite it,
stretching its rounded ends across Explorations even though their screen boxes
were synchronized. `tests/glass-maps.test.mjs` covers this ordering and commits
the map and its contour as one matching pair.
The reusable capsule map is also prepared and warmed while the custom surface
is still stationary. A ready current map can replace a fallback even if an older
request is in flight, so the first width change does not wait behind that work.

Extra scroll at the top or bottom of a page moves the capsule toward the pending
tab, following an S curve: slow departure, a fast middle and a gradual arrival.
The curve is a double smoothstep with continuous velocity and no overshoot;
the 28 ms tracking filter smooths input steps without a long trailing glide.
Committing a preview decelerates the remaining distance without starting a
second acceleration. The current page and selected tab
stay active while the gesture is in progress. On release (650 ms idle for a
wheel/keyboard gesture), the capsule settles to the nearer endpoint based on its
actual rendered position. Past halfway it selects the destination page and
completes the same slide without restarting; otherwise it returns in 220 ms.
Touch cancellation always returns to the current page. Ordinary clicks use a
300 ms slide. Rapid clicks retarget from
the current position. Reduced motion and layout changes settle immediately.

The local `GlassSurface.geometry` extension schedules this driver before the
scene measures its surfaces; the driver returns no custom optical contour, so
the SDK renders its normal rounded capsule. Page content does not morph.
`tests/glass-motion.test.mjs` checks early edge movement, a single capsule,
immediate response, cancellation, commit continuity, rapid retargeting,
direction reversal, resizing and reduced motion.

`src/lib/sectionScroll.ts` decides navigation only from the current page's edge
and scroll direction. Input is never locked or consumed after a section switch.
Forward navigation arrives at the top of the new section; backward navigation
arrives at the bottom. Continuing trackpad input immediately scrolls the new
page's contents, then starts the next transition once it reaches the outgoing
edge. No pause or fresh gesture is required. Selecting a header tab always opens
the section at the top, including selecting the already active tab. Other
section returns, such as the back-to-cases button, can restore their saved position.

Case routes always open at the top, including direct links, browser back/forward,
and the next-case scroll gesture. Case scroll positions are no longer saved;
older stored values are ignored. `navigationArrival` centralizes these rules so
case navigation cannot accidentally inherit a section's bottom or saved arrival.

Section order is linear: Home → Explorations → Work → About. Scrolling above
Home or below About does not wrap across the menu. Every scroll transition has
one adjacent destination, whose page becomes active before another transition
can begin. This prevents a Home → About preview passing across the middle tabs
while the Home screen is still shown.
