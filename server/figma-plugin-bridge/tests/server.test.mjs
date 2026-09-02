import assert from 'node:assert/strict'
import { createHash, randomUUID } from 'node:crypto'
import { access, mkdir, readFile, stat, unlink, writeFile } from 'node:fs/promises'
import { request as httpRequest } from 'node:http'
import { connect } from 'node:net'
import { test } from 'node:test'

import { BrowserSessionManager, DresserError, OUTPUT_ROOT } from '../../mockup-mcp/browser-session.mjs'
import { BRIDGE_ORIGIN, EXPECTED_HOST } from '../protocol.mjs'
import { RUNTIME_PATH } from '../runtime-state.mjs'
import { createBridge, startBridge } from '../server.mjs'
const PNG_1X1 = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=',
  'base64',
)

const capabilities = {
  version: 'dresser-preset/v1',
  mirror: { manifest: 'MANIFEST.sha256', sha256: 'a'.repeat(64), route: '/tools/mockup' },
  source: { acceptedMimeTypes: ['image/png', 'image/jpeg'], maxBytes: 25 * 1024 * 1024 },
  deviceModels: [{ id: 'phone', label: 'Phone', colors: [{ id: 'black', label: 'Black' }] }],
  backgrounds: {
    modes: ['solid', 'mesh', 'transparent', 'picture'],
    solid: { defaultColor: '#112233' },
    mesh: { colorCount: 3, defaultColors: ['#112233', '#445566', '#778899'] },
    picturePacks: [],
  },
  layout: {
    aspectRatios: [{ id: '1:1', label: '1:1' }],
    padding: { default: 72, min: 72, max: 72, step: 1 },
    deviceScale: { default: 100, min: 60, max: 300, step: 1 },
    x: { default: 0, min: -1000, max: 1000, step: 1 },
    y: { default: 0, min: -1000, max: 1000, step: 1 },
  },
  defaults: {
    version: 'dresser-preset/v1',
    device: { modelId: 'phone', colorId: 'black' },
    background: { mode: 'solid', color: '#112233' },
    layout: { aspectRatioId: '1:1', padding: 72, deviceScale: 100, x: 0, y: 0 },
  },
}
const preset = capabilities.defaults
const presetHeader = Buffer.from(JSON.stringify(preset)).toString('base64url')

function authenticated(token, extra = {}) {
  return { Origin: 'null', Authorization: `Bearer ${token}`, ...extra }
}

function rawRequest(payload) {
  return new Promise((resolveRaw, reject) => {
    const socket = connect({ host: '127.0.0.1', port: 4783 }, () => socket.end(payload))
    let response = ''
    socket.setEncoding('utf8')
    socket.on('data', (chunk) => { response += chunk })
    socket.on('end', () => resolveRaw(response))
    socket.on('error', reject)
  })
}

function slowRequest(payload) {
  return new Promise((resolveRaw, reject) => {
    const socket = connect({ host: '127.0.0.1', port: 4783 }, () => socket.write(payload))
    let response = ''
    socket.setEncoding('utf8')
    socket.on('data', (chunk) => {
      response += chunk
      if (response.includes('BODY_TIMEOUT')) socket.end()
    })
    socket.on('end', () => resolveRaw(response))
    socket.on('error', reject)
  })
}

function preflight(path, method, headers) {
  return fetch(`${BRIDGE_ORIGIN}${path}`, {
    method: 'OPTIONS',
    headers: {
      Origin: 'null',
      'Access-Control-Request-Method': method,
      'Access-Control-Request-Headers': headers,
    },
  })
}

function assertNoPermission(response) {
  assert.equal(response.headers.get('access-control-allow-methods'), null)
  assert.equal(response.headers.get('access-control-allow-headers'), null)
}

test('route-specific preflight matrix rejects cross-route permissions', async () => {
  let managerCalls = 0
  let shutdownCalls = 0
  const manager = {
    async getCapabilities() { managerCalls += 1; return capabilities },
    async render() { managerCalls += 1; throw new Error('must not render') },
  }
  const bridge = createBridge({ manager, token: 'preflight-token', onShutdown: () => { shutdownCalls += 1 } })
  await bridge.start()
  try {
    const allowed = [
      ['/v1/capabilities', 'GET', 'AUTHORIZATION', 'GET', 'authorization'],
      ['/v1/render', 'POST', 'X-Dresser-Preset, authorization, CONTENT-TYPE', 'POST', 'authorization, content-type, x-dresser-preset'],
      ['/v1/shutdown', 'POST', 'authorization', 'POST', 'authorization'],
    ]
    for (const [path, method, headers, canonicalMethod, canonicalHeaders] of allowed) {
      const response = await preflight(path, method, headers)
      assert.equal(response.status, 204)
      assert.equal(response.headers.get('access-control-allow-methods'), canonicalMethod)
      assert.equal(response.headers.get('access-control-allow-headers'), canonicalHeaders)
    }

    const denied = [
      ['/v1/capabilities', 'POST', 'authorization', 'INVALID_PREFLIGHT'],
      ['/v1/render', 'GET', 'authorization, content-type, x-dresser-preset', 'INVALID_PREFLIGHT'],
      ['/v1/shutdown', 'GET', 'authorization', 'INVALID_PREFLIGHT'],
      ['/v1/capabilities', 'GET', '', 'INVALID_PREFLIGHT'],
      ['/v1/render', 'POST', 'authorization, content-type', 'INVALID_PREFLIGHT'],
      ['/v1/render', 'POST', 'authorization, content-type, x-dresser-preset, x-extra', 'INVALID_PREFLIGHT'],
      ['/v1/shutdown', 'POST', 'authorization, content-type', 'INVALID_PREFLIGHT'],
      ['/v1/unknown', 'POST', 'authorization', 'NOT_FOUND'],
    ]
    for (const [path, method, headers, code] of denied) {
      const response = await preflight(path, method, headers)
      assert.equal(response.status, code === 'NOT_FOUND' ? 404 : 403)
      assert.equal((await response.json()).code, code)
      assertNoPermission(response)
    }
    assert.equal(managerCalls, 0)
    assert.equal(shutdownCalls, 0)
  } finally {
    await bridge.stop()
  }
})

test('shutdown body framing is fully consumed before callback', async () => {
  let managerCalls = 0
  let shutdownCalls = 0
  const manager = {
    async getCapabilities() { managerCalls += 1; return capabilities },
    async render() { managerCalls += 1; throw new Error('must not render') },
  }
  const token = 'shutdown-token'
  const bridge = createBridge({ manager, token, bodyTimeoutMs: 50, onShutdown: () => { shutdownCalls += 1 } })
  await bridge.start()
  const base = [
    'POST /v1/shutdown HTTP/1.1', `Host: ${EXPECTED_HOST}`, 'Origin: null', `Authorization: Bearer ${token}`,
  ]
  try {
    const positiveLength = await fetch(`${BRIDGE_ORIGIN}/v1/shutdown`, {
      method: 'POST', headers: authenticated(token, { 'Content-Type': 'application/octet-stream' }), body: Buffer.from('x'),
    })
    assert.equal(positiveLength.status, 400)
    assert.equal((await positiveLength.json()).code, 'INVALID_BODY')
    assert.equal(shutdownCalls, 0)

    const nonEmptyChunked = await rawRequest([...base, 'Transfer-Encoding: chunked', 'Connection: close', '', '1', 'x', '0', '', ''].join('\r\n'))
    assert.match(nonEmptyChunked, /400 Bad Request/)
    assert.match(nonEmptyChunked, /INVALID_BODY/)
    assert.doesNotMatch(nonEmptyChunked, /202 Accepted/)
    assert.equal(shutdownCalls, 0)

    const slowChunked = await slowRequest([...base, 'Transfer-Encoding: chunked', 'Connection: close', '', '1', 'x', ''].join('\r\n'))
    assert.match(slowChunked, /BODY_TIMEOUT/)
    assert.equal(shutdownCalls, 0)

    await new Promise((resolveAbort) => {
      const socket = connect({ host: '127.0.0.1', port: 4783 }, () => {
        socket.write([...base, 'Transfer-Encoding: chunked', '', '1', 'x', ''].join('\r\n'))
        socket.destroy()
        resolveAbort()
      })
      socket.on('error', resolveAbort)
    })
    await new Promise((resolveDelay) => setTimeout(resolveDelay, 20))
    assert.equal(shutdownCalls, 0)

    const conflicting = await rawRequest([...base, 'Content-Length: 1', 'Transfer-Encoding: chunked', 'Connection: close', '', '0', '', ''].join('\r\n'))
    assert.match(conflicting, /400 Bad Request/)
    assert.equal(shutdownCalls, 0)

    const healthAfterRejects = await fetch(`${BRIDGE_ORIGIN}/health`)
    assert.equal(healthAfterRejects.status, 200)
    await access(RUNTIME_PATH)

    const explicitEmpty = await fetch(`${BRIDGE_ORIGIN}/v1/shutdown`, {
      method: 'POST', headers: authenticated(token, { 'Content-Length': '0' }),
    })
    assert.equal(explicitEmpty.status, 202)
    assert.deepEqual(await explicitEmpty.json(), { status: 'stopping' })
    await new Promise((resolveImmediate) => setImmediate(resolveImmediate))
    assert.equal(shutdownCalls, 1)

    const absentLength = await rawRequest([...base, 'Connection: close', '', ''].join('\r\n'))
    assert.match(absentLength, /202 Accepted/)
    await new Promise((resolveImmediate) => setImmediate(resolveImmediate))
    assert.equal(shutdownCalls, 2)

    const emptyChunked = await rawRequest([...base, 'Transfer-Encoding: chunked', 'Connection: close', '', '0', '', ''].join('\r\n'))
    assert.match(emptyChunked, /202 Accepted/)
    await new Promise((resolveImmediate) => setImmediate(resolveImmediate))
    assert.equal(shutdownCalls, 3)
    assert.equal(managerCalls, 0)
  } finally {
    await bridge.stop()
  }
})

test('listener exposes private runtime identity, strict transport, render metadata, and cleanup', async () => {
  let capabilityCalls = 0
  let renderCalls = 0
  const created = []
  const manager = {
    async getCapabilities() {
      capabilityCalls += 1
      return capabilities
    },
    async render() {
      renderCalls += 1
      await mkdir(OUTPUT_ROOT, { recursive: true })
      const path = `${OUTPUT_ROOT}/${randomUUID()}.png`
      await writeFile(path, PNG_1X1)
      created.push(path)
      return {
        version: 'dresser-preset/v1', path, mimeType: 'image/png', byteSize: PNG_1X1.length,
        sha256: createHash('sha256').update(PNG_1X1).digest('hex'), width: 1, height: 1,
      }
    },
  }
  const bridge = await startBridge({ manager, token: 'test-token' })
  try {
    const runtime = JSON.parse(await readFile(RUNTIME_PATH, 'utf8'))
    assert.equal(runtime.token, 'test-token')
    assert.equal(runtime.origin, BRIDGE_ORIGIN)
    assert.equal((await stat(RUNTIME_PATH)).mode & 0o777, 0o600)

    const health = await fetch(`${BRIDGE_ORIGIN}/health`)
    assert.equal(health.status, 200)
    assert.deepEqual(await health.json(), { status: 'ready', version: 1 })

    const denied = await fetch(`${BRIDGE_ORIGIN}/v1/capabilities`, { headers: { Origin: 'null' } })
    assert.equal(denied.status, 401)
    assert.equal((await denied.json()).code, 'UNAUTHORIZED')
    assert.equal(capabilityCalls, 0)

    const hostile = await rawRequest('GET /v1/capabilities HTTP/1.1\r\nHost: attacker.invalid\r\nOrigin: null\r\nAuthorization: Bearer test-token\r\nConnection: close\r\n\r\n')
    assert.match(hostile, /403 Forbidden/)
    assert.match(hostile, /INVALID_HOST/)
    assert.equal(capabilityCalls, 0)

    const preflight = await fetch(`${BRIDGE_ORIGIN}/v1/render`, {
      method: 'OPTIONS',
      headers: { Origin: 'null', 'Access-Control-Request-Method': 'POST', 'Access-Control-Request-Headers': 'authorization, content-type, x-dresser-preset' },
    })
    assert.equal(preflight.status, 204)
    assert.equal(preflight.headers.get('access-control-allow-origin'), 'null')

    const malformedPreflight = await fetch(`${BRIDGE_ORIGIN}/v1/render`, {
      method: 'OPTIONS',
      headers: { Origin: 'null', 'Access-Control-Request-Method': 'POST', 'Access-Control-Request-Headers': 'authorization, x-hostile' },
    })
    assert.equal(malformedPreflight.status, 403)

    const unsupported = await fetch(`${BRIDGE_ORIGIN}/v1/render`, {
      method: 'POST', headers: authenticated('test-token', { 'Content-Type': 'text/plain', 'X-Dresser-Preset': presetHeader }), body: 'x',
    })
    assert.equal(unsupported.status, 415)
    assert.equal(renderCalls, 0)

    const wrongMethod = await fetch(`${BRIDGE_ORIGIN}/v1/capabilities`, { method: 'POST', headers: authenticated('test-token') })
    assert.equal(wrongMethod.status, 405)
    const wrongPath = await fetch(`${BRIDGE_ORIGIN}/v1/nope`, { headers: authenticated('test-token') })
    assert.equal(wrongPath.status, 404)

    const oversized = await rawRequest([
      'POST /v1/render HTTP/1.1', `Host: ${EXPECTED_HOST}`, 'Origin: null', 'Authorization: Bearer test-token',
      'Content-Type: image/png', `X-Dresser-Preset: ${presetHeader}`, `Content-Length: ${25 * 1024 * 1024 + 1}`,
      'Connection: close', '', '',
    ].join('\r\n'))
    assert.match(oversized, /BODY_TOO_LARGE/)
    assert.equal(renderCalls, 0)

    const capabilitiesResponse = await fetch(`${BRIDGE_ORIGIN}/v1/capabilities`, { headers: authenticated('test-token') })
    assert.equal(capabilitiesResponse.status, 200)
    assert.deepEqual(await capabilitiesResponse.json(), capabilities)

    const renderResponse = await fetch(`${BRIDGE_ORIGIN}/v1/render`, {
      method: 'POST',
      headers: authenticated('test-token', { 'Content-Type': 'image/png', 'X-Dresser-Preset': presetHeader }),
      body: PNG_1X1,
    })
    assert.equal(renderResponse.status, 200)
    assert.equal(renderResponse.headers.get('content-type'), 'image/png')
    assert.equal(renderResponse.headers.get('x-dresser-width'), '1')
    assert.equal(renderResponse.headers.get('x-dresser-height'), '1')
    assert.equal(renderResponse.headers.get('x-dresser-byte-size'), String(PNG_1X1.length))
    assert.deepEqual(Buffer.from(await renderResponse.arrayBuffer()), PNG_1X1)
    assert.equal(renderCalls, 1)
    await assert.rejects(access(created[0]))

    const invalidPreset = await fetch(`${BRIDGE_ORIGIN}/v1/render`, {
      method: 'POST',
      headers: authenticated('test-token', { 'Content-Type': 'image/png', 'X-Dresser-Preset': Buffer.from('{}').toString('base64url') }),
      body: PNG_1X1,
    })
    assert.equal(invalidPreset.status, 400)
    assert.equal((await invalidPreset.json()).code, 'INVALID_PRESET')
    assert.equal(renderCalls, 1)

    const spoofed = await fetch(`${BRIDGE_ORIGIN}/v1/render`, {
      method: 'POST',
      headers: authenticated('test-token', { 'Content-Type': 'image/png', 'X-Dresser-Preset': presetHeader }),
      body: Buffer.from('not png'),
    })
    assert.equal(spoofed.status, 400)
    assert.equal((await spoofed.json()).code, 'INVALID_PNG')
    assert.equal(renderCalls, 1)

    const wrongOrigin = await fetch(`${BRIDGE_ORIGIN}/v1/capabilities`, { headers: authenticated('test-token', { Origin: 'https://evil.invalid' }) })
    assert.equal(wrongOrigin.status, 403)
    assert.equal(wrongOrigin.headers.get('access-control-allow-origin'), null)
  } finally {
    await bridge.stop()
    await Promise.all(created.map((path) => unlink(path).catch(() => {})))
  }
  await assert.rejects(access(RUNTIME_PATH))
  await assert.rejects(fetch(`${BRIDGE_ORIGIN}/health`))
})

test('overlap returns BUSY and a post-body disconnect still cleans owned input and output', async () => {
  let busy = false
  const created = []
  const manager = new BrowserSessionManager({ launch: async () => { throw new Error('unused') } })
  manager.capabilities = capabilities
  manager.render = async () => {
    if (busy) throw new DresserError('BUSY', 'Another Dresser browser operation is already running')
    busy = true
    try {
      await new Promise((resolveDelay) => setTimeout(resolveDelay, 80))
      await mkdir(OUTPUT_ROOT, { recursive: true })
      const path = `${OUTPUT_ROOT}/${randomUUID()}.png`
      await writeFile(path, PNG_1X1)
      created.push(path)
      return {
        version: 'dresser-preset/v1', path, mimeType: 'image/png', byteSize: PNG_1X1.length,
        sha256: createHash('sha256').update(PNG_1X1).digest('hex'), width: 1, height: 1,
      }
    } finally {
      busy = false
    }
  }
  const bridge = await startBridge({ manager, token: 'busy-token' })
  const renderOptions = {
    method: 'POST',
    headers: authenticated('busy-token', { 'Content-Type': 'image/png', 'X-Dresser-Preset': presetHeader }),
    body: PNG_1X1,
  }
  try {
    const winner = fetch(`${BRIDGE_ORIGIN}/v1/render`, renderOptions)
    await new Promise((resolveDelay) => setTimeout(resolveDelay, 20))
    const loser = await fetch(`${BRIDGE_ORIGIN}/v1/render`, renderOptions)
    assert.equal(loser.status, 409)
    assert.equal((await loser.json()).code, 'BUSY')
    assert.equal((await winner).status, 200)

    await new Promise((resolveDisconnect) => {
      const request = httpRequest({
        host: '127.0.0.1', port: 4783, path: '/v1/render', method: 'POST',
        headers: authenticated('busy-token', { 'Content-Type': 'image/png', 'X-Dresser-Preset': presetHeader, 'Content-Length': PNG_1X1.length }),
      })
      request.on('error', () => resolveDisconnect())
      request.on('finish', () => setTimeout(() => { request.destroy(); resolveDisconnect() }, 20))
      request.end(PNG_1X1)
    })
    await new Promise((resolveDelay) => setTimeout(resolveDelay, 120))
    for (const path of created) await assert.rejects(access(path))
  } finally {
    await bridge.stop()
    await Promise.all(created.map((path) => unlink(path).catch(() => {})))
  }
})

test('truncated requests and client disconnects do not reach browser mutation', async () => {
  let mutationCalls = 0
  const manager = {
    async getCapabilities() { mutationCalls += 1; return capabilities },
    async render() { mutationCalls += 1; throw new Error('must not render') },
  }
  const bridge = await startBridge({ manager, token: 'disconnect-token', bodyTimeoutMs: 100 })
  try {
    const truncated = await rawRequest([
      'POST /v1/render HTTP/1.1', `Host: ${EXPECTED_HOST}`, 'Origin: null',
      'Authorization: Bearer disconnect-token', 'Content-Type: image/png', `X-Dresser-Preset: ${presetHeader}`,
      'Content-Length: 100', 'Connection: close', '', 'short',
    ].join('\r\n'))
    assert.match(truncated, /400 Bad Request/)
    assert.equal(mutationCalls, 0)

    const slow = await slowRequest([
      'POST /v1/render HTTP/1.1', `Host: ${EXPECTED_HOST}`, 'Origin: null',
      'Authorization: Bearer disconnect-token', 'Content-Type: image/png', `X-Dresser-Preset: ${presetHeader}`,
      `Content-Length: ${PNG_1X1.length}`, 'Connection: close', '', PNG_1X1.subarray(0, 8).toString('binary'),
    ].join('\r\n'))
    assert.match(slow, /BODY_TIMEOUT/)
    assert.equal(mutationCalls, 0)

    await new Promise((resolveDisconnect, reject) => {
      const request = httpRequest({
        host: '127.0.0.1', port: 4783, path: '/v1/render', method: 'POST',
        headers: authenticated('disconnect-token', { 'Content-Type': 'image/png', 'X-Dresser-Preset': presetHeader, 'Content-Length': PNG_1X1.length }),
      })
      request.on('error', () => resolveDisconnect())
      request.on('socket', () => {
        request.write(PNG_1X1.subarray(0, 8))
        request.destroy()
        resolveDisconnect()
      })
      request.on('response', () => reject(new Error('Disconnected request unexpectedly received a response')))
    })
    await new Promise((resolveDelay) => setTimeout(resolveDelay, 20))
    assert.equal(mutationCalls, 0)
  } finally {
    await bridge.stop()
  }
})
