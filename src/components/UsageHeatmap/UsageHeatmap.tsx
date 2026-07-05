import { useEffect, useMemo, useRef, useState, type MouseEvent } from 'react'
import party from 'party-js'
import styles from './UsageHeatmap.module.css'

// A short, thin, rounded strip — party.js colours the <div> via style.background,
// so it flutters out like a small paper streamer/ribbon alongside the confetti.
party.resolvableShapes.ribbon =
  '<div style="height: 22px; width: 5px; border-radius: 3px;"></div>'

// Confetti modules: the template's default size grow-in + tumble, plus an opacity
// fade so particles dissolve to transparent within ~1s instead of littering the
// page. (Passing `modules` replaces the template defaults, so they're re-added.)
const confettiModules = [
  new party.ModuleBuilder()
    .drive('size')
    .by((t: number) => Math.min(1, t * 3))
    .relative()
    .build(),
  new party.ModuleBuilder()
    .drive('rotation')
    .by((t: number) => new party.Vector(140, 200, 260).scale(t))
    .relative()
    .build(),
  new party.ModuleBuilder()
    .drive('opacity')
    .by((t: number) => Math.max(0, 1 - t / 1.1))
    .through('lifetime')
    .build(),
]

/** Per-day token snapshot produced by scripts/aggregate-usage.mjs. */
type UsagePayload = {
  metric: string
  total: number
  activeDays: number
  lastDay: string | null
  days: Record<string, number>
}

/**
 * Reconstructed estimate for days lost to a disk failure, produced by
 * scripts/backfill-estimated.mjs. Kept in a SEPARATE file/type so fabricated
 * numbers never mingle with the real cumulative store — the widget renders
 * these cells in a distinct, clearly-labelled style.
 */
type EstimatePayload = {
  kind: 'estimated'
  days: Record<string, number>
}

const WEEKS = 53
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

/**
 * Live-first fetch: the deployed backend (/api/usage) wins when it's up;
 * otherwise the committed snapshot (/usage.json) keeps the cubes alive. Mirrors
 * how personalization falls back to a default when the backend is absent.
 */
async function loadUsage(): Promise<UsagePayload | null> {
  for (const url of ['/api/usage', '/usage.json']) {
    try {
      const res = await fetch(url, { cache: 'no-cache' })
      if (!res.ok) continue
      const data = (await res.json()) as UsagePayload
      if (data && data.days && typeof data.days === 'object') return data
    } catch {
      // try the next source
    }
  }
  return null
}

/** Best-effort load of the disk-loss reconstruction. Absent → widget just skips it. */
async function loadEstimate(): Promise<EstimatePayload | null> {
  try {
    const res = await fetch('/usage-estimated.json', { cache: 'no-cache' })
    if (!res.ok) return null
    const data = (await res.json()) as EstimatePayload
    if (data && data.days && typeof data.days === 'object') return data
  } catch {
    // no reconstruction available — that's fine, real days still render
  }
  return null
}

/** Monday=0 … Sunday=6 (GitHub-style week rows, Monday on top). */
function weekdayMon(d: Date): number {
  return (d.getDay() + 6) % 7
}

function dateKey(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function fmtCompact(n: number): string {
  if (n >= 1e9) return `${(n / 1e9).toFixed(1)}B`
  if (n >= 1e6) return `${(n / 1e6).toFixed(1)}M`
  if (n >= 1e3) return `${(n / 1e3).toFixed(1)}K`
  return String(n)
}

type Cell = {
  date: Date
  key: string
  value: number
  future: boolean
  estimated: boolean
  birthday: boolean
}

/** Tooltip copy for a day cell. Estimated days read as reconstructions, not fact. */
function cellLabel(cell: Cell): string {
  const d = cell.date.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
  if (cell.birthday) return `🎂 My birthday — ${d}`
  if (cell.value <= 0) return `No activity · ${d}`
  const tokens = cell.value.toLocaleString('en-US')
  return `${tokens} tokens · ${d}`
}

/**
 * Build a WEEKS×7 grid ending on the column that contains today. Real days win;
 * an estimated day only fills a cell the real record left empty, and is flagged
 * so it renders distinctly and never inflates the real thresholds.
 */
function buildGrid(
  days: Record<string, number>,
  estimated: Record<string, number>,
): { cols: Cell[][]; thresholds: number[] } {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const addDays = (base: Date, n: number) =>
    new Date(base.getFullYear(), base.getMonth(), base.getDate() + n)

  // First cell = Monday of the week (WEEKS-1) columns before this week.
  const thisMonday = addDays(today, -weekdayMon(today))
  const start = addDays(thisMonday, -(WEEKS - 1) * 7)

  const cols: Cell[][] = []
  for (let c = 0; c < WEEKS; c++) {
    const col: Cell[] = []
    for (let r = 0; r < 7; r++) {
      const date = addDays(start, c * 7 + r)
      const key = dateKey(date)
      const real = days[key] || 0
      const est = real > 0 ? 0 : estimated[key] || 0
      col.push({
        date,
        key,
        value: real > 0 ? real : est,
        estimated: real <= 0 && est > 0,
        future: date > today,
        birthday: date.getMonth() === 2 && date.getDate() === 6,
      })
    }
    cols.push(col)
  }

  // Quantile thresholds over REAL nonzero days only → estimates ride the same
  // scale but never bend it (keeps the real record's shading truthful).
  const nonzero = Object.values(days)
    .filter((v) => v > 0)
    .sort((a, b) => a - b)
  const q = (p: number) => nonzero[Math.floor(p * (nonzero.length - 1))] || 0
  const thresholds = nonzero.length ? [q(0.25), q(0.5), q(0.75)] : [0, 0, 0]

  return { cols, thresholds }
}

/** Total tokens + active days over the trailing 30 days (real records only). */
function last30Stat(days: Record<string, number>): { total: number; activeDays: number } {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  let total = 0
  let activeDays = 0
  for (let i = 0; i < 30; i++) {
    const d = new Date(today.getFullYear(), today.getMonth(), today.getDate() - i)
    const v = days[dateKey(d)] || 0
    if (v > 0) {
      total += v
      activeDays++
    }
  }
  return { total, activeDays }
}

function levelOf(value: number, thresholds: number[]): number {
  if (value <= 0) return 0
  if (value <= thresholds[0]) return 1
  if (value <= thresholds[1]) return 2
  if (value <= thresholds[2]) return 3
  return 4
}

export function UsageHeatmap() {
  const [data, setData] = useState<UsagePayload | null>(null)
  const [estimate, setEstimate] = useState<EstimatePayload | null>(null)
  const [tip, setTip] = useState<{ text: string; x: number; y: number } | null>(null)
  // Left edge fade+blur, shown only while there's off-screen history to the
  // left (i.e. the year overflows and we're scrolled away from the start). It
  // hints "scroll for more" without a scrollbar; on desktop the grid fits, so
  // there's no overflow and the fade never appears.
  const [leftFade, setLeftFade] = useState(false)
  const lastPop = useRef(0)
  const scrollRef = useRef<HTMLDivElement>(null)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    let alive = true
    loadUsage().then((d) => {
      if (alive) setData(d)
    })
    loadEstimate().then((e) => {
      if (alive) setEstimate(e)
    })
    return () => {
      alive = false
    }
  }, [])

  // Recent activity lives at the right edge — on narrow viewports where the
  // year overflows, start scrolled to the end so it's visible, not clipped off.
  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    el.scrollLeft = el.scrollWidth
    setLeftFade(el.scrollWidth - el.clientWidth > 4)
  }, [data])

  const grid = useMemo(
    () => (data ? buildGrid(data.days, estimate?.days ?? {}) : null),
    [data, estimate],
  )

  // No data (backend down + no snapshot) → degrade silently, like the rest of
  // the site does when personalization is absent.
  if (!data || !grid) return null

  const { cols, thresholds } = grid
  const stat = last30Stat(data.days)

  // Month label sits above the first column whose top-row month differs from
  // the previous column's — GitHub's placement.
  const monthLabels = cols.map((col, i) => {
    const m = col[0].date.getMonth()
    const prev = i > 0 ? cols[i - 1][0].date.getMonth() : -1
    return m !== prev ? MONTHS[m] : ''
  })

  const showTip = (e: MouseEvent<HTMLSpanElement>, cell: Cell) => {
    const host = sectionRef.current
    if (!host) return
    const r = e.currentTarget.getBoundingClientRect()
    const h = host.getBoundingClientRect()
    setTip({
      text: cellLabel(cell),
      x: r.left - h.left + r.width / 2,
      y: r.top - h.top,
    })
    if (cell.birthday) celebrate(e.currentTarget)
  }

  // Party-popper on the birthday cell: paper confetti + ribbon streamers +
  // sparkles, all emitted from the cell via party.js. Throttled so re-entering
  // the cell doesn't machine-gun bursts.
  const celebrate = (el: HTMLElement) => {
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return
    const now = Date.now()
    if (now - lastPop.current < 600) return
    lastPop.current = now
    party.confetti(el, {
      count: party.variation.range(9, 14),
      spread: 38,
      speed: party.variation.range(170, 330),
      size: party.variation.range(0.8, 1.3),
      shapes: ['square', 'roundedRectangle', 'ribbon'],
      modules: confettiModules,
    })
    party.sparkles(el, {
      count: party.variation.range(4, 7),
      size: party.variation.range(0.7, 1.3),
    })
  }

  return (
    <section id="usage" className={styles.section} ref={sectionRef}>
      <div className={styles.leftFade} data-show={leftFade || undefined} aria-hidden />
      <div
        className={styles.scroll}
        ref={scrollRef}
        onScroll={(e) => setLeftFade(e.currentTarget.scrollLeft > 4)}
      >
        <div className={styles.body}>
          <div className={styles.gridWrap}>
            <div className={styles.months}>
              {monthLabels.map((m, i) => (
                <span key={i} className={styles.month}>
                  {m}
                </span>
              ))}
            </div>

            <div className={styles.cols} onMouseLeave={() => setTip(null)}>
              {cols.map((col, ci) => (
                <div key={ci} className={styles.col}>
                  {col.map((cell) =>
                    cell.future ? (
                      <span key={cell.key} className={styles.cellFuture} />
                    ) : (
                      <span
                        key={cell.key}
                        className={styles.cell}
                        data-level={levelOf(cell.value, thresholds)}
                        data-estimated={cell.estimated || undefined}
                        data-birthday={cell.birthday || undefined}
                        onMouseEnter={(e) => showTip(e, cell)}
                      />
                    ),
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {tip && (
        <div
          className={styles.tooltip}
          style={{ left: tip.x, top: tip.y }}
          role="tooltip"
        >
          {tip.text}
        </div>
      )}

      <div className={styles.footer}>
        <div className={styles.legend}>
          <span>Less</span>
          {[0, 1, 2, 3, 4].map((l) => (
            <span key={l} className={styles.cell} data-level={l} />
          ))}
          <span>More</span>
        </div>
        <p className={styles.stat}>
          <span>
            {fmtCompact(stat.total)} tokens · {stat.activeDays} days
          </span>
          <img className={styles.statIcon} src="/stickers/claude-icon.webp" alt="Claude" />
          <img className={styles.statIcon} src="/stickers/codex-icon.webp" alt="Codex" />
        </p>
      </div>
    </section>
  )
}
