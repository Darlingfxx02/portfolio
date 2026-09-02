import { spawn } from 'node:child_process'
import { access, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'

import { BrowserSessionManager } from '../../server/mockup-mcp/browser-session.mjs'

const root = resolve(import.meta.dirname, '../..')
const evidence = resolve(root, 'tasks/evidence/TASK-DRESSER-FIGMA-002-R1')
const chrome = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const capabilities = await new BrowserSessionManager().getCapabilities()
const built = await readFile(resolve(root, 'figma-plugin/dist/plugin.html'), 'utf8')
const mock = `<script>globalThis.fetch=async(path)=>path==='/v1/capabilities'?new Response(${JSON.stringify(JSON.stringify(capabilities))},{status:200,headers:{'Content-Type':'application/json'}}):new Response('{}',{status:503});</script>`

async function capture(width, height, theme) {
  const colors = theme === 'light'
    ? ':root{--figma-color-bg:#fff;--figma-color-bg-secondary:#f5f5f5;--figma-color-text:#1f1f1f;--figma-color-text-secondary:#666;--figma-color-border:#dedede;--figma-color-bg-selected:#e5f2ff;--figma-color-border-selected:#0875d1;--figma-color-bg-brand:#0d99ff;--figma-color-text-onbrand:#fff}'
    : ':root{--figma-color-bg:#171717;--figma-color-bg-secondary:#242424;--figma-color-text:#f5f5f5;--figma-color-text-secondary:#aaa;--figma-color-border:#3a3a3a;--figma-color-bg-selected:#264266;--figma-color-border-selected:#5c9dff;--figma-color-bg-brand:#0d99ff;--figma-color-text-onbrand:#fff}'
  const path = join(tmpdir(), `dresser-${width}-${height}-${theme}.html`)
  const output = resolve(evidence, `plugin-${width}x${height}-${theme}.png`)
  await rm(output, { force: true })
  await writeFile(path, built.replace('<head>', `<head><style>html,body{width:${width}px}${colors}</style>${mock}`))
  const profile = join(tmpdir(), `dresser-visual-${width}-${height}-${theme}`)
  await rm(profile, { recursive: true, force: true })
  const child = spawn(chrome, ['--headless=new', '--disable-gpu', '--hide-scrollbars', `--window-size=${width},${height}`, `--user-data-dir=${profile}`, `--screenshot=${output}`, `file://${path}`], { stdio: 'ignore' })
  for (let attempt = 0; attempt < 100; attempt += 1) {
    try { await access(output); break } catch { await new Promise((done) => setTimeout(done, 100)) }
  }
  child.kill('SIGTERM')
  await new Promise((done) => child.once('exit', done))
  await rm(path, { force: true }); await rm(profile, { recursive: true, force: true })
}

for (const [width, height] of [[360, 640], [420, 720]]) for (const theme of ['light', 'dark']) await capture(width, height, theme)
