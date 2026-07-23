import { useEffect, useRef } from 'react'
import {
  ArrowUpRight,
  Briefcase,
  DownloadSimple,
  MapPin,
} from '@phosphor-icons/react'
import { cv } from '@/data/cv'
import { experience, type ExperienceItem } from '@/data/experience'
import { useLang, t } from '@/lib/i18n'
import styles from './Cv.module.css'

const COMPANY_LOGOS: Record<string, string> = {
  wmt: '/company-favicons/wmt.svg',
  uxart: '/company-favicons/uxart.ico',
  zinda: '/company-favicons/zinda.svg',
}

const CV_LABELS = {
  download: { ru: 'Скачать PDF', en: 'Download PDF' },
  contacts: { ru: 'Контакты', en: 'Contacts' },
  projects: { ru: 'Клиентские проекты в UXART', en: 'Client projects at UXART' },
  skills: { ru: 'Навыки', en: 'Skills' },
  present: { ru: 'Настоящее время', en: 'Present' },
}

const cvText = (value: string) => value.replace(/[‐‑‒–—−]/g, '-')

const entryTags = (category: string) =>
  category
    .split(/[·,]/)
    .map((item) => item.trim())
    .filter(Boolean)

export function Cv() {
  const { lang } = useLang()
  const prevTitle = useRef('')
  const employment = experience.filter(
    (item) => item.kind === 'employment' && !item.parentId,
  )
  const studioProjects = ['combogpt', 'ovork', 'zinda']
    .map((id) => experience.find((item) => item.id === id))
    .filter((item): item is ExperienceItem => Boolean(item))

  useEffect(() => {
    const onAfter = () => {
      if (prevTitle.current) document.title = prevTitle.current
    }
    window.addEventListener('afterprint', onAfter)
    return () => window.removeEventListener('afterprint', onAfter)
  }, [])

  const onDownload = () => {
    prevTitle.current = document.title
    document.title = cv.filename
    window.print()
  }

  const renderPeriod = (item: ExperienceItem) => (
    <p className={styles.period}>
      <Briefcase size={14} weight="regular" aria-hidden="true" />
      <time dateTime={item.period.start}>{item.period.start}</time>
      {' - '}
      {item.period.ongoing ? (
        t(CV_LABELS.present, lang)
      ) : (
        <time dateTime={item.period.end}>{item.period.end}</time>
      )}
      {item.period.duration && <span> · {t(item.period.duration, lang)}</span>}
    </p>
  )

  const renderStudioProjects = () => (
    <section className={styles.studioProjects}>
      <h4 className={styles.studioProjectsTitle}>
        {t(CV_LABELS.projects, lang)}
      </h4>

      <div className={styles.projectList}>
        {studioProjects.map((item) => {
          const bullets = cv.achievements[item.id]
            ? t(cv.achievements[item.id], lang)
            : []
          const tags = entryTags(t(item.category, lang))
          const logo = COMPANY_LOGOS[item.id]

          return (
            <article key={item.id} className={styles.project}>
              <header className={styles.projectHead}>
                <div>
                  <h5 className={styles.projectName}>{item.company}</h5>
                  <p className={styles.projectRole}>{t(item.category, lang)}</p>
                </div>
                {logo && (
                  <img
                    className={styles.projectLogo}
                    src={logo}
                    alt=""
                    aria-hidden="true"
                  />
                )}
              </header>

              <div className={styles.projectTags}>
                {tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>

              <p className={styles.projectSummary}>
                <strong>{t(item.lead, lang)}</strong>
                {t(item.text, lang)}
              </p>

              {bullets.length > 0 && (
                <ul className={styles.projectResults}>
                  {bullets.map((bullet) => (
                    <li key={bullet}>{cvText(bullet)}</li>
                  ))}
                </ul>
              )}
            </article>
          )
        })}
      </div>
    </section>
  )

  const renderEmployment = (item: ExperienceItem) => {
    const bullets = cv.achievements[item.id]
      ? t(cv.achievements[item.id], lang)
      : []
    const tags = entryTags(t(item.category, lang))
    const logo = COMPANY_LOGOS[item.id]

    return (
      <article key={item.id} className={styles.job}>
        <header className={styles.jobHead}>
          <div>
            <h3 className={styles.company}>{item.company}</h3>
            <p className={styles.role}>{t(item.category, lang)}</p>
            {renderPeriod(item)}
          </div>
          {logo && (
            <img
              className={styles.companyLogo}
              src={logo}
              alt=""
              aria-hidden="true"
            />
          )}
        </header>

        <div className={styles.tags}>
          {tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>

        <div className={styles.jobBody}>
          <p>
            <strong>{t(item.lead, lang)}</strong>
            {t(item.text, lang)}
          </p>
        </div>

        {bullets.length > 0 && (
          <div className={styles.jobBody}>
            <h4>{lang === 'ru' ? 'Ключевые результаты:' : 'Key results:'}</h4>
            <ul className={styles.bullets}>
              {bullets.map((bullet) => (
                <li key={bullet}>{cvText(bullet)}</li>
              ))}
            </ul>
          </div>
        )}

        {item.id === 'uxart' && renderStudioProjects()}
      </article>
    )
  }

  return (
    <main className={styles.page}>
      <div className={styles.toolbar}>
        <button type="button" className={styles.download} onClick={onDownload}>
          <DownloadSimple size={17} weight="bold" />
          {t(CV_LABELS.download, lang)}
        </button>
      </div>

      <article className={`${styles.sheet} cv-sheet`}>
        <div className={styles.documentGrid}>
          <div className={styles.mainColumn}>
            <header className={styles.identity}>
              <h1 className={styles.name}>{t(cv.name, lang)}</h1>
              <p className={styles.position}>
                <MapPin size={18} weight="fill" aria-hidden="true" />
                {t(cv.title, lang)} · {t(cv.focus, lang)}
              </p>
            </header>

            <section className={styles.summaryCard}>
              <p>{t(cv.summary, lang)}</p>
              <a href="https://darling.design/#works">
                {lang === 'ru' ? 'Портфолио' : 'Portfolio'}: darling.design
                <ArrowUpRight size={14} weight="bold" aria-hidden="true" />
              </a>
            </section>

            <div className={styles.jobs}>{employment.map(renderEmployment)}</div>

            <section className={styles.skillsSection}>
              <h2>{t(CV_LABELS.skills, lang)}</h2>
              <div className={styles.skillGroups}>
                {cv.skills.map((skill) => (
                  <div key={t(skill.group, lang)} className={styles.skillGroup}>
                    <h3>{t(skill.group, lang)}</h3>
                    <ul>
                      {t(skill.items, lang).map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <aside className={styles.sidebar}>
            <img
              className={styles.portrait}
              src="/stickers/self-portrait.webp"
              alt={t(cv.name, lang)}
            />

            <section className={styles.sideSection}>
              <h2>{t(CV_LABELS.contacts, lang)}</h2>
              <ul className={styles.contacts}>
                {cv.contacts.map((contact) => (
                  <li key={contact.label}>
                    <span>{contact.label}</span>
                    <a href={contact.href} target="_blank" rel="noreferrer">
                      {contact.value}
                    </a>
                  </li>
                ))}
              </ul>
            </section>

          </aside>
        </div>
      </article>
    </main>
  )
}
