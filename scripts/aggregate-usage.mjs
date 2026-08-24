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
// Metric matches Claude Code's built-in `/stats` dashboard EXACTLY so the site's
// heatmap reproduces the same numbers a user sees there:
//   per day = Σ over assistant messages of (input_tokens + output_tokens)
// i.e. input + output ONLY — no cache_creation, no cache_read — and the
// synthetic model (quota-probe turns Claude tags "<synthetic>") is excluded.
// Decompiled from the claude binary's stats aggregator:
//   let d=(input_tokens||0)+(output_tokens||0); if(d>0){ tokensByModel[model]+=d }
// Verified: this reproduces /stats' "Total tokens" (last-7d ≈ 11.5M vs 11.3M
// shown), whereas adding cache or de-duplicating did not.

/** Claude Code: assistant events carry message.usage. Mirrors `/stats`. */
function claudeTokens(d) {
  if (d?.type !== 'assistant') return 0
  if (d?.message?.model === '<synthetic>') return 0 // quota-probe turns /stats skips
  const u = d?.message?.usage
  if (!u) return 0
  return num(u.input_tokens) + num(u.output_tokens)
}

// NOTE: no de-duplication by message.id. `/stats` counts every assistant usage
// record across all session files (streaming partials + resume/fork/compact
// replays included), so to match its totals we must NOT collapse duplicates —
// doing so undercounts relative to the dashboard.

/**
 * Codex CLI: token_count carries cumulative totals for the current rollout.
 * Use the delta between consecutive totals instead of summing
 * last_token_usage: Codex can emit the same last usage more than once, which
 * otherwise double-counts a small part of a session.
 */
function codexTokens(d, state) {
  if (d?.type !== 'event_msg') return 0
  const p = d.payload
  if (!p || p.type !== 'token_count') return 0
  const total = p.info?.total_token_usage
  if (!total) return 0

  const current = {
    input: num(total.input_tokens),
    cached: num(total.cached_input_tokens),
    output: num(total.output_tokens),
  }
  let input = current.input - state.input
  let cached = current.cached - state.cached
  let output = current.output - state.output

  // A restarted/reset counter begins a new cumulative sequence in the same
  // file. Count its current totals as the first delta of that sequence.
  if (input < 0 || cached < 0 || output < 0) {
    input = current.input
    cached = current.cached
    output = current.output
  }

  state.input = current.input
  state.cached = current.cached
  state.output = current.output
  return Math.max(0, input - cached) + Math.max(0, output)
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
  // For sources that can log the same record more than once (see
  // claudeDedupeKey), collect max-usage-per-id first, then fold into days.
  // id → { tokens, day }.
  const byId = source.dedupeKey ? new Map() : null
  const files = walk(source.dir, source.accept)
  for (const file of files) {
    const state = { input: 0, cached: 0, output: 0 }
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
      const tokens = source.extract(d, state)
      if (!tokens) continue
      const key = localDateKey(d.timestamp)
      if (!key) continue

      const id = byId ? source.dedupeKey(d) : null
      if (id) {
        // Keep the largest usage seen for this message id (the complete turn);
        // duplicates are dropped instead of added.
        const prev = byId.get(id)
        if (!prev || tokens > prev.tokens) byId.set(id, { tokens, day: key })
      } else {
        days[key] = (days[key] || 0) + tokens
      }
      events++
    }
  }
  if (byId) {
    for (const { tokens, day } of byId.values()) {
      days[day] = (days[day] || 0) + tokens
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
