import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useIntl } from 'react-intl'
import { ConfirmDialog } from '../components/ConfirmDialog'
import { deleteMovie, fetchMovies } from '../store/features/moviesSlice'
import { useAppDispatch, useAppSelector } from '../store/hooks'

export default function AdminMoviesPage() {
  const intl = useIntl()
  const dispatch = useAppDispatch()
  const { items, page, hasMore, loading, error } = useAppSelector((state) => state.movies)
  const [selectedId, setSelectedId] = useState<number | null>(null)
  useEffect(() => { dispatch(fetchMovies({ search: '', page: 1 })) }, [dispatch])
  const remove = async () => { if (selectedId) await dispatch(deleteMovie(selectedId)); setSelectedId(null) }
  return (
    <section className="page-section container">
      <div className="section-heading">
        <h1>{intl.formatMessage({ id: 'admin.title' })}</h1>
        <Link className="button-primary" to="/admin/movies/new">{intl.formatMessage({ id: 'admin.newMovie' })}</Link>
      </div>
      {loading && <p className="page-message">{intl.formatMessage({ id: 'common.loading' })}</p>}
      {error && <div className="alert error">{intl.formatMessage({ id: error })}</div>}
      <div className="admin-list">
        {items.map((movie) =>
          <article key={movie.id}>
            <div>
              <h2>{movie.title}</h2>
              <p>{movie.director} · {movie.releaseYear} · {movie.genre}</p>
            </div>
            <div className="card-actions">
              <Link className="button-secondary" to={`/admin/movies/${movie.id}/edit`}>
                {intl.formatMessage({ id: 'common.edit' })}
              </Link>
              <button className="button-danger" type="button" onClick={() => setSelectedId(movie.id)}>
                {intl.formatMessage({ id: 'common.delete' })}
              </button>
            </div>
          </article>)}
      </div>
      {hasMore &&
        <div className="load-sentinel">
          <button className="button-secondary" type="button" disabled={loading} onClick={() => dispatch(fetchMovies({ search: '', page: page + 1 }))}>{intl.formatMessage({ id: 'common.loadMore' })}</button>
        </div>}
      <ConfirmDialog open={selectedId !== null} title={intl.formatMessage({ id: 'movie.deleteTitle' })} message={intl.formatMessage({ id: 'movie.deleteMessage' })} onClose={() => setSelectedId(null)} onConfirm={remove} />
    </section>
  )
}
