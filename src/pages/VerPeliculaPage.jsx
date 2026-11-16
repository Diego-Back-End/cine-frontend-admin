import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router'
import { getPeliculaBySlug } from '../data/peliculasMock'
import { catalogoApi } from '../services/catalogoApi'

const DEFAULT_POSTER = `${import.meta.env.BASE_URL}default-poster.svg`

const DIAS = ['DOM', 'LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB']
const MESES = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC']
const DIAS_VENTANA = 7

function fechaKey(fecha) {
  return `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}-${String(fecha.getDate()).padStart(2, '0')}`
}

function etiquetaFecha(key, hoyKey) {
  if (key === hoyKey) return 'HOY'
  const [anio, mes, dia] = key.split('-').map(Number)
  const fecha = new Date(anio, mes - 1, dia)
  return `${DIAS[fecha.getDay()]} ${String(dia).padStart(2, '0')}/${MESES[mes - 1]}`
}

function normalizarPelicula(data) {
  if (!data) return null
  return {
    id: data.id,
    title: data.titulo ?? data.title,
    duration: data.duracion ?? data.duration ?? data.duracionMinutos,
    rating: data.clasificacion ?? data.rating,
    generos: Array.isArray(data.generos)
      ? data.generos
      : data.genero
        ? [data.genero]
        : data.genre
          ? [data.genre]
          : [],
    sinopsis: data.sinopsis,
    poster: data.poster ?? data.imagenUrl,
    slug: data.slug,
  }
}

function VerPeliculaPage() {
  const { slug } = useParams()
  const [pelicula, setPelicula] = useState(() => normalizarPelicula(getPeliculaBySlug(slug)))
  const [peliculaApiId, setPeliculaApiId] = useState(null)
  const [funciones, setFunciones] = useState([])
  const [sucursales, setSucursales] = useState([])
  const [cargandoPelicula, setCargandoPelicula] = useState(true)
  const [cargandoHorarios, setCargandoHorarios] = useState(true)
  const [errorHorarios, setErrorHorarios] = useState('')
  const [fechaSeleccionada, setFechaSeleccionada] = useState(null)
  const [filtroFormato, setFiltroFormato] = useState('Todos')
  const [filtroIdioma, setFiltroIdioma] = useState('Todos')

  useEffect(() => {
    let cancelled = false

    catalogoApi
      .getPeliculaBySlug(slug)
      .then((data) => {
        if (cancelled || !data) return
        setPelicula(normalizarPelicula(data))
        setPeliculaApiId(data.id)
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setCargandoPelicula(false)
      })

    Promise.all([catalogoApi.getFunciones(), catalogoApi.getSucursales()])
      .then(([funcionesData, sucursalesData]) => {
        if (cancelled) return
        setFunciones(Array.isArray(funcionesData) ? funcionesData : [])
        setSucursales(Array.isArray(sucursalesData) ? sucursalesData : [])
      })
      .catch((e) => {
        if (!cancelled) setErrorHorarios(e.message || 'No se pudieron cargar los horarios')
      })
      .finally(() => {
        if (!cancelled) setCargandoHorarios(false)
      })

    return () => {
      cancelled = true
    }
  }, [slug])

  // Próximos 7 días (HOY + 6), siempre presentes como tabs.
  const ahora = new Date()
  const inicioHoy = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate())
  const finVentana = new Date(inicioHoy)
  finVentana.setDate(finVentana.getDate() + DIAS_VENTANA)
  const hoyKey = fechaKey(inicioHoy)
  const fechas = Array.from({ length: DIAS_VENTANA }, (_, i) => {
    const fecha = new Date(inicioHoy)
    fecha.setDate(fecha.getDate() + i)
    return fechaKey(fecha)
  })
  const fechaActiva = fechas.includes(fechaSeleccionada) ? fechaSeleccionada : fechas[0]

  const funcionesVentana = funciones
    .filter((funcion) => {
      if (peliculaApiId == null || funcion.peliculaId !== peliculaApiId) return false
      const fechaHora = new Date(funcion.fechaHora)
      return fechaHora >= ahora && fechaHora < finVentana
    })
    .sort((a, b) => new Date(a.fechaHora) - new Date(b.fechaHora))

  const cumpleFiltros = (funcion) =>
    (filtroFormato === 'Todos' || funcion.formato === filtroFormato) &&
    (filtroIdioma === 'Todos' || funcion.idioma === filtroIdioma)

  const funcionesDelDia = funcionesVentana.filter(
    (funcion) => funcion.fechaHora.slice(0, 10) === fechaActiva
  )

  const sucursalesPorId = new Map(sucursales.map((sucursal) => [sucursal.id, sucursal]))
  const gruposPorSucursal = new Map()
  for (const funcion of funcionesDelDia) {
    if (!gruposPorSucursal.has(funcion.sucursalId)) gruposPorSucursal.set(funcion.sucursalId, [])
    gruposPorSucursal.get(funcion.sucursalId).push(funcion)
  }
  const tarjetas = [...gruposPorSucursal.entries()]
    .map(([sucursalId, funcionesSucursal]) => {
      const sucursal = sucursalesPorId.get(sucursalId)
      return {
        sucursalId,
        nombre: sucursal?.nombre || `Sucursal ${sucursalId}`,
        direccion: sucursal?.direccion || '',
        funciones: funcionesSucursal.filter(cumpleFiltros),
      }
    })
    .sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'))

  const cargandoVistaHorarios = cargandoPelicula || cargandoHorarios
  const formatos = [...new Set(funcionesVentana.map((f) => f.formato).filter(Boolean))].sort()
  const idiomas = [...new Set(funcionesVentana.map((f) => f.idioma).filter(Boolean))].sort()
  const mensajeVacio =
    funcionesVentana.length === 0
      ? 'No hay funciones programadas para esta película en los próximos 7 días.'
      : 'No hay funciones para este día.'

  if (cargandoPelicula && !pelicula) {
    return (
      <main className="min-h-screen bg-[#111111] text-white py-10 px-4 font-sans">
        <div className="container mx-auto max-w-6xl">
          <div className="flex justify-center py-16">
            <span className="loading loading-spinner loading-lg text-white"></span>
          </div>
        </div>
      </main>
    )
  }

  if (!pelicula) {
    return (
      <main className="min-h-screen bg-[#111111] text-white py-10 px-4 font-sans">
        <div className="container mx-auto max-w-6xl">
          <Link
            to="/panel-inicio/peliculas"
            className="btn btn-ghost btn-sm mb-6 text-gray-400 hover:text-white"
          >
            ← Volver a la cartelera
          </Link>
          <div className="alert alert-error" role="alert">
            <span>Película no encontrada: {slug}</span>
          </div>
        </div>
      </main>
    )
  }

  const imagen = pelicula.poster?.trim() ? pelicula.poster : DEFAULT_POSTER
  const duracion = pelicula.duration != null ? `${pelicula.duration} min` : null
  const clasificacionTexto = pelicula.rating ? String(pelicula.rating) : 'S/C'
  const generos = Array.isArray(pelicula.generos)
    ? pelicula.generos
    : pelicula.genre
      ? [pelicula.genre]
      : []

  return (
    <main className="min-h-screen bg-[#111111] text-white py-10 px-4 font-sans">
      <div className="container mx-auto max-w-6xl">
        <Link
          to="/panel-inicio/peliculas"
          className="btn btn-ghost btn-sm mb-6 text-gray-400 hover:text-white"
        >
          ← Volver a la cartelera
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-12">
          <section className="space-y-6">
            <h1 className="text-3xl font-black uppercase tracking-wider">{pelicula.title}</h1>

            <div className="relative rounded-lg overflow-hidden shadow-2xl">
              <img
                src={imagen}
                alt={pelicula.title}
                className="w-full object-cover aspect-[2/3]"
                onError={(e) => {
                  e.target.src = DEFAULT_POSTER
                }}
              />
            </div>

            <div className="flex gap-2 flex-wrap">
              {generos.map((genero, index) => (
                <span
                  key={`${genero}-${index}`}
                  className="badge badge-outline border-gray-600 text-gray-300"
                >
                  {genero}
                </span>
              ))}
              {duracion && (
                <span className="badge badge-outline border-gray-600 text-gray-300">{duracion}</span>
              )}
              <span className="badge badge-outline border-gray-600 text-gray-300 font-bold">
                {clasificacionTexto}
              </span>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-2">Sinopsis</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{pelicula.sinopsis}</p>
            </div>
          </section>

          <section className="space-y-8 lg:pt-14">
            <div>
              <h2 className="text-2xl font-bold uppercase mb-4">Horarios</h2>

              {/* Selector de fechas */}
              <div className="flex border-b border-gray-800 overflow-x-auto">
                {fechas.map((fecha) => (
                  <button
                    key={fecha}
                    onClick={() => setFechaSeleccionada(fecha)}
                    className={`px-5 py-4 text-sm font-bold whitespace-nowrap transition-colors ${
                      fechaActiva === fecha
                        ? 'bg-white text-black'
                        : 'bg-[#1a1a1a] text-gray-400 hover:bg-gray-800'
                    }`}
                  >
                    {etiquetaFecha(fecha, hoyKey)}
                  </button>
                ))}
              </div>
            </div>

            {/* Filtros de formato e idioma */}
            <div className="flex flex-wrap gap-4">
              <select
                className="select select-bordered select-sm bg-[#1a1a1a] border-gray-700 text-white w-40"
                value={filtroFormato}
                onChange={(e) => setFiltroFormato(e.target.value)}
              >
                {['Todos', ...formatos].map((formato) => (
                  <option key={formato} value={formato}>
                    {formato}
                  </option>
                ))}
              </select>

              <select
                className="select select-bordered select-sm bg-[#1a1a1a] border-gray-700 text-white w-40"
                value={filtroIdioma}
                onChange={(e) => setFiltroIdioma(e.target.value)}
              >
                {['Todos', ...idiomas].map((idioma) => (
                  <option key={idioma} value={idioma}>
                    {idioma}
                  </option>
                ))}
              </select>
            </div>

            {/* Leyenda de disponibilidad de butacas (pendiente: ms-reservas) */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400">
              <span className="flex items-center gap-1.5">
                <div className="w-3 h-3 bg-green-500 rounded-sm"></div> Alta
              </span>
              <span className="flex items-center gap-1.5">
                <div className="w-3 h-3 bg-yellow-500 rounded-sm"></div> Media
              </span>
              <span className="flex items-center gap-1.5">
                <div className="w-3 h-3 bg-red-500 rounded-sm"></div> Baja
              </span>
              <span className="flex items-center gap-1.5">
                <div className="w-3 h-3 bg-gray-600 rounded-sm"></div> Lleno
              </span>
              <span className="badge badge-outline badge-sm border-gray-700 text-gray-400">
                Pendiente: ms-reservas
              </span>
            </div>

            {cargandoVistaHorarios && (
              <div className="flex justify-center py-6">
                <span className="loading loading-spinner text-white"></span>
              </div>
            )}

            {!cargandoVistaHorarios && errorHorarios && (
              <div className="alert alert-error" role="alert">
                <span>No se pudieron cargar los horarios: {errorHorarios}</span>
              </div>
            )}

            {!cargandoVistaHorarios && !errorHorarios && tarjetas.length === 0 && (
              <p className="text-gray-500 italic text-sm">{mensajeVacio}</p>
            )}

            {/* Tarjetas de sucursales con funciones */}
            {!cargandoVistaHorarios && !errorHorarios && tarjetas.length > 0 && (
              <div className="space-y-6">
                {tarjetas.map((tarjeta) => (
                  <div
                    key={tarjeta.sucursalId}
                    className="bg-[#1a1a1a] border border-gray-800 rounded-lg p-5"
                  >
                    <h3 className="text-lg font-bold uppercase text-red-600 mb-1">
                      {tarjeta.nombre}
                    </h3>
                    <p className="text-sm text-gray-400 mb-4">{tarjeta.direccion}</p>

                    {tarjeta.funciones.length === 0 ? (
                      <p className="text-gray-500 italic text-sm">
                        No hay funciones para los filtros seleccionados.
                      </p>
                    ) : (
                      <div className="flex flex-wrap gap-3">
                        {tarjeta.funciones.map((funcion) => (
                          <span
                            key={funcion.id}
                            title="Disponibilidad pendiente: requiere ms-reservas"
                            className="btn btn-outline h-auto py-2 px-4 flex flex-col items-center gap-1 border-gray-600 text-white cursor-default"
                          >
                            <span className="text-lg leading-tight">
                              {funcion.fechaHora.slice(11, 16)}hrs
                            </span>
                            <span className="text-[10px] uppercase text-gray-500">
                              {funcion.formato} · {funcion.idioma}
                            </span>
                            <span className="w-2 h-2 rounded-full bg-gray-600"></span>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  )
}

export default VerPeliculaPage
