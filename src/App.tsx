import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ComponentType,
} from 'react'
import { Profile } from '@/components/Profile/Profile'
import { UsageHeatmap } from '@/components/UsageHeatmap/UsageHeatmap'
import { Experience } from '@/components/Experience/Experience'
import { PortfolioHeader } from '@/components/PortfolioHeader/PortfolioHeader'
import {
  PortfolioTabs,
  type PortfolioTab,
} from '@/components/PortfolioTabs/PortfolioTabs'
import { DockBar } from '@/components/DockBar/DockBar'
import { ScrollBar } from '@/components/ScrollBar/ScrollBar'
import { CaseZinda } from '@/components/cases/CaseZinda'
import { CaseZindaSystem } from '@/components/cases/CaseZindaSystem'
import { CaseZindaMobile } from '@/components/cases/CaseZindaMobile'
import { CaseUxart } from '@/components/cases/CaseUxart'
import { CaseOvork } from '@/components/cases/CaseOvork'
import { Cv } from '@/components/Cv/Cv'
import { initSfx, tabTick } from '@/lib/sound'
import { initAnalytics, trackEvent } from '@/lib/analytics'
import styles from './App.module.css'

const CASES: Record<string, ComponentType> = {
  zinda: CaseZinda,
  'zinda-system': CaseZindaSystem,
  'zinda-mobile': CaseZindaMobile,
  uxart: CaseUxart,
  ovork: CaseOvork,
}

const SECTION_ORDER: PortfolioTab[] = ['home', 'work', 'explorations', 'about']

function useHash() {
  const [hash, setHash] = useState(() =>
    typeof window === 'undefined' ? '' : window.location.hash,
  )
  useEffect(() => {
    const on = () => setHash(window.location.hash)
    window.addEventListener('hashchange', on)
    return () => window.removeEventListener('hashchange', on)
  }, [])
  return hash
}

function scrollImmediatelyTo(hash: string) {
  const root = document.documentElement
  const previousScrollBehavior = root.style.scrollBehavior
  root.style.scrollBehavior = 'auto'

  const id = hash.replace('#', '')
  const target = id && id !== 'top' ? document.getElementById(id) : null
  if (target) target.scrollIntoView()
  else window.scrollTo(0, 0)

  root.style.scrollBehavior = previousScrollBehavior
}

function tabFromHash(hash: string): PortfolioTab {
  if (hash === '#work' || hash === '#works') return 'work'
  if (hash === '#explorations') return 'explorations'
  if (hash === '#about' || hash === '#contact') return 'about'
  return 'home'
}

function App() {
  const hash = useHash()
  const caseId = hash.startsWith('#case/') ? hash.slice('#case/'.length) : ''
  const CaseView = CASES[caseId]
  const onCase = !!CaseView
  const onCv = hash === '#cv'
  const activeTab = tabFromHash(hash)
  const activeTabIndex = SECTION_ORDER.indexOf(activeTab)
  const nextTab = SECTION_ORDER[(activeTabIndex + 1) % SECTION_ORDER.length]

  const showTab = useCallback((tab: PortfolioTab) => {
    const nextHash = `#${tab}`
    if (window.location.hash === nextHash) {
      scrollImmediatelyTo(nextHash)
      return
    }
    tabTick()
    window.location.hash = nextHash
  }, [])

  const advanceSection = useCallback(() => {
    showTab(nextTab)
  }, [nextTab, showTab])

  const sectionTransitionProgress = useCyclicSectionScroll({
    activeTab,
    disabled: onCase,
    onAdvance: advanceSection,
  })

  useEffect(() => {
    initSfx()
    initAnalytics()
  }, [])

  useEffect(() => {
    const previousScrollRestoration = window.history.scrollRestoration
    window.history.scrollRestoration = 'manual'
    return () => {
      window.history.scrollRestoration = previousScrollRestoration
    }
  }, [])

  // Every section is a full screen in the cycle, so selecting the next one
  // starts it from the top rather than inheriting the previous screen's scroll.
  useLayoutEffect(() => {
    scrollImmediatelyTo(hash)
  }, [hash])

  useEffect(() => {
    trackEvent('route_view', {
      case_id: hash.startsWith('#case/') ? hash.slice('#case/'.length) : undefined,
    })
  }, [hash])

  return (
    onCv ? (
      <Cv />
    ) : (
      <>
        <PortfolioHeader
          activeTab={onCase ? 'work' : activeTab}
          pendingTab={onCase ? undefined : nextTab}
          transitionProgress={onCase ? 0 : sectionTransitionProgress}
          onTabChange={showTab}
        />
        {onCase ? (
          <CaseView />
        ) : (
          <div id="top" className={styles.page}>
            {activeTab === 'home' ? (
              <main
                key="home"
                id="panel-home"
                className={styles.homeScreen}
                role="tabpanel"
                aria-labelledby="tab-home"
              >
                <Profile />
                <UsageHeatmap />
                <Experience />
              </main>
            ) : (
              <PortfolioTabs key={activeTab} activeTab={activeTab} />
            )}
          </div>
        )}
        <DockBar
          showBack={onCase}
          onContact={onCase ? undefined : () => showTab('about')}
        />
        <ScrollBar />
      </>
    )
  )
}

function useCyclicSectionScroll({
  activeTab,
  disabled,
  onAdvance,
}: {
  activeTab: PortfolioTab
  disabled: boolean
  onAdvance: () => void
}) {
  const [progress, setProgress] = useState(0)
  const lockedRef = useRef(false)
  const unlockTimerRef = useRef<number | null>(null)

  useEffect(
    () => () => {
      if (unlockTimerRef.current) {
        window.clearTimeout(unlockTimerRef.current)
      }
    },
    [],
  )

  useEffect(() => {
    setProgress(0)
    if (disabled) return

    let wheelTravel = 0
    let lastWheelAt = 0
    let gestureStartedAt = 0
    let idleTimer: number | null = null
    let touchStartY: number | null = null
    let touchStartedAt = 0

    const atBottom = () =>
      window.scrollY + window.innerHeight >=
      document.documentElement.scrollHeight - 2

    const clearIdleTimer = () => {
      if (idleTimer !== null) {
        window.clearTimeout(idleTimer)
        idleTimer = null
      }
    }

    const resetGesture = () => {
      clearIdleTimer()
      wheelTravel = 0
      lastWheelAt = 0
      gestureStartedAt = 0
      touchStartY = null
      touchStartedAt = 0
      setProgress(0)
    }

    const scheduleGestureReset = () => {
      clearIdleTimer()
      idleTimer = window.setTimeout(resetGesture, 650)
    }

    const advance = () => {
      if (lockedRef.current) return
      lockedRef.current = true
      resetGesture()
      onAdvance()
      if (unlockTimerRef.current) window.clearTimeout(unlockTimerRef.current)
      unlockTimerRef.current = window.setTimeout(() => {
        lockedRef.current = false
        unlockTimerRef.current = null
      }, 1100)
    }

    const updateWheelProgress = (delta: number, now: number) => {
      if (!gestureStartedAt) gestureStartedAt = now
      wheelTravel += Math.min(Math.max(delta, 0), 44)

      const distanceProgress = Math.min(wheelTravel / 360, 1)
      const timeProgress = Math.min((now - gestureStartedAt + 80) / 650, 1)
      const nextProgress = Math.min(distanceProgress, timeProgress)

      setProgress(nextProgress)
      scheduleGestureReset()
      if (distanceProgress >= 1 && timeProgress >= 1) advance()
    }

    const onWheel = (event: WheelEvent) => {
      if (lockedRef.current) {
        if (event.deltaY > 0) event.preventDefault()
        return
      }

      if (event.deltaY <= 0 || !atBottom()) {
        resetGesture()
        return
      }

      // The extra gesture belongs to section navigation, not to the next
      // section's scroll position.
      event.preventDefault()

      const now = performance.now()
      if (lastWheelAt && now - lastWheelAt > 650) resetGesture()
      lastWheelAt = now
      updateWheelProgress(event.deltaY, now)
    }

    const onTouchStart = (event: TouchEvent) => {
      if (!atBottom() || lockedRef.current) {
        touchStartY = null
        return
      }
      touchStartY = event.touches[0]?.clientY ?? null
      touchStartedAt = performance.now()
    }

    const onTouchMove = (event: TouchEvent) => {
      if (lockedRef.current) {
        event.preventDefault()
        return
      }

      if (touchStartY === null || !atBottom()) return
      const currentY = event.touches[0]?.clientY
      if (currentY === undefined) return

      const distance = touchStartY - currentY
      if (distance <= 0) return
      event.preventDefault()

      const now = performance.now()
      const distanceProgress = Math.min(distance / 240, 1)
      const timeProgress = Math.min((now - touchStartedAt + 60) / 420, 1)
      setProgress(Math.min(distanceProgress, timeProgress))
      if (distanceProgress >= 1 && timeProgress >= 1) advance()
    }

    const onTouchEnd = () => {
      if (!lockedRef.current) resetGesture()
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (!['ArrowDown', 'PageDown', ' '].includes(event.key)) return
      if (lockedRef.current) {
        event.preventDefault()
        return
      }
      if (!atBottom()) return

      event.preventDefault()

      const now = performance.now()
      if (lastWheelAt && now - lastWheelAt > 650) resetGesture()
      lastWheelAt = now
      updateWheelProgress(52, now)
    }

    window.addEventListener('wheel', onWheel, { passive: false })
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchmove', onTouchMove, { passive: false })
    window.addEventListener('touchend', onTouchEnd, { passive: true })
    window.addEventListener('keydown', onKeyDown)

    return () => {
      clearIdleTimer()
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('touchend', onTouchEnd)
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [activeTab, disabled, onAdvance])

  return progress
}

export default App
