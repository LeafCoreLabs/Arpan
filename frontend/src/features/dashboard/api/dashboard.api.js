import { apiClient } from '../../../services/apiClient.js'

/**
 * GET /dashboard/summary — optional fields the AidFlow overview uses:
 * - metrics: { id?, label, value, trend?, sublabel?, trendPositive?, tone? }[]
 * - needsSnapshot: { id, location, issueType, severity, status, assignedTo }[]
 * - liveActivity: { id, kind: 'success'|'alert'|'user'|string, text, time? }[]
 * - aiMatch: { name, match: 0-1, skills?: string[] }
 */
export async function fetchDashboardSummary() {
  const { data } = await apiClient.get('/api/dashboard/summary')
  return data
}
