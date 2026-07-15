import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import { IntlProvider } from 'react-intl'
import ast from '../i18n/ast.json'
import en from '../i18n/en.json'
import es from '../i18n/es.json'

export type Language = 'es' | 'en' | 'ast'

interface LanguageContextValue {
  language: Language
  setLanguage: (language: Language) => void
}

const messages = { es, en, ast }
const LanguageContext = createContext<LanguageContextValue | null>(null)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const savedLanguage = localStorage.getItem('dirifinal-language') as Language | null
  const [language, setLanguageState] = useState<Language>(savedLanguage && messages[savedLanguage] ? savedLanguage : 'es')

  const value = useMemo(() => ({
    language,
    setLanguage: (nextLanguage: Language) => {
      localStorage.setItem('dirifinal-language', nextLanguage)
      setLanguageState(nextLanguage)
    },
  }), [language])

  return (
    <LanguageContext.Provider value={value}>
      <IntlProvider locale={language} messages={messages[language]} defaultLocale="es">
        {children}
      </IntlProvider>
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) throw new Error('useLanguage must be used inside LanguageProvider')
  return context
}
