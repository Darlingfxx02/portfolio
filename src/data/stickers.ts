export type StickerShape = 'rounded' | 'circle'
export type StickerKind = 'image' | 'video'

export type Sticker = {
  id: string
  kind: StickerKind
  src: string
  /** Rendered width in px. For circles, height locks to this too. */
  width: number
  /** Base tilt in degrees — hover nudges it a little further. */
  rotate: number
  shape?: StickerShape
  shadow?: 'panel' | 'alpha'
  /** Seed placement (used only on first load / no saved drag):
   *  rx = 0..1 across page width, ry = px offset below the anchor block. */
  rx: number
  ry: number
  alt?: string
}

/**
 * The pinboard of things I like — images, Telegram video circles, clips.
 * Drop files in /public/stickers and add an entry. Videos autoplay muted.
 * Positions are remembered per-visitor in localStorage once dragged.
 */
export const stickers: Sticker[] = [
  { id: 'device-stack', kind: 'image', src: '/stickers/device-stack.webp', width: 132, rotate: -4, rx: 0.22, ry: 8, shape: 'rounded', alt: '' },
  { id: 'hobby1', kind: 'image', src: '/about/hobby1.webp', width: 138, rotate: 6, rx: 0.34, ry: 130, shape: 'rounded', alt: '' },
  { id: 'hobby2', kind: 'image', src: '/about/hobby2.webp', width: 160, rotate: -4, rx: 0.6, ry: 24, shape: 'rounded', alt: '' },
  { id: 'self-portrait', kind: 'image', src: '/stickers/self-portrait.webp', width: 146, rotate: -3, rx: 0.18, ry: 205, shape: 'rounded', alt: 'Portrait' },
  { id: 'friends-selfie', kind: 'image', src: '/stickers/friends-selfie.webp', width: 146, rotate: 5, rx: 0.41, ry: 228, shape: 'rounded', alt: '' },
  // Real macOS app icons, extracted from Claude.app / Codex.app — paint last so
  // they sit on top of the photo cluster.
  { id: 'claude-icon', kind: 'image', src: '/stickers/claude-icon.webp', width: 88, rotate: 4, rx: 0.78, ry: 150, shape: 'rounded', shadow: 'alpha', alt: 'Claude' },
  { id: 'codex-icon', kind: 'image', src: '/stickers/codex-icon.webp', width: 84, rotate: -6, rx: 0.88, ry: 236, shape: 'rounded', shadow: 'alpha', alt: 'Codex' },
  { id: 'figma-icon', kind: 'image', src: '/stickers/figma-icon.webp', width: 86, rotate: 5, rx: 0.7, ry: 46, shape: 'rounded', shadow: 'alpha', alt: 'Figma' },
  // Telegram-style video circle — drop a square clip here to enable:
  // { id: 'krug', kind: 'video', src: '/stickers/krug.mp4', width: 120, rotate: -3, rx: 0.5, ry: 210, shape: 'circle' },
]
