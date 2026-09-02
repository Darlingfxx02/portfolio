import { createHash, randomUUID } from 'node:crypto'
import { createServer } from 'node:http'
import { createReadStream } from 'node:fs'
import {
  access,
  copyFile,
  mkdir,
  mkdtemp,
  open,
  readFile,
  realpath,
  rm,
  stat,
  unlink,
} from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { basename, dirname, extname, join, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawn } from 'node:child_process'
import { constants as fsConstants } from 'node:fs'

import { PRESET_VERSION, capabilitiesSchema, validatePreset } from './preset-schema.mjs'

const MODULE_DIR = dirname(fileURLToPath(import.meta.url))
export const PROJECT_ROOT = resolve(MODULE_DIR, '../..')
export const MIRROR_ROOT = join(PROJECT_ROOT, '.local', 'dresser-mirror')
export const OUTPUT_ROOT = join(PROJECT_ROOT, '.local', 'dresser-mcp-output')
export const MAX_SOURCE_BYTES = 25 * 1024 * 1024
const MIRROR_ROUTE = '/tools/mockup'
const DEFAULT_TIMEOUT_MS = 20_000
const CHROME_PATHS = process.env.DRESSER_CHROME_PATH
  ? [process.env.DRESSER_CHROME_PATH]
  : ['/Applications/Google Chrome.app/Contents/MacOS/Google Chrome']

export class DresserError extends Error {
  constructor(code, message) {
    super(message)
    this.name = 'DresserError'
    this.code = code
  }
}

function delay(milliseconds) {
  return new Promise((resolveDelay) => setTimeout(resolveDelay, milliseconds))
}

function settle(promise) {
  return promise.then(
    (value) => ({ status: 'fulfilled', value }),
    (reason) => ({ status: 'rejected', reason }),
  )
}

async function withTimeout(promise, milliseconds, code, message) {
  let timer
  try {
    return await Promise.race([
      promise,
      new Promise((_, reject) => {
        timer = setTimeout(() => reject(new DresserError(code, message)), milliseconds)
      }),
    ])
  } finally {
    clearTimeout(timer)
  }
}

async function freeLoopbackPort() {
  const server = createServer()
  await new Promise((resolveListen, reject) => {
    server.once('error', reject)
    server.listen(0, '127.0.0.1', resolveListen)
  })
  const address = server.address()
  await new Promise((resolveClose) => server.close(resolveClose))
  return address.port
}

async function waitForHttp(url, processRef, timeoutMs = 8_000) {
  const startedAt = Date.now()
  while (Date.now() - startedAt < timeoutMs) {
    if (processRef.exitCode !== null) throw new DresserError('MIRROR_UNAVAILABLE', 'Local mirror could not be started')
    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(500) })
      if (response.ok) return
    } catch {
      // The bounded loop handles startup races without exposing connection details.
    }
    await delay(50)
  }
  throw new DresserError('MIRROR_UNAVAILABLE', 'Local mirror did not become ready')
}

async function waitForFile(path, processRef, timeoutMs = 8_000) {
  const startedAt = Date.now()
  while (Date.now() - startedAt < timeoutMs) {
    if (processRef.exitCode !== null) throw new DresserError('BROWSER_UNAVAILABLE', 'Controlled browser could not be started')
    try {
      return await readFile(path, 'utf8')
    } catch {
      await delay(50)
    }
  }
  throw new DresserError('BROWSER_UNAVAILABLE', 'Controlled browser did not become ready')
}

async function stopProcess(processRef) {
  if (!processRef || processRef.exitCode !== null) return
  processRef.kill('SIGTERM')
  await Promise.race([
    new Promise((resolveExit) => processRef.once('exit', resolveExit)),
    delay(1_000).then(() => {
      if (processRef.exitCode === null) processRef.kill('SIGKILL')
    }),
  ])
  if (processRef.exitCode === null) {
    await Promise.race([new Promise((resolveExit) => processRef.once('exit', resolveExit)), delay(1_000)])
  }
}

async function findChrome() {
  for (const candidate of CHROME_PATHS) {
    try {
      await access(candidate, fsConstants.X_OK)
      return candidate
    } catch {
      // Continue to the next explicit local candidate.
    }
  }
  throw new DresserError('BROWSER_UNAVAILABLE', 'Google Chrome is unavailable')
}

class CdpConnection {
  constructor(socket) {
    this.socket = socket
    this.sequence = 0
    this.pending = new Map()
    this.listeners = new Map()
    socket.addEventListener('message', (message) => this.#onMessage(message))
    socket.addEventListener('close', () => this.#rejectPending())
  }

  static async connect(url) {
    const socket = new WebSocket(url)
    await withTimeout(new Promise((resolveOpen, reject) => {
      socket.addEventListener('open', resolveOpen, { once: true })
      socket.addEventListener('error', reject, { once: true })
    }), 5_000, 'BROWSER_UNAVAILABLE', 'Could not connect to the controlled browser')
    return new CdpConnection(socket)
  }

  #onMessage(message) {
    let payload
    try {
      payload = JSON.parse(message.data)
    } catch {
      return
    }
    if (payload.id) {
      const request = this.pending.get(payload.id)
      if (!request) return
      this.pending.delete(payload.id)
      if (payload.error) request.reject(new DresserError('BROWSER_PROTOCOL_ERROR', 'Controlled browser command failed'))
      else request.resolve(payload.result)
      return
    }
    const listeners = this.listeners.get(payload.method)
    if (listeners) for (const listener of [...listeners]) listener(payload.params)
  }

  #rejectPending() {
    for (const request of this.pending.values()) {
      request.reject(new DresserError('BROWSER_UNAVAILABLE', 'Controlled browser closed unexpectedly'))
    }
    this.pending.clear()
  }

  send(method, params = {}) {
    const id = ++this.sequence
    return new Promise((resolveSend, reject) => {
      this.pending.set(id, { resolve: resolveSend, reject })
      this.socket.send(JSON.stringify({ id, method, params }))
    })
  }

  on(method, listener) {
    if (!this.listeners.has(method)) this.listeners.set(method, new Set())
    this.listeners.get(method).add(listener)
    return () => this.listeners.get(method)?.delete(listener)
  }

  waitFor(method, predicate = () => true, timeoutMs = DEFAULT_TIMEOUT_MS, code = 'RENDER_TIMEOUT') {
    return withTimeout(new Promise((resolveEvent) => {
      const remove = this.on(method, (params) => {
        if (!predicate(params)) return
        remove()
        resolveEvent(params)
      })
    }), timeoutMs, code, 'Controlled browser operation timed out')
  }

  async evaluate(expression) {
    const result = await this.send('Runtime.evaluate', {
      expression,
      awaitPromise: true,
      returnByValue: true,
      userGesture: true,
    })
    if (result.exceptionDetails) throw new DresserError('BROWSER_UI_ERROR', 'Dresser browser operation failed')
    return result.result.value
  }

  close() {
    this.socket.close()
  }
}

function allowedBrowserUrl(url, origin) {
  return url === 'about:blank' || url.startsWith(origin) || url.startsWith('blob:') || url.startsWith('data:')
}

async function launchSession(internalTestHooks) {
  const chromePath = await findChrome()
  const mirrorPort = await freeLoopbackPort()
  const origin = `http://127.0.0.1:${mirrorPort}`
  const sessionRoot = await mkdtemp(join(tmpdir(), 'dresser-mcp-'))
  const profileRoot = join(sessionRoot, 'profile')
  const downloadsRoot = join(sessionRoot, 'downloads')
  await mkdir(profileRoot)
  await mkdir(downloadsRoot)

  const mirrorProcess = spawn(process.execPath, [join(MIRROR_ROOT, 'server.mjs')], {
    cwd: MIRROR_ROOT,
    env: { ...process.env, DRESSER_LOCAL_PORT: String(mirrorPort) },
    stdio: 'ignore',
  })
  let chromeProcess
  let cdp
  const requests = []
  const consoleMessages = []
  try {
    await waitForHttp(`${origin}${MIRROR_ROUTE}`, mirrorProcess)
    chromeProcess = spawn(chromePath, [
      '--headless=new',
      '--remote-debugging-address=127.0.0.1',
      '--remote-debugging-port=0',
      `--user-data-dir=${profileRoot}`,
      '--no-first-run',
      '--no-default-browser-check',
      '--disable-background-networking',
      '--disable-component-update',
      '--disable-sync',
      '--disable-client-side-phishing-detection',
      '--disable-default-apps',
      '--metrics-recording-only',
      'about:blank',
    ], { stdio: 'ignore' })
    const activePort = await waitForFile(join(profileRoot, 'DevToolsActivePort'), chromeProcess)
    const [browserPort] = activePort.trim().split('\n')
    const target = await fetch(`http://127.0.0.1:${browserPort}/json/new?about:blank`, { method: 'PUT' }).then((response) => {
      if (!response.ok) throw new DresserError('BROWSER_UNAVAILABLE', 'Controlled browser page could not be created')
      return response.json()
    })
    cdp = await CdpConnection.connect(target.webSocketDebuggerUrl)
    await cdp.send('Page.enable')
    await cdp.send('Runtime.enable')
    await cdp.send('DOM.enable')
    await cdp.send('Network.enable')
    await cdp.send('Browser.setDownloadBehavior', {
      behavior: 'allowAndName',
      browserContextId: target.browserContextId,
      downloadPath: downloadsRoot,
      eventsEnabled: true,
    })
    cdp.on('Network.requestWillBeSent', (event) => {
      requests.push({ url: event.request.url, method: event.request.method, hasPostData: Boolean(event.request.hasPostData) })
    })
    cdp.on('Runtime.consoleAPICalled', (event) => {
      consoleMessages.push(event.args.map((item) => String(item.value ?? item.description ?? '')).join(' '))
    })
    const loaded = cdp.waitFor('Page.loadEventFired', () => true, 8_000, 'MIRROR_UNAVAILABLE')
    await cdp.send('Page.navigate', { url: `${origin}${MIRROR_ROUTE}` })
    await loaded
    const ownedResources = {
      chromePid: chromeProcess.pid,
      mirrorPid: mirrorProcess.pid,
      mirrorPort,
      profileRoot,
      downloadsRoot,
    }
    internalTestHooks?.onEvent?.({ type: 'session-started', ...ownedResources })
    let closePromise
    return {
      cdp,
      downloadsRoot,
      origin,
      requests,
      consoleMessages,
      close() {
        closePromise ??= (async () => {
          cdp.close()
          await stopProcess(chromeProcess)
          await stopProcess(mirrorProcess)
          await rm(sessionRoot, { recursive: true, force: true, maxRetries: 3, retryDelay: 50 })
          internalTestHooks?.onEvent?.({ type: 'session-cleaned', ...ownedResources })
        })()
        return closePromise
      },
    }
  } catch (error) {
    cdp?.close()
    await stopProcess(chromeProcess)
    await stopProcess(mirrorProcess)
    await rm(sessionRoot, { recursive: true, force: true, maxRetries: 3, retryDelay: 50 })
    if (error instanceof DresserError) throw error
    throw new DresserError('BROWSER_UNAVAILABLE', 'Controlled browser session failed')
  }
}

async function waitForSelector(cdp, selector, timeoutMs = DEFAULT_TIMEOUT_MS) {
  const encoded = JSON.stringify(selector)
  const startedAt = Date.now()
  while (Date.now() - startedAt < timeoutMs) {
    if (await cdp.evaluate(`Boolean(document.querySelector(${encoded}))`)) return
    await delay(50)
  }
  throw new DresserError('RENDER_TIMEOUT', 'Dresser did not reach the expected state')
}

async function importSource(cdp, sourcePath) {
  const documentNode = await cdp.send('DOM.getDocument')
  const inputNode = await cdp.send('DOM.querySelector', {
    nodeId: documentNode.root.nodeId,
    selector: 'input[type=file]',
  })
  if (!inputNode.nodeId) throw new DresserError('BROWSER_UI_ERROR', 'Dresser import control is unavailable')
  await cdp.send('DOM.setFileInputFiles', { nodeId: inputNode.nodeId, files: [sourcePath] })
  await waitForSelector(cdp, '.properties-drawer')
  await waitForSelector(cdp, '.export-stage')
  await cdp.evaluate(`new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)))`)
}

async function clickOption(cdp, triggerLabel, value) {
  const result = await cdp.evaluate(`(() => {
    const trigger = document.querySelector('button[aria-label=${JSON.stringify(triggerLabel)}]')
    if (!trigger) return 'missing-trigger'
    if (trigger.getAttribute('aria-expanded') !== 'true') trigger.click()
    return 'opened'
  })()`)
  if (result !== 'opened') throw new DresserError('BROWSER_UI_ERROR', 'Dresser selection control is unavailable')
  await waitForSelector(cdp, '[role=option]')
  const selected = await cdp.evaluate(`(() => {
    const trigger = document.querySelector('button[aria-label=${JSON.stringify(triggerLabel)}]')
    const listbox = document.getElementById(trigger?.getAttribute('aria-controls'))
    const option = [...(listbox?.querySelectorAll('[role=option]') ?? [])].find((item) => item.dataset.value === ${JSON.stringify(value)})
    if (!option) return false
    option.click()
    return true
  })()`)
  if (!selected) throw new DresserError('BROWSER_UI_ERROR', 'Dresser selection value is unavailable')
  await cdp.evaluate(`new Promise((resolve) => requestAnimationFrame(resolve))`)
}

async function clickTab(cdp, groupLabel, value) {
  const clicked = await cdp.evaluate(`(() => {
    const group = document.querySelector('[aria-label=${JSON.stringify(groupLabel)}]')
    const tab = group && [...group.querySelectorAll('[role=tab]')].find((item) => item.textContent.trim().startsWith(${JSON.stringify(value)}))
    if (!tab) return false
    tab.click()
    return true
  })()`)
  if (!clicked) throw new DresserError('BROWSER_UI_ERROR', 'Dresser tab value is unavailable')
  await cdp.evaluate(`new Promise((resolve) => requestAnimationFrame(resolve))`)
}

async function setRange(cdp, label, value) {
  const changed = await cdp.evaluate(`(() => {
    const input = document.querySelector('input[type=range][aria-label=${JSON.stringify(label)}]')
    if (!input) return false
    const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set
    setter.call(input, ${JSON.stringify(String(value))})
    input.dispatchEvent(new Event('input', { bubbles: true }))
    input.dispatchEvent(new Event('change', { bubbles: true }))
    return true
  })()`)
  if (!changed) throw new DresserError('BROWSER_UI_ERROR', 'Dresser numeric control is unavailable')
}

async function setColorPicker(cdp, triggerSelector, color) {
  const opened = await cdp.evaluate(`(() => {
    const trigger = document.querySelector(${JSON.stringify(triggerSelector)})
    if (!trigger) return false
    trigger.click()
    return true
  })()`)
  if (!opened) throw new DresserError('BROWSER_UI_ERROR', 'Dresser color control is unavailable')
  await waitForSelector(cdp, 'input[aria-label="Hex value"]')
  const focused = await cdp.evaluate(`(() => {
    const input = document.querySelector('input[aria-label="Hex value"]')
    if (!input) return false
    input.focus()
    input.select()
    return true
  })()`)
  if (!focused) throw new DresserError('BROWSER_UI_ERROR', 'Dresser color value could not be applied')
  await cdp.send('Input.insertText', { text: color.slice(1).toUpperCase() })
  await cdp.send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Enter', code: 'Enter' })
  await cdp.send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Enter', code: 'Enter' })
  await cdp.send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Escape', code: 'Escape' })
  await cdp.send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Escape', code: 'Escape' })
  await cdp.evaluate(`new Promise((resolve) => requestAnimationFrame(resolve))`)
}

async function discoverCapabilitiesInSession(session) {
  const { cdp } = session
  await importSource(cdp, join(MIRROR_ROOT, 'qa-loaded.png'))
  const modelOptions = await cdp.evaluate(`(async () => {
    const trigger = document.querySelector('button[aria-label="Choose device model"]')
    if (trigger.getAttribute('aria-expanded') !== 'true') trigger.click()
    await new Promise((resolve) => requestAnimationFrame(resolve))
    const listbox = document.getElementById(trigger.getAttribute('aria-controls'))
    return [...listbox.querySelectorAll('[role=option]')].map((item) => ({ id: item.dataset.value, label: item.textContent.trim() }))
  })()`)
  await cdp.evaluate(`(() => { const trigger = document.querySelector('button[aria-label="Choose device model"]'); document.getElementById(trigger.getAttribute('aria-controls'))?.querySelector('[role=option][aria-selected="true"]')?.click() })()`)
  const deviceModels = []
  for (const option of modelOptions) {
    if (['none', 'browser-light', 'browser-dark'].includes(option.id)) {
      deviceModels.push({ ...option, colors: [] })
      continue
    }
    await clickOption(cdp, 'Choose device model', option.id)
    const colors = await cdp.evaluate(`(async () => {
      const trigger = document.querySelector('button[aria-label="Choose device color"]')
      if (!trigger) return []
      if (trigger.getAttribute('aria-expanded') !== 'true') trigger.click()
      await new Promise((resolve) => requestAnimationFrame(resolve))
      const listbox = document.getElementById(trigger.getAttribute('aria-controls'))
      return [...listbox.querySelectorAll('[role=option]')].map((item) => ({ id: item.dataset.value, label: item.textContent.trim() }))
    })()`)
    await cdp.evaluate(`(() => { const trigger = document.querySelector('button[aria-label="Choose device color"]'); document.getElementById(trigger.getAttribute('aria-controls'))?.querySelector('[role=option][aria-selected="true"]')?.click() })()`)
    deviceModels.push({ ...option, colors })
  }

  const layout = await cdp.evaluate(`(() => {
    const numeric = (label) => {
      const input = document.querySelector('input[type=range][aria-label="' + label + '"]')
      const defaults = { Scale: 150, Horizontal: 0, Vertical: 100 }
      return { default: defaults[label], min: Number(input.min), max: Number(input.max), step: Number(input.step) }
    }
    const group = document.querySelector('[aria-label="Choose aspect ratio"]')
    return {
      aspectRatios: [...group.querySelectorAll('[role=tab]')].map((item) => {
        const text = item.textContent.trim()
        const label = text.slice(0, text.length / 2)
        return { id: label, label }
      }),
      padding: { default: 72, min: 72, max: 72, step: 1 },
      deviceScale: numeric('Scale'),
      x: numeric('Horizontal'),
      y: numeric('Vertical'),
    }
  })()`)

  await clickTab(cdp, 'Choose background type', 'Photo')
  const picturePacks = await cdp.evaluate(`(() => [...document.querySelectorAll('.picture-pack-button')].map((item) => {
    const [id, counter] = item.title.split(' · ')
    return { id, label: id, imageCount: Number(counter.split('/')[1]) }
  }))()`)
  await clickTab(cdp, 'Choose background type', 'Mesh')
  const defaultColors = await cdp.evaluate(`(() => [...document.querySelectorAll('.mesh-palette-rule i')].map((item) => {
    const css = getComputedStyle(item).backgroundColor
    const parts = css.slice(css.indexOf('(') + 1, css.indexOf(')')).split(',').slice(0, 3).map(Number)
    return '#' + parts.map((part) => part.toString(16).padStart(2, '0')).join('').toUpperCase()
  }))()`)
  const manifestBytes = await readFile(join(MIRROR_ROOT, 'MANIFEST.sha256'))
  const manifestSha256 = createHash('sha256').update(manifestBytes).digest('hex')
  const firstModel = deviceModels.find((item) => item.colors.length > 0) ?? deviceModels[0]
  const capabilities = {
    version: PRESET_VERSION,
    mirror: { manifest: 'MANIFEST.sha256', sha256: manifestSha256, route: MIRROR_ROUTE },
    source: { acceptedMimeTypes: ['image/png', 'image/jpeg'], maxBytes: MAX_SOURCE_BYTES, fitMode: 'contain' },
    deviceModels,
    backgrounds: {
      modes: ['solid', 'mesh', 'transparent', 'picture'],
      solid: { defaultColor: '#1C1C1C' },
      mesh: { colorCount: 3, defaultColors },
      picturePacks,
    },
    layout,
    defaults: {
      version: PRESET_VERSION,
      device: { modelId: firstModel.id, colorId: firstModel.colors[0]?.id ?? null },
      background: { mode: 'solid', color: '#1C1C1C' },
      layout: {
        aspectRatioId: '16:9',
        padding: 72,
        deviceScale: 150,
        x: 0,
        y: 100,
      },
    },
  }
  return capabilitiesSchema.parse(capabilities)
}

async function applyPreset(cdp, preset) {
  await clickOption(cdp, 'Choose device model', preset.device.modelId)
  if (preset.device.colorId !== null) await clickOption(cdp, 'Choose device color', preset.device.colorId)
  await setRange(cdp, 'Scale', preset.layout.deviceScale)
  await setRange(cdp, 'Horizontal', preset.layout.x)
  await setRange(cdp, 'Vertical', preset.layout.y)
  await clickTab(cdp, 'Choose aspect ratio', preset.layout.aspectRatioId)

  if (preset.background.mode === 'transparent') {
    await clickTab(cdp, 'Choose background content type', 'None')
  } else {
    await clickTab(cdp, 'Choose background content type', 'Image')
    if (preset.background.mode === 'solid') {
      await clickTab(cdp, 'Choose background type', 'Solid')
      await setColorPicker(cdp, '.color-picker-proxy-trigger', preset.background.color)
    } else if (preset.background.mode === 'mesh') {
      await clickTab(cdp, 'Choose background type', 'Mesh')
      for (const [index, color] of preset.background.colors.entries()) {
        await setColorPicker(cdp, `.mesh-color-grid > *:nth-child(${index + 1}) .mesh-color-trigger`, color)
      }
    } else {
      await clickTab(cdp, 'Choose background type', 'Photo')
      for (let attempt = 0; attempt < 21; attempt += 1) {
        const state = await cdp.evaluate(`(() => {
          const button = [...document.querySelectorAll('.picture-pack-button')].find((item) => item.title.startsWith(${JSON.stringify(`${preset.background.packId} · `)}))
          if (!button) return null
          return { active: button.getAttribute('aria-pressed') === 'true', index: Number(button.title.split('/')[0].split(' · ')[1]) }
        })()`)
        if (!state) throw new DresserError('BROWSER_UI_ERROR', 'Dresser picture background is unavailable')
        if (state.active && state.index === preset.background.imageIndex) break
        await cdp.evaluate(`(() => [...document.querySelectorAll('.picture-pack-button')].find((item) => item.title.startsWith(${JSON.stringify(`${preset.background.packId} · `)})).click())()`)
        await cdp.evaluate(`new Promise((resolve) => requestAnimationFrame(resolve))`)
        if (attempt === 20) throw new DresserError('BROWSER_UI_ERROR', 'Dresser picture background did not settle')
      }
    }
  }
  await cdp.evaluate(`new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)))`)
  await cdp.evaluate(`Promise.all([...document.images].filter((item) => !item.complete).map((item) => new Promise((resolve, reject) => { item.addEventListener('load', resolve, { once: true }); item.addEventListener('error', reject, { once: true }) })))`)
}

async function forceScreenMediaContain(cdp) {
  const state = await cdp.evaluate(`(async () => {
    const media = [...document.querySelectorAll('.mockup-screen img, .mockup-screen video, .device-screen img, .device-screen video')]
    const before = media.map((item) => getComputedStyle(item).objectFit)
    let normalizedCount = 0
    for (const item of media) {
      item.style.objectFit = 'contain'
      item.style.objectPosition = 'center'

      if (item instanceof HTMLImageElement) {
        const screenRect = item.parentElement?.getBoundingClientRect()
        const sourceWidth = item.naturalWidth
        const sourceHeight = item.naturalHeight
        const targetAspect = screenRect?.width && screenRect?.height ? screenRect.width / screenRect.height : 0
        const sourceAspect = sourceWidth && sourceHeight ? sourceWidth / sourceHeight : 0
        if (targetAspect && sourceAspect && Math.abs(targetAspect - sourceAspect) > 0.001) {
          const canvas = document.createElement('canvas')
          if (sourceAspect > targetAspect) {
            canvas.width = sourceWidth
            canvas.height = Math.round(sourceWidth / targetAspect)
          } else {
            canvas.width = Math.round(sourceHeight * targetAspect)
            canvas.height = sourceHeight
          }
          const context = canvas.getContext('2d')
          if (!context) throw new Error('Dresser screen normalization canvas is unavailable')
          const x = Math.round((canvas.width - sourceWidth) / 2)
          const y = Math.round((canvas.height - sourceHeight) / 2)
          context.drawImage(item, x, y, sourceWidth, sourceHeight)
          if (y > 0) {
            context.drawImage(item, 0, 0, sourceWidth, 1, x, 0, sourceWidth, y)
            context.drawImage(item, 0, sourceHeight - 1, sourceWidth, 1, x, y + sourceHeight, sourceWidth, canvas.height - y - sourceHeight)
          }
          if (x > 0) {
            context.drawImage(item, 0, 0, 1, sourceHeight, 0, y, x, sourceHeight)
            context.drawImage(item, sourceWidth - 1, 0, 1, sourceHeight, x + sourceWidth, y, canvas.width - x - sourceWidth, sourceHeight)
          }
          const normalizedSource = canvas.toDataURL('image/png')
          await new Promise((resolve, reject) => {
            item.addEventListener('load', resolve, { once: true })
            item.addEventListener('error', reject, { once: true })
            item.src = normalizedSource
          })
          normalizedCount += 1
        }
      }
    }
    const after = media.map((item) => getComputedStyle(item).objectFit)
    const geometry = media.map((item) => {
      const rect = item.getBoundingClientRect()
      const parentRect = item.parentElement?.getBoundingClientRect()
      return {
        className: item.parentElement?.className ?? '',
        naturalWidth: item.naturalWidth ?? item.videoWidth ?? 0,
        naturalHeight: item.naturalHeight ?? item.videoHeight ?? 0,
        width: rect.width,
        height: rect.height,
        parentWidth: parentRect?.width ?? 0,
        parentHeight: parentRect?.height ?? 0,
      }
    })
    return { appliedCount: media.length, normalizedCount, before, after, geometry }
  })()`)
  if (!state.appliedCount || state.after.some((fit) => fit !== 'contain')) {
    throw new DresserError('BROWSER_UI_ERROR', 'Dresser screen media fit could not be applied')
  }
  await cdp.evaluate(`new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)))`)
  return state
}

function assertNetworkBoundary(session) {
  const invalid = session.requests.find((request) => (
    !allowedBrowserUrl(request.url, session.origin)
    || request.hasPostData
    || !['GET', 'HEAD'].includes(request.method)
  ))
  if (invalid) throw new DresserError('NETWORK_POLICY_VIOLATION', 'Browser traffic left the allowed local boundary')
}

async function exportPng(session, timeoutMs, internalTestHooks) {
  const { cdp } = session
  const begun = settle(cdp.waitFor(
    'Browser.downloadWillBegin',
    (event) => internalTestHooks?.acceptDownloadWillBegin?.(event) ?? true,
    timeoutMs,
    'DOWNLOAD_FAILED',
  ))
  const clicked = await cdp.evaluate(`(() => {
    const button = document.querySelector('.sidebar-export')
    if (!button || button.disabled) return false
    button.click()
    return true
  })()`)
  if (clicked) internalTestHooks?.onEvent?.({ type: 'export-invoked' })
  const begunResult = await begun
  if (!clicked) throw new DresserError('DOWNLOAD_FAILED', 'Dresser PNG export is unavailable')
  if (begunResult.status === 'rejected') throw begunResult.reason
  const { guid } = begunResult.value
  const progress = await settle(cdp.waitFor(
    'Browser.downloadProgress',
    (event) => event.guid === guid && ['completed', 'canceled'].includes(event.state),
    timeoutMs,
    'DOWNLOAD_FAILED',
  ))
  if (progress.status === 'rejected') throw progress.reason
  if (progress.value.state !== 'completed') throw new DresserError('DOWNLOAD_FAILED', 'Dresser PNG export failed')
  const downloadedPath = join(session.downloadsRoot, guid)
  try {
    await access(downloadedPath)
  } catch {
    throw new DresserError('DOWNLOAD_FAILED', 'Dresser PNG export did not produce a file')
  }
  return downloadedPath
}

function pngDimensions(bytes) {
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])
  if (bytes.length < 24 || !bytes.subarray(0, 8).equals(signature)) {
    throw new DresserError('DOWNLOAD_FAILED', 'Dresser export is not a valid PNG')
  }
  const width = bytes.readUInt32BE(16)
  const height = bytes.readUInt32BE(20)
  if (!width || !height) throw new DresserError('DOWNLOAD_FAILED', 'Dresser export has invalid dimensions')
  return { width, height }
}

function jpegDimensions(bytes) {
  if (bytes.length < 4 || bytes[0] !== 0xff || bytes[1] !== 0xd8) return null
  let offset = 2
  while (offset + 9 < bytes.length) {
    if (bytes[offset] !== 0xff) return null
    const marker = bytes[offset + 1]
    if ([0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7, 0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf].includes(marker)) {
      return { height: bytes.readUInt16BE(offset + 5), width: bytes.readUInt16BE(offset + 7) }
    }
    const length = bytes.readUInt16BE(offset + 2)
    if (length < 2) return null
    offset += length + 2
  }
  return null
}

export async function validateSourcePath(sourcePath) {
  if (typeof sourcePath !== 'string' || !sourcePath.startsWith(sep) || sourcePath.split(/[\\/]/).includes('..')) {
    throw new DresserError('INVALID_SOURCE_PATH', 'Source must be an absolute canonical path')
  }
  let canonical
  let sourceStat
  try {
    canonical = await realpath(sourcePath)
    sourceStat = await stat(canonical)
  } catch {
    throw new DresserError('SOURCE_NOT_FOUND', 'Source file was not found')
  }
  if (canonical !== resolve(sourcePath)) throw new DresserError('INVALID_SOURCE_PATH', 'Source path must be canonical')
  if (!sourceStat.isFile()) throw new DresserError('SOURCE_NOT_REGULAR', 'Source must be a regular file')
  if (sourceStat.size <= 0 || sourceStat.size > MAX_SOURCE_BYTES) {
    throw new DresserError('SOURCE_SIZE_UNSUPPORTED', 'Source file size is unsupported')
  }
  const handle = await open(canonical, 'r')
  const header = Buffer.alloc(Math.min(64 * 1024, sourceStat.size))
  try {
    await handle.read(header, 0, header.length, 0)
  } finally {
    await handle.close()
  }
  const extension = extname(canonical).toLowerCase()
  const png = header.length >= 24 && header.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
  const jpeg = jpegDimensions(header)
  if (png && extension === '.png') return { path: canonical, mimeType: 'image/png', byteSize: sourceStat.size }
  if (jpeg && ['.jpg', '.jpeg'].includes(extension)) return { path: canonical, mimeType: 'image/jpeg', byteSize: sourceStat.size }
  throw new DresserError('SOURCE_MEDIA_UNSUPPORTED', 'Source must be a genuine PNG or JPEG matching its extension')
}

export class BrowserSessionManager {
  constructor({ timeoutMs = DEFAULT_TIMEOUT_MS, launch = launchSession, internalTestHooks } = {}) {
    this.timeoutMs = timeoutMs
    this.launch = launch
    this.internalTestHooks = internalTestHooks
    this.busy = false
    this.capabilities = null
  }

  async #exclusive(operation) {
    if (this.busy) throw new DresserError('BUSY', 'Another Dresser browser operation is already running')
    this.busy = true
    try {
      return await operation()
    } finally {
      this.busy = false
    }
  }

  async getCapabilities({ refresh = false } = {}) {
    if (this.capabilities && !refresh) return this.capabilities
    return this.#exclusive(async () => {
      const session = await this.launch(this.internalTestHooks)
      try {
        this.capabilities = await discoverCapabilitiesInSession(session)
        assertNetworkBoundary(session)
        return this.capabilities
      } finally {
        await session.close()
      }
    })
  }

  async render(sourcePath, inputPreset) {
    const source = await validateSourcePath(sourcePath)
    const capabilities = this.capabilities ?? await this.getCapabilities()
    const preset = validatePreset(inputPreset, capabilities)
    return this.#exclusive(async () => {
      const session = await this.launch(this.internalTestHooks)
      let finalPath
      try {
        await importSource(session.cdp, source.path)
        await applyPreset(session.cdp, preset)
        const screenFit = await forceScreenMediaContain(session.cdp)
        this.internalTestHooks?.onEvent?.({ type: 'screen-fit-applied', ...screenFit })
        const downloadedPath = await exportPng(session, this.timeoutMs, this.internalTestHooks)
        assertNetworkBoundary(session)
        const bytes = await readFile(downloadedPath)
        const { width, height } = pngDimensions(bytes)
        await mkdir(OUTPUT_ROOT, { recursive: true })
        finalPath = join(OUTPUT_ROOT, `${randomUUID()}.png`)
        await copyFile(downloadedPath, finalPath, fsConstants.COPYFILE_EXCL)
        await unlink(downloadedPath)
        return {
          version: PRESET_VERSION,
          path: finalPath,
          mimeType: 'image/png',
          byteSize: bytes.length,
          sha256: createHash('sha256').update(bytes).digest('hex'),
          width,
          height,
        }
      } catch (error) {
        if (finalPath) await unlink(finalPath).catch(() => {})
        if (error instanceof DresserError) throw error
        throw new DresserError('RENDER_FAILED', 'Dresser PNG render failed')
      } finally {
        await session.close()
      }
    })
  }
}

export function sourceDisplayName(sourcePath) {
  return basename(sourcePath)
}

export function hashFile(path) {
  return new Promise((resolveHash, reject) => {
    const hash = createHash('sha256')
    const stream = createReadStream(path)
    stream.on('error', reject)
    stream.on('data', (chunk) => hash.update(chunk))
    stream.on('end', () => resolveHash(hash.digest('hex')))
  })
}
