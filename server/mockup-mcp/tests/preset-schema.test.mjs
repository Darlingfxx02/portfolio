import assert from 'node:assert/strict'
import { test } from 'node:test'

import { validatePreset } from '../preset-schema.mjs'

const capabilities = {
  deviceModels: [
    { id: 'browser-light', label: 'Light Browser', colors: [] },
    { id: 'iPhone 17', label: 'iPhone 17', colors: [{ id: 'iphone-17-black', label: 'Black' }] },
  ],
  backgrounds: {
    picturePacks: [{ id: 'sky', label: 'sky', imageCount: 20 }],
  },
  layout: {
    aspectRatios: [{ id: '16:9', label: '16:9' }],
    padding: { min: 72, max: 72 },
    deviceScale: { min: 60, max: 300 },
    x: { min: -1000, max: 1000 },
    y: { min: -1000, max: 1000 },
  },
}

const validPreset = {
  version: 'dresser-preset/v1',
  device: { modelId: 'iPhone 17', colorId: 'iphone-17-black' },
  background: { mode: 'solid', color: '#112233' },
  layout: { aspectRatioId: '16:9', padding: 72, deviceScale: 150, x: 0, y: 100 },
}

test('validates a closed dresser-preset/v1 object', () => {
  assert.deepEqual(validatePreset(validPreset, capabilities), validPreset)
  assert.throws(() => validatePreset({ ...validPreset, unexpected: true }, capabilities), { code: 'INVALID_PRESET' })
  assert.throws(() => validatePreset({ ...validPreset, layout: { ...validPreset.layout, x: Number.NaN } }, capabilities), { code: 'INVALID_PRESET' })
})

test('rejects unknown IDs, incompatible colors, and out-of-range values', () => {
  assert.throws(() => validatePreset({ ...validPreset, device: { ...validPreset.device, modelId: 'unknown' } }, capabilities), { code: 'UNKNOWN_DEVICE_MODEL' })
  assert.throws(() => validatePreset({ ...validPreset, device: { ...validPreset.device, colorId: 'unknown' } }, capabilities), { code: 'UNKNOWN_DEVICE_COLOR' })
  assert.throws(() => validatePreset({ ...validPreset, layout: { ...validPreset.layout, padding: 73 } }, capabilities), { code: 'INVALID_PRESET' })
})

test('validates picture pack bounds and exact three-color mesh', () => {
  assert.doesNotThrow(() => validatePreset({ ...validPreset, background: { mode: 'picture', packId: 'sky', imageIndex: 20 } }, capabilities))
  assert.throws(() => validatePreset({ ...validPreset, background: { mode: 'picture', packId: 'sky', imageIndex: 21 } }, capabilities), { code: 'UNKNOWN_PICTURE_IMAGE' })
  assert.throws(() => validatePreset({ ...validPreset, background: { mode: 'mesh', colors: ['#111111', '#222222'] } }, capabilities), { code: 'INVALID_PRESET' })
})
