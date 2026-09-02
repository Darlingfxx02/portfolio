import { randomBytes, randomUUID } from 'node:crypto'
import { chmod, mkdir, readFile, rename, rm, writeFile } from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const MODULE_DIR = dirname(fileURLToPath(import.meta.url))
const PROJECT_ROOT = resolve(MODULE_DIR, '../..')
export const RUNTIME_ROOT = join(PROJECT_ROOT, '.local', 'dresser-figma')
export const RUNTIME_PATH = join(RUNTIME_ROOT, 'runtime.json')
export const INPUT_ROOT = join(RUNTIME_ROOT, 'inputs')

export function createToken() {
  return randomBytes(32).toString('base64url')
}

export async function writeRuntimeState({ token, pid, origin, startedAt }) {
  await mkdir(RUNTIME_ROOT, { recursive: true, mode: 0o700 })
  await chmod(RUNTIME_ROOT, 0o700)
  const temporaryPath = join(RUNTIME_ROOT, `.runtime-${pid}-${randomUUID()}.json`)
  const record = `${JSON.stringify({ token, pid, origin, startedAt })}\n`
  try {
    await writeFile(temporaryPath, record, { mode: 0o600, flag: 'wx' })
    await rename(temporaryPath, RUNTIME_PATH)
  } finally {
    await rm(temporaryPath, { force: true })
  }
  await chmod(RUNTIME_PATH, 0o600)
}

export async function readRuntimeState() {
  return JSON.parse(await readFile(RUNTIME_PATH, 'utf8'))
}

export async function removeRuntimeState() {
  await rm(RUNTIME_PATH, { force: true })
  await rm(INPUT_ROOT, { recursive: true, force: true, maxRetries: 3, retryDelay: 50 })
}
