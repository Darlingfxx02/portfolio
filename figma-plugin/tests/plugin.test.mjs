import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import vm from 'node:vm'
import { test } from 'node:test'

const PNG = Uint8Array.from(Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=', 'base64'))
function frame(overrides = {}) { return { id: 'frame-1', type: 'FRAME', name: 'Checkout', width: 320, height: 640, removed: false, absoluteRenderBounds: { x: 100, y: 50, width: 320, height: 640 }, async exportAsync(options) { assert.equal(options.constraint.type, 'SCALE'); return PNG }, ...overrides } }
async function harness(selection) {
  const posted = []; const created = []; const listeners = {}; const page = { selection, appendChild(node) { node.parent = page } }
  const figma = { currentPage: page, ui: { postMessage(message) { posted.push(message) }, resize() {}, onmessage: null }, viewport: { scrollAndZoomIntoView() {} }, showUI(html, options) { assert.equal(html, '<bootstrap>'); assert.equal(options.width, 360); assert.equal(options.height, 640); assert.equal(options.themeColors, true) }, on(event, callback) { listeners[event] = callback }, createImage() { return { hash: 'image-hash' } }, createRectangle() { const node = { id: `rect-${created.length + 1}`, name: '', x: 0, y: 0, fills: [], resize(width, height) { this.width = width; this.height = height }, remove() { this.removed = true } }; created.push(node); return node } }
  const code = await readFile(new URL('../dist/main.js', import.meta.url), 'utf8')
  vm.runInNewContext(code, { figma, __html__: '<bootstrap>', Uint8Array, DataView, console })
  await new Promise((done) => setImmediate(done))
  return { figma, page, posted, created, listeners }
}

test('selected Frame exports bounded PNG and inserts one matching image beside unchanged source', async () => {
  const source = frame(); const state = await harness([source]); const ready = state.posted.find((message) => message.type === 'selection' && message.status === 'ready')
  assert.equal(ready.context.id, source.id); const snapshot = JSON.stringify(source)
  await state.figma.ui.onmessage({ type: 'insert', requestId: 'one', contextId: source.id, nonce: ready.context.nonce, width: 1, height: 1, bytes: PNG })
  assert.equal(state.created.length, 1); assert.equal(state.created[0].name, 'Dresser — Checkout'); assert.equal(state.created[0].x, 500); assert.equal(state.created[0].y, 50); assert.equal(state.page.selection.length, 1); assert.equal(state.page.selection[0], state.created[0]); assert.equal(JSON.stringify(source), snapshot)
  await state.figma.ui.onmessage({ type: 'insert', requestId: 'one', contextId: source.id, nonce: ready.context.nonce, width: 1, height: 1, bytes: PNG })
  assert.equal(state.created.length, 1); assert.match(state.posted.at(-1).message, /already inserted/)
})

test('empty and non-Frame selections are recoverable and create no node', async () => {
  const empty = await harness([]); assert.equal(empty.posted.at(-1).status, 'empty'); assert.equal(empty.created.length, 0)
  const nonFrame = await harness([{ type: 'RECTANGLE', id: 'x' }]); assert.equal(nonFrame.posted.at(-1).status, 'not-frame'); assert.equal(nonFrame.created.length, 0)
})

test('built plugin artifacts are self-contained and contain no bearer or storage fallback', async () => {
  const [bootstrap, ui, main] = await Promise.all([readFile(new URL('../dist/bootstrap.html', import.meta.url), 'utf8'), readFile(new URL('../dist/plugin.html', import.meta.url), 'utf8'), readFile(new URL('../dist/main.js', import.meta.url), 'utf8')])
  assert.match(bootstrap, /^<!doctype html><meta charset="utf-8"><script>location\.replace\('http:\/\/127\.0\.0\.1:4783\/plugin'\)<\/script>\n$/)
  assert.doesNotMatch(ui, /<script[^>]+src=|<link[^>]+href=/)
  for (const artifact of [bootstrap, ui, main]) assert.doesNotMatch(artifact, /Bearer\s|localStorage|sessionStorage|indexedDB|serviceWorker|runtime\.json/)
  assert.match(ui, /123456/)
})

test('icon resolver has typed Question fallback without catalog or glyph placeholders', async () => {
  const source = await readFile(new URL('../src/ui/icons.ts', import.meta.url), 'utf8')
  assert.match(source, /return resolved \?\? Question/); assert.match(source, /import \{[^}]*Question[^}]*\} from '@phosphor-icons\/react'/s); assert.doesNotMatch(source, /import \* as|emoji|unicode/i)
})
