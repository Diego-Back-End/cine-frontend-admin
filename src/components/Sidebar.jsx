import { useRef } from 'react'
import { NavLink } from 'react-router'
import {
  FiBarChart2,
  FiCalendar,
  FiFilm,
  FiHome,
  FiLogOut,
  FiMapPin,
  FiMenu,
  FiUsers,
} from 'react-icons/fi'
import { ROLES, useAuth } from '../context/AuthContext'

const ICON_CLASS = 'my-1.5 inline-block size-4'

const BASE_ITEMS = [
  { to: '/panel-inicio', label: 'Panel de inicio', icon: <FiHome className={ICON_CLASS} /> },
  { label: 'Películas', icon: <FiFilm className={ICON_CLASS} /> },
  { label: 'Funciones', icon: <FiCalendar className={ICON_CLASS} /> },
]

const SUPER_ADMIN_ITEMS = [
  { label: 'Reportes', icon: <FiBarChart2 className={ICON_CLASS} /> },
  { label: 'Sucursales', icon: <FiMapPin className={ICON_CLASS} /> },
  { label: 'Usuarios', icon: <FiUsers className={ICON_CLASS} /> },
]

function Sidebar({ children }) {
  const { user, logout } = useAuth()
  const toggleRef = useRef(null)

  const items =
    user.role === ROLES.SUPER_ADMIN ? [...BASE_ITEMS, ...SUPER_ADMIN_ITEMS] : BASE_ITEMS

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
        <nav className="navbar w-full bg-base-300">
          <label
            htmlFor="admin-sidebar"
            aria-label="open sidebar"
            className="btn btn-square btn-ghost drawer-button"
          >
            <FiMenu className={ICON_CLASS} />
          </label>
          <div className="grow px-4 text-center font-semibold">Cine Admin</div>
        </nav>
        <div className="grow">{children}</div>
      </div>

      <div className="drawer-side is-drawer-close:overflow-visible">
        <label htmlFor="admin-sidebar" aria-label="close sidebar" className="drawer-overlay"></label>
        <aside className="flex min-h-full flex-col bg-base-200 is-drawer-close:w-14 is-drawer-open:w-64">
          <ul className="menu w-full grow p-2 pt-4">
            {items.map((item) => (
              <li key={item.label}>
                {item.to ? (
                  <NavLink
                    to={item.to}
                    onClick={closeMobileDrawer}
                    data-tip={item.label}
                    className={({ isActive }) =>
                      `${isActive ? 'menu-active ' : ''}is-drawer-close:tooltip is-drawer-close:tooltip-right`
                    }
                  >
                    {item.icon}
                    <span className="is-drawer-close:hidden">{item.label}</span>
                  </NavLink>
                ) : (
                  <button
                    type="button"
                    disabled
                    data-tip={item.label}
                    className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                  >
                    {item.icon}
                    <span className="is-drawer-close:hidden">{item.label}</span>
                  </button>
                )}
              </li>
            ))}
          </ul>
          <div className="flex w-full flex-col items-center gap-2 border-t border-base-300 p-3 is-drawer-open:flex-row is-drawer-open:gap-3">
            <div className="avatar avatar-online avatar-placeholder shrink-0">
              <div className="w-10 rounded-full bg-primary text-primary-content">
                <span className="text-sm font-semibold">{user.email.charAt(0).toUpperCase()}</span>
              </div>
            </div>
            <div className="min-w-0 grow text-center is-drawer-close:hidden is-drawer-open:text-left">
              <p className="truncate text-sm font-medium">{user.email}</p>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              aria-label="Cerrar sesión"
              data-tip="Cerrar sesión"
              className="btn btn-ghost btn-sm tooltip tooltip-left is-drawer-close:btn-circle"
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
