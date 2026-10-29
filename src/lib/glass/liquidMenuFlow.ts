import { smoothUnion, type ShapePoint } from '@glass-sdk/liquid-glass/core'
import type { LensWaypoint } from '@glass-sdk/liquid-glass/dom'
import { mix, smooth, type FlowBox } from './liquidFlow.ts'

export type MenuLayout = {
  size: number; width: number; height: number; gap: number
  placement?: 'below' | 'above' | 'left'
  radius?: number
}
export type MenuBody = FlowBox & { shape: LensWaypoint }
export type MenuPose = {
  progress: number
  joined: boolean
  bodies: MenuBody[]
  head: FlowBox
  panel: FlowBox
  pull: number
}
export type MenuPlan = { layout: MenuLayout; stops: MenuPose[]; split: number }

const POINTS = 96
const flipBox = <T extends FlowBox>(box: T, size: number): T => ({
  ...box, top: size - box.top - box.height,
})
const turnBox = <T extends FlowBox>(box: T, size: number): T => ({
  ...box, left: size - box.top - box.height, top: box.left,
  width: box.height, height: box.width,
})

/** The head itself gives way to the mass being drawn from its lower edge. */
export function menuKinematics(layout: MenuLayout, progress: number): {
  head: FlowBox; panel: FlowBox; pull: number; neck: number
} {
  if (layout.placement === 'left') {
    const state = menuKinematics({ ...layout, width: layout.height, height: layout.width, placement: 'below' }, progress)
    return { ...state, head: turnBox(state.head, layout.size), panel: turnBox(state.panel, layout.size) }
  }
  const p = Math.max(0, Math.min(1, progress))
  const { size, width, height, gap } = layout
  const pull = p <= 0.02 || p >= 0.84 ? 0 : Math.sin(Math.PI * smooth(0.02, 0.84, p)) ** 1.3
  const press = smooth(0, 0.09, p) * (1 - smooth(0.09, 0.23, p))
  const headWidth = size * (1 + 0.05 * press - 0.12 * pull)
  const head: FlowBox = { left: (size - headWidth) / 2, top: pull ? -2 * pull : 0,
    width: headWidth, height: size * (1 - 0.04 * press + 0.28 * pull) }
  const panelWidth = mix(size * 0.66, width, smooth(0.08, 0.8, p))
  const panelHeight = mix(size * 0.58, height, smooth(0.03, 0.9, p))
  const cx = mix(size / 2, width / 2, smooth(0.12, 0.84, p))
  const cy = mix(size * 0.68, size + gap + height / 2, smooth(0.03, 0.88, p))
  const panel: FlowBox = { left: cx - panelWidth / 2, top: cy - panelHeight / 2,
    width: panelWidth, height: panelHeight }
  const above = layout.placement === 'above'
  return { head: above ? flipBox(head, size) : head,
    panel: above ? flipBox(panel, size) : panel,
    pull, neck: 18 * (1 - smooth(0.45, 0.9, p)) }
}

function resample(points: ShapePoint[]): ShapePoint[] {
  let start = 0
  // A horizontal top edge has no unique highest point: tracing noise can
  // choose either end of it on adjacent stops. Interpolating those different
  // phases folds the whole panel into itself. The upper-left support point
  // stays on the same rounded corner as the top edge becomes horizontal.
  points.forEach((point, index) => {
    if (point[0] + point[1] < points[start][0] + points[start][1]) start = index
  })
  const ordered = [...points.slice(start), ...points.slice(0, start)]
  const lengths = [0]
  ordered.forEach((point, i) => {
    const next = ordered[(i + 1) % ordered.length]
    lengths.push(lengths[i] + Math.hypot(next[0] - point[0], next[1] - point[1]))
  })
  let edge = 0
  return Array.from({ length: POINTS }, (_, index): ShapePoint => {
    const distance = lengths.at(-1)! * index / POINTS
    while (lengths[edge + 1] < distance) edge++
    const a = ordered[edge], b = ordered[(edge + 1) % ordered.length]
    const t = (distance - lengths[edge]) / (lengths[edge + 1] - lengths[edge] || 1)
    return [mix(a[0], b[0], t), mix(a[1], b[1], t)]
  })
}

function body(points: ShapePoint[], resting = false): MenuBody {
  const outline = resample(points)
  const left = Math.min(...outline.map(([x]) => x)), top = Math.min(...outline.map(([, y]) => y))
  const width = Math.max(...outline.map(([x]) => x)) - left
  const height = Math.max(...outline.map(([, y]) => y)) - top
  return { left, top, width, height, shape: { width, height, radius: 0, dpr: 1, resting,
    outline: outline.map(([x, y]) => [x - left, y - top]) } }
}

function pose(layout: MenuLayout, p: number): MenuPose {
  const { head, panel, pull, neck } = menuKinematics(layout, p)
  const shapes = [{ x: head.left, y: head.top, width: head.width, height: head.height, radius: head.width / 2 }]
  if (p > 0) shapes.push({ x: panel.left, y: panel.top, width: panel.width, height: panel.height,
    radius: mix(Math.min(panel.width, panel.height) / 2, layout.radius ?? 24, smooth(0.1, 0.85, p)) })
  const loops = smoothUnion(shapes, p ? neck : 0, 0.8, 110)
  loops.sort((a, b) => Math.min(...a.map(([, y]) => y)) - Math.min(...b.map(([, y]) => y)))
  return { progress: p, joined: loops.length === 1, bodies: loops.map((loop) => body(loop, p === 0 || p === 1)),
    head, panel, pull }
}

/** Prepare the shared field once, including the instant its neck separates. */
export function planMenu(layout: MenuLayout): MenuPlan {
  const downward = { ...layout, placement: 'below' as const,
    ...(layout.placement === 'left' ? { width: layout.height, height: layout.width } : {}) }
  let low = 0.5, high = 1
  for (let i = 0; i < 12; i++) {
    const p = (low + high) / 2
    if (pose(downward, p).joined) low = p
    else high = p
  }
  const split = (low + high) / 2
  let stops = [...new Set([...Array.from({ length: 33 }, (_, i) => i / 32), low, high])]
    .sort((a, b) => a - b).map((p) => pose(downward, p))
  // The head is physically back at rest here. Reuse its exact resting field
  // rather than letting the panel's changing tracing grid move circle pixels.
  const restingHead = stops[0].bodies[0]
  for (const stop of stops) {
    if (!stop.joined && stop.progress >= 0.84) stop.bodies[0] = restingHead
  }
  // Reflect the prepared field without changing head/panel ownership or the
  // phase of corresponding contour points during interpolation.
  if (layout.placement === 'above') {
    stops = stops.map((stop) => ({ ...stop,
      head: flipBox(stop.head, layout.size), panel: flipBox(stop.panel, layout.size),
      bodies: stop.bodies.map((item) => ({ ...flipBox(item, layout.size),
        shape: { ...item.shape, outline: item.shape.outline!
          .map(([x, y]): ShapePoint => [x, item.height - y]).reverse() },
      })),
    }))
  }
  if (layout.placement === 'left') {
    stops = stops.map((stop) => ({ ...stop,
      head: turnBox(stop.head, layout.size), panel: turnBox(stop.panel, layout.size),
      bodies: stop.bodies.map((item) => ({ ...turnBox(item, layout.size),
        shape: { ...item.shape, width: item.height, height: item.width,
          outline: item.shape.outline!.map(([x, y]): ShapePoint => [item.height - y, x]) },
      })),
    }))
  }
  return { layout, split, stops }
}

export function sampleMenu(plan: MenuPlan, progress: number) {
  const p = Math.max(0, Math.min(1, progress))
  const next = plan.stops.findIndex((stop) => stop.progress >= p)
  const a = plan.stops[Math.max(0, next - 1)], b = plan.stops[next < 0 ? plan.stops.length - 1 : next]
  // Do not crossfade ownership of two bodies. Their contours coincide at the
  // split; one union field hands over to the two separate fields in one frame.
  if (a.joined !== b.joined) {
    const chosen = p < plan.split ? a : b
    return { pose: chosen, a: chosen, b: chosen, mix: 0 }
  }
  const t = a === b ? 0 : (p - a.progress) / (b.progress - a.progress)
  const bodies = a.bodies.map((first, index): MenuBody => {
    const second = b.bodies[index]
    const points = first.shape.outline!.map(([x, y], i): ShapePoint => [
      mix(first.left + x, second.left + second.shape.outline![i][0], t),
      mix(first.top + y, second.top + second.shape.outline![i][1], t),
    ])
    const left = mix(first.left, second.left, t), top = mix(first.top, second.top, t)
    const width = mix(first.width, second.width, t), height = mix(first.height, second.height, t)
    return { left, top, width, height, shape: { width, height, radius: 0,
      outline: points.map(([x, y]) => [x - left, y - top]) } }
  })
  const { head, panel, pull } = menuKinematics(plan.layout, p)
  return { pose: { progress: p, joined: a.joined, bodies, head, panel, pull }, a, b, mix: t }
}

export function menuBodyPath(body: MenuBody) {
  return body.shape.outline!.map(([x, y], i) =>
    `${i ? 'L' : 'M'}${(body.left + x).toFixed(3)} ${(body.top + y).toFixed(3)}`).join('') + 'Z'
}
