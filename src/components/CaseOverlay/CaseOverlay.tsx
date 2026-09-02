import { useEffect, useRef, type CSSProperties, type MouseEvent } from 'react'
import { createPortal } from 'react-dom'
import { cases } from '@/data/cases'
import { useLang, t } from '@/lib/i18n'
import { trackEvent } from '@/lib/analytics'
import styles from './CaseOverlay.module.css'

const latestCases = cases.filter((study) => !study.disabled).slice(0, 3)

export function CaseOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { lang } = useLang()
  const canvasRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!open) return

    const pageRoot = document.getElementById('top')
    const trigger = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const pageWasInert = pageRoot?.hasAttribute('inert') ?? false
    const previousOverflow = document.documentElement.style.overflow
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }

    pageRoot?.setAttribute('inert', '')
    document.documentElement.style.overflow = 'hidden'
    document.addEventListener('keydown', onKeyDown)
    const focusFrame = window.requestAnimationFrame(() => canvasRef.current?.focus())

    return () => {
      window.cancelAnimationFrame(focusFrame)
      document.removeEventListener('keydown', onKeyDown)
      document.documentElement.style.overflow = previousOverflow
      if (!pageWasInert) pageRoot?.removeAttribute('inert')
      trigger?.focus()
    }
  }, [onClose, open])

  const closeFromCanvas = (event: MouseEvent<HTMLElement>) => {
    if (event.target === event.currentTarget) onClose()
  }

  if (!open) return null

  return createPortal(
    <section
      ref={canvasRef}
      id="case-overlay"
      className={styles.canvas}
      role="dialog"
      aria-modal="true"
      aria-label={lang === 'ru' ? 'Последние кейсы' : 'Latest cases'}
      tabIndex={-1}
      onMouseDown={closeFromCanvas}
    >
      <div className={styles.cards} onMouseDown={closeFromCanvas}>
        {latestCases.map((study, index) => {
          const title = t(study.title, lang)
          const outcome = study.outcome ? t(study.outcome, lang) : ''
          const openLabel = lang === 'ru' ? 'Открыть кейс' : 'Open Case Study'

          return (
            <a
              key={study.id}
              className={styles.card}
              href={`#case/${study.id}`}
              style={{ '--i': index } as CSSProperties}
              data-case={study.id}
              aria-label={`${title} — ${outcome}`}
              onClick={() => {
                trackEvent('case_opened', { case_id: study.id, target: 'case_overlay' })
                onClose()
              }}
            >
              <span className={styles.cover}>
                {study.image && (
                  <img
                    src={study.image}
                    alt=""
                    width={640}
                    height={360}
                    loading="eager"
                    decoding="async"
                    draggable={false}
                  />
                )}
              </span>
              <span className={styles.copy}>
                <span className={styles.heading}>
                  <span className={styles.marker} aria-hidden="true" />
                  <span className={styles.title}>{title}</span>
                </span>
                {outcome && <span className={styles.description}>{outcome}</span>}
                <span className={styles.openLink}>
                  {openLabel} <span aria-hidden="true">↗</span>
                </span>
              </span>
            </a>
          )
        })}
      </div>
    </section>,
    document.body,
  )
}
