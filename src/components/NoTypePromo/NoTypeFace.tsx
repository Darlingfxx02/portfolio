import { useEffect, useRef } from 'react'
import { PixelRecorder } from '@/lib/notype/pixels.js'
import styles from './NoTypePromo.module.css'

/** Runs No Type's original renderer; the whole promo card activates affection. */
export function NoTypeFace({ active }: { active: boolean }) {
  const canvas = useRef<HTMLCanvasElement>(null)
  const activeRef = useRef(active)
  const wake = useRef<(() => void) | null>(null)

  useEffect(() => {
    activeRef.current = active
    wake.current?.()
  }, [active])

  useEffect(() => {
    const node = canvas.current!
    const renderer = new PixelRecorder(node)
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    let frame = 0
    let last = 0
    let time = 0
    let visible = true
    let disposed = false

    const draw = (now: number) => {
      frame = 0
      if (disposed || document.hidden || !visible) return
      const delta = last ? Math.min((now - last) / 1000, 0.05) : 1 / 60
      last = now
      if (!reduced.matches) time += delta
      renderer.draw({
        state: 'idle', emotion: 'neutral', time,
        petting: activeRef.current,
        reducedMotion: reduced.matches,
        tint: [1, 1, 1], pitch: 2,
      }, delta)
      if (!reduced.matches) frame = requestAnimationFrame(draw)
    }

    const schedule = () => {
      if (!disposed && !frame && visible && !document.hidden) frame = requestAnimationFrame(draw)
    }
    const updateVisibility = () => {
      cancelAnimationFrame(frame)
      frame = 0
      last = 0
      schedule()
    }
    wake.current = schedule
    const intersection = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      updateVisibility()
    })
    const resize = new ResizeObserver(schedule)
    intersection.observe(node)
    resize.observe(node)
    document.addEventListener('visibilitychange', updateVisibility)
    reduced.addEventListener('change', schedule)
    node.addEventListener('webglcontextrestored', schedule)
    schedule()

    return () => {
      disposed = true
      wake.current = null
      cancelAnimationFrame(frame)
      intersection.disconnect()
      resize.disconnect()
      document.removeEventListener('visibilitychange', updateVisibility)
      reduced.removeEventListener('change', schedule)
      node.removeEventListener('webglcontextrestored', schedule)
      renderer.dispose()
    }
  }, [])

  return <canvas ref={canvas} className={styles.faceCanvas} width={57} height={40} aria-hidden="true" />
}
