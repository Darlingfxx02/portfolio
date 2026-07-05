export type CaseStudy = {
  id: string
  title: string
  year: string
  category: string
  /** Optional cover image URL; empty slot shown when absent. */
  image?: string
  /** Multiple phone screens, shown side-by-side (mobile cases). */
  images?: string[]
  /** Device frame the interface is shown inside. Defaults to laptop. */
  device?: 'laptop' | 'phone'
}

export const cases: CaseStudy[] = [
  { id: 'zinda', title: 'Zinda', year: '2025', category: 'Финтех · B2B', image: '/cases/zinda.webp', device: 'laptop' },
  { id: 'uxart', title: 'UXART', year: '2026', category: 'AI · Процессы', image: '/cases/uxart.webp', device: 'laptop' },
  {
    id: 'ovork',
    title: 'ОВорк',
    year: '2026',
    category: 'Финтех · Mobile',
    device: 'phone',
    images: ['/cases/ovork-1.webp', '/cases/ovork-2.webp', '/cases/ovork-3.webp'],
  },
]
