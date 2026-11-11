export type BackdropReads = {
  rect: (element: Element) => DOMRect
  style: (element: Element) => CSSStyleDeclaration
  animations: (element: Element) => Animation[]
}
type Paint = (reads: BackdropReads) => () => void
type FrameView = Pick<Window, 'requestAnimationFrame' | 'cancelAnimationFrame' | 'getComputedStyle'>

/** All mirrors read the real page before any mirror writes to the document.
 * A source shared by the menu, tabs and theme control is measured only once.
 * Caches last exactly one frame, so scrolling and animation remain live. */
export function createBackdropFrameQueue(view: FrameView) {
  const pending = new Set<Paint>()
  let frame = 0
  const flush = () => {
    frame = 0
    const jobs = [...pending]
    pending.clear()
    const rects = new Map<Element, DOMRect>()
    const styles = new Map<Element, CSSStyleDeclaration>()
    const animations = new Map<Element, Animation[]>()
    const reads: BackdropReads = {
      rect(element) {
        let value = rects.get(element)
        if (!value) rects.set(element, value = element.getBoundingClientRect())
        return value
      },
      style(element) {
        let value = styles.get(element)
        if (!value) styles.set(element, value = view.getComputedStyle(element))
        return value
      },
      animations(element) {
        let value = animations.get(element)
        if (!value) animations.set(element, value = element.getAnimations({ subtree: true }))
        return value
      },
    }
    const writes: (() => void)[] = []
    const attempt = (run: () => void) => {
      try { run() } catch (error) { queueMicrotask(() => { throw error }) }
    }
    for (const job of jobs) attempt(() => { writes.push(job(reads)) })
    for (const write of writes) attempt(write)
  }
  return {
    schedule(paint: Paint) {
      pending.add(paint)
      frame ||= view.requestAnimationFrame(flush)
    },
    cancel(paint: Paint) {
      pending.delete(paint)
      if (!pending.size && frame) {
        view.cancelAnimationFrame(frame)
        frame = 0
      }
    },
  }
}

const queues = new WeakMap<Window, ReturnType<typeof createBackdropFrameQueue>>()
export function backdropFrameQueue(view: Window) {
  let queue = queues.get(view)
  if (!queue) queues.set(view, queue = createBackdropFrameQueue(view))
  return queue
}
