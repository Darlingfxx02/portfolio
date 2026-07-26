import {
  House,
  ImagesSquare,
  ReadCvLogo,
  PaperPlaneTilt,
  type Icon as PhIcon,
} from '@phosphor-icons/react'
import type { Loc } from '@/lib/i18n'

export type FolderBodyGradient = { from: string; to: string }

export type FolderSection = {
  label: Loc
  href: string
  Icon: PhIcon
  color: string
  bodyGradient?: FolderBodyGradient
  iconHoverColor?: string
  /** Download the href instead of navigating (CV). */
  download?: boolean
}

export const sections: FolderSection[] = [
  { label: { ru: 'Главная', en: 'Home' }, href: '#top', Icon: House, color: '#3b82f6' },
  {
    label: { ru: 'Кейсы', en: 'Work' },
    href: '#works',
    Icon: ImagesSquare,
    color: '#3b82f6',
  },
  {
    label: { ru: 'CV', en: 'CV' },
    href: '/cv/Timothe_Ermolaev_Resume.pdf?v=20260726-7',
    Icon: ReadCvLogo,
    color: '#3b82f6',
    download: true,
  },
  {
    label: { ru: 'Контакты', en: 'Contact' },
    href: '#contact',
    Icon: PaperPlaneTilt,
    color: '#3b82f6',
  },
]
