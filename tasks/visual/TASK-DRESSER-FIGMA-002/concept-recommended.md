# Recommended concept — compact Dresser tool panel

Low-fidelity hierarchy for the default `360×640` plugin window:

```text
┌──────────────────────────────────────┐
│ Dresser                    Frame ✓   │ 44
├──────────────────────────────────────┤
│ ┌──────────────────────────────────┐ │
│ │ exact rendered PNG preview       │ │ 184
│ └──────────────────────────────────┘ │
│ stale preview · Update               │
├──────────────────────────────────────┤
│ DEVICE                               │
│ [ Model ▾             ] [ Color ▾ ] │
│                                      │
│ BACKGROUND                           │
│ [Solid] [Photo] [Mesh] [None]       │
│ [ conditional mode controls       ] │
│                                      │
│ LAYOUT                               │
│ [16:9] [4:3] [1:1] [9:16]          │
│ Scale       ─────────●──── 150%     │
│ Horizontal  ─────●────────   0 px   │
│ Vertical    ───────●────── 100 px   │
│ Padding                         72  │
├──────────────────────────────────────┤
│ Reset  [Update preview] [Insert]    │ sticky
└──────────────────────────────────────┘
```

Rules:

- One vertical scroll region; header and action footer stay visible.
- Preview is always the latest browser-exported Dresser PNG, never an approximate CSS mockup. Controls mark it stale until Update or Insert refreshes it.
- Selection state is compact and text-first. No screenshot filename or document content is persisted or logged.
- Model/color use compact searchable or native-style selects; background modes use four labeled segments; only the active mode's fields appear.
- Fixed padding is shown read-only at the capability value rather than pretending it is adjustable.
- Insert is the only high-emphasis action. It is disabled during export/render and when selection or preview identity is invalid.
- Host light/dark variables control neutral surfaces and text; the preview keeps its rendered pixels unchanged.
- Expanded `420×720` may increase preview height and breathing room, but must not rearrange flow or hide footer actions.
- Error states replace only the affected status/action region and preserve the last valid preview. No-selection state replaces preview with one instruction: select one Frame.
- Motion is limited to 120–180 ms state feedback and respects reduced motion.

Main risk: the control inventory is dense. Progressive disclosure, a sticky footer, 28 px minimum rows, and a single scroll column keep the plugin usable without losing current capabilities.
