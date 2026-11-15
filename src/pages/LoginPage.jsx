import { Navigate } from 'react-router'
import { FaMicrosoft } from 'react-icons/fa'
import { useAuth } from '../context/AuthContext'

function LoginPage() {
  const { user, login, loading, authError } = useAuth()

  if (user) {
    return <Navigate to="/panel-inicio" replace />
  }

  return (
    <main className="hero min-h-screen bg-base-200">
      <section className="card w-full max-w-md bg-base-100 shadow-xl">
        <div className="card-body gap-8">
          <header className="space-y-2 text-center">
            <h1 className="text-3xl font-bold">Cine Admin</h1>
            <p className="text-sm text-base-content/60">
              Acceso restringido a Super Administradores y Administradores de Sucursal
            </p>
          </header>
          {authError && (
            <div role="alert" className="alert alert-error alert-soft text-sm">
              <span>{authError}</span>
            </div>
          )}
          <div className="space-y-3">
            <button
              type="button"
              className="btn btn-primary w-full gap-2"
              onClick={login}
              disabled={loading}
            >
              {loading && <span className="loading loading-spinner loading-sm" />}
              <FaMicrosoft className="size-4" />
              Iniciar sesión con Microsoft
            </button>
            <p className="text-center text-xs text-base-content/50">
              Inicia sesión con tu cuenta institucional de Microsoft (Entra ID)
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}

export default LoginPage