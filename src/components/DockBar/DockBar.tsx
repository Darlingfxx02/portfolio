import { useLayoutEffect, useRef, useState } from 'react'
import { ArrowUUpLeft } from '@phosphor-icons/react'
import { useLang } from '@/lib/i18n'
import { trackEvent } from '@/lib/analytics'
import styles from './DockBar.module.css'

const CTA_HREF = 'https://t.me/darling_dsgn'

export function DockBar({
  showBack = false,
  onContact = false,
  onCaseStudies,
  caseStudiesOpen = false,
}: {
  showBack?: boolean
  onContact?: boolean
  onCaseStudies?: () => void
  caseStudiesOpen?: boolean
}) {
  const { lang } = useLang()

  // The CTA morphs between "Work with me" and "Send". Keep it a single
  // persistent element and animate its width to the active label so the
  // change is smooth instead of a hard swap.
  const workRef = useRef<HTMLSpanElement>(null)
  const sendRef = useRef<HTMLSpanElement>(null)
  const casesRef = useRef<HTMLSpanElement>(null)
  const homeRef = useRef<HTMLSpanElement>(null)
  const [ctaW, setCtaW] = useState<number | undefined>()

  useLayoutEffect(() => {
    const measure = () => {
      const active = onContact
        ? sendRef.current
        : onCaseStudies
          ? caseStudiesOpen
            ? homeRef.current
            : casesRef.current
          : workRef.current
      if (active) setCtaW(active.offsetWidth + 44) // + horizontal padding
    }
    measure()
    // Re-measure once webfonts settle so the width matches the real glyphs.
    document.fonts?.ready.then(measure).catch(() => {})
  }, [caseStudiesOpen, onCaseStudies, onContact])

  const onCta = () => {
    if (onCaseStudies) {
      trackEvent(caseStudiesOpen ? 'case_overlay_closed' : 'case_overlay_opened', {
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
          style={ctaW ? { width: ctaW } : undefined}
          onClick={onCta}
          aria-label={
            onContact
              ? 'Send'
              : onCaseStudies
                ? caseStudiesOpen
                  ? 'Home'
                  : 'Case studies'
                : 'Work with me'
          }
          aria-expanded={onCaseStudies ? caseStudiesOpen : undefined}
          aria-controls={onCaseStudies ? 'case-overlay' : undefined}
        >
          <span
            ref={workRef}
            className={styles.ctaLabel}
            data-show={!onContact && !onCaseStudies}
            aria-hidden={onContact || Boolean(onCaseStudies)}
          >
            Work with me
          </span>
          <span ref={sendRef} className={styles.ctaLabel} data-show={onContact} aria-hidden={!onContact}>
            Send
          </span>
          <span
            ref={casesRef}
            className={styles.ctaLabel}
          data-show={Boolean(onCaseStudies) && !caseStudiesOpen}
          aria-hidden={!onCaseStudies || caseStudiesOpen}
          >
            Case studies
          </span>
          <span
            ref={homeRef}
            className={styles.ctaLabel}
            data-show={caseStudiesOpen}
            aria-hidden={!caseStudiesOpen}
          >
            Home
          </span>
        </button>
      </div>
    </div>
  )
}
