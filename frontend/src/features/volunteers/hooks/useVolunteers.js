import { useQuery } from '@tanstack/react-query'
import { fetchVolunteers } from '../api/volunteers.api.js'

export function useVolunteers(filters = {}) {
  return useQuery({
    queryKey: ['volunteers', filters],
    queryFn: () => fetchVolunteers(filters),
  })
}
