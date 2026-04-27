import { useMemo } from 'react'
import { Sparkles, RefreshCcw } from 'lucide-react'
import { ErrorState } from '../../../components/common/ErrorState.jsx'
import { Loader } from '../../../components/ui/Loader.jsx'
import { extractList } from '../../../utils/apiResponse.js'
import { useAssignMatch, useMatching } from '../hooks/useMatching.js'
import { MatchCard } from '../components/MatchCard.tsx'
import { UnmatchedNeedCard } from '../components/UnmatchedNeedCard.tsx'
import { KPICard } from '../components/KPICard.tsx'
import { AlertPanel } from '../components/AlertPanel.tsx'
import { ModelControlPanel } from '../components/ModelControlPanel.tsx'
import { VolunteerUtilization } from '../components/VolunteerUtilization.tsx'
import { ActivityFeedItem } from '../components/ActivityFeedItem.tsx'

const SEVERITIES = new Set(['low', 'medium', 'high', 'critical'])
const STATUSES = new Set(['suggested', 'assigned', 'rejected'])

function normalizeSeverity(value) {
  const v = String(value ?? 'medium').toLowerCase()
  return SEVERITIES.has(v) ? v : 'medium'
}

function normalizeStatus(value) {
  const v = String(value ?? 'suggested').toLowerCase()
  return STATUSES.has(v) ? v : 'suggested'
}

function listFromPayload(payload, ...keys) {
  for (const key of keys) {
    const v = payload?.[key]
    if (Array.isArray(v)) return v
  }
  return extractList(payload ?? {})
}

function toMatchCardModel(raw, index) {
  const id = String(raw?.id ?? raw?.match_id ?? `match-${index}`)
  return {
    id,
    needTitle: raw?.needTitle ?? raw?.need_title ?? raw?.title ?? 'Untitled need',
    location: raw?.location ?? raw?.city ?? '—',
    severity: normalizeSeverity(raw?.severity),
    peopleAffected: Number(raw?.peopleAffected ?? raw?.people_affected ?? 0),
    volunteerName: raw?.volunteerName ?? raw?.volunteer_name ?? raw?.volunteer?.name ?? '—',
    skills: Array.isArray(raw?.skills) ? raw.skills : [],
    distance: raw?.distance != null ? String(raw.distance) : raw?.distance_label ?? '—',
    availability: raw?.availability ?? raw?.availability_label ?? '—',
    matchScore: Number(raw?.matchScore ?? raw?.match_score ?? 0),
    skillMatch: Number(raw?.skillMatch ?? raw?.skill_match ?? 0),
    distanceScore: Number(raw?.distanceScore ?? raw?.distance_score ?? 0),
    availabilityScore: Number(raw?.availabilityScore ?? raw?.availability_score ?? 0),
    performanceScore: Number(raw?.performanceScore ?? raw?.performance_score ?? 0),
    timeReported: raw?.timeReported ?? raw?.time_reported ?? raw?.reported_at ?? '—',
    status: normalizeStatus(raw?.status),
  }
}

function toUnmatchedNeed(raw, index) {
  return {
    id: String(raw?.id ?? raw?.need_id ?? `unmatched-${index}`),
    title: raw?.title ?? raw?.need_title ?? 'Need',
    location: raw?.location ?? raw?.city ?? '—',
    severity: normalizeSeverity(raw?.severity),
    reason: raw?.reason ?? raw?.unmatched_reason ?? 'No suitable volunteer found.',
  }
}

function toAlert(raw, index) {
  const type = ['critical', 'warning', 'info'].includes(raw?.type) ? raw.type : 'info'
  return {
    id: String(raw?.id ?? `alert-${index}`),
    type,
    message: raw?.message ?? String(raw?.text ?? 'Alert'),
    timestamp: raw?.timestamp ?? raw?.created_at ?? '',
  }
}

function toActivity(raw, index) {
  const type = raw?.type
  const allowed = ['match_generated', 'match_accepted', 'match_rejected', 'task_completed']
  return {
    id: String(raw?.id ?? `act-${index}`),
    type: allowed.includes(type) ? type : 'match_generated',
    needTitle: raw?.needTitle ?? raw?.need_title ?? '—',
    volunteerName: raw?.volunteerName ?? raw?.volunteer_name ?? '—',
    timestamp: raw?.timestamp ?? raw?.created_at ?? '',
  }
}

export default function AIMatchingPage() {
  const { data, isPending, isError, error, refetch } = useMatching()
  const assignMatch = useAssignMatch()

  const parsed = useMemo(() => {
    const payload = data && typeof data === 'object' && !Array.isArray(data) ? data : { suggestions: data }
    const matches = listFromPayload(payload, 'matches', 'suggestions', 'items').map(toMatchCardModel)
    const unmatched = listFromPayload(payload, 'unmatched', 'unmatched_needs', 'unmatchedNeeds').map(toUnmatchedNeed)
    const alerts = listFromPayload(payload, 'alerts', 'warnings').map(toAlert)
    const activities = listFromPayload(payload, 'activity', 'activities', 'recent_activity').map(toActivity)
    const utilization = payload.volunteer_utilization ?? payload.volunteerUtilization
    const kpis = payload.kpis ?? payload.stats
    return { matches, unmatched, alerts, activities, utilization, kpis }
  }, [data])

  const utilizationData = parsed.utilization ?? { overloaded: 0, underutilized: 0, optimal: 0 }

  if (isPending) return <Loader fullPage />
  if (isError) return <ErrorState message={error?.message} onRetry={() => refetch()} />

  const assignedCount = parsed.matches.filter(m => m.status === 'assigned').length
  const suggestedCount = parsed.matches.filter(m => m.status === 'suggested').length

  const kpiSuggested = parsed.kpis?.suggested_count ?? parsed.kpis?.suggestedCount ?? suggestedCount
  const kpiAssigned = parsed.kpis?.assigned_count ?? parsed.kpis?.assignedCount ?? assignedCount
  const kpiUnmatched = parsed.kpis?.unmatched_count ?? parsed.kpis?.unmatchedCount ?? parsed.unmatched.length

  return (
    <div className="af-dashboard">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '0 0 0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sparkles size={22} style={{ color: 'var(--af-orange)' }} /> AI Matching Engine
          </h1>
          <p style={{ color: 'var(--af-muted)', fontSize: '0.9rem', margin: 0 }}>
            Review model suggestions, tune weights, and assign volunteers to open needs.
          </p>
        </div>
        <button onClick={() => refetch()} className="btn btn--ghost"><RefreshCcw size={15} /> Re-run Matching</button>
      </div>

      {/* KPIs */}
      <div className="af-metrics">
        <KPICard title="Suggested" value={kpiSuggested} tone="warning" />
        <KPICard title="Assigned (session)" value={kpiAssigned} tone="success" />
        <KPICard title="Unmatched Needs" value={kpiUnmatched} tone="danger" />
      </div>

      {/* Main Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '1.5rem', alignItems: 'start' }}>
        {/* Left Column: Suggestions + Unmatched */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h2 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0 }}>
            Suggestions ({parsed.matches.length})
          </h2>

          {parsed.matches.length === 0 ? (
            <div className="empty-state">
              <Sparkles size={36} style={{ color: 'var(--af-muted)', marginBottom: '0.75rem' }} />
              <h3 className="empty-state__title">No suggestions yet</h3>
              <p className="empty-state__desc">When the AI model generates matches, they will appear here.</p>
            </div>
          ) : (
            parsed.matches.map(match => (
              <MatchCard
                key={match.id}
                match={match}
                onAccept={() => assignMatch.mutate({ matchId: match.id })}
                onReject={() => assignMatch.mutate({ matchId: match.id, action: 'reject' })}
                onReassign={() => refetch()}
                onViewDetails={() => {}}
              />
            ))
          )}

          {parsed.unmatched.length > 0 && (
            <div style={{ marginTop: '0.5rem' }}>
              <h2 style={{ fontSize: '1.05rem', fontWeight: 700, margin: '0 0 0.75rem' }}>
                Unmatched Needs ({parsed.unmatched.length})
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '0.75rem' }}>
                {parsed.unmatched.map(need => <UnmatchedNeedCard key={need.id} need={need} />)}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Controls + Utilization + Alerts + Activity */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <ModelControlPanel />
          <VolunteerUtilization data={utilizationData} />

          {parsed.alerts.length > 0 && (
            <div>
              <h3 style={{ fontSize: '0.9rem', fontWeight: 600, margin: '0 0 0.5rem' }}>Alerts</h3>
              <AlertPanel alerts={parsed.alerts} />
            </div>
          )}

          {parsed.activities.length > 0 && (
            <div className="af-card af-activity" style={{ padding: '1rem' }}>
              <h3 style={{ fontSize: '0.9rem', fontWeight: 600, margin: '0 0 0.75rem' }}>Recent Activity</h3>
              <ul className="af-activity__list" style={{ maxHeight: 'none' }}>
                {parsed.activities.map(activity => (
                  <ActivityFeedItem key={activity.id} activity={activity} />
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
