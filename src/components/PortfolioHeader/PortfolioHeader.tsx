import { useEffect, useState } from 'react'
import { profile } from '@/data/profile'
import styles from './PortfolioHeader.module.css'

const CV_URL = '/cv/Timothe_Ermolaev_Resume.pdf?v=07a07a0d'

function moscowTime(now: Date) {
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/Moscow',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).format(now)
}

export function PortfolioHeader({ onNavigate }: { onNavigate?: () => void }) {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 30_000)
    return () => window.clearInterval(id)
  }, [])

  return (
    <header className={styles.header}>
      <nav className={styles.group} aria-label="Profile links">
        <a href={profile.telegram} target="_blank" rel="noreferrer" onClick={onNavigate}>
          Telegram
        </a>
        <a href="#contact" onClick={onNavigate}>
          Contacts
        </a>
        <a
          href={CV_URL}
          download="Timothe_Ermolaev_Resume.pdf"
          onClick={onNavigate}
        >
          CV
        </a>
      </nav>
      <nav className={styles.group} aria-label="Portfolio details">
        <span>Moscow {moscowTime(now)}</span>
        <span>24 y.o.</span>
      </nav>
    </header>
  )
}
