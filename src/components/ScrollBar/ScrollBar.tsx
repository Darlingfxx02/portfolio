import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as RPointerEvent,
} from 'react'
import styles from './ScrollBar.module.css'

const MIN_THUMB = 36 // keep the pill grabbable on very long pages
const MAX_THUMB = 72 // cap so it stays a small pill on short pages
const MARGIN = 10 // inset from top/bottom of the viewport

const clampThumb = (h: number) => Math.min(MAX_THUMB, Math.max(MIN_THUMB, h))

/**
 * Trackless custom scrollbar: the native bar is hidden in CSS (so it can't
 * appear, take width, or shift the layout) and this fill pill rides the right
 * edge, reflecting scroll position. It's also draggable to scroll.
 */
export function ScrollBar() {
  const [m, setM] = useState({ height: 0, top: 0, visible: false })
  const dragging = useRef(false)
  const start = useRef({ y: 0, scroll: 0 })
  const raf = useRef<number | null>(null)

  const compute = useCallback(() => {
    const sh = document.documentElement.scrollHeight
    const vh = window.innerHeight
    const scrollable = sh - vh
    if (scrollable <= 1) {
      setM((p) => (p.visible ? { ...p, visible: false } : p))
      return
    }
    const trackH = vh - MARGIN * 2
    const height = clampThumb((vh / sh) * trackH)
    const top = MARGIN + (window.scrollY / scrollable) * (trackH - height)
    setM({ height, top, visible: true })
  }, [])

  useEffect(() => {
    const onScroll = () => {
      if (raf.current != null) return
      raf.current = requestAnimationFrame(() => {
        raf.current = null
        compute()
      })
    }
    compute()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', compute)
    // Height changes on route switches, sticker drags, infinite scroll, etc.
    const ro = new ResizeObserver(compute)
    ro.observe(document.body)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', compute)
      ro.disconnect()
    }
  }, [compute])

  function onPointerDown(e: RPointerEvent<HTMLDivElement>) {
    dragging.current = true
    start.current = { y: e.clientY, scroll: window.scrollY }
    e.currentTarget.setPointerCapture(e.pointerId)
    e.currentTarget.dataset.dragging = 'true'
    document.body.style.userSelect = 'none'
  }

  function onPointerMove(e: RPointerEvent<HTMLDivElement>) {
    if (!dragging.current) return
    const sh = document.documentElement.scrollHeight
    const vh = window.innerHeight
    const scrollable = sh - vh
    const trackH = vh - MARGIN * 2
    const height = clampThumb((vh / sh) * trackH)
    const dy = e.clientY - start.current.y
    const delta = (dy / (trackH - height)) * scrollable
    window.scrollTo(0, start.current.scroll + delta)
  }

  function onPointerUp(e: RPointerEvent<HTMLDivElement>) {
    dragging.current = false
    delete e.currentTarget.dataset.dragging
    document.body.style.userSelect = ''
  }

  if (!m.visible) return null
  return (
    <div
      className={styles.thumb}
      style={{ height: m.height, transform: `translateY(${m.top}px)` }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      role="presentation"
      aria-hidden
    />
  )
}
