import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createContext, useContext, useLayoutEffect, useMemo, useState, useEffect } from 'react'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 60_000, retry: 1, refetchOnWindowFocus: false },
  },
})

const ThemeContext = createContext({ theme: 'light', setTheme: () => {} })
const AuthContext = createContext({ user: null, setUser: () => {}, logout: () => {}, isLoading: true })

export function useTheme() {
  return useContext(ThemeContext)
}

export function useAuth() {
  return useContext(AuthContext)
}

export function AppProviders({ children }) {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') ?? 'light')
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Attempt to hydrate user from localStorage on mount
    const savedUser = localStorage.getItem('user')
    const token = localStorage.getItem('token')
    
    if (savedUser && token) {
      try {
        setUser(JSON.parse(savedUser))
      } catch (e) {
        console.error("Failed to parse user from storage", e)
        localStorage.removeItem('user')
        localStorage.removeItem('token')
      }
    }
    setIsLoading(false)
  }, [])

  useLayoutEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  const themeValue = useMemo(
    () => ({
      theme,
      setTheme: (t) => {
        const next = typeof t === 'function' ? t(theme) : t
        setTheme(next)
        localStorage.setItem('theme', next)
        document.documentElement.dataset.theme = next
      },
    }),
    [theme]
  )

  const authValue = useMemo(
    () => ({
      user,
      isLoading,
      setUser: (u) => {
        setUser(u)
        if (u) {
          localStorage.setItem('user', JSON.stringify(u))
        } else {
          localStorage.removeItem('user')
          localStorage.removeItem('token')
        }
      },
      logout: () => {
        setUser(null)
        localStorage.removeItem('user')
        localStorage.removeItem('token')
      },
    }),
    [user, isLoading]
  )

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeContext.Provider value={themeValue}>
        <AuthContext.Provider value={authValue}>{children}</AuthContext.Provider>
      </ThemeContext.Provider>
    </QueryClientProvider>
  )
}
