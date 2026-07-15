import { createAsyncThunk, createSlice, isAnyOf } from '@reduxjs/toolkit'
import { apiRequest, tokenStorage } from '../../services/api'
import type { User } from '../../types/entities'

interface AuthResponse { user: User; token: string }
interface Credentials { email: string; password: string }
interface Registration extends Credentials { name: string }

interface AuthState {
  user: User | null
  loading: boolean
  initialized: boolean
  error?: string
}

const initialState: AuthState = {
  user: null,
  loading: false,
  initialized: false,
}

export const restoreSession = createAsyncThunk<User, void, { rejectValue: string }>(
  'auth/restoreSession',
  async (_, { rejectWithValue }) => {
    if (!tokenStorage.get()) return rejectWithValue('NO_SESSION')
    try {
      const data = await apiRequest<{ user: User }>('/auth/me')
      return data.user
    } catch {
      tokenStorage.clear()
      return rejectWithValue('SESSION_EXPIRED')
    }
  },
)

export const login = createAsyncThunk<User, Credentials, { rejectValue: string }>(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const data = await apiRequest<AuthResponse>('/auth/login', {
        method: 'POST', body: JSON.stringify(credentials), authenticated: false,
      })
      tokenStorage.set(data.token)
      return data.user
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'LOGIN_FAILED')
    }
  },
)

export const register = createAsyncThunk<User, Registration, { rejectValue: string }>(
  'auth/register',
  async (registration, { rejectWithValue }) => {
    try {
      const data = await apiRequest<AuthResponse>('/auth/register', {
        method: 'POST', body: JSON.stringify(registration), authenticated: false,
      })
      tokenStorage.set(data.token)
      return data.user
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'REGISTER_FAILED')
    }
  },
)

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      tokenStorage.clear()
      state.user = null
      state.error = undefined
    },
    clearAuthError: (state) => { state.error = undefined },
  },
  extraReducers: (builder) => {
    builder
      .addCase(restoreSession.pending, (state) => { state.loading = true })
      .addCase(restoreSession.fulfilled, (state, action) => {
        state.user = action.payload
        state.loading = false
        state.initialized = true
      })
      .addCase(restoreSession.rejected, (state) => {
        state.user = null
        state.loading = false
        state.initialized = true
      })
      .addMatcher(
        isAnyOf(login.pending, register.pending),
        (state) => { state.loading = true; state.error = undefined },
      )
      .addMatcher(
        isAnyOf(login.fulfilled, register.fulfilled),
        (state, action) => {
          state.user = action.payload
          state.loading = false
          state.initialized = true
        },
      )
      .addMatcher(
        isAnyOf(login.rejected, register.rejected),
        (state, action) => {
          state.loading = false
          state.error = action.payload || 'AUTH_FAILED'
        },
      )
  },
})

export const { logout, clearAuthError } = authSlice.actions
export default authSlice.reducer
