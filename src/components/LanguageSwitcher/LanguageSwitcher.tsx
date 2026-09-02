import { useLang, type Lang } from '@/lib/i18n'
import styles from './LanguageSwitcher.module.css'

const LANGUAGES: Array<{ value: Lang; shortLabel: string; label: string }> = [
  { value: 'en', shortLabel: 'EN', label: 'English' },
  { value: 'ru', shortLabel: 'RU', label: 'Русский' },
]

export function LanguageSwitcher({
  variant = 'header',
}: {
  variant?: 'header' | 'surface'
}) {
  const { lang, setLang } = useLang()

  return (
    <div
      className={styles.switcher}
      data-variant={variant}
      role="group"
      aria-label={lang === 'ru' ? 'Выбор языка' : 'Language selector'}
    >
      {LANGUAGES.map((language) => {
        const active = language.value === lang

        return (
          <button
            key={language.value}
            className={styles.option}
            type="button"
            lang={language.value}
            aria-label={language.label}
            aria-pressed={active}
            data-active={active || undefined}
            onClick={() => setLang(language.value)}
          >
            {language.shortLabel}
          </button>
        )
      })}
    </div>
  )
}
