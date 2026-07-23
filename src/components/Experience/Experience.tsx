import { useCompanyConfig } from '@/lib/personalization'
import styles from './Experience.module.css'

type FeaturedExperience = {
  id: string
  company: string
  role: string
  period: string
  logo: string
}

const featuredExperience: FeaturedExperience[] = [
  {
    id: 'wmt',
    company: 'WMT AI',
    role: 'Продуктовый дизайнер · AI',
    period: '2025 — наст. время',
    logo: '/company-favicons/wmt.svg',
  },
  {
    id: 'uxart',
    company: 'UXART',
    role: 'UX/UI-дизайнер',
    period: '2023 — 2025 · 1,5 года',
    logo: '/company-favicons/uxart.ico',
  },
]

export function Experience() {
  const { experienceHighlights } = useCompanyConfig()
  const highlights = experienceHighlights ?? []
  const hasHighlights = highlights.length > 0

  return (
    <section id="experience" className={styles.section}>
      <p className={styles.label}>Work experience</p>
      <span className={styles.accent} />
      <div className={styles.list}>
        {featuredExperience.map((item) => {
          const dimmed = hasHighlights && !highlights.includes(item.id)
          return (
            <article
              key={item.id}
              className={`${styles.row} ${dimmed ? styles.dim : ''}`}
            >
              <div className={styles.companyCell}>
                <img
                  className={styles.logo}
                  src={item.logo}
                  alt=""
                  aria-hidden
                />
                <p className={styles.company}>{item.company}</p>
              </div>
              <p className={styles.role}>{item.role}</p>
              <p className={styles.period}>{item.period}</p>
            </article>
          )
        })}
      </div>
    </section>
  )
}
