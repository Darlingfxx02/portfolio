import assert from 'node:assert/strict'
import { test } from 'node:test'
import { createBackdropFrameQueue } from '../src/lib/glass/backdropFrame.ts'

function fixture() {
  let next = 0
  const callbacks = new Map()
  const counts = { rect: 0, style: 0, animations: 0 }
  const source = {
    x: 0,
    getBoundingClientRect() { counts.rect++; return { left: this.x } },
    getAnimations() { counts.animations++; return [] },
  }
  const queue = createBackdropFrameQueue({
    requestAnimationFrame(callback) { callbacks.set(++next, callback); return next },
    cancelAnimationFrame(id) { callbacks.delete(id) },
    getComputedStyle() { counts.style++; return { opacity: '1' } },
  })
  return { source, queue, counts, callbacks, tick() {
    const batch = [...callbacks.values()]
    callbacks.clear()
    batch.forEach(callback => callback())
  } }
}

test('all glass mirrors measure before painting and share source reads within a frame', () => {
  const f = fixture(), order = [], positions = []
  for (const name of ['tabs', 'language', 'theme']) {
    f.queue.schedule(reads => {
      order.push(`read ${name}`)
      positions.push(reads.rect(f.source).left)
      reads.style(f.source)
      reads.animations(f.source)
      return () => { order.push(`write ${name}`); f.source.x++ }
    })
  }
  assert.equal(f.callbacks.size, 1)
  f.tick()
  assert.deepEqual(order, ['read tabs', 'read language', 'read theme', 'write tabs', 'write language', 'write theme'])
  assert.deepEqual(positions, [0, 0, 0])
  assert.deepEqual(f.counts, { rect: 1, style: 1, animations: 1 })
})

test('bursts coalesce to one paint but the next frame measures fresh geometry', () => {
  const f = fixture(), positions = []
  const paint = reads => {
    const x = reads.rect(f.source).left
    return () => positions.push(x)
  }
  for (let i = 0; i < 20; i++) { f.source.x = i; f.queue.schedule(paint) }
  f.tick()
  f.source.x = 100
  f.queue.schedule(paint)
  f.tick()
  assert.deepEqual(positions, [19, 100])
  assert.equal(f.counts.rect, 2)
})

test('unmount cancels its pending paint without cancelling the remaining scene', () => {
  const f = fixture(), painted = []
  const removed = () => () => painted.push('removed')
  const active = () => () => painted.push('active')
  f.queue.schedule(removed)
  f.queue.schedule(active)
  f.queue.cancel(removed)
  f.tick()
  assert.deepEqual(painted, ['active'])
  f.queue.schedule(active)
  f.queue.cancel(active)
  assert.equal(f.callbacks.size, 0)
})

test('live media requests one subsequent frame and stops when it becomes still', () => {
  const f = fixture()
  let paints = 0
  const paint = () => () => {
    if (++paints < 3) { f.queue.schedule(paint); f.queue.schedule(paint) }
  }
  f.queue.schedule(paint)
  f.tick()
  assert.equal(paints, 1)
  assert.equal(f.callbacks.size, 1)
  f.tick()
  f.tick()
  assert.equal(paints, 3)
  assert.equal(f.callbacks.size, 0)
})
