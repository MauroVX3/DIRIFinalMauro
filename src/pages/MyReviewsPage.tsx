import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useIntl } from 'react-intl'
import { ConfirmDialog } from '../components/ConfirmDialog'
import { ReviewCard } from '../components/ReviewCard'
import { deleteReview, fetchMyReviews } from '../store/features/reviewsSlice'
import { useAppDispatch, useAppSelector } from '../store/hooks'

export default function MyReviewsPage() {
  const intl = useIntl()
  const dispatch = useAppDispatch()
  const { myItems, loading, error } = useAppSelector((state) => state.reviews)
  const [selectedId, setSelectedId] = useState<number | null>(null)
  useEffect(() => { dispatch(fetchMyReviews()) }, [dispatch])
  const remove = async () => { if (selectedId) await dispatch(deleteReview(selectedId)); setSelectedId(null) }
  return (
    <section className="page-section container narrow">
      <div className="page-heading"><h1>{intl.formatMessage({ id: 'myReviews.title' })}</h1></div>
      {loading && <p className="page-message">{intl.formatMessage({ id: 'common.loading' })}</p>}
      {error && <div className="alert error">{intl.formatMessage({ id: error })}</div>}
      <div className="review-list">
        {myItems.map((review) => <ReviewCard key={review.id} review={review} actions={<><Link className="button-secondary" to={`/reviews/${review.id}/edit`}>{intl.formatMessage({ id: 'common.edit' })}</Link><button className="button-danger" type="button" onClick={() => setSelectedId(review.id)}>{intl.formatMessage({ id: 'common.delete' })}</button></>} />)}
      </div>
      {!loading && !myItems.length && <p className="page-message">{intl.formatMessage({ id: 'myReviews.empty' })}</p>}
      <ConfirmDialog open={selectedId !== null} title={intl.formatMessage({ id: 'review.deleteTitle' })} message={intl.formatMessage({ id: 'review.deleteMessage' })} onClose={() => setSelectedId(null)} onConfirm={remove} />
    </section>
  )
}
