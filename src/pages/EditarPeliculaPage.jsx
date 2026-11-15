import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import Layout from '../components/Layout'
import PeliculaForm from '../components/PeliculaForm'
import { getPeliculaById } from '../data/peliculasMock'
import { catalogoApi } from '../services/catalogoApi'
import ConfirmCreateModal from '../components/ConfirmCreateModal'

function EditarPeliculaPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [pelicula, setPelicula] = useState(() => getPeliculaById(id))
  const [loading, setLoading] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [pendingPayload, setPendingPayload] = useState(null)

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
          generos: data.generos ?? (data.genre ? [data.genre] : []),
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

  const handleSubmit = (payload) => {
    setPendingPayload(payload)
    setConfirmOpen(true)
  }

  const handleConfirm = async () => {
    if (!pendingPayload) return
    try {
      await catalogoApi.updatePelicula(id, {
        titulo: pendingPayload.titulo,
        sinopsis: pendingPayload.sinopsis,
        duracion: pendingPayload.duracion,
        generos: pendingPayload.generosSeleccionados,
        clasificacion: pendingPayload.clasificacion,
        estado: pendingPayload.estado,
        poster: pendingPayload.poster,
      })
    } catch (e) {
      console.error('PUT backend falló, fallback mock', e)
    }
    setConfirmOpen(false)
    setPendingPayload(null)
    navigate('/panel-inicio/peliculas')
  }

  const requiredPhrase = pendingPayload
    ? `EDITAR PELÍCULA ${pendingPayload.titulo.trim().toUpperCase()}`
    : ''

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

        <PeliculaForm
          initialData={pelicula}
          onSubmit={handleSubmit}
          submitLabel="Actualizar película"
        />
      </section>

      <ConfirmCreateModal
        open={confirmOpen}
        title="¿Editar película?"
        entityLabel="película"
        entityName={pendingPayload?.titulo ?? pelicula.title}
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

export default EditarPeliculaPage
