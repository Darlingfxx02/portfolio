import { useSyncExternalStore } from 'react'

const query = '(max-width: 720px)'
const snapshot = () => window.matchMedia(query).matches
const serverSnapshot = () => false
const subscribe = (onChange: () => void) => {
  const media = window.matchMedia(query)
  media.addEventListener('change', onChange)
  return () => media.removeEventListener('change', onChange)
}

export function useMobileLayout() {
  return useSyncExternalStore(subscribe, snapshot, serverSnapshot)
}
