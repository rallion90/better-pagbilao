import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router";
import './index.css'
import App from './App.tsx'
import { LanguageProvider } from './i18n/LanguageContext'
import { IssueReportingProvider } from './components/community/IssueReportingProvider'
import { BusinessDirectoryProvider } from './components/community/BusinessDirectoryProvider'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LanguageProvider>
      <BrowserRouter>
        <IssueReportingProvider>
          <BusinessDirectoryProvider>
            <App />
          </BusinessDirectoryProvider>
        </IssueReportingProvider>
      </BrowserRouter>
    </LanguageProvider>
  </StrictMode>,
)
