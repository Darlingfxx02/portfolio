// Live usage endpoint — DROP-IN for the portfolio-admin-server repo (the Node
// service nginx proxies /api/ to). NOT wired into the SPA build; it lives here
// as the reference contract for the backend half of the usage heatmap.
//
// Data flow:
//   your Mac ──(cron)──> POST /api/usage ──> admin-server persists usage.json
//   public site ──GET /api/usage──> cubes render live
//
// The SPA fetches /api/usage first and falls back to the deployed
// public/usage.json, so this endpoint is a pure upgrade — nothing breaks
// without it.
//
// ── Mount (Express) ─────────────────────────────────────────────────────────
//   import { registerUsageRoutes } from './usage-backend.mjs'
//   registerUsageRoutes(app)
//
// ── Push from your Mac (cron / launchd, daily) ──────────────────────────────
//   cd ~/Projects/darling-live
//   USAGE_API_URL=https://admin.yoursite \
//   USAGE_API_TOKEN=$USAGE_TOKEN \
//   node scripts/aggregate-usage.mjs --push
//
// crontab -e →  0 * * * *  cd ~/Projects/darling-live && USAGE_API_URL=… USAGE_API_TOKEN=… /usr/local/bin/node scripts/aggregate-usage.mjs --push

import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { dirname, join } from 'node:path'

const DATA_FILE = process.env.USAGE_DATA_FILE || join(process.cwd(), 'data', 'usage.json')
const INGEST_TOKEN = process.env.USAGE_API_TOKEN // shared secret with the pusher

export function registerUsageRoutes(app) {
  // Public read — the SPA hits this at runtime.
  app.get('/api/usage', async (_req, res) => {
    try {
      const raw = await readFile(DATA_FILE, 'utf8')
      res.type('application/json').send(raw)
    } catch {
      res.status(404).json({ error: 'no usage data yet' })
    }
  })

  // Authenticated write — the local aggregator pushes here.
  app.post('/api/usage', async (req, res) => {
    const auth = req.headers.authorization || ''
    if (!INGEST_TOKEN || auth !== `Bearer ${INGEST_TOKEN}`) {
      return res.status(401).json({ error: 'unauthorized' })
    }
    const body = req.body
    if (!body || typeof body.days !== 'object') {
      return res.status(400).json({ error: 'expected { days: {...} }' })
    }
    try {
      await mkdir(dirname(DATA_FILE), { recursive: true })
      await writeFile(DATA_FILE, JSON.stringify(body))
      res.json({ ok: true, activeDays: Object.keys(body.days).length })
    } catch (e) {
      res.status(500).json({ error: String(e) })
    }
  })
}
