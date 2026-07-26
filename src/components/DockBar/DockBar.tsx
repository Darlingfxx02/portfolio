import { useLayoutEffect, useRef, useState } from 'react'
import { ArrowUUpLeft } from '@phosphor-icons/react'
import { profile } from '@/data/profile'
import { useLang } from '@/lib/i18n'
import { trackEvent } from '@/lib/analytics'
import styles from './DockBar.module.css'

const CTA_HREF = profile.telegram

export function DockBar({
  showBack = false,
  onBack,
  onContact,
}: {
  showBack?: boolean
  onBack?: () => void
  onContact?: () => void
}) {
  const { lang } = useLang()

  // The CTA morphs between "Написать мне" and "Контакты". Keep it a single
  // persistent element and animate its width to the active label so the
  // change is smooth instead of a hard swap.
  const workRef = useRef<HTMLSpanElement>(null)
  const contactRef = useRef<HTMLSpanElement>(null)
  const [ctaW, setCtaW] = useState<number | undefined>()

  useLayoutEffect(() => {
    const measure = () => {
      const active = onContact ? contactRef.current : workRef.current
      if (active) setCtaW(active.offsetWidth + 44) // + horizontal padding
    }
    measure()
    // Re-measure once webfonts settle so the width matches the real glyphs.
    document.fonts?.ready.then(measure).catch(() => {})
  }, [onContact])

  const onCta = () => {
    if (onContact) {
      trackEvent('contact_tab_requested', {
        target: 'dock_cta',
      })
      onContact()
      return
    }
    trackEvent('work_cta_clicked', { target: 'telegram' })
    window.open(CTA_HREF, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.dock}>
        {showBack && (
          <button
            className={styles.back}
            type="button"
            aria-label={lang === 'ru' ? 'Назад к кейсам' : 'Back to cases'}
            onClick={() => {
              trackEvent('back_clicked', { target: 'work' })
              if (onBack) onBack()
              else window.location.hash = '#work'
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
          aria-label={onContact ? 'Контакты' : 'Написать мне'}
          aria-controls={onContact ? 'panel-about' : undefined}
        >
          <span
            ref={workRef}
            className={styles.ctaLabel}
            data-show={!onContact}
            aria-hidden={Boolean(onContact)}
          >
            Написать мне
          </span>
          <span
            ref={contactRef}
            className={styles.ctaLabel}
            data-show={Boolean(onContact)}
            aria-hidden={!onContact}
          >
            Контакты
          </span>
        </button>
      </div>
    </div>
  )
}
