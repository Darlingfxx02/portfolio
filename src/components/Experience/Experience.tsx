import { useCompanyConfig } from '@/lib/personalization'
import styles from './Experience.module.css'

type FeaturedExperience = {
  id: string
  company: string
  role: string
  period: string
}

const featuredExperience: FeaturedExperience[] = [
  {
    id: 'wmt',
    company: 'WMT Group',
    role: 'Founding Продуктовый дизайнер',
    period: '2024-2026',
  },
  {
    id: 'uxart',
    company: 'UXART',
    role: 'Senior Продуктовый дизайнер',
    period: '2025',
  },
  {
    id: 'zinda',
    company: 'Zinda Bank',
    role: 'Founding Продуктовый дизайнер',
    period: '2023-2024',
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
                  src="/stickers/codex-icon.webp"
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
