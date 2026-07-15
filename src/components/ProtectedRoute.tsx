import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { FormattedMessage } from 'react-intl'
import { useAppSelector } from '../store/hooks'

export function ProtectedRoute() {
  const location = useLocation()
  const { user, initialized } = useAppSelector((state) => state.auth)
  if (!initialized) return <div className="page-message"><FormattedMessage id="common.loading" /></div>
  return user ? <Outlet /> : <Navigate to="/login" state={{ from: location }} replace />
}

export function AdminRoute() {
  const user = useAppSelector((state) => state.auth.user)
  return user?.role === 'ADMIN' ? <Outlet /> : <Navigate to="/" replace />
}
