import { ArrowUUpLeft } from '@phosphor-icons/react'
import { profile } from '@/data/profile'
import { useLang } from '@/lib/i18n'
import { trackEvent } from '@/lib/analytics'
import styles from './DockBar.module.css'

const CTA_HREF = profile.telegram

export function DockBar({
  showBack = false,
  onContact = false,
  onCaseStudies,
}: {
  showBack?: boolean
  onContact?: boolean
  onCaseStudies?: () => void
}) {
  const { lang } = useLang()

  const onCta = () => {
    if (onCaseStudies) {
      trackEvent('case_studies_opened', {
        target: 'dock_cta',
      })
      onCaseStudies()
      return
    }
    if (onContact) {
      trackEvent('contact_form_requested', { target: 'dock_send' })
      ;(document.getElementById('contact-form') as HTMLFormElement | null)?.requestSubmit()
    } else {
      trackEvent('work_cta_clicked', { target: 'telegram' })
      window.open(CTA_HREF, '_blank', 'noopener,noreferrer')
    }
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.dock}>
        {showBack && (
          <button
            className={styles.back}
            type="button"
            aria-label={lang === 'ru' ? 'Назад на главную' : 'Back to home'}
            onClick={() => {
              trackEvent('back_clicked', { target: 'top' })
              window.location.hash = '#top'
            }}
          >
            <ArrowUUpLeft size={18} weight="bold" />
          </button>
        )}
        <button
          className={styles.cta}
          type="button"
          onClick={onCta}
          aria-label={
            onContact
              ? lang === 'ru'
                ? 'Отправить'
                : 'Send'
              : onCaseStudies
                ? lang === 'ru'
                  ? 'Кейсы'
                  : 'Case studies'
                : lang === 'ru'
                  ? 'Связаться'
                  : 'Work with me'
          }
          aria-controls={onCaseStudies ? 'works' : undefined}
        >
          <span
            className={styles.ctaLabel}
            data-show={!onContact && !onCaseStudies}
            aria-hidden={onContact || Boolean(onCaseStudies)}
          >
            {lang === 'ru' ? 'Связаться' : 'Work with me'}
          </span>
          <span className={styles.ctaLabel} data-show={onContact} aria-hidden={!onContact}>
            {lang === 'ru' ? 'Отправить' : 'Send'}
          </span>
          <span
            className={styles.ctaLabel}
            data-show={Boolean(onCaseStudies)}
            aria-hidden={!onCaseStudies}
          >
            {lang === 'ru' ? 'Кейсы' : 'Case studies'}
          </span>
        </button>
      </div>
    </div>
  )
}
