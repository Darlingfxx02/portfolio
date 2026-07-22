import type { Loc } from '@/lib/i18n'

export type ExperienceItem = {
  id: string
  company: string
  kind: 'employment' | 'project'
  period: {
    start: string
    end?: string
    ongoing?: boolean
    duration?: Loc
  }
  category: Loc
  lead: Loc
  text: Loc
}

export const experienceHeading = {
  title: 'Work experience',
}

export const experience: ExperienceItem[] = [
  {
    id: 'wmt',
    company: 'WMT Group',
    kind: 'employment',
    period: { start: '2026', ongoing: true },
    category: { ru: 'Продуктовый дизайнер · AI', en: 'Product designer · AI' },
    lead: { ru: 'Веду дизайн двух AI-продуктов.', en: 'Leading design on two AI products.' },
    text: {
      ru: ' Relevanter (подбор персонала) и Nier Key (доступ к зарубежным нейросетям без VPN) — от сценариев до передачи в разработку.',
      en: ' Relevanter (recruiting) and Nier Key (access to foreign AI models without a VPN) — from flows to developer handoff.',
    },
  },
  {
    id: 'uxart',
    company: 'UXART',
    kind: 'employment',
    period: { start: '2025', end: '2025' },
    category: { ru: 'UX/UI-дизайнер', en: 'UX/UI designer' },
    lead: { ru: 'Дизайн-студия из топа рейтинга Ruward.', en: 'A studio ranked among the top on Ruward.' },
    text: {
      ru: ' Вёл интерфейсные задачи на нескольких проектах параллельно и заменил статичные пресейл-макеты на живые AI-прототипы.',
      en: ' Ran interface work across several projects in parallel and replaced static presale mockups with live AI-built prototypes.',
    },
  },
  {
    id: 'ovork',
    company: 'OVork',
    kind: 'project',
    period: { start: '2025', end: '2026' },
    category: { ru: 'Product Designer · mobile fintech', en: 'Product designer · mobile fintech' },
    lead: { ru: 'Студийный проект для живого финтех-продукта.', en: 'A studio-side project for a live fintech product.' },
    text: {
      ru: ' Дорабатывал раздел кошелька под требования ФНС, выплаты и уведомления, с релизами каждые 5–10 дней.',
      en: ' Updated the wallet section around tax-authority requirements, payouts, and notifications, with releases every 5–10 days.',
    },
  },
  {
    id: 'zinda',
    company: 'Zinda',
    kind: 'project',
    period: {
      start: '2023',
      end: '2024',
      duration: { ru: '4 месяца', en: '4 months' },
    },
    category: { ru: 'Продуктовый дизайнер · финтех', en: 'Product designer · fintech' },
    lead: { ru: 'Финтех-банк для бизнеса.', en: 'A fintech bank for businesses.' },
    text: {
      ru: ' Вёл концептное направление и ключевые UX-решения: multi-account архитектура, MVP-скоуп и handoff в разработку.',
      en: ' Led the concept direction and key UX decisions: multi-account architecture, MVP scope, and engineering handoff.',
    },
  },
  {
    id: 'combogpt',
    company: 'ComboGPT',
    kind: 'employment',
    period: {
      start: '2024',
      end: '2024',
      duration: { ru: 'около 3 месяцев', en: 'about 3 months' },
    },
    category: { ru: 'Продуктовый дизайнер · контракт', en: 'Product designer · contract' },
    lead: { ru: 'End-to-end дизайн AI-агрегатора с нуля.', en: 'End-to-end design of an AI aggregator from scratch.' },
    text: {
      ru: ' ChatGPT, Claude, Gemini и Grok в одной подписке без VPN — переключение моделей в один клик и онбординг под неподготовленную аудиторию.',
      en: ' ChatGPT, Claude, Gemini and Grok in one subscription with no VPN — one-click model switching and onboarding built for a non-technical audience.',
    },
  },
]
