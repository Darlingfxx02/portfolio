export const MOCKUP_SIZE = 1200

export type MockupSettings = {
  background: string
  padding: number
  scale: number
  horizontal: number
  vertical: number
}

export const DEFAULT_MOCKUP_SETTINGS: MockupSettings = {
  background: '#d9ff5a',
  padding: 112,
  scale: 1,
  horizontal: 0,
  vertical: 0,
}

type RenderOptions = {
  canvas: HTMLCanvasElement
  image: CanvasImageSource | null
  imageWidth: number
  imageHeight: number
  settings: MockupSettings
}

function roundedRect(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
) {
  const safeRadius = Math.min(radius, width / 2, height / 2)
  context.beginPath()
  context.roundRect(x, y, width, height, safeRadius)
}

export function renderMockup({
  canvas,
  image,
  imageWidth,
  imageHeight,
  settings,
}: RenderOptions) {
  canvas.width = MOCKUP_SIZE
  canvas.height = MOCKUP_SIZE

  const context = canvas.getContext('2d')
  if (!context) return

  context.clearRect(0, 0, MOCKUP_SIZE, MOCKUP_SIZE)
  context.fillStyle = settings.background
  context.fillRect(0, 0, MOCKUP_SIZE, MOCKUP_SIZE)

  if (!image || imageWidth <= 0 || imageHeight <= 0) return

  const availableHeight = Math.max(480, MOCKUP_SIZE - settings.padding * 2)
  const phoneHeight = Math.min(976, availableHeight)
  const phoneWidth = phoneHeight * 0.492
  const phoneX = (MOCKUP_SIZE - phoneWidth) / 2
  const phoneY = (MOCKUP_SIZE - phoneHeight) / 2
  const shellRadius = phoneWidth * 0.115
  const bezel = phoneWidth * 0.035
  const screenX = phoneX + bezel
  const screenY = phoneY + bezel
  const screenWidth = phoneWidth - bezel * 2
  const screenHeight = phoneHeight - bezel * 2
  const screenRadius = shellRadius * 0.76

  context.save()
  context.shadowColor = 'rgba(0, 0, 0, 0.32)'
  context.shadowBlur = 52
  context.shadowOffsetY = 28
  roundedRect(context, phoneX, phoneY, phoneWidth, phoneHeight, shellRadius)
  context.fillStyle = '#111214'
  context.fill()
  context.restore()

  context.save()
  roundedRect(context, screenX, screenY, screenWidth, screenHeight, screenRadius)
  context.clip()
  context.fillStyle = '#08090a'
  context.fillRect(screenX, screenY, screenWidth, screenHeight)

  const coverScale = Math.max(screenWidth / imageWidth, screenHeight / imageHeight)
  const drawScale = coverScale * settings.scale
  const drawWidth = imageWidth * drawScale
  const drawHeight = imageHeight * drawScale
  const travelX = Math.max(0, (drawWidth - screenWidth) / 2)
  const travelY = Math.max(0, (drawHeight - screenHeight) / 2)
  const drawX = screenX + (screenWidth - drawWidth) / 2 + travelX * settings.horizontal
  const drawY = screenY + (screenHeight - drawHeight) / 2 + travelY * settings.vertical

  context.imageSmoothingEnabled = true
  context.imageSmoothingQuality = 'high'
  context.drawImage(image, drawX, drawY, drawWidth, drawHeight)
  context.restore()

  context.save()
  roundedRect(context, screenX, screenY, screenWidth, screenHeight, screenRadius)
  context.strokeStyle = 'rgba(255, 255, 255, 0.14)'
  context.lineWidth = 3
  context.stroke()

  const speakerWidth = phoneWidth * 0.2
  const speakerHeight = Math.max(8, phoneHeight * 0.009)
  roundedRect(
    context,
    phoneX + (phoneWidth - speakerWidth) / 2,
    phoneY + bezel * 0.48,
    speakerWidth,
    speakerHeight,
    speakerHeight / 2,
  )
  context.fillStyle = '#27282b'
  context.fill()
  context.restore()
}
