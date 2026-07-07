/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Base URL of the Directus CMS, e.g. https://cms.darlingdesign.pro. Empty → the
   *  Selected Work grid falls back to neutral placeholder tiles. Baked at build
   *  time (Coolify build arg → Dockerfile ENV). */
  readonly VITE_DIRECTUS_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
