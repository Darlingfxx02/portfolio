import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'

/** Site language. Default is Russian; visitors can switch to English. */
export type Lang = 'ru' | 'en'

/** A value that has both a Russian and an English variant. */
export type Loc<T = string> = { ru: T; en: T }

const KEY = 'lang'

/** Read the language the pre-paint script wrote onto <html lang>. */
function initialLang(): Lang {
  if (typeof document !== 'undefined' && document.documentElement.lang === 'en') {
    return 'en'
  }
  return 'ru'
}

type LangCtx = { lang: Lang; setLang: (l: Lang) => void }

const Ctx = createContext<LangCtx>({ lang: 'ru', setLang: () => {} })

export const useLang = () => useContext(Ctx)

/**
 * Pick the active-language variant of a `Loc`. Use inside components:
 *   const { lang } = useLang()
 *   t(item.category, lang)
 */
export function t<T>(value: Loc<T>, lang: Lang): T {
  return value[lang]
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(initialLang)

  const setLang = (next: Lang) => {
    setLangState(next)
    document.documentElement.lang = next
    try {
      localStorage.setItem(KEY, next)
    } catch {
      // storage unavailable — ignore
    }
  }

  // Keep <html lang> in sync (also covers the very first mount).
  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  return <Ctx.Provider value={{ lang, setLang }}>{children}</Ctx.Provider>
}
