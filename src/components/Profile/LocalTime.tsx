import { useEffect, useState } from 'react'
import styles from './Profile.module.css'

/**
 * My clock, not the visitor's — "Сейчас у меня …" shows Moscow time regardless
 * of where the page is opened. Toggles 12-hour (am/pm) ↔ 24-hour on click.
 */
export function LocalTime() {
  const [h24, setH24] = useState(false)
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 30_000)
    return () => window.clearInterval(id)
  }, [])

  const time = now.toLocaleTimeString(h24 ? 'ru-RU' : 'en-US', {
    timeZone: 'Europe/Moscow',
    hour: 'numeric',
    minute: '2-digit',
    hour12: !h24,
  })

  return (
    <button
      type="button"
      className={styles.timeBtn}
      data-sfx
      onClick={() => setH24((v) => !v)}
      title="Переключить 12/24-часовой формат"
    >
      {time}
    </button>
  )
}
