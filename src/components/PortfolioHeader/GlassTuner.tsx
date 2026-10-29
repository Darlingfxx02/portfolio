import { useId, useState } from 'react'
import { GLASS_CONTROLS, GLASS_DEFAULTS, type GlassSettings } from '@/lib/glass/glassSettings'
import styles from './GlassTuner.module.css'

export function GlassTuner({ settings, onChange }: {
  settings: GlassSettings
  onChange: (next: GlassSettings) => void
}) {
  const [target, setTarget] = useState<keyof GlassSettings>('shell')
  const id = useId()
  const surface = settings[target]

  return (
    <details className={styles.panel} open>
      <summary>Glass · настройки</summary>
      <div className={styles.body}>
        <fieldset className={styles.targets}>
          <legend>Слой стекла</legend>
          <label><input type="radio" name={`${id}-target`} checked={target === 'shell'} onChange={() => setTarget('shell')} />Оболочка</label>
          <label><input type="radio" name={`${id}-target`} checked={target === 'indicator'} onChange={() => setTarget('indicator')} />Сегмент</label>
        </fieldset>
        <div className={styles.controls}>
          {GLASS_CONTROLS.map(({ key, label, min, max, step, unit, help }) => (
            <div key={key} className={styles.control} title={help}>
              <label htmlFor={`${id}-${key}`}>{label}<span>{unit}</span></label>
              <input id={`${id}-${key}`} type="range" min={min} max={max} step={step} value={surface[key]}
                onChange={(event) => onChange({ ...settings, [target]: { ...surface, [key]: Number(event.target.value) } })} />
              <input aria-label={`${label} value`} type="number" min={min} max={max} step={step} value={surface[key]}
                onChange={(event) => {
                  if (event.target.value !== '') onChange({ ...settings, [target]: { ...surface, [key]: Number(event.target.value) } })
                }} />
            </div>
          ))}
          <label className={styles.color}>Fill color<input aria-label="Fill color" type="color" value={surface.fillColor}
            onChange={(event) => onChange({ ...settings, [target]: { ...surface, fillColor: event.target.value } })} /></label>
        </div>
        <div className={styles.actions}>
          <button type="button" onClick={() => onChange({ ...settings, [target]: { ...GLASS_DEFAULTS[target] } })}>Сбросить слой</button>
          <button type="button" onClick={() => onChange(GLASS_DEFAULTS)}>Сбросить всё</button>
        </div>
        <details className={styles.export}>
          <summary>JSON для конфига</summary>
          <textarea aria-label="Glass settings JSON" readOnly value={JSON.stringify(settings, null, 2)} rows={12} />
        </details>
      </div>
    </details>
  )
}
