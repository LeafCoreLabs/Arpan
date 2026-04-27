import { useMutation, useQuery } from '@tanstack/react-query'
import { fetchMatches, postAssignment } from '../api/matching.api.js'

export function useMatching(filters = {}) {
  return useQuery({
    queryKey: ['matching', 'suggestions', filters],
    queryFn: () => fetchMatches(filters),
  })
}

export function useAssignMatch() {
  return useMutation({ mutationFn: postAssignment })
}
