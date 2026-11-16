import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import Layout from '../components/Layout'
import { catalogoApi } from '../services/catalogoApi'
import ConfirmCreateModal from '../components/ConfirmCreateModal'

function EditarSucursalPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [sucursal, setSucursal] = useState(null)
  const [loading, setLoading] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [pendingPayload, setPendingPayload] = useState(null)
  const [error, setError] = useState('')

  const [adminEmail, setAdminEmail] = useState('')

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    catalogoApi
      .getSucursalById(id)
      .then((data) => {
        if (cancelled) return
        setSucursal(data)
        setAdminEmail(data.adminEmail ?? '')
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [id])

  const handleSubmit = (event) => {
    event.preventDefault()
    setError('')
    if (!adminEmail.trim()) {
      setError('El email del administrador es obligatorio')
      return
    }
    setPendingPayload({ adminEmail: adminEmail.trim().toLowerCase() })
    setConfirmOpen(true)
  }

  const handleConfirm = async () => {
    if (!pendingPayload) return
    setLoading(true)
    try {
      await catalogoApi.updateSucursal(id, pendingPayload)
    } catch (e) {
      setError(e.message || 'Error al actualizar sucursal')
      setLoading(false)
      return
    }
    setConfirmOpen(false)
    setPendingPayload(null)
    setLoading(false)
    navigate('/panel-inicio/sucursales')
  }

  const requiredPhrase = pendingPayload
    ? `CONFIRMAR EDICIÓN SUCURSAL ${(sucursal?.nombre ?? '').trim().toUpperCase()}`
    : ''

  if (!sucursal) {
    return (
      <Layout>
        <section className="mx-auto max-w-5xl space-y-4">
          <Link to="/panel-inicio/sucursales" className="link link-hover text-sm">
            ← Volver a sucursales
          </Link>
          <div className="alert alert-error">
            <span>Sucursal no encontrada (id: {id}).</span>
          </div>
        </section>
      </Layout>
    )
  }

  if (loading && !sucursal) {
    return (
      <Layout>
        <section className="mx-auto max-w-5xl space-y-4">
          <div className="loading loading-spinner" />
        </section>
      </Layout>
    )
  }

  return (
    <Layout>
      <section className="mx-auto max-w-5xl space-y-6">
        <Link to="/panel-inicio/sucursales" className="link link-hover text-sm">
          ← Volver a sucursales
        </Link>
        <h1 className="text-2xl font-bold md:text-3xl">Editar Sucursal</h1>
        <p className="text-sm text-base-content/60">
          Editando <span className="font-semibold">{sucursal.nombre}</span>. Solo se puede modificar el administrador.
        </p>

        {error && <div className="alert alert-error"><span>{error}</span></div>}
        {loading && <div className="loading loading-spinner" />}

        <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Nombre</legend>
            <input
              type="text"
              className="input input-bordered w-full"
              value={sucursal.nombre}
              disabled
              readOnly
            />
          </fieldset>

          <fieldset className="fieldset">
            <legend className="fieldset-legend">Email Administrador *</legend>
            <input
              type="email"
              className="input input-bordered w-full"
              placeholder="nombre-sucursal@cloudcine1596.onmicrosoft.com"
              value={adminEmail}
              onChange={(e) => setAdminEmail(e.target.value)}
              required
              maxLength={200}
            />
            <p className="label text-xs text-base-content/50">
              Un solo administrador por sucursal.
            </p>
          </fieldset>

          <div className="flex justify-end gap-2 pt-2">
            <Link to="/panel-inicio/sucursales" className="btn btn-ghost">
              Cancelar
            </Link>
            <button type="submit" className="btn btn-primary">
              Guardar cambios
            </button>
          </div>
        </form>
      </section>

      <ConfirmCreateModal
        open={confirmOpen}
        title="¿Editar sucursal?"
        entityLabel="sucursal"
        entityName={sucursal.nombre}
        requiredPhrase={requiredPhrase}
        action="editar"
        onClose={() => {
          setConfirmOpen(false)
          setPendingPayload(null)
        }}
        onConfirm={handleConfirm}
      />
    </Layout>
  )
}

export default EditarSucursalPage