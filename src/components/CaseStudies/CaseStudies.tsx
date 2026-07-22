import { CaseItem } from './CaseItem'
import { orderedCases, useCompanyConfig } from '@/lib/personalization'
import styles from './CaseStudies.module.css'

export function CaseStudies() {
  const { caseIds } = useCompanyConfig()
  const items = orderedCases(caseIds)

  return (
    <section id="cases" className={styles.section}>
      <p className={styles.label}>Case studies</p>
      <span className={styles.accent} />
      <div className={styles.list}>
        {items.map((c) => (
          <CaseItem key={c.id} study={c} />
        ))}
      </div>
    </section>
  )
}
