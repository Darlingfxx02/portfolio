import assert from 'node:assert/strict'
import { test } from 'node:test'
import { GLASS_DEFAULTS, normalizeGlassSettings, glassFill, glassSamplingGutter } from '../src/lib/glass/glassSettings.ts'

const opticsUrl = new URL('./dom/optics.js', import.meta.resolve('@glass-sdk/liquid-glass/dom'))
const { readOptics, mapOptics, refractionMarkup, opticalToneMarkup } = await import(opticsUrl)

function surface(settings) {
  let attribute = settings === null ? null : JSON.stringify(settings)
  const result = {
    element: { getAttribute: () => attribute },
    options: {},
    setAttribute(value) { attribute = value },
  }
  readOptics(result)
  return result
}

test('stored settings are bounded and cannot inject colors or non-finite values', () => {
  const result = normalizeGlassSettings({
    shell: { depth: -1, frost: 1e6, brightness: Infinity, refraction: NaN, fillColor: 'url(#anything)' },
    indicator: { fillColor: '#8aB1C2', dispersion: -0.2 },
  })
  assert.equal(result.shell.depth, 1)
  assert.equal(result.shell.frost, 24)
  assert.equal(result.shell.brightness, GLASS_DEFAULTS.shell.brightness)
  assert.equal(result.shell.refraction, GLASS_DEFAULTS.shell.refraction)
  assert.equal(result.shell.fillColor, GLASS_DEFAULTS.shell.fillColor)
  assert.equal(result.indicator.fillColor, '#8aB1C2')
  assert.equal(result.indicator.dispersion, 0)
})

test('incomplete or corrupt preferences restore defaults without sharing mutable objects', () => {
  for (const input of [null, '', [], { shell: null }, { indicator: false }]) {
    assert.deepEqual(normalizeGlassSettings(input), GLASS_DEFAULTS)
  }
  const copy = normalizeGlassSettings(GLASS_DEFAULTS)
  copy.shell.depth = 50
  assert.equal(GLASS_DEFAULTS.shell.depth, 18)
  assert.equal(copy.indicator.depth, GLASS_DEFAULTS.indicator.depth)
})

test('all seven Figma-style controls reach the material without registering a new surface', () => {
  const item = surface(GLASS_DEFAULTS.shell)
  const next = { ...GLASS_DEFAULTS.shell, lightAngle: 90, lightIntensity: 0, refraction: 0,
    depth: 40, dispersion: 0.8, frost: 12, splay: 0.9 }
  item.setAttribute(JSON.stringify(next))
  assert.equal(readOptics(item), true)
  for (const key of ['lightAngle', 'lightIntensity', 'refraction', 'depth', 'dispersion', 'frost', 'splay']) {
    assert.equal(item.options.optics[key], next[key])
  }
  assert.deepEqual(mapOptics(item), { depth: 40, lightAngle: 90, lightIntensity: 0, splay: 0.9 })
  assert.equal(readOptics(item), false)
})

test('removing controls restores the upstream material; malformed attributes are safe', () => {
  const item = surface(GLASS_DEFAULTS.shell)
  item.setAttribute(null)
  assert.equal(readOptics(item), true)
  assert.equal(item.options.optics, undefined)
  item.setAttribute('{invalid json')
  assert.doesNotThrow(() => readOptics(item))
  assert.equal(item.options.optics, undefined)
  item.setAttribute('{"depth":0,"frost":-1,"lightIntensity":3}')
  readOptics(item)
  assert.equal(item.options.optics.depth, 1)
  assert.equal(item.options.optics.frost, 0)
  assert.equal(item.options.optics.lightIntensity, 1)
})

test('zero dispersion uses one background sample; dispersion separates real RGB samples', () => {
  const single = refractionMarkup('lens', 'background', 20, { optics: { dispersion: 0 } })
  assert.equal((single.match(/<feDisplacementMap /g) ?? []).length, 1)
  const split = refractionMarkup('lens', 'background', 20, { optics: { dispersion: 1 } })
  assert.equal((split.match(/<feDisplacementMap /g) ?? []).length, 3)
  assert.match(split, /scale="23"/)
  assert.match(split, /scale="20"/)
  assert.match(split, /scale="17"/)
  assert.match(split, /in2="lensgreenSample" operator="in" result="lensrefracted"/)
  const off = refractionMarkup('lens', 'background', 0, { optics: { dispersion: 1 } })
  assert.equal((off.match(/scale="0"/g) ?? []).length, 3)
})

test('neutral optical tone has no built-in grey lift and never changes alpha', () => {
  const markup = opticalToneMarkup('lens', { optics: { brightness: 1, saturation: 1, shadowLift: 0 } })
  assert.equal((markup.match(/slope="1" intercept="0"/g) ?? []).length, 3)
  assert.doesNotMatch(markup, /feFuncA/)
  assert.equal(opticalToneMarkup('lens', {}), undefined)
})

test('fill is a separate flat color, including fully transparent glass', () => {
  assert.equal(glassFill({ ...GLASS_DEFAULTS.shell, fillColor: '#aabbcc', fillOpacity: 0 }), 'rgb(170 187 204 / 0)')
  const dark = surface({ ...GLASS_DEFAULTS.shell, fillColor: '#000000', fillOpacity: 1 })
  const light = surface({ ...GLASS_DEFAULTS.shell, fillColor: '#ffffff', fillOpacity: 0 })
  assert.deepEqual(dark.options.optics, light.options.optics)
})

test('the paint gutter includes the full reach of both lenses at maximum settings', () => {
  assert.equal(glassSamplingGutter(GLASS_DEFAULTS), 64)
  const maximum = { ...GLASS_DEFAULTS.shell, frost: 24, dispersion: 1, refraction: 1 }
  assert.equal(glassSamplingGutter({ shell: maximum, indicator: maximum }), 288)
})
