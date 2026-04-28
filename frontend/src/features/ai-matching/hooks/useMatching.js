import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { fetchMatches, postAssignment } from '../api/matching.api.js'
import { toast } from 'sonner'

export function useMatching(filters = {}) {
  return useQuery({
    queryKey: ['matching', 'suggestions', filters],
    queryFn: () => fetchMatches(filters),
    staleTime: 2 * 60_000,
  })
}

export function useAssignMatch() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: postAssignment,
    onSuccess: (data, variables) => {
      const action = variables.action || 'accept'
      if (action === 'reject') {
        toast.info('Match rejected')
      } else {
        toast.success(data?.message || 'Volunteer assigned successfully')
      }
      qc.invalidateQueries({ queryKey: ['matching'] })
      qc.invalidateQueries({ queryKey: ['tasks'] })
      qc.invalidateQueries({ queryKey: ['dashboard'] })
      qc.invalidateQueries({ queryKey: ['needs'] })
      qc.invalidateQueries({ queryKey: ['volunteers'] })
    },
    onError: (err) => {
      toast.error(err?.response?.data?.detail || err?.message || 'Failed to process match')
    },
  })
}
