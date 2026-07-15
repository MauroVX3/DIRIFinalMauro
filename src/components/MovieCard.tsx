import { Link } from 'react-router-dom'
import { useIntl } from 'react-intl'
import type { Movie } from '../types/entities'
import { Rating } from './Rating'

export function posterUrl(posterPath?: string) {
  return `${import.meta.env.BASE_URL}posters/${posterPath || 'placeholder.svg'}`
}

export function MovieCard({ movie }: { movie: Movie }) {
  const intl = useIntl()
  return (
    <article className="movie-card">
      <Link to={`/movies/${movie.id}`} className="poster-link">
        <img src={posterUrl(movie.posterPath)} alt={intl.formatMessage({ id: 'poster.alt' }, { title: movie.title })} loading="lazy" />
      </Link>
      <div className="movie-card-body">
        <p className="movie-meta">{movie.genre} · {movie.releaseYear}</p>
        <h3><Link to={`/movies/${movie.id}`}>{movie.title}</Link></h3>
        <p>{movie.director}</p>
        {Number(movie.reviewCount) > 0 ? <Rating value={Number(movie.averageRating)} /> : <span className="muted">{intl.formatMessage({ id: 'movie.noRatings' })}</span>}
      </div>
    </article>
  )
}
