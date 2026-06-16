import {
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as RPointerEvent,
} from 'react'
import { stickers as seed } from '@/data/stickers'
import styles from './StickerBoard.module.css'

type Pos = { x: number; y: number }

const STORAGE_KEY = 'sticker-positions-v1'

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

  // First paint: scatter stickers around the anchor block, but honour any
  // positions the visitor has already dragged things to.
  useLayoutEffect(() => {
    const layer = layerRef.current
    if (!layer) return
    const layerRect = layer.getBoundingClientRect()
    const anchor = document.getElementById(anchorId)
    const pageW = layerRect.width
    const baseTop = anchor
      ? anchor.getBoundingClientRect().top - layerRect.top
      : layer.scrollHeight - 360
    const saved = loadSaved()

    setPos(() => {
      const next: Record<string, Pos> = {}
      for (const s of seed) {
        const w = s.width
        const seeded: Pos = {
          x: Math.max(0, Math.min(pageW - w, s.rx * (pageW - w))),
          y: baseTop + s.ry,
        }
        // Clamp saved x back on-screen in case the viewport shrank.
        const save = saved[s.id]
        next[s.id] = save
          ? { x: Math.max(0, Math.min(pageW - w, save.x)), y: save.y }
          : seeded
      }
      return next
    })
  }, [anchorId])

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
        const style: CSSProperties = {
          left: p.x,
          top: p.y,
          width: s.width,
          height: isCircle ? s.width : undefined,
          ['--rot' as string]: `${s.rotate}deg`,
        }
        return (
          <div
            key={s.id}
            className={styles.sticker}
            data-shape={s.shape ?? 'rounded'}
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
