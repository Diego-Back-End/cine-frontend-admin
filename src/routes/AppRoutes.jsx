import { Route, Routes } from 'react-router'
import { ROLES } from '../context/AuthContext'
import LoginPage from '../pages/LoginPage'
import PanelInicioPage from '../pages/PanelInicioPage'
import UsuariosPage from '../pages/UsuariosPage'
import NotFoundPage from '../pages/NotFoundPage'
import ProtectedRoute from './ProtectedRoute'

const PANEL_ROLES = [ROLES.SUPER_ADMIN, ROLES.BRANCH_ADMIN]

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route element={<ProtectedRoute roles={PANEL_ROLES} />}>
        <Route path="/panel-inicio" element={<PanelInicioPage />} />
        <Route element={<ProtectedRoute roles={[ROLES.SUPER_ADMIN]} />}>
          <Route path="/panel-inicio/usuarios" element={<UsuariosPage />} />
        </Route>
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default AppRoutes
