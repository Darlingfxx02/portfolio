import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { useCompanyConfigReady } from '@/lib/personalization'
import { prepareUsageData } from '@/components/UsageHeatmap/UsageHeatmap'
import {
  siteBootImageSources,
  siteBootVideoSources,
} from '@/data/siteBootMedia'
import { LoadingScreen } from './LoadingScreen'

const MINIMUM_DISPLAY_MS = 1100
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

function afterLayout() {
  return new Promise<void>((resolve) => {
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => resolve())
    })
  })
}

function isMediaReady(element: HTMLImageElement | HTMLVideoElement) {
  if (element instanceof HTMLImageElement) return element.complete
  return element.readyState >= HTMLMediaElement.HAVE_ENOUGH_DATA
}

function renderedMediaElements() {
  return Array.from(
    document.querySelectorAll<HTMLImageElement | HTMLVideoElement>(
      '#root img, #root video',
    ),
  )
}

function sourceKey(source: string) {
  return new URL(source, window.location.href).href
}

function siteMediaElements(
  renderedMedia: Array<HTMLImageElement | HTMLVideoElement>,
) {
  const elementsBySource = new Map(
    renderedMedia.map((element) => [
      sourceKey(element.currentSrc || element.src),
      element,
    ]),
  )

  siteBootImageSources.forEach((source) => {
    const key = sourceKey(source)
    if (elementsBySource.has(key)) return

    const image = new Image()
    image.loading = 'eager'
    image.src = source
    elementsBySource.set(key, image)
  })

  siteBootVideoSources.forEach((source) => {
    const key = sourceKey(source)
    if (elementsBySource.has(key)) return

    const video = document.createElement('video')
    video.preload = 'auto'
    video.muted = true
    video.src = source
    video.load()
    elementsBySource.set(key, video)
  })

  return [...elementsBySource.values()]
}

function waitForMediaElement(element: HTMLImageElement | HTMLVideoElement) {
  return new Promise<void>((resolve) => {
    let settled = false

    const cleanup = () => {
      element.removeEventListener('load', markReady)
      element.removeEventListener('canplaythrough', markReady)
      element.removeEventListener('error', markReady)
    }
    const finish = () => {
      if (settled) return
      settled = true
      cleanup()
      resolve()
    }
    const markReady = () => {
      if (
        element instanceof HTMLImageElement &&
        element.complete &&
        element.naturalWidth > 0
      ) {
        void element.decode().catch(() => undefined).then(finish)
        return
      }
      finish()
    }

    element.addEventListener('load', markReady)
    element.addEventListener('canplaythrough', markReady)
    element.addEventListener('error', markReady)

    // The resource may have completed between the DOM query and listener setup.
    if (isMediaReady(element)) markReady()
  })
}

async function waitForSiteMedia(onProgress: (progress: number) => void) {
  // Let the initial route finish mounting before merging its rendered media
  // with the static inventory for every other route.
  await afterLayout()

  const media = siteMediaElements(renderedMediaElements())
  if (!media.length) {
    onProgress(1)
    return
  }

  media.forEach((element) => {
    if (element instanceof HTMLImageElement) element.loading = 'eager'
  })

  let readyCount = 0
  onProgress(0)
  await Promise.all(
    media.map((element) =>
      waitForMediaElement(element).then(() => {
        readyCount += 1
        onProgress(readyCount / media.length)
      }),
    ),
  )
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
  const [mediaProgress, setMediaProgress] = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    let alive = true
    const mark = (key: keyof Readiness) => {
      if (alive) setReadiness((current) => ({ ...current, [key]: true }))
    }

    void prepareUsageData().then(() => mark('data'))
    void waitForDocument().then(() => mark('document'))
    void waitForFonts().then(() => mark('fonts'))
    void waitForSiteMedia((progress) => {
      if (alive) setMediaProgress(progress)
    }).then(() => mark('media'))

    const minimumTimer = window.setTimeout(
      () => setMinimumElapsed(true),
      MINIMUM_DISPLAY_MS,
    )
    document.documentElement.classList.add('is-loading')
    document.getElementById('root')?.setAttribute('aria-busy', 'true')

    return () => {
      alive = false
      window.clearTimeout(minimumTimer)
      document.documentElement.classList.remove('is-loading')
      document.getElementById('root')?.removeAttribute('aria-busy')
    }
  }, [])

  const allReady = configReady && Object.values(readiness).every(Boolean)
  const canExit = minimumElapsed && allReady

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
    value += Math.round(24 * mediaProgress)
    if (readiness.data) value += 20
    if (configReady) value += 10
    return Math.min(value, 94)
  }, [canExit, configReady, mediaProgress, readiness])

  return (
    <>
      {children}
      {visible && <LoadingScreen progress={progress} exiting={canExit} />}
    </>
  )
}
