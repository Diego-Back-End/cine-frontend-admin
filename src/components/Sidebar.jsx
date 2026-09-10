import { useRef } from 'react'
import { NavLink } from 'react-router'
import {
  FiAward,
  FiCalendar,
  FiFilm,
  FiGlobe,
  FiHome,
  FiLogOut,
  FiMapPin,
  FiMenu,
  FiTag,
  FiUsers,
} from 'react-icons/fi'
import { ROLES, useAuth } from '../context/AuthContext'

const ICON_CLASS = 'my-1.5 inline-block size-4'

const BRANCH_ITEMS = [
  { to: '/panel-inicio', label: 'Panel de inicio', icon: <FiHome className={ICON_CLASS} />, end: true },
  { to: '/panel-inicio/peliculas', label: 'Ver Películas', icon: <FiFilm className={ICON_CLASS} /> },
  { label: 'Funciones', icon: <FiCalendar className={ICON_CLASS} /> },
]

const SUPER_ADMIN_ITEMS = [
  { to: '/panel-inicio', label: 'Panel de inicio', icon: <FiHome className={ICON_CLASS} />, end: true },
  { divider: 'Sección Películas' },
  { to: '/panel-inicio/peliculas', label: 'Ver Películas', icon: <FiFilm className={ICON_CLASS} /> },
  { to: '/panel-inicio/generos', label: 'Géneros', icon: <FiTag className={ICON_CLASS} /> },
  { to: '/panel-inicio/clasificaciones', label: 'Clasificaciones', icon: <FiAward className={ICON_CLASS} /> },
  { divider: 'Sección Sucursales' },
  { to: '/panel-inicio/sucursales', label: 'Ver Sucursales', icon: <FiMapPin className={ICON_CLASS} /> },
  { to: '/panel-inicio/ciudades', label: 'Ciudades', icon: <FiGlobe className={ICON_CLASS} /> },
  { to: '/panel-inicio/usuarios', label: 'Usuarios', icon: <FiUsers className={ICON_CLASS} /> },
]

function Sidebar({ children }) {
  const { user, logout } = useAuth()
  const toggleRef = useRef(null)

  const items = user.role === ROLES.SUPER_ADMIN ? SUPER_ADMIN_ITEMS : BRANCH_ITEMS

  const closeMobileDrawer = () => {
    if (toggleRef.current) toggleRef.current.checked = false
  }

  const handleLogout = () => {
    closeMobileDrawer()
    logout()
  }

  return (
    <div className="drawer lg:drawer-open">
      <input ref={toggleRef} id="admin-sidebar" type="checkbox" className="drawer-toggle inline" />
      <div className="drawer-content flex min-h-screen flex-col">
        <nav className="navbar w-full bg-gray-950">
          <label
            htmlFor="admin-sidebar"
            aria-label="open sidebar"
            className="btn btn-square btn-ghost drawer-button"
          >
            <FiMenu className={ICON_CLASS} />
          </label>
          <div className="grow px-4 text-center font-semibold text-white">Cine Admin</div>
        </nav>
        <div className="grow">{children}</div>
      </div>

      <div className="drawer-side is-drawer-close:overflow-visible">
        <label htmlFor="admin-sidebar" aria-label="close sidebar" className="drawer-overlay"></label>
        <aside className="flex min-h-full flex-col bg-gray-950 is-drawer-close:w-14 is-drawer-open:w-64">
          <ul className="menu w-full grow p-2 pt-4">
            {items.map((item) =>
              item.divider ? (
                <li key={`divider-${item.divider}`} className="menu-title is-drawer-close:hidden">
                  <span className="text-xs font-semibold tracking-widest text-gray-500">{item.divider}</span>
                </li>
              ) : item.to ? (
                <li key={item.label}>
                  <NavLink
                    to={item.to}
                    end={item.end}
                    onClick={closeMobileDrawer}
                    data-tip={item.label}
                    className={({ isActive }) =>
                      `text-gray-300 hover:bg-transparent hover:text-white focus:bg-transparent focus:text-white ${isActive ? 'text-white underline decoration-2 underline-offset-[6px] decoration-white' : ''} is-drawer-close:tooltip is-drawer-close:tooltip-right`
                    }
                  >
                    {item.icon}
                    <span className="is-drawer-close:hidden">{item.label}</span>
                  </NavLink>
                </li>
              ) : (
                <li key={item.label}>
                  <button
                    type="button"
                    disabled
                    data-tip={item.label}
                    className="menu-disabled text-gray-500 opacity-60 cursor-not-allowed hover:bg-transparent is-drawer-close:tooltip is-drawer-close:tooltip-right"
                  >
                    {item.icon}
                    <span className="is-drawer-close:hidden">{item.label}</span>
                  </button>
                </li>
              )
            )}
          </ul>
          <div className="flex w-full flex-col items-center gap-2 border-t border-gray-800 p-3 is-drawer-open:flex-row is-drawer-open:gap-3">
            <div className="avatar avatar-online avatar-placeholder shrink-0">
              <div className="w-10 rounded-full bg-primary text-primary-content">
                <span className="text-sm font-semibold">{user.email.charAt(0).toUpperCase()}</span>
              </div>
            </div>
            <div className="min-w-0 grow text-center is-drawer-close:hidden is-drawer-open:text-left">
              <p className="truncate text-sm font-medium text-gray-300">{user.email}</p>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              aria-label="Cerrar sesión"
              data-tip="Cerrar sesión"
              className="btn btn-ghost btn-sm text-white tooltip tooltip-left is-drawer-close:btn-circle"
            >
              <FiLogOut className={ICON_CLASS} />
            </button>
          </div>
        </aside>
      </div>
    </div>
  )
}

export default Sidebar
