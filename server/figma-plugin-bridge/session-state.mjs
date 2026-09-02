import { createHash, randomBytes, timingSafeEqual } from 'node:crypto'

export const PLUGIN_COOKIE_NAME = '__Host-dresser_plugin'
export const PLUGIN_CLIENT_HEADER = 'figma-desktop-v1'
export const SESSION_TTL_MS = 10 * 60 * 1000
export const MAX_SESSIONS = 4

function digest(value) {
  return createHash('sha256').update(value).digest()
}

export function sessionCookie(value, maxAge = Math.floor(SESSION_TTL_MS / 1000)) {
  return `${PLUGIN_COOKIE_NAME}=${value}; Path=/; HttpOnly; Secure; SameSite=None; Max-Age=${maxAge}`
}

export function expiredSessionCookie() {
  return sessionCookie('', 0)
}

export function readSessionCookie(header) {
  if (typeof header !== 'string') return null
  const matches = header.split(';').map((part) => part.trim()).filter((part) => part.startsWith(`${PLUGIN_COOKIE_NAME}=`))
  if (matches.length !== 1) return null
  const value = matches[0].slice(PLUGIN_COOKIE_NAME.length + 1)
  return /^[A-Za-z0-9_-]{43}$/.test(value) ? value : null
}

export class PluginSessionState {
  #sessions = []
  #now

  constructor({ now = () => Date.now() } = {}) {
    this.#now = now
  }

  issue() {
    this.clear()
    const value = randomBytes(32).toString('base64url')
    this.#sessions.push({ hash: digest(value), expiresAt: this.#now() + SESSION_TTL_MS })
    return value
  }

  validate(value) {
    this.prune()
    if (!value) return false
    const candidate = digest(value)
    return this.#sessions.some(({ hash }) => hash.length === candidate.length && timingSafeEqual(hash, candidate))
  }

  prune() {
    const now = this.#now()
    this.#sessions = this.#sessions.filter(({ expiresAt }) => expiresAt > now).slice(-MAX_SESSIONS)
  }

  clear() {
    this.#sessions = []
  }

  diagnostics() {
    this.prune()
    return { count: this.#sessions.length, entries: this.#sessions.map(({ hash, expiresAt }) => ({ hash: hash.toString('hex'), expiresAt })) }
  }
}
