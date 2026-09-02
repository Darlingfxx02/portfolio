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
  title: {
    ru: 'Продуктовый дизайнер / Product Designer',
    en: 'Product Designer',
  } as Loc,
  focus: { ru: 'AI · B2B · FinTech', en: 'AI · B2B · FinTech' } as Loc,
  summary: {
    ru: 'Продуктовый дизайнер с опытом более 3 лет в AI-, B2B- и FinTech-продуктах. Веду end-to-end дизайн: от бизнес-задачи, UX-архитектуры и пользовательских сценариев до интерактивного прототипа, UI, дизайн-системы, handoff, дизайн-ревью и итераций после релиза. Проектирую enterprise UX, роли и права доступа, multi-account сценарии, кошельки и выплаты, LLM-функции, ошибки и edge cases. Работаю с продуктом, аналитикой и разработкой; использую Figma, AI-инструменты и code-прототипы для проверки логики до фронтенда.',
    en: 'Product Designer with 3+ years of experience across AI, B2B, and FinTech products. I lead end-to-end design from business problem, UX architecture, and user flows to interactive prototypes, UI, design systems, handoff, design review, and post-release iteration. I design enterprise UX, roles and permissions, multi-account journeys, wallets and payouts, LLM features, errors, and edge cases. I work cross-functionally with product, analytics, and engineering, using Figma, AI tools, and code prototypes to validate logic before frontend development.',
  } as Loc,
  contacts: [
    { label: { ru: 'Почта', en: 'Email' }, value: profile.email, href: `mailto:${profile.email}` },
    { label: { ru: 'Telegram', en: 'Telegram' }, value: profile.telegramHandle, href: profile.telegram },
    { label: { ru: 'Портфолио', en: 'Portfolio' }, value: 'darling.design', href: 'https://darling.design/#works' },
    { label: { ru: 'GitHub', en: 'GitHub' }, value: 'Darlingfxx02', href: profile.links.claudeSkills },
  ],
  // Headline metrics — a scannable strip near the top of the CV.
  highlights: [
    { value: { ru: '2', en: '2' }, label: { ru: 'AI-продукта в текущей роли', en: 'AI products in my current role' } },
    { value: { ru: '2', en: '2' }, label: { ru: 'публичных финтех-кейса', en: 'public fintech case studies' } },
    { value: { ru: '3-4', en: '3-4' }, label: { ru: 'проектных потока параллельно', en: 'project streams in parallel' } },
    { value: { ru: '3+ года', en: '3+ years' }, label: { ru: 'в продуктовом дизайне', en: 'in product design' } },
  ] as { value: Loc; label: Loc }[],
  // Quantified achievement bullets per experience id (keys match experience.ts).
  achievements: {
    wmt: {
      ru: [
        'Отвечаю за end-to-end дизайн-цикл: UX-архитектуру, user flows, прототипы, UI, handoff, дизайн-ревью и итерации после релиза',
        'Проектирую enterprise UX: роли и права доступа, LLM-сценарии, системные состояния, ошибки и edge cases',
        'Перевожу ранние сценарии в AI- и code-прототипы, развиваю дизайн-систему и сопровождаю реализацию с продуктом, аналитикой и разработкой',
      ],
      en: [
        'Own the end-to-end design cycle: UX architecture, user flows, prototypes, UI, handoff, design review, and post-release iteration',
        'Design enterprise UX across roles and permissions, LLM journeys, system states, errors, and edge cases',
        'Turn early journeys into AI and code prototypes, evolve the design system, and support delivery with product, analytics, and engineering',
      ],
    },
    uxart: {
      ru: [
        'Вёл 3-4 проектных потока параллельно в AI, FinTech и B2B-продуктах',
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
        'Доработал раздел кошелька под требования ФНС, сохранив релизный ритм 5-10 дней',
        'Пересобрал уведомления в универсальный компонент с тремя режимами; компонент вошёл в дизайн-систему',
        'Внутренний before/after серии релизов: денежные обращения снизились с 41% до 19%, успешный первый вывод вырос с 71% до 89% (не A/B)',
      ],
      en: [
        'Updated the wallet section for tax-authority requirements while preserving the 5-10 day release cadence',
        'Rebuilt notifications as one component with three modes; the component entered the design system',
        'Internal before/after around the release series: money-related contacts fell from 41% to 19%, successful first withdrawal rose from 71% to 89% (not an A/B test)',
      ],
    },
    zinda: {
      ru: [
        'За 4 месяца прошёл путь от UX-аудита веб-сценариев до мобильной архитектуры, прототипов, спецификаций и handoff',
        'Спроектировал около 40 экранов и состояний, сформировал multi-account архитектуру и вынес кредитные продукты в post-MVP',
        'Production delivery завершала команда; продукт вышел',
      ],
      en: [
        'Moved from a UX audit of web journeys to mobile architecture, prototypes, specifications, and handoff in 4 months',
        'Designed about 40 screens and states, defined a multi-account architecture, and moved lending products to post-MVP',
        'Production delivery was completed by the team; the product shipped',
      ],
    },
    combogpt: {
      ru: [
        'End-to-end дизайн AI-агрегатора с нуля: от концепта до публичного релиза примерно за 3 месяца',
        'Спроектировал онбординг для неподготовленной аудитории и переключение моделей в один клик',
        'Довёл ключевые сценарии от концепта и прототипа до handoff и публичного релиза',
      ],
      en: [
        'End-to-end design of an AI aggregator from scratch: concept to public release in about 3 months',
        'Designed onboarding for a non-technical audience and one-click model switching',
        'Took the core journeys from concept and prototype through handoff and public release',
      ],
    },
  } as Record<string, Loc<string[]>>,
  // Only the highest-value skills — kept short so the left column doesn't run
  // past the right intro column. Domains live in the title + highlights.
  skills: [
    {
      group: { ru: 'Продукт', en: 'Product' },
      items: {
        ru: ['B2B SaaS', 'Enterprise UX', 'Продуктовые метрики'],
        en: ['B2B SaaS', 'Enterprise UX', 'Product metrics'],
      },
    },
    {
      group: { ru: 'Дизайн', en: 'Design' },
      items: {
        ru: ['UX/UI · Figma', 'User Flow', 'Дизайн-системы'],
        en: ['UX/UI · Figma', 'User Flow', 'Design systems'],
      },
    },
    {
      group: { ru: 'Доставка', en: 'Delivery' },
      items: {
        ru: ['Handoff · Design QA', 'Code-прототипы', 'AI workflows'],
        en: ['Handoff · Design QA', 'Code prototypes', 'AI workflows'],
      },
    },
  ] as { group: Loc; items: Loc<string[]> }[],
}
