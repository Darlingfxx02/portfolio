import {
  EnvelopeSimple,
  LinkedinLogo,
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

// Рыба — реальные ссылки подставлю позже.
export const socials: SocialLink[] = [
  { label: 'Telegram', href: 'https://t.me/darling_dsgn', Icon: TelegramLogo },
  { label: 'LinkedIn', href: '#', Icon: LinkedinLogo },
  { label: 'Email', href: 'mailto:hello@darling.design', Icon: EnvelopeSimple },
]
