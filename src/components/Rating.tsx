import { useIntl } from 'react-intl'

export function Rating({ value }: { value: number }) {
  const intl = useIntl()
  return (
    <span className="rating" aria-label={intl.formatMessage({ id: 'movie.rating' }, { rating: value })}>
      <span aria-hidden="true">{'★'.repeat(Math.round(value))}{'☆'.repeat(5 - Math.round(value))}</span>
      <span>{value.toFixed(1)}</span>
    </span>
  )
}
