import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { LanguageProvider } from '../contexts/LanguageContext'
import { LanguageSelector } from './LanguageSelector'

describe('LanguageSelector', () => {
  it('cambia y conserva el idioma elegido', async () => {
    render(<LanguageProvider><LanguageSelector /></LanguageProvider>)
    const selector = screen.getByRole('combobox', { name: 'Idioma' })
    await userEvent.selectOptions(selector, 'ast')
    expect(selector).toHaveValue('ast')
    expect(localStorage.getItem('dirifinal-language')).toBe('ast')
  })
})
