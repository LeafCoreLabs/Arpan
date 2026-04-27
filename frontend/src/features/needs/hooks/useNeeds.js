import { useQuery } from '@tanstack/react-query'
import { fetchNeeds } from '../api/needs.api.js'

export function useNeeds(filters = {}) {
  return useQuery({
    queryKey: ['needs', filters],
    queryFn: () => fetchNeeds(filters),
  })
}
