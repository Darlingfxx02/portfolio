import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { build } from 'vite'

const root = resolve(import.meta.dirname, '..')
const pluginId = process.env.FIGMA_PLUGIN_ID ?? 'development-id-required'
await rm(resolve(root, 'dist'), { recursive: true, force: true })
await mkdir(resolve(root, 'dist'), { recursive: true })
await build({ configFile: resolve(root, 'vite.config.ts'), define: { __DRESSER_PLUGIN_ID__: JSON.stringify(pluginId) }, logLevel: 'warn' })
await build({ configFile: false, publicDir: false, logLevel: 'warn', build: { emptyOutDir: false, outDir: resolve(root, 'dist'), lib: { entry: resolve(root, 'src/main.ts'), formats: ['iife'], name: 'DresserPlugin', fileName: () => 'main.js' }, minify: true } })
let html = await readFile(resolve(root, 'dist/ui/src/ui/index.html'), 'utf8')
const scriptMatch = html.match(/<script[^>]+src="([^"]+)"[^>]*><\/script>/)
if (!scriptMatch) throw new Error('Built UI script was not found')
const script = await readFile(resolve(root, 'dist/ui', scriptMatch[1].replace(/^\.?\//, '')), 'utf8')
const cssMatch = html.match(/<link[^>]+href="([^"]+\.css)"[^>]*>/)
const css = cssMatch ? await readFile(resolve(root, 'dist/ui', cssMatch[1].replace(/^\.?\//, '')), 'utf8') : ''
html = html.replace(scriptMatch[0], '').replace(cssMatch?.[0] ?? '', () => `<style>${css}</style>`)
html = html.replace('</body>', () => `<script>${script}</script></body>`)
await writeFile(resolve(root, 'dist/plugin.html'), html)
await cp(resolve(root, 'bootstrap.html'), resolve(root, 'dist/bootstrap.html'))
await rm(resolve(root, 'dist/ui'), { recursive: true, force: true })
