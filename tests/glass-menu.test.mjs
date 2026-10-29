import assert from 'node:assert/strict'
import { test } from 'node:test'
import { menuKinematics, planMenu, sampleMenu } from '../src/lib/glass/liquidMenuFlow.ts'
import { createLiquidMenu } from '../src/lib/glass/liquidMenu.ts'

const layout = { size: 50, width: 200, height: 102, gap: 10 }
const plan = planMenu(layout)
const area = (body) => Math.abs(body.shape.outline.reduce((sum, [x, y], i, points) => {
  const next = points[(i + 1) % points.length]
  return sum + x * next[1] - next[0] * y
}, 0)) / 2

test('the actual source stretches while the glass is still one connected body', () => {
  const start = sampleMenu(plan, 0).pose
  const pull = sampleMenu(plan, 0.45).pose
  const end = sampleMenu(plan, 1).pose
  assert.equal(start.bodies.length, 1)
  assert.equal(pull.bodies.length, 1, 'Do not paint a second source behind a static button')
  assert.ok(pull.head.height > start.head.height + 10)
  assert.ok(pull.head.width < start.head.width - 4)
  assert.deepEqual(end.head, start.head)
  assert.deepEqual(end.bodies[0].shape, start.bodies[0].shape, 'The resting button must return to the same optical field')
  assert.equal(end.bodies.length, 2)
  assert.deepEqual(menuKinematics(layout, 1).panel, { left: 0, top: 60, width: 200, height: 102 })
})

test('separating the neck changes field ownership without a volume jump', () => {
  const before = sampleMenu(plan, plan.split - 0.0001).pose
  const after = sampleMenu(plan, plan.split + 0.0001).pose
  assert.equal(before.bodies.length, 1)
  assert.equal(after.bodies.length, 2)
  const a = before.bodies.reduce((sum, body) => sum + area(body), 0)
  const b = after.bodies.reduce((sum, body) => sum + area(body), 0)
  assert.ok(Math.abs(a - b) / a < 0.01, 'No disappearing source or duplicated panel at detachment')
  for (let i = 0; i <= 200; i++) {
    for (const body of sampleMenu(plan, i / 200).pose.bodies) {
      assert.equal(body.shape.outline.length, 96)
      assert.ok(body.shape.outline.flat().every(Number.isFinite))
      assert.ok(body.width > 0 && body.height > 0)
    }
  }
})

test('the panel keeps its full contour while easing into the open position', () => {
  for (const size of [44, 50]) {
    const menu = planMenu({ ...layout, size })
    const finalArea = area(sampleMenu(menu, 1).pose.bodies[1])
    for (let i = 840; i <= 1000; i++) {
      const panel = sampleMenu(menu, i / 1000).pose.bodies[1]
      assert.ok(area(panel) > finalArea * 0.98,
        `The ${size}px menu folds inward near completion at progress ${i / 1000}`)
    }
  }
})

test('the dock menu opens above its button and returns to the same resting circle', () => {
  const above = planMenu({ ...layout, size: 44, placement: 'above' })
  const initial = sampleMenu(above, 0).pose
  const opened = sampleMenu(above, 1).pose
  assert.deepEqual(opened.panel, { left: 0, top: -112, width: 200, height: 102 })
  assert.deepEqual(opened.head, initial.head)
  assert.deepEqual(opened.bodies[0].shape, initial.bodies[0].shape)
  assert.ok(opened.bodies[1].top + opened.bodies[1].height < 0)
  for (let i = 0; i <= 100; i++) {
    const state = sampleMenu(above, i / 100).pose
    for (const body of state.bodies) {
      assert.ok(body.width > 0 && body.height > 0)
      assert.ok(body.shape.outline.flat().every(Number.isFinite))
    }
  }
})

function element(attributes = {}) {
  const attrs = new Map(Object.entries(attributes)), styles = new Map()
  return {
    style: { clipPath: '', getPropertyValue: (key) => styles.get(key) ?? '',
      setProperty: (key, value) => styles.set(key, value) },
    getAttribute: (key) => attrs.get(key) ?? null,
    setAttribute: (key, value) => attrs.set(key, value),
  }
}

function fixture(menuLayout = layout) {
  const scene = Object.assign(element({ 'data-menu-open': 'false',
    'data-menu-placement': menuLayout.placement ?? 'below' }), {
    offsetWidth: menuLayout.size, getBoundingClientRect: () => ({ left: 28, top: 14 }),
  })
  const trigger = element(), tint = element(), blueTint = element(), back = element()
  const events = []
  const menu = Object.assign(element(), { dispatchEvent: (event) => events.push(event.type) })
  const panel = { offsetWidth: menuLayout.width, offsetHeight: menuLayout.height }
  const motion = createLiquidMenu({ scene: () => scene, trigger: () => trigger, menu: () => menu,
    panel: () => panel, tint: () => tint, blueTint: () => blueTint, back: () => back })
  let ready = true, now = 0
  const body = motion.attach(0, () => ready), popup = motion.attach(1, () => ready)
  const arrow = motion.attach(2, () => ready)
  const tick = () => { now += 16; body.frame(now); popup.frame(now); arrow.frame(now) }
  const advance = (milliseconds) => { for (let i = 0; i < milliseconds; i += 16) tick() }
  tick()
  events.length = 0
  return { scene, trigger, tint, blueTint, panel, events, body, popup, arrow, back, tick, advance,
    open: (value) => scene.setAttribute('data-menu-open', String(value)),
    showBack: (value) => scene.setAttribute('data-back-visible', String(value)),
    ready: (value) => { ready = value },
    get backProgress() { return Number(scene.getAttribute('data-liquid-back-progress')) },
    get progress() { return Number(scene.getAttribute('data-liquid-menu-progress')) } }
}

test('optics, colored fill and icon share the same moving source on every frame', () => {
  const f = fixture()
  f.open(true)
  let stretched = false, split = false
  for (let i = 0; i < 100; i++) {
    f.tick()
    const d = f.tint.getAttribute('d')
    assert.equal(f.scene.style.clipPath, `path("${d}")`)
    const { head } = sampleMenu(plan, f.progress).pose
    for (const [attr, expected] of Object.entries({ x: head.left, y: head.top,
      width: head.width, height: head.height, rx: head.width / 2 })) {
      assert.ok(Math.abs(Number(f.blueTint.getAttribute(attr)) - expected) < 0.01,
        `Blue tint must follow the moving head: ${attr}`)
    }
    if (f.progress > 0.25 && f.progress < 0.6) {
      stretched = true
      assert.ok(Number(f.trigger.style.getPropertyValue('--icon-scale')) < 0.99)
      assert.equal(f.popup.opacity(), 0, 'Only the joined field owns the glass before splitting')
    }
    if (f.progress > 0.8) { split = true; assert.equal(f.popup.opacity(), 1) }
  }
  assert.ok(stretched && split)
  assert.equal(f.progress, 1)
})

test('blue tint stays within the button when menus open above or below it', () => {
  for (const [size, placement] of [[50, 'below'], [44, 'above']]) {
    const f = fixture({ ...layout, size, placement })
    f.open(true)
    f.advance(1800)
    const blue = Object.fromEntries(['x', 'y', 'width', 'height', 'rx'].map((key) =>
      [key, Number(f.blueTint.getAttribute(key))]))
    assert.deepEqual(blue, { x: 0, y: 0, width: size, height: size, rx: size / 2 })
    const popup = f.popup.geometry()
    assert.ok(popup)
    assert.ok(placement === 'above'
      ? popup.top + popup.height <= 14 - layout.gap
      : popup.top >= 14 + size + layout.gap,
    'The menu must remain outside the blue tint bounds')
  }
})

test('a reversal keeps its current pose, then restores one resting button', () => {
  const f = fixture()
  f.open(true)
  f.advance(128)
  const before = f.progress
  assert.ok(before > 0.2 && before < 0.8)
  f.open(false)
  f.tick()
  assert.ok(Math.abs(f.progress - before) < 0.08, 'Reversing must not restart the animation')
  f.advance(1800)
  assert.equal(f.progress, 0)
  assert.equal(f.popup.opacity(), 0)
  assert.equal(f.trigger.style.getPropertyValue('--icon-scale'), '1')
  assert.equal(f.events.filter((event) => event === 'glass:exited').length, 1)
})

test('cold material maps hold the entire pose together, then motion resumes', () => {
  const f = fixture()
  f.ready(false)
  f.open(true)
  const d = f.tint.getAttribute('d')
  f.advance(150)
  assert.equal(f.progress, 0)
  assert.equal(f.tint.getAttribute('d'), d)
  assert.equal(f.body.pending(), true)
  f.ready(true)
  f.advance(1800)
  assert.equal(f.progress, 1)
  assert.equal(f.body.pending(), false)
})

test('a temporarily unmeasured panel retains its last valid field', () => {
  const f = fixture()
  const d = f.tint.getAttribute('d')
  f.panel.offsetHeight = 0
  f.open(true)
  f.advance(80)
  assert.equal(f.progress, 0)
  assert.equal(f.tint.getAttribute('d'), d)
  assert.doesNotThrow(() => f.popup.geometry())
  f.panel.offsetHeight = 102
  f.advance(1800)
  assert.equal(f.progress, 1)
})

test('the case arrow splits sideways into a matching circle at desktop and mobile sizes', () => {
  for (const size of [44, 50]) {
    const side = planMenu({ size, width: size, height: size, radius: size / 2, gap: 10, placement: 'right' })
    const start = sampleMenu(side, 0).pose
    const middle = sampleMenu(side, 0.45).pose
    const end = sampleMenu(side, 1).pose
    assert.equal(middle.bodies.length, 1)
    assert.ok(middle.head.width > size + 8, 'The language button gives way horizontally')
    assert.deepEqual(end.panel, { left: size + 10, top: 0, width: size, height: size })
    assert.deepEqual(end.bodies[0].shape, start.bodies[0].shape)
    const circleArea = Math.PI * (size / 2) ** 2
    assert.ok(Math.abs(area(end.bodies[1]) - circleArea) / circleArea < 0.005)
    assert.ok(Math.abs(area(end.bodies[1]) - area(end.bodies[0])) < 1)
    const before = sampleMenu(side, side.split - 0.0001).pose.bodies.reduce((sum, b) => sum + area(b), 0)
    const after = sampleMenu(side, side.split + 0.0001).pose.bodies.reduce((sum, b) => sum + area(b), 0)
    assert.ok(Math.abs(before - after) / before < 0.01)
  }
})

test('case entry, menu use and return share one source without duplicated glass', () => {
  const f = fixture()
  f.showBack(true)
  let joined = false
  for (let i = 0; i < 110; i++) {
    f.tick()
    assert.equal(f.scene.style.clipPath, `path("${f.tint.getAttribute('d')}")`)
    assert.equal(f.popup.opacity(), 0)
    if (f.backProgress > 0.2 && f.backProgress < 0.5) {
      joined = true
      assert.equal(f.arrow.opacity(), 0)
    }
  }
  assert.ok(joined)
  assert.equal(f.backProgress, 1)
  assert.equal(f.arrow.opacity(), 1)
  assert.equal(f.back.style.getPropertyValue('pointer-events'), 'auto')
  f.open(true)
  f.advance(1800)
  assert.equal(f.progress, 1)
  assert.equal(f.arrow.opacity(), 1, 'The arrow remains beside the language dropdown')
  assert.equal(f.popup.opacity(), 1)
  assert.equal(f.tint.getAttribute('d').split('M').length - 1, 3)
  assert.equal(Number(f.blueTint.getAttribute('width')), 50)
  f.open(false)
  f.showBack(false)
  f.advance(2400)
  assert.equal(f.progress, 0)
  assert.equal(f.backProgress, 0)
  assert.equal(f.arrow.opacity(), 0)
  assert.equal(f.back.style.getPropertyValue('visibility'), 'hidden')
  assert.equal(f.tint.getAttribute('d').split('M').length - 1, 1)
})

test('rapid case exit reverses the current arrow pose and cold maps keep all layers together', () => {
  const f = fixture()
  f.ready(false)
  f.showBack(true)
  f.advance(150)
  assert.equal(f.backProgress, 0)
  f.ready(true)
  f.advance(128)
  const before = f.backProgress
  assert.ok(before > 0.2 && before < 0.8)
  f.showBack(false)
  f.tick()
  assert.ok(Math.abs(f.backProgress - before) < 0.08)
  f.advance(1800)
  assert.equal(f.backProgress, 0)
  assert.equal(f.arrow.opacity(), 0)
})
