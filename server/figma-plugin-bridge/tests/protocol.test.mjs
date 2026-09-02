import assert from 'node:assert/strict'
import { test } from 'node:test'

import { BridgeError, parsePresetHeader, validatePng, validatePreflight } from '../protocol.mjs'

export const PNG_1X1 = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=',
  'base64',
)

test('strict base64url preset parser accepts JSON and rejects alternate encodings', () => {
  const preset = { version: 'dresser-preset/v1', value: 1 }
  const encoded = Buffer.from(JSON.stringify(preset)).toString('base64url')
  assert.deepEqual(parsePresetHeader(encoded), preset)
  assert.throws(() => parsePresetHeader(`${encoded}=`), { code: 'INVALID_PRESET' })
  assert.throws(() => parsePresetHeader('not-json'), { code: 'INVALID_PRESET' })
})

test('PNG validation verifies chunks, CRCs, dimensions, truncation, and trailing input', () => {
  assert.deepEqual(validatePng(PNG_1X1), { width: 1, height: 1 })
  const corrupt = Buffer.from(PNG_1X1)
  corrupt[corrupt.length - 5] ^= 1
  assert.throws(() => validatePng(corrupt), { code: 'INVALID_PNG' })
  assert.throws(() => validatePng(PNG_1X1.subarray(0, -1)), { code: 'INVALID_PNG' })
  assert.throws(() => validatePng(Buffer.concat([PNG_1X1, Buffer.from([0])])), { code: 'INVALID_PNG' })
  assert.throws(() => validatePng(Buffer.alloc(45)), BridgeError)
})

test('route-specific preflight policy emits canonical permissions', () => {
  const request = {
    headers: {
      origin: 'null',
      'access-control-request-method': 'POST',
      'access-control-request-headers': 'X-Dresser-Preset, AUTHORIZATION, Content-Type',
    },
  }
  assert.deepEqual(validatePreflight(request, '/v1/render'), {
    'Access-Control-Allow-Origin': 'null',
    Vary: 'Origin',
    'Access-Control-Allow-Methods': 'POST',
    'Access-Control-Allow-Headers': 'authorization, content-type, x-dresser-preset',
    'Access-Control-Max-Age': '600',
  })
  assert.throws(() => validatePreflight(request, '/v1/capabilities'), { code: 'INVALID_PREFLIGHT' })
  assert.throws(() => validatePreflight(request, '/v1/unknown'), { code: 'NOT_FOUND' })
})
