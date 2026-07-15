import { render, screen } from '@testing-library/react'
import { IntlProvider } from 'react-intl'
import { describe, expect, it } from 'vitest'
import es from '../src/i18n/es.json'
import { Rating } from '../src/components/Rating'

describe('Rating', () => {
  it('muestra la puntuación con un decimal y las estrellas correspondientes', () => {
    render(<IntlProvider locale="es" messages={es}><Rating value={4} /></IntlProvider>)

    expect(screen.getByLabelText('4 de 5')).toHaveTextContent('★★★★☆')
    expect(screen.getByText('4.0')).toBeInTheDocument()
  })

  it('redondea visualmente la puntuación sin modificar el valor mostrado', () => {
    render(<IntlProvider locale="es" messages={es}><Rating value={4.6} /></IntlProvider>)

    expect(screen.getByLabelText('4.6 de 5')).toHaveTextContent('★★★★★')
    expect(screen.getByText('4.6')).toBeInTheDocument()
  })
})
