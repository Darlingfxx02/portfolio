import { useCompanyConfig } from '@/lib/personalization'
import { t, useLang, type Loc } from '@/lib/i18n'
import styles from './Experience.module.css'

type FeaturedExperience = {
  id: string
  company: string
  role: Loc
  period: Loc
  logo: string
}

const featuredExperience: FeaturedExperience[] = [
  {
    id: 'wmt',
    company: 'WMT AI',
    role: { ru: 'Продуктовый дизайнер · AI', en: 'Product designer · AI' },
    period: { ru: '2025 — наст. время', en: '2025 — present' },
    logo: '/company-favicons/wmt-current.svg',
  },
  {
    id: 'uxart',
    company: 'UXART',
    role: { ru: 'UX/UI-дизайнер', en: 'UX/UI designer' },
    period: { ru: '2023 — 2025 · 1,5 года', en: '2023 — 2025 · 1.5 years' },
    logo: '/company-favicons/uxart-current.svg',
  },
]

export function Experience() {
  const { lang } = useLang()
  const { experienceHighlights } = useCompanyConfig()
  const highlights = experienceHighlights ?? []
  const hasHighlights = highlights.length > 0

  return (
    <section className={styles.section}>
      <p className={styles.label}>
        {lang === 'ru' ? 'Опыт работы' : 'Work experience'}
      </p>
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
                  className={`${styles.logo} ${styles.logoFullBleed}`}
                  src={item.logo}
                  alt=""
                  aria-hidden
                />
                <p className={styles.company}>{item.company}</p>
              </div>
              <p className={styles.role}>{t(item.role, lang)}</p>
              <p className={styles.period}>{t(item.period, lang)}</p>
            </article>
          )
        })}
      </div>
    </section>
  )
}
