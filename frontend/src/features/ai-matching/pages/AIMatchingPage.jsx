import { useMemo, useState } from 'react'
import { Sparkles, RefreshCcw, BrainCircuit, ShieldCheck, Zap, Filter } from 'lucide-react'
import { ErrorState } from '../../../components/common/ErrorState.jsx'
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
  return {
    id: String(raw?.id ?? raw?.match_id ?? `match-${index}`),
    needId: raw?.needId ?? raw?.need_id ?? '',
    volunteerId: raw?.volunteerId ?? raw?.volunteer_id ?? '',
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
    reason: raw?.reason ?? raw?.rationale ?? raw?.explanation ?? '',
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
  return { id: String(raw?.id ?? `alert-${index}`), type, message: raw?.message ?? String(raw?.text ?? 'Alert'), timestamp: raw?.timestamp ?? raw?.created_at ?? '' }
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

function SkeletonPulse({ width, height = '1rem', radius = '0.375rem', style }) {
  return (
    <div style={{
      width, height, borderRadius: radius,
      background: 'linear-gradient(90deg, var(--af-border) 25%, rgba(0,0,0,0.04) 50%, var(--af-border) 75%)',
      backgroundSize: '200% 100%',
      animation: 'shimmer 1.5s infinite',
      ...style,
    }} />
  )
}

function MatchCardSkeleton() {
  return (
    <div className="af-card" style={{ padding: 0, overflow: 'hidden' }}>
      <div style={{ height: 3, background: 'var(--af-border)' }} />
      <div style={{ padding: '1.15rem 1.25rem' }}>
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '0.85rem' }}>
          <div style={{ flex: 1 }}>
            <SkeletonPulse width="70%" height="1.1rem" style={{ marginBottom: '0.5rem' }} />
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <SkeletonPulse width="100px" height="0.75rem" />
              <SkeletonPulse width="80px" height="0.75rem" />
            </div>
          </div>
          <SkeletonPulse width="56px" height="56px" radius="50%" />
        </div>
        <SkeletonPulse width="100%" height="100px" radius="0.5rem" style={{ marginBottom: '0.85rem' }} />
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <SkeletonPulse width="50%" height="36px" radius="0.5rem" />
          <SkeletonPulse width="50%" height="36px" radius="0.5rem" />
        </div>
      </div>
    </div>
  )
}

export default function AIMatchingPage() {
  const { data, isPending, isError, error, refetch, isFetching } = useMatching()
  const assignMatch = useAssignMatch()
  const [severityFilter, setSeverityFilter] = useState('all')

  const parsed = useMemo(() => {
    const payload = data && typeof data === 'object' && !Array.isArray(data) ? data : { suggestions: data }
    const matches = listFromPayload(payload, 'matches', 'suggestions', 'items').map(toMatchCardModel)
    const unmatched = listFromPayload(payload, 'unmatched', 'unmatched_needs', 'unmatchedNeeds').map(toUnmatchedNeed)
    const alerts = listFromPayload(payload, 'alerts', 'warnings').map(toAlert)
    const activities = listFromPayload(payload, 'activity', 'activities', 'recent_activity').map(toActivity)
    const utilization = payload.volunteer_utilization ?? payload.volunteerUtilization
    const kpis = payload.kpis ?? payload.stats
    const source = payload.source ?? payload.provider ?? 'local-fallback'
    const model = payload.model ?? (source === 'gemini' ? 'gemini-3-flash-preview' : 'local-fallback')
    return { matches, unmatched, alerts, activities, utilization, kpis, source, model }
  }, [data])

  const filteredMatches = useMemo(() => {
    if (severityFilter === 'all') return parsed.matches
    return parsed.matches.filter(m => m.severity === severityFilter)
  }, [parsed.matches, severityFilter])

  if (isError) return <ErrorState message={error?.message} onRetry={() => refetch()} />

  const utilizationData = parsed.utilization ?? { overloaded: 0, underutilized: 0, optimal: 0 }
  const assignedCount = parsed.matches.filter(m => m.status === 'assigned').length
  const suggestedCount = parsed.matches.filter(m => m.status === 'suggested').length
  const kpiSuggested = parsed.kpis?.suggested_count ?? parsed.kpis?.suggestedCount ?? suggestedCount
  const kpiAssigned = parsed.kpis?.assigned_count ?? parsed.kpis?.assignedCount ?? assignedCount
  const kpiUnmatched = parsed.kpis?.unmatched_count ?? parsed.kpis?.unmatchedCount ?? parsed.unmatched.length

  return (
    <div className="af-dashboard">
      {/* Shimmer animation */}
      <style>{`@keyframes shimmer { 0% { background-position: 200% 0 } 100% { background-position: -200% 0 } }`}</style>

      {/* Header */}
      <div className="af-card" style={{
        padding: '1.25rem 1.5rem',
        background: 'linear-gradient(135deg, rgba(249,115,22,0.08) 0%, rgba(14,165,233,0.08) 50%, rgba(139,92,246,0.06) 100%)',
        border: '1px solid rgba(249,115,22,0.15)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.6rem' }}>
              <span style={{
                display: 'inline-flex', gap: '0.3rem', alignItems: 'center',
                fontSize: '0.68rem', fontWeight: 600, padding: '0.2rem 0.55rem', borderRadius: '9999px',
                background: parsed.source === 'gemini' ? 'rgba(22,163,74,0.1)' : 'rgba(234,179,8,0.1)',
                color: parsed.source === 'gemini' ? '#16a34a' : '#ca8a04',
                border: `1px solid ${parsed.source === 'gemini' ? 'rgba(22,163,74,0.25)' : 'rgba(234,179,8,0.25)'}`,
              }}>
                <BrainCircuit size={12} />
                {parsed.source === 'gemini' ? 'Gemini Live' : 'Local Engine'}
              </span>
              <span style={{
                fontSize: '0.65rem', color: 'var(--af-muted)',
                display: 'inline-flex', alignItems: 'center', gap: '0.25rem',
              }}>
                <ShieldCheck size={11} /> {parsed.model}
              </span>
            </div>
            <h1 style={{ fontSize: '1.55rem', fontWeight: 850, margin: '0 0 0.3rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Sparkles size={22} style={{ color: 'var(--af-orange)' }} /> AI Volunteer Matching
            </h1>
            <p style={{ color: 'var(--af-muted)', fontSize: '0.85rem', margin: 0, maxWidth: 640 }}>
              Intelligent need-to-volunteer assignment based on skills, proximity, availability, and past performance.
            </p>
          </div>
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="btn btn--primary"
            style={{ opacity: isFetching ? 0.6 : 1, gap: '0.4rem' }}
          >
            <RefreshCcw size={15} className={isFetching ? 'af-spin' : ''} />
            {isFetching ? 'Running...' : 'Re-run AI'}
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="af-metrics">
        <KPICard title="Suggested" value={isPending ? '—' : kpiSuggested} tone="warning" />
        <KPICard title="Assigned" value={isPending ? '—' : kpiAssigned} tone="success" />
        <KPICard title="Unmatched" value={isPending ? '—' : kpiUnmatched} tone="danger" />
      </div>

      {/* Main Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '1.25rem', alignItems: 'start' }}>
        {/* Left Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {/* Sub-header with filter */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Zap size={16} style={{ color: 'var(--af-orange)' }} />
              Recommendations
              {!isPending && (
                <span style={{
                  fontSize: '0.7rem', fontWeight: 600, padding: '0.1rem 0.45rem', borderRadius: '9999px',
                  background: 'rgba(14,165,233,0.1)', color: '#0284c7',
                }}>{filteredMatches.length}</span>
              )}
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Filter size={13} style={{ color: 'var(--af-muted)' }} />
              {['all', 'critical', 'high', 'medium', 'low'].map(sev => (
                <button key={sev} onClick={() => setSeverityFilter(sev)} style={{
                  fontSize: '0.68rem', fontWeight: 600, padding: '0.2rem 0.5rem', borderRadius: '9999px',
                  border: '1px solid', cursor: 'pointer', textTransform: 'capitalize', transition: 'all 0.15s',
                  background: severityFilter === sev ? 'var(--af-orange)' : 'transparent',
                  color: severityFilter === sev ? '#fff' : 'var(--af-muted)',
                  borderColor: severityFilter === sev ? 'var(--af-orange)' : 'var(--af-border)',
                }}>
                  {sev}
                </button>
              ))}
            </div>
          </div>

          {/* Match cards or skeletons */}
          {isPending ? (
            <>
              <MatchCardSkeleton />
              <MatchCardSkeleton />
              <MatchCardSkeleton />
            </>
          ) : filteredMatches.length === 0 ? (
            <div className="empty-state" style={{ padding: '3rem 1rem' }}>
              <Sparkles size={36} style={{ color: 'var(--af-muted)', marginBottom: '0.75rem' }} />
              <h3 className="empty-state__title">
                {severityFilter !== 'all' ? `No ${severityFilter} matches` : 'No suggestions yet'}
              </h3>
              <p className="empty-state__desc">
                {severityFilter !== 'all'
                  ? 'Try changing the severity filter or re-run AI.'
                  : 'When the AI generates matches, they will appear here.'}
              </p>
            </div>
          ) : (
            filteredMatches.map(match => (
              <MatchCard
                key={match.id}
                match={match}
                isAssigning={assignMatch.isPending}
                onAccept={() => assignMatch.mutate({ matchId: match.id, needId: match.needId, volunteerId: match.volunteerId })}
                onReject={() => assignMatch.mutate({ matchId: match.id, needId: match.needId, volunteerId: match.volunteerId, action: 'reject' })}
                onReassign={() => refetch()}
              />
            ))
          )}

          {/* Unmatched Needs */}
          {!isPending && parsed.unmatched.length > 0 && (
            <div style={{ marginTop: '0.25rem' }}>
              <h2 style={{ fontSize: '1rem', fontWeight: 700, margin: '0 0 0.65rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                Unmatched Needs
                <span style={{
                  fontSize: '0.7rem', fontWeight: 600, padding: '0.1rem 0.45rem', borderRadius: '9999px',
                  background: 'rgba(239,68,68,0.1)', color: '#ef4444',
                }}>{parsed.unmatched.length}</span>
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '0.65rem' }}>
                {parsed.unmatched.map(need => <UnmatchedNeedCard key={need.id} need={need} />)}
              </div>
            </div>
          )}
        </div>

        {/* Right Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', position: 'sticky', top: '1rem' }}>
          <ModelControlPanel />
          {!isPending && <VolunteerUtilization data={utilizationData} />}

          {!isPending && parsed.alerts.length > 0 && (
            <div>
              <h3 style={{ fontSize: '0.85rem', fontWeight: 650, margin: '0 0 0.45rem' }}>Alerts</h3>
              <AlertPanel alerts={parsed.alerts} />
            </div>
          )}

          {!isPending && parsed.activities.length > 0 && (
            <div className="af-card af-activity" style={{ padding: '1rem' }}>
              <h3 style={{ fontSize: '0.85rem', fontWeight: 650, margin: '0 0 0.65rem' }}>Recent Activity</h3>
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
