import { Button } from './Button.jsx'

export function Pagination({ page, pageSize, total, onPageChange }) {
  const totalPages = Math.max(1, Math.ceil((total ?? 0) / pageSize))
  const canPrev = page > 1
  const canNext = page < totalPages
  return (
    <nav className="pagination" aria-label="Pagination">
      <Button type="button" variant="secondary" disabled={!canPrev} onClick={() => onPageChange(page - 1)}>
        Previous
      </Button>
      <span className="pagination__status">
        Page {page} of {totalPages}
      </span>
      <Button type="button" variant="secondary" disabled={!canNext} onClick={() => onPageChange(page + 1)}>
        Next
      </Button>
    </nav>
  )
}
