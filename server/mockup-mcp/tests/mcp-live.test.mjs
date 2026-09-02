import assert from 'node:assert/strict'
import { access, readdir, unlink } from 'node:fs/promises'
import { connect } from 'node:net'
import { tmpdir } from 'node:os'
import { resolve } from 'node:path'
import { test } from 'node:test'

import { Client } from '@modelcontextprotocol/sdk/client/index.js'
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js'
import { InMemoryTransport } from '@modelcontextprotocol/sdk/inMemory.js'

import { BrowserSessionManager, DresserError, OUTPUT_ROOT } from '../browser-session.mjs'
import { createDresserMcpServer } from '../server.mjs'

const projectRoot = resolve(import.meta.dirname, '../../..')
const samplePath = resolve(projectRoot, 'public/zinda/series/main-mobile.jpg')
const temporarySessions = async () => (await readdir(tmpdir())).filter((name) => name.startsWith('dresser-mcp-')).sort()
const outputArtifacts = async () => readdir(OUTPUT_ROOT).catch(() => [])

function pidIsAlive(pid) {
  try {
    process.kill(pid, 0)
    return true
  } catch {
    return false
  }
}

function portIsOpen(port) {
  return new Promise((resolvePort) => {
    const socket = connect({ host: '127.0.0.1', port })
    const finish = (open) => {
      socket.destroy()
      resolvePort(open)
    }
    socket.setTimeout(300, () => finish(false))
    socket.once('connect', () => finish(true))
    socket.once('error', () => finish(false))
  })
}

test('stdio discovery exposes exactly the two public tools and live capabilities', { timeout: 30_000 }, async () => {
  const tempBefore = await temporarySessions()
  const client = new Client({ name: 'dresser-mcp-test', version: '1.0.0' })
  const transport = new StdioClientTransport({
    command: process.execPath,
    args: [resolve(projectRoot, 'server/mockup-mcp/server.mjs')],
    cwd: projectRoot,
    stderr: 'pipe',
  })
  await client.connect(transport)
  try {
    const listed = await client.listTools()
    assert.deepEqual(listed.tools.map((tool) => tool.name).sort(), ['dresser_get_capabilities', 'dresser_render_png'])
    for (const tool of listed.tools) {
      assert.equal(tool.inputSchema.type, 'object')
      assert.equal(tool.outputSchema.type, 'object')
    }
    const response = await client.callTool({ name: 'dresser_get_capabilities', arguments: {} })
    assert.equal(response.isError, undefined)
    assert.equal(response.structuredContent.version, 'dresser-preset/v1')
    assert.equal(response.structuredContent.mirror.route, '/tools/mockup')
    assert.equal(response.structuredContent.source.fitMode, 'contain')
    assert.equal(response.structuredContent.deviceModels.length, 28)
    assert.deepEqual(response.structuredContent.backgrounds.modes, ['solid', 'mesh', 'transparent', 'picture'])
    assert.deepEqual(response.structuredContent.layout.padding, { default: 72, min: 72, max: 72, step: 1 })
    const rendered = await client.callTool({
      name: 'dresser_render_png',
      arguments: {
        sourcePath: samplePath,
        preset: {
          version: 'dresser-preset/v1',
          device: { modelId: 'iPhone 17', colorId: 'iphone-17-black' },
          background: { mode: 'solid', color: '#C84B31' },
          layout: { aspectRatioId: '16:9', padding: 72, deviceScale: 130, x: -80, y: 60 },
        },
      },
    })
    assert.equal(rendered.isError, undefined)
    assert.equal(rendered.structuredContent.mimeType, 'image/png')
    assert.equal(rendered.structuredContent.path.startsWith(`${OUTPUT_ROOT}/`), true)
    await unlink(rendered.structuredContent.path)
  } finally {
    await transport.close()
  }
  assert.deepEqual(await temporarySessions(), tempBefore)
})

test('unavailable controlled browser returns a stable bounded error', async () => {
  const manager = new BrowserSessionManager({
    launch: async () => {
      throw new DresserError('BROWSER_UNAVAILABLE', 'Controlled browser is unavailable')
    },
  })
  await assert.rejects(manager.getCapabilities(), { code: 'BROWSER_UNAVAILABLE' })
})

test('mirror, timeout, and download failures create no artifact', async () => {
  const capabilities = {
    deviceModels: [{ id: 'iPhone 17', label: 'iPhone 17', colors: [{ id: 'iphone-17-black', label: 'Black' }] }],
    backgrounds: { picturePacks: [] },
    layout: {
      aspectRatios: [{ id: '16:9', label: '16:9' }],
      padding: { min: 72, max: 72 },
      deviceScale: { min: 60, max: 300 },
      x: { min: -1000, max: 1000 },
      y: { min: -1000, max: 1000 },
    },
  }
  const preset = {
    version: 'dresser-preset/v1',
    device: { modelId: 'iPhone 17', colorId: 'iphone-17-black' },
    background: { mode: 'solid', color: '#112233' },
    layout: { aspectRatioId: '16:9', padding: 72, deviceScale: 150, x: 0, y: 100 },
  }
  const before = await outputArtifacts()
  for (const code of ['MIRROR_UNAVAILABLE', 'RENDER_TIMEOUT', 'DOWNLOAD_FAILED']) {
    const manager = new BrowserSessionManager({ launch: async () => { throw new DresserError(code, 'Bounded operation failure') } })
    manager.capabilities = capabilities
    await assert.rejects(manager.render(samplePath, preset), { code })
  }
  assert.deepEqual(await outputArtifacts(), before)
})

test('live export timeout returns DOWNLOAD_FAILED and cleans owned browser resources', { timeout: 30_000 }, async () => {
  const capabilities = await new BrowserSessionManager().getCapabilities()
  const events = []
  const manager = new BrowserSessionManager({
    timeoutMs: 50,
    internalTestHooks: {
      acceptDownloadWillBegin: () => false,
      onEvent: (event) => events.push(event),
    },
  })
  manager.capabilities = capabilities
  const outputBefore = await outputArtifacts()
  const port5173Before = await portIsOpen(5173)
  const unhandledRejections = []
  const uncaughtExceptions = []
  const onUnhandledRejection = (reason) => unhandledRejections.push(reason)
  const onUncaughtException = (error) => uncaughtExceptions.push(error)
  process.on('unhandledRejection', onUnhandledRejection)
  process.on('uncaughtExceptionMonitor', onUncaughtException)

  const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair()
  const server = createDresserMcpServer(manager)
  const client = new Client({ name: 'dresser-timeout-test', version: '1.0.0' })
  await server.connect(serverTransport)
  await client.connect(clientTransport)
  let response
  try {
    response = await client.callTool({
      name: 'dresser_render_png',
      arguments: {
        sourcePath: samplePath,
        preset: {
          version: 'dresser-preset/v1',
          device: { modelId: 'iPhone 17', colorId: 'iphone-17-black' },
          background: { mode: 'solid', color: '#C84B31' },
          layout: { aspectRatioId: '16:9', padding: 72, deviceScale: 130, x: -80, y: 60 },
        },
      },
    })
    await new Promise((resolveDelay) => setTimeout(resolveDelay, 100))
  } finally {
    process.off('unhandledRejection', onUnhandledRejection)
    process.off('uncaughtExceptionMonitor', onUncaughtException)
    await client.close()
    await server.close()
  }

  assert.equal(response.isError, true)
  assert.deepEqual(JSON.parse(response.content[0].text), {
    code: 'DOWNLOAD_FAILED',
    message: 'Controlled browser operation timed out',
  })
  assert.equal(events.some((event) => event.type === 'export-invoked'), true)
  const started = events.find((event) => event.type === 'session-started')
  const cleaned = events.find((event) => event.type === 'session-cleaned')
  assert.ok(started)
  assert.ok(cleaned)
  assert.equal(cleaned.chromePid, started.chromePid)
  assert.equal(cleaned.mirrorPid, started.mirrorPid)
  assert.equal(pidIsAlive(started.chromePid), false)
  assert.equal(pidIsAlive(started.mirrorPid), false)
  assert.equal(await portIsOpen(started.mirrorPort), false)
  await assert.rejects(access(started.profileRoot))
  await assert.rejects(access(started.downloadsRoot))
  assert.deepEqual(await outputArtifacts(), outputBefore)
  assert.equal(await portIsOpen(5173), port5173Before)
  assert.deepEqual(unhandledRejections, [])
  assert.deepEqual(uncaughtExceptions, [])
  assert.equal(process.exitCode ?? 0, 0)
})

test('live sequential renders are isolated and an overlap receives stable BUSY', { timeout: 60_000 }, async (context) => {
  const tempBefore = await temporarySessions()
  const events = []
  const manager = new BrowserSessionManager({
    timeoutMs: 30_000,
    internalTestHooks: { onEvent: (event) => events.push(event) },
  })
  await manager.getCapabilities()
  const solidPreset = {
    version: 'dresser-preset/v1',
    device: { modelId: 'iPhone 17', colorId: 'iphone-17-black' },
    background: { mode: 'solid', color: '#C84B31' },
    layout: { aspectRatioId: '16:9', padding: 72, deviceScale: 130, x: -80, y: 60 },
  }
  const meshPreset = {
    version: 'dresser-preset/v1',
    device: { modelId: 'iPad Pro 11″ (M4)', colorId: 'ipad-pro-m4-11-space-black' },
    background: { mode: 'mesh', colors: ['#120A2A', '#7C35FF', '#FFE066'] },
    layout: { aspectRatioId: '1:1', padding: 72, deviceScale: 90, x: 120, y: -100 },
  }
  const solid = await manager.render(samplePath, solidPreset)
  const mesh = await manager.render(samplePath, meshPreset)
  context.after(async () => {
    await Promise.all([solid.path, mesh.path].map((path) => unlink(path).catch(() => {})))
  })
  assert.equal(solid.path.startsWith(`${OUTPUT_ROOT}/`), true)
  assert.equal(mesh.path.startsWith(`${OUTPUT_ROOT}/`), true)
  assert.notEqual(solid.path, mesh.path)
  assert.notEqual(solid.sha256, mesh.sha256)
  assert.equal(solid.width >= 2079 && solid.width <= 2080, true)
  assert.equal(solid.height, 1170)
  assert.deepEqual([mesh.width, mesh.height], [2080, 2080])
  const fitEvents = events.filter((event) => event.type === 'screen-fit-applied')
  assert.equal(fitEvents.length, 2)
  assert.equal(fitEvents.every((event) => event.appliedCount > 0), true)
  assert.equal(fitEvents.every((event) => event.normalizedCount > 0), true)
  assert.equal(fitEvents.every((event) => event.after.every((fit) => fit === 'contain')), true)
  assert.equal(fitEvents.every((event) => event.geometry.every((item) => (
    Math.abs((item.naturalWidth / item.naturalHeight) - (item.parentWidth / item.parentHeight)) < 0.002
  ))), true)

  const first = manager.render(samplePath, solidPreset)
  await new Promise((resolveDelay) => setTimeout(resolveDelay, 100))
  await assert.rejects(manager.render(samplePath, meshPreset), { code: 'BUSY' })
  const overlappedWinner = await first
  await unlink(overlappedWinner.path)
  assert.deepEqual(await temporarySessions(), tempBefore)
})
