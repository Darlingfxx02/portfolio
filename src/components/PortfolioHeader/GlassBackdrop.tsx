import { useEffect, useRef, type CSSProperties, type RefObject } from 'react'
import { GlassContent } from '@glass-sdk/liquid-glass'
import styles from './PortfolioHeader.module.css'

type MediaCopy = {
  source: HTMLVideoElement | HTMLCanvasElement
  canvas: HTMLCanvasElement
  poster: HTMLImageElement | null
  lastTime: number
}

/** An inert, viewport-aligned paint source for the fixed glass scene.
 * Only the small strip behind the header is painted. The SDK can refract this
 * explicit DOM layer in WebKit too, without filtering the scrolling document.
 */
export function GlassBackdrop({ sourceRef, gutter = 64 }: {
  sourceRef: RefObject<HTMLDivElement | null>
  gutter?: number
}) {
  const contentRef = useRef<HTMLDivElement>(null)
  const mirrorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const source = sourceRef.current
    const content = contentRef.current
    const mirror = mirrorRef.current
    if (!source || !content || !mirror) return

    let frame = 0
    let disposed = false
    let dirty = true
    let media: MediaCopy[] = []
    const copies = new Map<Element, HTMLElement>()
    const animated = new Set<Element>()

    const syncPosition = () => {
      const origin = source.getBoundingClientRect()
      const target = content.getBoundingClientRect()
      mirror.style.width = `${origin.width}px`
      mirror.style.transform = `translate3d(${origin.left - target.left}px, ${origin.top - target.top}px, 0)`
    }

    const rebuild = () => {
      const clone = source.cloneNode(true) as HTMLDivElement
      const originals = [source, ...source.querySelectorAll<HTMLElement>('*')]
      const duplicates = [clone, ...clone.querySelectorAll<HTMLElement>('*')]
      copies.clear()
      animated.clear()
      media = []
      originals.forEach((original, index) => {
        let duplicate = duplicates[index]
        duplicate.removeAttribute('id')
        duplicate.removeAttribute('autofocus')
        // Decorative copies must not join radio groups or submit form values.
        duplicate.removeAttribute('name')
        duplicate.removeAttribute('form')
        if (original instanceof HTMLVideoElement || original instanceof HTMLCanvasElement) {
          const canvas = document.createElement('canvas')
          canvas.className = duplicate.className
          canvas.style.cssText = duplicate.style.cssText
          // Canvas replaces native video, which WebKit doesn't reliably feed
          // into SVG filters. It samples the actual playing frame, not a poster.
          duplicate.replaceWith(canvas)
          duplicate = canvas
          const poster = original instanceof HTMLVideoElement && original.poster
            ? new Image() : null
          if (poster && original instanceof HTMLVideoElement) {
            poster.addEventListener('load', schedule, { once: true })
            poster.src = original.poster
          }
          media.push({ source: original, canvas, poster, lastTime: -1 })
        } else if (original instanceof HTMLIFrameElement || original instanceof HTMLScriptElement) {
          duplicate.replaceChildren()
          duplicate.remove()
        }
        copies.set(original, duplicate)
      })
      clone.inert = true
      mirror.replaceChildren(clone)
      dirty = false
    }

    const intersects = (rect: DOMRect, band: DOMRect) =>
      rect.right > band.left && rect.left < band.right &&
      rect.bottom > band.top && rect.top < band.bottom

    const paint = () => {
      frame = 0
      if (dirty) rebuild()
      syncPosition()
      const band = content.getBoundingClientRect()
      let live = false

      // Pause duplicate CSS animations and copy their current presentation.
      // This keeps a moving carousel in phase with the source page.
      for (const animation of source.getAnimations({ subtree: true })) {
        const target = (animation.effect as KeyframeEffect | null)?.target
        if (target instanceof Element && intersects(target.getBoundingClientRect(), band)) {
          animated.add(target)
          live ||= animation.playState === 'running'
        }
      }
      for (const original of animated) {
        const duplicate = copies.get(original)
        if (!duplicate || !original.isConnected) continue
        const computed = getComputedStyle(original)
        duplicate.style.transform = computed.transform
        duplicate.style.opacity = computed.opacity
        duplicate.style.filter = computed.filter
      }

      for (const item of media) {
        const rect = item.source.getBoundingClientRect()
        if (!intersects(rect, band) || !rect.width || !rect.height) continue
        const video = item.source instanceof HTMLVideoElement ? item.source : null
        const playingFrame = !!video && video.readyState >= 2
        const image = video && !playingFrame ? item.poster : item.source
        if (!image || (image instanceof HTMLImageElement && !image.naturalWidth)) continue
        live ||= !video || (playingFrame && !video.paused)
        const pixelRatio = Math.min(window.devicePixelRatio || 1, 2, 1536 / Math.max(rect.width, rect.height))
        const width = Math.max(1, Math.round(rect.width * pixelRatio))
        const height = Math.max(1, Math.round(rect.height * pixelRatio))
        const resized = item.canvas.width !== width || item.canvas.height !== height
        if (resized) {
          item.canvas.width = width
          item.canvas.height = height
        }
        const computed = getComputedStyle(item.source)
        item.canvas.style.display = computed.display
        item.canvas.style.width = computed.width
        item.canvas.style.height = computed.height
        const time = playingFrame ? video!.currentTime : -2
        if (video && !resized && item.lastTime === time) continue
        const context = item.canvas.getContext('2d')
        if (!context) continue
        const sourceWidth = image instanceof HTMLVideoElement ? image.videoWidth
          : image instanceof HTMLImageElement ? image.naturalWidth : image.width
        const sourceHeight = image instanceof HTMLVideoElement ? image.videoHeight
          : image instanceof HTMLImageElement ? image.naturalHeight : image.height
        if (!sourceWidth || !sourceHeight) continue
        const fit = computed.objectFit
        const scale = fit === 'cover'
          ? Math.max(width / sourceWidth, height / sourceHeight)
          : Math.min(width / sourceWidth, height / sourceHeight)
        const drawWidth = fit === 'fill' ? width : sourceWidth * scale
        const drawHeight = fit === 'fill' ? height : sourceHeight * scale
        context.clearRect(0, 0, width, height)
        context.drawImage(image, (width - drawWidth) / 2, (height - drawHeight) / 2, drawWidth, drawHeight)
        item.lastTime = time
      }
      if (live) schedule()
    }

    const schedule = () => {
      if (!disposed) frame ||= requestAnimationFrame(paint)
    }
    const observer = new MutationObserver((records) => {
      for (const record of records) {
        if (record.type !== 'attributes') {
          dirty = true
          continue
        }
        const original = record.target as HTMLElement
        const duplicate = copies.get(original)
        const name = record.attributeName
        if (!duplicate || !name || ['id', 'autofocus', 'name', 'form'].includes(name)) continue
        const value = original.getAttribute(name)
        if (value === null) duplicate.removeAttribute(name)
        else duplicate.setAttribute(name, value)
      }
      schedule()
    })
    observer.observe(source, { subtree: true, childList: true, attributes: true, characterData: true })
    const resizeObserver = new ResizeObserver(schedule)
    resizeObserver.observe(source)
    resizeObserver.observe(content)
    const onScroll = () => { syncPosition(); schedule() }
    window.addEventListener('scroll', onScroll, { capture: true, passive: true })
    window.addEventListener('resize', schedule, { passive: true })
    source.addEventListener('load', schedule, true)
    const mediaEvents = ['playing', 'loadeddata', 'seeked', 'timeupdate', 'pause']
    for (const event of mediaEvents) source.addEventListener(event, schedule, true)
    schedule()
    return () => {
      disposed = true
      cancelAnimationFrame(frame)
      observer.disconnect()
      resizeObserver.disconnect()
      window.removeEventListener('scroll', onScroll, true)
      window.removeEventListener('resize', schedule)
      source.removeEventListener('load', schedule, true)
      for (const event of mediaEvents) source.removeEventListener(event, schedule, true)
      mirror.replaceChildren()
    }
  }, [sourceRef])

  return (
    <GlassContent ref={contentRef} className={styles.backdrop} aria-hidden="true"
      style={{ '--glass-gutter': `${gutter}px` } as CSSProperties}>
      <div className={styles.opticalInput}>
        <div ref={mirrorRef} className={styles.mirror} inert />
      </div>
    </GlassContent>
  )
}
