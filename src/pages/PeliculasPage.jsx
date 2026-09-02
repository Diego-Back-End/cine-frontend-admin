import { useNavigate } from 'react-router'
import { FaPencilAlt, FaTrashAlt } from 'react-icons/fa'
import { MdOutlinePersonSearch } from 'react-icons/md'
import DataTable from '../components/DataTable'
import Layout from '../components/Layout'

const MOCK_MOVIES = [
  { id: 1, title: 'Dune: Parte Dos', genre: 'Ciencia Ficción', duration: '166 min', rating: 'TE-14' },
  { id: 2, title: 'Oppenheimer', genre: 'Drama', duration: '180 min', rating: 'TE-14' },
  { id: 3, title: 'Barbie', genre: 'Comedia', duration: '114 min', rating: 'TE-7' },
  { id: 4, title: 'The Batman', genre: 'Acción', duration: '176 min', rating: 'TE-14' },
  { id: 5, title: 'Spider-Man: Across the Spider-Verse', genre: 'Animación', duration: '140 min', rating: 'TE-7' },
  { id: 6, title: 'John Wick 4', genre: 'Acción', duration: '169 min', rating: 'MA-18' },
  { id: 7, title: 'Elementos', genre: 'Animación', duration: '103 min', rating: 'TE' },
  { id: 8, title: 'Misión: Imposible - Sentencia mortal', genre: 'Acción', duration: '163 min', rating: 'TE-14' },
  { id: 9, title: 'La Sirenita', genre: 'Fantasía', duration: '135 min', rating: 'TE' },
  { id: 10, title: 'Guardianes de la Galaxia Vol. 3', genre: 'Ciencia Ficción', duration: '150 min', rating: 'TE-14' },
  { id: 11, title: 'Flash', genre: 'Acción', duration: '144 min', rating: 'TE-14' },
  { id: 12, title: 'Tortugas Ninja: Caos Mutante', genre: 'Animación', duration: '100 min', rating: 'TE-7' },
]

const COLUMNS = [
  { key: 'title', header: 'Título', searchable: true, searchPlaceholder: 'título' },
  { key: 'genre', header: 'Género', searchable: true, searchPlaceholder: 'género' },
  { key: 'duration', header: 'Duración' },
  {
    key: 'rating',
    header: 'Clasificación',
    searchable: true,
    searchPlaceholder: 'clasificación',
    render: (movie) => <span className="badge badge-sm badge-neutral">{movie.rating}</span>,
  },
]

const ACTION_ICON_CLASS = 'size-3.5'

const ACTIONS = [
  {
    label: 'Editar película',
    icon: <FaPencilAlt className={ACTION_ICON_CLASS} />,
    className: 'btn btn-ghost btn-xs text-info',
    onClick: (movie) => console.log('Editar', movie),
  },
  {
    label: 'Eliminar película',
    icon: <FaTrashAlt className={ACTION_ICON_CLASS} />,
    className: 'btn btn-ghost btn-xs text-error',
    onClick: (movie) => console.log('Eliminar', movie),
  },
  {
    label: 'Ver película',
    icon: <MdOutlinePersonSearch className={ACTION_ICON_CLASS} />,
    className: 'btn btn-ghost btn-xs text-blue',
    onClick: (movie) => console.log('Ver', movie),
  },
]

function PeliculasPage() {
  const navigate = useNavigate()

  return (
    <Layout>
      <DataTable
        title="Películas"
        addLabel="Añadir Película"
        onAdd={() => navigate('/panel-inicio/peliculas/crear')}
        entityLabel="películas"
        columns={COLUMNS}
        data={MOCK_MOVIES}
        actions={ACTIONS}
      />
    </Layout>
  )
}

export default PeliculasPage