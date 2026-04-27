import { apiClient } from '../../../services/apiClient.js'

export async function fetchReportSummary() {
  const { data } = await apiClient.get('/api/reports/summary')
  return data
}
