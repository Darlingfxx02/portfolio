import type { CaseStudy } from '@/data/cases'
import styles from './CaseItem.module.css'

export function CaseItem({ study }: { study: CaseStudy }) {
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
        <span className={styles.title}>{study.title}</span>
        <span className={styles.tag}>{study.category}</span>
      </span>
      <span className={styles.year}>{study.year}</span>
    </article>
  )
}
