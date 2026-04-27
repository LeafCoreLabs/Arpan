/**
 * Normalizes list endpoints that return a bare array, or `{ items }` / `{ data }` / etc.
 * Does not fabricate list entries.
 */
export function extractList(data) {
  if (data == null) return []
  if (Array.isArray(data)) return data
  const list = data.items ?? data.data ?? data.suggestions ?? data.notifications
  return Array.isArray(list) ? list : []
}
