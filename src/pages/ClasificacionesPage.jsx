import Layout from '../components/Layout'
import CatalogList from '../components/CatalogList'
import { useCatalogMeta } from '../context/CatalogMetaContext'

function ClasificacionesPage() {
  const { clasificaciones, addClasificacion } = useCatalogMeta()

  return (
    <Layout>
      <CatalogList
        title="Clasificaciones"
        description="Gestiona las clasificaciones (G, PG, etc.). Los cambios se aplican al instante en formularios y tablas."
        entityLabel="clasificación"
        entityType="CLASIFICACION"
        items={clasificaciones}
        onAdd={addClasificacion}
      />
    </Layout>
  )
}

export default ClasificacionesPage
