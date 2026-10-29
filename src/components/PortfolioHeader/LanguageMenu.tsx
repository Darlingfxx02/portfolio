import { useCallback, useEffect, useId, useRef, useState, type CSSProperties, type KeyboardEvent, type RefObject } from 'react'
import { GlassScene, GlassSurface } from '@glass-sdk/liquid-glass'
import { ArrowUUpLeft } from '@phosphor-icons/react'
import type { LensWaypoint } from '@glass-sdk/liquid-glass/dom'
import translateIcon from '@/assets/icons/translate.svg'
import translateMediumIcon from '@/assets/icons/translate-medium.svg'
import { useLang, type Lang } from '@/lib/i18n'
import { useTheme } from '@/lib/theme'
import { trackEvent } from '@/lib/analytics'
import { glassFill, glassSamplingGutter, type GlassSettings } from '@/lib/glass/glassSettings'
import { createLiquidMenu } from '@/lib/glass/liquidMenu'
import { GlassBackdrop } from './GlassBackdrop'
import styles from './LanguageMenu.module.css'

const languages: { value: Lang; label: string }[] = [
  { value: 'en', label: 'English' },
  { value: 'ru', label: 'Русский' },
]

export function LanguageMenu({ backdropRef, glass, placement = 'below', showBack = false, onBack }: {
  backdropRef: RefObject<HTMLDivElement | null>
  glass: GlassSettings
  placement?: 'below' | 'above'
  showBack?: boolean
  onBack?: () => void
}) {
  const { lang, setLang } = useLang()
  const { theme } = useTheme()
  const [open, setOpen] = useState(false)
  const [present, setPresent] = useState(false)
  const openRef = useRef(open)
  const rootRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const backRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLElement>(null)
  const tintRef = useRef<SVGPathElement>(null)
  const blueTintRef = useRef<SVGRectElement>(null)
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([])
  const initialFocus = useRef(0)
  const menuId = useId()
  const label = lang === 'ru' ? 'Выбрать язык' : 'Choose language'
  const backLabel = lang === 'ru' ? 'Назад к кейсам' : 'Back to cases'
  // Include the full popup and its route from the button in the paint source.
  const gutter = Math.max(160, glassSamplingGutter(glass))
  const motionRef = useRef<ReturnType<typeof createLiquidMenu> | null>(null)
  const attachGeometry = useCallback((index: 0 | 1 | 2, prepared: (shape: LensWaypoint) => boolean) => {
    const motion = motionRef.current ??= createLiquidMenu({
      scene: () => sceneRef.current, trigger: () => triggerRef.current,
      menu: () => menuRef.current, panel: () => panelRef.current,
      tint: () => tintRef.current, blueTint: () => blueTintRef.current,
      back: () => backRef.current,
    })
    return motion.attach(index, prepared)
  }, [])
  const bodyGeometry = useCallback((_element: HTMLElement, prepared: (shape: LensWaypoint) => boolean) =>
    attachGeometry(0, prepared), [attachGeometry])
  const panelGeometry = useCallback((_element: HTMLElement, prepared: (shape: LensWaypoint) => boolean) =>
    attachGeometry(1, prepared), [attachGeometry])
  const backGeometry = useCallback((_element: HTMLElement, prepared: (shape: LensWaypoint) => boolean) =>
    attachGeometry(2, prepared), [attachGeometry])

  useEffect(() => {
    const menu = menuRef.current
    if (!present || !menu) return
    const exited = () => { if (!openRef.current) setPresent(false) }
    menu.addEventListener('glass:exited', exited)
    return () => menu.removeEventListener('glass:exited', exited)
  }, [present])

  const close = (restoreFocus = false) => {
    openRef.current = false
    setOpen(false)
    if (restoreFocus) triggerRef.current?.focus()
  }

  const show = (index = languages.findIndex((language) => language.value === lang)) => {
    initialFocus.current = index
    if (open) itemRefs.current[index]?.focus()
    else { openRef.current = true; setPresent(true); setOpen(true) }
  }

  useEffect(() => {
    const menu = menuRef.current
    if (!open || !menu) return
    // The SDK hides a new surface until its first optical frame. Focusing a
    // hidden item is ignored by WebKit, so wait for its shape to be painted.
    const focus = () => {
      if (getComputedStyle(menu).visibility === 'hidden' || Number(menu.style.getPropertyValue('--menu-reveal')) <= 0) return
      itemRefs.current[initialFocus.current]?.focus({ preventScroll: true })
      observer.disconnect()
    }
    const observer = new MutationObserver(focus)
    observer.observe(menu, { attributes: true, attributeFilter: ['style'] })
    focus()
    return () => observer.disconnect()
  }, [open])

  useEffect(() => {
    if (!open) return
    const dismiss = (event: PointerEvent) => {
      if (event.target instanceof Node && !rootRef.current?.contains(event.target)) {
        openRef.current = false
        setOpen(false)
      }
    }
    document.addEventListener('pointerdown', dismiss)
    return () => document.removeEventListener('pointerdown', dismiss)
  }, [open])

  const onMenuKeyDown = (event: KeyboardEvent) => {
    // Menu navigation must not reach the page's edge-scroll navigation.
    event.stopPropagation()
    const index = itemRefs.current.findIndex((item) => item === document.activeElement)
    const next = event.key === 'ArrowDown' ? (index + 1) % languages.length
      : event.key === 'ArrowUp' ? (index + languages.length - 1) % languages.length
      : event.key === 'Home' ? 0 : event.key === 'End' ? languages.length - 1 : null
    if (next !== null) {
      event.preventDefault()
      itemRefs.current[next]?.focus()
    } else if (event.key === 'Escape') {
      event.preventDefault()
      close(true)
    } else if (event.key === 'Tab') {
      close()
    }
  }

  return (
    <div ref={rootRef} className={styles.root} data-placement={placement} data-back-visible={String(showBack)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) close()
      }}>
      <GlassScene ref={sceneRef} className={styles.scene} appearance={theme} material="clear"
        data-menu-open={String(open)} data-menu-placement={placement} data-back-visible={String(showBack)}>
        <GlassBackdrop sourceRef={backdropRef} gutter={gutter} />
        <GlassSurface className={styles.bodyOptics} radius="circle" geometry={bodyGeometry}
          data-glass-optics={JSON.stringify(glass.shell)} aria-hidden="true" />
        <GlassSurface ref={panelRef} className={styles.panelOptics} radius={24} geometry={panelGeometry}
          data-glass-optics={JSON.stringify(glass.shell)} aria-hidden="true" />
        <GlassSurface className={styles.backOptics} radius="circle" geometry={backGeometry}
          data-glass-optics={JSON.stringify(glass.shell)} aria-hidden="true" />
        <svg className={styles.tint} width="240" height="190" aria-hidden="true">
          <path ref={tintRef} fill={glassFill(glass.shell)} />
          <rect ref={blueTintRef} className={styles.blueTint} fill="#4484e4" fillOpacity="0.2" />
        </svg>
        <button ref={triggerRef} type="button" className={styles.trigger} aria-label={label} title={label}
            aria-haspopup="menu" aria-expanded={open} aria-controls={open ? menuId : undefined}
            onClick={() => open ? close() : show()}
            onKeyDown={(event) => {
              event.stopPropagation()
              if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
                event.preventDefault()
                show(event.key === 'ArrowDown' ? 0 : languages.length - 1)
              } else if (event.key === 'Escape' && open) {
                event.preventDefault()
                close(true)
              }
            }}>
          <span className={styles.icon} aria-hidden="true"
            style={{ '--icon-mask': `url("${theme === 'light' ? translateMediumIcon : translateIcon}")` } as CSSProperties} />
        </button>
        <button ref={backRef} type="button" className={styles.back} aria-label={backLabel} title={backLabel}
          disabled={!showBack} aria-hidden={!showBack || undefined} tabIndex={showBack ? 0 : -1}
          onClick={() => {
            close(true)
            trackEvent('back_clicked', { target: 'work' })
            if (onBack) onBack()
            else window.location.hash = '#work'
          }}>
          <ArrowUUpLeft size={24} weight="regular" stroke="currentColor"
            strokeWidth={theme === 'light' ? 4 : 0} strokeLinejoin="round" aria-hidden="true" />
        </button>
        {present && (
          <div ref={menuRef} className={styles.menu}
            inert={!open} aria-hidden={!open || undefined}
            id={menuId} role="menu" aria-label={label}
            onKeyDown={onMenuKeyDown} onWheel={(event) => event.stopPropagation()}
            onTouchStart={(event) => event.stopPropagation()}
            onTouchMove={(event) => event.stopPropagation()}>
            {languages.map((language, index) => (
              <button key={language.value} type="button" role="menuitemradio"
                ref={(element) => { itemRefs.current[index] = element }}
                className={styles.option} lang={language.value} tabIndex={-1}
                aria-checked={lang === language.value}
                style={{ '--selection-fill': glassFill(glass.indicator) } as CSSProperties}
                onClick={() => { setLang(language.value); close(true) }}>
                <span>{language.label}</span>
                {lang === language.value && <span className={styles.check} aria-hidden="true">✓</span>}
              </button>
            ))}
          </div>
        )}
      </GlassScene>
    </div>
  )
}
