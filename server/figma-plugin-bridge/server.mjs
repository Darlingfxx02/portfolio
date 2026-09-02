import { createHash, randomUUID } from 'node:crypto'
import { createServer } from 'node:http'
import { mkdir, readFile, rm, unlink, writeFile } from 'node:fs/promises'
import { dirname, join, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

import { BrowserSessionManager, DresserError, OUTPUT_ROOT } from '../mockup-mcp/browser-session.mjs'
import { PresetValidationError, validatePreset } from '../mockup-mcp/preset-schema.mjs'
import {
  BRIDGE_HOST,
  BRIDGE_ORIGIN,
  BRIDGE_PORT,
  BridgeError,
  assertBearer,
  assertFigmaOrigin,
  assertHost,
  assertPluginRequest,
  corsHeaders,
  parsePresetHeader,
  readBoundedBody,
  readEmptyBody,
  validatePng,
  validatePreflight,
} from './protocol.mjs'
import { INPUT_ROOT, createToken, removeRuntimeState, writeRuntimeState } from './runtime-state.mjs'
import { PLUGIN_CLIENT_HEADER, PluginSessionState, expiredSessionCookie, readSessionCookie, sessionCookie } from './session-state.mjs'

const MODULE_DIR = dirname(fileURLToPath(import.meta.url))
const DEFAULT_PLUGIN_UI_PATH = resolve(MODULE_DIR, '../../figma-plugin/dist/plugin.html')

const JSON_TYPE = 'application/json; charset=utf-8'
const SAFE_ERRORS = new Set([
  'BODY_TIMEOUT', 'BODY_TOO_LARGE', 'BUSY', 'CLIENT_DISCONNECTED', 'INVALID_BODY',
  'INVALID_BODY_LENGTH', 'INVALID_HOST', 'INVALID_ORIGIN', 'INVALID_PNG', 'INVALID_PREFLIGHT',
  'INVALID_PRESET', 'METHOD_NOT_ALLOWED', 'NOT_FOUND', 'TRUNCATED_BODY', 'UNAUTHORIZED',
  'PLUGIN_UI_UNAVAILABLE',
  'UNKNOWN_ASPECT_RATIO', 'UNKNOWN_DEVICE_COLOR', 'UNKNOWN_DEVICE_MODEL', 'UNKNOWN_PICTURE_IMAGE',
  'UNKNOWN_PICTURE_PACK', 'UNSUPPORTED_MEDIA_TYPE',
])

function sendJson(response, status, payload, headers = {}) {
  const bytes = Buffer.from(JSON.stringify(payload))
  response.writeHead(status, {
    'Content-Type': JSON_TYPE,
    'Content-Length': bytes.length,
    'Cache-Control': 'no-store',
    ...headers,
  })
  response.end(bytes)
}

function pluginDocumentHeaders(cookie) {
  return {
    'Content-Type': 'text/html; charset=utf-8',
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff',
    'Content-Security-Policy': "default-src 'self'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; img-src 'self' blob:; connect-src 'self'; object-src 'none'; base-uri 'none'; form-action 'none'; frame-ancestors https://www.figma.com",
    'Set-Cookie': cookie,
  }
}

function hasBearer(request) {
  return typeof request.headers.authorization === 'string'
}

function authenticateApi(request, token, sessions) {
  const cookieValue = readSessionCookie(request.headers.cookie)
  if (hasBearer(request) && request.headers.cookie !== undefined) {
    throw new BridgeError('UNAUTHORIZED', 'Authentication is ambiguous', 401)
  }
  if (hasBearer(request)) {
    assertFigmaOrigin(request)
    assertBearer(request, token)
    return { mode: 'bearer', headers: corsHeaders() }
  }
  if (request.headers['x-dresser-plugin-client'] !== PLUGIN_CLIENT_HEADER) {
    throw new BridgeError('UNAUTHORIZED', 'Authentication is required', 401)
  }
  assertPluginRequest(request)
  if (!sessions.validate(cookieValue)) {
    const error = new BridgeError('UNAUTHORIZED', 'Authentication is required', 401)
    error.expirePluginCookie = true
    throw error
  }
  return { mode: 'session', headers: {} }
}

function safeError(error) {
  if (error instanceof BridgeError || error instanceof PresetValidationError) {
    const code = SAFE_ERRORS.has(error.code) ? error.code : 'REQUEST_FAILED'
    return { status: error.status ?? 400, code, message: code === error.code ? error.message : 'Request failed' }
  }
  if (error instanceof DresserError) {
    const messages = {
      BUSY: 'Another Dresser browser operation is already running',
      BROWSER_UNAVAILABLE: 'Controlled browser is unavailable',
      MIRROR_UNAVAILABLE: 'Local mirror is unavailable',
      RENDER_TIMEOUT: 'Dresser render timed out',
      DOWNLOAD_FAILED: 'Dresser PNG export failed',
      RENDER_FAILED: 'Dresser PNG render failed',
    }
    const code = messages[error.code] ? error.code : 'RENDER_FAILED'
    return { status: code === 'BUSY' ? 409 : 502, code, message: messages[code] }
  }
  return { status: 500, code: 'INTERNAL_ERROR', message: 'Request failed' }
}

function isOwnedOutput(path) {
  const root = resolve(OUTPUT_ROOT)
  const candidate = resolve(path)
  const name = candidate.slice(root.length + 1)
  return candidate.startsWith(`${root}${sep}`) && /^[0-9a-f-]{36}\.png$/.test(name)
}

export function createBridge({ manager = new BrowserSessionManager(), token = createToken(), bodyTimeoutMs, onShutdown, pluginUiPath = DEFAULT_PLUGIN_UI_PATH, sessions = new PluginSessionState() } = {}) {
  const active = new Set()
  let stopping = false
  let stopPromise

  const server = createServer((request, response) => {
    const work = (async () => {
      assertHost(request)
      const url = new URL(request.url, BRIDGE_ORIGIN)
      if (url.search) throw new BridgeError('NOT_FOUND', 'Route was not found', 404)

      if (request.method === 'GET' && url.pathname === '/health') {
        sendJson(response, 200, { status: stopping ? 'stopping' : 'ready', version: 1 })
        return
      }
      if (url.pathname === '/plugin') {
        if (request.method !== 'GET') throw new BridgeError('METHOD_NOT_ALLOWED', 'Method is not allowed', 405)
        if (request.headers.origin !== undefined && request.headers.origin !== 'null') throw new BridgeError('INVALID_ORIGIN', 'Request origin is not allowed', 403)
        const fetchDest = request.headers['sec-fetch-dest']
        if (fetchDest !== undefined && fetchDest !== 'iframe' && fetchDest !== 'document') throw new BridgeError('INVALID_ORIGIN', 'Request browser context is not allowed', 403)
        let html
        try {
          html = await readFile(pluginUiPath)
        } catch {
          throw new BridgeError('PLUGIN_UI_UNAVAILABLE', 'Dresser plugin UI is not built', 503)
        }
        const cookie = sessionCookie(sessions.issue())
        response.writeHead(200, { ...pluginDocumentHeaders(cookie), 'Content-Length': html.length })
        response.end(html)
        return
      }
      if (request.method === 'OPTIONS') {
        const headers = validatePreflight(request, url.pathname)
        response.writeHead(204, { ...headers, 'Content-Length': 0, 'Cache-Control': 'no-store' })
        response.end()
        return
      }
      const auth = authenticateApi(request, token, sessions)
      const headers = auth.headers
      if (request.method === 'GET' && url.pathname === '/v1/capabilities') {
        sendJson(response, 200, await manager.getCapabilities(), headers)
        return
      }
      if (request.method === 'POST' && url.pathname === '/v1/render') {
        if (request.headers['content-type'] !== 'image/png') {
          throw new BridgeError('UNSUPPORTED_MEDIA_TYPE', 'Content type must be image/png', 415)
        }
        const presetInput = parsePresetHeader(request.headers['x-dresser-preset'])
        const bytes = await readBoundedBody(request, { timeoutMs: bodyTimeoutMs })
        validatePng(bytes)
        const capabilities = await manager.getCapabilities()
        const preset = validatePreset(presetInput, capabilities)
        await mkdir(INPUT_ROOT, { recursive: true, mode: 0o700 })
        const sourcePath = join(INPUT_ROOT, `${randomUUID()}.png`)
        let artifactPath
        try {
          await writeFile(sourcePath, bytes, { mode: 0o600, flag: 'wx' })
          const artifact = await manager.render(sourcePath, preset)
          artifactPath = artifact.path
          if (!isOwnedOutput(artifactPath)) throw new DresserError('RENDER_FAILED', 'Dresser returned an invalid output')
          const output = await readFile(artifactPath)
          const dimensions = validatePng(output)
          const sha256 = createHash('sha256').update(output).digest('hex')
          if (output.length !== artifact.byteSize || sha256 !== artifact.sha256 || dimensions.width !== artifact.width || dimensions.height !== artifact.height) {
            throw new DresserError('RENDER_FAILED', 'Dresser output metadata did not match')
          }
          await unlink(sourcePath)
          await unlink(artifactPath)
          artifactPath = undefined
          if (!response.destroyed) {
            response.writeHead(200, {
              ...headers,
              'Content-Type': 'image/png',
              'Content-Length': output.length,
              'Cache-Control': 'no-store',
              'X-Dresser-Width': artifact.width,
              'X-Dresser-Height': artifact.height,
              'X-Dresser-Byte-Size': artifact.byteSize,
              'X-Dresser-SHA256': artifact.sha256,
            })
            response.end(output)
          }
        } finally {
          await unlink(sourcePath).catch(() => {})
          if (artifactPath && isOwnedOutput(artifactPath)) await unlink(artifactPath).catch(() => {})
        }
        return
      }
      if (request.method === 'POST' && url.pathname === '/v1/shutdown') {
        if (auth.mode !== 'bearer') throw new BridgeError('UNAUTHORIZED', 'Authentication is required', 401)
        await readEmptyBody(request, { timeoutMs: bodyTimeoutMs })
        sendJson(response, 202, { status: 'stopping' }, headers)
        queueMicrotask(() => onShutdown?.())
        return
      }
      const knownPath = ['/health', '/plugin', '/v1/capabilities', '/v1/render', '/v1/shutdown'].includes(url.pathname)
      throw new BridgeError(knownPath ? 'METHOD_NOT_ALLOWED' : 'NOT_FOUND', knownPath ? 'Method is not allowed' : 'Route was not found', knownPath ? 405 : 404)
    })()
    active.add(work)
    work.catch((error) => {
      if (response.headersSent || response.destroyed) return
      const safe = safeError(error)
      const includeCors = request.headers.origin === 'null' && hasBearer(request)
      const headers = includeCors ? corsHeaders() : {}
      if (error?.expirePluginCookie) headers['Set-Cookie'] = expiredSessionCookie()
      sendJson(response, safe.status, { code: safe.code, message: safe.message }, headers)
    }).finally(() => active.delete(work))
  })

  async function start() {
    await new Promise((resolveListen, reject) => {
      server.once('error', reject)
      server.listen(BRIDGE_PORT, BRIDGE_HOST, resolveListen)
    }).catch(() => { throw new BridgeError('PORT_UNAVAILABLE', 'Dresser Figma bridge port is unavailable', 503) })
    try {
      await writeRuntimeState({ token, pid: process.pid, origin: BRIDGE_ORIGIN, startedAt: new Date().toISOString() })
    } catch (error) {
      await new Promise((resolveClose) => server.close(resolveClose))
      await removeRuntimeState().catch(() => {})
      throw error
    }
    return { origin: BRIDGE_ORIGIN }
  }

  function stop() {
    stopPromise ??= (async () => {
      stopping = true
      sessions.clear()
      await new Promise((resolveClose) => server.close(resolveClose))
      await Promise.allSettled([...active])
      await removeRuntimeState()
      await rm(INPUT_ROOT, { recursive: true, force: true })
    })()
    return stopPromise
  }

  return { server, start, stop, token, sessionDiagnostics: () => sessions.diagnostics() }
}

export async function startBridge(options = {}) {
  let bridge
  bridge = createBridge({ ...options, onShutdown: () => bridge.stop() })
  await bridge.start()
  return bridge
}

if (process.argv[1] && resolve(process.argv[1]) === resolve(new URL(import.meta.url).pathname)) {
  let bridge
  try {
    bridge = await startBridge()
    process.stdout.write('Dresser Figma bridge ready on 127.0.0.1:4783\n')
  } catch {
    process.stderr.write('Dresser Figma bridge could not start\n')
    process.exitCode = 1
  }
  if (bridge) {
    const shutdown = async () => {
      await bridge.stop()
      process.exit(0)
    }
    process.once('SIGINT', shutdown)
    process.once('SIGTERM', shutdown)
  }
}
