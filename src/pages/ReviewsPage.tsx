import { useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import { ReviewCard } from '../components/ReviewCard'
import { SearchForm } from '../components/SearchForm'
import { fetchReviews } from '../store/features/reviewsSlice'
import { useAppDispatch, useAppSelector } from '../store/hooks'

export default function ReviewsPage() {
  const intl = useIntl()
  const dispatch = useAppDispatch()
  const { items, page, hasMore, loading, error } = useAppSelector((state) => state.reviews)
  const [search, setSearch] = useState('')
  useEffect(() => { dispatch(fetchReviews({ search, page: 1 })) }, [dispatch, search])

  return (
    <section className="page-section container narrow">
      <div className="page-heading">
        <h1>{intl.formatMessage({ id: 'reviews.title' })}</h1>
        <p>{intl.formatMessage({ id: 'reviews.subtitle' })}</p>
      </div>
      <SearchForm value={search} placeholderId="reviews.searchPlaceholder" onSearch={setSearch} />
      {error && <div className="alert error">{intl.formatMessage({ id: error })}</div>}
      <div className="review-list">{items.map((review) => <ReviewCard key={review.id} review={review} />)}</div>
      {!loading && !items.length && <p className="page-message">{intl.formatMessage({ id: 'common.noResults' })}</p>}
      {hasMore &&
        <div className="load-sentinel">
          <button className="button-secondary" type="button" disabled={loading} onClick={() => dispatch(fetchReviews({ search, page: page + 1 }))}>{intl.formatMessage({ id: loading ? 'common.loading' : 'common.loadMore' })}</button>
        </div>}
    </section>
  )
}
