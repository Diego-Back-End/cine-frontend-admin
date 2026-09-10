import { useEffect, useState } from 'react'

const FRASE_REQUERIDA = 'ELIMINAR PELICULA'

function EliminarPeliculaModal({ pelicula, onClose, onConfirm }) {
  const [texto, setTexto] = useState('')

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => {
    setTexto('')
  }, [pelicula])

  if (!pelicula) return null

  const isValid = texto === FRASE_REQUERIDA

  const handleConfirm = () => {
    if (!isValid) return
    onConfirm?.(pelicula)
  }

  return (
    <dialog className="modal modal-open">
      <div className="modal-box">
        <h3 className="text-lg font-bold">¿Eliminar película?</h3>
        <p className="py-2 text-sm text-base-content/70">
          Estás por eliminar <span className="font-semibold">{pelicula.title}</span>. Esta acción no se
          puede deshacer y no habrá forma de recuperarla.
        </p>
        <div className="alert alert-warning my-3 py-2 text-sm">
          <span>Escribe exactamente:</span>
          <span className="font-mono font-bold">{FRASE_REQUERIDA}</span>
        </div>

        <fieldset className="fieldset">
          <legend className="fieldset-legend text-xs">Confirmación</legend>
          <input
            type="text"
            className="input input-bordered w-full"
            placeholder={FRASE_REQUERIDA}
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            autoFocus
          />
          <p className="label text-xs text-base-content/50">
            Respeta mayúsculas y el espacio entre palabras.
          </p>
        </fieldset>

        <div className="modal-action">
          <button type="button" className="btn btn-ghost" onClick={onClose}>
            Cancelar
          </button>
          <button type="button" className="btn btn-error" disabled={!isValid} onClick={handleConfirm}>
            Eliminar
          </button>
        </div>
      </div>
      <div className="modal-backdrop bg-black/40" onClick={onClose} />
    </dialog>
  )
}

export default EliminarPeliculaModal
