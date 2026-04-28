import { apiClient } from '../../../services/apiClient.js'

export async function fetchNotifications(params) {
  const { data } = await apiClient.get('/api/notifications', { params })
  return data
}

export async function markRead(id) {
  const { data } = await apiClient.post(`/api/notifications/${id}/read`)
  return data
}
