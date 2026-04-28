<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Project layout

- Next.js 16 App Router, React 19, Tailwind 4, TypeScript.
- `output: "standalone"` in `next.config.ts` — production builds produce a self-contained server in `.next/standalone/`.
- Path alias `@/*` → `src/*` (see `tsconfig.json`).

## Click counter (global, persisted)

The landing page tracks total button clicks across all visitors.

- **Storage:** SQLite via `better-sqlite3`, file at `data/counter.db` (override with env `DATABASE_PATH`). Schema: `counters(name TEXT PRIMARY KEY, value INTEGER)` with a single seed row `global_clicks`. WAL mode is enabled.
- **DB module:** `src/lib/db.ts` — `getClickCount()` and `incrementClickCount()`. Marked `import "server-only"` so it cannot leak into client bundles. Uses `RETURNING value` for a single-statement atomic increment-and-read.
- **Server Action:** `src/app/actions.ts` — `incrementClicks()` is a `"use server"` function called from the client on click. Returns the new total.
- **UI:**
  - `src/app/page.tsx` is a Server Component. It calls `await connection()` (so the page is rendered per-request, not prerendered at build time) and reads the initial count from SQLite.
  - `src/app/click-counter.tsx` is a `"use client"` component that takes `initialCount`, holds local state, and calls the server action via `useTransition` to update it.
- **Bundling:** `serverExternalPackages: ["better-sqlite3"]` in `next.config.ts` keeps the native binding out of the bundler — required for native modules under standalone output.
- **Git:** `data/` is gitignored.

## Running locally

```bash
npm install            # native modules (better-sqlite3) compile here
npm run dev            # http://localhost:3000

# production-equivalent run
npm run build
node .next/standalone/server.js   # standalone bundle; serve static assets via .next/static and public/
```

The SQLite file lives at `<cwd>/data/counter.db` by default. Override with `DATABASE_PATH=/abs/path/to/counter.db`. Back up that file to back up the counter.

## Production deploy (Coolify on home server)

Live site: **https://darlingdesign.pro** — served by Coolify (`portfolio:main-...` app, project `darlingdesign`) on a Windows + WSL2 + Docker host. Coolify auto-deploys on push to `main` from `github.com/Darlingfxx02/portfolio`.

`Dockerfile` (multi-stage Node 22 bookworm-slim → Next.js standalone) is what Coolify must use. **Settings to check in Coolify UI:**

- **Build Pack:** `Dockerfile` (not Nixpacks — Nixpacks does not pick up `serverExternalPackages` reliably and the Dockerfile installs the build toolchain `better-sqlite3` may need)
- **Exposed Port:** `3000`
- **Persistent Storage:** mount a host directory (e.g. `/data/portfolio-db`) at container path `/data`. Without this the SQLite file is destroyed on every redeploy.
- **Environment Variables:** `DATABASE_PATH=/data/counter.db`

To inspect the running app on the server (over Tailscale via the `win` SSH alias):

```bash
ssh win 'wsl -- bash -lc "sudo docker ps | grep portfolio"'
ssh win 'wsl -- bash -lc "sudo docker exec -it <container> ls -la /data"'   # see the DB file
```

Backup the counter: copy `/data/portfolio-db/counter.db` (host path of the mounted volume).

## Conventions

- **Mutations from client → server:** Server Actions (`"use server"`), not route handlers, unless an external HTTP client needs to call it.
- **Forcing dynamic rendering** when the page reads request-scoped or live data without using `cookies()`/`headers()`: `await connection()` from `next/server`. Replaces the old `unstable_noStore`.
- **Native node modules** (anything with a `.node` binding) must be added to `serverExternalPackages` in `next.config.ts`.
