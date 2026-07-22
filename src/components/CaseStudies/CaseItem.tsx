import type { CaseStudy } from '@/data/cases'
import { useLang, t } from '@/lib/i18n'
import { trackEvent } from '@/lib/analytics'
import styles from './CaseItem.module.css'

export function CaseItem({ study }: { study: CaseStudy }) {
  const { lang } = useLang()
  const title = t(study.title, lang)
  const category = t(study.category, lang)
  const outcome = study.outcome ? t(study.outcome, lang) : ''
  const isDisabled = Boolean(study.disabled)
  const tags = category
    .split('·')
    .map((tag) => tag.trim())
    .filter(Boolean)
  const open = () => {
    if (isDisabled) return
    trackEvent('case_opened', { case_id: study.id })
    window.location.hash = `#case/${study.id}`
  }
  return (
    <article
      className={styles.row}
      data-disabled={isDisabled || undefined}
      data-sfx={isDisabled ? undefined : true}
      role={isDisabled ? undefined : 'link'}
      tabIndex={isDisabled ? undefined : 0}
      aria-disabled={isDisabled || undefined}
      aria-label={isDisabled ? `${title}, NDA` : `${title} — ${outcome || category}`}
      onClick={isDisabled ? undefined : open}
      onKeyDown={(e) => {
        if (isDisabled) return
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          open()
        }
      }}
    >
      <span className={styles.meta}>
        <span className={styles.titleSlot}>
          <span className={styles.title}>{title}</span>
        </span>
        <span className={styles.year}>{study.year}</span>
      </span>
      <span className={styles.tags} aria-label={category}>
        {tags.map((tag) => (
          <span key={tag} className={styles.tag}>
            {tag}
          </span>
        ))}
      </span>
      <span className={styles.cover} aria-hidden>
        {study.image && (
          <img
            className={styles.coverImage}
            src={study.image}
            alt=""
            width={1024}
            height={600}
            loading="lazy"
            draggable={false}
          />
        )}
      </span>
    </article>
  )
}
