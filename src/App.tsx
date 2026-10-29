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
import { NoTypePromo } from '@/components/NoTypePromo/NoTypePromo'
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
import type { SelectionPreview } from '@/lib/glass/liquidSelection'
import { useGlassSettings } from '@/lib/glass/useGlassSettings'
import { useMobileLayout } from '@/lib/useMobileLayout'
import {
  adjacentSection,
  navigationArrival,
  sectionEdgeDirection,
  sectionScrollPosition,
  type ScrollNavigation,
  type SectionScrollDirection,
} from '@/lib/sectionScroll'
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
  if (hash.startsWith('#case/')) return
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

function scrollImmediatelyTo(hash: string, navigation: ScrollNavigation = 'restore') {
  const root = document.documentElement
  const previousScrollBehavior = root.style.scrollBehavior
  const maxScroll = Math.max(0, root.scrollHeight - window.innerHeight)
  const arrival = navigationArrival(hash, navigation)
  const target = sectionScrollPosition(arrival, maxScroll, arrival === 'saved' ? savedScrollPosition(hash) : 0)

  root.style.scrollBehavior = 'auto'
  window.scrollTo(0, target)

  // Keep smooth scrolling disabled until the browser has applied the jump.
  window.requestAnimationFrame(() => {
    root.style.scrollBehavior = previousScrollBehavior
  })
}

function App() {
  const glassSourceRef = useRef<HTMLDivElement>(null)
  const glassController = useGlassSettings()
  const mobileControls = useMobileLayout()
  const hash = useHash()
  const caseId = hash.startsWith('#case/') ? hash.slice('#case/'.length) : ''
  const caseStudy = cases.find((study) => study.id === caseId)
  const CaseView = caseStudy?.disabled ? undefined : CASE_COMPONENTS[caseId]
  const onCase = !!CaseView
  const onCv = hash === '#cv'
  const activeTab = tabFromHash(hash)
  const nextTab = adjacentSection(SECTION_ORDER, activeTab, 'forward')
  const previousTab = adjacentSection(SECTION_ORDER, activeTab, 'backward')
  const scrollNavigationRef = useRef<ScrollNavigation>('restore')
  const resetSectionTransitionRef = useRef<() => void>(() => {})

  const showTab = useCallback((tab: PortfolioTab, navigation: ScrollNavigation = 'restore') => {
    const nextHash = `#${tab}`
    if (navigation === 'menu' || navigation === 'restore') resetSectionTransitionRef.current()
    saveScrollPosition(window.location.hash)
    scrollNavigationRef.current = navigation
    if (window.location.hash === nextHash) {
      scrollImmediatelyTo(nextHash, navigation)
      scrollNavigationRef.current = 'restore'
      return
    }
    tabTick()
    window.location.hash = nextHash
  }, [])

  const selectTab = useCallback((tab: PortfolioTab) => showTab(tab, 'menu'), [showTab])

  const navigateSection = useCallback(
    (direction: SectionScrollDirection) => {
      if (direction === 'forward' && nextTab) showTab(nextTab, 'forward')
      else if (direction === 'backward' && previousTab) showTab(previousTab, 'backward')
    },
    [nextTab, previousTab, showTab],
  )

  const sectionTransition = useSectionScroll({
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

  // Cases and menu selections start at the top. Section gestures enter through
  // the matching edge; other section returns can restore their saved position.
  useLayoutEffect(() => {
    scrollImmediatelyTo(hash, scrollNavigationRef.current)
    scrollNavigationRef.current = 'restore'
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
            backdropRef={glassSourceRef}
            glassController={glassController}
            showSideControls={!mobileControls}
            showBack={onCase}
            onBack={onCase ? () => showTab('work') : undefined}
            activeTab={onCase ? 'work' : activeTab}
            pendingTab={onCase ? undefined : pendingTab}
            transitionProgress={onCase ? 0 : sectionTransition.progress}
            transitionDirection={onCase ? undefined : sectionTransition.direction}
            selectionPreviewRef={sectionTransition.selectionPreviewRef}
            onTabChange={selectTab}
          />
          <div ref={glassSourceRef}>
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
                    <div className={styles.productActivity}>
                      <NoTypePromo glass={glassController.settings} />
                      <UsageHeatmap />
                    </div>
                    <Experience />
                  </main>
                ) : (
                  <PortfolioTabs key={activeTab} activeTab={activeTab} />
                )}
              </div>
            )}
          </div>
          <DockBar
            backdropRef={glassSourceRef}
            glass={glassController.settings}
            showControls={mobileControls}
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

function useSectionScroll({
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
  const selectionPreviewRef = useRef<SelectionPreview | null>(null)
  const reset = useCallback(() => {
    setProgress(0)
    setDirection(undefined)
  }, [])

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
    const hasNeighbor = (nextDirection: SectionScrollDirection) =>
      adjacentSection(SECTION_ORDER, activeTab, nextDirection) !== undefined

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

    const navigate = (nextDirection: SectionScrollDirection) => {
      resetGesture()
      setDirection(nextDirection)
      onNavigate(nextDirection)
    }

    const finishGesture = () => {
      const preview = selectionPreviewRef.current
      const target = gestureDirection && adjacentSection(SECTION_ORDER, activeTab, gestureDirection)
      if (gestureDirection && preview?.source === `tab-${activeTab}` &&
        preview.target === `tab-${target}` && preview.position > 0.5) {
        navigate(gestureDirection)
      } else resetGesture()
    }

    const scheduleGestureFinish = () => {
      clearIdleTimer()
      idleTimer = window.setTimeout(finishGesture, 650)
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
      scheduleGestureFinish()
      if (distanceProgress >= 1 && timeProgress >= 1) navigate(nextDirection)
    }

    const onWheel = (event: WheelEvent) => {
      if (event.deltaY === 0 || event.ctrlKey) return

      const nextDirection = sectionEdgeDirection(
        event.deltaY,
        window.scrollY,
        Math.max(0, document.documentElement.scrollHeight - window.innerHeight),
      )
      if (!nextDirection || !hasNeighbor(nextDirection)) {
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
      if (!startsAtBottom && !startsAtTop) {
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
      if (!nextDirection || !hasNeighbor(nextDirection)) {
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
      finishGesture()
    }
    const onTouchCancel = () => {
      resetGesture()
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
      const atEdge = nextDirection === 'forward' ? atBottom() : atTop()
      if (!atEdge || !hasNeighbor(nextDirection)) {
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
    window.addEventListener('touchcancel', onTouchCancel, { passive: true })
    window.addEventListener('keydown', onKeyDown)

    return () => {
      clearIdleTimer()
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('touchend', onTouchEnd)
      window.removeEventListener('touchcancel', onTouchCancel)
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [activeTab, disabled, onNavigate])

  return { progress, direction, reset, selectionPreviewRef }
}

export default App
