import { useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import { MovieCard } from '../components/MovieCard'
import { SearchForm } from '../components/SearchForm'
import { fetchMovies } from '../store/features/moviesSlice'
import { useAppDispatch, useAppSelector } from '../store/hooks'

export default function MoviesPage() {
  const intl = useIntl()
  const dispatch = useAppDispatch()
  const { items, page, hasMore, total, loading, error, search: storedSearch } = useAppSelector((state) => state.movies)
  const [search, setSearch] = useState(storedSearch)
  useEffect(() => { dispatch(fetchMovies({ search, page: 1 })) }, [dispatch, search])

  return (
    <section className="page-section container">
      <div className="page-heading"><h1>{intl.formatMessage({ id: 'movies.title' })}</h1><p>{intl.formatMessage({ id: 'movies.subtitle' })}</p></div>
      <SearchForm value={search} placeholderId="movies.searchPlaceholder" onSearch={setSearch} />
      {!error && <p className="result-count">{intl.formatMessage({ id: 'movies.results' }, { count: total })}</p>}
      {error && <div className="alert error">{intl.formatMessage({ id: error })}</div>}
      <div className="movie-grid">{items.map((movie) => <MovieCard key={movie.id} movie={movie} />)}</div>
      {!loading && !items.length && <p className="page-message">{intl.formatMessage({ id: 'common.noResults' })}</p>}
      {hasMore && <div className="load-sentinel"><button className="button-secondary" type="button" disabled={loading} onClick={() => dispatch(fetchMovies({ search, page: page + 1 }))}>{intl.formatMessage({ id: loading ? 'movies.loadingMore' : 'common.loadMore' })}</button></div>}
    </section>
  )
}
