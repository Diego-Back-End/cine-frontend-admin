let raw = (import.meta.env.VITE_CATALOGO_API_URL || import.meta.env.VITE_API_URL || 'http://localhost:8081/api').replace(/\/+$/, '')
const API_URL = raw.endsWith('/api') ? raw : `${raw}/api`

// Inyectado desde AuthContext para desacoplar MSAL del servicio.
// Debe setearse en App.jsx / main.jsx una vez. Fallback: intenta leer token desde helper global.
let _getAccessToken = null

export function setCatalogoAuthProvider(fn) {
  _getAccessToken = fn
}

async function getAuthHeaders() {
  if (!_getAccessToken) return {}
  try {
    const token = await _getAccessToken()
    if (!token) return {}
    return { Authorization: `Bearer ${token}` }
  } catch {
    return {}
  }
}

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
    const auth = await getAuthHeaders()
    const res = await fetch(`${API_URL}/peliculas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...auth },
      body: JSON.stringify(payload),
    })
    return handleResponse(res)
  },
  updatePelicula: async (id, payload) => {
    const auth = await getAuthHeaders()
    const res = await fetch(`${API_URL}/peliculas/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...auth },
      body: JSON.stringify(payload),
    })
    return handleResponse(res)
  },
  deletePelicula: async (id) => {
    const auth = await getAuthHeaders()
    const res = await fetch(`${API_URL}/peliculas/${id}`, { method: 'DELETE', headers: { ...auth } })
    return handleResponse(res)
  },

  // Taxonomías
  getGeneros: async () => {
    const res = await fetch(`${API_URL}/generos`)
    return handleResponse(res)
  },
  createGenero: async (nombre) => {
    const auth = await getAuthHeaders()
    const res = await fetch(`${API_URL}/generos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...auth },
      body: JSON.stringify({ nombre }),
    })
    return handleResponse(res)
  },
  getClasificaciones: async () => {
    const res = await fetch(`${API_URL}/clasificaciones`)
    return handleResponse(res)
  },
  createClasificacion: async (nombre) => {
    const auth = await getAuthHeaders()
    const res = await fetch(`${API_URL}/clasificaciones`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...auth },
      body: JSON.stringify({ nombre }),
    })
    return handleResponse(res)
  },
  getEstados: async () => {
    const res = await fetch(`${API_URL}/estados`)
    return handleResponse(res)
  },
}
