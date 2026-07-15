import { useEffect, useState, type FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useIntl } from 'react-intl'
import { clearAuthError, login, register } from '../store/features/authSlice'
import { useAppDispatch, useAppSelector } from '../store/hooks'

export default function AuthPage({ mode }: { mode: 'login' | 'register' }) {
  const intl = useIntl()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const { loading, error, user } = useAppSelector((state) => state.auth)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const from = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname || '/'
  useEffect(() => { dispatch(clearAuthError()) }, [dispatch, mode])
  useEffect(() => { if (user) navigate(from, { replace: true }) }, [from, navigate, user])

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    if (mode === 'login') await dispatch(login({ email, password }))
    else await dispatch(register({ name, email, password }))
  }

  return (
    <section className="auth-page">
      <form className="form-card" onSubmit={submit}>
        <p className="eyebrow">{intl.formatMessage({ id: 'app.name' })}</p>
        <h1>{intl.formatMessage({ id: mode === 'login' ? 'auth.loginTitle' : 'auth.registerTitle' })}</h1>
        {error && <div className="alert error">{intl.formatMessage({ id: mode === 'login' ? 'auth.loginError' : 'auth.registerError' })}</div>}
        {mode === 'register' && <label>{intl.formatMessage({ id: 'auth.name' })}<input required minLength={2} value={name} onChange={(event) => setName(event.target.value)} /></label>}
        <label>{intl.formatMessage({ id: 'auth.email' })}
          <input required type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} />
        </label>
        <label>{intl.formatMessage({ id: 'auth.password' })}
          <input required minLength={6} type="password" autoComplete={mode === 'login' ? 'current-password' : 'new-password'} value={password} onChange={(event) => setPassword(event.target.value)} />
          <small>{intl.formatMessage({ id: 'auth.passwordHelp' })}</small>
        </label>
        <button className="button-primary full" type="submit" disabled={loading}>{intl.formatMessage({ id: loading ? 'auth.processing' : mode === 'login' ? 'auth.login' : 'auth.register' })}</button>
        <Link className="text-link" to={mode === 'login' ? '/register' : '/login'}>{intl.formatMessage({ id: mode === 'login' ? 'auth.register' : 'auth.login' })}</Link>
      </form>
    </section>
  )
}
