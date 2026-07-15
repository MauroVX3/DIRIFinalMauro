import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useIntl } from 'react-intl'
import { fetchMovie, saveMovie } from '../store/features/moviesSlice'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import type { MovieInput } from '../types/entities'

const emptyMovie: MovieInput = { title: '', director: '', releaseYear: new Date().getFullYear(), genre: '', durationMinutes: 90, synopsis: '', posterPath: '' }

export default function MovieFormPage() {
  const { id } = useParams()
  const movieId = id ? Number(id) : undefined
  const intl = useIntl()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { selected, detailLoading, error } = useAppSelector((state) => state.movies)
  const [movie, setMovie] = useState<MovieInput>(emptyMovie)
  const [saving, setSaving] = useState(false)
  useEffect(() => { if (movieId) dispatch(fetchMovie(movieId)) }, [dispatch, movieId])
  useEffect(() => { if (selected && selected.id === movieId) { const { title, director, releaseYear, genre, durationMinutes, synopsis, posterPath } = selected; setMovie({ title, director, releaseYear, genre, durationMinutes, synopsis, posterPath }) } }, [movieId, selected])
  const update = (field: keyof MovieInput, value: string | number) => setMovie((current) => ({ ...current, [field]: value }))
  const submit = async (event: FormEvent) => {
    event.preventDefault(); setSaving(true)
    try { const result = await dispatch(saveMovie({ id: movieId, movie })).unwrap(); navigate(`/movies/${result.id}`) } catch { setSaving(false) }
  }
  if (detailLoading) return <p className="page-message">{intl.formatMessage({ id: 'common.loading' })}</p>
  return (
    <section className="page-section container form-page">
      <form className="form-card wide" onSubmit={submit}>
        <h1>{intl.formatMessage({ id: movieId ? 'admin.editMovie' : 'admin.newMovie' })}</h1>
        {error && <div className="alert error">{intl.formatMessage({ id: error })}</div>}
        <div className="form-grid">
          <label className="full-field">{intl.formatMessage({ id: 'admin.titleField' })}<input required value={movie.title} onChange={(event) => update('title', event.target.value)} /></label>
          <label>{intl.formatMessage({ id: 'admin.director' })}<input required value={movie.director} onChange={(event) => update('director', event.target.value)} /></label>
          <label>{intl.formatMessage({ id: 'admin.genre' })}<input required value={movie.genre} onChange={(event) => update('genre', event.target.value)} /></label>
          <label>{intl.formatMessage({ id: 'admin.year' })}<input required type="number" min="1888" max="2100" value={movie.releaseYear} onChange={(event) => update('releaseYear', Number(event.target.value))} /></label>
          <label>{intl.formatMessage({ id: 'admin.duration' })}<input required type="number" min="1" value={movie.durationMinutes} onChange={(event) => update('durationMinutes', Number(event.target.value))} /></label>
          <label className="full-field">{intl.formatMessage({ id: 'admin.poster' })}<input value={movie.posterPath} onChange={(event) => update('posterPath', event.target.value)} /><small>{intl.formatMessage({ id: 'admin.posterHelp' })}</small></label>
          <label className="full-field">{intl.formatMessage({ id: 'admin.synopsis' })}<textarea required rows={7} value={movie.synopsis} onChange={(event) => update('synopsis', event.target.value)} /></label>
        </div>
        <div className="form-actions"><button className="button-secondary" type="button" onClick={() => navigate(-1)}>{intl.formatMessage({ id: 'common.cancel' })}</button><button className="button-primary" type="submit" disabled={saving}>{intl.formatMessage({ id: saving ? 'admin.saving' : 'common.save' })}</button></div>
      </form>
    </section>
  )
}
