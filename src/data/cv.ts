import { profile } from './profile'
import type { Loc } from '@/lib/i18n'

/**
 * CV content. The rendered sheet (components/Cv) is the source of truth for
 * the downloadable file — what you see on screen prints 1:1 to PDF, so this
 * data drives both. Work history is reused from experience.ts; the CV adds
 * quantified `achievements` per role + headline `highlights` so the document
 * reads well to both humans and résumé-screening models.
 *
 * NOTE: keep numbers conservative and backed by visible cases or interview-ready context.
 */
export const cv = {
  name: profile.name,
  filename: 'Timothe_Ermolaev_Resume',
  title: { ru: 'Продуктовый дизайнер', en: 'Product designer' } as Loc,
  focus: { ru: 'Финтех и AI', en: 'Fintech and AI' } as Loc,
  summary: {
    ru: 'Продуктовый дизайнер с 2+ годами опыта в AI- и финтех-продуктах. Веду задачи от бизнес-проблемы и сценариев до прототипа, handoff и итерации после релиза. Использую Figma, код и AI-инструменты, чтобы быстро проверять гипотезы живыми прототипами.',
    en: 'Product designer with 2+ years in AI and fintech. I take work from business problem and user flows to prototype, handoff, and post-release iteration. I use Figma, code, and AI tools to test hypotheses quickly with live prototypes.',
  } as Loc,
  contacts: [
    { label: 'Email', value: profile.email, href: `mailto:${profile.email}` },
    { label: 'Telegram', value: '@darling_dsgn', href: profile.telegram },
    { label: 'Portfolio', value: 'darling.design', href: 'https://darling.design/#works' },
    { label: 'GitHub', value: 'Darlingfxx02', href: profile.links.claudeSkills },
  ],
  // Headline metrics — a scannable strip near the top of the CV.
  highlights: [
    { value: { ru: '4', en: '4' }, label: { ru: 'продукта / направления в AI и финтехе', en: 'product tracks across AI and fintech' } },
    { value: { ru: '~100', en: '~100' }, label: { ru: 'экранов и состояний', en: 'screens and states' } },
    { value: { ru: '3–4', en: '3–4' }, label: { ru: 'проектных потока параллельно', en: 'project streams in parallel' } },
    { value: { ru: '2+ года', en: '2+ years' }, label: { ru: 'в AI- и финтех-продуктах', en: 'in AI and fintech products' } },
  ] as { value: Loc; label: Loc }[],
  // Quantified achievement bullets per experience id (keys match experience.ts).
  achievements: {
    wmt: {
      ru: [
        'Веду дизайн-цикл двух AI-продуктов — от сценариев до передачи в разработку',
        'Помогаю команде быстрее переходить от сценариев к фронтенду через прототипы и понятный handoff',
        'Настраиваю интерфейсные процессы внутри продуктовых команд',
      ],
      en: [
        'Lead the design cycle for both products — from flows to developer handoff',
        'Help the team move from scenarios to frontend faster through prototypes and clear handoff',
        'Set up interface processes inside the product teams',
      ],
    },
    uxart: {
      ru: [
        'Вёл 3–4 проектных потока параллельно',
        'Заменил статичные пресейл-макеты на кликабельные AI-прототипы, доступные по ссылке',
        'После ретро и обучения команды следующий пресейл выиграли; формат AI-прототипов закрепился как стандарт студии',
      ],
      en: [
        'Ran 3–4 project streams in parallel',
        'Replaced static presale mockups with clickable AI prototypes shareable by link',
        'After the retro and team training, the next presale was won; AI prototypes became a studio standard',
      ],
    },
    ovork: {
      ru: [
        'Доработал раздел кошелька под требования ФНС, сохранив релизный ритм 5–10 дней',
        'Пересобрал уведомления в универсальный компонент с тремя режимами; компонент вошёл в дизайн-систему',
        'По метрикам раздела после релиза: денежные обращения 41% → 19%, первый вывод 71% → 89%',
      ],
      en: [
        'Updated the wallet section for tax-authority requirements while preserving the 5–10 day release cadence',
        'Rebuilt notifications as one component with three modes; the component entered the design system',
        'Section metrics after release: money-related tickets 41% → 19%, first-withdrawal conversion 71% → 89%',
      ],
    },
    zinda: {
      ru: [
        'За 4 месяца довёл концепт B2B-банка до handoff в разработку; банк позже релизнули',
        'Спроектировал ~40 экранов и состояний ключевых банковских сценариев',
        'Предложил многосчётную архитектуру и вынес кредитные продукты в post-MVP; вместе с дизайн-командой довёл компоненты и edge cases до production-ready уровня',
      ],
      en: [
        'Took the B2B-bank concept to engineering handoff in 4 months; the bank shipped later',
        'Designed ~40 screens and states across the core banking flows',
        'Proposed the multi-account architecture and moved credit products to post-MVP; worked with the design team to make components and edge cases production-ready',
      ],
    },
    combogpt: {
      ru: [
        'End-to-end дизайн AI-агрегатора с нуля: от концепта до публичного релиза за ~3 месяца',
        'Онбординг под неподготовленную аудиторию — активация новых пользователей ~55%',
        'Переключение моделей в один клик снизило отвалы на этапе выбора модели на ~25%',
      ],
      en: [
        'End-to-end design of an AI aggregator from scratch: concept to public release in ~3 months',
        'Onboarding built for a non-technical audience — new-user activation ~55%',
        'One-click model switching cut drop-off at the model-choice step by ~25%',
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
        ru: ['Прототипы на коде', 'AI workflows'],
        en: ['Code prototypes', 'AI workflows'],
      },
    },
  ] as { group: Loc; items: Loc<string[]> }[],
}
