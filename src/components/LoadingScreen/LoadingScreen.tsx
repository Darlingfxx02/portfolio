import { useEffect, useRef, useState } from 'react'
import styles from './LoadingScreen.module.css'

type LoadingScreenProps = {
  progress: number
  exiting: boolean
}

export function LoadingScreen({ progress, exiting }: LoadingScreenProps) {
  const [displayedProgress, setDisplayedProgress] = useState(0)
  const displayedRef = useRef(0)

  useEffect(() => {
    const from = displayedRef.current
    const startedAt = performance.now()
    let frame = 0

    const tick = (now: number) => {
      const elapsed = Math.min((now - startedAt) / 520, 1)
      const eased = 1 - Math.pow(1 - elapsed, 3)
      const next = from + (progress - from) * eased
      displayedRef.current = next
      setDisplayedProgress(next)
      if (elapsed < 1) frame = window.requestAnimationFrame(tick)
    }

    frame = window.requestAnimationFrame(tick)
    return () => window.cancelAnimationFrame(frame)
  }, [progress])

  const roundedProgress = Math.round(displayedProgress)

  return (
    <div
      className={`${styles.screen} ${exiting ? styles.exiting : ''}`}
      role="status"
      aria-live="polite"
      aria-label={`Сайт загружен на ${roundedProgress} процентов`}
    >
      <span className={styles.number} aria-hidden>
        {String(roundedProgress).padStart(2, '0')}
      </span>
    </div>
  )
}
