import type { Loc } from '@/lib/i18n'

/** Contacts page — concise, professional copy + the mailto form config. */
export const contact = {
  // Professional, but with a pulse — informal «ты», like the homepage bio.
  lead: {
    ru: [
      'Открыт к founding и product-дизайн ролям в AI-стартапах. Берусь и за проекты с консультациями — если задача цепляет.',
      'Проще всего написать в Telegram. Или заполни форму ниже — она соберёт письмо за тебя.',
    ],
    en: [
      "Open to founding and product-design roles at AI startups. I also take on consulting projects — when the problem is interesting.",
      'The easiest way to reach me is Telegram. Or fill out the form below — it drafts the email for you.',
    ],
  } as Loc<string[]>,
  // mailto form
  mailto: 'ermolt2002@gmail.com',
  subject: { ru: 'Запрос с сайта darling.design', en: 'Inquiry from darling.design' } as Loc,
  namePlaceholder: { ru: 'Имя или компания', en: 'Name or company' } as Loc,
  messagePlaceholder: { ru: 'Коротко о задаче или предложении', en: 'A few words about the task or offer' } as Loc,
  send: { ru: 'Отправить письмо', en: 'Send email' } as Loc,
}
