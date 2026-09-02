import {
  ArrowLeft,
  ArrowCounterClockwise,
  DownloadSimple,
  Question,
  UploadSimple,
  type Icon,
} from '@phosphor-icons/react'

export type MockupIconKey =
  | 'action.upload'
  | 'action.export'
  | 'action.reset'
  | 'navigation.back'
  | 'action.unknown'

const icons: Record<MockupIconKey, Icon> = {
  'action.upload': UploadSimple,
  'action.export': DownloadSimple,
  'action.reset': ArrowCounterClockwise,
  'navigation.back': ArrowLeft,
  'action.unknown': Question,
}

export function resolveMockupIcon(key: string): Icon {
  if (key in icons) return icons[key as MockupIconKey]

  if (import.meta.env.DEV) {
    console.warn(`[Mockup Studio] Unknown icon key: ${key}`)
  }
  return Question
}
