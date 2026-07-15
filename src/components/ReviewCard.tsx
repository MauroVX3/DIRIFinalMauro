import { Link } from 'react-router-dom'
import type { ReactNode } from 'react'
import { useIntl } from 'react-intl'
import type { Review } from '../types/entities'
import { Rating } from './Rating'

interface ReviewCardProps {
  review: Review
  actions?: ReactNode
}

export function ReviewCard({ review, actions }: ReviewCardProps) {
  const intl = useIntl()
  return (
    <article className="review-card">
      <div className="review-heading">
        <div>
          {review.movieTitle && <Link className="eyebrow" to={`/movies/${review.movieId}`}>{review.movieTitle}</Link>}
          <h3>{review.title}</h3>
          <p>{intl.formatMessage({ id: 'reviews.by' }, { name: review.userName })}</p>
        </div>
        <Rating value={Number(review.rating)} />
      </div>
      <p className="review-content">{review.content}</p>
      {actions && <div className="card-actions">{actions}</div>}
    </article>
  )
}
