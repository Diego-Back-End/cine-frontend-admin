import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { FiImage, FiX } from 'react-icons/fi'
import { useCatalogMeta } from '../context/CatalogMetaContext'

function PeliculaForm({ initialData = null, onSubmit, submitLabel = 'Guardar película' }) {
  const { generos, clasificaciones, estados } = useCatalogMeta()

  const [titulo, setTitulo] = useState(initialData?.title ?? '')
  const [sinopsis, setSinopsis] = useState(initialData?.sinopsis ?? '')
  const [duracion, setDuracion] = useState(
    initialData?.duration ? String(initialData.duration) : ''
  )
  const [generosSeleccionados, setGenerosSeleccionados] = useState(
    Array.isArray(initialData?.generos)
      ? initialData.generos
      : initialData?.genre
        ? [initialData.genre]
        : []
  )
  const [generosDropdownOpen, setGenerosDropdownOpen] = useState(false)

  const toggleGenero = (genero) => {
    if (generosSeleccionados.includes(genero)) {
      setGenerosSeleccionados(generosSeleccionados.filter((g) => g !== genero))
    } else {
      setGenerosSeleccionados([...generosSeleccionados, genero])
    }
  }
  const [clasificacion, setClasificacion] = useState(initialData?.rating ?? '')
  const [estado, setEstado] = useState(initialData?.estado ?? '')
  const [posterUrl, setPosterUrl] = useState(initialData?.poster ?? '')

  // Sincroniza cuando initialData cambia (editar) — sincronización intencional de props a estado
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => {
    if (initialData) {
      setTitulo(initialData.title ?? '')
      setSinopsis(initialData.sinopsis ?? '')
      setDuracion(initialData.duration ? String(initialData.duration) : '')
      setGenerosSeleccionados(
        Array.isArray(initialData?.generos)
          ? initialData.generos
          : initialData?.genre
            ? [initialData.genre]
            : []
      )
      setClasificacion(initialData.rating ?? '')
      setEstado(initialData.estado ?? '')
      setPosterUrl(initialData.poster ?? '')
    }
  }, [initialData])

  const handleUrlChange = (event) => setPosterUrl(event.target.value)

  const handleClearImage = () => setPosterUrl('')

  const handleDuracionChange = (event) => {
    const value = event.target.value
    if (/^\d*$/.test(value)) setDuracion(value)
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const payload = {
      titulo: titulo.trim(),
      sinopsis: sinopsis.trim(),
      duracion: duracion ? Number(duracion) : null,
      generosSeleccionados,
      clasificacion,
      estado,
      poster: posterUrl.trim() || null,
    }
    onSubmit?.(payload)
  }

  const isFormValid =
    titulo.trim() &&
    sinopsis.trim() &&
    duracion.trim() &&
    Number(duracion) > 0 &&
    generosSeleccionados.length > 0 &&
    clasificacion &&
    estado

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6 lg:grid-cols-5">
      <div className="space-y-4 lg:col-span-2">
        <fieldset className="fieldset">
          <legend className="fieldset-legend">Título *</legend>
          <input
            type="text"
            className="input input-bordered w-full"
            placeholder="Ej: Dune: Parte Dos"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            required
            maxLength={100}
          />
        </fieldset>

        <fieldset className="fieldset">
          <legend className="fieldset-legend">Imagen de cartelera</legend>
          <div className="aspect-[2/3] overflow-hidden rounded-box border-2 border-dashed border-base-300 bg-base-200">
            {posterUrl.trim() ? (
              <img
                src={posterUrl.trim()}
                alt="Preview cartelera"
                className="h-full w-full object-cover"
                onError={(e) => {
                  e.target.src = `${import.meta.env.BASE_URL}default-poster.svg`
                }}
              />
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center gap-2 p-6 text-base-content/50">
                <FiImage className="size-10" />
                <p className="text-center text-sm">Pega una URL de imagen</p>
              </div>
            )}
          </div>

          <div className="mt-2">
            <label className="label text-xs text-base-content/60">URL de la imagen</label>
            <div className="flex gap-2">
              <input
                type="url"
                placeholder="https://ejemplo.com/poster.jpg"
                className="input input-bordered input-sm w-full"
                value={posterUrl}
                onChange={handleUrlChange}
              />
              {posterUrl.trim() && (
                <button
                  type="button"
                  className="btn btn-ghost btn-sm btn-square"
                  onClick={handleClearImage}
                  aria-label="Quitar imagen"
                >
                  <FiX className="size-4" />
                </button>
              )}
            </div>
          </div>
        </fieldset>
      </div>

      <div className="space-y-4 lg:col-span-3">
        <fieldset className="fieldset">
          <legend className="fieldset-legend">Sinopsis *</legend>
          <textarea
            className="textarea textarea-bordered h-32 w-full"
            placeholder="Breve descripción de la película..."
            value={sinopsis}
            onChange={(e) => setSinopsis(e.target.value)}
            required
            maxLength={1000}
          />
        </fieldset>

        <fieldset className="fieldset">
          <legend className="fieldset-legend">Duración (minutos) *</legend>
          <label className="input input-bordered flex items-center gap-2">
            <input
              type="text"
              inputMode="numeric"
              placeholder="Ej: 166"
              className="grow"
              value={duracion}
              onChange={handleDuracionChange}
              required
            />
            <span className="badge badge-ghost badge-sm">min</span>
          </label>
          <p className="label text-xs text-base-content/50">Solo números enteros.</p>
        </fieldset>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Géneros *</legend>
            <div className="dropdown">
              <div className="select select-bordered w-full">
                <button
                  type="button"
                  className="select-button"
                  onClick={() => setGenerosDropdownOpen(!generosDropdownOpen)}
                  aria-expanded={generosDropdownOpen}
                >
                  {generosSeleccionados.length === 0
                    ? 'Seleccionar géneros...'
                    : `${generosSeleccionados.length} género${generosSeleccionados.length > 1 ? 's seleccionados' : ' seleccionado'}`}
                </button>
              </div>
              {generosDropdownOpen && (
                <ul className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 z-50">
                  {generos.map((g) => (
                    <li key={g}>
                      <label className="cursor-pointer flex items-center gap-2">
                        <input
                          type="checkbox"
                          className="checkbox checkbox-sm"
                          checked={generosSeleccionados.includes(g)}
                          onChange={() => toggleGenero(g)}
                        />
                        {g}
                      </label>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <p className="label text-xs text-base-content/50">
              Selecciona uno o más géneros para la película.
            </p>
          </fieldset>

          <fieldset className="fieldset">
            <legend className="fieldset-legend">Clasificación *</legend>
            <select
              className="select select-bordered w-full"
              value={clasificacion}
              onChange={(e) => setClasificacion(e.target.value)}
              required
            >
              <option value="" disabled>
                Selecciona clasificación
              </option>
              {clasificaciones.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </fieldset>
        </div>

        <fieldset className="fieldset">
          <legend className="fieldset-legend">Estado *</legend>
          <select
            className="select select-bordered w-full"
            value={estado}
            onChange={(e) => setEstado(e.target.value)}
            required
          >
            <option value="" disabled>
              Selecciona estado
            </option>
            {estados.map((e) => (
              <option key={e} value={e}>
                {e}
              </option>
            ))}
          </select>
        </fieldset>

        <div className="flex justify-end gap-2 pt-2">
          <Link to="/panel-inicio/peliculas" className="btn btn-ghost">
            Cancelar
          </Link>
          <button type="submit" className="btn btn-primary" disabled={!isFormValid}>
            {submitLabel}
          </button>
        </div>
        <p className="text-right text-xs text-base-content/40">* Campos obligatorios.</p>
      </div>
    </form>
  )
}

export default PeliculaForm
