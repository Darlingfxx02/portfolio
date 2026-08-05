import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './tailwind.css'
import App from './App.tsx'
import { PersonalizationProvider } from '@/lib/personalization'
import { LanguageProvider } from '@/lib/i18n'
import { SiteBoot } from '@/components/LoadingScreen/SiteBoot'

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
