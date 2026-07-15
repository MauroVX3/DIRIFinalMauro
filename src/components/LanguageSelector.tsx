import { useIntl } from 'react-intl'
import { useLanguage, type Language } from '../contexts/LanguageContext'

export function LanguageSelector() {
  const intl = useIntl()
  const { language, setLanguage } = useLanguage()

  return (
    <label className="language-selector">
      <span className="sr-only">{intl.formatMessage({ id: 'language.label' })}</span>
      <select value={language} onChange={(event) => setLanguage(event.target.value as Language)}>
        <option value="es">{intl.formatMessage({ id: 'language.es' })}</option>
        <option value="en">{intl.formatMessage({ id: 'language.en' })}</option>
        <option value="ast">{intl.formatMessage({ id: 'language.ast' })}</option>
      </select>
    </label>
  )
}
