import { useState } from 'react'
import { CircleHalf } from '@phosphor-icons/react'
import styles from './ThemeToggle.module.css'

type Theme = 'light' | 'dark'

function currentTheme(): Theme {
  if (typeof document === 'undefined') return 'dark'
  return document.documentElement.dataset.theme === 'light' ? 'light' : 'dark'
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(currentTheme)

  const toggle = () => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark'
    document.documentElement.dataset.theme = next
    try {
      localStorage.setItem('theme', next)
    } catch {
      // storage unavailable — ignore
    }
    setTheme(next)
  }

  return (
    <button
      className={styles.toggle}
      type="button"
      aria-label="Сменить тему"
      data-theme={theme}
      onClick={toggle}
    >
      <CircleHalf size={22} weight="fill" />
    </button>
  )
}
