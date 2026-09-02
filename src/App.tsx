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
import { CaseUxart } from '@/components/cases/CaseUxart'
import { CaseOvork } from '@/components/cases/CaseOvork'
import { Cv } from '@/components/Cv/Cv'
import { AnalyticsConsent } from '@/components/AnalyticsConsent/AnalyticsConsent'
import { cases } from '@/data/cases'
import { initSfx, tabTick } from '@/lib/sound'
import { initAnalytics, trackEvent } from '@/lib/analytics'
import styles from './App.module.css'

const CASE_COMPONENTS: Record<string, ComponentType> = {
  zinda: CaseZinda,
  'zinda-system': CaseZinda,
  'zinda-mobile': CaseZinda,
  uxart: CaseUxart,
  ovork: CaseOvork,
}

const SECTION_ORDER: PortfolioTab[] = ['home', 'explorations', 'work', 'about']
const TOUCH_SECTION_DISTANCE = 320
type SectionScrollDirection = 'forward' | 'backward'
type SectionArrival = 'top' | 'saved'

const SCROLL_STORAGE_PREFIX = 'darling-live:scroll:'

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

function tabFromHash(hash: string): PortfolioTab {
  if (hash === '#work' || hash === '#works') return 'work'
  if (hash === '#explorations') return 'explorations'
  if (hash === '#about' || hash === '#contact') return 'about'
  return 'home'
}

function scrollStorageKey(hash: string) {
  const route =
    hash === '#cv' || hash.startsWith('#case/') ? hash : `#${tabFromHash(hash)}`
  return `${SCROLL_STORAGE_PREFIX}${route}`
}

function saveScrollPosition(hash: string, position = window.scrollY) {
  try {
    window.localStorage.setItem(scrollStorageKey(hash), String(Math.max(0, position)))
  } catch {
    // Browsers may disable localStorage; navigation still works without memory.
  }
}

function savedScrollPosition(hash: string) {
  try {
    const stored = Number(window.localStorage.getItem(scrollStorageKey(hash)))
    return Number.isFinite(stored) ? Math.max(0, stored) : 0
  } catch {
    return 0
  }
}

function scrollImmediatelyTo(hash: string, arrival: SectionArrival = 'saved') {
  const root = document.documentElement
  const previousScrollBehavior = root.style.scrollBehavior
  const maxScroll = Math.max(0, root.scrollHeight - window.innerHeight)
  const target =
    arrival === 'saved'
      ? Math.min(savedScrollPosition(hash), maxScroll)
      : 0

  root.style.scrollBehavior = 'auto'
  window.scrollTo(0, target)

  // Keep smooth scrolling disabled until the browser has applied the jump.
  window.requestAnimationFrame(() => {
    root.style.scrollBehavior = previousScrollBehavior
  })
}

function App() {
  const hash = useHash()
  const caseId = hash.startsWith('#case/') ? hash.slice('#case/'.length) : ''
  const caseStudy = cases.find((study) => study.id === caseId)
  const CaseView = caseStudy?.disabled ? undefined : CASE_COMPONENTS[caseId]
  const onCase = !!CaseView
  const onCv = hash === '#cv'
  const activeTab = tabFromHash(hash)
  const activeTabIndex = SECTION_ORDER.indexOf(activeTab)
  const nextTab = SECTION_ORDER[(activeTabIndex + 1) % SECTION_ORDER.length]
  const previousTab =
    SECTION_ORDER[(activeTabIndex - 1 + SECTION_ORDER.length) % SECTION_ORDER.length]
  const sectionArrivalRef = useRef<SectionArrival>('saved')
  const resetSectionTransitionRef = useRef<() => void>(() => {})

  const showTab = useCallback((tab: PortfolioTab, arrival: SectionArrival = 'saved') => {
    const nextHash = `#${tab}`
    if (arrival === 'saved') resetSectionTransitionRef.current()
    saveScrollPosition(window.location.hash)
    sectionArrivalRef.current = arrival
    if (window.location.hash === nextHash) {
      scrollImmediatelyTo(nextHash, arrival)
      sectionArrivalRef.current = 'saved'
      return
    }
    tabTick()
    window.location.hash = nextHash
  }, [])

  const navigateSection = useCallback(
    (direction: SectionScrollDirection) => {
      if (direction === 'forward') showTab(nextTab, 'top')
      else showTab(previousTab, 'top')
    },
    [nextTab, previousTab, showTab],
  )

  const sectionTransition = useCyclicSectionScroll({
    activeTab,
    disabled: onCase,
    onNavigate: navigateSection,
  })
  useEffect(() => {
    resetSectionTransitionRef.current = sectionTransition.reset
  }, [sectionTransition.reset])
  const pendingTab =
    sectionTransition.direction === 'backward' ? previousTab : nextTab

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

  // Manual navigation restores the remembered position. Cyclic edge navigation
  // overrides it with the top/bottom edge that the gesture crossed.
  useLayoutEffect(() => {
    scrollImmediatelyTo(hash, sectionArrivalRef.current)
    sectionArrivalRef.current = 'saved'
  }, [hash])

  useLayoutEffect(() => {
    let latestPosition = window.scrollY
    let saveFrame: number | null = null

    const persist = () => {
      saveFrame = null
      saveScrollPosition(hash, latestPosition)
    }
    const onScroll = () => {
      latestPosition = window.scrollY
      if (saveFrame === null) saveFrame = window.requestAnimationFrame(persist)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (saveFrame !== null) window.cancelAnimationFrame(saveFrame)
      saveScrollPosition(hash, latestPosition)
    }
  }, [hash])

  useEffect(() => {
    trackEvent('route_view', {
      case_id: hash.startsWith('#case/') ? hash.slice('#case/'.length) : undefined,
    })
  }, [hash])

  return (
    <>
      {onCv ? (
        <Cv />
      ) : (
        <>
          <PortfolioHeader
            activeTab={onCase ? 'work' : activeTab}
            pendingTab={onCase ? undefined : pendingTab}
            transitionProgress={onCase ? 0 : sectionTransition.progress}
            transitionDirection={onCase ? undefined : sectionTransition.direction}
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
            onBack={onCase ? () => showTab('work') : undefined}
            onContact={() => showTab('about')}
          />
          <ScrollBar />
        </>
      )}
      <AnalyticsConsent />
    </>
  )
}

function useCyclicSectionScroll({
  activeTab,
  disabled,
  onNavigate,
}: {
  activeTab: PortfolioTab
  disabled: boolean
  onNavigate: (direction: SectionScrollDirection) => void
}) {
  const [progress, setProgress] = useState(0)
  const [direction, setDirection] = useState<SectionScrollDirection>()
  const lockedRef = useRef(false)
  const unlockTimerRef = useRef<number | null>(null)
  const reset = useCallback(() => {
    setProgress(0)
    setDirection(undefined)
  }, [])

  useEffect(
    () => () => {
      if (unlockTimerRef.current) {
        window.clearTimeout(unlockTimerRef.current)
      }
    },
    [],
  )

  useEffect(() => {
    if (disabled) return

    let wheelTravel = 0
    let lastWheelAt = 0
    let gestureStartedAt = 0
    let idleTimer: number | null = null
    let touchStartY: number | null = null
    let touchStartEdge: 'top' | 'bottom' | 'both' | null = null
    let gestureDirection: SectionScrollDirection | null = null

    const atBottom = () =>
      window.scrollY + window.innerHeight >=
      document.documentElement.scrollHeight - 2
    const atTop = () => window.scrollY <= 2

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
      touchStartEdge = null
      gestureDirection = null
      setProgress(0)
    }

    const scheduleGestureReset = () => {
      clearIdleTimer()
      idleTimer = window.setTimeout(resetGesture, 650)
    }

    const navigate = (nextDirection: SectionScrollDirection) => {
      if (lockedRef.current) return
      lockedRef.current = true
      resetGesture()
      setDirection(nextDirection)
      onNavigate(nextDirection)
      if (unlockTimerRef.current) window.clearTimeout(unlockTimerRef.current)
      unlockTimerRef.current = window.setTimeout(() => {
        lockedRef.current = false
        unlockTimerRef.current = null
      }, 1100)
    }

    const updateWheelProgress = (
      delta: number,
      now: number,
      nextDirection: SectionScrollDirection,
    ) => {
      if (gestureDirection !== nextDirection) {
        resetGesture()
        gestureDirection = nextDirection
        setDirection(nextDirection)
      }
      if (!gestureStartedAt) gestureStartedAt = now
      wheelTravel += Math.min(Math.abs(delta), 44)

      const distanceProgress = Math.min(wheelTravel / 360, 1)
      const timeProgress = Math.min((now - gestureStartedAt + 80) / 650, 1)
      const nextProgress = Math.min(distanceProgress, timeProgress)

      setProgress(nextProgress)
      scheduleGestureReset()
      if (distanceProgress >= 1 && timeProgress >= 1) navigate(nextDirection)
    }

    const onWheel = (event: WheelEvent) => {
      if (lockedRef.current) {
        if (event.deltaY !== 0) event.preventDefault()
        return
      }

      const nextDirection =
        event.deltaY > 0 && atBottom()
          ? 'forward'
          : event.deltaY < 0 && atTop()
            ? 'backward'
            : null

      if (!nextDirection) {
        resetGesture()
        return
      }

      // The extra gesture belongs to section navigation, not to either
      // section's native scroll position.
      event.preventDefault()

      const now = performance.now()
      if (lastWheelAt && now - lastWheelAt > 650) resetGesture()
      lastWheelAt = now
      updateWheelProgress(event.deltaY, now, nextDirection)
    }

    const onTouchStart = (event: TouchEvent) => {
      const startsAtTop = atTop()
      const startsAtBottom = atBottom()
      if ((!startsAtBottom && !startsAtTop) || lockedRef.current) {
        touchStartY = null
        touchStartEdge = null
        return
      }
      touchStartY = event.touches[0]?.clientY ?? null
      touchStartEdge =
        startsAtTop && startsAtBottom
          ? 'both'
          : startsAtTop
            ? 'top'
            : 'bottom'
    }

    const onTouchMove = (event: TouchEvent) => {
      if (lockedRef.current) {
        event.preventDefault()
        return
      }

      if (touchStartY === null) return
      const currentY = event.touches[0]?.clientY
      if (currentY === undefined) return

      const distance = touchStartY - currentY
      if (Math.abs(distance) < 8) return

      // A native page scroll and an inter-page swipe must never share the same
      // touch. Only arm navigation when the gesture started on the matching
      // edge and its first meaningful movement points out of that edge.
      const startedForForward =
        touchStartEdge === 'bottom' || touchStartEdge === 'both'
      const startedForBackward =
        touchStartEdge === 'top' || touchStartEdge === 'both'
      const nextDirection =
        distance > 0 && startedForForward && atBottom()
          ? 'forward'
          : distance < 0 && startedForBackward && atTop()
            ? 'backward'
            : null
      if (!nextDirection) {
        touchStartY = null
        touchStartEdge = null
        gestureDirection = null
        setProgress(0)
        setDirection(undefined)
        return
      }
      event.preventDefault()

      if (gestureDirection !== nextDirection) {
        gestureDirection = nextDirection
        setDirection(nextDirection)
      }
      const distanceProgress = Math.min(
        Math.abs(distance) / TOUCH_SECTION_DISTANCE,
        1,
      )
      setProgress(distanceProgress)
      if (distanceProgress >= 1) navigate(nextDirection)
    }

    const onTouchEnd = () => {
      if (!lockedRef.current) resetGesture()
    }

    const onKeyDown = (event: KeyboardEvent) => {
      const nextDirection =
        ['ArrowDown', 'PageDown'].includes(event.key) ||
        (event.key === ' ' && !event.shiftKey)
          ? 'forward'
          : ['ArrowUp', 'PageUp'].includes(event.key) ||
              (event.key === ' ' && event.shiftKey)
            ? 'backward'
            : null
      if (!nextDirection) return
      if (lockedRef.current) {
        event.preventDefault()
        return
      }
      if (
        (nextDirection === 'forward' && !atBottom()) ||
        (nextDirection === 'backward' && !atTop())
      ) {
        return
      }

      event.preventDefault()

      const now = performance.now()
      if (lastWheelAt && now - lastWheelAt > 650) resetGesture()
      lastWheelAt = now
      updateWheelProgress(52, now, nextDirection)
    }

    window.addEventListener('wheel', onWheel, { passive: false })
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchmove', onTouchMove, { passive: false })
    window.addEventListener('touchend', onTouchEnd, { passive: true })
    window.addEventListener('touchcancel', onTouchEnd, { passive: true })
    window.addEventListener('keydown', onKeyDown)

    return () => {
      clearIdleTimer()
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('touchend', onTouchEnd)
      window.removeEventListener('touchcancel', onTouchEnd)
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [activeTab, disabled, onNavigate])

  return { progress, direction, reset }
}

export default App
