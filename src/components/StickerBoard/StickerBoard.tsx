import {
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as RPointerEvent,
} from 'react'
import { stickers as seed } from '@/data/stickers'
import styles from './StickerBoard.module.css'

type Pos = { x: number; y: number; w?: number }

// v2: reset saved drags — v1 stored absolute positions from an older seed layout
// that piled stickers up in one corner once the scatter changed.
const STORAGE_KEY = 'sticker-positions-v2'

function loadSaved(): Record<string, Pos> {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
  } catch {
    return {}
  }
}

/**
 * A draggable pinboard layer. Stickers float above the page content but below
 * the dock (z-index 90 < dock's 100), scroll with the page, tilt on hover, and
 * can be flung anywhere. Drag positions persist in localStorage.
 */
export function StickerBoard({ anchorId = 'playground' }: { anchorId?: string }) {
  const layerRef = useRef<HTMLDivElement>(null)
  const [pos, setPos] = useState<Record<string, Pos>>({})
  const dragId = useRef<string | null>(null)
  const dragOff = useRef<Pos>({ x: 0, y: 0 })

  // Scatter stickers around the anchor block, honouring any positions the
  // visitor has already dragged things to. The anchor sits at the bottom of the
  // page, so its position only settles once images/fonts finish loading (they
  // grow the page and push it down) — a baseTop measured too early strands the
  // stickers up over the résumé. A ResizeObserver on <body> alone misses this:
  // content images loading above the anchor reflow the page without a resize the
  // observer reliably reports. So we re-place on every settling signal — the next
  // frame, web-font readiness, window `load`, and a capture-phase `load` listener
  // that catches each image finishing (load doesn't bubble, but capture sees it).
  useLayoutEffect(() => {
    const layer = layerRef.current
    if (!layer) return

    const place = () => {
      if (dragId.current) return // don't yank a sticker out from under a drag
      const layerRect = layer.getBoundingClientRect()
      const anchor = document.getElementById(anchorId)
      const pageW = layerRect.width
      const baseTop = anchor
        ? anchor.getBoundingClientRect().top - layerRect.top
        : layer.scrollHeight - 360
      const saved = loadSaved()
      const narrow = pageW < 560
      const nodes = Array.from(layer.children) as HTMLElement[]
      const clampX = (x: number, w: number) => Math.max(0, Math.min(pageW - w, x))

      setPos(() => {
        const next: Record<string, Pos> = {}
        // On phones the desktop rx/ry scatter piles the (proportionally huge)
        // photos on top of each other. Fall back to a tidy two-column masonry,
        // centred in each half, with shortest-column packing to balance the
        // stacks. Start below the "Stuff I like" label so it isn't covered. On
        // wider screens keep the freeform scatter.
        const colH = [40, 40]
        seed.forEach((s, i) => {
          const w = narrow ? Math.min(s.width, Math.round(pageW * 0.42)) : s.width
          let seeded: Pos
          if (narrow) {
            const node = nodes[i]
            // Height at the mobile width: scale the measured box (circles stay
            // square). Before images load we fall back to a square, then re-place.
            const h =
              s.shape === 'circle'
                ? w
                : node && node.offsetWidth
                  ? Math.round(node.offsetHeight * (w / node.offsetWidth))
                  : w
            const col = colH[0] <= colH[1] ? 0 : 1
            const colW = pageW / 2
            seeded = {
              x: clampX(Math.round(col * colW + (colW - w) / 2), w),
              y: baseTop + colH[col],
              w,
            }
            colH[col] += h + 16
          } else {
            seeded = { x: clampX(s.rx * (pageW - w), w), y: baseTop + s.ry, w }
          }
          // Clamp saved x back on-screen in case the viewport shrank.
          const save = saved[s.id]
          next[s.id] = save ? { x: clampX(save.x, w), y: save.y, w } : seeded
        })
        return next
      })
    }

    place()
    const raf = requestAnimationFrame(place)
    document.fonts?.ready.then(place)
    window.addEventListener('load', place)
    // Capture phase: `load` from <img>/<video> doesn't bubble, but it is visible
    // on the way down — this fires as each content image settles the layout.
    document.addEventListener('load', place, true)
    const ro = new ResizeObserver(place)
    ro.observe(document.body)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('load', place)
      document.removeEventListener('load', place, true)
      ro.disconnect()
    }
  }, [anchorId, seed.length])

  function onPointerDown(e: RPointerEvent<HTMLDivElement>, id: string) {
    const layer = layerRef.current
    const p = pos[id]
    if (!layer || !p) return
    const rect = layer.getBoundingClientRect()
    dragId.current = id
    dragOff.current = { x: e.clientX - rect.left - p.x, y: e.clientY - rect.top - p.y }
    e.currentTarget.setPointerCapture(e.pointerId)
    e.currentTarget.dataset.dragging = 'true'
  }

  function onPointerMove(e: RPointerEvent<HTMLDivElement>, id: string) {
    if (dragId.current !== id) return
    const layer = layerRef.current
    if (!layer) return
    const rect = layer.getBoundingClientRect()
    const w = e.currentTarget.offsetWidth
    const h = e.currentTarget.offsetHeight
    const x = Math.max(0, Math.min(rect.width - w, e.clientX - rect.left - dragOff.current.x))
    const y = Math.max(0, Math.min(rect.height - h, e.clientY - rect.top - dragOff.current.y))
    setPos((prev) => ({ ...prev, [id]: { x, y } }))
  }

  function onPointerUp(e: RPointerEvent<HTMLDivElement>, id: string) {
    if (dragId.current !== id) return
    dragId.current = null
    delete e.currentTarget.dataset.dragging
    setPos((prev) => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(prev))
      } catch {
        /* private mode / quota — positions just won't persist */
      }
      return prev
    })
  }

  return (
    <div ref={layerRef} className={styles.layer} aria-hidden="true">
      {seed.map((s) => {
        const p = pos[s.id]
        if (!p) return null
        const isCircle = s.shape === 'circle'
        const w = p.w ?? s.width
        const style: CSSProperties = {
          left: p.x,
          top: p.y,
          width: w,
          height: isCircle ? w : undefined,
          ['--rot' as string]: `${s.rotate}deg`,
        }
        return (
          <div
            key={s.id}
            className={styles.sticker}
            data-shape={s.shape ?? 'rounded'}
            data-shadow={s.shadow ?? 'panel'}
            style={style}
            onPointerDown={(e) => onPointerDown(e, s.id)}
            onPointerMove={(e) => onPointerMove(e, s.id)}
            onPointerUp={(e) => onPointerUp(e, s.id)}
            onPointerCancel={(e) => onPointerUp(e, s.id)}
          >
            {s.kind === 'video' ? (
              <video
                className={styles.media}
                src={s.src}
                autoPlay
                loop
                muted
                playsInline
              />
            ) : (
              <img className={styles.media} src={s.src} alt={s.alt ?? ''} draggable={false} />
            )}
          </div>
        )
      })}
    </div>
  )
}
