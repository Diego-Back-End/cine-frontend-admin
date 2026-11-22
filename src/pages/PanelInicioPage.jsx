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
const SIN_SUCURSAL_NOTA = 'No se pudo determinar tu sucursal.'
const SIN_SALAS_NOTA = 'No hay datos de salas en las fuentes disponibles del panel.'

function dato(valor, nota = '') {
  return { valor, nota }
}

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

function mismoId(valor, esperado) {
  if (valor === undefined || valor === null || valor === '') return false
  return String(valor) === String(esperado)
}

function idSucursal(sucursal) {
  return primerValor(sucursal?.id, sucursal?.sucursalId)
}

function recaudacionDeSucursal(data, sucursalId) {
  const ventas = listaDe(data, 'ventas')
  const propias = ventas.filter((venta) =>
    mismoId(primerValor(venta.sucursalId, venta.reserva?.sucursalId), sucursalId),
  )
  if (
    propias.length === 0 &&
    ventas.some((venta) => primerValor(venta.sucursalId, venta.reserva?.sucursalId) === undefined)
  ) {
    return null
  }
  const total = propias.reduce((suma, venta) => suma + numeroTotal(venta), 0)
  return `$${total.toLocaleString('es-CL')}`
}

function esHoy(valor, hoy) {
  if (!valor) return false
  const texto = String(valor)
  const fecha = /^\d{4}-\d{2}-\d{2}/.test(texto)
    ? new Date(`${texto.slice(0, 10)}T00:00:00`)
    : new Date(valor)
  if (Number.isNaN(fecha.getTime())) return false
  return (
    fecha.getFullYear() === hoy.getFullYear() &&
    fecha.getMonth() === hoy.getMonth() &&
    fecha.getDate() === hoy.getDate()
  )
}

function funcionesDeHoy(data, sucursalId, hoy) {
  const funciones = listaDe(data, 'funciones').filter((funcion) => {
    const id = primerValor(funcion.sucursalId, funcion.sucursal?.id)
    return id === undefined || mismoId(id, sucursalId)
  })
  return String(
    funciones.filter((funcion) => esHoy(primerValor(funcion.fechaHora, funcion.fecha), hoy)).length,
  )
}

function contar(data, clave) {
  return String(listaDe(data, clave).length)
}

async function resultado(peticion) {
  try {
    return { ok: true, data: await peticion }
  } catch (error) {
    return { ok: false, error }
  }
}

const STATS_BY_ROLE = {
  [ROLES.SUPER_ADMIN]: [
    { title: 'Recaudación global del mes', clave: 'recaudacion', icon: <FiDollarSign className="size-5" /> },
    { title: 'Sucursales activas', clave: 'sucursales', icon: <FiMonitor className="size-5" /> },
    { title: 'Funciones programadas', clave: 'funciones', icon: <FiFilm className="size-5" /> },
  ],
  [ROLES.BRANCH_ADMIN]: [
    { title: 'Recaudación de mi sucursal', clave: 'recaudacionSucursal', icon: <FiDollarSign className="size-5" /> },
    { title: 'Salas activas', clave: 'salasActivas', icon: <FiMonitor className="size-5" /> },
    { title: 'Funciones de hoy', clave: 'funcionesHoy', icon: <FiCalendar className="size-5" /> },
  ],
}

function PanelInicioPage() {
  const { user } = useAuth()
  const esBranchAdmin = user.role === ROLES.BRANCH_ADMIN
  const [metricas, setMetricas] = useState({
    recaudacion: dato(CARGANDO),
    sucursales: dato(CARGANDO),
    funciones: dato(CARGANDO),
    recaudacionSucursal: dato(CARGANDO),
    funcionesHoy: dato(CARGANDO),
    salasActivas: dato(SIN_DATOS, SIN_SALAS_NOTA),
  })

  useEffect(() => {
    let activo = true

    async function cargar() {
      const [ventasRes, sucursalesRes] = await Promise.all([
        resultado(catalogoApi.getVentas()),
        resultado(catalogoApi.getSucursales()),
      ])
      if (!activo) return

      const ventas = listaDe(ventasRes.data, 'ventas')
      const sucursales = listaDe(sucursalesRes.data, 'sucursales')

      if (esBranchAdmin) {
        const sucursal = sucursales.find(
          (item) => item.adminEmail?.toLowerCase() === user.email?.toLowerCase(),
        )
        const sucursalId = idSucursal(sucursal)

        let recaudacion
        if (sucursalId === undefined) {
          recaudacion = dato(SIN_DATOS, SIN_SUCURSAL_NOTA)
        } else if (!ventasRes.ok) {
          recaudacion = dato(SIN_DATOS, 'No se pudieron cargar las ventas.')
        } else {
          const valor = recaudacionDeSucursal(ventas, sucursalId)
          recaudacion = valor === null
            ? dato(SIN_DATOS, 'Las ventas no informan su sucursal.')
            : dato(valor)
        }

        setMetricas((prev) => ({
          ...prev,
          recaudacionSucursal: recaudacion,
          funcionesHoy: sucursalId === undefined ? dato(SIN_DATOS, SIN_SUCURSAL_NOTA) : dato(CARGANDO),
        }))

        if (sucursalId !== undefined) {
          const funcionesRes = await resultado(catalogoApi.getFunciones({ sucursalId }))
          if (!activo) return
          setMetricas((prev) => ({
            ...prev,
            funcionesHoy: funcionesRes.ok
              ? dato(funcionesDeHoy(funcionesRes.data, sucursalId, new Date()))
              : dato(SIN_DATOS, 'No se pudieron cargar las funciones.'),
          }))
        }
        return
      }

      const funcionesRes = await resultado(catalogoApi.getFunciones())
      if (!activo) return
      setMetricas({
        recaudacion: ventasRes.ok
          ? dato(recaudacionDelMes(ventas))
          : dato(SIN_DATOS, 'No se pudieron cargar las ventas.'),
        sucursales: sucursalesRes.ok
          ? dato(contar(sucursales))
          : dato(SIN_DATOS, 'No se pudieron cargar las sucursales.'),
        funciones: funcionesRes.ok
          ? dato(contar(funcionesRes.data, 'funciones'))
          : dato(SIN_DATOS, 'No se pudieron cargar las funciones.'),
        recaudacionSucursal: dato(CARGANDO),
        funcionesHoy: dato(CARGANDO),
        salasActivas: dato(SIN_DATOS, SIN_SALAS_NOTA),
      })
    }

    cargar()

    return () => {
      activo = false
    }
  }, [esBranchAdmin, user.email])

  const stats = (STATS_BY_ROLE[user.role] ?? []).map((stat) => ({
    ...stat,
    ...(metricas[stat.clave] ?? dato(SIN_DATOS)),
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
                <p className="text-3xl font-bold">{stat.valor}</p>
                {stat.nota && (
                  <p className="text-xs text-base-content/60" title={stat.nota}>
                    {stat.nota}
                  </p>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>
    </Layout>
  )
}

export default PanelInicioPage
