#!/usr/bin/env node
// Bootstrap the `works` collection in a fresh Directus and open it up for
// public (unauthenticated) read — so the portfolio can fetch images with no
// token. Idempotent: safe to re-run; existing pieces are skipped.
//
//   DIRECTUS_URL=https://cms.darlingdesign.pro \
//   ADMIN_EMAIL=you@example.com ADMIN_PASSWORD=... \
//   node directus/bootstrap.mjs
//
// Requires Node 18+ (global fetch).

const URL = (process.env.DIRECTUS_URL ?? '').replace(/\/+$/, '')
const EMAIL = process.env.ADMIN_EMAIL
const PASSWORD = process.env.ADMIN_PASSWORD

if (!URL || !EMAIL || !PASSWORD) {
  console.error('Set DIRECTUS_URL, ADMIN_EMAIL, ADMIN_PASSWORD.')
  process.exit(1)
}

let token = ''

async function api(method, path, body) {
  const res = await fetch(`${URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  })
  const text = await res.text()
  const json = text ? JSON.parse(text) : null
  if (!res.ok) {
    const err = new Error(`${method} ${path} → ${res.status}`)
    err.status = res.status
    err.payload = json
    throw err
  }
  return json?.data ?? json
}

async function login() {
  const data = await api('POST', '/auth/login', { email: EMAIL, password: PASSWORD })
  token = data.access_token
  console.log('✓ logged in as admin')
}

async function exists(path) {
  try {
    await api('GET', path)
    return true
  } catch (e) {
    if (e.status === 403 || e.status === 404) return false
    throw e
  }
}

async function createCollection() {
  if (await exists('/collections/works')) {
    console.log('• collection "works" already exists — skipping')
    return
  }
  await api('POST', '/collections', {
    collection: 'works',
    meta: {
      icon: 'photo_library',
      note: 'Images for the Selected Work grid (#works). One image per row.',
      sort_field: 'sort',
      archive_field: 'status',
      archive_value: 'archived',
      unarchive_value: 'published',
    },
    schema: { name: 'works' },
    fields: [
      {
        field: 'id',
        type: 'uuid',
        meta: { hidden: true, readonly: true, interface: 'input', special: ['uuid'] },
        schema: { is_primary_key: true, has_auto_increment: false },
      },
      {
        field: 'status',
        type: 'string',
        meta: {
          interface: 'select-dropdown',
          display: 'labels',
          width: 'half',
          options: {
            choices: [
              { text: 'Published', value: 'published' },
              { text: 'Draft', value: 'draft' },
              { text: 'Archived', value: 'archived' },
            ],
          },
        },
        schema: { default_value: 'published' },
      },
      {
        field: 'sort',
        type: 'integer',
        meta: { interface: 'input', hidden: true },
        schema: {},
      },
      {
        field: 'image',
        type: 'uuid',
        meta: { interface: 'file-image', special: ['file'], width: 'full', required: true },
        schema: {},
      },
      {
        field: 'title',
        type: 'string',
        meta: { interface: 'input', width: 'full', note: 'Optional alt text / caption' },
        schema: {},
      },
      {
        field: 'date_created',
        type: 'timestamp',
        meta: { special: ['date-created'], interface: 'datetime', readonly: true, hidden: true },
        schema: {},
      },
    ],
  })
  console.log('✓ created collection "works"')
}

async function createRelation() {
  const rels = await api('GET', '/relations/works/image').catch((e) => {
    if (e.status === 403 || e.status === 404) return null
    throw e
  })
  if (rels) {
    console.log('• relation works.image → directus_files already exists — skipping')
    return
  }
  await api('POST', '/relations', {
    collection: 'works',
    field: 'image',
    related_collection: 'directus_files',
    schema: { on_delete: 'SET NULL' },
    meta: { sort_field: null },
  })
  console.log('✓ linked works.image → directus_files')
}

async function publicPolicyId() {
  // The public (unauthenticated) policy is the one not attached to any role.
  const policies = await api('GET', '/policies?fields=id,name,role&limit=-1')
  const pub = policies.find((p) => p.role === null)
  if (!pub) throw new Error('No public policy found (policy with role=null).')
  return pub.id
}

async function grantPublicRead(policy) {
  const wanted = [
    {
      collection: 'works',
      action: 'read',
      fields: ['id', 'image', 'status', 'sort', 'date_created'],
      permissions: { status: { _eq: 'published' } },
    },
    {
      collection: 'directus_files',
      action: 'read',
      fields: ['id', 'width', 'height', 'type'],
      // A file is public only while a published work references it. This avoids
      // exposing unrelated uploads, exports, or draft assets from Directus.
      permissions: {
        '$FOLLOW(works, image)': { status: { _eq: 'published' } },
      },
    },
  ]
  const existing = await api(
    'GET',
    `/permissions?filter[policy][_eq]=${policy}&fields=id,collection,action,fields,permissions&limit=-1`,
  ).catch(() => [])
  for (const perm of wanted) {
    const current = (existing ?? []).find(
      (e) => e.collection === perm.collection && e.action === perm.action,
    )
    if (current) {
      await api('PATCH', `/permissions/${current.id}`, perm)
      console.log(`✓ tightened existing public read on ${perm.collection}`)
      continue
    }
    await api('POST', '/permissions', { policy, ...perm })
    console.log(`✓ granted public read on ${perm.collection}`)
  }
}

async function main() {
  await login()
  await createCollection()
  await createRelation()
  const policy = await publicPolicyId()
  await grantPublicRead(policy)
  console.log('\nDone. Upload images to the "Works" collection in the Directus admin,')
  console.log('set status = Published, and the portfolio #works grid will pick them up.')
}

main().catch((e) => {
  console.error('\n✗ ' + e.message)
  if (e.payload) console.error(JSON.stringify(e.payload, null, 2))
  process.exit(1)
})
