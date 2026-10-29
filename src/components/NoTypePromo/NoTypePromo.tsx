import { useState, type CSSProperties } from 'react'
import { ArrowUpRight } from '@phosphor-icons/react'
import { GlassContent, GlassScene, GlassSurface } from '@glass-sdk/liquid-glass'
import { useLang } from '@/lib/i18n'
import { useTheme } from '@/lib/theme'
import { trackEvent, trackNoTypeClick } from '@/lib/analytics'
import { glassFill, glassSamplingGutter, type GlassSettings } from '@/lib/glass/glassSettings'
import { NoTypeFace } from './NoTypeFace'
import styles from './NoTypePromo.module.css'

export function NoTypePromo({ glass }: { glass: GlassSettings }) {
  const { lang } = useLang()
  const { theme } = useTheme()
  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)
  const fill = glassFill(glass.shell)
  const optics = JSON.stringify(glass.shell)

  return (
    <GlassScene className={styles.scene} appearance={theme} material="clear"
      style={{ '--glass-gutter': `${glassSamplingGutter(glass)}px` } as CSSProperties}>
      {/* This in-flow card sits on the page colour. Sampling that surface
          avoids cloning the page (and this scene) into its own backdrop. */}
      <GlassContent className={styles.backdrop} aria-hidden="true" />
      <GlassSurface className={styles.card} radius={16} interactive={false}
        data-glass-optics={optics} style={{ background: fill }} render={
          <a
            href="https://notype.tech/?utm_source=portfolio&utm_medium=referral&utm_campaign=cross_site&utm_content=notype_card"
            target="_blank"
            rel="noopener noreferrer"
            onPointerEnter={(event) => {
              if (event.pointerType === 'mouse') setHovered(true)
            }}
            onPointerLeave={() => setHovered(false)}
            onPointerCancel={() => setHovered(false)}
            onFocus={(event) => setFocused(event.currentTarget.matches(':focus-visible'))}
            onBlur={() => setFocused(false)}
            aria-label={
              lang === 'ru'
                ? 'No Type — мой продукт. Открыть сайт'
                : 'No Type — my product. Visit the website'
            }
            onClick={(event) => {
              if (event.defaultPrevented) return
              trackEvent('product_opened', { target: 'notype' })
              trackNoTypeClick()
            }}
            onAuxClick={(event) => {
              if (event.button === 1 && !event.defaultPrevented) {
                trackEvent('product_opened', { target: 'notype' })
                trackNoTypeClick()
              }
            }}
          />
        }>
        <span className={styles.face} aria-hidden>
          <NoTypeFace active={hovered || focused} />
        </span>
        <span className={styles.copy}>
          <span className={styles.title}>No Type</span>
          <span className={styles.description}>
            {lang === 'ru'
              ? 'Создал и выпустил приложение для голосового ввода.'
              : 'Designed, built, and released a voice typing app.'}
          </span>
        </span>
        <GlassSurface className={styles.open} radius="circle" interactive={false}
          data-glass-optics={JSON.stringify(glass.indicator)}
          style={{ background: glassFill(glass.indicator) }} render={<span />} aria-hidden="true">
          <ArrowUpRight size={24} weight="regular" stroke="currentColor"
            strokeWidth={theme === 'light' ? 4 : 0} strokeLinejoin="round" />
        </GlassSurface>
      </GlassSurface>
    </GlassScene>
  )
}
