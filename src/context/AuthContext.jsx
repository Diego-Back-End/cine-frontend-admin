import { createContext, useCallback, useContext, useEffect, useMemo } from 'react'
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

function isDevMode() {
  const superAdminId = import.meta.env.VITE_SUPER_ADMIN_ROLE_ID
  const branchAdminId = import.meta.env.VITE_BRANCH_ADMIN_ROLE_ID
  return !superAdminId && !branchAdminId
}

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
  const role = isDevMode() ? ROLES.SUPER_ADMIN : resolveRole(claims)
  const email = resolveEmail(claims, account)
  if (!role || !email) return null
  return { email, role }
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
  const { instance, accounts, inProgress } = useMsal()

  const account = instance.getActiveAccount() ?? accounts[0] ?? null

  const user = useMemo(() => {
    if (!account) {
      removeStoredUser()
      return null
    }
    const mappedUser = mapAccountToUser(account)
    if (!mappedUser) {
      removeStoredUser()
      return null
    }
    storeUser(mappedUser)
    return mappedUser
  }, [account])

  const authError = useMemo(() => {
    if (!account) return ''
    if (!user) {
      return 'Tu cuenta no tiene un rol asignado en este panel. Contacta al administrador.'
    }
    return ''
  }, [account, user])

  const loading = useMemo(
    () =>
      inProgress === InteractionStatus.Login ||
      inProgress === InteractionStatus.AcquireToken ||
      inProgress === InteractionStatus.HandleRedirect,
    [inProgress],
  )

  useEffect(() => {
    if (account && inProgress === InteractionStatus.None) {
      instance.setActiveAccount(account)
    }
  }, [account, instance, inProgress])

  const login = useCallback(() => {
    instance.loginRedirect(loginRequest)
  }, [instance])

  const logout = useCallback(() => {
    instance.logoutRedirect()
  }, [instance])

  const value = useMemo(
    () => ({
      user,
      login,
      logout,
      loading,
      authError,
    }),
    [user, login, logout, loading, authError],
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
