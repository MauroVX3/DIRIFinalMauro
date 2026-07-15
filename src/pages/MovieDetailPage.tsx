import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useIntl } from 'react-intl'
import { ConfirmDialog } from '../components/ConfirmDialog'
import { posterUrl } from '../components/MovieCard'
import { Rating } from '../components/Rating'
import { ReviewCard } from '../components/ReviewCard'
import { deleteMovie, fetchMovie } from '../store/features/moviesSlice'
import { fetchMovieReviews } from '../store/features/reviewsSlice'
import { useAppDispatch, useAppSelector } from '../store/hooks'

export default function MovieDetailPage() {
  const { id } = useParams()
  const movieId = Number(id)
  const intl = useIntl()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const [confirming, setConfirming] = useState(false)
  const { selected: movie, detailLoading, error } = useAppSelector((state) => state.movies)
  const { movieItems: reviews, error: reviewsError } = useAppSelector((state) => state.reviews)
  const user = useAppSelector((state) => state.auth.user)
  useEffect(() => { if (movieId) { dispatch(fetchMovie(movieId)); dispatch(fetchMovieReviews(movieId)) } }, [dispatch, movieId])

  if (detailLoading) return <p className="page-message">{intl.formatMessage({ id: 'common.loading' })}</p>
  if (error || !movie) return <div className="page-section container"><div className="alert error">{intl.formatMessage({ id: error || 'movies.error.detail' })}</div></div>

  const removeMovie = async () => {
    try {
      await dispatch(deleteMovie(movie.id)).unwrap()
      navigate('/movies')
    } catch {
      setConfirming(false)
    }
  }
  return (
    <section className="page-section container">
      <div className="movie-detail">
        <img className="detail-poster" src={posterUrl(movie.posterPath)} alt={intl.formatMessage({ id: 'poster.alt' }, { title: movie.title })} />
        <div className="detail-copy">
          <p className="eyebrow">{movie.genre} · {movie.releaseYear}</p>
          <h1>{movie.title}</h1>
          <p className="director">{intl.formatMessage({ id: 'movie.director' })}: {movie.director}</p>
          {Number(movie.reviewCount) > 0 && <div className="detail-rating"><Rating value={Number(movie.averageRating)} /><span>{intl.formatMessage({ id: 'movie.reviewCount' }, { count: Number(movie.reviewCount) })}</span></div>}
          <p className="synopsis">{movie.synopsis}</p>
          <p className="muted">{intl.formatMessage({ id: 'movie.duration' }, { minutes: movie.durationMinutes })}</p>
          <div className="card-actions">
            <Link className="button-primary" to={user ? `/movies/${movie.id}/review` : '/login'}>{intl.formatMessage({ id: 'movie.writeReview' })}</Link>
            {user?.role === 'ADMIN' && <><Link className="button-secondary" to={`/admin/movies/${movie.id}/edit`}>{intl.formatMessage({ id: 'movie.edit' })}</Link><button className="button-danger" type="button" onClick={() => setConfirming(true)}>{intl.formatMessage({ id: 'movie.delete' })}</button></>}
          </div>
        </div>
      </div>
      <div className="detail-reviews">
        <h2>{intl.formatMessage({ id: 'movie.reviews' })}</h2>
        {reviewsError && <div className="alert error">{intl.formatMessage({ id: reviewsError })}</div>}
        {!reviewsError && (reviews.length ? <div className="review-list">{reviews.map((review) => <ReviewCard key={review.id} review={review} />)}</div> : <p className="page-message">{intl.formatMessage({ id: 'movie.noReviews' })}</p>)}
      </div>
      <ConfirmDialog open={confirming} title={intl.formatMessage({ id: 'movie.deleteTitle' })} message={intl.formatMessage({ id: 'movie.deleteMessage' })} onClose={() => setConfirming(false)} onConfirm={removeMovie} />
    </section>
  )
}
