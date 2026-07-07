/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Base URL of the Directus CMS. Defaults to the same-origin "/directus" proxy
   *  when unset (see works.ts); override to point at an absolute Directus. Baked
   *  at build time (Dockerfile ENV / optional Coolify build arg). */
  readonly VITE_DIRECTUS_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
