import { apiClient } from '../../../services/apiClient.js'

export async function fetchVolunteers(params) {
  const { data } = await apiClient.get('/api/volunteers', { params })
  return data
}
