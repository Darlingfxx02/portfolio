import type { Loc } from '@/lib/i18n'

export type CaseStudy = {
  id: string
  title: Loc
  year: string
  category: Loc
  /** Optional cover image URL; empty slot shown when absent. */
  image?: string
  /** Multiple phone screens, shown side-by-side (mobile cases). */
  images?: string[]
  /** Device frame the interface is shown inside. Defaults to laptop. */
  device?: 'laptop' | 'phone'
}

export const cases: CaseStudy[] = [
  { id: 'zinda', title: { ru: 'Zinda', en: 'Zinda' }, year: '2025', category: { ru: 'Финтех · B2B', en: 'Fintech · B2B' }, image: '/cases/zinda.webp', device: 'laptop' },
  { id: 'uxart', title: { ru: 'UXART', en: 'UXART' }, year: '2026', category: { ru: 'AI · Процессы', en: 'AI · Process' }, image: '/cases/uxart.webp', device: 'laptop' },
  {
    id: 'ovork',
    title: { ru: 'ОВорк', en: 'OVork' },
    year: '2026',
    category: { ru: 'Финтех · Mobile', en: 'Fintech · Mobile' },
    device: 'phone',
    images: ['/cases/ovork-1.webp', '/cases/ovork-2.webp', '/cases/ovork-3.webp'],
  },
]
