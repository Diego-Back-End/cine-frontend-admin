import { useCallback, useEffect, useMemo, useState } from 'react'
import Layout from '../components/Layout'
import { ROLES, useAuth } from '../context/AuthContext'
import { catalogoApi } from '../services/catalogoApi'

function primerValor(...valores) {
  return valores.find((valor) => valor !== undefined && valor !== null && valor !== '')
}

function formatearMonto(valor) {
  const monto = Number(valor)
  return Number.isFinite(monto) ? `$${monto.toLocaleString('es-CL')}` : '—'
}

function formatearFecha(valor) {
  if (!valor) return '—'
  const fecha = new Date(valor)
  return Number.isNaN(fecha.getTime()) ? '—' : fecha.toLocaleDateString('es-CL')
}

function textoReserva(venta) {
  const id = primerValor(venta.reservaId, venta.idReserva, venta.idVenta, venta.id)
  if (id !== undefined) return String(id)
  if (venta.reserva && typeof venta.reserva === 'object') {
    return venta.reserva.id ? String(venta.reserva.id) : '—'
  }
  return venta.reserva ? String(venta.reserva) : '—'
}

function textoCorreo(venta) {
  const correo = primerValor(venta.correo, venta.email, venta.usuarioEmail, venta.reserva?.email)
  return correo !== undefined ? String(correo) : '—'
}

function textoSucursal(venta) {
  const nombre = primerValor(venta.nombreSucursal)
  return nombre !== undefined ? String(nombre) : 'Sin sucursal'
}

function textoFuncion(valor) {
  if (!valor) return '—'
  if (typeof valor !== 'object') return String(valor)
  const funcion = valor.funcion && typeof valor.funcion === 'object' ? valor.funcion : valor
  const titulo = primerValor(
    funcion.descripcion,
    funcion.funcionDescripcion,
    funcion.peliculaTitulo,
    funcion.titulo,
    funcion.nombrePelicula,
    funcion.pelicula?.titulo,
    funcion.pelicula?.nombre,
  )
  if (titulo !== undefined) return String(titulo)
  const id = primerValor(funcion.funcionId, funcion.id, valor.funcionId, valor.id)
  return id !== undefined ? `Función #${id}` : '—'
}

function textoAsientos(valor) {
  if (!valor) return '—'
  const lista = Array.isArray(valor) ? valor : [valor]
  const nombres = lista
    .map((asiento) => {
      if (asiento && typeof asiento === 'object') {
        return primerValor(asiento.codigo, asiento.asiento, asiento.label, asiento.numero, asiento.id)
      }
      return asiento
    })
    .filter((nombre) => nombre !== undefined && nombre !== null && nombre !== '')
    .map(String)
  return nombres.length > 0 ? nombres.join(', ') : '—'
}

function numeroTotal(venta) {
  const valor = primerValor(venta.total, venta.montoTotal, venta.totalPagar, venta.reserva?.total)
  const numero = Number(valor)
  return Number.isFinite(numero) ? numero : 0
}

function fechaVenta(venta) {
  const valor = primerValor(
    venta.fechaVenta,
    venta.fecha,
    venta.fechaConfirmacion,
    venta.createdAt,
    venta.reserva?.fecha,
  )
  return formatearFecha(valor)
}

function TablaVentas({ filas, mostrarSucursal, titulo, etiquetaTotal, subtotal }) {
  const columnas = [
    { clave: 'reserva', header: 'Reserva' },
    { clave: 'correo', header: 'Correo' },
    ...(mostrarSucursal ? [{ clave: 'sucursal', header: 'Sucursal' }] : []),
    { clave: 'funcion', header: 'Función' },
    { clave: 'asientos', header: 'Asientos' },
    {
      clave: 'total',
      header: 'Total',
      className: 'text-right font-semibold',
      render: (fila) => formatearMonto(fila.total),
    },
    { clave: 'fecha', header: 'Fecha' },
  ]

  return (
    <section className="space-y-3">
      {titulo && (
        <div className="flex flex-wrap items-baseline gap-2">
          <h2 className="text-lg font-semibold">{titulo}</h2>
          <span className="text-sm text-base-content/60">({filas.length} ventas)</span>
        </div>
      )}

      <div className="hidden overflow-x-auto rounded-box border border-base-content/10 bg-base-100 md:block">
        <table className="table table-zebra">
          <thead>
            <tr className="bg-base-200 text-sm">
              {columnas.map((columna) => (
                <th key={columna.clave} className={columna.clave === 'total' ? 'text-right' : undefined}>
                  {columna.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filas.map((fila) => (
              <tr key={fila.key}>
                {columnas.map((columna) => (
                  <td key={columna.clave} className={columna.className}>
                    {columna.render ? columna.render(fila) : fila[columna.clave]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
          {filas.length > 0 && (
            <tfoot>
              <tr className="bg-base-200 text-sm">
                <td colSpan={columnas.length - 1} className="text-right font-semibold">
                  {etiquetaTotal}
                </td>
                <td className="text-right font-bold text-primary">{formatearMonto(subtotal)}</td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>

      <div className="space-y-3 md:hidden">
        {filas.map((fila) => (
          <article key={fila.key} className="card card-border border-base-300 bg-base-100 shadow-sm">
            <div className="card-body gap-2 p-4">
              {columnas.map((columna) => (
                <div key={columna.clave} className="flex items-start justify-between gap-4">
                  <span className="shrink-0 text-xs uppercase tracking-wide text-base-content/50">
                    {columna.header}
                  </span>
                  <span className={`min-w-0 break-words text-right text-sm ${columna.className ?? ''}`}>
                    {columna.render ? columna.render(fila) : fila[columna.clave]}
                  </span>
                </div>
              ))}
            </div>
          </article>
        ))}
        {filas.length > 0 && (
          <div className="flex items-center justify-between rounded-box border border-base-300 bg-base-200 p-3">
            <span className="text-sm font-semibold">{etiquetaTotal}</span>
            <span className="font-bold text-primary">{formatearMonto(subtotal)}</span>
          </div>
        )}
      </div>
    </section>
  )
}

function VentasPage() {
  const { user } = useAuth()
  const esSuperAdmin = user.role === ROLES.SUPER_ADMIN
  const [ventas, setVentas] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const cargarVentas = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const data = await catalogoApi.getVentas()
      setVentas(Array.isArray(data) ? data : Array.isArray(data?.ventas) ? data.ventas : [])
    } catch (e) {
      setError(e.message || 'No se pudieron cargar las ventas.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    cargarVentas()
  }, [cargarVentas])

  const filas = useMemo(
    () =>
      ventas.map((venta, indice) => ({
        key: primerValor(venta.idVenta, venta.id, venta.reservaId, `venta-${indice}`),
        reserva: textoReserva(venta),
        correo: textoCorreo(venta),
        sucursal: textoSucursal(venta),
        funcion:
          venta.peliculaTitulo === undefined
            ? textoFuncion(primerValor(venta.funcion, venta.funcionDetalle, venta.reserva?.funcion))
            : String(venta.peliculaTitulo ?? '').trim() || '—',
        asientos: textoAsientos(primerValor(venta.asientos, venta.reserva?.asientos)),
        total: numeroTotal(venta),
        fecha: fechaVenta(venta),
      })),
    [ventas],
  )

  const grupos = useMemo(() => {
    if (!esSuperAdmin) return []
    const mapa = new Map()
    filas.forEach((fila) => {
      const actual = mapa.get(fila.sucursal) ?? []
      actual.push(fila)
      mapa.set(fila.sucursal, actual)
    })
    return Array.from(mapa, ([sucursal, filasGrupo]) => ({
      sucursal,
      filas: filasGrupo,
      subtotal: filasGrupo.reduce((suma, fila) => suma + fila.total, 0),
    }))
  }, [filas, esSuperAdmin])

  const totalGeneral = useMemo(
    () => filas.reduce((suma, fila) => suma + fila.total, 0),
    [filas],
  )

  return (
    <Layout>
      <section className="space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-bold md:text-3xl">Ventas</h1>
          <button
            type="button"
            className="btn btn-primary btn-sm gap-2"
            onClick={cargarVentas}
            disabled={loading}
          >
            {loading && <span className="loading loading-spinner loading-xs" />}
            Actualizar
          </button>
        </div>

        {error && (
          <div role="alert" className="alert alert-error">
            <span>Error al cargar las ventas: {error}</span>
          </div>
        )}

        {loading && filas.length === 0 ? (
          <div className="loading loading-spinner" />
        ) : filas.length === 0 && !error ? (
          <p className="py-8 text-center text-base-content/60">No hay ventas registradas</p>
        ) : esSuperAdmin ? (
          <div className="space-y-8">
            {grupos.map((grupo) => (
              <TablaVentas
                key={grupo.sucursal}
                filas={grupo.filas}
                mostrarSucursal
                titulo={grupo.sucursal}
                etiquetaTotal="Subtotal"
                subtotal={grupo.subtotal}
              />
            ))}
            <p className="text-right text-lg font-bold">
              Total general: <span className="text-primary">{formatearMonto(totalGeneral)}</span>
            </p>
          </div>
        ) : (
          <TablaVentas
            filas={filas}
            mostrarSucursal={false}
            titulo="Ventas de mi sucursal"
            etiquetaTotal="Total de mi sucursal"
            subtotal={totalGeneral}
          />
        )}
      </section>
    </Layout>
  )
}

export default VentasPage
