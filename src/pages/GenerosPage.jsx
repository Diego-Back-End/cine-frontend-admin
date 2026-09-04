import Layout from '../components/Layout'
import CatalogList from '../components/CatalogList'
import { useCatalogMeta } from '../context/CatalogMetaContext'

function GenerosPage() {
  const { generos, addGenero } = useCatalogMeta()

  return (
    <Layout>
      <CatalogList
        title="Géneros"
        description="Gestiona los géneros disponibles para las películas. Se reflejan en el formulario y filtros sin necesidad de nueva build."
        entityLabel="género"
        entityType="GENERO"
        items={generos}
        onAdd={addGenero}
      />
    </Layout>
  )
}

export default GenerosPage
