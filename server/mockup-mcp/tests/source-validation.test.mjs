import assert from 'node:assert/strict'
import { mkdtemp, mkdir, realpath, truncate, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { test } from 'node:test'

import { MAX_SOURCE_BYTES, validateSourcePath } from '../browser-session.mjs'

const png = Buffer.alloc(24)
Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]).copy(png)
png.writeUInt32BE(13, 8)
png.write('IHDR', 12, 'ascii')
png.writeUInt32BE(2, 16)
png.writeUInt32BE(3, 20)

const jpeg = Buffer.from([
  0xff, 0xd8,
  0xff, 0xc0, 0x00, 0x11, 0x08,
  0x00, 0x03, 0x00, 0x02,
  0x03, 0x01, 0x11, 0x00, 0x02, 0x11, 0x00, 0x03, 0x11, 0x00,
  0xff, 0xd9,
])

test('accepts canonical regular PNG and JPEG paths with matching content', async (context) => {
  const root = await realpath(await mkdtemp(join(tmpdir(), 'dresser-source-test-')))
  context.after(async () => (await import('node:fs/promises')).rm(root, { recursive: true, force: true }))
  const pngPath = join(root, 'sample.png')
  const jpegPath = join(root, 'sample.jpg')
  await writeFile(pngPath, png)
  await writeFile(jpegPath, jpeg)
  assert.equal((await validateSourcePath(pngPath)).mimeType, 'image/png')
  assert.equal((await validateSourcePath(jpegPath)).mimeType, 'image/jpeg')
})

test('rejects missing, directory, relative, traversal, and spoofed sources without echoing paths', async (context) => {
  const root = await realpath(await mkdtemp(join(tmpdir(), 'dresser-source-negative-')))
  context.after(async () => (await import('node:fs/promises')).rm(root, { recursive: true, force: true }))
  const directory = join(root, 'directory')
  const spoofed = join(root, 'secret-name.png')
  const wrongExtension = join(root, 'image.gif')
  const oversized = join(root, 'oversized.png')
  await mkdir(directory)
  await writeFile(spoofed, Buffer.from('not an image'))
  await writeFile(wrongExtension, png)
  await writeFile(oversized, png)
  await truncate(oversized, MAX_SOURCE_BYTES + 1)
  const cases = [
    ['relative.png', 'INVALID_SOURCE_PATH'],
    [`${root}/../${root.split('/').at(-1)}/secret-name.png`, 'INVALID_SOURCE_PATH'],
    [join(root, 'missing.png'), 'SOURCE_NOT_FOUND'],
    [directory, 'SOURCE_NOT_REGULAR'],
    [spoofed, 'SOURCE_MEDIA_UNSUPPORTED'],
    [wrongExtension, 'SOURCE_MEDIA_UNSUPPORTED'],
    [oversized, 'SOURCE_SIZE_UNSUPPORTED'],
  ]
  for (const [path, code] of cases) {
    await assert.rejects(validateSourcePath(path), (error) => {
      assert.equal(error.code, code)
      assert.equal(error.message.includes('secret-name'), false)
      assert.equal(error.message.includes(root), false)
      return true
    })
  }
})
