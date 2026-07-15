import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useIntl } from 'react-intl'
import { MovieCard } from '../components/MovieCard'
import { ReviewCard } from '../components/ReviewCard'
import { fetchMovies } from '../store/features/moviesSlice'
import { fetchReviews } from '../store/features/reviewsSlice'
import { useAppDispatch, useAppSelector } from '../store/hooks'

export default function HomePage() {
  const intl = useIntl()
  const dispatch = useAppDispatch()
  const { items, loading } = useAppSelector((state) => state.movies)
  const { items: reviews, loading: reviewsLoading, error: reviewsError } = useAppSelector((state) => state.reviews)
  useEffect(() => {
    dispatch(fetchMovies({ search: '', page: 1 }))
    dispatch(fetchReviews({ search: '', page: 1 }))
  }, [dispatch])

  return (
    <>
      <section className="hero-section">
        <div className="container hero-content">
          <p className="eyebrow">{intl.formatMessage({ id: 'home.eyebrow' })}</p>
          <h1>{intl.formatMessage({ id: 'home.title' })}</h1>
          <p className="hero-copy">{intl.formatMessage({ id: 'home.subtitle' })}</p>
          <div className="hero-actions">
            <Link className="button-primary" to="/movies">{intl.formatMessage({ id: 'home.explore' })}</Link>
            <Link className="button-secondary light" to="/reviews">{intl.formatMessage({ id: 'home.recentReviews' })}</Link>
          </div>
        </div>
      </section>
      <section className="page-section container">
        <div className="section-heading"><h2>{intl.formatMessage({ id: 'home.featured' })}</h2><Link className="button-secondary" to="/movies">{intl.formatMessage({ id: 'home.explore' })}</Link></div>
        {loading && !items.length ? <p className="page-message">{intl.formatMessage({ id: 'common.loading' })}</p> : (
          <div className="movie-grid">{items.slice(0, 4).map((movie) => <MovieCard key={movie.id} movie={movie} />)}</div>
        )}
      </section>
      <section className="page-section home-reviews-section">
        <div className="container">
          <div className="section-heading"><h2>{intl.formatMessage({ id: 'reviews.title' })}</h2><Link className="button-secondary" to="/reviews">{intl.formatMessage({ id: 'home.recentReviews' })}</Link></div>
          {reviewsError && <div className="alert error">{intl.formatMessage({ id: reviewsError })}</div>}
          {reviewsLoading && !reviews.length ? <p className="page-message">{intl.formatMessage({ id: 'common.loading' })}</p> : (
            <div className="home-review-grid">{reviews.slice(0, 4).map((review) => <ReviewCard key={review.id} review={review} />)}</div>
          )}
          {!reviewsLoading && !reviewsError && !reviews.length && <p className="page-message">{intl.formatMessage({ id: 'common.noResults' })}</p>}
        </div>
      </section>
    </>
  )
}
