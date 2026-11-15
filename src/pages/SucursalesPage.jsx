import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { FaPencilAlt } from 'react-icons/fa'
import DataTable from '../components/DataTable'
import Layout from '../components/Layout'
import { useCatalogMeta } from '../context/CatalogMetaContext'
import { ROLES, useAuth } from '../context/AuthContext'
import { catalogoApi } from '../services/catalogoApi'
import ConfirmCreateModal from '../components/ConfirmCreateModal'

const ACTION_ICON_CLASS = 'size-3.5'

function SucursalesPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { ciudades } = useCatalogMeta()
  const [sucursales, setSucursales] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [pendingSucursal, setPendingSucursal] = useState(null)
  const [nuevoAdminEmail, setNuevoAdminEmail] = useState('')

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    catalogoApi
      .getSucursales()
      .then((data) => {
        if (cancelled) return
        if (Array.isArray(data)) {
          setSucursales(data)
        }
      })
      .catch((e) => {
        if (!cancelled) setError(e.message)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const isSuperAdmin = user?.role === ROLES.SUPER_ADMIN

  const COLUMNS = [
    { key: 'nombre', header: 'Nombre', searchable: true, searchPlaceholder: 'nombre' },
    { key: 'direccion', header: 'Dirección' },
    {
      key: 'ciudad',
      header: 'Ciudad',
      filterable: true,
      filterType: 'select',
      filterOptions: ciudades,
    },
    {
      key: 'cantidadSalas',
      header: 'Salas',
      render: (branch) => <span className="badge badge-sm badge-neutral">{branch.cantidadSalas}</span>,
    },
    {
      key: 'tiposSala',
      header: 'Tipos de Sala',
      render: (branch) => <span className="badge badge-sm badge-outline">{branch.tiposSala || '—'}</span>,
    },
    {
      key: 'adminEmail',
      header: 'Administrador',
      render: (branch) => <span className="text-sm text-base-content/70">{branch.adminEmail}</span>,
    },
  ]

  const handleEditClick = (branch) => {
    setPendingSucursal(branch)
    setNuevoAdminEmail(branch.adminEmail ?? '')
    setConfirmOpen(true)
  }

  const handleConfirmEdit = async () => {
    if (!pendingSucursal || !nuevoAdminEmail.trim()) return
    try {
      await catalogoApi.updateSucursal(pendingSucursal.id, {
        nombre: pendingSucursal.nombre,
        direccion: pendingSucursal.direccion,
        ciudad: pendingSucursal.ciudad,
        cantidadSalas: pendingSucursal.cantidadSalas,
        tiposSala: pendingSucursal.tiposSala,
        adminEmail: nuevoAdminEmail.trim().toLowerCase(),
      })
    } catch (e) {
      setError(e.message || 'Error al actualizar sucursal')
      return
    }
    setConfirmOpen(false)
    setPendingSucursal(null)
    setNuevoAdminEmail('')
    // Refrescar la lista para mostrar el cambio
    catalogoApi
      .getSucursales()
      .then((data) => {
        if (Array.isArray(data)) setSucursales(data)
      })
      .catch(() => {})
  }

  const ACTIONS = [
    {
      label: 'Editar sucursal',
      icon: <FaPencilAlt className={ACTION_ICON_CLASS} />,
      className: 'btn btn-ghost btn-xs text-info',
      onClick: handleEditClick,
    },
  ]

  return (
    <Layout>
      {error && (
        <div className="alert alert-warning mb-4">
          <span>Backend no disponible — mostrando datos vacíos. Detalle: {error}</span>
        </div>
      )}
      {loading && <div className="loading loading-spinner mb-2" />}
      <DataTable
        title="Sucursales"
        addLabel="Añadir Sucursal"
        onAdd={() => {
          if (!isSuperAdmin) return
          navigate('/panel-inicio/sucursales/crear')
        }}
        entityLabel="sucursales"
        columns={COLUMNS}
        data={sucursales}
        actions={isSuperAdmin ? ACTIONS : []}
      />
      <ConfirmCreateModal
        open={confirmOpen}
        title="¿Editar sucursal?"
        entityLabel="sucursal"
        entityName={pendingSucursal?.nombre ?? ''}
        requiredPhrase={`CONFIRMAR EDICIÓN SUCURSAL ${(pendingSucursal?.nombre ?? '').trim().toUpperCase()}`}
        action="editar"
        confirmationContent={
          <>
            <fieldset className="fieldset">
              <legend className="fieldset-legend text-xs">Nuevo administrador</legend>
              <input
                type="email"
                className="input input-bordered w-full"
                placeholder="nombre-sucursal@cloudcine1596.onmicrosoft.com"
                value={nuevoAdminEmail}
                onChange={(e) => setNuevoAdminEmail(e.target.value)}
                required
                maxLength={200}
              />
              <p className="label text-xs text-base-content/50">
                Un solo administrador por sucursal.
              </p>
            </fieldset>
          </>
        }
        onClose={() => {
          setConfirmOpen(false)
          setPendingSucursal(null)
          setNuevoAdminEmail('')
        }}
        onConfirm={handleConfirmEdit}
      />
    </Layout>
  )
}

export default SucursalesPage