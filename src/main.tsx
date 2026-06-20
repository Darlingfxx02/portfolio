import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './tailwind.css'
import App from './App.tsx'
import { PersonalizationProvider } from '@/lib/personalization'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PersonalizationProvider>
      <App />
    </PersonalizationProvider>
  </StrictMode>,
)
