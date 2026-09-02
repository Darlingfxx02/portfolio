import {
  useCallback,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

/** Languages supported by localized content. */
export type Lang = 'ru' | 'en'

/** A value that has both a Russian and an English variant. */
export type Loc<T = string> = { ru: T; en: T }

export const LANGUAGE_STORAGE_KEY = 'darling-live:lang'
const DEFAULT_LANG: Lang = 'ru'

type LangCtx = {
  lang: Lang
  setLang: (lang: Lang) => void
}

const Ctx = createContext<LangCtx>({
  lang: DEFAULT_LANG,
  setLang: () => {},
})

// This module intentionally keeps the provider with its tiny public hook/helper API.
// eslint-disable-next-line react-refresh/only-export-components
export const useLang = () => useContext(Ctx)

/**
 * Pick the active-language variant of a `Loc`. Use inside components:
 *   const { lang } = useLang()
 *   t(item.category, lang)
 */
// eslint-disable-next-line react-refresh/only-export-components
export function t<T>(value: Loc<T>, lang: Lang): T {
  return value[lang]
}

// Shared with the pre-render bootstrap so the saved locale is applied before paint.
// eslint-disable-next-line react-refresh/only-export-components
export function getInitialLanguage(): Lang {
  if (typeof window === 'undefined') return DEFAULT_LANG

  try {
    const saved = window.localStorage.getItem(LANGUAGE_STORAGE_KEY)
    return saved === 'ru' || saved === 'en' ? saved : DEFAULT_LANG
  } catch {
    return DEFAULT_LANG
  }
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, updateLang] = useState<Lang>(getInitialLanguage)

  const setLang = useCallback((nextLang: Lang) => {
    updateLang(nextLang)
  }, [])

  useEffect(() => {
    document.documentElement.lang = lang

    const description = document.querySelector<HTMLMetaElement>(
      'meta[name="description"]',
    )
    description?.setAttribute(
      'content',
      lang === 'ru'
        ? 'darling design — продуктовый дизайнер, главное направление AI.'
        : 'darling design — product designer focused on AI, B2B, and fintech.',
    )

    try {
      window.localStorage.setItem(LANGUAGE_STORAGE_KEY, lang)
    } catch {
      // Storage can be unavailable; switching still works for this session.
    }
  }, [lang])

  const value = useMemo(() => ({ lang, setLang }), [lang, setLang])

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}
