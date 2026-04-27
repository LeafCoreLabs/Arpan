import { apiClient } from '../../../services/apiClient.js'

export async function fetchNeeds(params) {
  const { data } = await apiClient.get('/needs', { params })
  return data
}

export async function fetchNeedById(id) {
  const { data } = await apiClient.get(`/needs/${id}`)
  return data
}
