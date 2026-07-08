import type { Loc } from '@/lib/i18n'

/** Top-of-page profile: identity line + interactive bio. */
export const profile = {
  // Localized: the English CV/site latinizes the name (also drives the PDF filename).
  name: { ru: 'Тимофей Ермолаев', en: 'Timothe Ermolaev' } as Loc,
  role: 'Product designer. Currently at',
  employer: 'WMT AI',
  employerHref: 'https://wmtgroup.ru/',
  email: 'ermolt2002@gmail.com',
  telegram: 'https://t.me/darling_dsgn',
  // Hover → site (placeholder URLs, refine later).
  links: {
    claudeSkills: 'https://github.com/Darlingfxx02',
  },
}
