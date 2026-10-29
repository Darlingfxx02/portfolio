import assert from 'node:assert/strict'
import { test } from 'node:test'
import { easeSelectionProgress, interpolateBox } from '../src/lib/glass/liquidFlow.ts'
import { createLiquidSelection } from '../src/lib/glass/liquidSelection.ts'

const first = { left: 0, top: 0, width: 79, height: 40 }
const next = { left: 81, top: 0, width: 130, height: 40 }
const near = (a, b, tolerance = 0.001) => assert.ok(Math.abs(a - b) < tolerance, `${a} != ${b}`)

function fixture() {
  const attributes = new Map()
  const reduced = { matches: false, addEventListener() {}, removeEventListener() {} }
  const tabs = [first, next, { left: 213, top: 0, width: 78, height: 40 }, { left: 293, top: 0, width: 80, height: 40 }]
    .map((box, index) => ({ box: { ...box }, id: ['tab-home', 'tab-explorations', 'tab-work', 'tab-about'][index],
      selected: index === 0,
      getAttribute() { return String(this.selected) },
      getBoundingClientRect() { return { left: 200 + this.box.left, top: 20 + this.box.top, width: this.box.width, height: this.box.height } },
    }))
  const element = {
    style: { left: '', top: '', width: '', height: '' },
    getAttribute: (name) => attributes.get(name) ?? null,
    setAttribute: (name, value) => attributes.set(name, value),
    removeAttribute: (name) => attributes.delete(name),
    ownerDocument: { defaultView: { matchMedia: () => reduced,
      getComputedStyle: () => ({ width: '373px', height: '40px' }) } },
    parentElement: { querySelectorAll: () => tabs,
      getBoundingClientRect: () => ({ left: 200, top: 20, width: 373, height: 40 }) },
  }
  let preview = null
  const animator = createLiquidSelection(element, (value) => { preview = value })
  let clock = 0
  const advance = (milliseconds) => {
    const end = clock + milliseconds
    while (clock < end) { clock += 16; animator.frame(clock) }
  }
  const select = (index) => tabs.forEach((tab, i) => { tab.selected = i === index })
  const gesture = (index, p) => {
    element.setAttribute('data-liquid-target', tabs[index].id)
    element.setAttribute('data-liquid-progress', String(p))
  }
  advance(16)
  return { animator, element, attributes, tabs, reduced, advance, select, gesture,
    get preview() { return preview } }
}

test('one capsule interpolates exactly between adjacent and distant tab bounds', () => {
  for (const [a, b] of [[first, next], [next, first], [first, { ...next, left: 290 }]]) {
    assert.deepEqual(interpolateBox(a, b, 0), a)
    assert.deepEqual(interpolateBox(a, b, 1), b)
    assert.deepEqual(interpolateBox(a, b, -1), a)
    assert.deepEqual(interpolateBox(a, b, 2), b)
    for (let i = 0; i <= 100; i++) {
      const box = interpolateBox(a, b, i / 100)
      near(box.height, 40)
      assert.ok(box.width >= Math.min(a.width, b.width) && box.width <= Math.max(a.width, b.width))
      assert.ok(box.left >= Math.min(a.left, b.left) && box.left <= Math.max(a.left, b.left))
    }
  }
})

test('selection motion accelerates through the middle and slows at both ends without overshoot', () => {
  near(easeSelectionProgress(-1), 0)
  near(easeSelectionProgress(2), 1)
  near(easeSelectionProgress(0.5), 0.5)
  const start = easeSelectionProgress(0.25)
  const middle = easeSelectionProgress(0.75) - start
  const end = 1 - easeSelectionProgress(0.75)
  assert.ok(middle > 5 * (start + end), 'Most movement happens through the middle of the gesture')
  near(start, end)
  for (let i = 1; i <= 100; i++) {
    assert.ok(easeSelectionProgress(i / 100) >= easeSelectionProgress((i - 1) / 100))
  }
})

test('scroll previews use the nonlinear curve in both directions', () => {
  for (const p of [0.25, 0.5, 0.75]) {
    const f = fixture()
    f.gesture(1, p)
    f.advance(400)
    near(f.preview.position, easeSelectionProgress(p) * 0.94)
    f.gesture(1, 0)
    f.advance(320)
    f.select(1)
    f.advance(320)
    f.gesture(0, p)
    f.advance(400)
    near(f.preview.position, easeSelectionProgress(p) * 0.94)
    near(parseFloat(f.element.style.left), next.left * (1 - f.preview.position))
  }
})

test('edge progress moves the existing capsule while the current tab is still selected', () => {
  const f = fixture()
  f.gesture(1, 0.5)
  f.advance(320)
  assert.equal(f.tabs[0].selected, true)
  assert.equal(f.tabs[1].selected, false)
  assert.ok(parseFloat(f.element.style.left) > first.left)
  assert.ok(parseFloat(f.element.style.left) < next.left)
  near(parseFloat(f.element.style.height), 40)
  assert.ok(parseFloat(f.element.style.width) < next.width)
  assert.equal(f.animator.geometry(), undefined, 'The SDK should draw its native capsule')
  assert.deepEqual(f.animator.waypoints(), [], 'No split shapes are prepared')
})

test('clicks start sliding immediately, without waiting for morph maps', () => {
  const f = fixture()
  f.select(1)
  f.advance(16)
  assert.equal(f.attributes.get('data-liquid-phase'), 'travel')
  assert.ok(parseFloat(f.element.style.left) > 0)
  assert.equal(f.animator.pending(), false)
  f.advance(320)
  assert.equal(f.attributes.get('data-liquid-phase'), 'idle')
  near(parseFloat(f.element.style.left), next.left)
  near(parseFloat(f.element.style.width), next.width)
})

test('cancelling a partial scroll slides the capsule back to the current tab', () => {
  const f = fixture()
  f.gesture(1, 0.5)
  f.advance(320)
  const p = Number(f.attributes.get('data-liquid-position'))
  assert.ok(p > 0.46 && p < 0.471)
  f.gesture(1, 0)
  f.advance(16)
  assert.equal(f.attributes.get('data-liquid-phase'), 'return')
  assert.ok(Number(f.attributes.get('data-liquid-position')) < p)
  f.advance(320)
  assert.equal(f.attributes.get('data-liquid-phase'), 'idle')
  near(parseFloat(f.element.style.left), first.left)
  near(parseFloat(f.element.style.width), first.width)
})

test('committing a scroll continues the existing slide without restarting', () => {
  const f = fixture()
  f.gesture(1, 0.6)
  f.advance(320)
  const before = Number(f.attributes.get('data-liquid-position'))
  f.select(1)
  f.gesture(1, 0)
  f.advance(16)
  assert.ok(Number(f.attributes.get('data-liquid-position')) >= before)
  f.advance(800)
  near(parseFloat(f.element.style.left), next.left)
  assert.equal(f.attributes.get('data-liquid-phase'), 'idle')
})

test('the committed tail decelerates into the destination instead of restarting its acceleration', () => {
  const f = fixture()
  f.gesture(1, 0.75)
  f.advance(400)
  f.select(1)
  f.gesture(1, 0)
  const positions = [parseFloat(f.element.style.left)]
  for (let frame = 0; frame < 7; frame++) {
    f.advance(16)
    positions.push(parseFloat(f.element.style.left))
  }
  const distances = positions.slice(1).map((p, i) => p - positions[i])
  for (let i = 1; i < distances.length; i++) {
    assert.ok(distances[i] >= 0 && distances[i] <= distances[i - 1] + 0.001)
  }
  near(positions.at(-1), next.left)
})

test('settlement can use the rendered capsule position on either side of the midpoint', () => {
  const f = fixture()
  f.gesture(1, 0.9)
  f.advance(16)
  assert.ok(f.preview.position < 0.5, 'A distant input target has not moved the visible capsule halfway yet')
  assert.equal(f.preview.source, 'tab-home')
  assert.equal(f.preview.target, 'tab-explorations')
  f.gesture(1, 0.5)
  f.advance(320)
  assert.ok(f.preview.position < 0.5, 'The original tab is closer')
  f.gesture(1, 0.6)
  f.advance(320)
  assert.ok(f.preview.position > 0.5, 'The next tab is closer')
  near(parseFloat(f.element.style.left), next.left * f.preview.position)
  f.select(1)
  f.gesture(1, 0)
  f.advance(320)
  assert.equal(f.preview, null, 'Completed selection cannot settle a later gesture')
})

test('rapid retargeting continues from the current capsule position', () => {
  const f = fixture()
  f.select(1)
  f.advance(96)
  const before = parseFloat(f.element.style.left)
  f.select(3)
  f.advance(16)
  const after = parseFloat(f.element.style.left)
  assert.ok(after > before && after - before < 5, 'Retarget without snapping to either tab')
  near(parseFloat(f.element.style.height), 40)
  f.advance(320)
  near(parseFloat(f.element.style.left), f.tabs[3].box.left)
  assert.equal(f.attributes.get('data-liquid-phase'), 'idle')
})

test('a reversed edge gesture returns before sliding in the opposite direction', () => {
  const f = fixture()
  f.gesture(1, 0.55)
  f.advance(320)
  f.gesture(3, 0.5)
  f.advance(16)
  assert.equal(f.attributes.get('data-liquid-phase'), 'return')
  f.advance(650)
  assert.equal(f.attributes.get('data-liquid-phase'), 'preview')
  f.gesture(3, 0)
  f.advance(320)
  near(parseFloat(f.element.style.left), first.left)
})

test('reduced motion and a layout change settle immediately on the selected tab', () => {
  const f = fixture()
  f.reduced.matches = true
  f.select(1)
  f.advance(16)
  near(parseFloat(f.element.style.left), next.left)
  assert.equal(f.animator.geometry(), undefined)
  f.reduced.matches = false
  f.select(3)
  f.advance(200)
  f.tabs[3].box.width = 95
  f.advance(16)
  near(parseFloat(f.element.style.width), 95)
  assert.equal(f.attributes.get('data-liquid-phase'), 'idle')
  f.animator.dispose()
})
