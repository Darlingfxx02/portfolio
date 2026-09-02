import type { Loc } from '@/lib/i18n'

export type ExperienceItem = {
  id: string
  company: string
  kind: 'employment' | 'project'
  parentId?: string
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
    company: 'WMT AI',
    kind: 'employment',
    period: { start: '2025', ongoing: true },
    category: { ru: 'Продуктовый дизайнер · AI · B2B SaaS', en: 'Product Designer · AI · B2B SaaS' },
    lead: {
      ru: 'Веду продуктовый дизайн двух B2B SaaS / AI-продуктов.',
      en: 'Leading product design for two B2B SaaS / AI products.',
    },
    text: {
      ru: ' НейроКлюч - корпоративный доступ к LLM без передачи персональных данных; Relevanter - AI-сервис для подбора персонала.',
      en: ' NeuroKey provides enterprise access to LLMs without sharing personal data; Relevanter is an AI recruitment service.',
    },
  },
  {
    id: 'uxart',
    company: 'UXART',
    kind: 'employment',
    period: {
      start: '2023',
      end: '2025',
      duration: { ru: '2 года', en: '2 years' },
    },
    category: { ru: 'UX/UI-дизайнер', en: 'UX/UI designer' },
    lead: { ru: 'Вёл 3-4 проектных потока параллельно в AI, FinTech и B2B.', en: 'Ran 3-4 project streams in parallel across AI, FinTech, and B2B.' },
    text: {
      ru: ' Закрывал полный цикл: UX-аудит, анализ требований, архитектуру, user flows, прототипы, UI, дизайн-систему, спецификации и handoff.',
      en: ' Covered the full cycle: UX audit, requirements analysis, architecture, user flows, prototypes, UI, design systems, specifications, and handoff.',
    },
  },
  {
    id: 'ovork',
    company: 'OVork',
    kind: 'project',
    parentId: 'uxart',
    period: { start: '2024', end: '2025' },
    category: { ru: 'Product Designer · mobile fintech', en: 'Product designer · mobile fintech' },
    lead: { ru: 'Студийный проект для живого финтех-продукта.', en: 'A studio-side project for a live fintech product.' },
    text: {
      ru: ' Дорабатывал раздел кошелька под требования ФНС, выплаты и уведомления, с релизами каждые 5-10 дней.',
      en: ' Updated the wallet section around tax-authority requirements, payouts, and notifications, with releases every 5-10 days.',
    },
  },
  {
    id: 'zinda',
    company: 'Zinda',
    kind: 'project',
    parentId: 'uxart',
    period: {
      start: '2023',
      end: '2024',
      duration: { ru: '4 месяца', en: '4 months' },
    },
    category: { ru: 'Продуктовый дизайнер · финтех', en: 'Product designer · fintech' },
    lead: {
      ru: 'За 4 месяца довёл мобильное направление B2B-банка до handoff.',
      en: 'Took the mobile direction of a B2B bank to handoff in 4 months.',
    },
    text: {
      ru: ' Спроектировал около 40 экранов и состояний, multi-account архитектуру, прототипы и спецификации; кредитные продукты вынес в post-MVP. Продукт вышел.',
      en: ' Designed about 40 screens and states, a multi-account architecture, prototypes, and specifications; moved lending products to post-MVP. The product shipped.',
    },
  },
  {
    id: 'combogpt',
    company: 'ComboGPT',
    kind: 'project',
    parentId: 'uxart',
    period: {
      start: '2024',
      end: '2024',
      duration: { ru: 'около 3 месяцев', en: 'about 3 months' },
    },
    category: { ru: 'Продуктовый дизайнер · AI', en: 'Product Designer · AI' },
    lead: { ru: 'End-to-end дизайн AI-агрегатора с нуля.', en: 'End-to-end design of an AI aggregator from scratch.' },
    text: {
      ru: ' ChatGPT, Claude, Gemini и Grok в одной подписке без VPN: переключение моделей в один клик и онбординг под неподготовленную аудиторию.',
      en: ' ChatGPT, Claude, Gemini and Grok in one subscription with no VPN: one-click model switching and onboarding built for a non-technical audience.',
    },
  },
]
