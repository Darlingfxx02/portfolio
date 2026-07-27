import { useState } from 'react'
import {
  getAnalyticsConsent,
  setAnalyticsConsent,
} from '@/lib/analytics'
import styles from './AnalyticsConsent.module.css'

export function AnalyticsConsent() {
  const [choice, setChoice] = useState(getAnalyticsConsent)

  if (choice !== null) return null

  const choose = (granted: boolean) => {
    setAnalyticsConsent(granted)
    setChoice(granted)
  }

  return (
    <section
      className={styles.banner}
      role="dialog"
      aria-label="Настройки аналитики"
    >
      <p>
        Я использую Microsoft Clarity, чтобы видеть обезличенные клики,
        прокрутку и улучшать портфолио.{' '}
        <a
          href="https://privacy.microsoft.com/privacystatement"
          target="_blank"
          rel="noreferrer"
        >
          О данных
        </a>
      </p>
      <div className={styles.actions}>
        <button
          className={styles.secondary}
          type="button"
          onClick={() => choose(false)}
        >
          Без cookies
        </button>
        <button
          className={styles.primary}
          type="button"
          onClick={() => choose(true)}
        >
          Разрешить
        </button>
      </div>
    </section>
  )
}
