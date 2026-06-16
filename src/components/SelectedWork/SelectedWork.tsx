import { useCallback, useEffect, useRef, useState } from 'react'
import styles from './SelectedWork.module.css'

// Placeholder pool — neutral fill, only the aspect ratio (height / width)
// varies per tile. Swap fills for real images later.
const RATIOS = [0.7, 0.85, 1, 1.2, 1.35, 1.55, 0.78, 1.1, 0.92, 1.45, 1.05, 0.82]

type PoolItem = { id: string; ratio: number }
const POOL: PoolItem[] = RATIOS.map((ratio, i) => ({ id: `p${i}`, ratio }))

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
  const [left, setLeft] = useState<Tile[]>([])
  const [right, setRight] = useState<Tile[]>([])
  const leftH = useRef(0)
  const rightH = useRef(0)
  const batch = useRef(0)
  const sentinelRef = useRef<HTMLDivElement | null>(null)

  // Append a freshly shuffled batch, each tile into the currently shorter column.
  const addBatch = useCallback(() => {
    batch.current += 1
    const b = batch.current
    const newLeft: Tile[] = []
    const newRight: Tile[] = []
    shuffle(POOL).forEach((item, i) => {
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
  }, [])

  // Seed enough to fill the viewport and enable scrolling.
  useEffect(() => {
    addBatch()
    addBatch()
  }, [addBatch])

  // Infinite scroll — top up before the sentinel is reached.
  useEffect(() => {
    const el = sentinelRef.current
    if (!el) return
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) addBatch()
      },
      { rootMargin: '800px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [addBatch])

  return (
    <main className={styles.page}>
      <div className={styles.cols}>
        <div className={styles.col}>
          {left.map((t) => (
            <div key={t.key} className={styles.tile} style={{ aspectRatio: `1 / ${t.ratio}` }} />
          ))}
        </div>
        <div className={styles.col}>
          {right.map((t) => (
            <div key={t.key} className={styles.tile} style={{ aspectRatio: `1 / ${t.ratio}` }} />
          ))}
        </div>
      </div>
      <div ref={sentinelRef} className={styles.sentinel} aria-hidden />
    </main>
  )
}
