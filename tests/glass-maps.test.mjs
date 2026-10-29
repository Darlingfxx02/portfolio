import assert from 'node:assert/strict'
import { test } from 'node:test'

const moduleUrl = new URL('./dom/map-commit.js', import.meta.resolve('@glass-sdk/liquid-glass/dom'))
const { commitCurrentMaterialMaps } = await import(moduleUrl)

test('a delayed narrow map cannot replace an already displayed wide capsule map', () => {
  const narrow = { width: 79, height: 40 }
  const wide = { width: 128, height: 40 }
  const narrowMap = { textureWidth: 167 }
  const wideMap = { textureWidth: 264 }
  const surface = { wanted: 'narrow', key: 'narrow', maps: narrowMap, shown: narrow }
  // The narrow request finished, but its image warm-up callback is still queued.
  const finishOldWarmup = () => commitCurrentMaterialMaps(surface, 'narrow', narrow, narrowMap)
  surface.wanted = surface.key = 'wide'
  assert.equal(commitCurrentMaterialMaps(surface, 'wide', wide, wideMap), true)
  assert.equal(finishOldWarmup(), false)
  assert.equal(surface.maps, wideMap)
  assert.equal(surface.shown, wide)
})

test('a completed request is stale as soon as the live geometry asks for another map', () => {
  const displayed = { textureWidth: 167 }
  const surface = { wanted: 'wide', key: 'narrow', maps: displayed, shown: { width: 79 } }
  assert.equal(commitCurrentMaterialMaps(surface, 'narrow', { width: 80 }, { textureWidth: 168 }), false)
  assert.equal(surface.maps, displayed)
  assert.equal(surface.shown.width, 79)
})

test('the current request commits its map and matching contour together', () => {
  const surface = { wanted: 'wide', key: 'wide', error: new Error('previous map') }
  const geometry = { width: 128, height: 40 }
  const maps = { textureWidth: 264 }
  assert.equal(commitCurrentMaterialMaps(surface, 'wide', geometry, maps), true)
  assert.equal(surface.maps, maps)
  assert.equal(surface.shown, geometry)
  assert.equal(surface.error, undefined)
})
