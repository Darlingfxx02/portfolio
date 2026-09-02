import { ArrowClockwise, CheckCircle, CircleNotch, DeviceMobile, Image, ImageSquare, Question, SlidersHorizontal, Sparkle, SquaresFour, WarningCircle, X } from '@phosphor-icons/react'
import type { Icon } from '@phosphor-icons/react'

export type IconKey =
  | 'action.refresh-preview' | 'action.insert' | 'action.reset' | 'action.retry'
  | 'status.selection' | 'status.error' | 'background.solid' | 'background.picture'
  | 'background.mesh' | 'background.transparent' | 'action.unknown'

const icons: Record<IconKey, Icon> = {
  'action.refresh-preview': ArrowClockwise,
  'action.insert': Sparkle,
  'action.reset': X,
  'action.retry': ArrowClockwise,
  'status.selection': CheckCircle,
  'status.error': WarningCircle,
  'background.solid': SquaresFour,
  'background.picture': Image,
  'background.mesh': SlidersHorizontal,
  'background.transparent': ImageSquare,
  'action.unknown': Question,
}

export function resolveIcon(key: string): Icon {
  const resolved = icons[key as IconKey]
  if (!resolved && import.meta.env.DEV) console.warn(`Unknown Dresser icon key: ${key}`)
  return resolved ?? Question
}

export { CircleNotch, DeviceMobile }
