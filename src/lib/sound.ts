// Tiny synthesized UI sound — no audio asset, generated via Web Audio.
// Recreates the "hover" sine-ping from the "Minimal" patch (Raphael Salaja,
// kosta.fyi): a sine + short attack/decay/sustain/release envelope.

type Patch = {
  type: OscillatorType
  frequency: number
  envelope: { attack?: number; decay: number; sustain?: number; release?: number }
  gain: number
}

const HOVER: Patch = {
  type: 'sine',
  frequency: 1300,
  envelope: { attack: 0, decay: 0.01, sustain: 0, release: 0.004 },
  gain: 0.04,
}

const CLICK: Patch = {
  type: 'sine',
  frequency: 800,
  envelope: { attack: 0, decay: 0.015, sustain: 0, release: 0.005 },
  gain: 0.1,
}

let ctx: AudioContext | null = null
let lastTick = 0
let lastClick = 0

function getCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null
  if (!ctx) {
    const AC =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    if (!AC) return null
    ctx = new AC()
  }
  if (ctx.state === 'suspended') void ctx.resume()
  return ctx
}

// AudioContext can only start after a user gesture — unlock on first interaction.
if (typeof window !== 'undefined') {
  const unlock = () => getCtx()
  window.addEventListener('pointerdown', unlock, { once: true })
  window.addEventListener('keydown', unlock, { once: true })
}

const reduceMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

// ADSR envelope, ported verbatim from the patch engine.
function play(c: AudioContext, p: Patch) {
  const now = c.currentTime
  const osc = c.createOscillator()
  osc.type = p.type
  osc.frequency.setValueAtTime(p.frequency, now)

  const n = p.gain
  const o = p.envelope.attack ?? 0
  const i = p.envelope.decay
  const s = p.envelope.sustain ?? 0
  const l = p.envelope.release ?? 0
  const sustainLevel = Math.max(s * n, 1e-4)
  const u = i / 3

  const g = c.createGain()
  g.gain.setValueAtTime(1e-4, now)
  if (o > 0) g.gain.linearRampToValueAtTime(n, now + o)
  else g.gain.setValueAtTime(n, now)
  if (s > 0) {
    g.gain.setTargetAtTime(sustainLevel, now + o, u)
    if (l > 0) g.gain.setTargetAtTime(1e-4, now + o + i, l / 3)
  } else {
    g.gain.setTargetAtTime(1e-4, now + o, u)
  }

  osc.connect(g)
  g.connect(c.destination)
  osc.start(now)
  osc.stop(now + o + i + l + 0.1)
}

/** Soft hover ping. Throttled, skipped under reduced-motion. */
export function tick() {
  if (reduceMotion()) return
  const c = getCtx()
  if (!c || c.state !== 'running') return
  const now = c.currentTime
  if (now - lastTick < 0.05) return
  lastTick = now
  play(c, HOVER)
}

/** Click ping — same palette, a touch lower + louder. */
export function click() {
  if (reduceMotion()) return
  const c = getCtx()
  if (!c || c.state !== 'running') return
  const now = c.currentTime
  if (now - lastClick < 0.03) return
  lastClick = now
  play(c, CLICK)
}

let inited = false
const SFX_SELECTOR = 'a[href], button, [role="button"], [data-sfx]'

/** Wire global hover + click sounds for every interactive element. Call once. */
export function initSfx() {
  if (inited || typeof document === 'undefined') return
  inited = true
  let last: Element | null = null
  document.addEventListener('pointerover', (e) => {
    const el = (e.target as Element | null)?.closest(SFX_SELECTOR) ?? null
    if (el && el !== last) {
      last = el
      tick()
    } else if (!el) {
      last = null
    }
  })
  document.addEventListener('click', (e) => {
    if ((e.target as Element | null)?.closest(SFX_SELECTOR)) click()
  })
}
