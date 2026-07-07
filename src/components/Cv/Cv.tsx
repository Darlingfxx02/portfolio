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
  experience: { ru: 'Опыт', en: 'Experience' },
  present: { ru: 'наст. время', en: 'present' },
}

/**
 * CV page. The on-screen A4 sheet IS the deliverable: a print stylesheet
 * (index.css + this module's @media print) isolates `.cv-sheet` and prints it
 * across A4 pages, so "Скачать PDF" → window.print() → Save as PDF yields a
 * multi-page copy of the sheet.
 *
 * Layout: header → two-column intro (contacts/skills | summary) → a headline
 * metrics strip → full-width experience timeline with quantified bullets. The
 * full-width experience is what flows onto page 2 with clean entry breaks.
 * Monochrome by design — the site is strictly black/white.
 */
export function Cv() {
  const { lang } = useLang()
  const prevTitle = useRef('')

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
    document.title = `${cv.name} — CV`
    window.print()
  }

  return (
    <main className={styles.page}>
      <article className={`${styles.sheet} cv-sheet`}>
        <header className={styles.head}>
          <div className={styles.headText}>
            <h1 className={styles.name}>{cv.name}</h1>
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
          <aside className={styles.side}>
            <section className={styles.block}>
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

            <section className={styles.block}>
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
          </aside>

          <div className={styles.introMain}>
            <section className={styles.block}>
              <h2 className={styles.blockLabel}>{t(CV_LABELS.about, lang)}</h2>
              <p className={styles.summary}>{t(cv.summary, lang)}</p>
            </section>

            <section className={`${styles.block} ${styles.statsBlock}`}>
              <h2 className={styles.blockLabel}>{t(CV_LABELS.highlights, lang)}</h2>
              <div className={styles.stats}>
                {cv.highlights.map((h, i) => (
                  <div key={i} className={styles.stat}>
                    <p className={styles.statValue}>{t(h.value, lang)}</p>
                    <p className={styles.statLabel}>{t(h.label, lang)}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>

        <section className={`${styles.block} ${styles.expBlock}`}>
          <h2 className={styles.blockLabel}>{t(CV_LABELS.experience, lang)}</h2>
          <div className={styles.timeline}>
            {experience.map((item) => {
              const entry = cv.achievements[item.id]
              const bullets = entry ? t(entry, lang) : []
              return (
                <article key={item.id} className={styles.entry}>
                  <div className={styles.entryHead}>
                    <p className={styles.company}>{item.company}</p>
                    <p className={styles.period}>
                      {item.id === 'wmt'
                        ? `${item.year} — ${t(CV_LABELS.present, lang)}`
                        : item.year}
                    </p>
                  </div>
                  <p className={styles.role}>{t(item.category, lang)}</p>
                  <p className={styles.desc}>
                    {t(item.lead, lang)}
                    {t(item.text, lang)}
                  </p>
                  {bullets.length > 0 && (
                    <ul className={styles.bullets}>
                      {bullets.map((b) => (
                        <li key={b}>{b}</li>
                      ))}
                    </ul>
                  )}
                </article>
              )
            })}
          </div>
        </section>
      </article>
    </main>
  )
}
