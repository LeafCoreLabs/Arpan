import axios from 'axios'
import env from '../config/env.js'

export const apiClient = axios.create({
  baseURL: env.VITE_API_URL || undefined,
  timeout: 30_000,
  headers: { 'Content-Type': 'application/json' },
})

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

apiClient.interceptors.response.use(
  (r) => r,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      if (window.location.pathname !== '/login') {
        window.location.assign('/login')
      }
    }
    const message = err.response?.data?.detail ?? err.response?.data?.message ?? err.message ?? 'Request failed'
    return Promise.reject(new Error(message))
  }
)

export default apiClient
