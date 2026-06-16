export type ExperienceItem = {
  id: string
  company: string
  year: string
  category: string
  lead: string
  text: string
}

export const experienceHeading = {
  title: 'Work experience',
}

export const experience: ExperienceItem[] = [
  {
    id: 'wmt',
    company: 'WMT Group',
    year: '2026',
    category: 'Продуктовый дизайнер · AI',
    lead: 'Веду дизайн двух AI-продуктов.',
    text: ' Relevanter (подбор персонала) и Nier Key (доступ к зарубежным нейросетям без VPN) — от сценариев до передачи в разработку.',
  },
  {
    id: 'uxart',
    company: 'UXART',
    year: '2025',
    category: 'UX/UI-дизайнер',
    lead: 'Дизайн-студия из топа рейтинга Ruward.',
    text: ' Вёл интерфейсные задачи на нескольких проектах параллельно и заменил статичные пресейл-макеты на живые AI-прототипы.',
  },
  {
    id: 'zinda',
    company: 'Zinda',
    year: '2025',
    category: 'Продуктовый дизайнер · финтех',
    lead: 'Финтех-банк для бизнеса.',
    text: ' Забрал проектирование продукта на себя и провёл десктоп и мобильное приложение от концепта до релиза.',
  },
  {
    id: 'combogpt',
    company: 'ComboGPT',
    year: '2024',
    category: 'Продуктовый дизайнер · контракт',
    lead: 'End-to-end дизайн AI-агрегатора с нуля.',
    text: ' ChatGPT, Claude, Gemini и Grok в одной подписке без VPN — переключение моделей в один клик и онбординг под неподготовленную аудиторию.',
  },
]
