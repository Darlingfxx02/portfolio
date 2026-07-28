import { useState } from 'react'
import {
  getAnalyticsConsent,
  isAnalyticsConsentRequired,
  setAnalyticsConsent,
} from '@/lib/analytics'
import styles from './AnalyticsConsent.module.css'

export function AnalyticsConsent() {
  const [choice, setChoice] = useState(getAnalyticsConsent)

  if (!isAnalyticsConsentRequired() || choice !== null) return null

  const choose = (granted: boolean) => {
    setAnalyticsConsent(granted)
    setChoice(granted)
  }

  return (
    <aside
      className={styles.notice}
      role="region"
      aria-label="Настройки аналитики"
    >
      <p>
        <strong>Поможете сделать сайт лучше?</strong>{' '}
        Обезличенная статистика покажет, что стоит улучшить.
      </p>
      <div className={styles.footer}>
        <a
          href="https://privacy.microsoft.com/privacystatement"
          target="_blank"
          rel="noreferrer"
        >
          О данных
        </a>
        <div className={styles.actions}>
          <button
            className={styles.secondary}
            type="button"
            onClick={() => choose(false)}
          >
            Не сейчас
          </button>
          <button
            className={styles.primary}
            type="button"
            onClick={() => choose(true)}
          >
            Да, помочь
          </button>
        </div>
      </div>
    </aside>
  )
}
