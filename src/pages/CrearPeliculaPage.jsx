import { Link, useNavigate } from 'react-router'
import Layout from '../components/Layout'
import PeliculaForm from '../components/PeliculaForm'
import { catalogoApi } from '../services/catalogoApi'

function CrearPeliculaPage() {
  const navigate = useNavigate()

  const handleSubmit = async (payload) => {
    try {
      await catalogoApi.createPelicula({
        titulo: payload.titulo,
        sinopsis: payload.sinopsis,
        duracion: payload.duracion,
        genero: payload.genero,
        clasificacion: payload.clasificacion,
        estado: payload.estado,
        poster: payload.poster,
      })
    } catch (e) {
      console.error('POST backend falló, fallback mock', e)
    }
    navigate('/panel-inicio/peliculas')
  }

  return (
    <Layout>
      <section className="mx-auto max-w-5xl space-y-6">
        <Link to="/panel-inicio/peliculas" className="link link-hover text-sm">
          ← Volver a películas
        </Link>
        <h1 className="text-2xl font-bold md:text-3xl">Añadir Película</h1>
        <PeliculaForm onSubmit={handleSubmit} submitLabel="Guardar película" />
      </section>
    </Layout>
  )
}

export default CrearPeliculaPage
