import { useEffect, useRef } from 'react'
import {
  DownloadSimple,
  EnvelopeSimple,
  TelegramLogo,
  GithubLogo,
  LinkSimple,
  type Icon as PhIcon,
} from '@phosphor-icons/react'
import { cv } from '@/data/cv'
import { experience } from '@/data/experience'
import { useLang, t } from '@/lib/i18n'
import styles from './Cv.module.css'

const CONTACT_ICONS: Record<string, PhIcon> = {
  Email: EnvelopeSimple,
  Telegram: TelegramLogo,
  GitHub: GithubLogo,
}

const CV_LABELS = {
  download: { ru: 'Скачать PDF', en: 'Download PDF' },
  contacts: { ru: 'Контакты', en: 'Contacts' },
  skills: { ru: 'Навыки', en: 'Skills' },
  about: { ru: 'О себе', en: 'About' },
  highlights: { ru: 'Ключевые результаты', en: 'Key results' },
  experience: { ru: 'Опыт работы и контракты', en: 'Employment and contracts' },
  projects: { ru: 'Ключевые проекты', en: 'Selected projects' },
  workPeriod: { ru: 'Период работы', en: 'Employment period' },
  projectPeriod: { ru: 'Период проекта', en: 'Project period' },
  duration: { ru: 'Продолжительность', en: 'Duration' },
  present: { ru: 'настоящее время', en: 'present' },
}

const cvText = (value: string) => value.replace(/[‐‑‒–—−]/g, '-')

/**
 * CV page. The on-screen A4 sheet IS the deliverable: a print stylesheet
 * (index.css + this module's @media print) isolates `.cv-sheet` and prints it
 * across A4 pages, so "Скачать PDF" → window.print() → Save as PDF yields a
 * multi-page copy of the sheet.
 *
 * Layout: header → contacts/summary intro → full-width skills → results
 * strip → linear employment entries → selected projects. The PDF keeps
 * company, role, period, duration, and results in ATS-friendly reading order.
 * Monochrome by design — the site is strictly black/white.
 */
export function Cv() {
  const { lang } = useLang()
  const prevTitle = useRef('')
  const employment = experience.filter((item) => item.kind === 'employment')
  const projects = experience.filter((item) => item.kind === 'project')

  // Suggest a tidy filename in the browser's Save-as-PDF dialog by swapping
  // the document title for the duration of the print, then restoring it.
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

  const renderEntries = (
    items: typeof experience,
    periodLabel: { ru: string; en: string },
  ) => (
    <div className={styles.entries}>
      {items.map((item) => {
        const entry = cv.achievements[item.id]
        const bullets = entry ? t(entry, lang) : []
        return (
          <article key={item.id} className={styles.entry}>
            <div className={styles.entryHead}>
              <h3 className={styles.company}>{item.company}</h3>
              <p className={styles.role}>{t(item.category, lang)}</p>
            </div>

            <dl className={styles.meta}>
              <div className={styles.metaRow}>
                <dt>{t(periodLabel, lang)}:</dt>
                <dd>
                  <time dateTime={item.period.start}>{item.period.start}</time>
                  {item.period.ongoing ? (
                    <> - {t(CV_LABELS.present, lang)}</>
                  ) : item.period.end && item.period.end !== item.period.start ? (
                    <>
                      {' - '}
                      <time dateTime={item.period.end}>{item.period.end}</time>
                    </>
                  ) : null}
                </dd>
              </div>
              {item.period.duration && (
                <div className={styles.metaRow}>
                  <dt>{t(CV_LABELS.duration, lang)}:</dt>
                  <dd>{t(item.period.duration, lang)}</dd>
                </div>
              )}
            </dl>

            {bullets.length > 0 && (
              <ul className={styles.bullets}>
                {bullets.map((bullet) => (
                  <li key={bullet}>{cvText(bullet)}</li>
                ))}
              </ul>
            )}
          </article>
        )
      })}
    </div>
  )

  return (
    <main className={styles.page}>
      <article className={`${styles.sheet} cv-sheet`}>
        <header className={styles.head}>
          <div className={styles.headText}>
            <h1 className={styles.name}>{t(cv.name, lang)}</h1>
            <p className={styles.title}>
              {t(cv.title, lang)} · {t(cv.focus, lang)}
            </p>
          </div>
          <button type="button" className={styles.download} onClick={onDownload}>
            <DownloadSimple size={17} weight="bold" />
            {t(CV_LABELS.download, lang)}
          </button>
        </header>

        <div className={styles.intro}>
          <section className={`${styles.block} ${styles.contactsBlock}`}>
            <h2 className={styles.blockLabel}>{t(CV_LABELS.contacts, lang)}</h2>
            <ul className={styles.contacts}>
              {cv.contacts.map((c) => {
                const Icon = CONTACT_ICONS[c.label] ?? LinkSimple
                return (
                  <li key={c.label}>
                    <Icon size={15} weight="fill" className={styles.contactIcon} />
                    <a href={c.href} target="_blank" rel="noreferrer">
                      {c.value}
                    </a>
                  </li>
                )
              })}
            </ul>
          </section>

          <section className={`${styles.block} ${styles.aboutBlock}`}>
            <h2 className={styles.blockLabel}>{t(CV_LABELS.about, lang)}</h2>
            <p className={styles.summary}>{t(cv.summary, lang)}</p>
          </section>
        </div>

        <section className={`${styles.block} ${styles.skillsBlock}`}>
          <h2 className={styles.blockLabel}>{t(CV_LABELS.skills, lang)}</h2>
          <div className={styles.skillGroups}>
            {cv.skills.map((s, i) => (
              <div key={i} className={styles.skillGroup}>
                <p className={styles.skillGroupLabel}>{t(s.group, lang)}</p>
                <div className={styles.chips}>
                  {t(s.items, lang).map((item) => (
                    <span key={item} className={styles.chip}>
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className={`${styles.block} ${styles.statsBlock}`}>
          <h2 className={styles.blockLabel}>{t(CV_LABELS.highlights, lang)}</h2>
          <div className={styles.stats}>
            {cv.highlights.map((h, i) => (
              <div key={i} className={styles.stat}>
                <p className={styles.statValue}>{cvText(t(h.value, lang))}</p>
                <p className={styles.statLabel}>{t(h.label, lang)}</p>
              </div>
            ))}
          </div>
        </section>

        <section className={`${styles.block} ${styles.expBlock}`}>
          <h2 className={styles.blockLabel}>{t(CV_LABELS.experience, lang)}</h2>
          {renderEntries(employment, CV_LABELS.workPeriod)}
        </section>

        <section className={`${styles.block} ${styles.projectsBlock}`}>
          <h2 className={styles.blockLabel}>{t(CV_LABELS.projects, lang)}</h2>
          {renderEntries(projects, CV_LABELS.projectPeriod)}
        </section>
      </article>
    </main>
  )
}
