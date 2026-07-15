export type UserRole = 'USER' | 'ADMIN'

export interface User {
  id: number
  name: string
  email: string
  role: UserRole
}

export interface Movie {
  id: number
  title: string
  director: string
  releaseYear: number
  genre: string
  durationMinutes: number
  synopsis: string
  posterPath: string
  averageRating: number
  reviewCount: number
  createdAt?: string
}

export type MovieInput = Omit<Movie, 'id' | 'averageRating' | 'reviewCount' | 'createdAt'>

export interface Review {
  id: number
  movieId: number
  userId: number
  rating: number
  title: string
  content: string
  userName: string
  movieTitle?: string
  posterPath?: string
  createdAt?: string
  updatedAt?: string
}

export interface ReviewInput {
  rating: number
  title: string
  content: string
}

export interface PaginatedResponse<T> {
  items: T[]
  page: number
  total: number
  hasMore: boolean
}
