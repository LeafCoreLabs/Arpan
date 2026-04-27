import { apiClient } from '../../../services/apiClient.js'

export async function loginRequest(payload) {
  const formData = new URLSearchParams();
  formData.append('username', payload.email);
  formData.append('password', payload.password);

  const { data } = await apiClient.post('/api/v1/auth/login', formData, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  })

  return {
    token: data.access_token,
    user: data.user  // { id, email, name, role } from the backend
  }
}

export async function meRequest() {
  const { data } = await apiClient.get('/api/v1/auth/me')
  return data
}

export function persistToken(token) {
  if (token) localStorage.setItem('token', token)
  else localStorage.removeItem('token')
}
