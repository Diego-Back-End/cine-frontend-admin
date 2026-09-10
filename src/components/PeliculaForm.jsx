import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router'
import { FiImage, FiX } from 'react-icons/fi'
import { useCatalogMeta } from '../context/CatalogMetaContext'

function PeliculaForm({ initialData = null, onSubmit, submitLabel = 'Guardar película' }) {
  const fileInputRef = useRef(null)
  const { generos, clasificaciones, estados } = useCatalogMeta()

  const [titulo, setTitulo] = useState(initialData?.title ?? '')
  const [sinopsis, setSinopsis] = useState(initialData?.sinopsis ?? '')
  const [duracion, setDuracion] = useState(
    initialData?.duration ? String(initialData.duration) : ''
  )
  const [genero, setGenero] = useState(initialData?.genre ?? '')
  const [clasificacion, setClasificacion] = useState(initialData?.rating ?? '')
  const [estado, setEstado] = useState(initialData?.estado ?? '')
  const [posterFile, setPosterFile] = useState(null)
  const [posterUrl, setPosterUrl] = useState(initialData?.poster ?? '')
  const [preview, setPreview] = useState(initialData?.poster ?? null)

  // Sincroniza cuando initialData cambia (editar) — sincronización intencional de props a estado
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => {
    if (initialData) {
      setTitulo(initialData.title ?? '')
      setSinopsis(initialData.sinopsis ?? '')
      setDuracion(initialData.duration ? String(initialData.duration) : '')
      setGenero(initialData.genre ?? '')
      setClasificacion(initialData.rating ?? '')
      setEstado(initialData.estado ?? '')
      setPosterUrl(initialData.poster ?? '')
      setPreview(initialData.poster ?? null)
      setPosterFile(null)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }, [initialData])

  const handlePlaceholderClick = () => fileInputRef.current?.click()

  const handleFileChange = (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) return
    setPosterFile(file)
    setPosterUrl('')
    const reader = new FileReader()
    reader.onload = (e) => setPreview(e.target.result)
    reader.readAsDataURL(file)
  }

  const handleUrlChange = (event) => {
    const url = event.target.value
    setPosterUrl(url)
    if (url.trim()) {
      setPosterFile(null)
      if (fileInputRef.current) fileInputRef.current.value = ''
      setPreview(url.trim())
    } else {
      setPreview(null)
    }
  }

  const handleClearImage = () => {
    setPosterFile(null)
    setPosterUrl('')
    setPreview(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

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
      genero,
      clasificacion,
      estado,
      poster: posterFile ? posterFile.name : posterUrl.trim() || null,
      posterPreview: preview,
    }
    onSubmit?.(payload)
  }

  const isFormValid =
    titulo.trim() &&
    sinopsis.trim() &&
    duracion.trim() &&
    Number(duracion) > 0 &&
    genero &&
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
          <div
            role="button"
            tabIndex={0}
            onClick={handlePlaceholderClick}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') handlePlaceholderClick()
            }}
            className="card cursor-pointer border-2 border-dashed border-base-300 bg-base-200 transition-colors hover:border-primary"
          >
            <figure className="aspect-[2/3] overflow-hidden bg-base-200">
              {preview ? (
                <img src={preview} alt="Preview cartelera" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center gap-2 p-6 text-base-content/50">
                  <FiImage className="size-10" />
                  <p className="text-center text-sm">Click para subir imagen</p>
                  <p className="text-center text-xs">o pega una URL abajo</p>
                </div>
              )}
            </figure>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />

          <div className="mt-2">
            <label className="label text-xs text-base-content/60">o pega URL de la imagen</label>
            <div className="flex gap-2">
              <input
                type="url"
                placeholder="https://ejemplo.com/poster.jpg"
                className="input input-bordered input-sm w-full"
                value={posterUrl}
                onChange={handleUrlChange}
              />
              {preview && (
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
            <p className="mt-1 text-xs text-base-content/50">
              Solo uno: si subes archivo se borra la URL y viceversa.
            </p>
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
            <legend className="fieldset-legend">Género *</legend>
            <select
              className="select select-bordered w-full"
              value={genero}
              onChange={(e) => setGenero(e.target.value)}
              required
            >
              <option value="" disabled>
                Selecciona género
              </option>
              {generos.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
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
        <p className="text-right text-xs text-base-content/40">* Campos obligatorios. Guardado pendiente de gateway.</p>
      </div>
    </form>
  )
}

export default PeliculaForm
