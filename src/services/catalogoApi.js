const API_URL = import.meta.env.VITE_CATALOGO_API_URL || 'http://localhost:8081/api'

async function handleResponse(res) {
  if (!res.ok) {
    const text = await res.text()
    let msg = text
    try {
      const json = JSON.parse(text)
      msg = json.error || json.message || text
    } catch {
      // keep text
    }
    throw new Error(msg || `Error ${res.status}`)
  }
  if (res.status === 204) return null
  return res.json()
}

export const catalogoApi = {
  // Películas
  getPeliculas: async (params = {}) => {
    const qs = new URLSearchParams()
    if (params.search) qs.set('search', params.search)
    if (params.genero) qs.set('genero', params.genero)
    if (params.clasificacion) qs.set('rating', params.clasificacion)
    if (params.estado) qs.set('estado', params.estado)
    const url = `${API_URL}/peliculas${qs.toString() ? `?${qs}` : ''}`
    const res = await fetch(url)
    return handleResponse(res)
  },
  getPeliculaById: async (id) => {
    const res = await fetch(`${API_URL}/peliculas/${id}`)
    return handleResponse(res)
  },
  getPeliculaBySlug: async (slug) => {
    const res = await fetch(`${API_URL}/peliculas/slug/${slug}`)
    return handleResponse(res)
  },
  createPelicula: async (payload) => {
    const res = await fetch(`${API_URL}/peliculas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    return handleResponse(res)
  },
  updatePelicula: async (id, payload) => {
    const res = await fetch(`${API_URL}/peliculas/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    return handleResponse(res)
  },
  deletePelicula: async (id) => {
    const res = await fetch(`${API_URL}/peliculas/${id}`, { method: 'DELETE' })
    return handleResponse(res)
  },

  // Taxonomías
  getGeneros: async () => {
    const res = await fetch(`${API_URL}/generos`)
    return handleResponse(res)
  },
  createGenero: async (nombre) => {
    const res = await fetch(`${API_URL}/generos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre }),
    })
    return handleResponse(res)
  },
  getClasificaciones: async () => {
    const res = await fetch(`${API_URL}/clasificaciones`)
    return handleResponse(res)
  },
  createClasificacion: async (nombre) => {
    const res = await fetch(`${API_URL}/clasificaciones`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre }),
    })
    return handleResponse(res)
  },
  getEstados: async () => {
    const res = await fetch(`${API_URL}/estados`)
    return handleResponse(res)
  },
}
