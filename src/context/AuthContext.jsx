import { createContext, useContext, useEffect, useMemo, useState } from 'react'

export const ROLES = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  BRANCH_ADMIN: 'BRANCH_ADMIN',
}

export const ROLE_LABELS = {
  [ROLES.SUPER_ADMIN]: 'Super Administrador',
  [ROLES.BRANCH_ADMIN]: 'Administrador de Sucursal',
}

const SESSION_KEY = 'cine-admin-session'

const MOCK_ACCOUNTS = [
  {
    email: import.meta.env.VITE_SUPER_ADMIN_EMAIL,
    password: import.meta.env.VITE_SUPER_ADMIN_PASSWORD,
    role: ROLES.SUPER_ADMIN,
  },
  {
    email: import.meta.env.VITE_BRANCH_ADMIN_EMAIL,
    password: import.meta.env.VITE_BRANCH_ADMIN_PASSWORD,
    role: ROLES.BRANCH_ADMIN,
  },
]

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = window.localStorage.getItem(SESSION_KEY)
      if (!stored) return null
      const parsed = JSON.parse(stored)
      const email = typeof parsed?.email === 'string' ? parsed.email.trim().toLowerCase() : ''
      if (!email) return null
      const account = MOCK_ACCOUNTS.find(
        (candidate) => candidate.email && candidate.email.toLowerCase() === email,
      )
      if (!account) return null
      return { email: account.email, role: account.role }
    } catch {
      return null
    }
  })

  useEffect(() => {
    try {
      if (user) {
        window.localStorage.setItem(SESSION_KEY, JSON.stringify(user))
      } else {
        window.localStorage.removeItem(SESSION_KEY)
      }
    } catch {
      return
    }
  }, [user])

  const login = ({ email, password }) => {
    const normalizedEmail = email?.trim().toLowerCase()
    const account = MOCK_ACCOUNTS.find(
      (candidate) =>
        candidate.email &&
        candidate.password &&
        candidate.email.toLowerCase() === normalizedEmail &&
        candidate.password === password,
    )
    if (!account) return false
    setUser({ email: account.email, role: account.role })
    return true
  }

  const logout = () => setUser(null)

  const value = useMemo(() => ({ user, login, logout }), [user])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth debe utilizarse dentro de AuthProvider')
  }
  return context
}
