import type { Loc } from '@/lib/i18n'

export type CaseStudy = {
  id: string
  title: Loc
  year: string
  category: Loc
  /** One-line outcome used for accessible labels and optional future surfaces. */
  outcome?: Loc
  /** Disabled cases are visible but unavailable to open, e.g. under NDA. */
  disabled?: boolean
  /** Optional cover image URL; empty slot shown when absent. */
  image?: string
  /** Multiple phone screens, shown side-by-side (mobile cases). */
  images?: string[]
  /** Device frame the interface is shown inside. Defaults to laptop. */
  device?: 'laptop' | 'phone'
}

export const cases: CaseStudy[] = [
  {
    id: 'ovork',
    title: { ru: 'ОВорк. Кошелёк, выплаты и ФНС', en: 'OVork. Wallet, payouts, and tax requirements' },
    year: '2024 — 2025',
    category: { ru: 'Финтех · Mobile', en: 'Fintech · Mobile' },
    outcome: {
      ru: 'Регуляторный финансовый контур в живом продукте: релизы 5–10 дней, денежные обращения 41% → 19%, первый вывод 71% → 89%.',
      en: 'A regulatory financial layer in a live product: 5–10 day releases, money-related contacts 41% → 19%, first withdrawal 71% → 89%.',
    },
    device: 'phone',
    image: '/cases/case-cover-ovork.avif?v=20260723-1',
    images: ['/cases/ovork-1.webp', '/cases/ovork-2.webp', '/cases/ovork-3.webp'],
  },
  {
    id: 'uxart',
    title: {
      ru: 'UXART. Из AI-экспериментов — в процесс студии',
      en: 'UXART. From AI experiments to a studio workflow',
    },
    year: '2025',
    category: { ru: 'AI · Процессы', en: 'AI · Process' },
    outcome: {
      ru: 'Пилот генератора КП, live-прототипы, human review и выигранный следующий пресейл.',
      en: 'A proposal-generator pilot, live prototypes, human review, and the next presale won.',
    },
    image: '/cases/case-cover-uxart.avif?v=20260723-1',
    device: 'laptop',
  },
  {
    id: 'zinda',
    title: {
      ru: 'Zinda. Новый B2B-банк для бизнеса',
      en: 'Zinda. A new B2B bank for business',
    },
    year: '2023 — 2024',
    category: { ru: 'Финтех · Product Design', en: 'Fintech · Product Design' },
    outcome: {
      ru: 'Единая продуктовая архитектура, UI Kit и мобильное направление; handoff за четыре месяца.',
      en: 'One product architecture, UI kit, and mobile direction; handoff in four months.',
    },
    image: '/cases/case-cover-zinda-formation.jpg',
    device: 'laptop',
  },
  {
    id: 'rcon',
    title: { ru: 'Rcon. Продукт под NDA', en: 'Rcon. Product under NDA' },
    year: '—',
    category: { ru: 'NDA', en: 'NDA' },
    outcome: {
      ru: 'Кейс под NDA — покажу и разберу на звонке.',
      en: 'Under NDA — full walk-through on a call.',
    },
    image: '/cases/case-cover-rcon.png',
    disabled: true,
  },
]
