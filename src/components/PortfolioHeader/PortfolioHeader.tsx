import { useRef, type CSSProperties, type KeyboardEvent } from 'react'
import type { PortfolioTab } from '@/components/PortfolioTabs/PortfolioTabs'
import { t, useLang, type Loc } from '@/lib/i18n'
import styles from './PortfolioHeader.module.css'

const tabs: { id: PortfolioTab; label: Loc }[] = [
  { id: 'home', label: { ru: 'Главная', en: 'Home' } },
  { id: 'work', label: { ru: 'Работы', en: 'Work' } },
  { id: 'explorations', label: { ru: 'Эксперименты', en: 'Explorations' } },
  { id: 'about', label: { ru: 'Обо мне', en: 'About' } },
]

export function PortfolioHeader({
  activeTab,
  pendingTab,
  transitionProgress = 0,
  onTabChange,
}: {
  activeTab: PortfolioTab
  pendingTab?: PortfolioTab
  transitionProgress?: number
  onTabChange: (tab: PortfolioTab) => void
}) {
  const { lang } = useLang()
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([])

  const onTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return
    event.preventDefault()

    let nextIndex = index
    if (event.key === 'ArrowLeft') nextIndex = (index - 1 + tabs.length) % tabs.length
    if (event.key === 'ArrowRight') nextIndex = (index + 1) % tabs.length
    if (event.key === 'Home') nextIndex = 0
    if (event.key === 'End') nextIndex = tabs.length - 1

    const nextTab = tabs[nextIndex]
    onTabChange(nextTab.id)
    window.requestAnimationFrame(() => tabRefs.current[nextIndex]?.focus())
  }

  return (
    <header className={styles.header}>
      <nav
        className={styles.nav}
        role="tablist"
        aria-label={lang === 'ru' ? 'Разделы портфолио' : 'Portfolio sections'}
      >
        {tabs.map((tab, index) => {
          const selected = activeTab === tab.id
          const pending = !selected && pendingTab === tab.id && transitionProgress > 0
          return (
            <button
              key={tab.id}
              id={`tab-${tab.id}`}
              ref={(node) => {
                tabRefs.current[index] = node
              }}
              className={styles.tab}
              type="button"
              role="tab"
              aria-controls={`panel-${tab.id}`}
              aria-selected={selected}
              tabIndex={selected ? 0 : -1}
              data-sfx-click="off"
              data-active={selected || undefined}
              data-pending={pending || undefined}
              style={
                pending
                  ? ({
                      '--tab-progress': transitionProgress,
                    } as CSSProperties)
                  : undefined
              }
              onClick={() => onTabChange(tab.id)}
              onKeyDown={(event) => onTabKeyDown(event, index)}
            >
              {t(tab.label, lang)}
            </button>
          )
        })}
      </nav>
    </header>
  )
}
