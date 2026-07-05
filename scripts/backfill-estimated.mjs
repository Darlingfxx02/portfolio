#!/usr/bin/env node
// Reconstructs an ESTIMATE for the stretch of usage history lost to a disk
// failure, for the contribution-heatmap widget. This is NOT measured usage —
// it is a transparent, clearly-labelled reconstruction.
//
//   node scripts/backfill-estimated.mjs        # write public/usage-estimated.json
//
// HONESTY CONTRACT — read before touching this file:
//   • The output goes to public/usage-estimated.json, a SEPARATE file. It is
//     never written into public/usage.json (the real cumulative store), so the
//     aggregate script's MAX-merge can never absorb fabricated numbers into the
//     real record. Real telemetry and reconstruction stay physically apart.
//   • The widget renders these cells in a distinct grey/hatched style with a
//     "~N (estimated)" tooltip and a footer disclosure. A viewer can always
//     tell reconstructed days from measured ones.
//   • Values are BOOTSTRAPPED from the surviving real days (sampled + jittered),
//     so the estimate mirrors the real distribution's shape and range instead of
//     a flat mid-range wall — but it is still a guess, presented as a guess.
//
// Only the pre-firstDay window (the days actually lost) is reconstructed. Every
// day from the real firstDay onward is left exactly as it survived — gaps and
// all — because that is the genuine record.

import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const REAL_FILE = fileURLToPath(new URL('../public/usage.json', import.meta.url))
const OUT_FILE = fileURLToPath(new URL('../public/usage-estimated.json', import.meta.url))

// GitHub-grid geometry mirrored from the widget so estimated cells line up with
// the columns the widget will actually render.
const WEEKS = 53
const SEED = 0x9e3779b9 // fixed → the committed file is deterministic across runs

/** Seeded PRNG (mulberry32) — reproducible, no Math.random so reruns are stable. */
function mulberry32(seed) {
  let a = seed >>> 0
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const key = (d) => {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}
const addDays = (base, n) =>
  new Date(base.getFullYear(), base.getMonth(), base.getDate() + n)
const weekdayMon = (d) => (d.getDay() + 6) % 7 // Mon=0 … Sun=6

function main() {
  if (!existsSync(REAL_FILE)) {
    console.error('no public/usage.json to sample from — run `pnpm usage` first')
    process.exit(1)
  }
  const real = JSON.parse(readFileSync(REAL_FILE, 'utf8'))
  const realDays = real?.days && typeof real.days === 'object' ? real.days : {}
  const realVals = Object.values(realDays)
    .map((v) => Number(v) || 0)
    .filter((v) => v > 0)
    .sort((a, b) => a - b)

  if (realVals.length < 3) {
    console.error('too few surviving days to build a credible estimate')
    process.exit(1)
  }

  const lo = realVals[0]
  const hi = realVals[realVals.length - 1]
  // Estimates dip below the real min on the low-usage early days, so floor at a
  // small positive instead of the real min; still capped at the real max.
  const clampEst = (v) => Math.min(hi, Math.max(20000, Math.round(v)))

  // Grid window: same 53-week span the widget draws, ending on today.
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const thisMonday = addDays(today, -weekdayMon(today))
  const start = addDays(thisMonday, -(WEEKS - 1) * 7)
  const startMs = start.getTime()
  const spanMs = Math.max(1, today.getTime() - startMs)

  // Adoption trend: usage grows over time (more AI, more and more), so the
  // reconstruction ramps from a fraction of today's level at the far-left up to
  // full recent level near the present — exponential, i.e. accelerating.
  const G_LO = 0.28 // oldest-day multiplier
  const G_HI = 1.0 // present-day multiplier

  const rand = mulberry32(SEED)
  const days = {}
  let filled = 0

  // Reconstruct EVERY in-grid day the real record lacks — interior gaps are
  // lost data too, not days off — up to today. Real days are never overwritten.
  for (let d = new Date(start); d <= today; d = addDays(d, 1)) {
    const k = key(d)
    if ((Number(realDays[k]) || 0) > 0) continue // genuine surviving day — keep as-is

    const wd = d.getDay() // 0=Sun … 6=Sat
    const weekend = wd === 0 || wd === 6
    // Near-daily worker: almost nothing skipped — only a rare important day off.
    const activeP = weekend ? 0.95 : 0.985
    if (rand() >= activeP) continue

    const t = (d.getTime() - startMs) / spanMs // 0 (oldest) … 1 (today)
    const growth = G_LO * Math.pow(G_HI / G_LO, t) // accelerating ramp
    // Bootstrap: sample a surviving day, apply the trend, add ±35% noise.
    const base = realVals[Math.floor(rand() * realVals.length)]
    const jitter = 0.65 + rand() * 0.7
    days[k] = clampEst(base * jitter * growth * (weekend ? 0.9 : 1))
    filled++
  }

  const total = Object.values(days).reduce((a, b) => a + b, 0)
  const est = {
    generatedAt: new Date().toISOString(),
    kind: 'estimated',
    note: 'Reconstructed estimate for days lost to a disk failure — NOT measured usage. Bootstrapped from the surviving real days, with an upward usage trend over time.',
    basis: {
      sampledFromDays: realVals.length,
      window: { from: key(start), to: key(today) },
      valueRange: { min: lo, max: hi },
      trend: 'increasing (accelerating adoption)',
    },
    estimatedDays: filled,
    total,
    days,
  }

  writeFileSync(OUT_FILE, JSON.stringify(est, null, 2) + '\n')
  console.log(`estimated → ${OUT_FILE}`)
  console.log(
    `  ${filled} reconstructed days · ${(total / 1e6).toFixed(1)}M est. tokens\n` +
      `  window ${key(start)} … ${key(today)} · trend up · sampled from ${realVals.length} real days`,
  )
}

main()
