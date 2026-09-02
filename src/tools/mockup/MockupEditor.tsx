import { type ChangeEvent, useEffect, useRef, useState } from 'react'
import styles from './MockupEditor.module.css'
import {
  DEFAULT_MOCKUP_SETTINGS,
  MOCKUP_SIZE,
  renderMockup,
  type MockupSettings,
} from './renderMockup'
import { resolveMockupIcon } from './icons'

const BackIcon = resolveMockupIcon('navigation.back')
const ResetIcon = resolveMockupIcon('action.reset')
const UploadIcon = resolveMockupIcon('action.upload')
const ExportIcon = resolveMockupIcon('action.export')

type LoadedImage = {
  bitmap: ImageBitmap
  width: number
  height: number
}

type RangeControlProps = {
  label: string
  value: number
  min: number
  max: number
  step?: number
  displayValue: string
  onChange: (value: number) => void
}

function RangeControl({
  label,
  value,
  min,
  max,
  step = 1,
  displayValue,
  onChange,
}: RangeControlProps) {
  return (
    <label className={styles.rangeControl}>
      <span className={styles.rangeHeader}>
        <span>{label}</span>
        <output>{displayValue}</output>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </label>
  )
}

export default function MockupEditor() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const loadedImageRef = useRef<LoadedImage | null>(null)
  const [loadedImage, setLoadedImage] = useState<LoadedImage | null>(null)
  const [settings, setSettings] = useState<MockupSettings>(DEFAULT_MOCKUP_SETTINGS)
  const [error, setError] = useState('')

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    renderMockup({
      canvas,
      image: loadedImage?.bitmap ?? null,
      imageWidth: loadedImage?.width ?? 0,
      imageHeight: loadedImage?.height ?? 0,
      settings,
    })
  }, [loadedImage, settings])

  useEffect(() => () => loadedImageRef.current?.bitmap.close(), [])

  const updateSetting = <Key extends keyof MockupSettings>(
    key: Key,
    value: MockupSettings[Key],
  ) => setSettings((current) => ({ ...current, [key]: value }))

  const openFilePicker = () => inputRef.current?.click()

  const handleUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return

    if (file.type !== 'image/png' && file.type !== 'image/jpeg') {
      setError('Choose a PNG or JPEG image. Your current composition is unchanged.')
      return
    }

    try {
      const bitmap = await createImageBitmap(file)
      if (bitmap.width <= 0 || bitmap.height <= 0) {
        bitmap.close()
        throw new Error('Image has no drawable dimensions')
      }

      const nextImage = { bitmap, width: bitmap.width, height: bitmap.height }
      loadedImageRef.current?.bitmap.close()
      loadedImageRef.current = nextImage
      setLoadedImage(nextImage)
      setError('')
    } catch {
      setError('This image could not be read. Try another PNG or JPEG; your current composition is unchanged.')
    }
  }

  const exportPng = () => {
    const canvas = canvasRef.current
    if (!canvas || !loadedImage) return

    renderMockup({
      canvas,
      image: loadedImage.bitmap,
      imageWidth: loadedImage.width,
      imageHeight: loadedImage.height,
      settings,
    })
    canvas.toBlob((blob) => {
      if (!blob) {
        setError('PNG export failed. Your composition is still available; please try again.')
        return
      }
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = 'mockup-studio.png'
      link.click()
      URL.revokeObjectURL(url)
    }, 'image/png')
  }

  return (
    <main className={styles.editor}>
      <header className={styles.topbar}>
        <a className={styles.iconButton} href="/" aria-label="Back to portfolio">
          <BackIcon size={19} weight="bold" aria-hidden="true" />
        </a>
        <div className={styles.brand}>
          <span className={styles.brandMark} aria-hidden="true" />
          <span>Mockup Studio</span>
        </div>
        <div className={styles.topbarActions}>
          <button
            className={styles.secondaryButton}
            type="button"
            onClick={() => setSettings(DEFAULT_MOCKUP_SETTINGS)}
            disabled={!loadedImage}
          >
            <ResetIcon size={18} aria-hidden="true" />
            Reset
          </button>
          <button
            className={styles.primaryButton}
            type="button"
            onClick={exportPng}
            disabled={!loadedImage}
          >
            <ExportIcon size={18} weight="bold" aria-hidden="true" />
            Export PNG
          </button>
        </div>
      </header>

      <div className={styles.workspace}>
        <aside className={styles.rail} aria-label="Media">
          <div>
            <p className={styles.eyebrow}>Media</p>
            <h1 className={styles.railTitle}>Your screenshot</h1>
          </div>
          <button className={styles.uploadCard} type="button" onClick={openFilePicker}>
            <span className={styles.uploadIcon}>
              <UploadIcon size={22} weight="bold" aria-hidden="true" />
            </span>
            <span>{loadedImage ? 'Replace image' : 'Upload image'}</span>
            <small>PNG or JPEG</small>
          </button>
          <input
            ref={inputRef}
            className={styles.visuallyHidden}
            type="file"
            accept="image/png,image/jpeg"
            tabIndex={-1}
            aria-label="Choose PNG or JPEG image"
            onChange={handleUpload}
          />
          {loadedImage && (
            <div className={styles.fileState}>
              <span className={styles.statusDot} aria-hidden="true" />
              <span>Image ready</span>
              <small>
                {loadedImage.width} × {loadedImage.height}px
              </small>
            </div>
          )}
          {error && (
            <p className={styles.error} role="alert">
              {error}
            </p>
          )}
          <p className={styles.privacy}>Images stay on this device and are never uploaded.</p>
        </aside>

        <section className={styles.stage} aria-label="Mockup preview">
          <div className={styles.canvasShell}>
            <canvas
              ref={canvasRef}
              className={styles.canvas}
              width={MOCKUP_SIZE}
              height={MOCKUP_SIZE}
              aria-label="Mockup composition preview"
            />
            {!loadedImage && (
              <div className={styles.emptyState}>
                <span className={styles.emptyIcon} aria-hidden="true">
                  <UploadIcon size={25} weight="bold" />
                </span>
                <h2>Start with a screenshot</h2>
                <p>Add one PNG or JPEG to place it in a clean, unbranded phone frame.</p>
                <button className={styles.primaryButton} type="button" onClick={openFilePicker}>
                  Upload image
                </button>
              </div>
            )}
          </div>
          <p className={styles.canvasMeta}>
            <span>Square canvas</span>
            <span>{MOCKUP_SIZE} × {MOCKUP_SIZE}px</span>
          </p>
        </section>

        <aside className={`${styles.rail} ${styles.compositionRail}`} aria-label="Composition">
          <div>
            <p className={styles.eyebrow}>Composition</p>
            <h2 className={styles.railTitle}>Adjust the scene</h2>
          </div>
          <label className={styles.colorControl}>
            <span>Background</span>
            <span className={styles.colorField}>
              <input
                type="color"
                value={settings.background}
                onChange={(event) => updateSetting('background', event.target.value)}
              />
              <output>{settings.background.toUpperCase()}</output>
            </span>
          </label>
          <div className={styles.divider} />
          <RangeControl
            label="Padding"
            value={settings.padding}
            min={80}
            max={280}
            displayValue={`${settings.padding}px`}
            onChange={(value) => updateSetting('padding', value)}
          />
          <RangeControl
            label="Scale"
            value={settings.scale}
            min={1}
            max={2}
            step={0.01}
            displayValue={`${Math.round(settings.scale * 100)}%`}
            onChange={(value) => updateSetting('scale', value)}
          />
          <RangeControl
            label="Horizontal"
            value={settings.horizontal}
            min={-1}
            max={1}
            step={0.01}
            displayValue={`${Math.round(settings.horizontal * 100)}`}
            onChange={(value) => updateSetting('horizontal', value)}
          />
          <RangeControl
            label="Vertical"
            value={settings.vertical}
            min={-1}
            max={1}
            step={0.01}
            displayValue={`${Math.round(settings.vertical * 100)}`}
            onChange={(value) => updateSetting('vertical', value)}
          />
        </aside>
      </div>
    </main>
  )
}
