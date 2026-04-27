/**
 * @param {unknown} v
 * @returns {string}
 */
export function emptyAsDash(v) {
  if (v == null || v === '') return '—'
  return String(v)
}

/**
 * Maps API /dashboard/summary (or your contract) to Arpan metric row props.
 * Expects: metrics: Array<{ id?, label, value, trend?, sublabel?, trendPositive?, tone? }>
 */
export function buildArpanMetrics(data) {
  const raw = data?.metrics
  if (!Array.isArray(raw) || !raw.length) return []
  return raw.map((m, i) => ({
    id: m.id ?? `m-${i}`,
    label: m.label,
    value: m.value,
    sublabel: m.sublabel ?? m.trend,
    trendPositive: m.trendPositive,
    tone: m.tone,
  }))
}

export function getNeedsSnapshot(data) {
  const list = data?.needsSnapshot ?? data?.communityNeeds ?? data?.needsPreview
  if (!Array.isArray(list)) return []
  return list.map((r, i) => ({
    id: r.id ?? `need-${i}`,
    location: r.location,
    issueType: r.issueType ?? r.type,
    severity: r.severity,
    status: r.status,
    assignedTo: r.assignedTo ?? r.assigned,
    assignedAvatar: r.assignedAvatar
  }))
}

export function getLiveActivity(data) {
  const list = data?.liveActivity ?? data?.activity
  if (!Array.isArray(list)) return []
  return list.map((a, i) => ({
    id: a.id ?? `a-${i}`,
    kind: a.kind,
    text: a.text,
    time: a.time,
  }))
}

export function getAiMatch(data) {
  const match = data?.aiMatch ?? data?.suggestedMatch ?? null
  if (!match) return null
  return {
    ...match,
    subtitle: match.subtitle,
    avatar: match.avatar
  }
}
