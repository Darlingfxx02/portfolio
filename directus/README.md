# Directus CMS — Selected Work grid

Real database (Postgres) + admin UI (Directus) that feeds the infinite `#works`
grid. The portfolio reads published `works` rows over the public REST API — no
token, images cycle "по кругу" through the two masonry columns.

```
Coolify: [Directus + Postgres]  ──REST──▶  portfolio SPA (#works grid)
         cms.darlingdesign.pro            darlingdesign.pro
```

## 1. Deploy on Coolify

1. **New Resource → Docker Compose**, point it at this repo, path `directus/docker-compose.yml`
   (or paste the file). Same server/network as the site.
2. **Environment Variables** — fill in from [`.env.example`](.env.example).
   Generate each secret with `openssl rand -hex 32`.
3. **Domain** — set the `directus` service domain to `cms.darlingdesign.pro`,
   container port **8055**. Coolify issues TLS. `PUBLIC_URL` must equal this.
4. **Deploy.** First boot runs Directus migrations and seeds the admin from
   `ADMIN_EMAIL` / `ADMIN_PASSWORD`.

## 2. Bootstrap the `works` collection

One-time, from your machine (needs Node 18+):

```bash
DIRECTUS_URL=https://cms.darlingdesign.pro \
ADMIN_EMAIL=you@example.com ADMIN_PASSWORD=... \
node directus/bootstrap.mjs
```

Creates the `works` collection (`image`, `status`, `sort`, `title`), links the
image to Directus files, and grants **public read** on `works` (published only)
and files — so the site fetches with no auth. Idempotent; re-run anytime.

## 3. Add work images

Directus admin → **Works** → *Create Item* → upload an image → **status =
Published** → Save. Drag rows to reorder (`sort`). The grid picks them up on the
next visit — pixel size drives the tile aspect ratio automatically.

## 4. Point the site at it

Nothing to configure — the site defaults to the same-origin `/directus` path,
which nginx proxies to the Directus container over the shared Docker network
(see `nginx.conf`). No public CMS subdomain, build arg, or CORS needed. Just
redeploy the site (push to `main`). If Directus is down the grid degrades to
neutral placeholder tiles.

To point at an absolute Directus instead (e.g. a public subdomain), set the
`VITE_DIRECTUS_URL` build arg on the portfolio Coolify resource and enable CORS
for that origin in the compose env.

## API the site calls

```
GET /items/works?filter[status][_eq]=published&fields=id,image.id,image.width,image.height&sort=sort,-date_created&limit=-1
GET /assets/{fileId}?width=900&format=webp&quality=82&fit=cover
```

Nothing here is secret — public read is intentional (portfolio images).
