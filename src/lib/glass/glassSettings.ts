/** Figma Glass semantics; this is a web implementation, not Figma's renderer. */
export interface GlassSurfaceSettings {
  lightAngle: number
  lightIntensity: number
  refraction: number
  depth: number
  dispersion: number
  frost: number
  splay: number
  brightness: number
  saturation: number
  shadowLift: number
  fillColor: string
  fillOpacity: number
}

export interface GlassSettings {
  shell: GlassSurfaceSettings
  indicator: GlassSurfaceSettings
}

/** Maintained defaults. Optical light, tone, and flat fill are independent. */
export const GLASS_DEFAULTS: GlassSettings = {
  shell: {
    lightAngle: 0,
    lightIntensity: 0.32,
    refraction: 0.44,
    depth: 18,
    dispersion: 0.04,
    frost: 1.25,
    splay: 0.7,
    brightness: 0.92,
    saturation: 1,
    shadowLift: 0.025,
    fillColor: '#141416',
    fillOpacity: 0.56,
  },
  indicator: {
    lightAngle: 0,
    lightIntensity: 0.36,
    refraction: 0.16,
    depth: 12,
    dispersion: 0.02,
    frost: 0.5,
    splay: 0.7,
    brightness: 0.98,
    saturation: 1,
    shadowLift: 0.03,
    // A dense neutral tint controls backdrop visibility without a bright white fill.
    fillColor: '#5a5a5c',
    fillOpacity: 0.32,
  },
}

type NumericSetting = Exclude<keyof GlassSurfaceSettings, 'fillColor'>
export const GLASS_CONTROLS: {
  key: NumericSetting
  label: string
  min: number
  max: number
  step: number
  unit?: string
  help: string
}[] = [
  { key: 'lightAngle', label: 'Light angle', min: -180, max: 180, step: 1, unit: '°', help: 'Направление света: 0° сверху, положительный угол — по часовой стрелке.' },
  { key: 'lightIntensity', label: 'Light intensity', min: 0, max: 1, step: 0.01, help: 'Яркость бликов. Не меняет прозрачность и тон фона.' },
  { key: 'refraction', label: 'Refraction', min: 0, max: 1, step: 0.01, help: 'Сила преломления у края. 0 полностью отключает смещение.' },
  { key: 'depth', label: 'Depth', min: 1, max: 100, step: 1, unit: 'px', help: 'Насколько далеко от края внутрь заходит кривизна линзы.' },
  { key: 'dispersion', label: 'Dispersion', min: 0, max: 1, step: 0.01, help: 'Раздельное преломление красного, зелёного и синего каналов.' },
  { key: 'frost', label: 'Frost', min: 0, max: 24, step: 0.25, unit: 'px', help: 'Радиус размытия реального фона до преломления.' },
  { key: 'splay', label: 'Splay', min: 0, max: 1, step: 0.01, help: 'Угловая ширина освещения вдоль контура.' },
  { key: 'brightness', label: 'Brightness', min: 0, max: 2, step: 0.01, help: 'Яркость только проходящего через стекло изображения.' },
  { key: 'saturation', label: 'Saturation', min: 0, max: 2, step: 0.01, help: 'Насыщенность изображения под стеклом.' },
  { key: 'shadowLift', label: 'Shadow lift', min: 0, max: 0.3, step: 0.005, help: 'Подсветка тёмных участков. 0 сохраняет исходный чёрный.' },
  { key: 'fillOpacity', label: 'Fill opacity', min: 0, max: 1, step: 0.01, help: 'Отдельная равномерная заливка, как Fill в Figma.' },
]

export function normalizeGlassSettings(input: unknown): GlassSettings {
  const record = input && typeof input === 'object' ? input as Record<string, unknown> : {}
  const normalize = (target: keyof GlassSettings): GlassSurfaceSettings => {
    const value = record[target] && typeof record[target] === 'object'
      ? record[target] as Record<string, unknown> : {}
    const result = { ...GLASS_DEFAULTS[target] }
    for (const { key, min, max } of GLASS_CONTROLS) {
      const number = value[key]
      if (typeof number === 'number' && Number.isFinite(number)) {
        result[key] = Math.min(max, Math.max(min, number))
      }
    }
    if (typeof value.fillColor === 'string' && /^#[\da-f]{6}$/i.test(value.fillColor)) {
      result.fillColor = value.fillColor
    }
    return result
  }
  return { shell: normalize('shell'), indicator: normalize('indicator') }
}

export function glassFill({ fillColor, fillOpacity }: GlassSurfaceSettings): string {
  const channels = [1, 3, 5].map((offset) => parseInt(fillColor.slice(offset, offset + 2), 16))
  return `rgb(${channels.join(' ')} / ${fillOpacity})`
}

/** Include the stacked lenses' blur and chromatic reach in the paint source. */
export function glassSamplingGutter(settings: GlassSettings): number {
  const reach = Object.values(settings).reduce((sum, surface) => sum
    + surface.refraction * 50 * (1 + surface.dispersion * 0.15)
    + surface.frost * 3, 16)
  return Math.max(64, Math.ceil(reach / 16) * 16)
}
