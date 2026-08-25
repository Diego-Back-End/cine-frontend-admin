import {
  FiCalendar,
  FiDollarSign,
  FiFilm,
  FiMonitor,
  FiUsers,
} from 'react-icons/fi'
import Layout from '../components/Layout'
import { ROLES, useAuth } from '../context/AuthContext'

const STATS_BY_ROLE = {
  [ROLES.SUPER_ADMIN]: [
    { title: 'Recaudación global del mes', value: '—', icon: <FiDollarSign className="size-5" /> },
    { title: 'Sucursales activas', value: '—', icon: <FiMonitor className="size-5" /> },
    { title: 'Funciones programadas', value: '—', icon: <FiFilm className="size-5" /> },
    { title: 'Administradores registrados', value: '—', icon: <FiUsers className="size-5" /> },
  ],
  [ROLES.BRANCH_ADMIN]: [
    { title: 'Recaudación de mi sucursal', value: '—', icon: <FiDollarSign className="size-5" /> },
    { title: 'Salas activas', value: '—', icon: <FiMonitor className="size-5" /> },
    { title: 'Funciones de hoy', value: '—', icon: <FiCalendar className="size-5" /> },
  ],
}

function PanelInicioPage() {
  const { user } = useAuth()
  const stats = STATS_BY_ROLE[user.role] ?? []

  return (
    <Layout>
      <section className="space-y-6">
        <header className="space-y-1">
          <h1 className="text-2xl font-bold md:text-3xl">Panel de inicio</h1>
          <p className="text-sm text-base-content/60">
            Sesión iniciada como <span className="font-medium">{user.email}</span>
          </p>
          <p className="text-xs text-base-content/50">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, 
            quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. 
            Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <article key={stat.title} className="card card-border border-base-300 bg-base-100 shadow-sm">
              <div className="card-body gap-3">
                <div className="flex items-center gap-3">
                  <span className="rounded-full bg-primary/10 p-3 text-primary">{stat.icon}</span>
                  <h2 className="text-sm font-medium text-base-content/60">{stat.title}</h2>
                </div>
                <p className="text-3xl font-bold">{stat.value}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </Layout>
  )
}

export default PanelInicioPage
