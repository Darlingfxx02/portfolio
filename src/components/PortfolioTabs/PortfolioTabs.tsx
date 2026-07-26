import type { CSSProperties, PointerEvent } from 'react'
import { cases } from '@/data/cases'
import { experience } from '@/data/experience'
import { useLang, t } from '@/lib/i18n'
import { trackEvent } from '@/lib/analytics'
import { profile } from '@/data/profile'
import { MediaGrid } from '@/components/MediaGrid/MediaGrid'
import styles from './PortfolioTabs.module.css'

export type PortfolioTab = 'home' | 'work' | 'explorations' | 'about'
export type PortfolioContentTab = Exclude<PortfolioTab, 'home'>

const aboutCopy = {
  ru: [
    'Я продуктовый дизайнер из Москвы. Сейчас работаю в WMT AI над корпоративными AI-продуктами; до этого — в UXART, OVork и Zinda.',
    'Мне нравится превращать сложные сценарии в понятные интерфейсы: разбираться в продукте, быстро проверять идеи прототипами и доводить решения до релиза.',
    'Особенно интересуюсь AI-инструментами, дизайн-системами и тем, как дизайнеры могут быстрее собирать работающие продукты.',
  ],
  en: [
    'I am a product designer based in Moscow. I currently work on enterprise AI products at WMT AI; previously, I worked with UXART, OVork, and Zinda.',
    'I enjoy turning complex flows into clear interfaces: understanding the product, testing ideas quickly with prototypes, and carrying solutions through to release.',
    'I am especially interested in AI tools, design systems, and helping designers build working products faster.',
  ],
}

const CV_URL = '/cv/Timothe_Ermolaev_Resume.pdf?v=20260726-3'

function revealStyle(index: number) {
  return { '--reveal-index': index } as CSSProperties
}

function positionHoverChip(event: PointerEvent<HTMLElement>) {
  const item = event.currentTarget
  const rect = item.getBoundingClientRect()
  item.style.setProperty('--chip-x', `${event.clientX - rect.left}px`)
  item.style.setProperty('--chip-y', `${event.clientY - rect.top}px`)
  item.dataset.chipVisible = 'true'

  const rail = item.closest<HTMLElement>('[data-work-rail]')
  if (rail) {
    const railRect = rail.getBoundingClientRect()
    rail.style.setProperty(
      '--rail-y',
      `${rect.top - railRect.top + rect.height / 2}px`,
    )
    rail.dataset.railActive = 'true'
  }
}

function hideHoverChip(event: PointerEvent<HTMLElement>) {
  delete event.currentTarget.dataset.chipVisible
}

function hideRailIndicator(event: PointerEvent<HTMLDivElement>) {
  delete event.currentTarget.dataset.railActive
}

type WorkProject = {
  id: string
  title?: { ru: string; en: string }
  year?: string
  caseId?: string
  experienceId?: string
  status?: 'NDA' | 'Soon'
}

const workExperienceGroups: Array<{
  id: string
  experienceId: string
  logo: string
  role?: { ru: string; en: string }
  projects: WorkProject[]
}> = [
  {
    id: 'wmt',
    experienceId: 'wmt',
    logo: '/company-favicons/wmt-current.svg',
    role: {
      ru: 'Продуктовый дизайнер',
      en: 'Product designer',
    },
    projects: [
      {
        id: 'relevanter',
        title: {
          ru: 'Relevanter. AI-рекрутинг',
          en: 'Relevanter. AI recruiting',
        },
        year: '2025 —',
        status: 'NDA',
      },
      {
        id: 'neurokey',
        title: {
          ru: 'НейроКлюч. Корпоративный доступ к AI-моделям',
          en: 'NeuroKey. Enterprise access to AI models',
        },
        year: '2025 —',
        status: 'NDA',
      },
    ],
  },
  {
    id: 'uxart',
    experienceId: 'uxart',
    logo: '/company-favicons/uxart-current.svg',
    projects: [
      {
        id: 'ovork',
        caseId: 'ovork',
        experienceId: 'ovork',
        title: {
          ru: 'ОВорк. Кошелёк, выплаты и ФНС',
          en: 'OVork. Wallet, payouts, and tax requirements',
        },
      },
      {
        id: 'uxart-ai',
        caseId: 'uxart',
        title: {
          ru: 'UXART. AI-прототипы как стандарт студии',
          en: 'UXART. AI prototypes as a studio standard',
        },
        year: '2025',
      },
      {
        id: 'combogpt',
        experienceId: 'combogpt',
        title: {
          ru: 'ComboGPT. AI-агрегатор 0→1',
          en: 'ComboGPT. AI aggregator 0→1',
        },
        status: 'Soon',
      },
      {
        id: 'zinda-mobile',
        caseId: 'zinda-mobile',
        experienceId: 'zinda',
        year: '2024',
        title: {
          ru: 'Zinda. Мобильное приложение — самостоятельное направление',
          en: 'Zinda Mobile. An independently led direction',
        },
      },
      {
        id: 'zinda-system',
        caseId: 'zinda-system',
        experienceId: 'zinda',
        year: '2023 — 2024',
        title: {
          ru: 'Zinda. Дизайн-система банка',
          en: 'Zinda. The bank design system',
        },
      },
      {
        id: 'zinda',
        caseId: 'zinda',
        experienceId: 'zinda',
        year: '2023',
        title: {
          ru: 'Zinda. Как мы собирали банк',
          en: 'Zinda. How we built the bank',
        },
      },
    ],
  },
]

const experienceById = new Map(experience.map((item) => [item.id, item]))

function formatExperiencePeriod(
  experienceId: string,
  lang: 'ru' | 'en',
  includeDuration = true,
) {
  const item = experienceById.get(experienceId)
  if (!item) return ''

  const { start, end, ongoing, duration } = item.period
  const endLabel = ongoing ? (lang === 'ru' ? 'наст. время' : 'present') : end
  const years = endLabel
    ? start === endLabel
      ? start
      : `${start} — ${endLabel}`
    : start
  return includeDuration && duration ? `${years} · ${t(duration, lang)}` : years
}

export function PortfolioTabs({
  activeTab,
}: {
  activeTab: PortfolioContentTab
}) {
  return (
    <main className={styles.section} aria-label="Портфолио">
      <div
        id={`panel-${activeTab}`}
        className={styles.panel}
        role="tabpanel"
        aria-labelledby={`tab-${activeTab}`}
      >
        {activeTab === 'work' && <WorkList />}
        {activeTab === 'explorations' && <MediaGrid />}
        {activeTab === 'about' && <About />}
      </div>
    </main>
  )
}

function About() {
  const { lang } = useLang()
  const links = [
    { label: 'Telegram', href: profile.telegram, external: true },
    { label: 'Email', href: `mailto:${profile.email}`, external: false },
    { label: 'GitHub', href: profile.links.claudeSkills, external: true },
    { label: 'CV', href: CV_URL, external: false, download: 'Timothe_Ermolaev_Resume.pdf' },
  ]

  return (
    <div className={styles.about}>
      <div className={styles.aboutCopy}>
        {aboutCopy[lang].map((paragraph, index) => (
          <p
            key={paragraph}
            className={styles.revealBlock}
            style={revealStyle(index)}
          >
            {paragraph}
          </p>
        ))}
      </div>

      <div
        className={`${styles.connect} ${styles.revealBlock}`}
        style={revealStyle(aboutCopy[lang].length)}
      >
        <p className={styles.connectLabel}>Connect</p>
        <ul className={styles.connectList}>
          {links.map((link) => (
            <li key={link.label}>
              <a
                className={styles.connectLink}
                href={link.href}
                {...(link.external ? { target: '_blank', rel: 'noreferrer' } : {})}
                {...(link.download ? { download: link.download } : {})}
                onClick={() =>
                  trackEvent('contact_social_clicked', {
                    contact_target: link.label.toLowerCase(),
                  })
                }
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

function WorkList() {
  const { lang } = useLang()

  return (
    <div className={styles.workGroup}>
      <div className={styles.jobList}>
        {workExperienceGroups.map((job, jobIndex) => (
          <section key={job.id} className={styles.job}>
            <div
              className={`${styles.jobHeader} ${styles.revealBlock}`}
              style={revealStyle(jobIndex * 2)}
            >
              <div className={styles.jobCompany}>
                <img
                  className={styles.jobLogo}
                  src={job.logo}
                  alt=""
                  aria-hidden
                  data-brand={job.id}
                />
                <p>{experienceById.get(job.experienceId)?.company ?? job.id}</p>
              </div>
              <p className={styles.jobRole}>
                {job.role
                  ? t(job.role, lang)
                  : experienceById.get(job.experienceId)
                  ? t(experienceById.get(job.experienceId)!.category, lang)
                  : ''}
              </p>
              <p className={styles.jobPeriod}>
                {formatExperiencePeriod(job.experienceId, lang)}
              </p>
            </div>

            <div
              className={`${styles.jobProjects} ${styles.revealBlock}`}
              style={revealStyle(jobIndex * 2 + 1)}
              data-work-rail
              onPointerLeave={hideRailIndicator}
            >
              {job.projects.map((project) => {
                const study = project.caseId
                  ? cases.find((candidate) => candidate.id === project.caseId)
                  : undefined
                const title = project.title
                  ? t(project.title, lang)
                  : study
                    ? t(study.title, lang)
                    : project.id
                const year =
                  project.year ??
                  (project.experienceId
                    ? formatExperiencePeriod(project.experienceId, lang, false)
                    : study?.year)
                const unavailable = !study || Boolean(study.disabled)
                const chipLabel =
                  project.status === 'Soon'
                    ? 'Скоро'
                    : project.status === 'NDA' || study?.disabled
                      ? 'NDA'
                      : 'Открыть'
                const content = (
                  <>
                    <span className={styles.workTitleRow}>
                      <span className={styles.workTitle}>{title}</span>
                    </span>
                    {year && (
                      <span className={styles.workMeta}>{year}</span>
                    )}
                    <span className={styles.hoverChip} aria-hidden>
                      {chipLabel}
                    </span>
                  </>
                )

                if (unavailable) {
                  return (
                    <div
                      key={project.id}
                      className={styles.workItem}
                      data-disabled
                      data-work-item
                      onPointerEnter={positionHoverChip}
                      onPointerMove={positionHoverChip}
                      onPointerLeave={hideHoverChip}
                    >
                      {content}
                    </div>
                  )
                }

                return (
                  <a
                    key={project.id}
                    className={styles.workItem}
                    data-work-item
                    href={`#case/${study.id}`}
                    onPointerEnter={positionHoverChip}
                    onPointerMove={positionHoverChip}
                    onPointerLeave={hideHoverChip}
                    onClick={() =>
                      trackEvent('case_opened', {
                        case_id: study.id,
                        target: 'portfolio_work_tab',
                      })
                    }
                  >
                    {content}
                  </a>
                )
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
