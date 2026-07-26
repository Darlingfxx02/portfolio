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
    category: { ru: 'Продуктовый дизайнер · AI', en: 'Product designer · AI' },
    lead: {
      ru: 'Веду два AI-продукта от бизнес-задачи до релиза.',
      en: 'Leading two AI products from business problem to release.',
    },
    text: {
      ru: ' Relevanter для подбора персонала и НейроКлюч для корпоративного доступа к зарубежным AI-моделям без передачи персональных данных: прототипы на коде, полное покрытие состояний, handoff и итерации после запуска.',
      en: ' Relevanter for recruiting and NeuroKey for enterprise access to international AI models without sharing personal data: code prototypes, full state coverage, handoff, and post-launch iteration.',
    },
  },
  {
    id: 'uxart',
    company: 'UXART',
    kind: 'employment',
    period: {
      start: '2023',
      end: '2025',
      duration: { ru: '1,5 года', en: '1.5 years' },
    },
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
    parentId: 'uxart',
    period: { start: '2025', end: '2026' },
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
      ru: 'Помог вывести B2B-банк из цикла отклонённых концепций.',
      en: 'Helped move a B2B bank beyond a cycle of rejected concepts.',
    },
    text: {
      ru: ' Сформировал multi-account архитектуру четырёх ключевых зон, вынес кредитные продукты в post-MVP и довёл направление до handoff за 4 месяца; банк позже вышел.',
      en: ' Defined a multi-account architecture across four core areas, moved lending to post-MVP, and took the direction to handoff in 4 months; the bank later shipped.',
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
    category: { ru: 'Продуктовый дизайнер · контракт', en: 'Product designer · contract' },
    lead: { ru: 'End-to-end дизайн AI-агрегатора с нуля.', en: 'End-to-end design of an AI aggregator from scratch.' },
    text: {
      ru: ' ChatGPT, Claude, Gemini и Grok в одной подписке без VPN: переключение моделей в один клик и онбординг под неподготовленную аудиторию.',
      en: ' ChatGPT, Claude, Gemini and Grok in one subscription with no VPN: one-click model switching and onboarding built for a non-technical audience.',
    },
  },
]
