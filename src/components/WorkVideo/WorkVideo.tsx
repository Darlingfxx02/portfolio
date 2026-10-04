import { useEffect, useRef } from 'react'
import styles from './WorkVideo.module.css'

export type WorkVideoSource = {
  webm: string
  mp4: string
  poster: string
}

export function WorkVideo({ source, paused = false }: { source: WorkVideoSource; paused?: boolean }) {
  const ref = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = ref.current
    if (!video) return

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let visible = false
    const syncPlayback = () => {
      if (visible && !paused && !document.hidden && !reducedMotion.matches) {
        void video.play().catch(() => {
          // Keep the poster when the browser blocks muted autoplay.
        })
      } else {
        video.pause()
      }
    }
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      syncPlayback()
    }, { threshold: 0.15 })
    observer.observe(video)
    document.addEventListener('visibilitychange', syncPlayback)
    reducedMotion.addEventListener('change', syncPlayback)

    return () => {
      observer.disconnect()
      document.removeEventListener('visibilitychange', syncPlayback)
      reducedMotion.removeEventListener('change', syncPlayback)
      video.pause()
    }
  }, [paused])

  return (
    <span className={styles.frame} aria-hidden>
      <video
        ref={ref}
        className={styles.video}
        width={1280}
        height={720}
        poster={source.poster}
        preload="none"
        muted
        loop
        playsInline
        disablePictureInPicture
        tabIndex={-1}
      >
        <source src={source.webm} type={'video/webm; codecs="vp9"'} />
        <source src={source.mp4} type="video/mp4" />
      </video>
    </span>
  )
}
