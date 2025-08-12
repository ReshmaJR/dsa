import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const AuthContext = createContext(null)

const LOCAL_STORAGE_KEY = 'dsa_portal_user'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY)
    if (raw) setUser(JSON.parse(raw))
  }, [])

  const login = (email, password) => {
    // Demo-only: accept any email/password that exists in localStorage users map
    const usersMapRaw = localStorage.getItem('dsa_portal_users')
    const usersMap = usersMapRaw ? JSON.parse(usersMapRaw) : {}
    const existing = usersMap[email]
    if (!existing || existing.password !== password) {
      throw new Error('Invalid credentials')
    }
    const profile = { email, name: existing.name }
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(profile))
    setUser(profile)
  }

  const logout = () => {
    localStorage.removeItem(LOCAL_STORAGE_KEY)
    setUser(null)
  }

  const signup = (name, email, password) => {
    const usersMapRaw = localStorage.getItem('dsa_portal_users')
    const usersMap = usersMapRaw ? JSON.parse(usersMapRaw) : {}
    if (usersMap[email]) {
      throw new Error('User already exists')
    }
    usersMap[email] = { name, password }
    localStorage.setItem('dsa_portal_users', JSON.stringify(usersMap))
    const profile = { email, name }
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(profile))
    setUser(profile)
  }

  const value = useMemo(() => ({ user, login, logout, signup }), [user])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}