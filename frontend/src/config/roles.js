/** Role keys used with auth / route guards */
export const ROLES = {
  ADMIN: 'admin',
  COORDINATOR: 'coordinator',
  VOLUNTEER: 'volunteer',
  VIEWER: 'viewer',
}

export function hasRole(userRoles, allowed) {
  if (!userRoles?.length) return false
  const set = new Set(userRoles)
  return allowed.some((r) => set.has(r))
}
