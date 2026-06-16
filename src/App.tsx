import { useEffect, useState, type ComponentType } from 'react'
import { Profile } from '@/components/Profile/Profile'
import { CaseStudies } from '@/components/CaseStudies/CaseStudies'
import { Experience } from '@/components/Experience/Experience'
import { StickerBoard } from '@/components/StickerBoard/StickerBoard'
import { SelectedWork } from '@/components/SelectedWork/SelectedWork'
import { Contact } from '@/components/Contact/Contact'
import { DockBar } from '@/components/DockBar/DockBar'
import { ThemeToggle } from '@/components/ThemeToggle/ThemeToggle'
import { ScrollBar } from '@/components/ScrollBar/ScrollBar'
import { CaseZinda } from '@/components/cases/CaseZinda'
import { CaseUxart } from '@/components/cases/CaseUxart'
import { CaseOvork } from '@/components/cases/CaseOvork'
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
  const onWorks = hash === '#works'
  const onContact = hash === '#contact'
  const caseId = hash.startsWith('#case/') ? hash.slice('#case/'.length) : ''
  const CaseView = CASES[caseId]
  const onCase = !!CaseView

  useEffect(() => {
    initSfx()
  }, [])

  // Scroll handling on route / anchor change.
  useEffect(() => {
    if (onWorks || onCase || onContact) {
      window.scrollTo(0, 0)
      return
    }
    const id = hash.replace('#', '')
    if (id && id !== 'top') document.getElementById(id)?.scrollIntoView()
    else window.scrollTo(0, 0)
  }, [hash, onWorks, onCase, onContact])

  return (
    <>
      {onCase ? (
        <CaseView />
      ) : onContact ? (
        <Contact />
      ) : onWorks ? (
        <SelectedWork />
      ) : (
        <div id="top" className={styles.page}>
          <Profile />
          <CaseStudies />
          <Experience />
          <section id="playground" className={styles.playground}>
            <p className={styles.playgroundLabel}>Stuff I like</p>
          </section>
          <StickerBoard anchorId="playground" />
        </div>
      )}
      <DockBar showBack={onWorks || onCase || onContact} onContact={onContact} />
      <ThemeToggle />
      <ScrollBar />
    </>
  )
}

export default App
