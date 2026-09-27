import { useEffect, useState, type ReactNode } from 'react'
import { useCompanyConfigReady } from '@/lib/personalization'
import { LoadingScreen } from './LoadingScreen'

const MINIMUM_DISPLAY_MS = 350
const MAXIMUM_WAIT_MS = 2500
const EXIT_DURATION_MS = 400

function firstScreenImages() {
  return Array.from(document.querySelectorAll<HTMLImageElement>('#root img'))
    .filter((image) => {
      const rect = image.getBoundingClientRect()
      return rect.width > 0 && rect.height > 0 &&
        rect.bottom > 0 && rect.right > 0 &&
        rect.top < window.innerHeight && rect.left < window.innerWidth
    })
}

function waitForImage(image: HTMLImageElement, signal: AbortSignal) {
  return new Promise<void>((resolve) => {
    const finish = () => {
      image.removeEventListener('load', finish)
      image.removeEventListener('error', finish)
      signal.removeEventListener('abort', finish)
      resolve()
    }
    image.addEventListener('load', finish)
    image.addEventListener('error', finish)
    signal.addEventListener('abort', finish, { once: true })
    if (image.complete || signal.aborted) finish()
  })
}

export function SiteBoot({ children }: { children: ReactNode }) {
  const configReady = useCompanyConfigReady()
  const [fontsReady, setFontsReady] = useState(false)
  const [mediaProgress, setMediaProgress] = useState(0)
  const [minimumElapsed, setMinimumElapsed] = useState(false)
  const [deadlineElapsed, setDeadlineElapsed] = useState(false)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const controller = new AbortController()
    const { signal } = controller
    document.documentElement.classList.add('is-loading')
    document.getElementById('root')?.setAttribute('aria-busy', 'true')

    // The app has already mounted. Neither window.load, background widgets,
    // videos, nor media from unopened routes should prevent interaction.
    void (document.fonts?.ready ?? Promise.resolve()).then(() => {
      if (!signal.aborted) setFontsReady(true)
    })
    const frame = window.requestAnimationFrame(() => {
      const images = firstScreenImages()
      if (!images.length) {
        setMediaProgress(1)
        return
      }
      let ready = 0
      images.forEach((image) => {
        void waitForImage(image, signal).then(() => {
          if (!signal.aborted) setMediaProgress(++ready / images.length)
        })
      })
    })
    const minimumTimer = window.setTimeout(
      () => setMinimumElapsed(true), MINIMUM_DISPLAY_MS,
    )
    // Slow or stalled resources continue loading after the overlay closes.
    const deadlineTimer = window.setTimeout(() => {
      setDeadlineElapsed(true)
      controller.abort()
    }, MAXIMUM_WAIT_MS)

    return () => {
      controller.abort()
      window.cancelAnimationFrame(frame)
      window.clearTimeout(minimumTimer)
      window.clearTimeout(deadlineTimer)
      document.documentElement.classList.remove('is-loading')
      document.getElementById('root')?.removeAttribute('aria-busy')
    }
  }, [])

  const canExit = minimumElapsed &&
    (deadlineElapsed || (configReady && fontsReady && mediaProgress === 1))

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

  const progress = canExit ? 100 : Math.min(
    94, 10 + (fontsReady ? 20 : 0) + Math.round(54 * mediaProgress) + (configReady ? 10 : 0),
  )

  return (
    <>
      {children}
      {visible && <LoadingScreen progress={progress} exiting={canExit} />}
    </>
  )
}
