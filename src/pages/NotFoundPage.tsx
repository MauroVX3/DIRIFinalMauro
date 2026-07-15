import { Link } from 'react-router-dom'
import { useIntl } from 'react-intl'

export default function NotFoundPage() {
  const intl = useIntl()
  return <section className="page-section container page-message"><h1>404 · {intl.formatMessage({ id: 'notFound.title' })}</h1><p>{intl.formatMessage({ id: 'notFound.message' })}</p><Link className="button-primary" to="/">{intl.formatMessage({ id: 'nav.home' })}</Link></section>
}
