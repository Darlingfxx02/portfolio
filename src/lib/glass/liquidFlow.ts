export interface FlowBox {
  left: number
  top: number
  width: number
  height: number
}

export const mix = (a: number, b: number, t: number) => a + (b - a) * t
export const smooth = (a: number, b: number, t: number) => {
  const p = Math.max(0, Math.min(1, (t - a) / (b - a)))
  return p * p * (3 - 2 * p)
}

/** Slow at the ends, with a pronounced but continuous acceleration at center. */
export const easeSelectionProgress = (progress: number) =>
  smooth(0, 1, smooth(0, 1, progress))

/** Move one capsule between tab bounds, preserving its height and round ends. */
export function interpolateBox(from: FlowBox, to: FlowBox, progress: number): FlowBox {
  const p = Math.max(0, Math.min(1, progress))
  return {
    left: mix(from.left, to.left, p),
    top: mix(from.top, to.top, p),
    width: mix(from.width, to.width, p),
    height: mix(from.height, to.height, p),
  }
}
