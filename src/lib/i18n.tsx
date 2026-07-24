import {
  createContext,
  useContext,
  type ReactNode,
} from 'react'

/** Localized content remains shared with the future international site. */
export type Lang = 'ru' | 'en'

/** A value that has both a Russian and an English variant. */
export type Loc<T = string> = { ru: T; en: T }

type LangCtx = { lang: Lang; setLang: (l: Lang) => void }

const RU_CONTEXT: LangCtx = { lang: 'ru', setLang: () => {} }
const Ctx = createContext<LangCtx>(RU_CONTEXT)

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
  return <Ctx.Provider value={RU_CONTEXT}>{children}</Ctx.Provider>
}
