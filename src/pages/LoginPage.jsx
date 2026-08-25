import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router'
import { useAuth } from '../context/AuthContext'

function LoginPage() {
  const { user, login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  if (user) {
    return <Navigate to="/panel-inicio" replace />
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    setError('')
    if (login({ email, password })) {
      navigate('/panel-inicio', { replace: true })
    } else {
      setError('Credenciales incorrectas. Verifica tu correo y contraseña.')
    }
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
          <form onSubmit={handleSubmit} className="space-y-4">
            <fieldset className="fieldset">
              <legend className="fieldset-legend">Correo electrónico</legend>
              <input
                type="email"
                className="input w-full"
                placeholder="correo@cine.cl"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="email"
                required
              />
            </fieldset>
            <fieldset className="fieldset">
              <legend className="fieldset-legend">Contraseña</legend>
              <input
                type="password"
                className="input w-full"
                placeholder="••••••••"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="current-password"
                required
              />
            </fieldset>
            {error && (
              <div role="alert" className="alert alert-error alert-soft text-sm">
                <span>{error}</span>
              </div>
            )}
            <button type="submit" className="btn btn-primary w-full">
              Iniciar sesión
            </button>
          </form>
        </div>
      </section>
    </main>
  )
}

export default LoginPage
