import { BrowserRouter } from 'react-router'
import AppRoutes from './routes/AppRoutes'
import { AuthProvider } from './context/AuthContext'
import { CatalogMetaProvider } from './context/CatalogMetaContext'

function App() {
  return (
    <AuthProvider>
      <CatalogMetaProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </CatalogMetaProvider>
    </AuthProvider>
  )
}

export default App
