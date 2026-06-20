import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import { cases, type CaseStudy } from '@/data/cases'

/**
 * Конфиг персонализации под одну компанию. Публичный сайт читает компанию из
 * `?to=slug`, тянет `/configs/{slug}.json` и применяет к четырём осям.
 * Любое поле опционально — без него ось остаётся в дефолте.
 * Источник схемы: docs/admin-architecture.html.
 */
export type CompanyConfig = {
  /** Слаг из URL (?to=slug). Заполняется загрузчиком. */
  slug: string
  /** Имя компании → «Hello {name}» в карточке видео. */
  name: string
  /** Какие кейсы и в каком порядке показывать (id из data/cases). */
  caseIds?: string[]
  /** Id текстовых фрагментов в центральном блоке, которые подсвечиваем. */
  emphasis?: string[]
  /** Id мест опыта (data/experience), которые подсвечиваем как релевантные. */
  experienceHighlights?: string[]
  /** Презентационное видео — общий дефолт или кастом под компанию. */
  video: { url: string; duration?: string }
}

// TODO: заменить url на реальное презентационное видео (сейчас тест Big Buck Bunny).
export const DEFAULT_CONFIG: CompanyConfig = {
  slug: '',
  name: 'there',
  video: { url: 'https://youtu.be/aqz-KE-bpKQ', duration: '1m 30s' },
}

/** Слаг компании из URL (?to=plata). Позже его будет проставлять админка. */
export function recipientSlug(): string {
  if (typeof window === 'undefined') return ''
  return new URLSearchParams(window.location.search).get('to') || ''
}

/** Тянет конфиг компании с бэкенда (Live API); при любой ошибке — дефолт. */
export async function loadCompanyConfig(slug: string): Promise<CompanyConfig> {
  if (!slug) return DEFAULT_CONFIG
  try {
    const res = await fetch(`/api/config?to=${encodeURIComponent(slug)}`, {
      cache: 'no-cache',
    })
    if (!res.ok) return { ...DEFAULT_CONFIG, slug }
    const data = (await res.json()) as Partial<CompanyConfig>
    return {
      ...DEFAULT_CONFIG,
      ...data,
      slug,
      video: { ...DEFAULT_CONFIG.video, ...(data.video ?? {}) },
    }
  } catch {
    return { ...DEFAULT_CONFIG, slug }
  }
}

/** Кейсы в порядке/составе из конфига; без caseIds — дефолтный список. */
export function orderedCases(caseIds?: string[]): CaseStudy[] {
  if (!caseIds?.length) return cases
  const byId = new Map(cases.map((c) => [c.id, c]))
  const picked = caseIds
    .map((id) => byId.get(id))
    .filter((c): c is CaseStudy => Boolean(c))
  return picked.length ? picked : cases
}

const Ctx = createContext<CompanyConfig>(DEFAULT_CONFIG)

export const useCompanyConfig = () => useContext(Ctx)

export function PersonalizationProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<CompanyConfig>(DEFAULT_CONFIG)
  useEffect(() => {
    let alive = true
    loadCompanyConfig(recipientSlug()).then((c) => {
      if (alive) setConfig(c)
    })
    return () => {
      alive = false
    }
  }, [])
  return <Ctx.Provider value={config}>{children}</Ctx.Provider>
}
