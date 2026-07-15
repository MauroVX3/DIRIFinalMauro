import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ApiError, apiRequest, tokenStorage } from '../src/services/api'

describe('apiRequest', () => {
  beforeEach(() => localStorage.clear())
  afterEach(() => vi.unstubAllGlobals())

  it('incluye el token de sesión en las peticiones autenticadas', async () => {
    tokenStorage.set('token-de-prueba')
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({ result: 'ok' }), {
      status: 200, headers: { 'Content-Type': 'application/json' },
    }))
    vi.stubGlobal('fetch', fetchMock)
    await apiRequest('/resource')
    const [, options] = fetchMock.mock.calls[0]
    expect((options.headers as Headers).get('Authorization')).toBe('Bearer token-de-prueba')
  })

  it('no envía el token cuando la petición se marca como pública', async () => {
    tokenStorage.set('token-de-prueba')
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({ result: 'ok' }), {
      status: 200, headers: { 'Content-Type': 'application/json' },
    }))
    vi.stubGlobal('fetch', fetchMock)
    await apiRequest('/public', { authenticated: false })
    const [, options] = fetchMock.mock.calls[0]
    expect((options.headers as Headers).has('Authorization')).toBe(false)
  })

  it('trata correctamente las respuestas sin contenido', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(null, { status: 204 })))
    await expect(apiRequest('/resource/1', { method: 'DELETE' })).resolves.toBeUndefined()
  })

  it('convierte las respuestas HTTP erróneas en ApiError', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(JSON.stringify({
      code: 'NOT_FOUND', message: 'Resource not found',
    }), { status: 404, headers: { 'Content-Type': 'application/json' } })))
    const request = apiRequest('/missing')
    await expect(request).rejects.toBeInstanceOf(ApiError)
    await expect(request).rejects.toMatchObject({ status: 404, code: 'NOT_FOUND' })
  })
})
