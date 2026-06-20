import { useEffect, useRef, useState } from 'react'
import { CaseItem } from './CaseItem'
import { orderedCases, useCompanyConfig } from '@/lib/personalization'
import styles from './CaseStudies.module.css'

export function CaseStudies() {
  const { caseIds } = useCompanyConfig()
  const items = orderedCases(caseIds)
  const [box, setBox] = useState({ x: 0, y: 0, w: 0, h: 0 })
  const [show, setShow] = useState(false)
  const listRef = useRef<HTMLDivElement | null>(null)

  // One shared block that glides between the case rows on hover.
  useEffect(() => {
    const root = listRef.current
    if (!root) return
    let last: Element | null = null
    const onOver = (e: PointerEvent) => {
      const el = (e.target as Element | null)?.closest('article') ?? null
      if (!el || el === last) return
      last = el
      const sr = root.getBoundingClientRect()
      const r = el.getBoundingClientRect()
      setBox({ x: r.left - sr.left - 12, y: r.top - sr.top - 8, w: r.width + 24, h: r.height + 16 })
      setShow(true)
    }
    const onLeave = () => {
      last = null
      setShow(false)
    }
    root.addEventListener('pointerover', onOver)
    root.addEventListener('pointerleave', onLeave)
    return () => {
      root.removeEventListener('pointerover', onOver)
      root.removeEventListener('pointerleave', onLeave)
    }
  }, [])

  return (
    <section id="cases" className={styles.section}>
      <p className={styles.label}>Case studies</p>
      <span className={styles.accent} />
      <div className={styles.list} ref={listRef}>
        <div
          className={styles.highlight}
          data-show={show}
          style={{ transform: `translate(${box.x}px, ${box.y}px)`, width: box.w, height: box.h }}
          aria-hidden
        />
        {items.map((c) => (
          <CaseItem key={c.id} study={c} />
        ))}
      </div>
    </section>
  )
}
