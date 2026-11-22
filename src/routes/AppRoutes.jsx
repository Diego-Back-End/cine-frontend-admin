import { Route, Routes, Navigate } from 'react-router'
import { ROLES } from '../context/AuthContext'
import LoginPage from '../pages/LoginPage'
import PanelInicioPage from '../pages/PanelInicioPage'
import PeliculasPage from '../pages/PeliculasPage'
import CrearPeliculaPage from '../pages/CrearPeliculaPage'
import EditarPeliculaPage from '../pages/EditarPeliculaPage'
import VerPeliculaPage from '../pages/VerPeliculaPage'
import SucursalesPage from '../pages/SucursalesPage'
import CrearSucursalPage from '../pages/CrearSucursalPage'
import EditarSucursalPage from '../pages/EditarSucursalPage'
import FuncionesPage from '../pages/FuncionesPage'
import CrearFuncionPage from '../pages/CrearFuncionPage'
import GenerosPage from '../pages/GenerosPage'
import ClasificacionesPage from '../pages/ClasificacionesPage'
import CiudadesPage from '../pages/CiudadesPage'
import VentasPage from '../pages/VentasPage'
import NotFoundPage from '../pages/NotFoundPage'
import ProtectedRoute from './ProtectedRoute'

const PANEL_ROLES = [ROLES.SUPER_ADMIN, ROLES.BRANCH_ADMIN]

function AppRoutes() {
  return (
    <Routes>
      {/* Rutas públicas de acceso e inicio de sesión */}
      <Route path="/" element={<LoginPage />} />
      <Route path="/login" element={<LoginPage />} />

      {/* Rutas protegidas */}
      <Route element={<ProtectedRoute roles={PANEL_ROLES} />}>
        <Route path="/panel-inicio" element={<PanelInicioPage />} />
        <Route path="/ventas" element={<VentasPage />} />
        <Route path="/panel-inicio/peliculas" element={<PeliculasPage />} />
        <Route path="/panel-inicio/peliculas/crear" element={<CrearPeliculaPage />} />
        <Route path="/panel-inicio/peliculas/:id/editar" element={<EditarPeliculaPage />} />
        <Route path="/pelicula/:slug" element={<VerPeliculaPage />} />
        <Route path="/panel-inicio/funciones" element={<FuncionesPage />} />
        <Route path="/panel-inicio/funciones/crear" element={<CrearFuncionPage />} />
        <Route element={<ProtectedRoute roles={[ROLES.SUPER_ADMIN]} />}>
          <Route path="/panel-inicio/sucursales" element={<SucursalesPage />} />
          <Route path="/panel-inicio/sucursales/crear" element={<CrearSucursalPage />} />
          <Route path="/panel-inicio/sucursales/:id/editar" element={<EditarSucursalPage />} />
          <Route path="/panel-inicio/generos" element={<GenerosPage />} />
          <Route path="/panel-inicio/clasificaciones" element={<ClasificacionesPage />} />
          <Route path="/panel-inicio/ciudades" element={<CiudadesPage />} />
        </Route>
      </Route>

      {/* Página 404 para rutas desconocidas */}
      <Route path="/404" element={<NotFoundPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default AppRoutes