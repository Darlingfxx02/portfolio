import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import styles from './SelectedWork.module.css'
import { getWorks, peekWorks } from '@/lib/works'
import { trackEvent } from '@/lib/analytics'

// Fallback pool — used until/unless the CMS returns works (VITE_DIRECTUS_URL
// unset or backend down). Rather than blank neutral tiles (which read as a
// broken/empty grid), it cycles the real case covers so #works always looks
// like a gallery, and each tile opens its case. Real CMS works carry an image
// `url` but no `caseId`, so they render as a plain gallery.
type PoolItem = { id: string; ratio: number; url?: string; caseId?: string }
const CASE_FALLBACK: PoolItem[] = [
  { id: 'uxart', url: '/cases/uxart.webp', ratio: 0.64, caseId: 'uxart' },
  {
    id: 'zinda',
    url: '/cases/case-cover-zinda-formation.jpg',
    ratio: 0.5625,
    caseId: 'zinda',
  },
  { id: 'ovork-1', url: '/cases/ovork-1.webp', ratio: 1.55, caseId: 'ovork' },
  { id: 'ovork-2', url: '/cases/ovork-2.webp', ratio: 1.55, caseId: 'ovork' },
  { id: 'ovork-3', url: '/cases/ovork-3.webp', ratio: 1.55, caseId: 'ovork' },
]

type Tile = PoolItem & { key: string }

function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice()
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export function SelectedWork() {
  // Real CMS works when available, placeholder pool otherwise. Seed from the
  // module cache so a remount (returning from a case page) shows the real grid
  // with no fetch flash.
  const [pool, setPool] = useState<PoolItem[]>(() => {
    const w = peekWorks()
    return w && w.length ? w : CASE_FALLBACK
  })

  // Pull real works from the CMS; swap the pool in when they arrive.
  useEffect(() => {
    let alive = true
    getWorks().then((w) => {
      if (alive && w.length) setPool(w)
    })
    return () => {
      alive = false
    }
  }, [])

  // Keyed so a pool swap (placeholder → CMS) cleanly remounts the grid: all
  // column/height/batch state resets to a fresh seed, no manual teardown.
  const key = pool === CASE_FALLBACK ? 'fallback' : 'cms'
  return (
    <main className={styles.page}>
      <Grid key={key} pool={pool} />
    </main>
  )
}

function Grid({ pool }: { pool: PoolItem[] }) {
  const [left, setLeft] = useState<Tile[]>([])
  const [right, setRight] = useState<Tile[]>([])
  const leftH = useRef(0)
  const rightH = useRef(0)
  const batch = useRef(0)
  // Backstop against a synchronous fill runaway; reset on each real scroll top-up.
  const fillGuard = useRef(0)
  const sentinelRef = useRef<HTMLDivElement | null>(null)

  // Append a freshly shuffled pass over the pool — the loop "по кругу" — each
  // tile into the currently shorter column.
  const addBatch = useCallback(() => {
    batch.current += 1
    const b = batch.current
    const newLeft: Tile[] = []
    const newRight: Tile[] = []
    shuffle(pool).forEach((item, i) => {
      const tile: Tile = { ...item, key: `${b}-${i}-${item.id}` }
      if (leftH.current <= rightH.current) {
        newLeft.push(tile)
        leftH.current += item.ratio
      } else {
        newRight.push(tile)
        rightH.current += item.ratio
      }
    })
    setLeft((p) => [...p, ...newLeft])
    setRight((p) => [...p, ...newRight])
  }, [pool])

  // Seed one batch on mount; the fill effect tops it up to the viewport.
  useEffect(() => {
    addBatch()
  }, [addBatch])

  // Keep the columns taller than the viewport so there's always something below
  // the fold to scroll toward. Runs after each render; ratios guarantee height,
  // so it converges — fillGuard only caps a pathological loop (a small CMS
  // gallery would otherwise leave the sentinel permanently in view).
  useLayoutEffect(() => {
    const el = sentinelRef.current
    if (!el) return
    if (fillGuard.current > 60) return
    if (el.getBoundingClientRect().top < window.innerHeight + 800) {
      fillGuard.current += 1
      addBatch()
    }
  }, [left, right, addBatch])

  // Infinite scroll — as consumed content brings the sentinel back near the
  // fold, top up. Reset the guard so the fill effect can extend the run again.
  useEffect(() => {
    const el = sentinelRef.current
    if (!el) return
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fillGuard.current = 0
          addBatch()
        }
      },
      { rootMargin: '800px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [addBatch])

  return (
    <>
      <div className={styles.cols}>
        <div className={styles.col}>
          {left.map((t) => (
            <Cell key={t.key} tile={t} />
          ))}
        </div>
        <div className={styles.col}>
          {right.map((t) => (
            <Cell key={t.key} tile={t} />
          ))}
        </div>
      </div>
      <div ref={sentinelRef} className={styles.sentinel} aria-hidden />
    </>
  )
}

function Cell({ tile }: { tile: Tile }) {
  const open = tile.caseId
    ? () => {
        trackEvent('work_tile_opened', { case_id: tile.caseId })
        window.location.hash = `#case/${tile.caseId}`
      }
    : undefined
  return (
    <div
      className={styles.tile}
      style={{ aspectRatio: `1 / ${tile.ratio}` }}
      data-clickable={open ? true : undefined}
      role={open ? 'link' : undefined}
      tabIndex={open ? 0 : undefined}
      aria-label={open ? `Open ${tile.caseId} case study` : undefined}
      onClick={open}
      onKeyDown={
        open
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                open()
              }
            }
          : undefined
      }
    >
      {tile.url && (
        <img
          className={styles.img}
          src={tile.url}
          alt=""
          loading="lazy"
          decoding="async"
          // A broken CMS asset would otherwise leave a torn-image glyph; hide it
          // so the tile degrades to its neutral fill instead of looking broken.
          onError={(e) => {
            e.currentTarget.style.display = 'none'
          }}
        />
      )}
    </div>
  )
}
