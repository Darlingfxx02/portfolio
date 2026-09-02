# Recommended concept — focused desktop studio

Low-fidelity hierarchy for `1440x900`:

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│ ← Portfolio   Mockup Studio                              Reset   Export PNG │ 56
├───────────────┬──────────────────────────────────────────┬───────────────────┤
│ Media         │                                          │ Composition       │
│               │          centered square canvas          │ Background  ■     │
│ [Upload image]│                                          │ Padding      ─●─  │
│               │       ┌──────────────────────────┐       │ Scale        ─●─  │
│ file status   │       │       solid backdrop     │       │ Horizontal   ─●─  │
│ and errors    │       │    generic phone shell   │       │ Vertical     ─●─  │
│               │       └──────────────────────────┘       │                   │
│ local-only    │                                          │                   │
└───────────────┴──────────────────────────────────────────┴───────────────────┘
      256 px                  flexible                         304 px
```

Visual rules:

- Full-viewport editor, near-black shell, no portfolio header or SiteBoot inside this route.
- One quiet top bar; left rail owns import state, right rail owns deterministic composition controls.
- The central stage is the dominant region. Its preview canvas is square, centered, and checkerboard-free because output always has a solid background.
- Generic phone geometry is a rounded dark shell with an inset screen and a single neutral speaker/camera detail. No logo, product name, brand silhouette, sourced artwork, or copied Dresser styling.
- Original controls use existing Geist/system typography, 12–16 px rhythm, subtle `rgba(255,255,255,0.08)` borders, and Phosphor icons only for upload, export, reset, back, and unknown-action fallback.
- Empty state puts the upload action in the center of the stage as well as the left rail. Loaded state replaces it with the composition. Invalid input shows a compact recoverable error beside the upload control and preserves the last valid composition.
- Export remains visually primary only after a valid image is loaded. Reset is secondary and restores control defaults without removing the image.

Cost and risk: lowest-cost complete desktop structure; no responsive/mobile promise. Main visual risk is preview/export mismatch, controlled by deriving both from the same geometry model.

