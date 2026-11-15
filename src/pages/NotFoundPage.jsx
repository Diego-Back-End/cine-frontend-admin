import { Link } from 'react-router'

function NotFoundPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-base-200 px-4 text-center">
      <p className="text-7xl font-black text-primary">404</p>
      <h1 className="text-xl font-semibold">Página no encontrada</h1>
      <p className="max-w-sm text-sm text-base-content/60">
        La página que buscas no existe o fue movida.
      </p>
      <Link to="/" className="btn btn-primary">
        Volver al inicio
      </Link>
    </main>
  )
}

export default NotFoundPage
