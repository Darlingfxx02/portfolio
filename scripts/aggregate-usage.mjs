#!/usr/bin/env node
// Aggregates local AI-CLI usage into a per-day token map for the site's
// contribution-heatmap widget (GitHub-style cubes).
//
// Sources (local, this machine only):
//   • Claude Code  ~/.claude/projects/**/*.jsonl        (message.usage)
//   • Codex CLI    ~/.codex/**/rollout-*.jsonl          (token_count events)
//
// PERSISTENCE — the important bit: the committed public/usage.json is a
// CUMULATIVE store, not a fresh dump. Each run MERGES the new scan into it
// keeping the per-day MAX. So when Claude/Codex prune old sessions, or you wipe
// ~/.claude entirely, past days are NOT lost — they live on in the committed
// JSON (and, on the live path, in the backend the aggregator pushes to).
//
//   node scripts/aggregate-usage.mjs            # merge → public/usage.json
//   node scripts/aggregate-usage.mjs --push     # + POST to the admin backend
//   node scripts/aggregate-usage.mjs --fresh    # ignore the store (full rebuild)
//
// Why MAX-merge is safe: a past day's token total only ever DROPS (when its
// files are deleted) — never legitimately rises — so the high-water mark is the
// true value. Today's count only grows, so fresh ≥ stored and MAX picks fresh.

import { readdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import { homedir } from 'node:os'
import { fileURLToPath } from 'node:url'

const HOME = homedir()
const OUT_FILE = fileURLToPath(new URL('../public/usage.json', import.meta.url))
const num = (v) => Number(v) || 0

// ── Per-source token extractors ──────────────────────────────────────────────
// Both mirror the same "work done" metric: real input + output, minus cached
// context replay (which dwarfs everything and would flatten the scale).

/** Claude Code: assistant events carry message.usage. */
function claudeTokens(d) {
  const u = d?.message?.usage
  if (!u) return 0
  return num(u.input_tokens) + num(u.output_tokens) + num(u.cache_creation_input_tokens)
}

/** Codex CLI: event_msg/token_count carries per-turn last_token_usage. */
function codexTokens(d) {
  if (d?.type !== 'event_msg') return 0
  const p = d.payload
  if (!p || p.type !== 'token_count') return 0
  const lu = p.info?.last_token_usage
  if (!lu) return 0
  const input = Math.max(0, num(lu.input_tokens) - num(lu.cached_input_tokens))
  return input + num(lu.output_tokens)
}

const SOURCES = [
  {
    name: 'claude',
    dir: join(HOME, '.claude', 'projects'),
    accept: (n) => n.endsWith('.jsonl'),
    extract: claudeTokens,
  },
  {
    name: 'codex',
    dir: join(HOME, '.codex'),
    accept: (n) => n.startsWith('rollout-') && n.endsWith('.jsonl'),
    extract: codexTokens,
  },
]

/** Local YYYY-MM-DD for an ISO timestamp (uses the machine's timezone). */
function localDateKey(iso) {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return null
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

/** Recursively collect files matching `accept` under `dir`. */
function walk(dir, accept) {
  const out = []
  let entries
  try {
    entries = readdirSync(dir, { withFileTypes: true })
  } catch {
    return out
  }
  for (const e of entries) {
    const full = join(dir, e.name)
    if (e.isDirectory()) out.push(...walk(full, accept))
    else if (e.isFile() && accept(e.name)) out.push(full)
  }
  return out
}

/** Scan one source → { days, files, events }. */
function scanSource(source) {
  const days = {}
  let events = 0
  const files = walk(source.dir, source.accept)
  for (const file of files) {
    let text
    try {
      text = readFileSync(file, 'utf8')
    } catch {
      continue
    }
    for (const line of text.split('\n')) {
      const trimmed = line.trim()
      if (!trimmed) continue
      let d
      try {
        d = JSON.parse(trimmed)
      } catch {
        continue // tolerate a torn last line of an in-flight session
      }
      const tokens = source.extract(d)
      if (!tokens) continue
      const key = localDateKey(d.timestamp)
      if (!key) continue
      days[key] = (days[key] || 0) + tokens
      events++
    }
  }
  return { days, files: files.length, events }
}

/** Read the committed cumulative store (empty on first run / --fresh). */
function loadStore() {
  if (process.argv.includes('--fresh') || !existsSync(OUT_FILE)) return {}
  try {
    const prev = JSON.parse(readFileSync(OUT_FILE, 'utf8'))
    return prev?.days && typeof prev.days === 'object' ? prev.days : {}
  } catch {
    return {}
  }
}

function main() {
  // Fresh scan across all sources → one merged per-day map.
  const fresh = {}
  const perSource = []
  for (const source of SOURCES) {
    const r = scanSource(source)
    perSource.push({ name: source.name, ...r, activeDays: Object.keys(r.days).length })
    for (const [k, v] of Object.entries(r.days)) fresh[k] = (fresh[k] || 0) + v
  }

  // Merge into the persistent store — per-day MAX, so deleted history survives.
  const stored = loadStore()
  const days = {}
  let preserved = 0
  for (const key of new Set([...Object.keys(stored), ...Object.keys(fresh)])) {
    const s = num(stored[key])
    const f = num(fresh[key])
    days[key] = Math.max(s, f)
    if (s > f) preserved++ // day kept only because the store remembered it
  }

  const dateKeys = Object.keys(days).sort()
  const total = Object.values(days).reduce((a, b) => a + b, 0)
  const max = Object.values(days).reduce((a, b) => Math.max(a, b), 0)

  const payload = {
    generatedAt: new Date().toISOString(),
    tz: Intl.DateTimeFormat().resolvedOptions().timeZone,
    metric: 'tokens',
    sources: SOURCES.map((s) => s.name),
    firstDay: dateKeys[0] ?? null,
    lastDay: dateKeys[dateKeys.length - 1] ?? null,
    activeDays: dateKeys.length,
    total,
    max,
    days,
  }

  writeFileSync(OUT_FILE, JSON.stringify(payload, null, 2) + '\n')

  const mb = (total / 1e6).toFixed(1)
  console.log(`usage → ${OUT_FILE}`)
  for (const s of perSource) {
    console.log(`  ${s.name.padEnd(7)} ${s.files} files · ${s.events} events · ${s.activeDays} days`)
  }
  console.log(
    `  merged: ${dateKeys.length} active days · ${mb}M tokens · ${preserved} preserved from store\n` +
      `  span ${payload.firstDay} … ${payload.lastDay}`,
  )

  if (process.argv.includes('--push')) pushToBackend(payload)
}

/** Optional: ship the same payload to the live admin backend (POST /api/usage). */
function pushToBackend(payload) {
  const base = process.env.USAGE_API_URL // e.g. https://admin.site
  const token = process.env.USAGE_API_TOKEN
  if (!base || !token) {
    console.warn('--push skipped: set USAGE_API_URL and USAGE_API_TOKEN')
    return
  }
  fetch(`${base.replace(/\/$/, '')}/api/usage`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  })
    .then((r) => console.log(`push → ${r.status} ${r.statusText}`))
    .catch((e) => console.error('push failed:', e.message))
}

main()
