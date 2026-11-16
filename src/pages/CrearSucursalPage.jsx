import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import Layout from '../components/Layout'
import { catalogoApi } from '../services/catalogoApi'
import { useCatalogMeta } from '../context/CatalogMetaContext'
import ConfirmCreateModal from '../components/ConfirmCreateModal'

function CrearSucursalPage() {
  const navigate = useNavigate()
  const { ciudades } = useCatalogMeta()
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [pendingPayload, setPendingPayload] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Estado del formulario
  const [nombre, setNombre] = useState('')
  const [direccion, setDireccion] = useState('')
  const [ciudad, setCiudad] = useState('')
  const [cantidadSalas, setCantidadSalas] = useState('')
  const [tiposSala, setTiposSala] = useState('')
  const [adminEmail, setAdminEmail] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    setError('')
    if (!nombre.trim() || !direccion.trim() || !ciudad.trim() || !cantidadSalas || !adminEmail.trim()) {
      setError('Todos los campos son obligatorios')
      return
    }
    setPendingPayload({
      nombre: nombre.trim(),
      direccion: direccion.trim(),
      ciudad: ciudad.trim(),
      cantidadSalas: Number(cantidadSalas),
      tiposSala: tiposSala.trim(),
      adminEmail: adminEmail.trim().toLowerCase(),
    })
    setConfirmOpen(true)
  }

  const handleConfirm = async () => {
    if (!pendingPayload) return
    setLoading(true)
    try {
      await catalogoApi.createSucursal(pendingPayload)
    } catch (e) {
      setError(e.message || 'Error al crear sucursal')
      setLoading(false)
      return
    }
    setConfirmOpen(false)
    setPendingPayload(null)
    setLoading(false)
    navigate('/panel-inicio/sucursales')
  }

  const requiredPhrase = pendingPayload
    ? `CONFIRMAR CREAR SUCURSAL ${pendingPayload.nombre.trim().toUpperCase()}`
    : ''

  const isFormValid =
    nombre.trim() &&
    direccion.trim() &&
    ciudad.trim() &&
    cantidadSalas &&
    Number(cantidadSalas) > 0 &&
    adminEmail.trim()

  return (
    <Layout>
      <section className="mx-auto max-w-5xl space-y-6">
        <Link to="/panel-inicio/sucursales" className="link link-hover text-sm">
          ← Volver a sucursales
        </Link>
        <h1 className="text-2xl font-bold md:text-3xl">Añadir Sucursal</h1>

        {error && <div className="alert alert-error"><span>{error}</span></div>}
        {loading && <div className="loading loading-spinner" />}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            <fieldset className="fieldset">
              <legend className="fieldset-legend">Nombre *</legend>
              <input
                type="text"
                className="input input-bordered w-full"
                placeholder="Ej: Cine Matrix Centro"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
                maxLength={200}
              />
            </fieldset>

            <fieldset className="fieldset">
              <legend className="fieldset-legend">Dirección *</legend>
              <input
                type="text"
                className="input input-bordered w-full"
                placeholder="Ej: Av. Providencia 1234"
                value={direccion}
                onChange={(e) => setDireccion(e.target.value)}
                required
                maxLength={500}
              />
            </fieldset>
          </div>

          <div className="space-y-4 lg:col-span-1">
            <fieldset className="fieldset">
              <legend className="fieldset-legend">Ciudad *</legend>
              <select
                className="select select-bordered w-full"
                value={ciudad}
                onChange={(e) => setCiudad(e.target.value)}
                required
              >
                <option value="">Selecciona ciudad</option>
                {ciudades.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </fieldset>

            <fieldset className="fieldset">
              <legend className="fieldset-legend">Cantidad de Salas *</legend>
              <input
                type="number"
                inputMode="numeric"
                className="input input-bordered w-full"
                placeholder="Ej: 8"
                value={cantidadSalas}
                onChange={(e) => setCantidadSalas(e.target.value)}
                required
                min={1}
              />
            </fieldset>

            <fieldset className="fieldset">
              <legend className="fieldset-legend">Tipos de Sala</legend>
              <input
                type="text"
                className="input input-bordered w-full"
                placeholder="Ej: IMAX, 3D, 2D"
                value={tiposSala}
                onChange={(e) => setTiposSala(e.target.value)}
                maxLength={500}
              />
              <p className="label text-xs text-base-content/50">
                Separa por comas (ej: IMAX, 3D, 2D).
              </p>
            </fieldset>

            <fieldset className="fieldset">
              <legend className="fieldset-legend">Email Administrador de Sucursal *</legend>
              <input
                type="email"
                className="input input-bordered w-full"
                placeholder="Ej: nombre-sucursal@cloudcine1596.onmicrosoft.com"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                required
                maxLength={200}
              />
              <p className="label text-xs text-base-content/50">
                Formato: [nombre-sucursal]@cloudcine1596.onmicrosoft.com
              </p>
            </fieldset>
          </div>

          <div className="lg:col-span-3 flex justify-end gap-2 pt-2">
            <Link to="/panel-inicio/sucursales" className="btn btn-ghost">
              Cancelar
            </Link>
            <button type="submit" className="btn btn-primary" disabled={!isFormValid}>
              Guardar sucursal
            </button>
          </div>
        </form>
      </section>

      <ConfirmCreateModal
        open={confirmOpen}
        title="¿Crear sucursal?"
        entityLabel="sucursal"
        entityName={pendingPayload?.nombre ?? ''}
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

export default CrearSucursalPage