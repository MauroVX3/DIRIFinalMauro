import { configureStore } from '@reduxjs/toolkit'
import authReducer from './features/authSlice'
import moviesReducer from './features/moviesSlice'
import reviewsReducer from './features/reviewsSlice'
import loggerMiddleware from './loggerMiddleware'

const store = configureStore({
  reducer: {
    auth: authReducer,
    movies: moviesReducer,
    reviews: reviewsReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(loggerMiddleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export default store
