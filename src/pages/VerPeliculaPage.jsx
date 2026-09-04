import { useState } from 'react'
import { Link, useParams } from 'react-router'
import Layout from '../components/Layout'
import { getPeliculaBySlug } from '../data/peliculasMock'

const DIAS = [
  { key: 'lun', label: 'LUN', date: '12/05' },
  { key: 'mar', label: 'MAR', date: '13/05' },
  { key: 'mie', label: 'MIE', date: '14/05' },
  { key: 'jue', label: 'JUE', date: '15/05' },
  { key: 'vie', label: 'VIE', date: '16/05' },
  { key: 'sab', label: 'SAB', date: '17/05' },
  { key: 'dom', label: 'DOM', date: '18/05' },
]

const HORARIOS_PLACEHOLDER = {
  lun: [
    { cine: 'Cine Matrix Alto Las Condes', horarios: ['14:30', '17:00', '20:15', '22:40'] },
    { cine: 'Cine Matrix Mall Plaza Norte', horarios: ['15:00', '18:30', '21:00'] },
  ],
  mar: [
    { cine: 'Cine Matrix Alto Las Condes', horarios: ['13:00', '16:20', '19:45'] },
    { cine: 'Cine Matrix Costanera', horarios: ['14:00', '19:00', '22:10'] },
  ],
  mie: [
    { cine: 'Cine Matrix Plaza Vespucio', horarios: ['14:00', '17:30', '20:00'] },
  ],
  jue: [
    { cine: 'Cine Matrix Marina Arauco', horarios: ['15:15', '18:45', '21:30'] },
  ],
  vie: [
    { cine: 'Cine Matrix Portal Ñuñoa', horarios: ['16:00', '19:30', '22:00'] },
    { cine: 'Cine Matrix Alto Las Condes', horarios: ['14:30', '20:30'] },
  ],
  sab: [
    { cine: 'Cine Matrix Alto Las Condes', horarios: ['12:00', '15:00', '18:00', '21:00'] },
  ],
  dom: [
    { cine: 'Cine Matrix Alto Las Condes', horarios: ['13:30', '16:00', '19:00'] },
  ],
}

function VerPeliculaPage() {
  const { slug } = useParams()
  const pelicula = getPeliculaBySlug(slug)
  const [diaSeleccionado, setDiaSeleccionado] = useState(DIAS[0].key)

  if (!pelicula) {
    return (
      <Layout>
        <section className="mx-auto max-w-7xl space-y-4">
          <Link to="/panel-inicio/peliculas" className="link link-hover text-sm">
            ← Volver a películas
          </Link>
          <div className="alert alert-error">
            <span>Película no encontrada: {slug}</span>
          </div>
        </section>
      </Layout>
    )
  }

  const horariosDia = HORARIOS_PLACEHOLDER[diaSeleccionado] ?? []

  return (
    <Layout>
      <section className="mx-auto max-w-7xl space-y-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
          {/* Izquierda: imagen + título + etiquetas + sinopsis */}
          <div className="space-y-4 lg:col-span-5">
            <div className="overflow-hidden rounded-b-box bg-base-200 shadow-sm">
              <figure className="aspect-[2/3] overflow-hidden bg-base-200">
                <img
                  src={pelicula.poster}
                  alt={pelicula.title}
                  className="h-full w-full object-cover"
                />
              </figure>
            </div>

            <h1 className="text-3xl font-bold leading-tight md:text-4xl">{pelicula.title}</h1>

            <div className="flex flex-wrap gap-2.5">
              <span className="badge badge-lg badge-neutral">{pelicula.duration} min</span>
              <span className="badge badge-lg badge-outline">{pelicula.genre}</span>
              <span className="badge badge-lg badge-primary badge-outline">{pelicula.rating}</span>
              <span
                className={`badge badge-lg ${pelicula.estado === 'En cartelera' ? 'badge-success' : pelicula.estado === 'En Cartelera' ? 'badge-success' : 'badge-warning'}`}
              >
                {pelicula.estado}
              </span>
            </div>

            <div className="space-y-2">
              <h2 className="text-sm font-semibold text-base-content/60">Sinopsis</h2>
              <p className="text-sm leading-relaxed">{pelicula.sinopsis}</p>
            </div>
          </div>

          {/* Derecha: Volver + Horarios placeholder */}
          <div className="space-y-4 lg:col-span-7 lg:pt-0">
            <Link to="/panel-inicio/peliculas" className="link link-hover text-sm">
              ← Volver a películas
            </Link>

            <div className="card card-border border-base-300 bg-base-100 shadow-sm">
              <div className="card-body gap-4">
                <h2 className="text-xl font-bold">Horarios</h2>

                <button
                  type="button"
                  className="btn btn-primary btn-sm w-full"
                  onClick={() => console.log('Ver cines placeholder')}
                >
                  Ver cines
                </button>

                <div className="flex flex-wrap gap-2">
                  {DIAS.map((dia) => (
                    <button
                      key={dia.key}
                      type="button"
                      className={`btn btn-sm ${diaSeleccionado === dia.key ? 'btn-primary' : 'btn-outline'}`}
                      onClick={() => setDiaSeleccionado(dia.key)}
                    >
                      {dia.label} - {dia.date}
                    </button>
                  ))}
                </div>

                <div className="divider my-1" />

                <div className="space-y-3">
                  <h3 className="text-sm font-semibold">Horarios disponibles</h3>
                  <p className="text-xs text-base-content/50">
                    Día seleccionado: {DIAS.find((d) => d.key === diaSeleccionado)?.label} -{' '}
                    {DIAS.find((d) => d.key === diaSeleccionado)?.date} (datos placeholder)
                  </p>

                  {horariosDia.length === 0 ? (
                    <p className="py-4 text-center text-sm text-base-content/50">
                      No hay horarios para este día (placeholder).
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {horariosDia.map((bloque) => (
                        <div key={bloque.cine} className="rounded-box border border-base-300 p-3">
                          <p className="text-sm font-medium">{bloque.cine}</p>
                          <div className="mt-2 flex flex-wrap gap-2">
                            {bloque.horarios.map((h) => (
                              <button
                                key={h}
                                type="button"
                                className="btn btn-outline btn-xs"
                                onClick={() => console.log('Horario click placeholder', h)}
                              >
                                {h}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <p className="text-xs text-base-content/40">
                    * Horarios y cines son placeholder, pendiente de MS Catálogo.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  )
}

export default VerPeliculaPage
