import { describe, expect, it } from 'vitest'
import reducer, { deleteReview, fetchMyReviews, saveReview } from '../src/store/features/reviewsSlice'
import type { Review } from '../src/types/entities'

const review: Review = { id: 4, movieId: 2, userId: 3, rating: 5, title: 'Gran película', content: 'Una reseña de prueba.', userName: 'Mauro' }

describe('reviews reducer', () => {
  it('guarda las reseñas del usuario autenticado', () => {
    const state = reducer(undefined, fetchMyReviews.fulfilled([review], '', undefined))
    expect(state.myItems[0]).toEqual(review)
  })

  it('retira una reseña borrada de todas las listas', () => {
    let state = reducer(undefined, fetchMyReviews.fulfilled([review], '', undefined))
    state = reducer(state, deleteReview.fulfilled(review.id, '', review.id))
    expect(state.myItems).toHaveLength(0)
  })

  it('permite guardar varias reseñas del mismo usuario para una película', () => {
    const anotherReview: Review = { ...review, id: 5, title: 'Segunda valoración' }
    let state = reducer(undefined, fetchMyReviews.fulfilled([review], '', undefined))
    state = reducer(state, saveReview.fulfilled(anotherReview, '', {
      movieId: review.movieId,
      review: { rating: anotherReview.rating, title: anotherReview.title, content: anotherReview.content },
    }))

    expect(state.myItems).toHaveLength(2)
    expect(state.myItems.map((item) => item.id)).toEqual([5, 4])
  })
  it('actualiza una reseña existente sin perder sus datos de usuario', () => {
    const updatedReview: Review = { ...review, rating: 3, title: 'Nueva opinión' }
    let state = reducer(undefined, fetchMyReviews.fulfilled([review], '', undefined))
    state = reducer(state, saveReview.fulfilled(updatedReview, '', {
      id: review.id,
      movieId: review.movieId,
      review: { rating: updatedReview.rating, title: updatedReview.title, content: updatedReview.content },
    }))
    expect(state.myItems).toHaveLength(1)
    expect(state.myItems[0]).toMatchObject({ rating: 3, title: 'Nueva opinión', userName: 'Mauro' })
  })
})
