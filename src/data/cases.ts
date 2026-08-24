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
    year: '2025 — 2026',
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
      ru: 'Zinda. От трёх концепций к архитектуре B2B-банка',
      en: 'Zinda. From three concepts to a B2B banking architecture',
    },
    year: '2023',
    category: { ru: 'Финтех · Product Growth', en: 'Fintech · Product Growth' },
    outcome: {
      ru: 'После трёх отклонённых концепций — единая архитектура четырёх банковских зон, сокращённый MVP и handoff за четыре месяца.',
      en: 'After three rejected concepts: one architecture across four banking areas, a focused MVP, and handoff in four months.',
    },
    image: '/cases/case-cover-zinda-formation.jpg',
    device: 'laptop',
  },
  {
    id: 'zinda-system',
    title: {
      ru: 'Zinda. Дизайн-система банка',
      en: 'Zinda. The bank design system',
    },
    year: '2023 — 2024',
    category: { ru: 'Design System · Финтех', en: 'Design System · Fintech' },
    outcome: {
      ru: 'Общий язык компонентов, состояний и тем для нескольких продуктовых направлений.',
      en: 'One language of components, states, and themes across multiple product areas.',
    },
    image: '/cases/case-cover-zinda-system.jpg',
    device: 'laptop',
  },
  {
    id: 'zinda-mobile',
    title: {
      ru: 'Zinda. Мобильное приложение — первое самостоятельное направление',
      en: 'Zinda Mobile. My first independently led direction',
    },
    year: '2024',
    category: { ru: 'Финтех · Mobile', en: 'Fintech · Mobile' },
    outcome: {
      ru: 'Пересобрал desktop-логику под мобильные сценарии и перешёл от производства экранов к ownership.',
      en: 'Rebuilt desktop logic for mobile and moved from screen production to ownership.',
    },
    image: '/cases/case-cover-zinda-mobile.jpg',
    device: 'phone',
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
