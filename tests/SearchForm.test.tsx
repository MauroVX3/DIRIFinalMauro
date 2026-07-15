import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { IntlProvider } from 'react-intl'
import { describe, expect, it, vi } from 'vitest'
import { SearchForm } from '../src/components/SearchForm'
import es from '../src/i18n/es.json'

const renderForm = (value: string, onSearch: (value: string) => void) => render(
  <IntlProvider locale="es" messages={es}>
    <SearchForm value={value} placeholderId="movies.searchPlaceholder" onSearch={onSearch} />
  </IntlProvider>,
)

describe('SearchForm', () => {
  it('elimina los espacios exteriores antes de buscar', async () => {
    const onSearch = vi.fn()
    renderForm('', onSearch)
    await userEvent.type(screen.getByPlaceholderText('Buscar películas...'), '  Matrix  ')
    await userEvent.click(screen.getByRole('button', { name: 'Buscar' }))
    expect(onSearch).toHaveBeenCalledWith('Matrix')
  })

  it('limpia una búsqueda activa', async () => {
    const onSearch = vi.fn()
    renderForm('Matrix', onSearch)
    await userEvent.click(screen.getByRole('button', { name: 'Limpiar' }))
    expect(onSearch).toHaveBeenCalledWith('')
    expect(screen.getByPlaceholderText('Buscar películas...')).toHaveValue('')
  })
})
