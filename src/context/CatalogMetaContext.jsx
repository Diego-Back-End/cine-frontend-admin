import { createContext, useCallback, useContext, useEffect, useState } from 'react'

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

  const addGenero = useCallback((nombre) => {
    const clean = String(nombre).trim()
    if (!clean) return false
    const exists = generos.some((g) => g.toLowerCase() === clean.toLowerCase())
    if (exists) return false
    setGeneros((prev) => [...prev, clean])
    return true
  }, [generos])

  const addClasificacion = useCallback((nombre) => {
    const clean = String(nombre).trim()
    if (!clean) return false
    const exists = clasificaciones.some((c) => c.toLowerCase() === clean.toLowerCase())
    if (exists) return false
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
