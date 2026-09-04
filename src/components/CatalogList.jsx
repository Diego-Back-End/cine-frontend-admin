import { useState } from 'react'
import ConfirmCreateModal from './ConfirmCreateModal'

function CatalogList({ title, description, entityLabel, entityType, items, onAdd }) {
  const [inputValue, setInputValue] = useState('')
  const [pendingName, setPendingName] = useState('')
  const [error, setError] = useState('')

  const normalizedInput = inputValue.trim()
  const isDuplicate =
    normalizedInput && items.some((x) => x.toLowerCase() === normalizedInput.toLowerCase())

  const handleAddClick = () => {
    setError('')
    if (!normalizedInput) {
      setError('El nombre no puede estar vacío.')
      return
    }
    if (isDuplicate) {
      setError(`"${normalizedInput}" ya existe.`)
      return
    }
    setPendingName(normalizedInput)
  }

  const requiredPhrase = pendingName ? `CREAR ${entityType} ${pendingName}` : ''

  const handleConfirm = () => {
    const ok = onAdd?.(pendingName)
    if (ok) {
      setInputValue('')
      setPendingName('')
      setError('')
    } else {
      setError('No se pudo agregar. Puede que ya exista.')
      setPendingName('')
    }
  }

  const handleCloseModal = () => {
    setPendingName('')
  }

  return (
    <section className="mx-auto max-w-3xl space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold md:text-3xl">{title}</h1>
        {description && <p className="text-sm text-base-content/60">{description}</p>}
        <p className="text-xs text-base-content/40">
          Los cambios se guardan en localStorage y se reflejan sin nueva build. No se permite eliminar.
        </p>
      </header>

      <div className="card card-border border-base-300 bg-base-100 shadow-sm">
        <div className="card-body gap-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
            <fieldset className="fieldset flex-1">
              <legend className="fieldset-legend">Nuevo {entityLabel}</legend>
              <input
                type="text"
                className="input input-bordered w-full"
                placeholder={`Ej: ${items[0] ?? 'Nuevo'}`}
                value={inputValue}
                onChange={(e) => {
                  setInputValue(e.target.value)
                  setError('')
                }}
                maxLength={40}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAddClick()
                }}
              />
              {error && <p className="label text-xs text-error">{error}</p>}
              {isDuplicate && !error && (
                <p className="label text-xs text-warning">Ya existe ese {entityLabel}.</p>
              )}
            </fieldset>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleAddClick}
              disabled={!normalizedInput || isDuplicate}
            >
              Añadir {entityLabel}
            </button>
          </div>
        </div>
      </div>

      <div className="card card-border border-base-300 bg-base-100">
        <div className="card-body p-0">
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr className="bg-base-200">
                  <th>#</th>
                  <th>{entityLabel.charAt(0).toUpperCase() + entityLabel.slice(1)}</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, idx) => (
                  <tr key={item} className="hover">
                    <td className="text-base-content/50">{idx + 1}</td>
                    <td className="font-medium">{item}</td>
                  </tr>
                ))}
                {items.length === 0 && (
                  <tr>
                    <td colSpan={2} className="py-8 text-center text-base-content/50">
                      No hay {entityLabel}s registrados.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="p-4 text-right text-xs text-base-content/40">
            Total: {items.length} {entityLabel}s
          </div>
        </div>
      </div>

      <ConfirmCreateModal
        open={Boolean(pendingName)}
        title={`¿Crear ${entityLabel}?`}
        entityLabel={entityLabel}
        entityName={pendingName}
        requiredPhrase={requiredPhrase}
        onClose={handleCloseModal}
        onConfirm={handleConfirm}
      />
    </section>
  )
}

export default CatalogList
