import {
  EnvelopeSimple,
  LinkedinLogo,
  TelegramLogo,
  type Icon as PhIcon,
} from '@phosphor-icons/react'

export type SocialLink = {
  label: string
  href: string
  Icon: PhIcon
}

export const footerContent = {
  eyebrow: 'Контакты',
  title: 'Давайте сделаем что-то крутое вместе',
}

// Рыба — реальные ссылки подставлю позже.
export const socials: SocialLink[] = [
  { label: 'Telegram', href: 'https://t.me/darling_dsgn', Icon: TelegramLogo },
  { label: 'LinkedIn', href: '#', Icon: LinkedinLogo },
  { label: 'Email', href: 'mailto:hello@darling.design', Icon: EnvelopeSimple },
]
