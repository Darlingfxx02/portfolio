import { useEffect, useState, type ComponentType } from 'react'
import { Profile } from '@/components/Profile/Profile'
import { CaseStudies } from '@/components/CaseStudies/CaseStudies'
import { Experience } from '@/components/Experience/Experience'
import { StickerBoard } from '@/components/StickerBoard/StickerBoard'
import { SelectedWork } from '@/components/SelectedWork/SelectedWork'
import { Contact } from '@/components/Contact/Contact'
import { Cv } from '@/components/Cv/Cv'
import { DockBar } from '@/components/DockBar/DockBar'
import { ThemeToggle } from '@/components/ThemeToggle/ThemeToggle'
import { ScrollBar } from '@/components/ScrollBar/ScrollBar'
import { CaseZinda } from '@/components/cases/CaseZinda'
import { CaseUxart } from '@/components/cases/CaseUxart'
import { CaseOvork } from '@/components/cases/CaseOvork'
import { VideoCard } from '@/components/case/VideoCard'
import { useCompanyConfig } from '@/lib/personalization'
import { initSfx } from '@/lib/sound'
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

function App() {
  const hash = useHash()
  const config = useCompanyConfig()
  const onWorks = hash === '#works'
  const onContact = hash === '#contact'
  const onCv = hash === '#cv'
  const caseId = hash.startsWith('#case/') ? hash.slice('#case/'.length) : ''
  const CaseView = CASES[caseId]
  const onCase = !!CaseView

  useEffect(() => {
    initSfx()
  }, [])

  // Scroll handling on route / anchor change. Depends only on `hash` (route
  // flags are derived from it) so the dep array stays length-stable as routes
  // are added.
  useEffect(() => {
    const id = hash.replace('#', '')
    const routed =
      id === 'works' || id === 'contact' || id === 'cv' || hash.startsWith('#case/')
    if (routed || (id && id !== 'top')) {
      if (routed) window.scrollTo(0, 0)
      else document.getElementById(id)?.scrollIntoView()
      return
    }
    window.scrollTo(0, 0)
  }, [hash])

  return (
    <>
      {onCase ? (
        <CaseView />
      ) : onContact ? (
        <Contact />
      ) : onWorks ? (
        <SelectedWork />
      ) : onCv ? (
        <Cv />
      ) : (
        <div id="top" className={styles.page}>
          <Profile />
          {config.video?.url && (
            <div className="w-full max-w-[640px]">
              <VideoCard
                company={config.name}
                href={config.video.url}
                duration={config.video.duration}
              />
            </div>
          )}
          <CaseStudies />
          <Experience />
          <section id="playground" className={styles.playground}>
            <p className={styles.playgroundLabel}>Stuff I like</p>
          </section>
          <StickerBoard anchorId="playground" />
        </div>
      )}
      <DockBar showBack={onWorks || onCase || onContact || onCv} onContact={onContact} />
      <ThemeToggle />
      <ScrollBar />
    </>
  )
}

export default App
