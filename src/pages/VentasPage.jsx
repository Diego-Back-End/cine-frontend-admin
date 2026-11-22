import { useCallback, useEffect, useMemo, useState } from 'react'
import Layout from '../components/Layout'
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

function VentasPage() {
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
        funcion: textoFuncion(primerValor(venta.funcion, venta.funcionDetalle, venta.reserva?.funcion)),
        asientos: textoAsientos(primerValor(venta.asientos, venta.reserva?.asientos)),
        total: numeroTotal(venta),
        fecha: fechaVenta(venta),
      })),
    [ventas],
  )

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
        ) : (
          <>
            <div className="overflow-x-auto rounded-box border border-base-content/10 bg-base-100">
              <table className="table table-zebra">
                <thead>
                  <tr className="bg-base-200 text-sm">
                    <th>Reserva</th>
                    <th>Correo</th>
                    <th>Función</th>
                    <th>Asientos</th>
                    <th className="text-right">Total</th>
                    <th>Fecha</th>
                  </tr>
                </thead>
                <tbody>
                  {filas.map((fila) => (
                    <tr key={fila.key}>
                      <td className="font-medium">{fila.reserva}</td>
                      <td>{fila.correo}</td>
                      <td>{fila.funcion}</td>
                      <td>{fila.asientos}</td>
                      <td className="text-right font-semibold">{formatearMonto(fila.total)}</td>
                      <td>{fila.fecha}</td>
                    </tr>
                  ))}
                  {filas.length === 0 && !error && (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-base-content/60">
                        No hay ventas registradas
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <p className="text-right text-lg font-bold">
              Total general: <span className="text-primary">{formatearMonto(totalGeneral)}</span>
            </p>
          </>
        )}
      </section>
    </Layout>
  )
}

export default VentasPage
