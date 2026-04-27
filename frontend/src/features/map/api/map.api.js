import { apiClient } from '../../../services/apiClient.js'

export async function fetchMapPoints(params) {
  const { data } = await apiClient.get('/map/points', { params })
  return data
}
