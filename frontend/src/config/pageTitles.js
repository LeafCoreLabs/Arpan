import { ROUTES } from './routes.js'

export function titleForPath(pathname) {
  const p = [
    [ROUTES.DASHBOARD, 'Overview'],
    [ROUTES.DATA_COLLECTION, 'Data collection'],
    [ROUTES.NEEDS, 'Community needs'],
    [ROUTES.VOLUNTEERS, 'Volunteer management'],
    [ROUTES.MAP, 'Map view'],
    [ROUTES.AI_MATCHING, 'AI Matching'],
    [ROUTES.NOTIFICATIONS, 'Notifications'],
    [ROUTES.REPORTS, 'Reports'],
  ]
  for (const [path, label] of p) {
    if (pathname === path) return label
  }
  return 'Arpan | अर्पण'
}
