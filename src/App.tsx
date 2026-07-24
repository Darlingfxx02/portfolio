import { useCallback, useEffect, useLayoutEffect, useState, type ComponentType } from 'react'
import { Profile } from '@/components/Profile/Profile'
import { UsageHeatmap } from '@/components/UsageHeatmap/UsageHeatmap'
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
  // Tabs swap content in place. Their URL hashes are state only and must never
  // reposition the page like traditional document anchors.
  if (['#work', '#works', '#explorations', '#about', '#contact'].includes(hash)) return

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
  const caseId = hash.startsWith('#case/') ? hash.slice('#case/'.length) : ''
  const CaseView = CASES[caseId]
  const onCase = !!CaseView
  const activeTab: PortfolioTab =
    hash === '#explorations'
      ? 'explorations'
      : hash === '#about' || hash === '#contact'
        ? 'about'
        : 'work'

  const showTab = useCallback((tab: PortfolioTab) => {
    const nextHash = `#${tab}`
    if (window.location.hash === nextHash) return
    window.location.hash = nextHash
  }, [])

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
      <PortfolioHeader />
      {onCase ? (
        <CaseView />
      ) : (
        <div id="top" className={styles.page}>
          <div className={styles.introStack}>
            <Profile />
            <UsageHeatmap />
          </div>
          <PortfolioTabs activeTab={activeTab} onTabChange={showTab} />
        </div>
      )}
      <DockBar
        showBack={onCase}
        onContact={onCase ? undefined : () => showTab('about')}
      />
      <ScrollBar />
    </>
  )
}

export default App
