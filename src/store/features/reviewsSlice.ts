import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { apiRequest } from '../../services/api'
import type { PaginatedResponse, Review, ReviewInput } from '../../types/entities'

interface SaveReviewArgs { id?: number; movieId: number; review: ReviewInput }

interface ReviewsState {
  items: Review[]
  movieItems: Review[]
  myItems: Review[]
  page: number
  hasMore: boolean
  total: number
  loading: boolean
  saving: boolean
  error?: string
}

const initialState: ReviewsState = {
  items: [], movieItems: [], myItems: [], page: 0, hasMore: true,
  total: 0, loading: false, saving: false,
}

export const fetchReviews = createAsyncThunk<PaginatedResponse<Review>, { search: string; page: number }, { rejectValue: string }>(
  'reviews/fetchReviews',
  async ({ search, page }, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams({ search, page: String(page), limit: '10' })
      return await apiRequest<PaginatedResponse<Review>>(`/reviews?${params}`, { authenticated: false })
    } catch {
      return rejectWithValue('reviews.error.load')
    }
  },
)

export const fetchMovieReviews = createAsyncThunk<Review[], number, { rejectValue: string }>(
  'reviews/fetchMovieReviews',
  async (movieId, { rejectWithValue }) => {
    try {
      return (await apiRequest<{ items: Review[] }>(`/reviews/movie/${movieId}`, { authenticated: false })).items
    } catch {
      return rejectWithValue('reviews.error.load')
    }
  },
)

export const fetchMyReviews = createAsyncThunk<Review[], void, { rejectValue: string }>(
  'reviews/fetchMyReviews',
  async (_, { rejectWithValue }) => {
    try {
      return (await apiRequest<{ items: Review[] }>('/reviews/mine')).items
    } catch {
      return rejectWithValue('reviews.error.mine')
    }
  },
)

export const saveReview = createAsyncThunk<Review, SaveReviewArgs, { rejectValue: string }>(
  'reviews/saveReview',
  async ({ id, movieId, review }, { rejectWithValue }) => {
    try {
      const data = await apiRequest<{ review: Review }>(id ? `/reviews/${id}` : `/reviews/movie/${movieId}`, {
        method: id ? 'PUT' : 'POST', body: JSON.stringify(review),
      })
      return { ...data.review, movieId }
    } catch {
      return rejectWithValue('reviews.error.save')
    }
  },
)

export const deleteReview = createAsyncThunk<number, number, { rejectValue: string }>(
  'reviews/deleteReview',
  async (id, { rejectWithValue }) => {
    try {
      await apiRequest(`/reviews/${id}`, { method: 'DELETE' })
      return id
    } catch {
      return rejectWithValue('reviews.error.delete')
    }
  },
)

const reviewsSlice = createSlice({
  name: 'reviews', initialState,
  reducers: { clearReviewsError: (state) => { state.error = undefined } },
  extraReducers: (builder) => {
    builder
      .addCase(fetchReviews.pending, (state) => { state.loading = true; state.error = undefined })
      .addCase(fetchReviews.fulfilled, (state, action) => {
        state.items = action.payload.page === 1
          ? action.payload.items
          : [...state.items, ...action.payload.items.filter((item) => !state.items.some((old) => old.id === item.id))]
        state.page = action.payload.page
        state.hasMore = action.payload.hasMore
        state.total = action.payload.total
        state.loading = false
      })
      .addCase(fetchReviews.rejected, (state, action) => { state.loading = false; state.error = action.payload })
      .addCase(fetchMovieReviews.pending, (state) => { state.loading = true; state.error = undefined })
      .addCase(fetchMovieReviews.fulfilled, (state, action) => { state.movieItems = action.payload; state.loading = false })
      .addCase(fetchMovieReviews.rejected, (state, action) => { state.loading = false; state.error = action.payload })
      .addCase(fetchMyReviews.pending, (state) => { state.loading = true; state.error = undefined })
      .addCase(fetchMyReviews.fulfilled, (state, action) => { state.myItems = action.payload; state.loading = false })
      .addCase(fetchMyReviews.rejected, (state, action) => { state.loading = false; state.error = action.payload })
      .addCase(saveReview.pending, (state) => { state.saving = true; state.error = undefined })
      .addCase(saveReview.fulfilled, (state, action) => {
        const replace = (items: Review[]) => {
          const index = items.findIndex((item) => item.id === action.payload.id)
          if (index >= 0) items[index] = { ...items[index], ...action.payload }
          else items.unshift(action.payload)
        }
        replace(state.movieItems)
        replace(state.myItems)
        state.saving = false
      })
      .addCase(saveReview.rejected, (state, action) => { state.saving = false; state.error = action.payload })
      .addCase(deleteReview.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item.id !== action.payload)
        state.movieItems = state.movieItems.filter((item) => item.id !== action.payload)
        state.myItems = state.myItems.filter((item) => item.id !== action.payload)
      })
      .addCase(deleteReview.rejected, (state, action) => { state.error = action.payload })
  },
})

export const { clearReviewsError } = reviewsSlice.actions
export default reviewsSlice.reducer
