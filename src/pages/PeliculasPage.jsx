import { useState } from 'react'
import { useNavigate } from 'react-router'
import { FaPencilAlt, FaTrashAlt } from 'react-icons/fa'
import { MdOutlinePersonSearch } from 'react-icons/md'
import DataTable from '../components/DataTable'
import Layout from '../components/Layout'
import EliminarPeliculaModal from '../components/EliminarPeliculaModal'
import { MOCK_MOVIES_FULL } from '../data/peliculasMock'
import { getPeliculaSlug } from '../utils/slugify'
import { useCatalogMeta } from '../context/CatalogMetaContext'

const ACTION_ICON_CLASS = 'size-3.5'

function PeliculasPage() {
  const navigate = useNavigate()
  const { generos, clasificaciones, estados } = useCatalogMeta()
  const [movies, setMovies] = useState(MOCK_MOVIES_FULL)
  const [peliculaAEliminar, setPeliculaAEliminar] = useState(null)

  const COLUMNS = [
    { key: 'title', header: 'Título', searchable: true, searchPlaceholder: 'título' },
    {
      key: 'genre',
      header: 'Género',
      filterable: true,
      filterType: 'select',
      filterOptions: generos,
    },
    {
      key: 'duration',
      header: 'Duración',
      render: (movie) => `${movie.duration} min`,
    },
    {
      key: 'rating',
      header: 'Clasificación',
      filterable: true,
      filterType: 'select',
      filterOptions: clasificaciones,
    },
    {
      key: 'estado',
      header: 'Estado',
      filterable: true,
      filterType: 'select',
      filterOptions: estados,
    },
  ]

  const handleEdit = (movie) => {
    navigate(`/panel-inicio/peliculas/${movie.id}/editar`)
  }

  const handleDeleteClick = (movie) => {
    setPeliculaAEliminar(movie)
  }

  const handleConfirmDelete = (movie) => {
    console.log('Eliminar película (pendiente gateway DELETE /peliculas/' + movie.id + '):', movie)
    setMovies((prev) => prev.filter((m) => m.id !== movie.id))
    setPeliculaAEliminar(null)
  }

  const handleView = (movie) => {
    navigate(`/pelicula/${getPeliculaSlug(movie.title)}`)
  }

  const ACTIONS = [
    {
      label: 'Editar película',
      icon: <FaPencilAlt className={ACTION_ICON_CLASS} />,
      className: 'btn btn-ghost btn-xs text-info',
      onClick: handleEdit,
    },
    {
      label: 'Eliminar película',
      icon: <FaTrashAlt className={ACTION_ICON_CLASS} />,
      className: 'btn btn-ghost btn-xs text-error',
      onClick: handleDeleteClick,
    },
    {
      label: 'Ver película',
      icon: <MdOutlinePersonSearch className={ACTION_ICON_CLASS} />,
      className: 'btn btn-ghost btn-xs text-blue',
      onClick: handleView,
    },
  ]

  return (
    <Layout>
      <DataTable
        title="Películas"
        addLabel="Añadir Película"
        onAdd={() => navigate('/panel-inicio/peliculas/crear')}
        entityLabel="películas"
        columns={COLUMNS}
        data={movies}
        actions={ACTIONS}
      />
      <EliminarPeliculaModal
        pelicula={peliculaAEliminar}
        onClose={() => setPeliculaAEliminar(null)}
        onConfirm={handleConfirmDelete}
      />
    </Layout>
  )
}

export default PeliculasPage
