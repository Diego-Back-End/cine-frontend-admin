import Layout from '../components/Layout'
import CatalogList from '../components/CatalogList'
import { useCatalogMeta } from '../context/CatalogMetaContext'

function CiudadesPage() {
  const { ciudades, addCiudad } = useCatalogMeta()

  return (
    <Layout>
      <CatalogList
        title="Ciudades"
        description="Gestiona las ciudades donde operan las sucursales. Se usan en filtros de sucursales y futuros formularios."
        entityLabel="ciudad"
        entityType="CIUDAD"
        items={ciudades}
        onAdd={addCiudad}
      />
    </Layout>
  )
}

export default CiudadesPage
