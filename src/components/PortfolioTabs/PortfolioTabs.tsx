import { useRef, type KeyboardEvent, type PointerEvent } from 'react'
import { cases } from '@/data/cases'
import { useLang, t } from '@/lib/i18n'
import { trackEvent } from '@/lib/analytics'
import { profile } from '@/data/profile'
import { MediaGrid } from '@/components/MediaGrid/MediaGrid'
import styles from './PortfolioTabs.module.css'

export type PortfolioTab = 'work' | 'explorations' | 'about'

const tabs: { id: PortfolioTab; label: string }[] = [
  { id: 'work', label: 'Work' },
  { id: 'explorations', label: 'Explorations' },
  { id: 'about', label: 'About' },
]

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

const CV_URL = '/cv/Timothe_Ermolaev_Resume.pdf?v=07a07a0d'

function positionHoverChip(event: PointerEvent<HTMLElement>) {
  const item = event.currentTarget
  const rect = item.getBoundingClientRect()
  item.style.setProperty('--chip-x', `${event.clientX - rect.left}px`)
  item.style.setProperty('--chip-y', `${event.clientY - rect.top}px`)
  item.dataset.chipVisible = 'true'
}

function hideHoverChip(event: PointerEvent<HTMLElement>) {
  delete event.currentTarget.dataset.chipVisible
}

type WorkProject = {
  id: string
  title?: { ru: string; en: string }
  year?: string
  caseId?: string
}

const workExperienceGroups: Array<{
  id: string
  company: string
  role: { ru: string; en: string }
  period: { ru: string; en: string }
  logo: string
  projects: WorkProject[]
}> = [
  {
    id: 'wmt',
    company: 'WMT AI',
    role: { ru: 'Продуктовый дизайнер · AI', en: 'Product designer · AI' },
    period: { ru: '2025 — наст. время', en: '2025 — present' },
    logo: '/company-favicons/wmt.svg',
    projects: [
      {
        id: 'neurokey',
        title: {
          ru: 'НейроКлюч. Корпоративная AI-платформа',
          en: 'NeuroKey. Enterprise AI platform',
        },
        year: '2025 —',
      },
      {
        id: 'relevanter',
        title: {
          ru: 'Relevanter. AI-рекрутинг',
          en: 'Relevanter. AI recruiting',
        },
        year: '2025 —',
      },
    ],
  },
  {
    id: 'uxart',
    company: 'UXART',
    role: { ru: 'UX/UI-дизайнер', en: 'UX/UI designer' },
    period: { ru: '2023 — 2025 · 1,5 года', en: '2023 — 2025 · 1.5 years' },
    logo: '/company-favicons/uxart.ico',
    projects: [
      { id: 'ovork', caseId: 'ovork' },
      { id: 'zinda', caseId: 'zinda' },
      { id: 'uxart-ai', caseId: 'uxart' },
      { id: 'rcon', caseId: 'rcon' },
    ],
  },
]

export function PortfolioTabs({
  activeTab,
  onTabChange,
}: {
  activeTab: PortfolioTab
  onTabChange: (tab: PortfolioTab) => void
}) {
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([])

  const onTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return
    event.preventDefault()

    let nextIndex = index
    if (event.key === 'ArrowLeft') nextIndex = (index - 1 + tabs.length) % tabs.length
    if (event.key === 'ArrowRight') nextIndex = (index + 1) % tabs.length
    if (event.key === 'Home') nextIndex = 0
    if (event.key === 'End') nextIndex = tabs.length - 1

    const nextTab = tabs[nextIndex]
    onTabChange(nextTab.id)
    window.requestAnimationFrame(() => tabRefs.current[nextIndex]?.focus())
  }

  return (
    <section className={styles.section} aria-label="Portfolio">
      <div className={styles.navWrap}>
        <div className={styles.nav} role="tablist" aria-label="Portfolio sections">
          {tabs.map((tab, index) => {
            const selected = activeTab === tab.id
            return (
              <button
                key={tab.id}
                ref={(node) => {
                  tabRefs.current[index] = node
                }}
                className={styles.tab}
                type="button"
                role="tab"
                id={`tab-${tab.id}`}
                aria-controls={`panel-${tab.id}`}
                aria-selected={selected}
                tabIndex={selected ? 0 : -1}
                data-active={selected || undefined}
                onClick={() => onTabChange(tab.id)}
                onKeyDown={(event) => onTabKeyDown(event, index)}
              >
                {tab.label}
              </button>
            )
          })}
        </div>
      </div>

      <div
        key={activeTab}
        id={`panel-${activeTab}`}
        className={styles.panel}
        role="tabpanel"
        aria-labelledby={`tab-${activeTab}`}
        tabIndex={0}
      >
        {activeTab === 'work' && <WorkList />}
        {activeTab === 'explorations' && <MediaGrid />}
        {activeTab === 'about' && <About />}
      </div>
    </section>
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
        {aboutCopy[lang].map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>

      <div className={styles.connect}>
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
        {workExperienceGroups.map((job) => (
          <section key={job.id} className={styles.job}>
            <div className={styles.jobHeader}>
              <div className={styles.jobCompany}>
                <img className={styles.jobLogo} src={job.logo} alt="" aria-hidden />
                <p>{job.company}</p>
              </div>
              <p className={styles.jobRole}>{t(job.role, lang)}</p>
              <p className={styles.jobPeriod}>{t(job.period, lang)}</p>
            </div>

            <div className={styles.jobProjects}>
              {job.projects.map((project) => {
                const study = project.caseId
                  ? cases.find((candidate) => candidate.id === project.caseId)
                  : undefined
                const title = study
                  ? t(study.title, lang)
                  : project.title
                    ? t(project.title, lang)
                    : project.id
                const year = study?.year ?? project.year
                const underNda = !study || Boolean(study.disabled)
                const content = (
                  <>
                    <span className={styles.workTitleRow}>
                      <span className={styles.workTitle}>{title}</span>
                    </span>
                    {year && (
                      <span className={styles.workMeta}>{year}</span>
                    )}
                    <span className={styles.hoverChip} aria-hidden>
                      {underNda ? 'NDA' : 'Open'}
                    </span>
                  </>
                )

                if (!study || study.disabled) {
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
