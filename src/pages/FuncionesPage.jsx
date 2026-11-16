import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import DataTable from '../components/DataTable'
import Layout from '../components/Layout'
import { ROLES, useAuth } from '../context/AuthContext'
import { catalogoApi } from '../services/catalogoApi'

function FuncionesPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [funciones, setFunciones] = useState([])
  const [sucursalId, setSucursalId] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    catalogoApi
      .getSucursales()
      .then((data) => {
        if (cancelled) return
        if (Array.isArray(data) && data.length > 0 && user) {
          const sucursal = data.find((s) => s.adminEmail?.toLowerCase() === user.email?.toLowerCase())
          if (sucursal) {
            setSucursalId(sucursal.id)
            return catalogoApi.getFunciones({ sucursalId: sucursal.id })
          }
          setError('No se encontró una sucursal asociada a tu usuario.')
          setLoading(false)
          return
        }
        setLoading(false)
      })
      .then((data) => {
        if (cancelled) return
        if (data && Array.isArray(data)) {
          setFunciones(data)
        }
      })
      .catch((e) => {
        if (!cancelled) setError(e.message)
        setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [user])

  const COLUMNS = [
    {
      key: 'peliculaTitulo',
      header: 'Película',
      render: (f) => <span className="font-medium">{f.peliculaTitulo || '—'}</span>,
    },
    {
      key: 'salaId',
      header: 'Sala',
      render: (f) => <span className="badge badge-sm badge-neutral">Sala {f.salaId}</span>,
    },
    {
      key: 'fechaHora',
      header: 'Fecha y Hora',
      render: (f) => {
        const d = new Date(f.fechaHora)
        return d.toLocaleString('es-CL', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
      },
    },
    {
      key: 'formato',
      header: 'Formato',
      render: (f) => <span className="badge badge-sm badge-outline">{f.formato}</span>,
    },
    {
      key: 'idioma',
      header: 'Idioma',
      render: (f) => <span className="badge badge-sm badge-outline">{f.idioma}</span>,
    },
  ]

  return (
    <Layout>
      <section className="space-y-6">
        <h1 className="text-2xl font-bold md:text-3xl">Funciones de Mi Sucursal</h1>

        {sucursalId === null && loading ? (
          <div className="loading loading-spinner" />
        ) : (
          <>
            {sucursalId === null && !loading && error && (
              <div className="alert alert-error"><span>{error}</span></div>
            )}
            <DataTable
              title="Funciones Programadas"
              addLabel="Añadir Función"
              onAdd={() => {
                if (!sucursalId) return
                navigate(`/panel-inicio/funciones/crear?sucursalId=${sucursalId}`)
              }}
              entityLabel="funciones"
              columns={COLUMNS}
              data={funciones}
              actions={[]}
            />
          </>
        )}
      </section>
    </Layout>
  )
}

export default FuncionesPage