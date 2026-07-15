import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import ErrorBoundary from './components/ErrorBoundary'
import { LanguageProvider } from './contexts/LanguageContext'
import store from './store/store'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <LanguageProvider>
        <BrowserRouter basename={import.meta.env.BASE_URL}>
          <ErrorBoundary><App /></ErrorBoundary>
        </BrowserRouter>
      </LanguageProvider>
    </Provider>
  </StrictMode>,
)
