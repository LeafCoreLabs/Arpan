import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createContext, useContext, useLayoutEffect, useMemo, useState, useEffect, useCallback } from 'react'
import { ChatBot } from '../components/common/ChatBot.jsx'
import { useWebSocket } from '../hooks/useWebSocket.js'
import { toast } from 'sonner'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60_000,
      gcTime: 10 * 60_000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
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

  const handleWsMessage = useCallback((data) => {
    if (data.type === 'notification') {
      toast.info(data.title || data.message || 'New notification')
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    } else if (data.type === 'task_assigned') {
      toast.success(data.message || 'New task assigned!')
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    } else if (data.type === 'need_escalated') {
      toast.warning(data.message || 'A need has been escalated')
      queryClient.invalidateQueries({ queryKey: ['needs', 'dashboard'] })
    }
  }, [])

  useWebSocket(user ? handleWsMessage : null)

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeContext.Provider value={themeValue}>
        <AuthContext.Provider value={authValue}>
          {children}
          {user && <ChatBot />}
        </AuthContext.Provider>
      </ThemeContext.Provider>
    </QueryClientProvider>
  )
}
