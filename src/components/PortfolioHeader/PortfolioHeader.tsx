import { useCallback, useEffect, useRef, type CSSProperties, type RefObject } from 'react'
import {
  GlassScene,
  GlassSurface,
  GlassTabsList,
  GlassTabsRoot,
  GlassTabsTrigger,
} from '@glass-sdk/liquid-glass'
import '@glass-sdk/liquid-glass/styles.css'
import type { PortfolioTab } from '@/components/PortfolioTabs/PortfolioTabs'
import { LanguageMenu } from './LanguageMenu'
import { ThemeToggle } from './ThemeToggle'
import { GlassBackdrop } from './GlassBackdrop'
import { GlassTuner } from './GlassTuner'
import { AnimatedTabLabel } from './AnimatedTabLabel'
import { glassFill, glassSamplingGutter } from '@/lib/glass/glassSettings'
import type { useGlassSettings } from '@/lib/glass/useGlassSettings'
import { createLiquidSelection, type SelectionPreview } from '@/lib/glass/liquidSelection'
import { t, useLang, type Loc } from '@/lib/i18n'
import { useTheme } from '@/lib/theme'
import styles from './PortfolioHeader.module.css'

type TransitionDirection = 'forward' | 'backward'

const tabs: { id: PortfolioTab; label: Loc }[] = [
  { id: 'home', label: { ru: 'Главная', en: 'Home' } },
  { id: 'explorations', label: { ru: 'Работы', en: 'Explorations' } },
  { id: 'work', label: { ru: 'Кейсы', en: 'Work' } },
  { id: 'about', label: { ru: 'Обо мне', en: 'About' } },
]

export function PortfolioHeader({
  backdropRef,
  glassController,
  showSideControls,
  showBack = false,
  onBack,
  activeTab,
  pendingTab,
  transitionProgress = 0,
  transitionDirection,
  selectionPreviewRef,
  onTabChange,
}: {
  backdropRef: RefObject<HTMLDivElement | null>
  glassController: ReturnType<typeof useGlassSettings>
  showSideControls: boolean
  showBack?: boolean
  onBack?: () => void
  activeTab: PortfolioTab
  pendingTab?: PortfolioTab
  transitionProgress?: number
  transitionDirection?: TransitionDirection
  selectionPreviewRef: RefObject<SelectionPreview | null>
  onTabChange: (tab: PortfolioTab) => void
}) {
  const { lang } = useLang()
  const { theme } = useTheme()
  const { settings: glass, updateSettings, tuning } = glassController
  const sceneRef = useRef<HTMLDivElement>(null)
  const expansionRef = useRef<Animation | null>(null)
  const previousTabRef = useRef(activeTab)
  const selectionGeometry = useCallback((element: HTMLElement) =>
    createLiquidSelection(element, (preview) => { selectionPreviewRef.current = preview }),
  [selectionPreviewRef])

  useEffect(() => {
    if (previousTabRef.current === activeTab) return
    previousTabRef.current = activeTab
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const nav = sceneRef.current?.querySelector<HTMLElement>('[role="tablist"]')
    if (!nav) return

    const computed = getComputedStyle(nav)
    const inset = Number.parseFloat(computed.getPropertyValue('--glass-inset'))
    const from = Number.parseFloat(computed.paddingInlineStart)
    const room = Math.max(0, (window.innerWidth - 24 - nav.offsetWidth) / 2)
    const expansion = Math.min(4, nav.offsetWidth * 0.011, room)
    expansionRef.current?.cancel()
    if (!expansion) return
    const padding = (value: number) => ({
      paddingInlineStart: `${value}px`,
      paddingInlineEnd: `${value}px`,
    })
    // Grow the real capsule by about 2%, keeping its height and labels stable.
    // Reusing the capsule's height also reuses the SDK's material maps.
    expansionRef.current = nav.animate([
      { ...padding(from), offset: 0, easing: 'cubic-bezier(.2,.8,.3,1)' },
      { ...padding(inset + expansion), offset: 0.25, easing: 'cubic-bezier(.3,0,.2,1)' },
      { ...padding(inset), offset: 1 },
    ], { duration: 460 })
  }, [activeTab])

  useEffect(() => () => expansionRef.current?.cancel(), [])

  return (
    <header className={styles.header}>
      {showSideControls && <div className={styles.language}>
        <LanguageMenu backdropRef={backdropRef} glass={glass} showBack={showBack} onBack={onBack} />
      </div>}
      {/* Keep shader geometry in the same fixed coordinate space as the tabs.
          Filtering the scrolling page makes its material lag compositor scroll. */}
      <GlassScene ref={sceneRef} className={styles.scene} appearance={theme} material="clear">
        <GlassBackdrop sourceRef={backdropRef} gutter={glassSamplingGutter(glass)} />
        <GlassTabsRoot
          value={activeTab}
          onValueChange={(value) => {
            if (tabs.some((tab) => tab.id === value)) onTabChange(value as PortfolioTab)
          }}
        >
          <GlassTabsList
            className={styles.nav}
            aria-label={lang === 'ru' ? 'Разделы портфолио' : 'Portfolio sections'}
            data-transition-direction={transitionDirection}
            radius="capsule"
            refraction={22}
            data-glass-optics={JSON.stringify(glass.shell)}
            style={{ '--glass-fill': glassFill(glass.shell) } as CSSProperties}
            interactive={false}
            loopFocus
          >
            <div className={styles.tabTrack}>
              <GlassSurface
                className={styles.indicator}
                aria-hidden="true"
                geometry={selectionGeometry}
                radius="capsule"
                refraction={8}
                motion="reduced"
                data-liquid-target={pendingTab ? `tab-${pendingTab}` : undefined}
                data-liquid-progress={transitionProgress}
                data-glass-optics={JSON.stringify(glass.indicator)}
                style={{ '--glass-fill': glassFill(glass.indicator) } as CSSProperties}
              />
              {tabs.map((tab, index) => {
                const selected = activeTab === tab.id
                const pending = !selected && pendingTab === tab.id && transitionProgress > 0
                return (
                  <GlassTabsTrigger
                    key={tab.id}
                    id={`tab-${tab.id}`}
                    value={tab.id}
                    className={styles.tab}
                    aria-controls={`panel-${tab.id}`}
                    aria-label={t(tab.label, lang)}
                    data-pending={pending || undefined}
                    onClick={() => {
                      if (selected) onTabChange(tab.id)
                    }}
                  >
                    <AnimatedTabLabel label={tab.label} lang={lang} order={index} />
                  </GlassTabsTrigger>
                )
              })}
            </div>
          </GlassTabsList>
        </GlassTabsRoot>
      </GlassScene>
      {showSideControls && <div className={styles.theme}>
        <ThemeToggle backdropRef={backdropRef} glass={glass} />
      </div>}
      {tuning && <GlassTuner settings={glass} onChange={updateSettings} />}
    </header>
  )
}
