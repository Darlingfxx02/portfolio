import { useEffect, useState } from 'react'
import { profile } from '@/data/profile'
import styles from './PortfolioHeader.module.css'

function moscowTime(now: Date) {
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/Moscow',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).format(now)
}

export function PortfolioHeader() {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 30_000)
    return () => window.clearInterval(id)
  }, [])

  return (
    <header className={styles.header}>
      <nav className={styles.group} aria-label="Profile links">
        <a href={profile.telegram} target="_blank" rel="noreferrer">
          Telegram
        </a>
        <a href="#contact">Contacts</a>
        <a href="#cv">CV</a>
      </nav>
      <nav className={styles.group} aria-label="Portfolio details">
        <span>Moscow {moscowTime(now)}</span>
        <span>24 y.o.</span>
      </nav>
    </header>
  )
}
