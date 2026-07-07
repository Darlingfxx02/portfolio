import { profile } from './profile'
import type { Loc } from '@/lib/i18n'

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
  title: { ru: 'Продуктовый дизайнер', en: 'Product designer' } as Loc,
  focus: { ru: 'Финтех и AI', en: 'Fintech and AI' } as Loc,
  summary: {
    ru: 'Веду продукты от бизнес-задачи до релиза: разбираюсь в продуктовых пайплайнах, нахожу общий язык с бизнесом и распутываю сложные ситуации. Свободно владею современными инструментами и кодом — проверяю гипотезы живыми прототипами, а не макетами.',
    en: 'I take products from business problem to release: I know product pipelines, speak the language of business, and untangle messy situations. Fluent with modern tools and code — I test hypotheses with live prototypes, not static mockups.',
  } as Loc,
  contacts: [
    { label: 'Email', value: profile.email, href: `mailto:${profile.email}` },
    { label: 'Telegram', value: '@darling_dsgn', href: profile.telegram },
    { label: 'GitHub', value: 'Darlingfxx02', href: profile.links.claudeSkills },
  ],
  // Headline metrics — a scannable strip near the top of the CV.
  highlights: [
    { value: { ru: '4', en: '4' }, label: { ru: 'продукта от концепта до релиза', en: 'products from concept to release' } },
    { value: { ru: '100+', en: '100+' }, label: { ru: 'спроектированных экранов', en: 'screens designed' } },
    { value: { ru: '3–4', en: '3–4' }, label: { ru: 'продукта параллельно', en: 'products in parallel' } },
    { value: { ru: '2+ года', en: '2+ years' }, label: { ru: 'в AI- и финтех-продуктах', en: 'in AI and fintech products' } },
  ] as { value: Loc; label: Loc }[],
  // Quantified achievement bullets per experience id (keys match experience.ts).
  achievements: {
    wmt: {
      ru: [
        'Полностью отвечаю за дизайн-цикл обоих продуктов — от сценариев до передачи в разработку',
        'Скорость и визуальное качество макетов потребовали усилить команду ещё одним фронтенд-разработчиком, чтобы успевать их реализовывать',
        'Сам внедряю и оптимизирую интерфейсные процессы в продуктовых командах',
      ],
      en: [
        'Own the full design cycle for both products — from flows to developer handoff',
        'The speed and visual quality of my mockups pushed the team to add another frontend developer just to keep up with shipping them',
        'Introduce and optimize interface processes inside the product teams myself',
      ],
    },
    uxart: {
      ru: [
        'Привлечён в команду как дизайнер с экспертизой в AI-приложениях — вёл внедрение новых AI-инструментов в студии',
        'Вёл 3–4 продукта параллельно',
        'Вместо статичных пресейл-макетов — кликабельные vibe-coded концепции продукта (1–2 экрана), доступные по ссылке без скачивания',
        'Конверсия в контракт на ~30% выше, цикл пресейла — с ~2 недель до 3–4 дней',
      ],
      en: [
        'Brought in as a designer with AI-app expertise — led the rollout of new AI tools across the studio',
        'Ran 3–4 products in parallel',
        'Replaced static presale mockups with clickable vibe-coded product concepts (1–2 screens), shareable by link with no download',
        'Contract conversion up ~30%, presale cycle cut from ~2 weeks to 3–4 days',
      ],
    },
    zinda: {
      ru: [
        'Провёл десктоп и мобильное приложение финтех-банка от концепта до релиза за ~8 месяцев',
        'Спроектировал 40+ экранов ключевых банковских сценариев',
        'Сократил путь открытия счёта с 9 до 5 шагов (−35% времени на сценарий)',
        'Внедрил дизайн-систему — выпуск новых экранов ускорился на ~30%',
      ],
      en: [
        'Carried a fintech bank’s desktop and mobile apps from concept to release in ~8 months',
        'Designed 40+ screens across the core banking flows',
        'Shortened account opening from 9 steps to 5 (−35% time on the flow)',
        'Rolled out a design system — new screens shipped ~30% faster',
      ],
    },
    combogpt: {
      ru: [
        'End-to-end дизайн AI-агрегатора с нуля: от концепта до публичного релиза за ~3 месяца',
        'Онбординг под неподготовленную аудиторию — активация новых пользователей ~55%',
        'Переключение моделей в один клик снизило отвалы на этапе выбора модели на ~25%',
        '4 модели (ChatGPT, Claude, Gemini, Grok) в одной подписке без VPN',
      ],
      en: [
        'End-to-end design of an AI aggregator from scratch: concept to public release in ~3 months',
        'Onboarding built for a non-technical audience — new-user activation ~55%',
        'One-click model switching cut drop-off at the model-choice step by ~25%',
        '4 models (ChatGPT, Claude, Gemini, Grok) in one subscription with no VPN',
      ],
    },
  } as Record<string, Loc<string[]>>,
  // Only the highest-value skills — kept short so the left column doesn't run
  // past the right intro column. Domains live in the title + highlights.
  skills: [
    {
      group: { ru: 'Продукт', en: 'Product' },
      items: {
        ru: ['Продуктовая стратегия', 'Дискавери', 'Диалог с бизнесом'],
        en: ['Product strategy', 'Discovery', 'Working with business'],
      },
    },
    {
      group: { ru: 'Дизайн', en: 'Design' },
      items: {
        ru: ['UX/UI', 'Figma', 'Дизайн-системы'],
        en: ['UX/UI', 'Figma', 'Design systems'],
      },
    },
    {
      group: { ru: 'Код', en: 'Code' },
      items: {
        ru: ['Vibe-coding', 'AI-скиллы'],
        en: ['Vibe-coding', 'AI skills'],
      },
    },
  ] as { group: Loc; items: Loc<string[]> }[],
}
