import { useState } from 'react'
import {
  getAnalyticsConsent,
  isAnalyticsConsentRequired,
  setAnalyticsConsent,
} from '@/lib/analytics'
import { useLang } from '@/lib/i18n'
import styles from './AnalyticsConsent.module.css'

export function AnalyticsConsent() {
  const { lang } = useLang()
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
      aria-label={lang === 'ru' ? 'Настройки аналитики' : 'Analytics settings'}
    >
      <p>
        <strong>
          {lang === 'ru' ? 'Поможете сделать сайт лучше?' : 'Help improve the site?'}
        </strong>{' '}
        {lang === 'ru'
          ? 'Обезличенная статистика покажет, что стоит улучшить.'
          : 'Anonymous usage data helps me see what needs improvement.'}
      </p>
      <div className={styles.footer}>
        <a
          href="https://privacy.microsoft.com/privacystatement"
          target="_blank"
          rel="noreferrer"
        >
          {lang === 'ru' ? 'О данных' : 'About data'}
        </a>
        <div className={styles.actions}>
          <button
            className={styles.secondary}
            type="button"
            onClick={() => choose(false)}
          >
            {lang === 'ru' ? 'Не сейчас' : 'Not now'}
          </button>
          <button
            className={styles.primary}
            type="button"
            onClick={() => choose(true)}
          >
            {lang === 'ru' ? 'Да, помочь' : 'Yes, help'}
          </button>
        </div>
      </div>
    </aside>
  )
}
