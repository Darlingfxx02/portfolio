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
    'Я занимаюсь дизайном с 16 лет. Начинал с 3D и геймдева: моделировал, собирал сцены и постепенно пришёл к интерфейсам и продуктам.',
    'Интерес к AI появился у меня ещё в начале нынешнего бума — вместе с первыми моделями для генерации изображений. Сначала много экспериментировал с визуалом, а затем начал применять модели в прототипах и продуктовых сценариях.',
    'Сейчас активно работаю с кодовыми моделями: собираю с ними интерфейсы, автоматизирую рутину и быстрее проверяю идеи. Мне интересно находить задачи, где AI не просто выглядит эффектно, а действительно усиливает дизайнера и помогает довести продукт до работающего состояния.',
  ],
  en: [
    'I have been designing since I was 16. I started with 3D and game development—modeling, building scenes, and gradually finding my way into interfaces and products.',
    'I have been exploring AI since the very beginning of its current wave, back when the first image-generation models appeared. I started with visual experiments, then began applying models to prototypes and product workflows.',
    'Today I work extensively with coding models to build interfaces, automate routine work, and test ideas faster. I am interested in finding areas where AI does more than create an impressive demo—where it genuinely augments designers and helps turn an idea into a working product.',
  ],
}

const CV_URL = '/cv/Timothe_Ermolaev_Resume.pdf?v=20260830-1'

const aboutPhotos = [
  {
    src: '/stickers/self-portrait.webp',
    alt: { ru: 'Тимофей в зеркале', en: 'Timothe in a mirror' },
  },
  {
    src: '/about/hobby1.webp',
    alt: { ru: 'Сноуборды на подъёмнике', en: 'Snowboards on a ski lift' },
  },
  {
    src: '/stickers/device-stack.webp',
    alt: { ru: 'Ноутбук и телефон', en: 'Laptop and phone' },
  },
  {
    src: '/about/hobby2.webp',
    alt: { ru: 'Стол для пинг-понга', en: 'Table tennis table' },
  },
  {
    src: '/stickers/friends-selfie.webp',
    alt: { ru: 'Тимофей с другом', en: 'Timothe with a friend' },
  },
]

function revealStyle(index: number) {
  return { '--reveal-index': index } as CSSProperties
}

function PhotoTrack({ decorative = false }: { decorative?: boolean }) {
  const { lang } = useLang()

  return (
    <div className={styles.photoTrack} aria-hidden={decorative || undefined}>
      {[0, 1, 2, 3, 4].map((copy) => (
        <div
          key={copy}
          className={styles.photoGroup}
          aria-hidden={decorative || copy > 0 || undefined}
        >
          {aboutPhotos.map((photo) => (
            <figure key={photo.src} className={styles.photoCard}>
              <img
                src={photo.src}
                alt={!decorative && copy === 0 ? t(photo.alt, lang) : ''}
                draggable={false}
              />
            </figure>
          ))}
        </div>
      ))}
    </div>
  )
}

function AboutPhotoCarousel() {
  const { lang } = useLang()

  return (
    <section
      className={styles.photoCarousel}
      aria-label={lang === 'ru' ? 'Фотографии' : 'Photos'}
    >
      <div className={styles.photoStage}>
        <div className={styles.photoGlowRail} aria-hidden>
          <PhotoTrack decorative />
        </div>
        <div className={styles.photoSharpRail}>
          <PhotoTrack />
        </div>
        <div className={styles.photoBlurRail} aria-hidden>
          <PhotoTrack decorative />
        </div>
      </div>
    </section>
  )
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
    logo: '/company-favicons/wmt-current.svg?v=20260726-2',
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
    logo: '/company-favicons/uxart-current.svg?v=20260726-3',
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
        year: '2023 — 2024',
        title: {
          ru: 'Zinda. Новый B2B-банк для бизнеса',
          en: 'Zinda. A new B2B bank for business',
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
  const { lang } = useLang()

  return (
    <main
      className={styles.section}
      aria-label={lang === 'ru' ? 'Портфолио' : 'Portfolio'}
    >
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
    <>
      <div className={styles.about}>
        <AboutPhotoCarousel />

        <div
          className={`${styles.connect} ${styles.revealBlock}`}
          style={revealStyle(1)}
        >
          <p className={styles.connectLabel}>
            {lang === 'ru' ? 'Связаться' : 'Connect'}
          </p>
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

        <div className={styles.aboutCopy}>
          {aboutCopy[lang].map((paragraph, index) => (
            <p
              key={paragraph}
              className={styles.revealBlock}
              style={revealStyle(index + 2)}
            >
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </>
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
                    ? lang === 'ru'
                      ? 'Скоро'
                      : 'Soon'
                    : project.status === 'NDA' || study?.disabled
                      ? 'NDA'
                      : lang === 'ru'
                        ? 'Открыть'
                        : 'Open'
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
