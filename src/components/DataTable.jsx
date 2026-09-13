import { useMemo, useState } from 'react'
import { FaChevronLeft, FaChevronRight, FaPlus, FaTimes } from 'react-icons/fa'

const PAGE_SIZE_OPTIONS = [5, 10, 20, 50, 100]
const VISIBLE_PAGES = 5

function DataTable({ title, addLabel, onAdd, entityLabel, columns, data, actions = [] }) {
  const filterableColumns = useMemo(
    () => columns.filter((column) => column.searchable || column.filterable),
    [columns]
  )

  const [perPage, setPerPage] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)
  const [filters, setFilters] = useState(() =>
    Object.fromEntries(filterableColumns.map((column) => [column.key, '']))
  )

  // Sincroniza filtros si cambian las columnas (ej. recarga)
  const hasActiveFilters = useMemo(
    () => filterableColumns.some((col) => (filters[col.key] ?? '') !== ''),
    [filterableColumns, filters]
  )

  const filteredRows = useMemo(() => {
    return data.filter((row) =>
      filterableColumns.every((column) => {
        const filterValue = (filters[column.key] ?? '').trim()
        if (!filterValue) return true
        const cellValue = String(row[column.key] ?? '')
        // select = match exacto (case-insensitive)
        if (column.filterType === 'select') {
          return cellValue.toLowerCase() === filterValue.toLowerCase()
        }
        // combobox y text = includes
        return cellValue.toLowerCase().includes(filterValue.toLowerCase())
      })
    )
  }, [data, filterableColumns, filters])

  const total = filteredRows.length
  const totalPages = Math.max(1, Math.ceil(total / perPage))
  const safePage = Math.min(currentPage, totalPages)
  const start = (safePage - 1) * perPage
  const visibleRows = filteredRows.slice(start, start + perPage)

  const handlePerPageChange = (event) => {
    setPerPage(Number(event.target.value))
    setCurrentPage(1)
  }

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
    setCurrentPage(1)
  }

  const handleClearFilters = () => {
    setFilters(Object.fromEntries(filterableColumns.map((col) => [col.key, ''])))
    setCurrentPage(1)
  }

  const visiblePageNumbers = useMemo(() => {
    if (totalPages <= VISIBLE_PAGES) {
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    }
    const half = Math.floor(VISIBLE_PAGES / 2)
    let pageStart = safePage - half
    if (pageStart < 1) pageStart = 1
    if (pageStart + VISIBLE_PAGES - 1 > totalPages) pageStart = totalPages - VISIBLE_PAGES + 1
    return Array.from({ length: VISIBLE_PAGES }, (_, i) => pageStart + i)
  }, [safePage, totalPages])

  const renderFilterControl = (column) => {
    const filterType = column.filterType || (column.filterOptions ? 'select' : 'text')
    const options = column.filterOptions || []

    if (filterType === 'select') {
      return (
        <select
          className="select select-bordered select-sm w-full"
          value={filters[column.key] ?? ''}
          onChange={(e) => handleFilterChange(column.key, e.target.value)}
        >
          <option value="">Todos</option>
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      )
    }

    if (filterType === 'combobox') {
      return (
        <>
          <input
            type="text"
            list={`datalist-${column.key}`}
            placeholder={column.filterPlaceholder ?? `Filtrar ${column.header.toLowerCase()}...`}
            className="input input-bordered input-sm w-full"
            value={filters[column.key] ?? ''}
            onChange={(e) => handleFilterChange(column.key, e.target.value)}
          />
          <datalist id={`datalist-${column.key}`}>
            {options.map((opt) => (
              <option key={opt} value={opt} />
            ))}
          </datalist>
        </>
      )
    }

    // text (default)
    return (
      <input
        type="text"
        placeholder={`Buscar ${column.searchPlaceholder ?? column.header.toLowerCase()}...`}
        className="input input-bordered input-sm w-full"
        value={filters[column.key] ?? ''}
        onChange={(e) => handleFilterChange(column.key, e.target.value)}
      />
    )
  }

  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold md:text-3xl">{title}</h1>
        <button type="button" className="btn btn-primary btn-sm gap-2" onClick={onAdd}>
          <FaPlus className="size-3" />
          {addLabel}
        </button>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-base-content/70">
          Mostrando <span className="font-semibold">{perPage}</span> {entityLabel} de{' '}
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

      <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
        <table className="table">
          <thead>
            <tr className="bg-base-200 text-sm">
              {columns.map((column) => (
                <th key={column.key}>{column.header}</th>
              ))}
              <th className="text-center">Acciones</th>
            </tr>
            <tr className="bg-base-200 text-sm">
              {columns.map((column) => (
                <th key={column.key}>
                  {column.searchable || column.filterable ? renderFilterControl(column) : null}
                </th>
              ))}
              <th className="text-center">
                <button
                  type="button"
                  className="btn btn-ghost btn-sm btn-xs gap-1 text-base-content/60 hover:text-base-content"
                  onClick={handleClearFilters}
                  disabled={!hasActiveFilters}
                  title="Limpiar todos los filtros"
                >
                  <FaTimes className="size-3" />
                  Limpiar
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {visibleRows.map((row) => (
              <tr key={row.id} className="hover">
                {columns.map((column) => (
                  <td key={column.key}>{column.render ? column.render(row) : row[column.key]}</td>
                ))}
                <td>
                  <div className="flex items-center justify-center gap-2">
                    {actions.map((action) => (
                      <button
                        key={action.label}
                        type="button"
                        className={action.className}
                        aria-label={action.label}
                        onClick={() => action.onClick(row)}
                      >
                        {action.icon}
                      </button>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
            {visibleRows.length === 0 && (
              <tr>
                <td colSpan={columns.length + 1} className="py-8 text-center text-base-content/50">
                  No se encontraron {entityLabel} para mostrar.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-center gap-1">
        <button
          type="button"
          className="btn btn-ghost btn-xs"
          disabled={safePage <= 1}
          onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
          aria-label="Página anterior"
        >
          <FaChevronLeft className="size-3" />
        </button>

        {visiblePageNumbers.map((page) => (
          <button
            key={page}
            type="button"
            className={`btn btn-xs ${safePage === page ? 'btn-active btn-primary' : 'btn-ghost'}`}
            onClick={() => setCurrentPage(page)}
          >
            {page}
          </button>
        ))}

        <button
          type="button"
          className="btn btn-ghost btn-xs"
          disabled={safePage >= totalPages}
          onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
          aria-label="Página siguiente"
        >
          <FaChevronRight className="size-3" />
        </button>
      </div>
    </section>
  )
}

export default DataTable
