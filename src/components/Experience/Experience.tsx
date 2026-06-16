import { experienceHeading, experience } from '@/data/experience'
import styles from './Experience.module.css'

export function Experience() {
  return (
    <section id="experience" className={styles.section}>
      <p className={styles.label}>{experienceHeading.title}</p>
      <span className={styles.accent} />
      <div className={styles.list}>
        {experience.map((item) => (
          <article key={item.id} className={styles.row}>
            <div className={styles.who}>
              <p className={styles.company}>{item.company}</p>
              <p className={styles.role}>{item.category}</p>
            </div>
            <p className={styles.period}>{item.year}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
