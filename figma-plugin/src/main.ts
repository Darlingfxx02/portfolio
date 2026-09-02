import { MAX_FIGMA_IMAGE_DIMENSION, parseUiMessage, pngDimensions, type MainToUiMessage, type SelectionContext } from './messages'

declare const __html__: string

figma.showUI(__html__, { width: 360, height: 640, themeColors: true })

let selectionNonce = 0
let exportSequence = 0
let suppressSelectionChange = false
const handledInsertIds = new Set<string>()

function post(message: MainToUiMessage): void {
  figma.ui.postMessage(message)
}

function selectionError(): Extract<MainToUiMessage, { type: 'selection'; status: Exclude<string, 'ready'> }> {
  const selection = figma.currentPage.selection
  if (selection.length === 0) return { type: 'selection', status: 'empty', message: 'Select one Frame in Figma.' }
  if (selection.length !== 1) return { type: 'selection', status: 'multiple', message: 'Select one Frame in Figma.' }
  if (selection[0].type !== 'FRAME') return { type: 'selection', status: 'not-frame', message: 'Select one Frame in Figma.' }
  return { type: 'selection', status: 'removed', message: 'Selected Frame is no longer available.' }
}

async function exportSelection(): Promise<void> {
  const sequence = ++exportSequence
  const selection = figma.currentPage.selection
  if (selection.length !== 1 || selection[0].type !== 'FRAME') {
    post(selectionError())
    return
  }
  const frame = selection[0]
  const bounds = frame.absoluteRenderBounds ?? frame.absoluteBoundingBox
  if (!bounds || frame.removed || frame.width <= 0 || frame.height <= 0) {
    post({ type: 'selection', status: 'removed', message: 'Selected Frame is no longer available.' })
    return
  }
  const nonce = selectionNonce
  const scale = Math.min(1, MAX_FIGMA_IMAGE_DIMENSION / Math.max(frame.width, frame.height))
  try {
    const bytes = await frame.exportAsync({ format: 'PNG', constraint: { type: 'SCALE', value: scale } })
    if (sequence !== exportSequence || nonce !== selectionNonce || figma.currentPage.selection[0]?.id !== frame.id) return
    const context: SelectionContext = {
      id: frame.id, nonce, name: frame.name, width: frame.width, height: frame.height,
      absoluteX: bounds.x, absoluteY: bounds.y,
    }
    post({ type: 'selection', status: 'ready', context, bytes })
  } catch {
    if (sequence === exportSequence) post({ type: 'selection', status: 'removed', message: 'Could not export the selected Frame. Try again.' })
  }
}

figma.on('selectionchange', () => {
  if (suppressSelectionChange) {
    suppressSelectionChange = false
    return
  }
  selectionNonce += 1
  void exportSelection()
})

figma.ui.onmessage = async (raw: unknown) => {
  const message = parseUiMessage(raw)
  if (!message) return
  if (message.type === 'request-selection') {
    await exportSelection()
    return
  }
  if (message.type === 'resize') {
    figma.ui.resize(message.width, message.height)
    return
  }
  if (handledInsertIds.has(message.requestId)) {
    post({ type: 'insert-result', requestId: message.requestId, ok: false, message: 'This result was already inserted.' })
    return
  }
  const selection = figma.currentPage.selection
  const source = selection.length === 1 && selection[0].type === 'FRAME' ? selection[0] : null
  const dimensions = pngDimensions(message.bytes)
  if (!source || source.removed || source.id !== message.contextId || message.nonce !== selectionNonce || !dimensions || dimensions.width !== message.width || dimensions.height !== message.height) {
    post({ type: 'insert-result', requestId: message.requestId, ok: false, message: 'Selection or rendered image changed. Update preview and try again.' })
    return
  }
  const bounds = source.absoluteRenderBounds ?? source.absoluteBoundingBox
  if (!bounds) {
    post({ type: 'insert-result', requestId: message.requestId, ok: false, message: 'Selected Frame has no usable bounds.' })
    return
  }
  let rectangle: RectangleNode | undefined
  try {
    const image = figma.createImage(message.bytes)
    rectangle = figma.createRectangle()
    rectangle.name = `Dresser — ${source.name}`
    rectangle.resize(dimensions.width, dimensions.height)
    rectangle.fills = [{ type: 'IMAGE', scaleMode: 'FILL', imageHash: image.hash }]
    figma.currentPage.appendChild(rectangle)
    rectangle.x = bounds.x + bounds.width + 80
    rectangle.y = bounds.y
    suppressSelectionChange = true
    figma.currentPage.selection = [rectangle]
    figma.viewport.scrollAndZoomIntoView([rectangle])
    handledInsertIds.add(message.requestId)
    post({ type: 'insert-result', requestId: message.requestId, ok: true, nodeId: rectangle.id })
  } catch {
    rectangle?.remove()
    post({ type: 'insert-result', requestId: message.requestId, ok: false, message: 'Could not insert the rendered image. Try again.' })
  }
}

void exportSelection()
