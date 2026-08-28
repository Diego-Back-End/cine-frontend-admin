import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { InteractionStatus } from '@azure/msal-browser'
import { useMsal } from '@azure/msal-react'
import { loginRequest } from '../auth/msalConfig'

export const ROLES = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  BRANCH_ADMIN: 'BRANCH_ADMIN',
}

export const ROLE_LABELS = {
  [ROLES.SUPER_ADMIN]: 'Super Administrador',
  [ROLES.BRANCH_ADMIN]: 'Administrador de Sucursal',
}

const SESSION_KEY = 'cine-admin-session'

function resolveRole(claims) {
  const superAdminId = import.meta.env.VITE_SUPER_ADMIN_ROLE_ID
  const branchAdminId = import.meta.env.VITE_BRANCH_ADMIN_ROLE_ID
  const identifiers = [...(claims.groups ?? []), ...(claims.roles ?? [])]
  if (superAdminId && identifiers.includes(superAdminId)) return ROLES.SUPER_ADMIN
  if (branchAdminId && identifiers.includes(branchAdminId)) return ROLES.BRANCH_ADMIN
  return null
}

function resolveEmail(claims, account) {
  return claims.preferred_username || claims.email || account.username || null
}

function mapAccountToUser(account) {
  const claims = account.idTokenClaims ?? {}
  const role = resolveRole(claims)
  const email = resolveEmail(claims, account)
  if (!role || !email) return null
  return { email, role }
}

function readStoredUser() {
  try {
    const stored = window.localStorage.getItem(SESSION_KEY)
    return stored ? JSON.parse(stored) : null
  } catch {
    return null
  }
}

function removeStoredUser() {
  try {
    window.localStorage.removeItem(SESSION_KEY)
  } catch {
    return
  }
}

function storeUser(user) {
  try {
    window.localStorage.setItem(SESSION_KEY, JSON.stringify(user))
  } catch {
    return
  }
}

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const { instance, inProgress } = useMsal()
  const [user, setUser] = useState(readStoredUser)
  const [loading, setLoading] = useState(true)
  const [authError, setAuthError] = useState('')

  useEffect(() => {
    let mounted = true
    instance
      .handleRedirectPromise()
      .then(() => {
        if (!mounted) return
        const account = instance.getActiveAccount() ?? instance.getAllAccounts()[0]

        if (!account) {
          setUser(null)
          removeStoredUser()
          setLoading(false)
          return
        }

        instance.setActiveAccount(account)

        const mappedUser = mapAccountToUser(account)
        if (!mappedUser) {
          setUser(null)
          removeStoredUser()
          setAuthError(
            'Tu cuenta no tiene un rol asignado en este panel. Contacta al administrador.',
          )
          setLoading(false)
          return
        }

        setUser(mappedUser)
        storeUser(mappedUser)
        setAuthError('')
        setLoading(false)
      })
      .catch((error) => {
        console.error('[Auth] Error al procesar el redirect:', error)
        setAuthError('No se pudo completar la autenticación. Inténtalo nuevamente.')
        setLoading(false)
      })

    return () => {
      mounted = false
    }
  }, [instance])

  const login = useCallback(() => {
    setAuthError('')
    instance.loginRedirect(loginRequest)
  }, [instance])

  const logout = useCallback(() => {
    setUser(null)
    setAuthError('')
    removeStoredUser()
    instance.logoutRedirect()
  }, [instance])

  const value = useMemo(
    () => ({
      user,
      login,
      logout,
      loading: inProgress === InteractionStatus.Login || inProgress === InteractionStatus.AcquireToken || loading,
      authError,
    }),
    [user, login, logout, loading, authError, inProgress],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth debe utilizarse dentro de AuthProvider')
  }
  return context
}