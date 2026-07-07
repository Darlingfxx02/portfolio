import type { Loc } from '@/lib/i18n'

export type ExperienceItem = {
  id: string
  company: string
  year: string
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
    year: '2026',
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
    year: '2025',
    category: { ru: 'UX/UI-дизайнер', en: 'UX/UI designer' },
    lead: { ru: 'Дизайн-студия из топа рейтинга Ruward.', en: 'A studio ranked among the top on Ruward.' },
    text: {
      ru: ' Вёл интерфейсные задачи на нескольких проектах параллельно и заменил статичные пресейл-макеты на живые AI-прототипы.',
      en: ' Ran interface work across several projects in parallel and replaced static presale mockups with live AI-built prototypes.',
    },
  },
  {
    id: 'zinda',
    company: 'Zinda',
    year: '2025',
    category: { ru: 'Продуктовый дизайнер · финтех', en: 'Product designer · fintech' },
    lead: { ru: 'Финтех-банк для бизнеса.', en: 'A fintech bank for businesses.' },
    text: {
      ru: ' Забрал проектирование продукта на себя и провёл десктоп и мобильное приложение от концепта до релиза.',
      en: ' Took product design end to end and carried both the desktop and mobile apps from concept to release.',
    },
  },
  {
    id: 'combogpt',
    company: 'ComboGPT',
    year: '2024',
    category: { ru: 'Продуктовый дизайнер · контракт', en: 'Product designer · contract' },
    lead: { ru: 'End-to-end дизайн AI-агрегатора с нуля.', en: 'End-to-end design of an AI aggregator from scratch.' },
    text: {
      ru: ' ChatGPT, Claude, Gemini и Grok в одной подписке без VPN — переключение моделей в один клик и онбординг под неподготовленную аудиторию.',
      en: ' ChatGPT, Claude, Gemini and Grok in one subscription with no VPN — one-click model switching and onboarding built for a non-technical audience.',
    },
  },
]
