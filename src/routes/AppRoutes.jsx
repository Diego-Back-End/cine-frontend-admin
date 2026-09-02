import { Route, Routes } from 'react-router'
import { ROLES } from '../context/AuthContext'
import LoginPage from '../pages/LoginPage'
import PanelInicioPage from '../pages/PanelInicioPage'
import PeliculasPage from '../pages/PeliculasPage'
import CrearPeliculaPage from '../pages/CrearPeliculaPage'
import SucursalesPage from '../pages/SucursalesPage'
import CrearSucursalPage from '../pages/CrearSucursalPage'
import UsuariosPage from '../pages/UsuariosPage'
import CrearUsuarioPage from '../pages/CrearUsuarioPage'
import NotFoundPage from '../pages/NotFoundPage'
import ProtectedRoute from './ProtectedRoute'

const PANEL_ROLES = [ROLES.SUPER_ADMIN, ROLES.BRANCH_ADMIN]

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route element={<ProtectedRoute roles={PANEL_ROLES} />}>
        <Route path="/panel-inicio" element={<PanelInicioPage />} />
        <Route path="/panel-inicio/peliculas" element={<PeliculasPage />} />
        <Route path="/panel-inicio/peliculas/crear" element={<CrearPeliculaPage />} />
        <Route element={<ProtectedRoute roles={[ROLES.SUPER_ADMIN]} />}>
          <Route path="/panel-inicio/sucursales" element={<SucursalesPage />} />
          <Route path="/panel-inicio/sucursales/crear" element={<CrearSucursalPage />} />
          <Route path="/panel-inicio/usuarios" element={<UsuariosPage />} />
          <Route path="/panel-inicio/usuarios/crear" element={<CrearUsuarioPage />} />
        </Route>  
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default AppRoutes