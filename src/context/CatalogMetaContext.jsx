import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { catalogoApi } from '../services/catalogoApi'

const DEFAULT_GENEROS = [
  'Acción',
  'Aventura',
  'Ciencia ficción',
  'Comedia',
  'Documental',
  'Drama',
  'Fantasía',
  'Musical',
  'Romance',
  'Suspenso',
  'Terror',
]

const DEFAULT_CLASIFICACIONES = ['G', 'PG', 'PG-13', 'R', 'NC-17', 'Unrated']

const DEFAULT_ESTADOS = ['Estreno', 'Pre-venta', 'En cartelera', 'Próximamente', 'No disponible']

const DEFAULT_CIUDADES = ['Santiago', 'Viña del Mar']

function load(key, fallback) {
  try {
    const raw = window.localStorage.getItem(key)
    if (!raw) return fallback
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : fallback
  } catch {
    return fallback
  }
}

const CatalogMetaContext = createContext(null)

export function CatalogMetaProvider({ children }) {
  const [generos, setGeneros] = useState(() => load('cine_generos', DEFAULT_GENEROS))
  const [clasificaciones, setClasificaciones] = useState(() =>
    load('cine_clasificaciones', DEFAULT_CLASIFICACIONES)
  )
  const [ciudades, setCiudades] = useState(() => load('cine_ciudades', DEFAULT_CIUDADES))

  // Sincroniza con backend si está disponible (sin Gateway, directo 8081); fallback a localStorage/defaults
  useEffect(() => {
    let cancelled = false
    catalogoApi.getGeneros().then((data) => {
      if (!cancelled && Array.isArray(data) && data.length > 0) setGeneros(data)
    }).catch(() => {})
    catalogoApi.getClasificaciones().then((data) => {
      if (!cancelled && Array.isArray(data) && data.length > 0) setClasificaciones(data)
    }).catch(() => {})
    catalogoApi.getEstados().then((data) => {
      // estados es estático, no se setea, solo para validar que backend responde
    }).catch(() => {})
    return () => { cancelled = true }
  }, [])

  useEffect(() => {
    try {
      window.localStorage.setItem('cine_generos', JSON.stringify(generos))
    } catch {
      // ignore
    }
  }, [generos])

  useEffect(() => {
    try {
      window.localStorage.setItem('cine_clasificaciones', JSON.stringify(clasificaciones))
    } catch {
      // ignore
    }
  }, [clasificaciones])

  useEffect(() => {
    try {
      window.localStorage.setItem('cine_ciudades', JSON.stringify(ciudades))
    } catch {
      // ignore
    }
  }, [ciudades])

  const addGenero = useCallback(async (nombre) => {
    const clean = String(nombre).trim()
    if (!clean) return false
    const exists = generos.some((g) => g.toLowerCase() === clean.toLowerCase())
    if (exists) return false
    try {
      await catalogoApi.createGenero(clean)
    } catch (e) {
      // si backend no disponible o 409, igual persistir local para MVP sin backend
      if (!String(e.message).includes('ya existe')) {
        // fallback local si backend caído
      } else return false
    }
    setGeneros((prev) => [...prev, clean])
    return true
  }, [generos])

  const addClasificacion = useCallback(async (nombre) => {
    const clean = String(nombre).trim()
    if (!clean) return false
    const exists = clasificaciones.some((c) => c.toLowerCase() === clean.toLowerCase())
    if (exists) return false
    try {
      await catalogoApi.createClasificacion(clean)
    } catch (e) {
      if (String(e.message).includes('ya existe')) return false
    }
    setClasificaciones((prev) => [...prev, clean])
    return true
  }, [clasificaciones])

  const addCiudad = useCallback((nombre) => {
    const clean = String(nombre).trim()
    if (!clean) return false
    const exists = ciudades.some((c) => c.toLowerCase() === clean.toLowerCase())
    if (exists) return false
    setCiudades((prev) => [...prev, clean])
    return true
  }, [ciudades])

  const value = {
    generos,
    clasificaciones,
    ciudades,
    estados: DEFAULT_ESTADOS,
    addGenero,
    addClasificacion,
    addCiudad,
  }

  return <CatalogMetaContext.Provider value={value}>{children}</CatalogMetaContext.Provider>
}

export function useCatalogMeta() {
  const ctx = useContext(CatalogMetaContext)
  if (!ctx) throw new Error('useCatalogMeta debe usarse dentro de CatalogMetaProvider')
  return ctx
}

export const CATALOG_DEFAULTS = {
  generos: DEFAULT_GENEROS,
  clasificaciones: DEFAULT_CLASIFICACIONES,
  ciudades: DEFAULT_CIUDADES,
  estados: DEFAULT_ESTADOS,
}
