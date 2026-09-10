import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import Layout from '../components/Layout'
import PeliculaForm from '../components/PeliculaForm'
import { getPeliculaById } from '../data/peliculasMock'
import { catalogoApi } from '../services/catalogoApi'

function EditarPeliculaPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [pelicula, setPelicula] = useState(() => getPeliculaById(id))
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    catalogoApi
      .getPeliculaById(id)
      .then((data) => {
        if (cancelled) return
        const mapped = {
          id: data.id,
          title: data.titulo ?? data.title,
          genre: data.genero ?? data.genre ?? (data.generos?.[0] ?? ''),
          duration: data.duracion ?? data.duration ?? data.duracionMinutos,
          rating: data.clasificacion ?? data.rating,
          estado: data.estado,
          sinopsis: data.sinopsis,
          poster: data.poster ?? data.imagenUrl,
        }
        setPelicula(mapped)
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [id])

  if (!pelicula) {
    return (
      <Layout>
        <section className="mx-auto max-w-5xl space-y-4">
          <Link to="/panel-inicio/peliculas" className="link link-hover text-sm">
            ← Volver a películas
          </Link>
          <div className="alert alert-error">
            <span>Película no encontrada (id: {id}).</span>
          </div>
        </section>
      </Layout>
    )
  }

  const handleSubmit = async (payload) => {
    try {
      await catalogoApi.updatePelicula(id, {
        titulo: payload.titulo,
        sinopsis: payload.sinopsis,
        duracion: payload.duracion,
        genero: payload.genero,
        clasificacion: payload.clasificacion,
        estado: payload.estado,
        poster: payload.poster,
      })
    } catch (e) {
      console.error('PUT backend falló, fallback mock', e)
    }
    navigate('/panel-inicio/peliculas')
  }

  if (loading && !pelicula) {
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
        <Link to="/panel-inicio/peliculas" className="link link-hover text-sm">
          ← Volver a películas
        </Link>
        <h1 className="text-2xl font-bold md:text-3xl">Editar Película</h1>
        <p className="text-sm text-base-content/60">
          Editando <span className="font-semibold">{pelicula.title}</span>. Modifica los campos y guarda.
        </p>

        <PeliculaForm initialData={pelicula} onSubmit={handleSubmit} submitLabel="Actualizar película" />
      </section>
    </Layout>
  )
}

export default EditarPeliculaPage
