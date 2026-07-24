import type { PointerEvent } from 'react'
import { cases } from '@/data/cases'
import { experience } from '@/data/experience'
import { trackEvent } from '@/lib/analytics'
import { useLang, t } from '@/lib/i18n'
import styles from './SelectedWork.module.css'

type WorkProject = {
  id: string
  title: { ru: string; en: string }
  year?: string
  caseId?: string
  experienceId?: string
  status?: 'NDA' | 'Soon'
}

const jobs: Array<{
  id: string
  experienceId: string
  logo: string
  role?: { ru: string; en: string }
  projects: WorkProject[]
}> = [
  {
    id: 'wmt',
    experienceId: 'wmt',
    logo: '/company-favicons/wmt.svg',
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
    logo: '/company-favicons/uxart.ico',
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
        id: 'zinda',
        caseId: 'zinda',
        experienceId: 'zinda',
        title: {
          ru: 'Zinda. B2B-банк для бизнеса',
          en: 'Zinda. B2B bank for businesses',
        },
      },
    ],
  },
]

const experienceById = new Map(experience.map((item) => [item.id, item]))

function formatPeriod(
  experienceId: string,
  lang: 'ru' | 'en',
  includeDuration = true,
) {
  const item = experienceById.get(experienceId)
  if (!item) return ''

  const { start, end, ongoing, duration } = item.period
  const endLabel = ongoing
    ? lang === 'ru'
      ? 'наст. время'
      : 'present'
    : end
  const years = endLabel
    ? start === endLabel
      ? start
      : `${start} — ${endLabel}`
    : start

  return includeDuration && duration ? `${years} · ${t(duration, lang)}` : years
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

export function SelectedWork() {
  const { lang } = useLang()

  return (
    <main id="works" className={styles.page}>
      <div className={styles.jobList}>
        {jobs.map((job) => {
          const employment = experienceById.get(job.experienceId)

          return (
            <section key={job.id} className={styles.job}>
              <div className={styles.jobHeader}>
                <div className={styles.jobCompany}>
                  <img
                    className={styles.jobLogo}
                    src={job.logo}
                    alt=""
                    aria-hidden
                  />
                  <p>{employment?.company ?? job.id}</p>
                </div>
                <p className={styles.jobRole}>
                  {job.role
                    ? t(job.role, lang)
                    : employment
                      ? t(employment.category, lang)
                      : ''}
                </p>
                <p className={styles.jobPeriod}>
                  {formatPeriod(job.experienceId, lang)}
                </p>
              </div>

              <div
                className={styles.jobProjects}
                data-work-rail
                onPointerLeave={hideRailIndicator}
              >
                {job.projects.map((project) => {
                  const study = project.caseId
                    ? cases.find((candidate) => candidate.id === project.caseId)
                    : undefined
                  const year = project.experienceId
                    ? formatPeriod(project.experienceId, lang, false)
                    : project.year ?? study?.year
                  const unavailable = !study || Boolean(study.disabled)
                  const chipLabel =
                    project.status ?? (study?.disabled ? 'NDA' : 'Open')
                  const content = (
                    <>
                      <span className={styles.workTitle}>
                        {t(project.title, lang)}
                      </span>
                      {year && <span className={styles.workMeta}>{year}</span>}
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
                      href={`#case/${study.id}`}
                      onPointerEnter={positionHoverChip}
                      onPointerMove={positionHoverChip}
                      onPointerLeave={hideHoverChip}
                      onClick={() =>
                        trackEvent('case_opened', {
                          case_id: study.id,
                          target: 'work_history',
                        })
                      }
                    >
                      {content}
                    </a>
                  )
                })}
              </div>
            </section>
          )
        })}
      </div>
    </main>
  )
}
