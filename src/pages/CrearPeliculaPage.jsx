import { Link } from 'react-router'
import Layout from '../components/Layout'

function CrearPeliculaPage() {
  return (
    <Layout>
      <section className="mx-auto max-w-xl space-y-4">
        <Link to="/panel-inicio/peliculas" className="link link-hover text-sm">
          ← Volver a películas
        </Link>
        <h1 className="text-2xl font-bold md:text-3xl">Añadir Película</h1>
        <p className="text-sm text-base-content/60">
          Formulario de creación de película (próximamente).
        </p>
      </section>
    </Layout>
  )
}

export default CrearPeliculaPage