import { useNavigate } from 'react-router'
import { FaPencilAlt, FaTrashAlt } from 'react-icons/fa'
import { MdOutlinePersonSearch } from 'react-icons/md'
import DataTable from '../components/DataTable'
import Layout from '../components/Layout'

const ROLES = ['Super Administrador', 'Administrador de Sucursal', 'Usuario']
const ESTADOS_CUENTA = ['Activa', 'Deshabilitada']

const MOCK_USERS = [
  { id: 1, email: 'admin@prueba.cl', role: 'Super Administrador', status: 'Activa' },
  { id: 2, email: 'branch@pruebas.cl', role: 'Administrador de Sucursal', status: 'Activa' },
  { id: 3, email: 'carmen.lopez@cine.cl', role: 'Administrador de Sucursal', status: 'Deshabilitada' },
  { id: 4, email: 'pedro.morales@cine.cl', role: 'Usuario', status: 'Activa' },
  { id: 5, email: 'lucia.fernandez@cine.cl', role: 'Administrador de Sucursal', status: 'Activa' },
  { id: 6, email: 'diego.salazar@cine.cl', role: 'Usuario', status: 'Deshabilitada' },
  { id: 7, email: 'valentina.rios@cine.cl', role: 'Administrador de Sucursal', status: 'Activa' },
  { id: 8, email: 'matias.espinoza@cine.cl', role: 'Super Administrador', status: 'Activa' },
  { id: 9, email: 'fernanda.guzman@cine.cl', role: 'Usuario', status: 'Deshabilitada' },
  { id: 10, email: 'andres.vargas@cine.cl', role: 'Administrador de Sucursal', status: 'Activa' },
  { id: 11, email: 'camila.reyes@cine.cl', role: 'Usuario', status: 'Activa' },
  { id: 12, email: 'sebastian.muñoz@cine.cl', role: 'Administrador de Sucursal', status: 'Activa' },
]

const COLUMNS = [
  { key: 'email', header: 'Email', searchable: true, searchPlaceholder: 'email' },
  {
    key: 'role',
    header: 'Rol',
    filterable: true,
    filterType: 'select',
    filterOptions: ROLES,
  },
  {
    key: 'status',
    header: 'Estado de cuenta',
    filterable: true,
    filterType: 'select',
    filterOptions: ESTADOS_CUENTA,
    render: (user) => (
      <span className={`badge badge-sm ${user.status === 'Activa' ? 'badge-success' : 'badge-error'}`}>
        {user.status}
      </span>
    ),
  },
]

const ACTION_ICON_CLASS = 'size-3.5'

const ACTIONS = [
  {
    label: 'Editar usuario',
    icon: <FaPencilAlt className={ACTION_ICON_CLASS} />,
    className: 'btn btn-ghost btn-xs text-info',
    onClick: (user) => console.log('Editar', user),
  },
  {
    label: 'Eliminar usuario',
    icon: <FaTrashAlt className={ACTION_ICON_CLASS} />,
    className: 'btn btn-ghost btn-xs text-error',
    onClick: (user) => console.log('Eliminar', user),
  },
  {
    label: 'Ver Usuario',
    icon: <MdOutlinePersonSearch className={ACTION_ICON_CLASS} />,
    className: 'btn btn-ghost btn-xs text-blue',
    onClick: (user) => console.log('Ver', user),
  },
]

function UsuariosPage() {
  const navigate = useNavigate()

  return (
    <Layout>
      <DataTable
        title="Usuarios"
        addLabel="Añadir Usuario"
        onAdd={() => navigate('/panel-inicio/usuarios/crear')}
        entityLabel="usuarios"
        columns={COLUMNS}
        data={MOCK_USERS}
        actions={ACTIONS}
      />
    </Layout>
  )
}

export default UsuariosPage
