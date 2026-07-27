type AnalyticsValue = string | number | boolean | null | undefined
type AnalyticsPayload = Record<string, AnalyticsValue>
type ConsentValue = 'granted' | 'denied'
type ClarityConsent = {
  ad_Storage: ConsentValue
  analytics_Storage: ConsentValue
}

type UmamiTracker = {
  track: (eventName: string, data?: AnalyticsPayload) => void
}

type ClarityTracker = {
  (command: 'consentv2', consent: ClarityConsent): void
  (command: 'event', eventName: string): void
  (command: 'set', key: string, value: string | string[]): void
}

declare global {
  interface Window {
    umami?: UmamiTracker
    clarity?: ClarityTracker
  }
}

const SAFE_TAG_KEYS = new Set([
  'case_id',
  'contact_target',
  'provider',
  'recipient',
  'route',
  'target',
  'utm_campaign_present',
  'utm_medium',
  'utm_source',
])

const analyticsEnv = {
  VITE_ANALYTICS_DEBUG: import.meta.env.VITE_ANALYTICS_DEBUG,
  VITE_ANALYTICS_DISABLED: import.meta.env.VITE_ANALYTICS_DISABLED,
  VITE_CLARITY_PROJECT_ID: import.meta.env.VITE_CLARITY_PROJECT_ID,
  VITE_UMAMI_DOMAINS: import.meta.env.VITE_UMAMI_DOMAINS,
  VITE_UMAMI_EXCLUDE_SEARCH: import.meta.env.VITE_UMAMI_EXCLUDE_SEARCH,
  VITE_UMAMI_HOST_URL: import.meta.env.VITE_UMAMI_HOST_URL,
  VITE_UMAMI_PERFORMANCE: import.meta.env.VITE_UMAMI_PERFORMANCE,
  VITE_UMAMI_RESPECT_DNT: import.meta.env.VITE_UMAMI_RESPECT_DNT,
  VITE_UMAMI_SRC: import.meta.env.VITE_UMAMI_SRC,
  VITE_UMAMI_TAG: import.meta.env.VITE_UMAMI_TAG,
  VITE_UMAMI_WEBSITE_ID: import.meta.env.VITE_UMAMI_WEBSITE_ID,
} as const

type AnalyticsEnvName = keyof typeof analyticsEnv
const ANALYTICS_CONSENT_KEY = 'darling-live:analytics-consent'

let initialized = false
let umamiConfigured = false
const pendingUmamiEvents: Array<{ eventName: string; data: AnalyticsPayload }> = []

function envValue(name: AnalyticsEnvName): string | undefined {
  return analyticsEnv[name]
}

function envFlag(name: AnalyticsEnvName, fallback = false): boolean {
  const value = envValue(name)
  if (value == null || value === '') return fallback
  return value === 'true' || value === '1'
}

function analyticsDisabled(): boolean {
  return envFlag('VITE_ANALYTICS_DISABLED')
}

function debugEnabled(): boolean {
  return envFlag('VITE_ANALYTICS_DEBUG')
}

function cleanValue(value: AnalyticsValue): string | number | boolean | null | undefined {
  if (typeof value !== 'string') return value
  return value.replace(/[^\w .:/#@+-]/g, '').slice(0, 500)
}

function param(name: string): string {
  if (typeof window === 'undefined') return ''
  return new URLSearchParams(window.location.search).get(name) || ''
}

function shortParam(name: string): string | undefined {
  const value = param(name).trim()
  if (!value) return undefined
  return value.replace(/[^\w-]/g, '').slice(0, 80) || undefined
}

function recipientState(): 'present' | 'none' {
  return param('to') ? 'present' : 'none'
}

function currentRoute(): string {
  if (typeof window === 'undefined') return 'server'
  const hash = window.location.hash || '#top'
  if (hash.startsWith('#case/')) return `case:${hash.slice('#case/'.length) || 'unknown'}`
  return hash.replace(/^#/, '') || 'top'
}

function defaultPayload(): AnalyticsPayload {
  return {
    route: currentRoute(),
    recipient: recipientState(),
    utm_source: shortParam('utm_source'),
    utm_medium: shortParam('utm_medium'),
    utm_campaign_present: param('utm_campaign') ? true : undefined,
  }
}

function loadScript(
  src: string,
  configure: (script: HTMLScriptElement) => void,
): HTMLScriptElement | null {
  const existing = Array.from(document.scripts).find((script) => script.getAttribute('src') === src)
  if (existing) return existing
  const script = document.createElement('script')
  script.async = true
  script.defer = true
  script.src = src
  configure(script)
  document.head.appendChild(script)
  return script
}

function flushUmamiEvents() {
  if (!window.umami) return
  for (const { eventName, data } of pendingUmamiEvents.splice(0)) {
    window.umami.track(eventName, data)
  }
}

function trackUmami(eventName: string, data: AnalyticsPayload) {
  if (window.umami) {
    window.umami.track(eventName, data)
    return
  }
  if (umamiConfigured && pendingUmamiEvents.length < 20) {
    pendingUmamiEvents.push({ eventName, data })
  }
}

function initUmami() {
  const src = envValue('VITE_UMAMI_SRC')
  const websiteId = envValue('VITE_UMAMI_WEBSITE_ID')
  if (!src || !websiteId) return

  umamiConfigured = true
  const script = loadScript(src, (script) => {
    script.setAttribute('data-website-id', websiteId)
    script.setAttribute(
      'data-exclude-search',
      String(envFlag('VITE_UMAMI_EXCLUDE_SEARCH', true)),
    )
    script.setAttribute(
      'data-do-not-track',
      String(envFlag('VITE_UMAMI_RESPECT_DNT', true)),
    )

    const hostUrl = envValue('VITE_UMAMI_HOST_URL')
    const domains = envValue('VITE_UMAMI_DOMAINS')
    const tag = envValue('VITE_UMAMI_TAG')
    if (hostUrl) script.setAttribute('data-host-url', hostUrl)
    if (domains) script.setAttribute('data-domains', domains)
    if (tag) script.setAttribute('data-tag', tag)
    if (envFlag('VITE_UMAMI_PERFORMANCE')) script.setAttribute('data-performance', 'true')
  })
  script?.addEventListener('load', flushUmamiEvents, { once: true })
}

function initClarity() {
  const projectId = envValue('VITE_CLARITY_PROJECT_ID')
  if (!projectId) return

  if (!window.clarity) {
    const queuedTracker = ((...args: unknown[]) => {
      ;((queuedTracker as unknown as { q?: unknown[] }).q ||= []).push(args)
    }) as ClarityTracker
    window.clarity = queuedTracker
  }

  applyClarityConsent(readAnalyticsConsent() === true)
  loadScript(`https://www.clarity.ms/tag/${projectId}`, () => {})
  setClarityTags(defaultPayload())
}

function readAnalyticsConsent(): boolean | null {
  try {
    const value = window.localStorage.getItem(ANALYTICS_CONSENT_KEY)
    if (value === 'granted') return true
    if (value === 'denied') return false
  } catch {
    // Consent still defaults to denied when storage is unavailable.
  }
  return null
}

function applyClarityConsent(granted: boolean) {
  window.clarity?.('consentv2', {
    ad_Storage: 'denied',
    analytics_Storage: granted ? 'granted' : 'denied',
  })
}

export function getAnalyticsConsent(): boolean | null {
  if (typeof window === 'undefined') return null
  return readAnalyticsConsent()
}

export function setAnalyticsConsent(granted: boolean) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(
      ANALYTICS_CONSENT_KEY,
      granted ? 'granted' : 'denied',
    )
  } catch {
    // Apply the in-memory decision even if the browser blocks storage.
  }
  applyClarityConsent(granted)
}

function setClarityTags(payload: AnalyticsPayload) {
  if (!window.clarity) return
  for (const [key, rawValue] of Object.entries(payload)) {
    if (!SAFE_TAG_KEYS.has(key) || rawValue == null) continue
    const value = String(cleanValue(rawValue))
    if (value) window.clarity('set', key, value)
  }
}

export function initAnalytics() {
  if (initialized || typeof document === 'undefined' || analyticsDisabled()) return
  initialized = true
  initUmami()
  initClarity()
}

export function trackEvent(eventName: string, payload: AnalyticsPayload = {}) {
  if (typeof window === 'undefined' || analyticsDisabled()) return

  const data = Object.fromEntries(
    Object.entries({ ...defaultPayload(), ...payload }).map(([key, value]) => [
      key,
      cleanValue(value),
    ]),
  ) as AnalyticsPayload

  if (debugEnabled()) console.info('[analytics]', eventName, data)
  trackUmami(eventName, data)
  setClarityTags(data)
  window.clarity?.('event', eventName)
}
