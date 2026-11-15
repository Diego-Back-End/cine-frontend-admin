import { slugify } from '../utils/slugify'

export const GENEROS = [
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

export const CLASIFICACIONES = ['G', 'PG', 'PG-13', 'R', 'NC-17', 'Unrated']

export const ESTADOS = ['Estreno', 'Pre-venta', 'En cartelera', 'Próximamente', 'No disponible']

const RAW = [
  {
    id: 1,
    title: 'Dune: Parte Dos',
    genre: 'Ciencia ficción',
    duration: 166,
    rating: 'PG-13',
    estado: 'En cartelera',
    sinopsis: 'Paul Atreides se une a los Fremen para vengar a su familia y evitar un futuro terrible.',
    poster: 'https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg',
  },
  {
    id: 2,
    title: 'Oppenheimer',
    genre: 'Drama',
    duration: 180,
    rating: 'R',
    estado: 'Estreno',
    sinopsis: 'La historia del científico que lideró el desarrollo de la bomba atómica.',
    poster: 'https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg',
  },
  {
    id: 3,
    title: 'Barbie',
    genre: 'Comedia',
    duration: 114,
    rating: 'PG-13',
    estado: 'En cartelera',
    sinopsis: 'Barbie y Ken viven en Barbieland hasta que descubren el mundo real.',
    poster: 'https://image.tmdb.org/t/p/w500/iuFNMS8U5cb6xfzi81QppLBM3hF.jpg',
  },
  {
    id: 4,
    title: 'The Batman',
    genre: 'Acción',
    duration: 176,
    rating: 'PG-13',
    estado: 'Próximamente',
    sinopsis: 'Batman se enfrenta a un asesino en serie que deja acertijos en Gotham.',
    poster: 'https://image.tmdb.org/t/p/w500/74xTEgt7R36Fpooo50r9T25onhq.jpg',
  },
  {
    id: 5,
    title: 'Spider-Man: Across the Spider-Verse',
    genre: 'Aventura',
    duration: 140,
    rating: 'PG',
    estado: 'En cartelera',
    sinopsis: 'Miles Morales viaja a través del multiverso y conoce a otros Spider-People.',
    poster: 'https://image.tmdb.org/t/p/w500/sh7Rg8Er3tCdSvSkJZoP7RVlL.jpg',
  },
  {
    id: 6,
    title: 'John Wick 4',
    genre: 'Acción',
    duration: 169,
    rating: 'R',
    estado: 'Pre-venta',
    sinopsis: 'John Wick descubre un camino para derrotar a la Alta Mesa.',
    poster: 'https://image.tmdb.org/t/p/w500/vZloFAK7NmvMGKE7VkF5UHaz0I.jpg',
  },
  {
    id: 7,
    title: 'Elementos',
    genre: 'Fantasía',
    duration: 103,
    rating: 'G',
    estado: 'Próximamente',
    sinopsis: 'En una ciudad donde los elementos viven juntos, una chispa cambiará todo.',
    poster: 'https://image.tmdb.org/t/p/w500/8riWcGNCRr1u1jDeKQuRGw3Jd.jpg',
  },
  {
    id: 8,
    title: 'Misión: Imposible - Sentencia mortal',
    genre: 'Acción',
    duration: 163,
    rating: 'PG-13',
    estado: 'En cartelera',
    sinopsis: 'Ethan Hunt y su equipo enfrentan una nueva amenaza global.',
    poster: 'https://image.tmdb.org/t/p/w500/NNxYkU70HPurnNCSiCjYAmhP2.jpg',
  },
  {
    id: 9,
    title: 'La Sirenita',
    genre: 'Fantasía',
    duration: 135,
    rating: 'PG',
    estado: 'No disponible',
    sinopsis: 'Ariel, la sirena más joven del rey Tritón, sueña con el mundo humano.',
    poster: 'https://image.tmdb.org/t/p/w500/ym1dxyOk4jFcSl4Q2zmRrA5BEEN.jpg',
  },
  {
    id: 10,
    title: 'Guardianes de la Galaxia Vol. 3',
    genre: 'Ciencia ficción',
    duration: 150,
    rating: 'PG-13',
    estado: 'En cartelera',
    sinopsis: 'Los Guardianes se embarcan en una misión para salvar a Rocket.',
    poster: 'https://image.tmdb.org/t/p/w500/r2J02Z2OpNTctfOSN1Ydgii51I.jpg',
  },
  {
    id: 11,
    title: 'Flash',
    genre: 'Acción',
    duration: 144,
    rating: 'PG-13',
    estado: 'Pre-venta',
    sinopsis: 'Barry Allen usa sus superpoderes para viajar en el tiempo y cambiar el pasado.',
    poster: 'https://image.tmdb.org/t/p/w500/rktDFPbfHfUbArZ6OOOKsXcv0Bm.jpg',
  },
  {
    id: 12,
    title: 'Tortugas Ninja: Caos Mutante',
    genre: 'Aventura',
    duration: 100,
    rating: 'PG',
    estado: 'Estreno',
    sinopsis: 'Las Tortugas Ninja enfrentan un ejército de mutantes en Nueva York.',
    poster: 'https://image.tmdb.org/t/p/w500/ueO9StLk2d4S1orV1R1t1Q1.jpg',
  },
]

export const MOCK_MOVIES_FULL = RAW.map((m) => ({
  ...m,
  slug: slugify(m.title),
}))

export function getPeliculaById(id) {
  return MOCK_MOVIES_FULL.find((m) => String(m.id) === String(id)) ?? null
}

export function getPeliculaBySlug(slug) {
  return MOCK_MOVIES_FULL.find((m) => m.slug === slug) ?? null
}
