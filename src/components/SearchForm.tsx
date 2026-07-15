import { useState, type FormEvent } from 'react'
import { useIntl } from 'react-intl'

export function SearchForm({ value, placeholderId, onSearch }: { value: string; placeholderId: string; onSearch: (value: string) => void }) {
  const intl = useIntl()
  const [query, setQuery] = useState(value)
  const submit = (event: FormEvent) => { event.preventDefault(); onSearch(query.trim()) }
  return (
    <form className="search-form" onSubmit={submit} role="search">
      <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={intl.formatMessage({ id: placeholderId })} />
      <button className="button-primary" type="submit">{intl.formatMessage({ id: 'common.search' })}</button>
      {value && <button className="button-secondary" type="button" onClick={() => { setQuery(''); onSearch('') }}>{intl.formatMessage({ id: 'common.clear' })}</button>}
    </form>
  )
}
