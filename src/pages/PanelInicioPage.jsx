import { useEffect, useState } from 'react'
import {
  FiCalendar,
  FiDollarSign,
  FiFilm,
  FiMonitor,
} from 'react-icons/fi'
import Layout from '../components/Layout'
import { ROLES, useAuth } from '../context/AuthContext'
import { catalogoApi } from '../services/catalogoApi'

const CARGANDO = '...'
const SIN_DATOS = '—'

function primerValor(...valores) {
  return valores.find((valor) => valor !== undefined && valor !== null && valor !== '')
}

function listaDe(data, clave) {
  if (Array.isArray(data)) return data
  if (Array.isArray(data?.[clave])) return data[clave]
  return []
}

function numeroTotal(venta) {
  const numero = Number(primerValor(venta.total, venta.montoTotal, venta.totalPagar, venta.reserva?.total))
  return Number.isFinite(numero) ? numero : 0
}

function fechaVenta(venta) {
  return primerValor(
    venta.fechaVenta,
    venta.fecha,
    venta.fechaConfirmacion,
    venta.createdAt,
    venta.reserva?.fecha,
  )
}

function esDelMesActual(valor, hoy) {
  if (!valor) return false
  const texto = String(valor)
  const fecha = /^\d{4}-\d{2}-\d{2}$/.test(texto)
    ? new Date(`${texto}T00:00:00`)
    : new Date(texto)
  if (Number.isNaN(fecha.getTime())) return false
  return fecha.getFullYear() === hoy.getFullYear() && fecha.getMonth() === hoy.getMonth()
}

function recaudacionDelMes(data) {
  const hoy = new Date()
  const total = listaDe(data, 'ventas')
    .filter((venta) => esDelMesActual(fechaVenta(venta), hoy))
    .reduce((suma, venta) => suma + numeroTotal(venta), 0)
  return `$${total.toLocaleString('es-CL')}`
}

function contar(data, clave) {
  return String(listaDe(data, clave).length)
}

const STATS_BY_ROLE = {
  [ROLES.SUPER_ADMIN]: [
    { title: 'Recaudación global del mes', clave: 'recaudacion', icon: <FiDollarSign className="size-5" /> },
    { title: 'Sucursales activas', clave: 'sucursales', icon: <FiMonitor className="size-5" /> },
    { title: 'Funciones programadas', clave: 'funciones', icon: <FiFilm className="size-5" /> },
  ],
  [ROLES.BRANCH_ADMIN]: [
    { title: 'Recaudación de mi sucursal', value: '—', icon: <FiDollarSign className="size-5" /> },
    { title: 'Salas activas', value: '—', icon: <FiMonitor className="size-5" /> },
    { title: 'Funciones de hoy', value: '—', icon: <FiCalendar className="size-5" /> },
  ],
}

function PanelInicioPage() {
  const { user } = useAuth()
  const [metricas, setMetricas] = useState({
    recaudacion: CARGANDO,
    sucursales: CARGANDO,
    funciones: CARGANDO,
  })

  useEffect(() => {
    let activo = true

    catalogoApi.getVentas()
      .then((data) => {
        if (activo) setMetricas((prev) => ({ ...prev, recaudacion: recaudacionDelMes(data) }))
      })
      .catch(() => {
        if (activo) setMetricas((prev) => ({ ...prev, recaudacion: SIN_DATOS }))
      })

    catalogoApi.getSucursales()
      .then((data) => {
        if (activo) setMetricas((prev) => ({ ...prev, sucursales: contar(data, 'sucursales') }))
      })
      .catch(() => {
        if (activo) setMetricas((prev) => ({ ...prev, sucursales: SIN_DATOS }))
      })

    catalogoApi.getFunciones()
      .then((data) => {
        if (activo) setMetricas((prev) => ({ ...prev, funciones: contar(data, 'funciones') }))
      })
      .catch(() => {
        if (activo) setMetricas((prev) => ({ ...prev, funciones: SIN_DATOS }))
      })

    return () => {
      activo = false
    }
  }, [])

  const stats = (STATS_BY_ROLE[user.role] ?? []).map((stat) => ({
    ...stat,
    value: stat.clave ? metricas[stat.clave] : stat.value,
  }))

  return (
    <Layout>
      <section className="space-y-6">
        <header className="space-y-1">
          <h1 className="text-2xl font-bold md:text-3xl">Panel de inicio</h1>
          <p className="text-sm text-base-content/60">
            Sesión iniciada como <span className="font-medium">{user.email}</span>
          </p>
          <p className="text-sm text-base-content/60">Resumen de tu cine</p>
        </header>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
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
