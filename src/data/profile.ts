import type { Loc } from '@/lib/i18n'

/** Top-of-page profile: identity line + interactive bio. */
export const profile = {
  // Localized: the English CV/site latinizes the name (also drives the PDF filename).
  name: { ru: 'Тимофей Ермолаев', en: 'Timothe Ermolaev' } as Loc,
  age: { ru: '24 года', en: '24 y.o.' } as Loc,
  role: {
    ru: 'Продуктовый дизайнер. Сейчас в',
    en: 'Product designer. Currently at',
  } as Loc,
  bio: {
    lead: {
      ru: 'Помогаю бизнесам организовывать порядок в дизайне и деливери в сложных ситуациях. Рисую кнопки и жгу',
      en: 'I help businesses bring order to design and delivery in complex situations. I draw buttons and burn',
    } as Loc,
    token: { ru: 'токены', en: 'tokens' } as Loc,
    tail: {
      ru: 'во благо человечества.',
      en: 'for the good of humanity.',
    } as Loc,
  },
  employer: 'WMT AI',
  employerHref: 'https://wmtgroup.ru/',
  email: 'timohae@outlook.com',
  telegram: 'https://t.me/darling_product',
  telegramHandle: '@darling_product',
  // Hover → site (placeholder URLs, refine later).
  links: {
    claudeSkills: 'https://github.com/Darlingfxx02',
  },
}
