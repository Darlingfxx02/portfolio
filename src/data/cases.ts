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
    title: { ru: 'ОВорк. Полный финансовый цикл', en: 'OVork. The full financial cycle' },
    year: '2025 — 2026',
    category: { ru: 'Финтех · Mobile', en: 'Fintech · Mobile' },
    outcome: {
      ru: 'От управления сменами — к прозрачным начислениям, удержаниям и выплатам внутри продукта.',
      en: 'From shift management to transparent accruals, deductions, and payouts inside the product.',
    },
    device: 'phone',
    image: '/cases/case-cover-ovork.avif?v=20260723-1',
    images: ['/cases/ovork-1.webp', '/cases/ovork-2.webp', '/cases/ovork-3.webp'],
  },
  {
    id: 'zinda',
    title: { ru: 'Zinda. Первый цифровой банк Таджикистана', en: 'Zinda. Tajikistan’s first digital bank' },
    year: '2025',
    category: { ru: 'Финтех · B2B', en: 'Fintech · B2B' },
    outcome: {
      ru: 'Четыре итерации согласования и один MVP для трёх конкурирующих видений продукта.',
      en: 'Four alignment rounds and one MVP across three competing product visions.',
    },
    image: '/cases/case-cover-zinda.avif?v=20260723-1',
    device: 'laptop',
  },
  {
    id: 'uxart',
    title: { ru: 'UXART. AI-трансформация студии', en: 'UXART. Studio-wide AI transformation' },
    year: '2025',
    category: { ru: 'Change · Процессы', en: 'Change · Process' },
    outcome: {
      ru: 'Аудит процессов, генератор КП, AI-пресейлы и единый фреймворк автоматизации.',
      en: 'Process audit, proposal generator, AI presales, and one automation framework.',
    },
    image: '/cases/case-cover-uxart.avif?v=20260723-1',
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
