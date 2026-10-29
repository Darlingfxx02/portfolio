import type { RefObject } from 'react'
import { GlassScene, GlassSurface } from '@glass-sdk/liquid-glass'
import { useLang } from '@/lib/i18n'
import { useTheme } from '@/lib/theme'
import { glassFill, glassSamplingGutter, type GlassSettings } from '@/lib/glass/glassSettings'
import { GlassBackdrop } from './GlassBackdrop'
import { ThemeIcon } from './ThemeIcon'
import styles from './ThemeToggle.module.css'

export function ThemeToggle({ backdropRef, glass }: {
  backdropRef: RefObject<HTMLDivElement | null>
  glass: GlassSettings
}) {
  const { lang } = useLang()
  const { theme, toggleTheme } = useTheme()
  const label = theme === 'dark'
    ? lang === 'ru' ? 'Включить светлую тему' : 'Switch to light theme'
    : lang === 'ru' ? 'Включить тёмную тему' : 'Switch to dark theme'

  return (
    <GlassScene className={styles.scene} appearance={theme} material="clear">
      <GlassBackdrop sourceRef={backdropRef} gutter={glassSamplingGutter(glass)} />
      <GlassSurface className={styles.optics} radius="circle"
        data-glass-optics={JSON.stringify(glass.shell)} aria-hidden="true" />
      <button type="button" className={styles.trigger} onClick={toggleTheme}
        style={{ background: glassFill(glass.shell) }} aria-label={label} title={label}>
        <ThemeIcon theme={theme} />
      </button>
    </GlassScene>
  )
}
