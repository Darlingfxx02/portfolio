# No Type pixel renderer

These renderer modules and their TypeScript declarations are copied unchanged
from `CrossPlatform/src/recorder/` in the owner's `Darlingfxx02/no-tipe` repository.

Source revision: `5d9e0431da5a1e9fa8180649ad953a7bb501903c`.
Source: https://github.com/Darlingfxx02/no-tipe/tree/5d9e0431da5a1e9fa8180649ad953a7bb501903c/CrossPlatform/src/recorder

`NoTypeFace.tsx` adapts the renderer to the portfolio. It uses the original
`PixelAffection` transition, heart shape, heartbeat and expanding red echoes.
Card hover or keyboard focus supplies the `petting` input instead of requiring
the desktop app's petting gesture. The normal face keeps the original neutral
motion. Rendering pauses offscreen and in hidden tabs, and respects reduced motion.

No Tauri, microphone, recorder or network integration is included.
