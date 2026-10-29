import type { GeometryAnimator, LensWaypoint } from '@glass-sdk/liquid-glass/dom'
import { easeSelectionProgress, interpolateBox, mix, smooth, type FlowBox } from './liquidFlow.ts'

const TRAVEL_MS = 300
const RETURN_MS = 220
const noShapes: LensWaypoint[] = []

export type SelectionPreview = { source: string; target: string; position: number }

type Transfer = {
  from: FlowBox
  to: FlowBox
  target: HTMLElement
  kind: 'preview' | 'travel' | 'return'
  position: number
  start: number
  elapsed: number
  duration: number
  continuation: boolean
}

/** Move the selected capsule with edge-scroll progress before the page changes.
 * The SDK samples its live box after this frame, keeping the glass aligned. */
export function createLiquidSelection(
  element: HTMLElement,
  onPreview?: (preview: SelectionPreview | null) => void,
): GeometryAnimator {
  const track = element.parentElement!
  const view = element.ownerDocument.defaultView!
  const reduced = view.matchMedia('(prefers-reduced-motion: reduce)')
  const original = { left: element.style.left, top: element.style.top, width: element.style.width, height: element.style.height }
  let selected: HTMLElement | null = null
  let transfer: Transfer | null = null
  let current: FlowBox | undefined
  let layoutKey = ''
  let lastTime = 0

  const setData = (name: string, value: string) => {
    if (element.getAttribute(name) !== value) element.setAttribute(name, value)
  }
  const onReduced = () => setData('data-liquid-reduced', String(reduced.matches))
  reduced.addEventListener('change', onReduced)

  function measure() {
    const rect = track.getBoundingClientRect()
    const computed = view.getComputedStyle(track)
    const sx = rect.width / (parseFloat(computed.width) || rect.width || 1)
    const sy = rect.height / (parseFloat(computed.height) || rect.height || 1)
    const tabs = [...track.querySelectorAll<HTMLElement>('[role="tab"]')]
    const boxes = new Map(tabs.map((tab) => {
      const box = tab.getBoundingClientRect()
      return [tab, { left: (box.left - rect.left) / sx, top: (box.top - rect.top) / sy,
        width: box.width / sx, height: box.height / sy }] as const
    }))
    const key = JSON.stringify([...boxes.values()].map((box) => Object.values(box).map((n) => Math.round(n * 10))))
    return { rect, sx, sy, boxes, key, tabs }
  }

  function write(box: FlowBox) {
    for (const key of ['left', 'top', 'width', 'height'] as const) {
      const value = `${box[key].toFixed(4)}px`
      if (element.style[key] !== value) element.style[key] = value
    }
    current = box
  }

  function rest(target: HTMLElement, box: FlowBox) {
    selected = target
    transfer = null
    write(box)
    setData('data-liquid-phase', 'idle')
    setData('data-liquid-position', '1')
    onPreview?.(null)
  }

  function start(from: FlowBox, target: HTMLElement, box: FlowBox, kind: Transfer['kind']) {
    transfer = { from: { ...from }, to: { ...box }, target, kind, position: 0, start: 0,
      elapsed: 0, duration: TRAVEL_MS, continuation: false }
  }

  return {
    frame(now) {
      const layout = measure()
      const active = layout.tabs.find((tab) => tab.getAttribute('aria-selected') === 'true')
      const box = active && layout.boxes.get(active)
      if (!active || !box || !box.width || !box.height) return false
      const dt = lastTime ? Math.min(40, Math.max(0, now - lastTime)) : 16
      lastTime = now
      if (!selected || reduced.matches || layout.key !== layoutKey) {
        layoutKey = layout.key
        rest(active, box)
        return false
      }

      if (active !== selected) {
        if (transfer?.target === active) {
          transfer.kind = 'travel'
          transfer.start = transfer.position
          transfer.elapsed = 0
          transfer.duration = Math.max(100, TRAVEL_MS * (1 - transfer.position))
          transfer.continuation = true
        } else start(current ?? layout.boxes.get(selected) ?? box, active, box, 'travel')
        selected = active
      }

      const wanted = element.getAttribute('data-liquid-target')
      const progress = Math.max(0, Math.min(1, Number(element.getAttribute('data-liquid-progress')) || 0))
      const pending = layout.tabs.find((tab) => tab.id === wanted && tab !== active)
      const pendingBox = pending && layout.boxes.get(pending)
      if (transfer?.kind !== 'travel') {
        if (pending && pendingBox && progress > 0) {
          if (!transfer) start(box, pending, pendingBox, 'preview')
          else if (transfer.target === pending) transfer.kind = 'preview'
          else if (transfer.kind !== 'return') {
            transfer.kind = 'return'
            transfer.start = transfer.position
            transfer.elapsed = 0
            transfer.duration = RETURN_MS
          }
        } else if (transfer && transfer.kind !== 'return') {
          transfer.kind = 'return'
          transfer.start = transfer.position
          transfer.elapsed = 0
          transfer.duration = RETURN_MS
        }
      }
      if (!transfer) return false

      const flow = transfer
      let moving = true
      if (flow.kind === 'preview') {
        const goal = easeSelectionProgress(progress) * 0.94
        const error = goal - flow.position
        flow.position = Math.abs(error) < 0.0005 ? goal : flow.position + error * (1 - Math.exp(-dt / 28))
        moving = Math.abs(goal - flow.position) > 0.0005
      } else {
        flow.elapsed += dt
        const t = Math.min(1, flow.elapsed / flow.duration)
        const eased = flow.kind === 'return' ? smooth(0, 1, t)
          : flow.continuation ? 1 - (1 - t) ** 3 : easeSelectionProgress(t)
        flow.position = mix(flow.start, flow.kind === 'return' ? 0 : 1, eased)
        if (t === 1) {
          rest(active, box)
          return !!pending && progress > 0
        }
      }

      write(interpolateBox(flow.from, flow.to, flow.position))
      onPreview?.(flow.kind === 'travel' ? null : {
        source: active.id, target: flow.target.id, position: flow.position,
      })
      setData('data-liquid-phase', flow.kind)
      setData('data-liquid-position', flow.position.toFixed(4))
      return moving
    },
    // The live DOM box is already a capsule. Let the SDK sample that box in
    // this same frame; no separate contour or precomputed morph is required.
    geometry: () => undefined,
    waypoints: () => noShapes,
    pending: () => false,
    opacity: () => 1,
    detachedSource: () => undefined,
    positioning: () => false,
    dispose() {
      onPreview?.(null)
      reduced.removeEventListener('change', onReduced)
      Object.assign(element.style, original)
      element.removeAttribute('data-liquid-phase')
      element.removeAttribute('data-liquid-position')
      element.removeAttribute('data-liquid-reduced')
    },
  }
}
