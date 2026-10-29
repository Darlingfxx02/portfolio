export type SectionScrollDirection = 'forward' | 'backward'
export type SectionArrival = 'top' | 'bottom' | 'saved'
export type ScrollNavigation = 'menu' | 'forward' | 'backward' | 'restore'

/** Cases always start from their beginning, regardless of navigation history.
 * Sections enter through the crossed edge, while a menu selection starts fresh. */
export function navigationArrival(hash: string, navigation: ScrollNavigation): SectionArrival {
  if (hash.startsWith('#case/') || navigation === 'menu' || navigation === 'forward') return 'top'
  if (navigation === 'backward') return 'bottom'
  return 'saved'
}

/** Section order is linear: scrolling must never skip across the menu ends. */
export function adjacentSection<T>(
  sections: readonly T[],
  active: T,
  direction: SectionScrollDirection,
): T | undefined {
  const index = sections.indexOf(active)
  if (index < 0) return undefined
  return sections[index + (direction === 'forward' ? 1 : -1)]
}

/** Only extra scroll outside the current page moves between sections. */
export function sectionEdgeDirection(
  delta: number,
  scrollTop: number,
  maxScroll: number,
): SectionScrollDirection | null {
  if (delta > 0 && scrollTop >= maxScroll - 2) return 'forward'
  if (delta < 0 && scrollTop <= 2) return 'backward'
  return null
}

export function sectionScrollPosition(arrival: SectionArrival, maxScroll: number, saved: number) {
  const max = Math.max(0, maxScroll)
  if (arrival === 'bottom') return max
  if (arrival === 'top') return 0
  return Math.max(0, Math.min(saved, max))
}
