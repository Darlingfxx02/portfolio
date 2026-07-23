import { useCallback, useEffect, useLayoutEffect, useState, type ComponentType } from 'react'
import { Profile } from '@/components/Profile/Profile'
import { UsageHeatmap } from '@/components/UsageHeatmap/UsageHeatmap'
import { PortfolioHeader } from '@/components/PortfolioHeader/PortfolioHeader'
import { Experience } from '@/components/Experience/Experience'
import { MediaGrid } from '@/components/MediaGrid/MediaGrid'
import { SelectedWork } from '@/components/SelectedWork/SelectedWork'
import { Contact } from '@/components/Contact/Contact'
import { DockBar } from '@/components/DockBar/DockBar'
import { HeaderTools } from '@/components/HeaderTools/HeaderTools'
import { LangToggle } from '@/components/LangToggle/LangToggle'
import { ScrollBar } from '@/components/ScrollBar/ScrollBar'
import { CaseZinda } from '@/components/cases/CaseZinda'
import { CaseUxart } from '@/components/cases/CaseUxart'
import { CaseOvork } from '@/components/cases/CaseOvork'
import { CaseOverlay } from '@/components/CaseOverlay/CaseOverlay'
import { initSfx } from '@/lib/sound'
import { initAnalytics, trackEvent } from '@/lib/analytics'
import styles from './App.module.css'

const CASES: Record<string, ComponentType> = {
  zinda: CaseZinda,
  uxart: CaseUxart,
  ovork: CaseOvork,
}

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

function App() {
  const hash = useHash()
  const [caseOverlayOpen, setCaseOverlayOpen] = useState(false)
  const onWorks = hash === '#works'
  const onContact = hash === '#contact'
  const caseId = hash.startsWith('#case/') ? hash.slice('#case/'.length) : ''
  const CaseView = CASES[caseId]
  const onCase = !!CaseView
  const onHome = !onWorks && !onContact && !onCase
  const toggleCaseOverlay = useCallback(() => setCaseOverlayOpen((open) => !open), [])
  const closeCaseOverlay = useCallback(() => setCaseOverlayOpen(false), [])

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

  // Set the new screen's position before the browser paints it. Temporarily
  // disabling smooth scrolling prevents route changes from animating from the
  // previous screen's scroll position.
  useLayoutEffect(() => {
    scrollImmediatelyTo(hash)
  }, [hash])

  useEffect(() => {
    trackEvent('route_view', {
      case_id: hash.startsWith('#case/') ? hash.slice('#case/'.length) : undefined,
    })
  }, [hash])

  return (
    <>
      {(onHome || onCase) && <PortfolioHeader onNavigate={closeCaseOverlay} />}
      {onCase ? (
        <CaseView />
      ) : onContact ? (
        <Contact />
      ) : onWorks ? (
        <SelectedWork />
      ) : (
        <div id="top" className={styles.page}>
          <div className={styles.introStack}>
            <Profile />
            <UsageHeatmap />
            <Experience />
          </div>
          <MediaGrid />
        </div>
      )}
      <DockBar
        showBack={onWorks || onCase || onContact}
        onContact={onContact}
        onCaseStudies={onHome ? toggleCaseOverlay : undefined}
        caseStudiesOpen={caseOverlayOpen}
      />
      {(onWorks || onContact) && (
        <>
          <LangToggle />
          <HeaderTools />
        </>
      )}
      <CaseOverlay open={caseOverlayOpen} onClose={closeCaseOverlay} />
      <ScrollBar />
    </>
  )
}

export default App
