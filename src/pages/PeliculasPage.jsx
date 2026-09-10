import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { FaPencilAlt, FaTrashAlt } from 'react-icons/fa'
import { MdOutlinePersonSearch } from 'react-icons/md'
import DataTable from '../components/DataTable'
import Layout from '../components/Layout'
import EliminarPeliculaModal from '../components/EliminarPeliculaModal'
import { MOCK_MOVIES_FULL } from '../data/peliculasMock'
import { getPeliculaSlug } from '../utils/slugify'
import { useCatalogMeta } from '../context/CatalogMetaContext'
import { catalogoApi } from '../services/catalogoApi'

const ACTION_ICON_CLASS = 'size-3.5'

function PeliculasPage() {
  const navigate = useNavigate()
  const { generos, clasificaciones, estados } = useCatalogMeta()
  const [movies, setMovies] = useState(MOCK_MOVIES_FULL)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [peliculaAEliminar, setPeliculaAEliminar] = useState(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError('')
    catalogoApi
      .getPeliculas()
      .then((data) => {
        if (cancelled) return
        if (Array.isArray(data) && data.length > 0) {
          // Backend devuelve PeliculaResponse con campos titulo, duracion, genero, clasificacion, poster, slug
          const mapped = data.map((p) => ({
            id: p.id,
            title: p.titulo ?? p.title,
            genre: p.genero ?? p.genre ?? (p.generos?.[0] ?? ''),
            duration: p.duracion ?? p.duration ?? p.duracionMinutos,
            rating: p.clasificacion ?? p.rating,
            estado: p.estado,
            sinopsis: p.sinopsis,
            poster: p.poster ?? p.imagenUrl,
            slug: p.slug,
          }))
          setMovies(mapped)
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

  const handleConfirmDelete = async (movie) => {
    try {
      await catalogoApi.deletePelicula(movie.id)
    } catch (e) {
      console.error('DELETE backend falló, borrado local fallback', e)
    }
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
      {error && (
        <div className="alert alert-warning mb-4">
          <span>Backend no disponible en {import.meta.env.VITE_CATALOGO_API_URL || 'http://localhost:8081/api'} — mostrando mocks. Detalle: {error}</span>
        </div>
      )}
      {loading && <div className="loading loading-spinner mb-2" />}
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
