import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import styles from './SelectedWork.module.css'
import { getWorks, peekWorks } from '@/lib/works'

// Fallback pool — neutral fill, only the aspect ratio (height / width) varies.
// Used until/unless the CMS returns works (VITE_DIRECTUS_URL unset or backend
// down). Real works carry an image `url`; placeholders don't.
const RATIOS = [0.7, 0.85, 1, 1.2, 1.35, 1.55, 0.78, 1.1, 0.92, 1.45, 1.05, 0.82]

type PoolItem = { id: string; ratio: number; url?: string }
const PLACEHOLDER_POOL: PoolItem[] = RATIOS.map((ratio, i) => ({ id: `p${i}`, ratio }))

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
    return w && w.length ? w : PLACEHOLDER_POOL
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
  const key = pool === PLACEHOLDER_POOL ? 'placeholder' : 'cms'
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
  return (
    <div className={styles.tile} style={{ aspectRatio: `1 / ${tile.ratio}` }}>
      {tile.url && (
        <img className={styles.img} src={tile.url} alt="" loading="lazy" decoding="async" />
      )}
    </div>
  )
}
