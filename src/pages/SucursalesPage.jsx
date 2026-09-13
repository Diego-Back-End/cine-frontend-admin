import { useNavigate } from 'react-router'
import { FaPencilAlt, FaTrashAlt } from 'react-icons/fa'
import DataTable from '../components/DataTable'
import Layout from '../components/Layout'
import { useCatalogMeta } from '../context/CatalogMetaContext'

const MOCK_BRANCHES_BASE = [
  { id: 1, name: 'Cine Matrix Alto Las Condes', address: 'Av. Pdte. Kennedy 9001, Las Condes', city: 'Santiago', rooms: 8 },
  { id: 2, name: 'Cine Matrix Mall Plaza Norte', address: 'Av. Américo Vespucio 1737, Huechuraba', city: 'Santiago', rooms: 10 },
  { id: 3, name: 'Cine Matrix Arauco Maipú', address: 'Av. Américo Vespucio 399, Maipú', city: 'Santiago', rooms: 9 },
  { id: 4, name: 'Cine Matrix Plaza Vespucio', address: 'Av. Vicuña Mackenna 7110, La Florida', city: 'Santiago', rooms: 11 },
  { id: 5, name: 'Cine Matrix Marina Arauco', address: 'Av. Libertad 1350, Viña del Mar', city: 'Viña del Mar', rooms: 9 },
  { id: 6, name: 'Cine Matrix Marina de las Cruces', address: 'Av. Borgoño 13999, La Cruz', city: 'Viña del Mar', rooms: 5 },
  { id: 7, name: 'Cine Matrix Costanera', address: 'Av. Andrés Bello 2425, Providencia', city: 'Santiago', rooms: 12 },
  { id: 8, name: 'Cine Matrix Portal Ñuñoa', address: 'Av. Irarrázaval 3773, Ñuñoa', city: 'Santiago', rooms: 7 },
]

const ACTION_ICON_CLASS = 'size-3.5'

const ACTIONS = [
  {
    label: 'Editar sucursal',
    icon: <FaPencilAlt className={ACTION_ICON_CLASS} />,
    className: 'btn btn-ghost btn-xs text-info',
    onClick: (branch) => console.log('Editar', branch),
  },
  {
    label: 'Eliminar sucursal',
    icon: <FaTrashAlt className={ACTION_ICON_CLASS} />,
    className: 'btn btn-ghost btn-xs text-error',
    onClick: (branch) => console.log('Eliminar', branch),
  },
]

function SucursalesPage() {
  const navigate = useNavigate()
  const { ciudades } = useCatalogMeta()

  const COLUMNS = [
    { key: 'name', header: 'Nombre', searchable: true, searchPlaceholder: 'nombre' },
    { key: 'address', header: 'Dirección' },
    {
      key: 'city',
      header: 'Ciudad',
      filterable: true,
      filterType: 'select',
      filterOptions: ciudades,
    },
    {
      key: 'rooms',
      header: 'Salas',
      render: (branch) => <span className="badge badge-sm badge-neutral">{branch.rooms}</span>,
    },
  ]

  return (
    <Layout>
      <DataTable
        title="Sucursales"
        addLabel="Añadir Sucursal"
        onAdd={() => navigate('/panel-inicio/sucursales/crear')}
        entityLabel="sucursales"
        columns={COLUMNS}
        data={MOCK_BRANCHES_BASE}
        actions={ACTIONS}
      />
    </Layout>
  )
}

export default SucursalesPage
