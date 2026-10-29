import { useLayoutEffect, useRef } from 'react'
import type { Lang, Loc } from '@/lib/i18n'
import styles from './PortfolioHeader.module.css'

const locales: Lang[] = ['en', 'ru']
const duration = 620
const easing = 'cubic-bezier(.22,1,.36,1)'

export function AnimatedTabLabel({ label, lang, order }: { label: Loc; lang: Lang; order: number }) {
  const frame = useRef<HTMLSpanElement>(null)
  const previous = useRef<Lang | null>(null)
  const animations = useRef<Animation[]>([])
  const widthMotion = useRef<Animation | null>(null)
  const targetWidth = useRef(0)

  useLayoutEffect(() => {
    const node = frame.current!
    const layer = node.querySelector<HTMLElement>(`[data-label-layer="${lang}"]`)!
    const width = layer.getBoundingClientRect().width
    const fromWidth = node.getBoundingClientRect().width
    const chars = [...node.querySelectorAll<HTMLElement>('[data-label-char]')]
    // Sample the visible frame before cancelling, so a quick reversal continues
    // from the current width and letter poses instead of jumping to an endpoint.
    const poses = chars.map(char => {
      const style = getComputedStyle(char)
      return { opacity: style.opacity, filter: style.filter, transform: style.transform }
    })
    const animate = previous.current !== null && previous.current !== lang
      && !window.matchMedia('(prefers-reduced-motion: reduce)').matches
    animations.current.forEach(animation => animation.cancel())
    animations.current = []
    widthMotion.current?.cancel()
    targetWidth.current = width
    node.style.width = `${width}px`

    chars.forEach((char, index) => {
      const incoming = char.parentElement?.dataset.labelLayer === lang
      const position = Number(char.dataset.labelChar)
      Object.assign(char.style, { opacity: incoming ? '1' : '0', filter: 'none', transform: 'none' })
      if (!animate || (!incoming && Number(poses[index].opacity) === 0)) return
      const from = incoming && Number(poses[index].opacity) === 0
        ? { opacity: '0', filter: 'blur(5px)', transform: 'translateY(4px)' }
        : poses[index]
      const to = incoming
        ? { opacity: '1', filter: 'blur(0px)', transform: 'translateY(0px)' }
        : { opacity: '0', filter: 'blur(4px)', transform: 'translateY(-3px)' }
      animations.current.push(char.animate([from, to], {
        duration: incoming ? 300 : 170,
        delay: incoming ? 110 + order * 18 + position * 14 : position * 7,
        easing,
        fill: 'backwards',
      }))
    })
    if (animate) {
      widthMotion.current = node.animate([
        { width: `${fromWidth}px` }, { width: `${width}px` },
      ], { duration, easing })
    }
    previous.current = lang
  }, [lang, order, label])

  useLayoutEffect(() => {
    const node = frame.current!
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    const resize = new ResizeObserver(() => {
      const active = node.querySelector<HTMLElement>(`[data-label-layer="${node.dataset.language}"]`)!
      const width = active.getBoundingClientRect().width
      if (Math.abs(width - targetWidth.current) < 0.1) return
      // Font loading and responsive font sizes must not leave stale fixed widths.
      widthMotion.current?.cancel()
      targetWidth.current = width
      node.style.width = `${width}px`
    })
    const onReduced = () => {
      if (!reduced.matches) return
      animations.current.forEach(animation => animation.cancel())
      widthMotion.current?.cancel()
    }
    node.querySelectorAll('[data-label-layer]').forEach(layer => resize.observe(layer))
    reduced.addEventListener('change', onReduced)
    return () => {
      resize.disconnect()
      reduced.removeEventListener('change', onReduced)
      animations.current.forEach(animation => animation.cancel())
      widthMotion.current?.cancel()
    }
  }, [])

  return (
    <span ref={frame} className={styles.labelFrame} data-language={lang} aria-hidden="true">
      {locales.map(locale => (
        <span key={locale} className={styles.labelLayer} data-label-layer={locale} lang={locale}>
          {Array.from(label[locale]).map((char, index) => (
            <span key={index} className={styles.labelChar} data-label-char={index}>{char}</span>
          ))}
        </span>
      ))}
    </span>
  )
}
