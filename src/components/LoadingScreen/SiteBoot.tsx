import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { useCompanyConfigReady } from '@/lib/personalization'
import { prepareUsageData } from '@/components/UsageHeatmap/UsageHeatmap'
import { LoadingScreen } from './LoadingScreen'

const MINIMUM_DISPLAY_MS = 1100
const SAFETY_TIMEOUT_MS = 7000
const EXIT_DURATION_MS = 720

type Readiness = {
  data: boolean
  document: boolean
  fonts: boolean
  media: boolean
}

function waitForDocument() {
  if (document.readyState === 'complete') return Promise.resolve()
  return new Promise<void>((resolve) => {
    window.addEventListener('load', () => resolve(), { once: true })
  })
}

function waitForFonts() {
  return document.fonts?.ready?.then(() => undefined) ?? Promise.resolve()
}

function waitForCriticalMedia() {
  return new Promise<void>((resolve) => {
    window.requestAnimationFrame(() => {
      const media = Array.from(
        document.querySelectorAll<HTMLImageElement | HTMLVideoElement>(
          'img:not([loading="lazy"]), video',
        ),
      )

      const pending = media.filter((element) => {
        if (element instanceof HTMLImageElement) return !element.complete
        return element.readyState < HTMLMediaElement.HAVE_CURRENT_DATA
      })

      if (!pending.length) {
        resolve()
        return
      }

      let remaining = pending.length
      const markReady = () => {
        remaining -= 1
        if (remaining <= 0) resolve()
      }

      pending.forEach((element) => {
        element.addEventListener('load', markReady, { once: true })
        element.addEventListener('loadeddata', markReady, { once: true })
        element.addEventListener('error', markReady, { once: true })
      })
    })
  })
}

export function SiteBoot({ children }: { children: ReactNode }) {
  const configReady = useCompanyConfigReady()
  const [readiness, setReadiness] = useState<Readiness>({
    data: false,
    document: false,
    fonts: false,
    media: false,
  })
  const [minimumElapsed, setMinimumElapsed] = useState(false)
  const [timedOut, setTimedOut] = useState(false)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    let alive = true
    const mark = (key: keyof Readiness) => {
      if (alive) setReadiness((current) => ({ ...current, [key]: true }))
    }

    void prepareUsageData().then(() => mark('data'))
    void waitForDocument().then(() => mark('document'))
    void waitForFonts().then(() => mark('fonts'))
    void waitForCriticalMedia().then(() => mark('media'))

    const minimumTimer = window.setTimeout(
      () => setMinimumElapsed(true),
      MINIMUM_DISPLAY_MS,
    )
    const safetyTimer = window.setTimeout(
      () => setTimedOut(true),
      SAFETY_TIMEOUT_MS,
    )

    document.documentElement.classList.add('is-loading')
    document.getElementById('root')?.setAttribute('aria-busy', 'true')

    return () => {
      alive = false
      window.clearTimeout(minimumTimer)
      window.clearTimeout(safetyTimer)
      document.documentElement.classList.remove('is-loading')
      document.getElementById('root')?.removeAttribute('aria-busy')
    }
  }, [])

  const allReady = configReady && Object.values(readiness).every(Boolean)
  const canExit = minimumElapsed && (allReady || timedOut)

  useEffect(() => {
    if (!canExit) return

    const timer = window.setTimeout(() => setVisible(false), EXIT_DURATION_MS)
    return () => window.clearTimeout(timer)
  }, [canExit])

  useEffect(() => {
    if (visible) return
    document.documentElement.classList.remove('is-loading')
    document.getElementById('root')?.removeAttribute('aria-busy')
  }, [visible])

  const progress = useMemo(() => {
    if (canExit) return 100
    let value = 6
    if (readiness.document) value += 18
    if (readiness.fonts) value += 16
    if (readiness.media) value += 24
    if (readiness.data) value += 20
    if (configReady) value += 10
    return Math.min(value, 94)
  }, [canExit, configReady, readiness])

  return (
    <>
      {children}
      {visible && <LoadingScreen progress={progress} exiting={canExit} />}
    </>
  )
}
