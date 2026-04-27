export function isEmail(s) {
  if (!s || typeof s !== 'string') return false
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.trim())
}

export function required(value) {
  if (value == null) return 'Required'
  if (typeof value === 'string' && !value.trim()) return 'Required'
  return null
}
