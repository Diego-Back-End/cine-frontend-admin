import { Link, useNavigate } from 'react-router'
import { useState } from 'react'
import Layout from '../components/Layout'
import PeliculaForm from '../components/PeliculaForm'
import { catalogoApi } from '../services/catalogoApi'
import ConfirmCreateModal from '../components/ConfirmCreateModal'

function CrearPeliculaPage() {
  const navigate = useNavigate()
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [pendingPayload, setPendingPayload] = useState(null)

  const handleSubmit = (payload) => {
    setPendingPayload(payload)
    setConfirmOpen(true)
  }

  const handleConfirm = async () => {
    if (!pendingPayload) return
    try {
      await catalogoApi.createPelicula({
        titulo: pendingPayload.titulo,
        sinopsis: pendingPayload.sinopsis,
        duracion: pendingPayload.duracion,
        generos: pendingPayload.generosSeleccionados,
        clasificacion: pendingPayload.clasificacion,
        estado: pendingPayload.estado,
        poster: pendingPayload.poster,
      })
    } catch (e) {
      console.error('POST backend falló, fallback mock', e)
    }
    setConfirmOpen(false)
    setPendingPayload(null)
    navigate('/panel-inicio/peliculas')
  }

  const requiredPhrase = pendingPayload
    ? `CREAR PELÍCULA ${pendingPayload.titulo.trim().toUpperCase()}`
    : ''

  return (
    <Layout>
      <section className="mx-auto max-w-5xl space-y-6">
        <Link to="/panel-inicio/peliculas" className="link link-hover text-sm">
          ← Volver a películas
        </Link>
        <h1 className="text-2xl font-bold md:text-3xl">Añadir Película</h1>
        <PeliculaForm onSubmit={handleSubmit} submitLabel="Guardar película" />
      </section>

      <ConfirmCreateModal
        open={confirmOpen}
        title="¿Crear película?"
        entityLabel="película"
        entityName={pendingPayload?.titulo ?? ''}
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

export default CrearPeliculaPage
