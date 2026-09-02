import { readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { spawn } from 'node:child_process'

const root = resolve(import.meta.dirname, '..')
const pluginId = process.env.FIGMA_PLUGIN_ID
if (!pluginId || !/^\d+$/.test(pluginId)) {
  process.stderr.write('Set FIGMA_PLUGIN_ID to the numeric ID from a local Figma development plugin.\n')
  process.exit(1)
}
const template = await readFile(resolve(root, 'manifest.template.json'), 'utf8')
await writeFile(resolve(root, 'manifest.json'), template.replace('__FIGMA_PLUGIN_ID__', pluginId))
const build = spawn(process.execPath, [resolve(root, 'scripts/build.mjs')], { stdio: 'inherit', env: process.env })
const buildCode = await new Promise((done) => build.once('exit', done))
if (buildCode !== 0) process.exit(buildCode ?? 1)
process.stdout.write(`Import ${resolve(root, 'manifest.json')} in Figma Desktop.\n`)
const bridge = spawn(process.execPath, [resolve(root, '../server/figma-plugin-bridge/server.mjs')], { stdio: 'inherit' })
for (const signal of ['SIGINT', 'SIGTERM']) process.once(signal, () => bridge.kill(signal))
bridge.once('exit', (code) => process.exit(code ?? 0))
