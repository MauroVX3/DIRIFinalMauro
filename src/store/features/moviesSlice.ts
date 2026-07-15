import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { apiRequest } from '../../services/api'
import type { Movie, MovieInput, PaginatedResponse } from '../../types/entities'

interface FetchMoviesArgs { search: string; page: number }
interface SaveMovieArgs { id?: number; movie: MovieInput }

interface MoviesState {
  items: Movie[]
  selected: Movie | null
  search: string
  page: number
  hasMore: boolean
  total: number
  loading: boolean
  detailLoading: boolean
  error?: string
}

const initialState: MoviesState = {
  items: [], selected: null, search: '', page: 0, hasMore: true,
  total: 0, loading: false, detailLoading: false,
}

export const fetchMovies = createAsyncThunk<PaginatedResponse<Movie> & { search: string }, FetchMoviesArgs, { rejectValue: string }>(
  'movies/fetchMovies',
  async ({ search, page }, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams({ search, page: String(page), limit: '8' })
      const data = await apiRequest<PaginatedResponse<Movie>>(`/movies?${params}`, { authenticated: false })
      return { ...data, search }
    } catch {
      return rejectWithValue('movies.error.load')
    }
  },
)

export const fetchMovie = createAsyncThunk<Movie, number, { rejectValue: string }>(
  'movies/fetchMovie',
  async (id, { rejectWithValue }) => {
    try {
      return (await apiRequest<{ movie: Movie }>(`/movies/${id}`, { authenticated: false })).movie
    } catch {
      return rejectWithValue('movies.error.detail')
    }
  },
)

export const saveMovie = createAsyncThunk<Movie, SaveMovieArgs, { rejectValue: string }>(
  'movies/saveMovie',
  async ({ id, movie }, { rejectWithValue }) => {
    try {
      const data = await apiRequest<{ movie: Movie }>(id ? `/movies/${id}` : '/movies', {
        method: id ? 'PUT' : 'POST', body: JSON.stringify(movie),
      })
      return data.movie
    } catch {
      return rejectWithValue('movies.error.save')
    }
  },
)

export const deleteMovie = createAsyncThunk<number, number, { rejectValue: string }>(
  'movies/deleteMovie',
  async (id, { rejectWithValue }) => {
    try {
      await apiRequest(`/movies/${id}`, { method: 'DELETE' })
      return id
    } catch {
      return rejectWithValue('movies.error.delete')
    }
  },
)

const moviesSlice = createSlice({
  name: 'movies', initialState,
  reducers: {
    clearSelectedMovie: (state) => { state.selected = null },
    clearMoviesError: (state) => { state.error = undefined },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMovies.pending, (state) => { state.loading = true; state.error = undefined })
      .addCase(fetchMovies.fulfilled, (state, action) => {
        const { items, page, hasMore, total, search } = action.payload
        state.items = page === 1 ? items : [...state.items, ...items.filter((item) => !state.items.some((old) => old.id === item.id))]
        state.page = page
        state.hasMore = hasMore
        state.total = total
        state.search = search
        state.loading = false
      })
      .addCase(fetchMovies.rejected, (state, action) => { state.loading = false; state.error = action.payload })
      .addCase(fetchMovie.pending, (state) => { state.detailLoading = true; state.error = undefined; state.selected = null })
      .addCase(fetchMovie.fulfilled, (state, action) => { state.selected = action.payload; state.detailLoading = false })
      .addCase(fetchMovie.rejected, (state, action) => { state.detailLoading = false; state.error = action.payload })
      .addCase(saveMovie.fulfilled, (state, action) => {
        const index = state.items.findIndex((item) => item.id === action.payload.id)
        if (index >= 0) state.items[index] = { ...state.items[index], ...action.payload }
        else state.items.unshift(action.payload)
      })
      .addCase(saveMovie.rejected, (state, action) => { state.error = action.payload })
      .addCase(deleteMovie.fulfilled, (state, action) => { state.items = state.items.filter((item) => item.id !== action.payload) })
      .addCase(deleteMovie.rejected, (state, action) => { state.error = action.payload })
  },
})

export const { clearSelectedMovie, clearMoviesError } = moviesSlice.actions
export default moviesSlice.reducer
