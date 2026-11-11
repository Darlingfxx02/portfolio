import { useEffect, useRef, type CSSProperties, type RefObject } from 'react'
import { GlassContent } from '@glass-sdk/liquid-glass'
import { backdropFrameQueue, type BackdropReads } from '@/lib/glass/backdropFrame'
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

    const frames = backdropFrameQueue(window)
    let disposed = false
    let dirty = true
    let media: MediaCopy[] = []
    const copies = new Map<Element, HTMLElement>()
    const textCopies = new Map<Node, Node>()
    const animated = new Set<Element>()

    const rebuild = () => {
      const clone = source.cloneNode(true) as HTMLDivElement
      const originals = [source, ...source.querySelectorAll<HTMLElement>('*')]
      const duplicates = [clone, ...clone.querySelectorAll<HTMLElement>('*')]
      copies.clear()
      textCopies.clear()
      animated.clear()
      media = []
      originals.forEach((original, index) => {
        let duplicate = duplicates[index]
        original.childNodes.forEach((node, childIndex) => {
          if (node.nodeType === Node.TEXT_NODE) textCopies.set(node, duplicate.childNodes[childIndex])
        })
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
      dirty = false
      return clone
    }

    const intersects = (rect: DOMRect, band: DOMRect) =>
      rect.right > band.left && rect.left < band.right &&
      rect.bottom > band.top && rect.top < band.bottom

    const paint = (reads: BackdropReads) => {
      // Build off-document. Inserting it waits until every glass scene has
      // finished reading, as do all style and canvas writes below.
      const clone = dirty ? rebuild() : null
      const origin = reads.rect(source)
      const band = reads.rect(content)
      const mirrorWidth = `${origin.width}px`
      const transform = `translate3d(${origin.left - band.left}px, ${origin.top - band.top}px, 0)`
      const writes: (() => void)[] = []
      let live = false

      // Pause duplicate CSS animations and copy their current presentation.
      // This keeps a moving carousel in phase with the source page.
      for (const animation of reads.animations(source)) {
        const target = (animation.effect as KeyframeEffect | null)?.target
        if (target instanceof Element && intersects(reads.rect(target), band)) {
          animated.add(target)
          live ||= animation.playState === 'running'
        }
      }
      for (const original of animated) {
        const duplicate = copies.get(original)
        if (!duplicate || !original.isConnected) { animated.delete(original); continue }
        if (!intersects(reads.rect(original), band)) continue
        const computed = reads.style(original)
        const pose = { transform: computed.transform, opacity: computed.opacity, filter: computed.filter }
        writes.push(() => {
          for (const key of ['transform', 'opacity', 'filter'] as const) {
            if (duplicate.style[key] !== pose[key]) duplicate.style[key] = pose[key]
          }
        })
      }

      for (const item of media) {
        const rect = reads.rect(item.source)
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
        const computed = reads.style(item.source)
        const display = computed.display, cssWidth = computed.width, cssHeight = computed.height
        writes.push(() => {
          if (item.canvas.style.display !== display) item.canvas.style.display = display
          if (item.canvas.style.width !== cssWidth) item.canvas.style.width = cssWidth
          if (item.canvas.style.height !== cssHeight) item.canvas.style.height = cssHeight
        })
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
        writes.push(() => {
          if (resized) {
            item.canvas.width = width
            item.canvas.height = height
          }
          context.clearRect(0, 0, width, height)
          context.drawImage(image, (width - drawWidth) / 2, (height - drawHeight) / 2, drawWidth, drawHeight)
          item.lastTime = time
        })
      }
      return () => {
        if (disposed) return
        if (clone) mirror.replaceChildren(clone)
        if (mirror.style.width !== mirrorWidth) mirror.style.width = mirrorWidth
        if (mirror.style.transform !== transform) mirror.style.transform = transform
        for (const write of writes) write()
        if (live) schedule()
      }
    }

    const schedule = () => {
      if (!disposed) frames.schedule(paint)
    }
    const observer = new MutationObserver((records) => {
      for (const record of records) {
        if (record.type === 'characterData') {
          const duplicate = textCopies.get(record.target)
          if (duplicate) duplicate.nodeValue = record.target.nodeValue
          else dirty = true
          continue
        }
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
    window.addEventListener('scroll', schedule, { capture: true, passive: true })
    window.addEventListener('resize', schedule, { passive: true })
    source.addEventListener('load', schedule, true)
    const mediaEvents = ['playing', 'loadeddata', 'seeked', 'timeupdate', 'pause']
    for (const event of mediaEvents) source.addEventListener(event, schedule, true)
    schedule()
    return () => {
      disposed = true
      frames.cancel(paint)
      observer.disconnect()
      resizeObserver.disconnect()
      window.removeEventListener('scroll', schedule, true)
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
