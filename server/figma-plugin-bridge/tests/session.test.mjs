import assert from 'node:assert/strict'
import { randomUUID } from 'node:crypto'
import { writeFile } from 'node:fs/promises'
import { test } from 'node:test'

import { BRIDGE_ORIGIN } from '../protocol.mjs'
import { PLUGIN_CLIENT_HEADER, PluginSessionState } from '../session-state.mjs'
import { createBridge } from '../server.mjs'

const capabilities = { version: 'dresser-preset/v1', deviceModels: [], backgrounds: {}, layout: {}, defaults: {} }
function cookieValue(setCookie) { return setCookie.split(';')[0] }
function pluginHeaders(cookie, extra = {}) {
  return { Origin: BRIDGE_ORIGIN, Referer: `${BRIDGE_ORIGIN}/plugin`, Cookie: cookie, 'X-Dresser-Plugin-Client': PLUGIN_CLIENT_HEADER, 'Sec-Fetch-Site': 'same-origin', 'Sec-Fetch-Mode': 'cors', 'Sec-Fetch-Dest': 'empty', ...extra }
}

test('plugin session serves same-origin UI, rotates, and denies mixed auth and shutdown', async () => {
  let calls = 0
  let shutdowns = 0
  const uiPath = `/tmp/dresser-plugin-${randomUUID()}.html`
  await writeFile(uiPath, '<!doctype html><main>Dresser</main>')
  const manager = { async getCapabilities() { calls += 1; return capabilities }, async render() { throw new Error('not expected') } }
  const bridge = createBridge({ manager, token: 'legacy-token', pluginUiPath: uiPath, onShutdown: () => { shutdowns += 1 } })
  await bridge.start()
  try {
    const page = await fetch(`${BRIDGE_ORIGIN}/plugin`, { headers: { Origin: 'null', 'Sec-Fetch-Dest': 'iframe' } })
    assert.equal(page.status, 200)
    assert.match(page.headers.get('content-security-policy'), /frame-ancestors https:\/\/www\.figma\.com/)
    const setCookie = page.headers.get('set-cookie')
    assert.match(setCookie, /^__Host-dresser_plugin=[A-Za-z0-9_-]{43}; Path=\/; HttpOnly; Secure; SameSite=None; Max-Age=600$/)
    const cookie = cookieValue(setCookie)
    assert.equal(bridge.sessionDiagnostics().count, 1)
    assert.equal('value' in bridge.sessionDiagnostics().entries[0], false)
    const allowed = await fetch(`${BRIDGE_ORIGIN}/v1/capabilities`, { headers: pluginHeaders(cookie) })
    assert.equal(allowed.status, 200); assert.equal(allowed.headers.get('access-control-allow-origin'), null); assert.equal(calls, 1)
    const missingMarker = await fetch(`${BRIDGE_ORIGIN}/v1/capabilities`, { headers: pluginHeaders(cookie, { 'X-Dresser-Plugin-Client': 'wrong' }) })
    assert.equal(missingMarker.status, 401); assert.equal(calls, 1)
    const csrf = await fetch(`${BRIDGE_ORIGIN}/v1/capabilities`, { headers: pluginHeaders(cookie, { Origin: 'https://evil.invalid' }) })
    assert.equal(csrf.status, 403); assert.equal(csrf.headers.get('access-control-allow-origin'), null); assert.equal(calls, 1)
    const mixed = await fetch(`${BRIDGE_ORIGIN}/v1/capabilities`, { headers: pluginHeaders(cookie, { Authorization: 'Bearer legacy-token' }) })
    assert.equal(mixed.status, 401); assert.equal(calls, 1)
    const deniedShutdown = await fetch(`${BRIDGE_ORIGIN}/v1/shutdown`, { method: 'POST', headers: pluginHeaders(cookie) })
    assert.equal(deniedShutdown.status, 401); assert.equal(shutdowns, 0)
    const rotated = await fetch(`${BRIDGE_ORIGIN}/plugin`, { headers: { Origin: 'null', 'Sec-Fetch-Dest': 'iframe' } })
    assert.equal(rotated.status, 200)
    const old = await fetch(`${BRIDGE_ORIGIN}/v1/capabilities`, { headers: pluginHeaders(cookie) })
    assert.equal(old.status, 401); assert.match(old.headers.get('set-cookie'), /Max-Age=0/); assert.equal(calls, 1)
    const query = await fetch(`${BRIDGE_ORIGIN}/plugin?x=1`)
    assert.equal(query.status, 404)
    const crossOriginIssue = await fetch(`${BRIDGE_ORIGIN}/plugin`, { headers: { Origin: 'https://evil.invalid', 'Sec-Fetch-Dest': 'iframe' } })
    assert.equal(crossOriginIssue.status, 403)
  } finally { await bridge.stop() }
  assert.equal(bridge.sessionDiagnostics().count, 0)
})

test('plugin session expires without retaining raw values', () => {
  let now = 1_000
  const sessions = new PluginSessionState({ now: () => now })
  const raw = sessions.issue()
  assert.equal(sessions.validate(raw), true)
  assert.doesNotMatch(JSON.stringify(sessions.diagnostics()), new RegExp(raw))
  now += 10 * 60 * 1000
  assert.equal(sessions.validate(raw), false)
  assert.equal(sessions.diagnostics().count, 0)
})

test('restart invalidation rejects every cookie from the previous process state', () => {
  const previous = new PluginSessionState()
  const retainedCookieValue = previous.issue()
  previous.clear()
  const restarted = new PluginSessionState()
  assert.equal(restarted.validate(retainedCookieValue), false)
})
