import { timingSafeEqual } from 'node:crypto'

export const BRIDGE_HOST = '127.0.0.1'
export const BRIDGE_PORT = 4783
export const BRIDGE_ORIGIN = `http://${BRIDGE_HOST}:${BRIDGE_PORT}`
export const EXPECTED_HOST = `${BRIDGE_HOST}:${BRIDGE_PORT}`
export const FIGMA_ORIGIN = 'null'
export const MAX_PNG_BYTES = 25 * 1024 * 1024
export const MAX_PRESET_HEADER_BYTES = 16 * 1024
export const BODY_TIMEOUT_MS = 10_000
export const PLUGIN_CLIENT_ORIGIN = BRIDGE_ORIGIN
export const PREFLIGHT_POLICIES = Object.freeze({
  '/v1/capabilities': Object.freeze({ method: 'GET', headers: Object.freeze(['authorization']) }),
  '/v1/render': Object.freeze({ method: 'POST', headers: Object.freeze(['authorization', 'content-type', 'x-dresser-preset']) }),
  '/v1/shutdown': Object.freeze({ method: 'POST', headers: Object.freeze(['authorization']) }),
})

export class BridgeError extends Error {
  constructor(code, message, status = 400) {
    super(message)
    this.name = 'BridgeError'
    this.code = code
    this.status = status
  }
}

export function assertHost(request) {
  if (request.headers.host !== EXPECTED_HOST) {
    throw new BridgeError('INVALID_HOST', 'Request host is not allowed', 403)
  }
}

export function assertFigmaOrigin(request) {
  if (request.headers.origin !== FIGMA_ORIGIN) {
    throw new BridgeError('INVALID_ORIGIN', 'Request origin is not allowed', 403)
  }
}

export function assertBearer(request, expectedToken) {
  const authorization = request.headers.authorization
  if (typeof authorization !== 'string' || !authorization.startsWith('Bearer ')) {
    throw new BridgeError('UNAUTHORIZED', 'Authentication is required', 401)
  }
  const supplied = Buffer.from(authorization.slice(7))
  const expected = Buffer.from(expectedToken)
  if (supplied.length !== expected.length || !timingSafeEqual(supplied, expected)) {
    throw new BridgeError('UNAUTHORIZED', 'Authentication is required', 401)
  }
}

export function assertPluginRequest(request) {
  if (request.headers.origin !== PLUGIN_CLIENT_ORIGIN) {
    throw new BridgeError('INVALID_ORIGIN', 'Request origin is not allowed', 403)
  }
  if (request.headers.referer !== `${PLUGIN_CLIENT_ORIGIN}/plugin`) {
    throw new BridgeError('INVALID_ORIGIN', 'Request referrer is not allowed', 403)
  }
  if (request.headers['sec-fetch-site'] !== 'same-origin' || request.headers['sec-fetch-mode'] !== 'cors' || request.headers['sec-fetch-dest'] !== 'empty') {
    throw new BridgeError('INVALID_ORIGIN', 'Request browser context is not allowed', 403)
  }
}

export function parsePresetHeader(value) {
  if (typeof value !== 'string' || value.length === 0) {
    throw new BridgeError('INVALID_PRESET', 'A preset is required')
  }
  if (Buffer.byteLength(value, 'ascii') > MAX_PRESET_HEADER_BYTES || !/^[A-Za-z0-9_-]+$/.test(value)) {
    throw new BridgeError('INVALID_PRESET', 'Preset encoding is invalid')
  }
  let bytes
  try {
    bytes = Buffer.from(value, 'base64url')
  } catch {
    throw new BridgeError('INVALID_PRESET', 'Preset encoding is invalid')
  }
  if (bytes.toString('base64url') !== value) {
    throw new BridgeError('INVALID_PRESET', 'Preset encoding is invalid')
  }
  try {
    return JSON.parse(bytes.toString('utf8'))
  } catch {
    throw new BridgeError('INVALID_PRESET', 'Preset JSON is invalid')
  }
}

function crc32(bytes) {
  let crc = 0xffffffff
  for (const byte of bytes) {
    crc ^= byte
    for (let bit = 0; bit < 8; bit += 1) {
      crc = (crc >>> 1) ^ ((crc & 1) ? 0xedb88320 : 0)
    }
  }
  return (crc ^ 0xffffffff) >>> 0
}

export function validatePng(bytes) {
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])
  if (!Buffer.isBuffer(bytes) || bytes.length < 45 || bytes.length > MAX_PNG_BYTES || !bytes.subarray(0, 8).equals(signature)) {
    throw new BridgeError('INVALID_PNG', 'Request body is not a valid PNG')
  }
  let offset = 8
  let width
  let height
  let sawIdat = false
  let sawIend = false
  while (offset + 12 <= bytes.length) {
    const length = bytes.readUInt32BE(offset)
    const chunkEnd = offset + 12 + length
    if (chunkEnd > bytes.length) throw new BridgeError('INVALID_PNG', 'PNG data is truncated')
    const type = bytes.toString('ascii', offset + 4, offset + 8)
    const crcInput = bytes.subarray(offset + 4, offset + 8 + length)
    if (crc32(crcInput) !== bytes.readUInt32BE(offset + 8 + length)) {
      throw new BridgeError('INVALID_PNG', 'PNG integrity check failed')
    }
    if (offset === 8) {
      if (type !== 'IHDR' || length !== 13) throw new BridgeError('INVALID_PNG', 'PNG header is invalid')
      width = bytes.readUInt32BE(offset + 8)
      height = bytes.readUInt32BE(offset + 12)
      if (!width || !height) throw new BridgeError('INVALID_PNG', 'PNG dimensions are invalid')
      const bitDepth = bytes[offset + 16]
      const colorType = bytes[offset + 17]
      const validDepths = {
        0: [1, 2, 4, 8, 16],
        2: [8, 16],
        3: [1, 2, 4, 8],
        4: [8, 16],
        6: [8, 16],
      }
      if (!validDepths[colorType]?.includes(bitDepth) || bytes[offset + 18] !== 0 || bytes[offset + 19] !== 0 || bytes[offset + 20] > 1) {
        throw new BridgeError('INVALID_PNG', 'PNG header is unsupported')
      }
    } else if (type === 'IHDR') {
      throw new BridgeError('INVALID_PNG', 'PNG header is invalid')
    }
    if (type === 'IDAT') sawIdat = true
    if (type === 'IEND') {
      if (length !== 0 || !sawIdat || chunkEnd !== bytes.length) {
        throw new BridgeError('INVALID_PNG', 'PNG ending is invalid')
      }
      sawIend = true
      offset = chunkEnd
      break
    }
    offset = chunkEnd
  }
  if (!sawIend || offset !== bytes.length) throw new BridgeError('INVALID_PNG', 'PNG data is incomplete')
  return { width, height }
}

export function readBoundedBody(request, { timeoutMs = BODY_TIMEOUT_MS } = {}) {
  const contentLength = request.headers['content-length']
  if (contentLength !== undefined) {
    if (!/^\d+$/.test(contentLength)) throw new BridgeError('INVALID_BODY_LENGTH', 'Content length is invalid')
    if (Number(contentLength) > MAX_PNG_BYTES) throw new BridgeError('BODY_TOO_LARGE', 'Request body is too large', 413)
  }
  return new Promise((resolve, reject) => {
    const chunks = []
    let size = 0
    let settled = false
    const finish = (error, value) => {
      if (settled) return
      settled = true
      clearTimeout(timer)
      if (error) reject(error)
      else resolve(value)
    }
    const timer = setTimeout(() => {
      request.resume()
      finish(new BridgeError('BODY_TIMEOUT', 'Request body timed out', 408))
    }, timeoutMs)
    request.on('data', (chunk) => {
      size += chunk.length
      if (size > MAX_PNG_BYTES) {
        request.removeAllListeners('data')
        request.resume()
        finish(new BridgeError('BODY_TOO_LARGE', 'Request body is too large', 413))
        return
      }
      chunks.push(chunk)
    })
    request.once('end', () => {
      if (contentLength !== undefined && size !== Number(contentLength)) {
        finish(new BridgeError('TRUNCATED_BODY', 'Request body length did not match'))
        return
      }
      finish(null, Buffer.concat(chunks, size))
    })
    request.once('aborted', () => finish(new BridgeError('CLIENT_DISCONNECTED', 'Client disconnected', 499)))
    request.once('error', () => finish(new BridgeError('INVALID_BODY', 'Request body could not be read')))
  })
}

export function readEmptyBody(request, { timeoutMs = BODY_TIMEOUT_MS } = {}) {
  return new Promise((resolve, reject) => {
    let size = 0
    let settled = false
    const finish = (error) => {
      if (settled) return
      settled = true
      clearTimeout(timer)
      if (error) reject(error)
      else resolve()
    }
    const timer = setTimeout(() => {
      request.resume()
      finish(new BridgeError('BODY_TIMEOUT', 'Request body timed out', 408))
    }, timeoutMs)
    request.on('data', (chunk) => { size += chunk.length })
    request.once('end', () => {
      if (size !== 0) {
        finish(new BridgeError('INVALID_BODY', 'Shutdown request body must be empty'))
        return
      }
      finish()
    })
    request.once('aborted', () => finish(new BridgeError('CLIENT_DISCONNECTED', 'Client disconnected', 499)))
    request.once('error', () => finish(new BridgeError('INVALID_BODY', 'Request body could not be read')))
  })
}

export function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': FIGMA_ORIGIN,
    Vary: 'Origin',
  }
}

export function validatePreflight(request, pathname) {
  assertFigmaOrigin(request)
  const policy = PREFLIGHT_POLICIES[pathname]
  if (!policy) throw new BridgeError('NOT_FOUND', 'Route was not found', 404)
  const method = request.headers['access-control-request-method']
  if (method !== policy.method) throw new BridgeError('INVALID_PREFLIGHT', 'Preflight method is not allowed', 403)
  const requested = String(request.headers['access-control-request-headers'] ?? '')
    .split(',').map((item) => item.trim().toLowerCase()).filter(Boolean)
  const requestedSet = new Set(requested)
  if (requestedSet.size !== policy.headers.length || policy.headers.some((item) => !requestedSet.has(item))) {
    throw new BridgeError('INVALID_PREFLIGHT', 'Preflight headers are not allowed', 403)
  }
  return {
    ...corsHeaders(),
    'Access-Control-Allow-Methods': policy.method,
    'Access-Control-Allow-Headers': policy.headers.join(', '),
    'Access-Control-Max-Age': '600',
  }
}
