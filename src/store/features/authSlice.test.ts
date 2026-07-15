import { beforeEach, describe, expect, it } from 'vitest'
import reducer, { login, logout, restoreSession } from './authSlice'
import type { User } from '../../types/entities'

const user: User = {
  id: 1,
  name: 'Mauro',
  email: 'mauro@example.com',
  role: 'USER',
}

describe('auth reducer', () => {
  beforeEach(() => localStorage.clear())

  it('guarda el usuario cuando el inicio de sesión finaliza correctamente', () => {
    const state = reducer(undefined, login.fulfilled(user, '', {
      email: 'mauro@example.com',
      password: 'password',
    }))

    expect(state.user).toEqual(user)
    expect(state.loading).toBe(false)
    expect(state.initialized).toBe(true)
  })

  it('marca como inicializada una sesión que no se pudo restaurar', () => {
    const state = reducer(undefined, restoreSession.rejected(null, '', undefined, 'NO_SESSION'))

    expect(state.user).toBeNull()
    expect(state.initialized).toBe(true)
  })

  it('elimina el usuario y el token al cerrar sesión', () => {
    localStorage.setItem('dirifinal-token', 'token-de-prueba')
    const authenticated = reducer(undefined, login.fulfilled(user, '', {
      email: 'mauro@example.com',
      password: 'password',
    }))
    const state = reducer(authenticated, logout())

    expect(state.user).toBeNull()
    expect(localStorage.getItem('dirifinal-token')).toBeNull()
  })
})
