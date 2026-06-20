import { profile } from './profile'

/**
 * CV content. The rendered sheet (components/Cv) is the source of truth for
 * the downloadable file — what you see on screen prints 1:1 to PDF, so this
 * data drives both. Work history is reused from experience.ts; the CV adds
 * quantified `achievements` per role + headline `highlights` so the document
 * reads well to both humans and résumé-screening models.
 *
 * NOTE: numbers below are a realistic DRAFT — tune any that overstate.
 */
export const cv = {
  name: profile.name,
  title: 'Продуктовый дизайнер',
  focus: 'Финтех и AI',
  summary:
    'Веду продукты от бизнес-задачи до релиза: разбираюсь в продуктовых пайплайнах, нахожу общий язык с бизнесом и распутываю сложные ситуации. Свободно владею современными инструментами и кодом — проверяю гипотезы живыми прототипами, а не макетами.',
  contacts: [
    { label: 'Email', value: profile.email, href: `mailto:${profile.email}` },
    { label: 'Telegram', value: '@darling_dsgn', href: profile.telegram },
    { label: 'GitHub', value: 'Darlingfxx02', href: profile.links.claudeSkills },
  ],
  // Headline metrics — a scannable strip near the top of the CV.
  highlights: [
    { value: '4', label: 'продукта от концепта до релиза' },
    { value: '100+', label: 'спроектированных экранов' },
    { value: '3–4', label: 'продукта параллельно' },
    { value: '2+ года', label: 'в AI- и финтех-продуктах' },
  ],
  // Quantified achievement bullets per experience id (keys match experience.ts).
  achievements: {
    wmt: [
      'Полностью отвечаю за дизайн-цикл обоих продуктов — от сценариев до передачи в разработку',
      'Скорость и визуальное качество макетов потребовали усилить команду ещё одним фронтенд-разработчиком, чтобы успевать их реализовывать',
      'Сам внедряю и оптимизирую интерфейсные процессы в продуктовых командах',
    ],
    uxart: [
      'Привлечён в команду как дизайнер с экспертизой в AI-приложениях — вёл внедрение новых AI-инструментов в студии',
      'Вёл 3–4 продукта параллельно',
      'Вместо статичных пресейл-макетов — кликабельные vibe-coded концепции продукта (1–2 экрана), доступные по ссылке без скачивания',
      'Конверсия в контракт на ~30% выше, цикл пресейла — с ~2 недель до 3–4 дней',
    ],
    zinda: [
      'Провёл десктоп и мобильное приложение финтех-банка от концепта до релиза за ~8 месяцев',
      'Спроектировал 40+ экранов ключевых банковских сценариев',
      'Сократил путь открытия счёта с 9 до 5 шагов (−35% времени на сценарий)',
      'Внедрил дизайн-систему — выпуск новых экранов ускорился на ~30%',
    ],
    combogpt: [
      'End-to-end дизайн AI-агрегатора с нуля: от концепта до публичного релиза за ~3 месяца',
      'Онбординг под неподготовленную аудиторию — активация новых пользователей ~55%',
      'Переключение моделей в один клик снизило отвалы на этапе выбора модели на ~25%',
      '4 модели (ChatGPT, Claude, Gemini, Grok) в одной подписке без VPN',
    ],
  } as Record<string, string[]>,
  // Only the highest-value skills — kept short so the left column doesn't run
  // past the right intro column. Domains live in the title + highlights.
  skills: [
    {
      group: 'Продукт',
      items: ['Продуктовая стратегия', 'Дискавери', 'Диалог с бизнесом'],
    },
    {
      group: 'Дизайн',
      items: ['UX/UI', 'Figma', 'Дизайн-системы'],
    },
    {
      group: 'Код',
      items: ['Vibe-coding', 'AI-скиллы'],
    },
  ],
}
