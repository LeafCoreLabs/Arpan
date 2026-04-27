import { useQuery } from '@tanstack/react-query'
import { fetchDashboardSummary } from '../api/dashboard.api.js'

export function useDashboard() {
  return useQuery({
    queryKey: ['dashboard', 'summary'],
    queryFn: fetchDashboardSummary,
  })
}
