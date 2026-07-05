import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from 'react'
import { ArrowUUpLeft, List, X } from '@phosphor-icons/react'
import { LiquidMetal } from '@paper-design/shaders-react'
import { MiniFolder, sections } from './folders'
import styles from './DockBar.module.css'

const CTA_HREF = 'https://t.me/darling_dsgn'

type Theme = 'light' | 'dark'

/**
 * The CTA background is a liquid-metal shader instead of a flat fill. Each theme
 * gets its own metal so the label (which stays var(--bg)) keeps its contrast:
 * dark theme has a light/silver pill → bright metal; light theme has a dark pill
 * → noir metal. Values adapted from the shader's Default / Noir presets.
 */
const METAL: Record<Theme, Record<string, number | string>> = {
  dark: {
    colorBack: '#b7b7bd',
    colorTint: '#ffffff',
    softness: 0.05,
    repetition: 1.5,
    shiftRed: 0.3,
    shiftBlue: 0.3,
    distortion: 0.1,
    contour: 0.4,
    angle: 90,
    scale: 1,
    shape: 'none',
    // worldWidth/Height 0 → the shader fills the canvas (Backdrop mode) instead
    // of drawing a boxed object letterboxed in the middle of the pill.
    worldWidth: 0,
    worldHeight: 0,
  },
  light: {
    colorBack: '#0b0b0c',
    colorTint: '#7a7a7a',
    softness: 0.1,
    repetition: 1.5,
    shiftRed: 0,
    shiftBlue: 0,
    distortion: 0.06,
    contour: 0.3,
    angle: 90,
    scale: 1,
    shape: 'none',
    worldWidth: 0,
    worldHeight: 0,
  },
}

/** Tracks `<html data-theme>`, which ThemeToggle flips imperatively. */
function useTheme(): Theme {
  const [theme, setTheme] = useState<Theme>(() =>
    typeof document !== 'undefined' && document.documentElement.dataset.theme === 'light'
      ? 'light'
      : 'dark',
  )
  useEffect(() => {
    const el = document.documentElement
    const read = () => setTheme(el.dataset.theme === 'light' ? 'light' : 'dark')
    read()
    const mo = new MutationObserver(read)
    mo.observe(el, { attributes: true, attributeFilter: ['data-theme'] })
    return () => mo.disconnect()
  }, [])
  return theme
}

function usePrefersReducedMotion(): boolean {
  const [reduce, setReduce] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const on = () => setReduce(mq.matches)
    on()
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])
  return reduce
}

export function DockBar({
  showBack = false,
  onContact = false,
}: {
  showBack?: boolean
  onContact?: boolean
}) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement | null>(null)
  const theme = useTheme()
  const reduceMotion = usePrefersReducedMotion()

  // The CTA morphs between "Work with me" and "Send". Keep it a single
  // persistent element and animate its width to the active label so the
  // change is smooth instead of a hard swap.
  const workRef = useRef<HTMLSpanElement>(null)
  const sendRef = useRef<HTMLSpanElement>(null)
  const [ctaW, setCtaW] = useState<number | undefined>()

  useLayoutEffect(() => {
    const measure = () => {
      const active = onContact ? sendRef.current : workRef.current
      if (active) setCtaW(active.offsetWidth + 44) // + horizontal padding
    }
    measure()
    // Re-measure once webfonts settle so the width matches the real glyphs.
    document.fonts?.ready.then(measure).catch(() => {})
  }, [onContact])

  const onCta = () => {
    if (onContact) {
      ;(document.getElementById('contact-form') as HTMLFormElement | null)?.requestSubmit()
    } else {
      window.open(CTA_HREF, '_blank', 'noopener,noreferrer')
    }
  }

  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    // Defer one tick so the opening click's own mousedown can't close it.
    const id = window.setTimeout(() => {
      document.addEventListener('mousedown', onDown)
    }, 0)
    document.addEventListener('keydown', onKey)
    return () => {
      window.clearTimeout(id)
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <div className={styles.wrap} ref={rootRef}>
      <div
        className={styles.panel}
        role="menu"
        aria-hidden={!open}
        data-state={open ? 'open' : 'closed'}
      >
        <div className={styles.panelRow}>
          {sections.map((s, i) => (
            <a
              key={s.href}
              className={styles.folderLink}
              href={s.href}
              download={s.download || undefined}
              tabIndex={open ? 0 : -1}
              onClick={() => setOpen(false)}
              style={{ '--i': i } as CSSProperties}
            >
              <MiniFolder
                Icon={s.Icon}
                color={s.color}
                size={72}
                bodyGradient={s.bodyGradient}
                iconHoverColor={s.iconHoverColor}
              />
              <span className={styles.folderLabel}>{s.label}</span>
            </a>
          ))}
        </div>
      </div>

      <div className={styles.dock}>
        {showBack && (
          <button
            className={styles.back}
            type="button"
            aria-label="Назад на главную"
            onClick={() => {
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
          aria-label={onContact ? 'Send' : 'Work with me'}
        >
          <LiquidMetal
            className={styles.ctaShader}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
            fit="contain"
            speed={reduceMotion ? 0 : 0.8}
            {...METAL[theme]}
            aria-hidden
          />
          <span
            ref={workRef}
            className={styles.ctaLabel}
            data-show={!onContact}
            aria-hidden={onContact}
          >
            Work with me
          </span>
          <span ref={sendRef} className={styles.ctaLabel} data-show={onContact} aria-hidden={!onContact}>
            Send
          </span>
        </button>
        <button
          className={styles.burger}
          type="button"
          aria-label={open ? 'Закрыть меню' : 'Открыть меню'}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span className={styles.burgerIcon} data-state={open ? 'open' : 'closed'} aria-hidden>
            <List size={18} weight="bold" className={styles.iconList} />
            <X size={18} weight="bold" className={styles.iconX} />
          </span>
        </button>
      </div>
    </div>
  )
}
