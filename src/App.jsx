import { BrowserRouter } from 'react-router'
import AppRoutes from './routes/AppRoutes'
import { AuthProvider, useAuth } from './context/AuthContext'
import { CatalogMetaProvider } from './context/CatalogMetaContext'
import { setCatalogoAuthProvider } from './services/catalogoApi'
import { useEffect } from 'react'

function CatalogoAuthBinder() {
  const { getAccessToken } = useAuth()
  useEffect(() => {
    setCatalogoAuthProvider(getAccessToken)
  }, [getAccessToken])
  return null
}

function App() {
  return (
    <AuthProvider>
      <CatalogoAuthBinder />
      <CatalogMetaProvider>
        <BrowserRouter basename={import.meta.env.BASE_URL}>
          <p
            role="note"
            className="bg-warning px-4 py-2 text-center text-xs font-medium text-warning-content md:hidden"
          >
            Esta aplicación está diseñada para escritorio. Para una mejor experiencia, utiliza un PC.
          </p>
          <AppRoutes />
        </BrowserRouter>
      </CatalogMetaProvider>
    </AuthProvider>
  )
}

export default App
