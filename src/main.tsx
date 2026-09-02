import { createElement, lazy, StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { getInitialLanguage, LanguageProvider } from '@/lib/i18n'
import './index.css'
import './tailwind.css'

const mockupEditorModule = lazy(() => import('./tools/mockup/MockupEditor.tsx'))
const portfolioModule = lazy(async () => {
  const [{ default: App }, { PersonalizationProvider }, { SiteBoot }] =
    await Promise.all([
      import('./App.tsx'),
      import('@/lib/personalization'),
      import('@/components/LoadingScreen/SiteBoot'),
    ])

  return {
    default: () => (
      <LanguageProvider>
        <PersonalizationProvider>
          <SiteBoot>
            <App />
          </SiteBoot>
        </PersonalizationProvider>
      </LanguageProvider>
    ),
  }
})

// Apply the saved language before React paints to avoid a language flash while
// keeping startup compatible with the site's strict CSP.
document.documentElement.lang = getInitialLanguage()

const isMockupRoute = window.location.pathname.replace(/\/$/, '') === '/tools/mockup'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Suspense fallback={null}>
      {isMockupRoute ? (
        createElement(mockupEditorModule)
      ) : (
        createElement(portfolioModule)
      )}
    </Suspense>
  </StrictMode>,
)
