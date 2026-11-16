import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router'
import { FiFilm, FiCalendar, FiClock, FiMapPin } from 'react-icons/fi'
import Layout from '../components/Layout'
import { catalogoApi } from '../services/catalogoApi'
import ConfirmCreateModal from '../components/ConfirmCreateModal'

const FORMATOS = ['2D', '3D', 'IMAX']
const IDIOMAS = ['Doblada', 'Subtitulada']

function CrearFuncionPage() {
  const navigate = useNavigate()
  const [sucursalId, setSucursalIdFromUrl] = useState(null)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [pendingPayload, setPendingPayload] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [peliculas, setPeliculas] = useState([])

  // Form state
  const [peliculaId, setPeliculaId] = useState('')
  const [peliculaTitulo, setPeliculaTitulo] = useState('')
  const [salaId, setSalaId] = useState('')
  const [formato, setFormato] = useState(FORMATOS[0])
  const [idioma, setIdioma] = useState(IDIOMAS[0])
  const [fecha, setFecha] = useState('')
  const [hora, setHora] = useState('')

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const id = params.get('sucursalId')
    if (id) setSucursalIdFromUrl(Number(id))

    catalogoApi
      .getPeliculas()
      .then((data) => {
        if (Array.isArray(data)) setPeliculas(data)
      })
      .catch(() => {})
  }, [])

  const handleSubmit = (event) => {
    event.preventDefault()
    setError('')
    if (!peliculaId || !salaId || !fecha || !hora) {
      setError('Todos los campos son obligatorios')
      return
    }

    const fechaHora = `${fecha}T${hora}:00`

    setPendingPayload({
      salaId: Number(salaId),
      sucursalId: sucursalId ?? 0,
      fechaHora,
      formato,
      idioma,
      peliculaId: Number(peliculaId),
      peliculaTitulo,
    })
    setConfirmOpen(true)
  }

  const handleConfirm = async () => {
    if (!pendingPayload) return
    setLoading(true)
    try {
      await catalogoApi.createFuncion(pendingPayload)
      setConfirmOpen(false)
      setPendingPayload(null)
      setLoading(false)
      navigate('/panel-inicio/funciones')
    } catch (e) {
      setError(e.message || 'Error al crear función')
      setConfirmOpen(false)
      setPendingPayload(null)
      setLoading(false)
    }
  }

  const requiredPhrase = pendingPayload
    ? `CONFIRMAR CREAR FUNCIÓN ${pendingPayload.peliculaTitulo}`
    : ''

  const isFormValid =
    peliculaId &&
    salaId &&
    Number(salaId) > 0 &&
    fecha &&
    hora

  return (
    <Layout>
      <section className="mx-auto max-w-5xl space-y-6">
        <Link to="/panel-inicio/funciones" className="link link-hover text-sm">
          ← Volver a funciones
        </Link>
        <h1 className="text-2xl font-bold md:text-3xl">Añadir Función</h1>

        {error && <div className="alert alert-error"><span>{error}</span></div>}
        {loading && <div className="loading loading-spinner" />}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            <fieldset className="fieldset">
              <legend className="fieldset-legend">Película *</legend>
              <select
                className="select select-bordered w-full"
                value={peliculaId}
                onChange={(e) => {
                  setPeliculaId(e.target.value)
                  const p = peliculas.find((x) => String(x.id) === e.target.value)
                  setPeliculaTitulo(p ? p.titulo : '')
                }}
                required
              >
                <option value="">Selecciona película</option>
                {peliculas.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.titulo}
                  </option>
                ))}
              </select>
              {peliculaTitulo && (
                <p className="label text-xs text-base-content/50">
                  Película: {peliculaTitulo}
                </p>
              )}
            </fieldset>

            <fieldset className="fieldset">
              <legend className="fieldset-legend">Sala *</legend>
              <input
                type="number"
                inputMode="numeric"
                className="input input-bordered w-full"
                placeholder="Ej: 1"
                value={salaId}
                onChange={(e) => setSalaId(e.target.value)}
                required
                min={1}
              />
              <p className="label text-xs text-base-content/50">
                Número de sala de la sucursal.
              </p>
            </fieldset>
          </div>

          <div className="space-y-4 lg:col-span-1">
            <fieldset className="fieldset">
              <legend className="fieldset-legend">Formato *</legend>
              <select
                className="select select-bordered w-full"
                value={formato}
                onChange={(e) => setFormato(e.target.value)}
                required
              >
                {FORMATOS.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
            </fieldset>

            <fieldset className="fieldset">
              <legend className="fieldset-legend">Idioma *</legend>
              <select
                className="select select-bordered w-full"
                value={idioma}
                onChange={(e) => setIdioma(e.target.value)}
                required
              >
                {IDIOMAS.map((i) => (
                  <option key={i} value={i}>
                    {i}
                  </option>
                ))}
              </select>
            </fieldset>

            <fieldset className="fieldset">
              <legend className="fieldset-legend">Fecha *</legend>
              <input
                type="date"
                className="input input-bordered w-full"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                required
              />
            </fieldset>

            <fieldset className="fieldset">
              <legend className="fieldset-legend">Hora *</legend>
              <input
                type="time"
                className="input input-bordered w-full"
                value={hora}
                onChange={(e) => setHora(e.target.value)}
                required
              />
            </fieldset>
          </div>

          <div className="lg:col-span-3 flex justify-end gap-2 pt-2">
            <Link to="/panel-inicio/funciones" className="btn btn-ghost">
              Cancelar
            </Link>
            <button type="submit" className="btn btn-primary" disabled={!isFormValid}>
              Guardar función
            </button>
          </div>
        </form>
      </section>

      <ConfirmCreateModal
        open={confirmOpen}
        title="¿Crear función?"
        entityLabel="función"
        entityName={peliculaTitulo || 'Película'}
        requiredPhrase={requiredPhrase}
        action="crear"
        onClose={() => {
          setConfirmOpen(false)
          setPendingPayload(null)
        }}
        onConfirm={handleConfirm}
      />
    </Layout>
  )
}

export default CrearFuncionPage