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
    ru: 'Продуктовый дизайнер с опытом более 3 лет. Сейчас работаю в продуктовой команде WMT AI и отвечаю за дизайн двух AI-продуктов: от бизнес-задачи и сценариев до прототипа, handoff и итераций после релиза. До этого полтора года работал в дизайн-студии: вёл несколько клиентских проектов параллельно, быстро погружался в новые домены и доводил решения до передачи в разработку.',
    en: 'Product designer with 3+ years of experience. I currently work in-house at WMT AI, leading design for two AI products from business problem and user flows to prototype, handoff, and post-release iteration. Before that, I spent a year and a half at a design studio, running several client projects in parallel, quickly learning new domains, and taking solutions through developer handoff.',
  } as Loc,
  contacts: [
    { label: 'Email', value: profile.email, href: `mailto:${profile.email}` },
    { label: 'Telegram', value: profile.telegramHandle, href: profile.telegram },
    { label: 'Portfolio', value: 'darling.design', href: 'https://darling.design/#works' },
    { label: 'GitHub', value: 'Darlingfxx02', href: profile.links.claudeSkills },
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
        'Довёл ключевые сценарии двух AI-продуктов от бизнес-задачи до реализации и итераций после релиза',
        'Перевёл раннее обсуждение сценариев в интерактивные прототипы на коде, чтобы продукт и разработка проверяли логику до фронтенда',
        'Объединил требования, состояния и handoff в повторяемый дизайн-цикл для обеих продуктовых команд',
      ],
      en: [
        'Took key journeys across two AI products from business problem to implementation and post-release iteration',
        'Turned early flow discussions into interactive code prototypes so product and engineering could validate logic before frontend work',
        'Unified requirements, state coverage, and handoff into a repeatable design cycle for both product teams',
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
        'После 3 отклонённых концепций помог свести участников к одной продуктовой основе; за 4 месяца направление дошло до handoff, банк позже вышел',
        'Сформировал multi-account архитектуру для 4 ключевых зон и сократил MVP, вынеся кредитные продукты в post-MVP',
        'Самостоятельно довёл мобильное направление от аудита веб-сценариев до прототипов и спецификаций; production delivery завершали командой',
      ],
      en: [
        'After 3 rejected concepts, helped align stakeholders around one product foundation; the direction reached handoff in 4 months and the bank later shipped',
        'Defined a multi-account architecture across 4 core areas and narrowed the MVP by moving lending to post-MVP',
        'Independently took the mobile direction from desktop-flow audit to prototypes and specifications; production delivery was collaborative',
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
