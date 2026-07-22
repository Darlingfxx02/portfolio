import { useLang } from '@/lib/i18n'
import styles from './LangToggle.module.css'

/** Top-left EN/RU switch. */
export function LangToggle() {
  const { lang, setLang } = useLang()

  return (
    <div className={styles.toggle} role="group" aria-label="Language / Язык">
      <button
        type="button"
        className={styles.opt}
        data-active={lang === 'ru'}
        aria-pressed={lang === 'ru'}
        onClick={() => setLang('ru')}
      >
        RU
      </button>
      <span className={styles.sep} aria-hidden>
        /
      </span>
      <button
        type="button"
        className={styles.opt}
        data-active={lang === 'en'}
        aria-pressed={lang === 'en'}
        onClick={() => setLang('en')}
      >
        EN
      </button>
    </div>
  )
}
