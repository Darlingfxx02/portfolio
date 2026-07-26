import {
  createContext,
  useContext,
  useEffect,
  type ReactNode,
} from 'react'

/** Languages supported by localized content. */
export type Lang = 'ru' | 'en'

/** A value that has both a Russian and an English variant. */
export type Loc<T = string> = { ru: T; en: T }

/** This deployment is the Russian-only domain. */
const SITE_LANG: Lang = 'ru'

type LangCtx = { lang: Lang }

const Ctx = createContext<LangCtx>({ lang: SITE_LANG })

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
  useEffect(() => {
    document.documentElement.lang = SITE_LANG
  }, [])

  return <Ctx.Provider value={{ lang: SITE_LANG }}>{children}</Ctx.Provider>
}
