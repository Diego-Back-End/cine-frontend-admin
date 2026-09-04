import { Link, useNavigate, useParams } from 'react-router'
import Layout from '../components/Layout'
import PeliculaForm from '../components/PeliculaForm'
import { getPeliculaById } from '../data/peliculasMock'

function EditarPeliculaPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const pelicula = getPeliculaById(id)

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

  const handleSubmit = (payload) => {
    console.log('Actualizar película (pendiente gateway PUT /peliculas/' + id + '):', payload)
    navigate('/panel-inicio/peliculas')
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
