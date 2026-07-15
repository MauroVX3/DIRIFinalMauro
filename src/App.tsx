import { lazy, Suspense, useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import { useIntl } from 'react-intl'
import { AppShell } from './components/AppShell'
import { AdminRoute, ProtectedRoute } from './components/ProtectedRoute'
import { restoreSession } from './store/features/authSlice'
import { useAppDispatch } from './store/hooks'

const HomePage = lazy(() => import('./pages/HomePage'))
const MoviesPage = lazy(() => import('./pages/MoviesPage'))
const MovieDetailPage = lazy(() => import('./pages/MovieDetailPage'))
const ReviewsPage = lazy(() => import('./pages/ReviewsPage'))
const MyReviewsPage = lazy(() => import('./pages/MyReviewsPage'))
const ReviewFormPage = lazy(() => import('./pages/ReviewFormPage'))
const AuthPage = lazy(() => import('./pages/AuthPage'))
const AdminMoviesPage = lazy(() => import('./pages/AdminMoviesPage'))
const MovieFormPage = lazy(() => import('./pages/MovieFormPage'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'))

function AppRoutes() {
  const dispatch = useAppDispatch()
  const intl = useIntl()
  useEffect(() => { dispatch(restoreSession()) }, [dispatch])
  return (
    <Suspense fallback={<p className="page-message">{intl.formatMessage({ id: 'common.loading' })}</p>}>
      <Routes>
        <Route element={<AppShell />}>
          <Route index element={<HomePage />} />
          <Route path="movies" element={<MoviesPage />} />
          <Route path="movies/:id" element={<MovieDetailPage />} />
          <Route path="reviews" element={<ReviewsPage />} />
          <Route path="login" element={<AuthPage mode="login" />} />
          <Route path="register" element={<AuthPage mode="register" />} />
          <Route element={<ProtectedRoute />}>
            <Route path="my-reviews" element={<MyReviewsPage />} />
            <Route path="movies/:movieId/review" element={<ReviewFormPage />} />
            <Route path="reviews/:reviewId/edit" element={<ReviewFormPage />} />
            <Route element={<AdminRoute />}>
              <Route path="admin/movies" element={<AdminMoviesPage />} />
              <Route path="admin/movies/new" element={<MovieFormPage />} />
              <Route path="admin/movies/:id/edit" element={<MovieFormPage />} />
            </Route>
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Suspense>
  )
}

export default function App() {
  return <AppRoutes />
}
