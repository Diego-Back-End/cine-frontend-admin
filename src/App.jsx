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
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </CatalogMetaProvider>
    </AuthProvider>
  )
}

export default App
