import type { CaseStudy } from '@/data/cases'
import { useLang, t } from '@/lib/i18n'
import styles from './CaseItem.module.css'

export function CaseItem({ study }: { study: CaseStudy }) {
  const { lang } = useLang()
  const open = () => {
    window.location.hash = `#case/${study.id}`
  }
  return (
    <article
      className={styles.row}
      data-sfx
      role="link"
      tabIndex={0}
      onClick={open}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          open()
        }
      }}
    >
      <span className={styles.name}>
        <span className={styles.title}>{t(study.title, lang)}</span>
        <span className={styles.tag}>{t(study.category, lang)}</span>
      </span>
      <span className={styles.year}>{study.year}</span>
    </article>
  )
}
