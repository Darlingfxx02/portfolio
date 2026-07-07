import { experienceHeading, experience } from '@/data/experience'
import { useCompanyConfig } from '@/lib/personalization'
import { useLang, t } from '@/lib/i18n'
import styles from './Experience.module.css'

export function Experience() {
  const { lang } = useLang()
  const { experienceHighlights } = useCompanyConfig()
  const highlights = experienceHighlights ?? []
  const hasHighlights = highlights.length > 0

  return (
    <section id="experience" className={styles.section}>
      <p className={styles.label}>{experienceHeading.title}</p>
      <span className={styles.accent} />
      <div className={styles.list}>
        {experience.map((item) => {
          // С активными хайлайтами нерелевантный опыт приглушаем.
          const dimmed = hasHighlights && !highlights.includes(item.id)
          return (
            <article
              key={item.id}
              className={`${styles.row} ${dimmed ? styles.dim : ''}`}
            >
              <div className={styles.who}>
                <p className={styles.company}>{item.company}</p>
                <p className={styles.role}>{t(item.category, lang)}</p>
              </div>
              <p className={styles.period}>{item.year}</p>
            </article>
          )
        })}
      </div>
    </section>
  )
}
