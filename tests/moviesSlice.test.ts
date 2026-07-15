import { describe, expect, it } from 'vitest'
import reducer, { deleteMovie, fetchMovies } from '../src/store/features/moviesSlice'
import type { Movie } from '../src/types/entities'

const movie: Movie = {
  id: 1, title: 'La última luz', director: 'Clara Montes', releaseYear: 2024,
  genre: 'Drama', durationMinutes: 118, synopsis: 'Sinopsis', posterPath: 'ultima-luz.svg',
  averageRating: 4, reviewCount: 2,
}

describe('movies reducer', () => {
  it('reemplaza el catálogo al recibir la primera página', () => {
    const state = reducer(undefined, fetchMovies.fulfilled({ items: [movie], page: 1, total: 1, hasMore: false, search: '' }, '', { search: '', page: 1 }))
    expect(state.items).toEqual([movie])
    expect(state.hasMore).toBe(false)
  })

  it('elimina duplicados al añadir páginas', () => {
    const first = reducer(undefined, fetchMovies.fulfilled({ items: [movie], page: 1, total: 2, hasMore: true, search: '' }, '', { search: '', page: 1 }))
    const second = reducer(first, fetchMovies.fulfilled({ items: [movie], page: 2, total: 2, hasMore: false, search: '' }, '', { search: '', page: 2 }))
    expect(second.items).toHaveLength(1)
  })
  it('elimina una película del catálogo', () => {
    const loaded = reducer(undefined, fetchMovies.fulfilled({ items: [movie], page: 1, total: 1, hasMore: false, search: '' }, '', { search: '', page: 1 }))
    const state = reducer(loaded, deleteMovie.fulfilled(movie.id, '', movie.id))
    expect(state.items).toHaveLength(0)
  })

  it('guarda el error producido al cargar el catálogo', () => {
    const state = reducer(undefined, fetchMovies.rejected(null, '', { search: '', page: 1 }, 'movies.error.load'))
    expect(state.loading).toBe(false)
    expect(state.error).toBe('movies.error.load')
  })
})
