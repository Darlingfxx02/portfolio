import assert from 'node:assert/strict'
import { test } from 'node:test'

test('delegated click sound survives icon replacement and respects opt-out', async (t) => {
  const listeners = new Map()
  const tones = []
  const parameter = { setValueAtTime() {}, setTargetAtTime() {} }
  class FakeElement {
    constructor(tag, attributes = {}) { this.tag = tag; this.attributes = attributes }
    matches() { return this.tag === 'button' }
    closest() { return null } // The old icon is already detached by React.
    getAttribute(name) { return this.attributes[name] ?? null }
  }
  class FakeAudioContext {
    state = 'running'
    currentTime = 1
    destination = {}
    createOscillator() {
      let frequency
      return {
        frequency: { setValueAtTime(value) { frequency = value } },
        connect() {}, start() { tones.push(frequency) }, stop() {},
      }
    }
    createGain() { return { gain: parameter, connect() {} } }
  }
  for (const [name, value] of Object.entries({
    Element: FakeElement,
    window: {
      AudioContext: FakeAudioContext,
      addEventListener() {},
      matchMedia: () => ({ matches: false }),
    },
    document: { addEventListener: (name, listener) => listeners.set(name, listener) },
  })) {
    const descriptor = Object.getOwnPropertyDescriptor(globalThis, name)
    Object.defineProperty(globalThis, name, { value, configurable: true })
    t.after(() => {
      if (descriptor) Object.defineProperty(globalThis, name, descriptor)
      else delete globalThis[name]
    })
  }

  const { initSfx } = await import('../src/lib/sound.ts')
  initSfx()
  const handler = listeners.get('click')
  const removedIcon = new FakeElement('svg')
  handler({ target: removedIcon, composedPath: () => [removedIcon] })
  assert.deepEqual(tones, [], 'A non-interactive target stays silent')
  const optedOut = new FakeElement('button', { 'data-sfx-click': 'off' })
  handler({ target: removedIcon, composedPath: () => [removedIcon, optedOut] })
  assert.deepEqual(tones, [], 'Explicit sound opt-out is preserved')
  const button = new FakeElement('button')
  handler({ target: removedIcon, composedPath: () => [removedIcon, button] })
  assert.deepEqual(tones, [800], 'A detached SVG still plays exactly one click tone')
})
