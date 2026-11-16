import { useCallback, useEffect, useState } from 'react'
import { catalogoApi } from '../services/catalogoApi'

const FORMATOS = ['2D', '3D', 'IMAX']
const IDIOMAS = ['Doblada', 'Subtitulada']

function formatearFechaHora(fechaHora) {
  const fecha = new Date(fechaHora)
  if (Number.isNaN(fecha.getTime())) return fechaHora
  return fecha.toLocaleString('es-CL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function CrearFuncionModal({ pelicula, onClose }) {
  const [sucursales, setSucursales] = useState([])
  const [funciones, setFunciones] = useState([])
  const [sucursalId, setSucursalId] = useState('')
  const [salaId, setSalaId] = useState('')
  const [fecha, setFecha] = useState('')
  const [hora, setHora] = useState('')
  const [formato, setFormato] = useState(FORMATOS[0])
  const [idioma, setIdioma] = useState(IDIOMAS[0])
  const [loading, setLoading] = useState(false)
  const [loadingDatos, setLoadingDatos] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const loadFunciones = useCallback(async () => {
    setLoadingDatos(true)
    try {
      const data = await catalogoApi.getFunciones()
      setFunciones(Array.isArray(data) ? data : [])
    } catch (e) {
      setError(e.message || 'No se pudieron cargar las funciones')
    } finally {
      setLoadingDatos(false)
    }
  }, [])

  useEffect(() => {
    let cancelled = false
    Promise.all([catalogoApi.getSucursales(), catalogoApi.getFunciones()])
      .then(([sucursalesData, funcionesData]) => {
        if (cancelled) return
        setSucursales(Array.isArray(sucursalesData) ? sucursalesData : [])
        setFunciones(Array.isArray(funcionesData) ? funcionesData : [])
      })
      .catch((e) => {
        if (!cancelled) setError(e.message || 'No se pudieron cargar los datos')
      })
      .finally(() => {
        if (!cancelled) setLoadingDatos(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  if (!pelicula) return null

  const funcionesPelicula = funciones
    .filter((funcion) => String(funcion.peliculaId) === String(pelicula.id))
    .sort((a, b) => new Date(a.fechaHora) - new Date(b.fechaHora))

  const nombreSucursal = (id) =>
    sucursales.find((sucursal) => sucursal.id === id)?.nombre || `Sucursal ${id}`

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setSuccess('')

    if (!sucursalId || !salaId || !fecha || !hora) {
      setError('Todos los campos son obligatorios')
      return
    }

    const payload = {
      salaId: Number(salaId),
      sucursalId: Number(sucursalId),
      fechaHora: `${fecha}T${hora}:00`,
      formato,
      idioma,
      peliculaId: pelicula.id,
    }

    setLoading(true)
    try {
      await catalogoApi.createFuncion(payload)
      setSuccess('Función creada correctamente.')
      setSalaId('')
      setFecha('')
      setHora('')
      await loadFunciones()
    } catch (e) {
      setError(e.message || 'Error al crear la función')
    } finally {
      setLoading(false)
    }
  }

  return (
    <dialog className="modal modal-open">
      <div className="modal-box max-w-2xl">
        <h3 className="text-lg font-bold">Horarios de {pelicula.title}</h3>
        <p className="py-1 text-sm text-base-content/70">
          Programa una nueva función para esta película.
        </p>

        {error && (
          <div className="alert alert-error my-3 py-2 text-sm">
            <span>{error}</span>
          </div>
        )}
        {success && (
          <div className="alert alert-success my-3 py-2 text-sm">
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <fieldset className="fieldset">
              <legend className="fieldset-legend">Sucursal *</legend>
              <select
                className="select select-bordered w-full"
                value={sucursalId}
                onChange={(e) => setSucursalId(e.target.value)}
                required
              >
                <option value="">Selecciona sucursal</option>
                {sucursales.map((sucursal) => (
                  <option key={sucursal.id} value={sucursal.id}>
                    {sucursal.nombre}
                  </option>
                ))}
              </select>
            </fieldset>

            <fieldset className="fieldset">
              <legend className="fieldset-legend">Sala *</legend>
              <input
                type="number"
                inputMode="numeric"
                min={1}
                className="input input-bordered w-full"
                placeholder="Ej: 1"
                value={salaId}
                onChange={(e) => setSalaId(e.target.value)}
                required
              />
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

            <fieldset className="fieldset">
              <legend className="fieldset-legend">Formato *</legend>
              <select
                className="select select-bordered w-full"
                value={formato}
                onChange={(e) => setFormato(e.target.value)}
                required
              >
                {FORMATOS.map((opcion) => (
                  <option key={opcion} value={opcion}>
                    {opcion}
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
                {IDIOMAS.map((opcion) => (
                  <option key={opcion} value={opcion}>
                    {opcion}
                  </option>
                ))}
              </select>
            </fieldset>
          </div>

          <div className="modal-action mt-2">
            <button type="button" className="btn btn-ghost" onClick={onClose}>
              Cerrar
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Guardando...' : 'Guardar función'}
            </button>
          </div>
        </form>

        <div className="divider my-2">Funciones programadas</div>

        {loadingDatos ? (
          <div className="loading loading-spinner" />
        ) : funcionesPelicula.length === 0 ? (
          <p className="text-sm text-base-content/60">Aún no hay funciones para esta película.</p>
        ) : (
          <ul className="space-y-2">
            {funcionesPelicula.map((funcion) => (
              <li
                key={funcion.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-box border border-base-300 p-2 text-sm"
              >
                <span className="font-medium">{formatearFechaHora(funcion.fechaHora)}</span>
                <span className="text-base-content/70">
                  {nombreSucursal(funcion.sucursalId)} · Sala {funcion.salaId}
                </span>
                <span className="flex gap-1">
                  <span className="badge badge-sm badge-outline">{funcion.formato}</span>
                  <span className="badge badge-sm badge-outline">{funcion.idioma}</span>
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="modal-backdrop bg-black/40" onClick={onClose} />
    </dialog>
  )
}

export default CrearFuncionModal
