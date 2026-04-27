import { useCallback, useState } from 'react'

export function usePagination({ initialPage = 1, pageSize = 10 } = {}) {
  const [page, setPage] = useState(initialPage)
  const reset = useCallback(() => setPage(initialPage), [initialPage])
  return { page, pageSize, setPage, reset }
}
