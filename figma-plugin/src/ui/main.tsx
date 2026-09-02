/* eslint-disable react-refresh/only-export-components -- plugin has one self-contained production entry */
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { CircleNotch, DeviceMobile, resolveIcon } from './icons'
import type { Capabilities, Preset, SelectionContext } from './types'
import './style.css'

declare const __DRESSER_PLUGIN_ID__: string
const CLIENT_HEADER = 'figma-desktop-v1'

type Preview = { url: string; bytes: Uint8Array; width: number; height: number; sha256: string; presetKey: string }
type SelectionState = { status: 'idle' | 'error'; message: string } | { status: 'ready'; context: SelectionContext; bytes: Uint8Array }

function post(message: unknown) {
  parent.postMessage({ pluginMessage: message, pluginId: __DRESSER_PLUGIN_ID__ }, 'https://www.figma.com')
}

async function sha256(bytes: Uint8Array) {
  const copy = Uint8Array.from(bytes)
  const hash = await crypto.subtle.digest('SHA-256', copy.buffer)
  return [...new Uint8Array(hash)].map((value) => value.toString(16).padStart(2, '0')).join('')
}

async function api(path: string, init: RequestInit = {}) {
  return fetch(path, { ...init, credentials: 'include', headers: { 'X-Dresser-Plugin-Client': CLIENT_HEADER, ...init.headers } })
}

function App() {
  const [selection, setSelection] = useState<SelectionState>({ status: 'idle', message: 'Select one Frame in Figma.' })
  const [capabilities, setCapabilities] = useState<Capabilities | null>(null)
  const [preset, setPreset] = useState<Preset | null>(null)
  const [preview, setPreview] = useState<Preview | null>(null)
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('Connecting to local Dresser…')
  const requestRef = useRef(0)

  useEffect(() => {
    const receive = (event: MessageEvent) => {
      if (event.source !== parent || event.origin !== 'https://www.figma.com') return
      const data = event.data?.pluginMessage
      if (!data || typeof data !== 'object' || typeof data.type !== 'string') return
      if (data.type === 'selection' && data.status === 'ready' && data.context && data.bytes instanceof Uint8Array) {
        setSelection({ status: 'ready', context: data.context, bytes: data.bytes })
        setPreview((old) => { if (old) URL.revokeObjectURL(old.url); return null })
        setMessage('Frame selected · preview required')
      } else if (data.type === 'selection' && typeof data.message === 'string') {
        setSelection({ status: 'error', message: data.message })
        setMessage(data.message)
      } else if (data.type === 'insert-result' && typeof data.requestId === 'string') {
        setBusy(false)
        setMessage(data.ok ? 'Inserted beside frame' : String(data.message ?? 'Insert failed'))
      }
    }
    window.addEventListener('message', receive)
    void api('/v1/capabilities').then(async (response) => {
      if (!response.ok) throw new Error('Local Dresser session is unavailable.')
      const next = await response.json() as Capabilities
      setCapabilities(next); setPreset(next.defaults); setMessage('Select one Frame in Figma.')
      post({ type: 'request-selection' })
    }).catch((error: Error) => setMessage(error.message))
    return () => window.removeEventListener('message', receive)
  }, [])

  const presetKey = preset ? JSON.stringify(preset) : ''
  const stale = !preview || preview.presetKey !== presetKey
  const model = useMemo(() => capabilities?.deviceModels.find((item) => item.id === preset?.device.modelId), [capabilities, preset])

  async function render(): Promise<Preview> {
    if (!preset || selection.status !== 'ready') throw new Error('Select one Frame in Figma.')
    setBusy(true); setMessage('Rendering exact preview…')
    const response = await api('/v1/render', { method: 'POST', headers: { 'Content-Type': 'image/png', 'X-Dresser-Preset': btoa(String.fromCharCode(...new TextEncoder().encode(JSON.stringify(preset)))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '') }, body: Uint8Array.from(selection.bytes).buffer })
    if (!response.ok) { const body = await response.json().catch(() => null); throw new Error(body?.message ?? 'Dresser render failed.') }
    const bytes = new Uint8Array(await response.arrayBuffer())
    const width = Number(response.headers.get('X-Dresser-Width'))
    const height = Number(response.headers.get('X-Dresser-Height'))
    const expectedHash = response.headers.get('X-Dresser-SHA256') ?? ''
    const actualHash = await sha256(bytes)
    if (!Number.isInteger(width) || !Number.isInteger(height) || width < 1 || height < 1 || width > 4096 || height > 4096 || expectedHash !== actualHash || Number(response.headers.get('X-Dresser-Byte-Size')) !== bytes.length) throw new Error('Rendered PNG metadata did not match.')
    const next = { url: URL.createObjectURL(new Blob([bytes], { type: 'image/png' })), bytes, width, height, sha256: actualHash, presetKey }
    setPreview((old) => { if (old) URL.revokeObjectURL(old.url); return next }); setBusy(false); setMessage('Preview up to date')
    return next
  }

  async function updatePreview() { try { await render() } catch (error) { setBusy(false); setMessage(error instanceof Error ? error.message : 'Dresser render failed.') } }
  async function insert() {
    try {
      const current = stale ? await render() : preview
      if (!current || selection.status !== 'ready') throw new Error('Select one Frame in Figma.')
      setBusy(true); setMessage('Inserting beside frame…')
      requestRef.current += 1
      post({ type: 'insert', requestId: `${Date.now()}-${requestRef.current}`, contextId: selection.context.id, nonce: selection.context.nonce, width: current.width, height: current.height, bytes: current.bytes })
    } catch (error) { setBusy(false); setMessage(error instanceof Error ? error.message : 'Insert failed.') }
  }

  function updatePreset(mutator: (value: Preset) => Preset) { if (preset) { setPreset(mutator(preset)); setMessage('Preview changed · update required') } }
  function reset() { if (capabilities) { setPreset(capabilities.defaults); setMessage('Preview changed · update required') } }
  function icon(key: string, label: string) { const Icon = resolveIcon(key); return <Icon size={15} weight="bold" aria-label={label} /> }

  return <main className="app">
    <header><div className="brand"><DeviceMobile size={17} weight="fill" aria-hidden="true" />Dresser</div><div className="selection-state">{icon(selection.status === 'ready' ? 'status.selection' : 'status.error', selection.status === 'ready' ? 'Frame selected' : 'No Frame')}<span>{selection.status === 'ready' ? 'Frame' : 'No Frame'}</span></div></header>
    <section className="content">
      <div className={`preview ${selection.status !== 'ready' ? 'empty' : ''}`}>
        {preview ? <img src={preview.url} alt="Exact Dresser preview" /> : <div className="placeholder"><DeviceMobile size={30} aria-hidden="true" /><span>{selection.status === 'ready' ? 'Update preview' : selection.message}</span></div>}
        {stale && preview && <span className="stale">Stale preview</span>}
      </div>
      <div className="status" role="status" aria-live="polite">{busy && <CircleNotch className="spin" size={14} aria-hidden="true" />}{message}</div>
      {capabilities && preset && <>
        <fieldset><legend>Device</legend><div className="row"><label>Model<select value={preset.device.modelId} onChange={(e) => updatePreset((old) => { const next = capabilities.deviceModels.find((item) => item.id === e.target.value)!; return { ...old, device: { modelId: next.id, colorId: next.colors[0]?.id ?? null } } })}>{capabilities.deviceModels.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}</select></label><label>Color<select value={preset.device.colorId ?? ''} disabled={!model?.colors.length} onChange={(e) => updatePreset((old) => ({ ...old, device: { ...old.device, colorId: e.target.value || null } }))}>{model?.colors.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}</select></label></div></fieldset>
        <fieldset><legend>Background</legend><div className="segments">{capabilities.backgrounds.modes.map((mode) => <button key={mode} className={preset.background.mode === mode ? 'active' : ''} onClick={() => updatePreset((old) => ({ ...old, background: mode === 'solid' ? { mode, color: capabilities.backgrounds.solid.defaultColor } : mode === 'mesh' ? { mode, colors: capabilities.backgrounds.mesh.defaultColors } : mode === 'picture' ? { mode, packId: capabilities.backgrounds.picturePacks[0]?.id ?? '', imageIndex: 1 } : { mode } }))}>{icon(`background.${mode}`, mode)}<span>{mode === 'picture' ? 'Photo' : mode === 'transparent' ? 'None' : mode[0].toUpperCase() + mode.slice(1)}</span></button>)}</div>
          {preset.background.mode === 'solid' && <label className="inline">Color<input type="color" value={preset.background.color} onChange={(e) => updatePreset((old) => ({ ...old, background: { mode: 'solid', color: e.target.value } }))} /></label>}
          {preset.background.mode === 'mesh' && <div className="colors">{preset.background.colors.map((color, index) => <input aria-label={`Mesh color ${index + 1}`} key={index} type="color" value={color} onChange={(e) => updatePreset((old) => { const colors = [...(old.background.mode === 'mesh' ? old.background.colors : capabilities.backgrounds.mesh.defaultColors)] as [string, string, string]; colors[index] = e.target.value; return { ...old, background: { mode: 'mesh', colors } } })} />)}</div>}
          {preset.background.mode === 'picture' && <div className="row"><label>Pack<select value={preset.background.packId} onChange={(e) => updatePreset((old) => ({ ...old, background: { mode: 'picture', packId: e.target.value, imageIndex: 1 } }))}>{capabilities.backgrounds.picturePacks.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}</select></label><label>Image<input type="number" min="1" max={capabilities.backgrounds.picturePacks.find((item) => item.id === (preset.background as Extract<Preset['background'], { mode: 'picture' }>).packId)?.imageCount ?? 1} value={preset.background.imageIndex} onChange={(e) => updatePreset((old) => ({ ...old, background: { ...(old.background as Extract<Preset['background'], { mode: 'picture' }>), imageIndex: Number(e.target.value) } }))} /></label></div>}
        </fieldset>
        <fieldset><legend>Layout</legend><div className="segments ratios">{capabilities.layout.aspectRatios.map((ratio) => <button key={ratio.id} className={preset.layout.aspectRatioId === ratio.id ? 'active' : ''} onClick={() => updatePreset((old) => ({ ...old, layout: { ...old.layout, aspectRatioId: ratio.id } }))}>{ratio.label}</button>)}</div>
          {[['Scale', 'deviceScale', '%'], ['Horizontal', 'x', ' px'], ['Vertical', 'y', ' px']].map(([label, key, suffix]) => { const cap = capabilities.layout[key as 'deviceScale' | 'x' | 'y']; const value = preset.layout[key as 'deviceScale' | 'x' | 'y']; return <label className="range" key={key}><span>{label}</span><input type="range" min={cap.min} max={cap.max} step={cap.step} value={value} onChange={(e) => updatePreset((old) => ({ ...old, layout: { ...old.layout, [key]: Number(e.target.value) } }))} /><output>{value}{suffix}</output></label> })}
          <div className="readonly"><span>Padding</span><strong>{preset.layout.padding} px</strong></div>
        </fieldset>
      </>}
    </section>
    <footer><button className="ghost" onClick={reset} disabled={!capabilities || busy} aria-label="Reset settings">{icon('action.reset', 'Reset settings')}Reset</button><button onClick={updatePreview} disabled={!capabilities || selection.status !== 'ready' || busy}>{icon('action.refresh-preview', 'Update preview')}Update preview</button><button className="primary" onClick={insert} disabled={!capabilities || selection.status !== 'ready' || busy}>{icon('action.insert', 'Insert beside frame')}Insert</button></footer>
  </main>
}

createRoot(document.getElementById('root')!).render(<App />)
