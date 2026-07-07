// Selected Work content, sourced from the Directus CMS. Each published `works`
// row carries one image; the grid cycles the pool "по кругу" to fill an infinite
// scroll. When VITE_DIRECTUS_URL is unset or the backend is down, callers fall
// back to neutral placeholder tiles so the page never looks broken — same
// degrade-silently posture as the usage widget and personalization.

// Same-origin by default: the site's nginx proxies /directus/* to the Directus
// container over the shared Docker network (see nginx.conf), so no build arg,
// public CMS subdomain, or CORS is needed in prod. Override with
// VITE_DIRECTUS_URL only to point at a different/absolute Directus.
// `||` (not `??`) so an EMPTY string also falls back — the Dockerfile bakes
// VITE_DIRECTUS_URL='' when no build arg is set, which `??` would leave as ''.
const BASE = (import.meta.env.VITE_DIRECTUS_URL || '/directus').replace(/\/+$/, '')

export type Work = {
  id: string
  /** Ready-to-use asset URL (server-side webp transform, capped width). */
  url: string
  /** height / width — drives the tile aspect ratio for the masonry columns. */
  ratio: number
}

type DirectusFile = { id: string; width: number | null; height: number | null }
type DirectusWork = { id: string; image: DirectusFile | null }

/** Directus resizes + re-encodes on the fly and caches the result. */
function assetUrl(fileId: string): string {
  return `${BASE}/assets/${fileId}?width=900&format=webp&quality=82&fit=cover`
}

async function fetchWorks(): Promise<Work[]> {
  if (!BASE) return []
  const q = new URLSearchParams({
    'filter[status][_eq]': 'published',
    fields: 'id,image.id,image.width,image.height',
    sort: 'sort,-date_created',
    limit: '-1',
  })
  try {
    const res = await fetch(`${BASE}/items/works?${q}`, { cache: 'no-cache' })
    if (!res.ok) return []
    const { data } = (await res.json()) as { data: DirectusWork[] }
    const works: Work[] = []
    for (const row of data ?? []) {
      const file = row.image
      if (!file?.id) continue
      const w = file.width || 1
      const h = file.height || 1
      works.push({ id: row.id, url: assetUrl(file.id), ratio: +(h / w).toFixed(3) })
    }
    return works
  } catch {
    return [] // network/CORS error → placeholder mode
  }
}

// Module-level cache: fetch ONCE per session and share the in-flight promise, so
// leaving to a case page and returning to #works re-renders instantly without a
// refetch/flash. Mirrors getUsage() in UsageHeatmap.
let value: Work[] | null = null
let promise: Promise<Work[]> | null = null

export function getWorks(): Promise<Work[]> {
  if (value) return Promise.resolve(value)
  if (!promise) {
    promise = fetchWorks().then((w) => {
      if (w.length) value = w
      else promise = null // empty → allow a later retry (backend may come up)
      return w
    })
  }
  return promise
}

/** Synchronous peek at the cache, for seeding state on remount without a flash. */
export function peekWorks(): Work[] | null {
  return value
}
