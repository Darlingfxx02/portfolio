import { useEffect, useMemo, useState } from 'react'
import { useTheme } from '@/lib/theme'
import { GLASS_DEFAULTS, normalizeGlassSettings, type GlassSettings } from './glassSettings'

const storageKey = 'portfolio:glass:v1'

function loadSettings(tuning: boolean): GlassSettings {
  if (tuning) {
    try {
      const stored = localStorage.getItem(storageKey)
      if (stored) return normalizeGlassSettings(JSON.parse(stored))
    } catch { /* A blocked store should not prevent the portfolio from loading. */ }
  }
  return normalizeGlassSettings(GLASS_DEFAULTS)
}

export function useGlassSettings() {
  const { theme } = useTheme()
  const tuning = import.meta.env.DEV && new URLSearchParams(window.location.search).has('glass')
  const [preview, setPreview] = useState(() => loadSettings(tuning))
  // Experimental panel values belong to the tuning view; the normal portfolio
  // always shows the maintained defaults, including after a hot update.
  const base = tuning ? preview : GLASS_DEFAULTS
  const settings = useMemo(() => theme === 'dark' ? base : {
    shell: { ...base.shell, fillColor: '#ffffff', fillOpacity: 0.85, frost: 6, brightness: 1, shadowLift: 0 },
    indicator: { ...base.indicator, fillColor: '#f5f5f5', fillOpacity: 1, brightness: 1, shadowLift: 0 },
  }, [base, theme])

  useEffect(() => {
    if (!tuning) return
    const update = (event: StorageEvent) => {
      if (event.key === storageKey || event.key === null) setPreview(loadSettings(tuning))
    }
    window.addEventListener('storage', update)
    return () => window.removeEventListener('storage', update)
  }, [tuning])

  const updateSettings = (next: GlassSettings) => {
    const normalized = normalizeGlassSettings(next)
    setPreview(normalized)
    if (tuning) {
      try { localStorage.setItem(storageKey, JSON.stringify(normalized)) } catch { /* Use in memory. */ }
    }
  }

  return { settings, updateSettings, tuning }
}
