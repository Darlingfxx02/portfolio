export const MAX_FIGMA_IMAGE_DIMENSION = 4096

export type SelectionContext = {
  id: string
  nonce: number
  name: string
  width: number
  height: number
  absoluteX: number
  absoluteY: number
}

export type MainToUiMessage =
  | { type: 'selection'; status: 'ready'; context: SelectionContext; bytes: Uint8Array }
  | { type: 'selection'; status: 'empty' | 'multiple' | 'not-frame' | 'removed'; message: string }
  | { type: 'insert-result'; requestId: string; ok: true; nodeId: string }
  | { type: 'insert-result'; requestId: string; ok: false; message: string }

export type UiToMainMessage =
  | { type: 'request-selection' }
  | { type: 'resize'; width: 360 | 420; height: 640 | 720 }
  | { type: 'insert'; requestId: string; contextId: string; nonce: number; width: number; height: number; bytes: Uint8Array }

export function pngDimensions(bytes: Uint8Array): { width: number; height: number } | null {
  if (!(bytes instanceof Uint8Array) || bytes.byteLength < 24) return null
  const signature = [137, 80, 78, 71, 13, 10, 26, 10]
  if (!signature.every((value, index) => bytes[index] === value)) return null
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength)
  const width = view.getUint32(16)
  const height = view.getUint32(20)
  if (!width || !height || width > MAX_FIGMA_IMAGE_DIMENSION || height > MAX_FIGMA_IMAGE_DIMENSION) return null
  return { width, height }
}

export function parseUiMessage(value: unknown): UiToMainMessage | null {
  if (!value || typeof value !== 'object') return null
  const candidate = value as Record<string, unknown>
  if (candidate.type === 'request-selection') return { type: 'request-selection' }
  if (candidate.type === 'resize' && ((candidate.width === 360 && candidate.height === 640) || (candidate.width === 420 && candidate.height === 720))) {
    return candidate as UiToMainMessage
  }
  if (candidate.type !== 'insert' || typeof candidate.requestId !== 'string' || !candidate.requestId || typeof candidate.contextId !== 'string' || !Number.isInteger(candidate.nonce) || !Number.isInteger(candidate.width) || !Number.isInteger(candidate.height) || !(candidate.bytes instanceof Uint8Array)) return null
  return candidate as UiToMainMessage
}
