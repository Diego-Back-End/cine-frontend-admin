import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router'
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
  FiUser,
  FiX,
} from 'react-icons/fi'
import { ROLES, useAuth } from '../context/AuthContext'
import { catalogoApi } from '../services/catalogoApi'

const ICON_CLASS = 'inline-block size-4'

const SECCIONES_SUPER_ADMIN = [
  {
    label: 'Sección Películas',
    items: [
      { to: '/panel-inicio/peliculas', label: 'Ver Películas', icon: <FiFilm className={ICON_CLASS} /> },
      { to: '/panel-inicio/generos', label: 'Géneros', icon: <FiTag className={ICON_CLASS} /> },
      { to: '/panel-inicio/clasificaciones', label: 'Clasificaciones', icon: <FiAward className={ICON_CLASS} /> },
    ],
  },
  {
    label: 'Sección Sucursales',
    items: [
      { to: '/panel-inicio/sucursales', label: 'Ver Sucursales', icon: <FiMapPin className={ICON_CLASS} /> },
      { to: '/panel-inicio/ciudades', label: 'Ciudades', icon: <FiGlobe className={ICON_CLASS} /> },
    ],
  },
]

const SECCIONES_BRANCH_ADMIN = [
  {
    label: 'Sección Películas',
    items: [
      { to: '/panel-inicio/peliculas', label: 'Ver Películas', icon: <FiFilm className={ICON_CLASS} /> },
      { to: '/panel-inicio/funciones', label: 'Funciones', icon: <FiCalendar className={ICON_CLASS} /> },
    ],
  },
]

const ACTIVE_CLASS = 'text-white underline decoration-2 underline-offset-[6px] decoration-white'

function Navbar() {
  const { user, logout } = useAuth()
  const location = useLocation()
  const navRef = useRef(null)
  const [menuMovilAbierto, setMenuMovilAbierto] = useState(false)
  const [sucursal, setSucursal] = useState('')

  const esSuperAdmin = user.role === ROLES.SUPER_ADMIN
  const secciones = esSuperAdmin ? SECCIONES_SUPER_ADMIN : SECCIONES_BRANCH_ADMIN
  const sucursalTexto = esSuperAdmin ? 'Todas las sucursales' : sucursal || 'Sin sucursal asignada'

  const cerrarMenus = () => {
    navRef.current?.querySelectorAll('details[open]').forEach((detalle) => detalle.removeAttribute('open'))
  }

  const cerrarTodo = () => {
    cerrarMenus()
    setMenuMovilAbierto(false)
  }

  // Cerrar cualquier dropdown al navegar
  useEffect(() => {
    navRef.current?.querySelectorAll('details[open]').forEach((detalle) => detalle.removeAttribute('open'))
    setMenuMovilAbierto(false)
  }, [location.pathname])

  // Cerrar dropdowns y menú móvil al hacer click fuera del navbar
  useEffect(() => {
    const alHacerClickFuera = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        navRef.current.querySelectorAll('details[open]').forEach((detalle) => detalle.removeAttribute('open'))
        setMenuMovilAbierto(false)
      }
    }
    document.addEventListener('mousedown', alHacerClickFuera)
    return () => document.removeEventListener('mousedown', alHacerClickFuera)
  }, [])

  // Sucursal asignada del Branch Admin (misma lógica que FuncionesPage)
  useEffect(() => {
    if (esSuperAdmin) return
    let cancelled = false
    catalogoApi
      .getSucursales()
      .then((data) => {
        if (cancelled) return
        const match = Array.isArray(data)
          ? data.find((s) => s.adminEmail?.toLowerCase() === user.email?.toLowerCase())
          : null
        setSucursal(match?.nombre ?? '')
      })
      .catch(() => {
        if (!cancelled) setSucursal('')
      })
    return () => {
      cancelled = true
    }
  }, [esSuperAdmin, user.email])

  const cerrarSesion = () => {
    cerrarTodo()
    logout()
  }

  return (
    <div ref={navRef} className="border-b border-gray-800 bg-gray-950">
      <div className="navbar min-h-16 px-2 md:px-4">
        <div className="navbar-start gap-1">
          <button
            type="button"
            onClick={() => setMenuMovilAbierto((abierto) => !abierto)}
            aria-label={menuMovilAbierto ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={menuMovilAbierto}
            className="btn btn-square btn-ghost text-white lg:hidden"
          >
            {menuMovilAbierto ? <FiX className="size-5" /> : <FiMenu className="size-5" />}
          </button>
          <Link
            to="/panel-inicio"
            onClick={cerrarTodo}
            className="px-2 text-lg font-black uppercase tracking-wider text-white"
          >
            CineCloud
          </Link>
        </div>

        <div className="navbar-center hidden items-center gap-1 lg:flex">
          <NavLink
            to="/panel-inicio"
            end
            className={({ isActive }) =>
              `btn btn-ghost btn-sm font-medium ${isActive ? ACTIVE_CLASS : 'text-gray-300'}`
            }
          >
            Panel Inicio
          </NavLink>

          {secciones.map((seccion) => {
            const activa = seccion.items.some((item) => location.pathname.startsWith(item.to))
            return (
              <details key={seccion.label} className="dropdown" name="admin-nav">
                <summary
                  className={`btn btn-ghost btn-sm list-none font-medium ${activa ? ACTIVE_CLASS : 'text-gray-300'}`}
                >
                  {seccion.label}
                </summary>
                <ul className="menu dropdown-content z-50 mt-2 w-56 rounded-box border border-gray-800 bg-gray-900 p-2 shadow-lg">
                  {seccion.items.map((item) => (
                    <li key={item.to}>
                      <NavLink
                        to={item.to}
                        onClick={cerrarTodo}
                        className={({ isActive }) =>
                          isActive ? 'text-white' : 'text-gray-300 hover:text-white'
                        }
                      >
                        {item.icon}
                        {item.label}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </details>
            )
          })}
        </div>

        <div className="navbar-end">
          <details className="dropdown dropdown-end" name="admin-nav">
            <summary className="btn btn-ghost btn-circle list-none text-white" aria-label="Menú de usuario">
              <FiUser className="size-5" />
            </summary>
            <div className="dropdown-content z-50 mt-3 w-64 rounded-box border border-gray-800 bg-gray-900 p-2 shadow-lg">
              <div className="min-w-0 space-y-0.5 border-b border-gray-800 px-2 pb-2">
                <p title={user.email} className="truncate text-sm font-medium text-white">
                  {user.email}
                </p>
                <p title={sucursalTexto} className="truncate text-xs text-gray-400">
                  {sucursalTexto}
                </p>
              </div>
              <button
                type="button"
                onClick={cerrarSesion}
                className="btn btn-ghost btn-sm mt-1 w-full justify-start text-gray-300 hover:text-white"
              >
                <FiLogOut className={ICON_CLASS} />
                Cerrar Sesión
              </button>
            </div>
          </details>
        </div>
      </div>

      {menuMovilAbierto && (
        <div className="border-t border-gray-800 px-2 pb-3 lg:hidden">
          <ul className="menu w-full gap-1 text-gray-300">
            <li>
              <NavLink
                to="/panel-inicio"
                end
                onClick={cerrarTodo}
                className={({ isActive }) => (isActive ? ACTIVE_CLASS : '')}
              >
                <FiHome className={ICON_CLASS} />
                Panel Inicio
              </NavLink>
            </li>
            {secciones.map((seccion) => (
              <li key={seccion.label}>
                <details>
                  <summary className="list-none font-medium">{seccion.label}</summary>
                  <ul>
                    {seccion.items.map((item) => (
                      <li key={item.to}>
                        <NavLink
                          to={item.to}
                          onClick={cerrarTodo}
                          className={({ isActive }) => (isActive ? 'text-white' : '')}
                        >
                          {item.icon}
                          {item.label}
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                </details>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default Navbar
