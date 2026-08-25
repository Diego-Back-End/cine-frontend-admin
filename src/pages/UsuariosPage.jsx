import { useMemo, useState } from 'react'
import { FaPencilAlt, FaTrashAlt, FaPlus, FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import { MdOutlinePersonSearch } from "react-icons/md";
import Layout from '../components/Layout'

const MOCK_USERS = [
  { id: 1, email: 'admin@prueba.cl', role: 'Super Administrador', status: 'Activa' },
  { id: 2, email: 'branch@pruebas.cl', role: 'Administrador de Sucursal', status: 'Activa' },
  { id: 3, email: 'carmen.lopez@cine.cl', role: 'Administrador de Sucursal', status: 'Deshabilitada' },
  { id: 4, email: 'pedro.morales@cine.cl', role: 'Administrador de Sucursal', status: 'Activa' },
  { id: 5, email: 'lucia.fernandez@cine.cl', role: 'Administrador de Sucursal', status: 'Activa' },
  { id: 6, email: 'diego.salazar@cine.cl', role: 'Administrador de Sucursal', status: 'Deshabilitada' },
  { id: 7, email: 'valentina.rios@cine.cl', role: 'Administrador de Sucursal', status: 'Activa' },
  { id: 8, email: 'matias.espinoza@cine.cl', role: 'Administrador de Sucursal', status: 'Activa' },
  { id: 9, email: 'fernanda.guzman@cine.cl', role: 'Administrador de Sucursal', status: 'Deshabilitada' },
  { id: 10, email: 'andres.vargas@cine.cl', role: 'Administrador de Sucursal', status: 'Activa' },
  { id: 11, email: 'camila.reyes@cine.cl', role: 'Administrador de Sucursal', status: 'Activa' },
  { id: 12, email: 'sebastian.muñoz@cine.cl', role: 'Administrador de Sucursal', status: 'Activa' },
]

const PAGE_SIZE_OPTIONS = [5, 10, 20, 50, 100]

function UsuariosPage() {
  const [perPage, setPerPage] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)
  const [filterEmail, setFilterEmail] = useState('')
  const [filterRole, setFilterRole] = useState('')
  const [filterStatus, setFilterStatus] = useState('')

  const filteredUsers = useMemo(() => {
    return MOCK_USERS.filter((u) => {
      const matchEmail = u.email.toLowerCase().includes(filterEmail.toLowerCase())
      const matchRole = u.role.toLowerCase().includes(filterRole.toLowerCase())
      const matchStatus = u.status.toLowerCase().includes(filterStatus.toLowerCase())
      return matchEmail && matchRole && matchStatus
    })
  }, [filterEmail, filterRole, filterStatus])

  const total = filteredUsers.length
  const totalPages = Math.max(1, Math.ceil(total / perPage))

  const safePage = Math.min(currentPage, totalPages)
  const start = (safePage - 1) * perPage
  const visibleUsers = filteredUsers.slice(start, start + perPage)

  const handlePerPageChange = (e) => {
    setPerPage(Number(e.target.value))
    setCurrentPage(1)
  }

  const VISIBLE_PAGES = 5

  const visiblePageNumbers = useMemo(() => {
    if (totalPages <= VISIBLE_PAGES) {
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    }
    const half = Math.floor(VISIBLE_PAGES / 2)
    let start = safePage - half
    if (start < 1) start = 1
    if (start + VISIBLE_PAGES - 1 > totalPages) start = totalPages - VISIBLE_PAGES + 1
    return Array.from({ length: VISIBLE_PAGES }, (_, i) => start + i)
  }, [safePage, totalPages])

  return (
    <Layout>
      <section className="space-y-4">
        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-bold md:text-3xl">Usuarios</h1>
          <button type="button" className="btn btn-primary btn-sm gap-2">
            <FaPlus className="size-3" />
            Añadir Usuario
          </button>
        </div>

        {/* Record count & per-page selector */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-base-content/70">
            Mostrando <span className="font-semibold">{perPage}</span> usuarios de{' '}
            <span className="font-semibold">{total}</span> registrados.
          </p>
          <label className="flex items-center gap-2 text-sm">
            <span className="text-base-content/60">Registros por página:</span>
            <select
              className="select select-bordered select-sm w-20"
              value={perPage}
              onChange={handlePerPageChange}
            >
              {PAGE_SIZE_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </label>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
          <table className="table">
            <thead>
              <tr className="bg-base-200 text-sm">
                <th>Email</th>
                <th>Rol</th>
                <th>Estado de cuenta</th>
                <th className="text-center">Acciones</th>
              </tr>
              <tr className="bg-base-200 text-sm">
                <th>
                  <input
                    type="text"
                    placeholder="Buscar email..."
                    className="input input-bordered input-sm w-full"
                    value={filterEmail}
                    onChange={(e) => { setFilterEmail(e.target.value); setCurrentPage(1) }}
                  />
                </th>
                <th>
                  <input
                    type="text"
                    placeholder="Buscar rol..."
                    className="input input-bordered input-sm w-full"
                    value={filterRole}
                    onChange={(e) => { setFilterRole(e.target.value); setCurrentPage(1) }}
                  />
                </th>
                <th>
                  <input
                    type="text"
                    placeholder="Buscar estado..."
                    className="input input-bordered input-sm w-full"
                    value={filterStatus}
                    onChange={(e) => { setFilterStatus(e.target.value); setCurrentPage(1) }}
                  />
                </th>
                <th />
              </tr>
            </thead>
            <tbody>
              {visibleUsers.map((u) => (
                <tr key={u.id} className="hover">
                  <td className="font-medium">{u.email}</td>
                  <td>{u.role}</td>
                  <td>
                    <span
                      className={`badge badge-sm ${
                        u.status === 'Activa' ? 'badge-success' : 'badge-error'
                      }`}
                    >
                      {u.status}
                    </span>
                  </td>
                  <td>
                    <div className="flex items-center justify-center gap-2">
                      <button
                        type="button"
                        className="btn btn-ghost btn-xs text-info"
                        aria-label="Editar usuario"
                      >
                        <FaPencilAlt className="size-3.5" />
                      </button>
                      <button
                        type="button"
                        className="btn btn-ghost btn-xs text-error"
                        aria-label="Eliminar usuario"
                      >
                        <FaTrashAlt className="size-3.5" />
                      </button>
                      <button
                        type="button"
                        className="btn btn-ghost btn-xs text-blue"
                        aria-label="Ver Usuario"
                      >
                        <MdOutlinePersonSearch className="size-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {visibleUsers.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-base-content/50">
                    No se encontraron usuarios para mostrar.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-center gap-1">
          <button
            type="button"
            className="btn btn-ghost btn-xs"
            disabled={safePage <= 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            aria-label="Página anterior"
          >
            <FaChevronLeft className="size-3" />
          </button>

          {visiblePageNumbers.map((page) => (
            <button
              key={page}
              type="button"
              className={`btn btn-xs ${
                safePage === page ? 'btn-active btn-primary' : 'btn-ghost'
              }`}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </button>
          ))}

          <button
            type="button"
            className="btn btn-ghost btn-xs"
            disabled={safePage >= totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            aria-label="Página siguiente"
          >
            <FaChevronRight className="size-3" />
          </button>
        </div>
      </section>
    </Layout>
  )
}

export default UsuariosPage
