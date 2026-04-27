import { useQuery } from '@tanstack/react-query'
import { fetchMapPoints } from '../api/map.api.js'

export function useMapData(bounds) {
  return useQuery({
    queryKey: ['map', 'points', bounds],
    queryFn: () => fetchMapPoints({ bounds }),
    enabled: Boolean(bounds),
  })
}
