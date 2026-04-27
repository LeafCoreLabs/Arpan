import { useMemo, useState } from 'react'
import { emptyAsDash } from '../utils/dashboardMappers.js'
import { Table } from '../../../components/ui/Table.jsx'
import { Badge } from '../../../components/ui/Badge.jsx'

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'urgent', label: 'Urgent' },
  { id: 'pending', label: 'Pending' },
]

function statusTone(status) {
  const s = String(status || '').toLowerCase()
  if (s.includes('progress')) return 'warning'
  if (s.includes('unassign')) return 'neutral'
  if (s.includes('done') || s.includes('complete')) return 'success'
  return 'neutral'
}

function severityTone(sev) {
  const s = String(sev || '').toLowerCase()
  if (s.includes('critical')) return 'danger'
  if (s.includes('high')) return 'warning'
  return 'neutral'
}

export function DashboardNeedsTable({ rows = [] }) {
  const [filter, setFilter] = useState('all')
  const filtered = useMemo(() => {
    if (filter === 'all') return rows
    if (filter === 'urgent') {
      return rows.filter((r) => {
        const s = String(r.severity || '').toLowerCase()
        return s.includes('critical') || s.includes('urgent') || s.includes('high')
      })
    }
    if (filter === 'pending') {
      return rows.filter((r) => {
        const st = String(r.status || '').toLowerCase()
        return st.includes('pending') || st.includes('unassign')
      })
    }
    return rows
  }, [rows, filter])

  return (
    <section className="af-card af-needspreview" aria-label="Community needs">
      <div className="af-card__head af-needspreview__head">
        <h2 className="af-card__title">Community Needs</h2>
        <div className="af-pills" role="tablist" aria-label="Filter needs">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              role="tab"
              aria-selected={filter === f.id}
              className={`af-pill ${filter === f.id ? 'is-active' : ''}`.trim()}
              onClick={() => setFilter(f.id)}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>
      <Table
        getRowKey={(r) => r.id}
        columns={[
          { key: 'location', label: 'LOCATION', render: (r) => emptyAsDash(r.location) },
          { key: 'issueType', label: 'ISSUE TYPE', render: (r) => emptyAsDash(r.issueType) },
          {
            key: 'severity',
            label: 'SEVERITY',
            render: (r) => (r.severity ? <Badge tone={severityTone(r.severity)}>{r.severity}</Badge> : '—'),
          },
          {
            key: 'status',
            label: 'STATUS',
            render: (r) => (r.status ? <Badge tone={statusTone(r.status)}>{r.status}</Badge> : '—'),
          },
          { key: 'assignedTo', label: 'ASSIGNED TO', render: (r) => {
            if (!r.assignedTo) return '—'
            if (r.assignedAvatar) {
              return (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <img src={r.assignedAvatar} alt={r.assignedTo} style={{ width: '24px', height: '24px', borderRadius: '50%', objectFit: 'cover' }} />
                  <span>{r.assignedTo}</span>
                </div>
              )
            }
            return <span style={{ color: r.assignedTo === 'Pending Match' ? '#9ca3af' : 'inherit', fontStyle: r.assignedTo === 'Pending Match' ? 'italic' : 'normal' }}>{r.assignedTo}</span>
          } },
        ]}
        rows={filtered}
        empty="No needs match this filter"
      />
    </section>
  )
}
