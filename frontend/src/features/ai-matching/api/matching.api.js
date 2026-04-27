import { apiClient } from '../../../services/apiClient.js'

export async function fetchMatches(params) {
  const { data } = await apiClient.get('/api/ai-matching/suggestions', { params })
  return data
}

export async function postAssignment(payload) {
  const { data } = await apiClient.post('/api/ai-matching/assign', payload)
  return data
}
