import { useEffect, useState } from 'react'

function ConfirmCreateModal({ open, title, entityLabel, entityName, requiredPhrase, onClose, onConfirm }) {
  const [texto, setTexto] = useState('')

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => {
    if (open) setTexto('')
  }, [open, entityName])

  if (!open) return null

  const isValid = texto === requiredPhrase

  return (
    <dialog className="modal modal-open">
      <div className="modal-box">
        <h3 className="text-lg font-bold">{title}</h3>
        <p className="py-2 text-sm text-base-content/70">
          Estás por crear <span className="font-semibold">{entityLabel} &quot;{entityName}&quot;</span>.
          Esta acción es importante y no es reversible (no se podrá eliminar).
        </p>
        <div className="alert alert-warning my-3 py-2 text-sm">
          <span>Escribe exactamente:</span>
          <span className="font-mono font-bold">{requiredPhrase}</span>
        </div>

        <fieldset className="fieldset">
          <legend className="fieldset-legend text-xs">Confirmación</legend>
          <input
            type="text"
            className="input input-bordered w-full"
            placeholder={requiredPhrase}
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            autoFocus
          />
          <p className="label text-xs text-base-content/50">Respeta mayúsculas y espacios.</p>
        </fieldset>

        <div className="modal-action">
          <button type="button" className="btn btn-ghost" onClick={onClose}>
            Cancelar
          </button>
          <button type="button" className="btn btn-primary" disabled={!isValid} onClick={onConfirm}>
            Confirmar creación
          </button>
        </div>
      </div>
      <div className="modal-backdrop bg-black/40" onClick={onClose} />
    </dialog>
  )
}

export default ConfirmCreateModal
