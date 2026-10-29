import { useLayoutEffect, useRef, useState, type CSSProperties, type RefObject } from 'react'
import { profile } from '@/data/profile'
import { useLang } from '@/lib/i18n'
import { trackEvent } from '@/lib/analytics'
import type { GlassSettings } from '@/lib/glass/glassSettings'
import { LanguageMenu } from '@/components/PortfolioHeader/LanguageMenu'
import { ThemeToggle } from '@/components/PortfolioHeader/ThemeToggle'
import { AnimatedTabLabel } from '@/components/PortfolioHeader/AnimatedTabLabel'
import styles from './DockBar.module.css'

const CTA_HREF = profile.telegram
const contactLabel = { ru: 'Контакты', en: 'Contact' }
const messageLabel = { ru: 'Написать мне', en: 'Message me' }

export function DockBar({
  backdropRef,
  glass,
  showControls,
  showBack = false,
  onBack,
  onContact,
}: {
  backdropRef: RefObject<HTMLDivElement | null>
  glass: GlassSettings
  showControls: boolean
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
    let disposed = false
    const measure = () => {
      if (disposed) return
      const active = onContact ? contactRef.current : workRef.current
      if (!active?.parentElement) return
      const style = getComputedStyle(active.parentElement)
      // Measure the destination text, not the label frame's animated width.
      const label = active.querySelector<HTMLElement>(`[data-label-layer="${lang}"]`)
      setCtaW((label?.offsetWidth ?? active.offsetWidth) + parseFloat(style.paddingLeft) + parseFloat(style.paddingRight))
    }
    measure()
    // Re-measure once webfonts settle so the width matches the real glyphs.
    document.fonts?.ready.then(measure).catch(() => {})
    window.addEventListener('resize', measure)
    return () => {
      disposed = true
      window.removeEventListener('resize', measure)
    }
  }, [lang, onContact])

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
      <div className={styles.dock} data-controls={showControls || undefined}>
        {showControls && <div className={styles.control}>
          <LanguageMenu backdropRef={backdropRef} glass={glass} placement="above" showBack={showBack} onBack={onBack} />
        </div>}
        <button
          className={styles.cta}
          type="button"
          style={ctaW ? { '--cta-width': `${ctaW}px` } as CSSProperties : undefined}
          onClick={onCta}
          aria-label={(onContact ? contactLabel : messageLabel)[lang]}
          aria-controls={onContact ? 'panel-about' : undefined}
        >
          <span
            ref={workRef}
            className={styles.ctaLabel}
            data-show={!onContact}
            aria-hidden={Boolean(onContact)}
          >
            <AnimatedTabLabel label={messageLabel} lang={lang} order={0} />
          </span>
          <span
            ref={contactRef}
            className={styles.ctaLabel}
            data-show={Boolean(onContact)}
            aria-hidden={!onContact}
          >
            <AnimatedTabLabel label={contactLabel} lang={lang} order={0} />
          </span>
        </button>
        {showControls && <div className={styles.control}>
          <ThemeToggle backdropRef={backdropRef} glass={glass} />
        </div>}
      </div>
    </div>
  )
}
