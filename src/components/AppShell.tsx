import { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { useIntl } from 'react-intl'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { logout } from '../store/features/authSlice'
import { LanguageSelector } from './LanguageSelector'

export function AppShell() {
  const intl = useIntl()
  const dispatch = useAppDispatch()
  const user = useAppSelector((state) => state.auth.user)
  const [open, setOpen] = useState(false)
  const linkClass = ({ isActive }: { isActive: boolean }) => isActive ? 'nav-link active' : 'nav-link'

  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="container header-content">
          <NavLink to="/" className="brand" onClick={() => setOpen(false)}>
            <span className="brand-mark">D</span>
            {intl.formatMessage({ id: 'app.name' })}
          </NavLink>
          <button className="menu-button" type="button" aria-expanded={open} onClick={() => setOpen(!open)}>
            <span></span><span></span><span></span>
          </button>
          <nav className={open ? 'main-nav open' : 'main-nav'} aria-label="Principal">
            <NavLink to="/" end className={linkClass} onClick={() => setOpen(false)}>{intl.formatMessage({ id: 'nav.home' })}</NavLink>
            <NavLink to="/movies" className={linkClass} onClick={() => setOpen(false)}>{intl.formatMessage({ id: 'nav.movies' })}</NavLink>
            <NavLink to="/reviews" className={linkClass} onClick={() => setOpen(false)}>{intl.formatMessage({ id: 'nav.reviews' })}</NavLink>
            {user && <NavLink to="/my-reviews" className={linkClass} onClick={() => setOpen(false)}>{intl.formatMessage({ id: 'nav.myReviews' })}</NavLink>}
            {user?.role === 'ADMIN' && <NavLink to="/admin/movies" className={linkClass} onClick={() => setOpen(false)}>{intl.formatMessage({ id: 'nav.admin' })}</NavLink>}
            <LanguageSelector />
            {user ? (
              <button type="button" className="button-quiet" onClick={() => { dispatch(logout()); setOpen(false) }}>
                {intl.formatMessage({ id: 'nav.logout' })}
              </button>
            ) : (
              <NavLink to="/login" className="button-small" onClick={() => setOpen(false)}>{intl.formatMessage({ id: 'nav.login' })}</NavLink>
            )}
          </nav>
        </div>
      </header>
      <main><Outlet /></main>
      <footer className="site-footer">
        <div className="container">{intl.formatMessage({ id: 'footer.text' })}</div>
      </footer>
    </div>
  )
}
