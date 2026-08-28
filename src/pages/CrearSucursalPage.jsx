import { Link } from 'react-router'
import Layout from '../components/Layout'

function CrearSucursalPage() {
  return (
    <Layout>
      <section className="mx-auto max-w-xl space-y-4">
        <Link to="/panel-inicio/sucursales" className="link link-hover text-sm">
          ← Volver a sucursales
        </Link>
        <h1 className="text-2xl font-bold md:text-3xl">Añadir Sucursal</h1>
        <p className="text-sm text-base-content/60">
          Formulario de creación de sucursal (próximamente).
        </p>
      </section>
    </Layout>
  )
}

export default CrearSucursalPage