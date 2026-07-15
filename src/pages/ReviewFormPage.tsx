import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useIntl } from 'react-intl'
import { fetchMovie } from '../store/features/moviesSlice'
import { fetchMyReviews, saveReview } from '../store/features/reviewsSlice'
import { useAppDispatch, useAppSelector } from '../store/hooks'

export default function ReviewFormPage() {
  const { movieId: movieParam, reviewId: reviewParam } = useParams()
  const reviewId = reviewParam ? Number(reviewParam) : undefined
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const intl = useIntl()
  const { selected: selectedMovie } = useAppSelector((state) => state.movies)
  const { myItems, saving, loading, error } = useAppSelector((state) => state.reviews)
  const existing = useMemo(() => myItems.find((review) => review.id === reviewId), [myItems, reviewId])
  const movieId = movieParam ? Number(movieParam) : existing?.movieId
  const movieTitle = selectedMovie && selectedMovie.id === movieId ? selectedMovie.title : existing?.movieTitle || ''
  const [rating, setRating] = useState(5)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')

  useEffect(() => { if (reviewId) dispatch(fetchMyReviews()) }, [dispatch, reviewId])
  useEffect(() => { if (movieId) dispatch(fetchMovie(movieId)) }, [dispatch, movieId])
  useEffect(() => { if (existing) { setRating(Number(existing.rating)); setTitle(existing.title); setContent(existing.content) } }, [existing])

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    if (!movieId) return
    try {
      await dispatch(saveReview({ id: reviewId, movieId, review: { rating, title, content } })).unwrap()
      navigate(reviewId ? '/my-reviews' : `/movies/${movieId}`)
    } catch { return }
  }
  if (reviewId && loading && !existing) return <p className="page-message">{intl.formatMessage({ id: 'common.loading' })}</p>
  return (
    <section className="page-section container form-page">
      <form className="form-card wide" onSubmit={submit}>
        <h1>{intl.formatMessage({ id: reviewId ? 'review.editTitle' : 'review.createTitle' }, { movie: movieTitle })}</h1>
        {error && <div className="alert error">{intl.formatMessage({ id: error })}</div>}
        <fieldset className="rating-field"><legend>{intl.formatMessage({ id: 'review.rating' })}</legend>
          <div>{[5, 4, 3, 2, 1].map((value) =>
            <label key={value}>
              <input type="radio" name="rating" value={value} checked={rating === value} onChange={() => setRating(value)} />
              <span aria-hidden="true">★</span><span className="sr-only">{value}</span></label>)}
          </div>
        </fieldset>
        <label>{intl.formatMessage({ id: 'review.title' })}
          <input required value={title} placeholder={intl.formatMessage({ id: 'review.titlePlaceholder' })} onChange={(event) => setTitle(event.target.value)} />
        </label>
        <label>{intl.formatMessage({ id: 'review.content' })}
          <textarea required rows={7} value={content} placeholder={intl.formatMessage({ id: 'review.contentPlaceholder' })} onChange={(event) => setContent(event.target.value)} />
        </label>
        <div className="form-actions">
          <button type="button" className="button-secondary" onClick={() => navigate(-1)}>{intl.formatMessage({ id: 'common.cancel' })}</button>
          <button className="button-primary" type="submit" disabled={saving || !movieId}>{intl.formatMessage({ id: saving ? 'review.saving' : 'common.save' })}</button>
        </div>
      </form>
    </section>
  )
}
