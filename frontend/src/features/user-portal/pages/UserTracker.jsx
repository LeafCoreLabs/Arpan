import { useState, useEffect } from 'react'
import { ListChecks, MapPin, Clock, AlertCircle, CheckCircle, RefreshCcw } from 'lucide-react'
import { apiClient } from '../../../services/apiClient.js'

const sevColor = { critical: '#ef4444', high: '#f59e0b', medium: '#3b82f6', low: '#6b7280', resolved: '#10b981' }
const FILTERS = ['all', 'unassigned', 'assigned', 'in-progress', 'resolved']
const statusSteps = ['unassigned', 'assigned', 'in-progress', 'resolved']

export default function UserTracker() {
  const [needs, setNeeds] = useState([])
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState(null)

  const load = () => {
    setLoading(true)
    apiClient.get('/api/needs/my').then(r => { setNeeds(r.data || []); setLoading(false) }).catch(() => setLoading(false))
  }
  useEffect(() => { load() }, [])

  const filtered = filter === 'all' ? needs : needs.filter(n => n.status === filter)

  return (
    <div className="af-dashboard">
      <div>
        <h1 style={{ fontSize: '1.35rem', fontWeight: 700, margin: '0 0 0.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ListChecks size={20} style={{ color: '#10b981' }} /> My Reports Tracker
        </h1>
        <p style={{ color: 'var(--af-muted)', fontSize: '0.85rem', margin: 0 }}>Track the status of your reported community needs.</p>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
        {FILTERS.map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`btn ${filter === f ? 'btn--primary' : 'btn--ghost'}`}
            style={{ fontSize: '0.8rem', textTransform: 'capitalize' }}>
            {f} {f !== 'all' && `(${needs.filter(n => n.status === f).length})`}
          </button>
        ))}
        <div style={{ flex: 1 }} />
        <button onClick={load} className="btn btn--ghost"><RefreshCcw size={14} /></button>
      </div>

      {loading ? (
        <div className="loader-fullpage"><span className="loader" /></div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <h3 className="empty-state__title">{filter === 'all' ? 'No reports yet' : `No ${filter} reports`}</h3>
          <p className="empty-state__desc">{filter === 'all' ? 'Report a community need to get started.' : 'Try a different filter.'}</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          {filtered.map(need => {
            const isExpanded = expanded === need.id
            const currentStep = statusSteps.indexOf(need.status)
            return (
              <div key={need.id} onClick={() => setExpanded(isExpanded ? null : need.id)} className="af-card" style={{ padding: '1.15rem 1.25rem', cursor: 'pointer', boxShadow: isExpanded ? '0 0 0 2px #10b981' : undefined }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: sevColor[need.severity] || '#6b7280' }} />
                    <h4 style={{ margin: 0, fontWeight: 600, fontSize: '0.95rem' }}>{need.title}</h4>
                  </div>
                  <span className={`badge badge--${need.status === 'resolved' ? 'success' : need.severity === 'critical' ? 'danger' : ''}`} style={{ textTransform: 'capitalize' }}>{need.status}</span>
                </div>
                <div style={{ display: 'flex', gap: '1.25rem', color: 'var(--af-muted)', fontSize: '0.75rem', flexWrap: 'wrap' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><MapPin size={12} />{need.location}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><AlertCircle size={12} />{need.issueType}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Clock size={12} />{need.timeReported}</span>
                </div>

                {isExpanded && (
                  <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--af-border)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      {statusSteps.map((step, si) => (
                        <div key={step} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, position: 'relative' }}>
                          <div style={{
                            width: 24, height: 24, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            background: si <= currentStep ? (step === 'resolved' ? '#10b981' : '#3b82f6') : 'var(--af-border)',
                            marginBottom: '0.4rem',
                          }}>
                            {si <= currentStep ? <CheckCircle size={14} style={{ color: '#fff' }} /> : <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--af-muted)' }} />}
                          </div>
                          <span style={{ fontSize: '0.65rem', color: si <= currentStep ? undefined : 'var(--af-muted)', textTransform: 'capitalize', textAlign: 'center' }}>{step}</span>
                          {si < statusSteps.length - 1 && (
                            <div style={{ position: 'absolute', top: 12, left: '60%', width: 'calc(100% - 20%)', height: 2, background: si < currentStep ? '#3b82f6' : 'var(--af-border)' }} />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
