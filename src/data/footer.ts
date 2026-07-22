import {
  EnvelopeSimple,
  TelegramLogo,
  type Icon as PhIcon,
} from '@phosphor-icons/react'
import type { Loc } from '@/lib/i18n'

export type SocialLink = {
  label: string
  href: string
  Icon: PhIcon
}

export const footerContent = {
  eyebrow: { ru: 'Контакты', en: 'Contact' } as Loc,
  title: {
    ru: 'Давайте сделаем что-то крутое вместе',
    en: "Let's make something great together",
  } as Loc,
}

// Single source of truth for social/contact links (used by Footer + Contact).
// LinkedIn is omitted until a real profile URL exists — a dead "#" link reads
// as broken to a hiring manager. Add it back here when the URL is ready.
export const socials: SocialLink[] = [
  { label: 'Telegram', href: 'https://t.me/darling_dsgn', Icon: TelegramLogo },
  { label: 'Email', href: 'mailto:ermolt2002@gmail.com', Icon: EnvelopeSimple },
]
