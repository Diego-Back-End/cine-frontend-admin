import { Navigate, Outlet } from 'react-router'
import { useAuth } from '../context/AuthContext'

function ProtectedRoute({ roles }) {
  const { user } = useAuth()

  if (!user) {
    return <Navigate to="/" replace />
  }

  if (roles?.length > 0 && !roles.includes(user.role)) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-base-200 px-4">
        <div role="alert" className="alert alert-error max-w-md shadow-lg">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="size-6 shrink-0 stroke-current"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>No tienes permisos para acceder a esta sección.</span>
        </div>
      </main>
    )
  }

  return <Outlet />
}

export default ProtectedRoute
