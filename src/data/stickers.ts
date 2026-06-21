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
  { id: 'device-stack', kind: 'image', src: '/stickers/device-stack.png', width: 132, rotate: -4, rx: 0.22, ry: 8, shape: 'rounded', alt: '' },
  { id: 'hobby1', kind: 'image', src: '/about/hobby1.png', width: 138, rotate: 6, rx: 0.34, ry: 130, shape: 'rounded', alt: '' },
  { id: 'claude-icon', kind: 'image', src: '/stickers/claude-icon.png', width: 88, rotate: 4, rx: 0.49, ry: 170, shape: 'rounded', shadow: 'alpha', alt: '' },
  { id: 'hobby2', kind: 'image', src: '/about/hobby2.png', width: 160, rotate: -4, rx: 0.6, ry: 24, shape: 'rounded', alt: '' },
  { id: 'cloud-terminal', kind: 'image', src: '/stickers/cloud-terminal.png', width: 98, rotate: 7, rx: 0.73, ry: 18, shape: 'rounded', shadow: 'alpha', alt: '' },
  { id: 'self-portrait', kind: 'image', src: '/stickers/self-portrait.png', width: 146, rotate: -3, rx: 0.18, ry: 205, shape: 'rounded', alt: 'Портрет' },
  { id: 'friends-selfie', kind: 'image', src: '/stickers/friends-selfie.png', width: 146, rotate: 5, rx: 0.41, ry: 228, shape: 'rounded', alt: '' },
  // Telegram-style video circle — drop a square clip here to enable:
  // { id: 'krug', kind: 'video', src: '/stickers/krug.mp4', width: 120, rotate: -3, rx: 0.5, ry: 210, shape: 'circle' },
]
