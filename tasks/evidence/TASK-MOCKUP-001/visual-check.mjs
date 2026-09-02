import { writeFile } from 'node:fs/promises'

const root = '/Users/darlingfxx/Projects/darling-live'
const evidence = `${root}/tasks/evidence/TASK-MOCKUP-001`
const sample = `${root}/public/zinda/series/main-mobile.jpg`
const target = await fetch('http://127.0.0.1:9223/json/new?about:blank', { method: 'PUT' }).then((response) => response.json())
const socket = new WebSocket(target.webSocketDebuggerUrl)
await new Promise((resolve, reject) => {
  socket.addEventListener('open', resolve, { once: true })
  socket.addEventListener('error', reject, { once: true })
})

let sequence = 0
const pending = new Map()
const events = []
const requests = []
const consoleMessages = []

socket.addEventListener('message', (message) => {
  const payload = JSON.parse(message.data)
  if (payload.id) {
    const request = pending.get(payload.id)
    if (!request) return
    pending.delete(payload.id)
    if (payload.error) request.reject(new Error(JSON.stringify(payload.error)))
    else request.resolve(payload.result)
    return
  }
  events.push(payload)
  if (payload.method === 'Network.requestWillBeSent') {
    requests.push({
      url: payload.params.request.url,
      method: payload.params.request.method,
      hasPostData: Boolean(payload.params.request.hasPostData),
    })
  }
  if (payload.method === 'Runtime.consoleAPICalled') {
    consoleMessages.push({
      type: payload.params.type,
      text: payload.params.args.map((item) => item.value ?? item.description ?? '').join(' '),
    })
  }
  if (payload.method === 'Runtime.exceptionThrown') {
    consoleMessages.push({ type: 'exception', text: payload.params.exceptionDetails.text })
  }
})

function send(method, params = {}) {
  const id = ++sequence
  return new Promise((resolve, reject) => {
    pending.set(id, { resolve, reject })
    socket.send(JSON.stringify({ id, method, params }))
  })
}

const pause = (milliseconds = 250) => new Promise((resolve) => setTimeout(resolve, milliseconds))

async function evaluate(expression, awaitPromise = false) {
  const result = await send('Runtime.evaluate', {
    expression,
    awaitPromise,
    returnByValue: true,
    userGesture: true,
  })
  if (result.exceptionDetails) throw new Error(result.exceptionDetails.text)
  return result.result.value
}

async function screenshot(filename) {
  const result = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false })
  await writeFile(`${evidence}/${filename}`, Buffer.from(result.data, 'base64'))
}

async function canvasHash() {
  return evaluate(`(async () => {
    const blob = await new Promise(resolve => document.querySelector('canvas').toBlob(resolve, 'image/png'));
    const bytes = await blob.arrayBuffer();
    const hash = await crypto.subtle.digest('SHA-256', bytes);
    return Array.from(new Uint8Array(hash)).map(value => value.toString(16).padStart(2, '0')).join('');
  })()`, true)
}

async function dispatchSyntheticFile(kind) {
  return evaluate(`(() => {
    const input = document.querySelector('input[type=file]');
    const transfer = new DataTransfer();
    let file;
    if ('${kind}' === 'unsupported') {
      file = new File(['not an image'], 'fixture.txt', { type: 'text/plain' });
    } else if ('${kind}' === 'corrupt') {
      file = new File([new Uint8Array([137, 80, 78, 71, 0, 1, 2, 3])], 'fixture.png', { type: 'image/png' });
    } else {
      const bytes = Uint8Array.from(atob('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII='), c => c.charCodeAt(0));
      bytes[16] = 0; bytes[17] = 0; bytes[18] = 0; bytes[19] = 0;
      file = new File([bytes], 'fixture.png', { type: 'image/png' });
    }
    transfer.items.add(file);
    input.files = transfer.files;
    input.dispatchEvent(new Event('change', { bubbles: true }));
    return true;
  })()`)
}

await send('Page.enable')
await send('Runtime.enable')
await send('Network.enable')
await send('DOM.enable')
await send('Browser.setDownloadBehavior', {
  behavior: 'allow',
  downloadPath: evidence,
  eventsEnabled: true,
})
await send('Emulation.setDeviceMetricsOverride', {
  width: 1440,
  height: 900,
  deviceScaleFactor: 1,
  mobile: false,
})

await send('Page.navigate', { url: 'http://127.0.0.1:5173/tools/mockup' })
await pause(1000)
const initial = await evaluate(`({
  title: document.querySelector('main')?.innerText.includes('Mockup Studio'),
  canvas: [document.querySelector('canvas')?.width, document.querySelector('canvas')?.height],
  exportDisabled: Array.from(document.querySelectorAll('button')).find(button => button.textContent.includes('Export PNG'))?.disabled,
  storage: { local: Object.keys(localStorage), session: Object.keys(sessionStorage) },
  resources: performance.getEntriesByType('resource').map(entry => entry.name),
})`)
await screenshot('editor-empty.png')

const documentNode = await send('DOM.getDocument')
const inputNode = await send('DOM.querySelector', {
  nodeId: documentNode.root.nodeId,
  selector: 'input[type=file]',
})
await send('DOM.setFileInputFiles', { nodeId: inputNode.nodeId, files: [sample] })
await pause(800)

await evaluate(`(() => {
  const ranges = Array.from(document.querySelectorAll('input[type=range]'));
  const values = ['180', '1.32', '0.46', '-0.28'];
  ranges.forEach((input, index) => {
    const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
    setter.call(input, values[index]);
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));
  });
  const color = document.querySelector('input[type=color]');
  Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(color, '#7c5cff');
  color.dispatchEvent(new Event('input', { bubbles: true }));
  color.dispatchEvent(new Event('change', { bubbles: true }));
})()`)
await pause(500)
const valid = await evaluate(`({
  ready: document.body.innerText.includes('Image ready'),
  filenameVisible: document.body.innerText.includes('main-mobile.jpg'),
  exportDisabled: Array.from(document.querySelectorAll('button')).find(button => button.textContent.includes('Export PNG'))?.disabled,
  rangeValues: Array.from(document.querySelectorAll('input[type=range]')).map(input => input.value),
  background: document.querySelector('input[type=color]').value,
  labels: Array.from(document.querySelectorAll('button, a')).map(node => node.getAttribute('aria-label') || node.textContent.trim()).filter(Boolean),
})`)
const validHash = await canvasHash()
await screenshot('editor-loaded-adjusted.png')

await evaluate(`Array.from(document.querySelectorAll('button')).find(button => button.textContent.includes('Export PNG')).click()`)
await pause(1000)

const invalid = {}
for (const kind of ['unsupported', 'corrupt', 'zero-dimension']) {
  await dispatchSyntheticFile(kind)
  await pause(500)
  invalid[kind] = {
    error: await evaluate(`document.querySelector('[role=alert]')?.textContent || ''`),
    compositionPreserved: (await canvasHash()) === validHash,
    ready: await evaluate(`document.body.innerText.includes('Image ready')`),
  }
}
await screenshot('editor-invalid-recovery.png')

const storageAfter = await evaluate(`(async () => ({
  local: Object.keys(localStorage),
  session: Object.keys(sessionStorage),
  indexedDb: indexedDB.databases ? (await indexedDB.databases()).map(database => database.name) : [],
  caches: 'caches' in window ? await caches.keys() : [],
  resources: performance.getEntriesByType('resource').map(entry => entry.name),
}))()`, true)

await evaluate(`document.activeElement?.blur()`)
const focus = []
for (let index = 0; index < 9; index += 1) {
  await send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Tab', code: 'Tab', windowsVirtualKeyCode: 9 })
  await send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Tab', code: 'Tab', windowsVirtualKeyCode: 9 })
  focus.push(await evaluate(`(() => {
    const control = document.activeElement;
    const style = getComputedStyle(control);
    return {
      name: control.getAttribute('aria-label') || control.closest('label')?.innerText.split('\\n')[0] || control.textContent.trim(),
      tag: control.tagName,
      outlineWidth: style.outlineWidth,
      outlineStyle: style.outlineStyle,
      outlineColor: style.outlineColor,
    };
  })()`))
}

const consoleBeforeFallback = [...consoleMessages]
const iconFallback = await evaluate(`(async () => {
  const module = await import('/src/tools/mockup/icons.ts');
  return module.resolveMockupIcon('not.a.real.icon') === module.resolveMockupIcon('action.unknown');
})()`, true)
await pause(200)

const report = {
  initial,
  valid,
  validCanvasSha256: validHash,
  invalid,
  privacy: {
    storageBefore: initial.storage,
    storageAfter,
    requests,
    requestCountAfterInitialLoad: requests.filter(request => !initial.resources.includes(request.url)).length,
  },
  focus,
  consoleBeforeFallback,
  iconFallback,
  fallbackDiagnostic: consoleMessages.slice(consoleBeforeFallback.length),
}
await writeFile(`${evidence}/browser-report.json`, `${JSON.stringify(report, null, 2)}\n`)
socket.close()
