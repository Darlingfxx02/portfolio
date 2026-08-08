import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './tailwind.css'
import App from './App.tsx'
import { PersonalizationProvider } from '@/lib/personalization'
import { LanguageProvider } from '@/lib/i18n'
import { SiteBoot } from '@/components/LoadingScreen/SiteBoot'

// This domain serves the Russian portfolio only. Keep startup compatible with
// a strict CSP by doing this in the bundled module instead of an inline script.
document.documentElement.lang = 'ru'
try {
  window.localStorage.removeItem('lang')
} catch {
  // Storage can be disabled by the browser; the document language is still set.
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LanguageProvider>
      <PersonalizationProvider>
        <SiteBoot>
          <App />
        </SiteBoot>
      </PersonalizationProvider>
    </LanguageProvider>
  </StrictMode>,
)
