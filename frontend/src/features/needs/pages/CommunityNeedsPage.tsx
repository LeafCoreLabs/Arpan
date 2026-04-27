import { useState, useEffect } from 'react'
import { AlertCircle, Users, MapPin, Clock, CheckCircle, Search, Trash2, RefreshCcw } from 'lucide-react'
import { apiClient } from '../../../services/apiClient.js'

const SEV_TONE = { critical: 'danger', high: 'warning', medium: '', low: '' }
const STAT_TONE = { unassigned: 'warning', assigned: '', 'in-progress': '', resolved: 'success' }

export default function CommunityNeedsPage() {
  const [needs, setNeeds] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterSeverity, setFilterSeverity] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')

  const loadNeeds = async () => {
    setLoading(true)
    try { const { data } = await apiClient.get('/api/needs'); setNeeds(data) }
    catch (err) { console.error('Failed to load needs', err) }
    finally { setLoading(false) }
  }

  useEffect(() => { loadNeeds() }, [])

  const handleResolve = async (id) => {
    try { await apiClient.put(`/api/needs/${id}/resolve`); loadNeeds() }
    catch (err) { console.error(err) }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this need?')) return
    try { await apiClient.delete(`/api/needs/${id}`); loadNeeds() }
    catch (err) { console.error(err) }
  }

  const filtered = needs.filter(n => {
    const matchesSearch = !search || n.title?.toLowerCase().includes(search.toLowerCase()) || n.location?.toLowerCase().includes(search.toLowerCase())
    const matchesSeverity = filterSeverity === 'all' || n.severity === filterSeverity
    const matchesStatus = filterStatus === 'all' || n.status === filterStatus
    return matchesSearch && matchesSeverity && matchesStatus
  })

  const totalActive = needs.filter(n => n.status !== 'resolved').length
  const criticalCount = needs.filter(n => n.severity === 'critical').length
  const resolvedCount = needs.filter(n => n.status === 'resolved').length
  const unassignedCount = needs.filter(n => n.status === 'unassigned').length

  const metricCards = [
    { label: 'Active Needs', value: totalActive, icon: AlertCircle, tone: 'warning' },
    { label: 'Critical', value: criticalCount, icon: AlertCircle, tone: 'danger' },
    { label: 'Resolved', value: resolvedCount, icon: CheckCircle, tone: 'success' },
    { label: 'Unassigned', value: unassignedCount, icon: Clock, tone: 'warning' },
  ]

  return (
    <div className="af-dashboard">
      {/* Metrics */}
      <div className="af-metrics">
        {metricCards.map(m => (
          <div key={m.label} className="af-metric">
            <div className="af-metric__icon" data-tone={m.tone}><m.icon size={18} /></div>
            <div>
              <p className="af-metric__label">{m.label}</p>
              <p className="af-metric__value" style={{ fontSize: '1.5rem' }}>{m.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ flex: 1, minWidth: '200px', position: 'relative' }}>
          <Search size={15} style={{ position: 'absolute', left: '0.6rem', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', pointerEvents: 'none' }} />
          <input className="searchbar" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search needs..." style={{ paddingLeft: '2rem' }} />
        </div>
        <select className="searchbar" value={filterSeverity} onChange={e => setFilterSeverity(e.target.value)} style={{ width: 'auto' }}>
          <option value="all">All Severity</option>
          {['critical', 'high', 'medium', 'low'].map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
        </select>
        <select className="searchbar" value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={{ width: 'auto' }}>
          <option value="all">All Status</option>
          {['unassigned', 'assigned', 'in-progress', 'resolved'].map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
        </select>
        <button onClick={loadNeeds} className="btn btn--ghost"><RefreshCcw size={15} /> Refresh</button>
      </div>

      {/* Needs List */}
      {loading ? (
        <div className="loader-fullpage"><span className="loader" /></div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <AlertCircle size={40} style={{ color: 'var(--af-muted)', marginBottom: '0.75rem' }} />
          <h3 className="empty-state__title">No community needs found</h3>
          <p className="empty-state__desc">When community users report needs, they will appear here.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {filtered.map(need => (
            <div key={need.id} className="af-card" style={{ padding: '1.15rem 1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div style={{ flex: 1, minWidth: '250px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: need.severity === 'critical' ? '#ef4444' : need.severity === 'high' ? '#f59e0b' : need.severity === 'medium' ? '#3b82f6' : '#6b7280', flexShrink: 0 }} />
                    <h4 style={{ margin: 0, fontWeight: 600, fontSize: '0.95rem' }}>{need.title}</h4>
                  </div>
                  <div style={{ display: 'flex', gap: '1.25rem', color: 'var(--af-muted)', fontSize: '0.75rem', flexWrap: 'wrap' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><MapPin size={12} />{need.location}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><AlertCircle size={12} />{need.issueType}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Users size={12} />{need.peopleAffected} affected</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Clock size={12} />{need.timeReported}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <span className={`badge badge--${SEV_TONE[need.severity] || ''}`} style={{ textTransform: 'capitalize' }}>{need.severity}</span>
                  <span className={`badge badge--${STAT_TONE[need.status] || ''}`} style={{ textTransform: 'capitalize' }}>{need.status}</span>
                  {need.status !== 'resolved' && (
                    <button onClick={() => handleResolve(need.id)} className="btn btn--primary" style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem' }}>
                      <CheckCircle size={13} /> Resolve
                    </button>
                  )}
                  <button onClick={() => handleDelete(need.id)} className="btn btn--ghost" style={{ fontSize: '0.75rem', padding: '0.3rem 0.5rem', color: '#ef4444' }}>
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
