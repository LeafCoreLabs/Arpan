import { useState, useEffect } from 'react'
import { Users, UserCheck, UserX, Activity, Search, RefreshCcw, MapPin, Star, X } from 'lucide-react'
import { apiClient } from '../../../services/apiClient.js'

const statusTone = { available: 'success', busy: 'warning', offline: '' }

export default function VolunteersPage() {
  const [volunteers, setVolunteers] = useState([])
  const [tasks, setTasks] = useState([])
  const [needs, setNeeds] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [assignModal, setAssignModal] = useState(null)

  const loadData = async () => {
    setLoading(true)
    try {
      const [volRes, taskRes, needsRes] = await Promise.all([
        apiClient.get('/api/volunteers'), apiClient.get('/api/tasks'), apiClient.get('/api/needs')
      ])
      setVolunteers(volRes.data); setTasks(taskRes.data); setNeeds(needsRes.data)
    } catch (err) { console.error('Failed to load data', err) }
    finally { setLoading(false) }
  }

  useEffect(() => { loadData() }, [])

  const handleAssign = async (volunteerId, needId) => {
    try { await apiClient.post('/api/tasks', { needId, volunteerId }); setAssignModal(null); loadData() }
    catch (err) { console.error(err) }
  }

  const filtered = volunteers.filter(v => {
    const matchSearch = !search || v.name?.toLowerCase().includes(search.toLowerCase()) || v.region?.toLowerCase().includes(search.toLowerCase())
    const matchStatus = filterStatus === 'all' || v.status === filterStatus
    return matchSearch && matchStatus
  })

  const total = volunteers.length
  const available = volunteers.filter(v => v.status === 'available').length
  const busy = volunteers.filter(v => v.status === 'busy').length
  const offline = volunteers.filter(v => v.status === 'offline').length
  const unassignedNeeds = needs.filter(n => n.status === 'unassigned')

  const metricCards = [
    { label: 'Total Volunteers', value: total, icon: Users, tone: 'default' },
    { label: 'Available', value: available, icon: UserCheck, tone: 'success' },
    { label: 'Busy', value: busy, icon: Activity, tone: 'warning' },
    { label: 'Offline', value: offline, icon: UserX, tone: '' },
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
          <input className="searchbar" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search volunteers..." style={{ paddingLeft: '2rem' }} />
        </div>
        <select className="searchbar" value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={{ width: 'auto' }}>
          <option value="all">All Statuses</option>
          {['available', 'busy', 'offline'].map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
        </select>
        <button onClick={loadData} className="btn btn--ghost"><RefreshCcw size={15} /> Refresh</button>
      </div>

      {/* Volunteer Cards */}
      {loading ? (
        <div className="loader-fullpage"><span className="loader" /></div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <Users size={40} style={{ color: 'var(--af-muted)', marginBottom: '0.75rem' }} />
          <h3 className="empty-state__title">No volunteers found</h3>
          <p className="empty-state__desc">Volunteers will appear here when they register.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1rem' }}>
          {filtered.map(vol => (
            <div key={vol.id} className="af-card" style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: '50%',
                    background: vol.status === 'available' ? '#dcfce7' : vol.status === 'busy' ? '#fef3c7' : '#f3f4f6',
                    color: vol.status === 'available' ? '#16a34a' : vol.status === 'busy' ? '#d97706' : '#6b7280',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.85rem',
                  }}>{vol.initials}</div>
                  <div>
                    <h4 style={{ margin: 0, fontWeight: 600, fontSize: '0.95rem' }}>{vol.name}</h4>
                    <p style={{ color: 'var(--af-muted)', fontSize: '0.75rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.25rem' }}><MapPin size={12} />{vol.region}</p>
                  </div>
                </div>
                <span className={`badge badge--${statusTone[vol.status] || ''}`} style={{ textTransform: 'capitalize' }}>{vol.status}</span>
              </div>

              <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                {(vol.skills || []).map((skill, j) => (
                  <span key={j} className="af-tag">{skill}</span>
                ))}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--af-border)', paddingTop: '0.75rem' }}>
                <div style={{ display: 'flex', gap: '1rem', fontSize: '0.75rem', color: 'var(--af-muted)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Star size={12} style={{ color: '#f59e0b' }} />{vol.rating?.toFixed(1)}</span>
                  <span>{vol.completedTasks} tasks</span>
                  <span>{vol.responseTime}</span>
                </div>
                {vol.status === 'available' && unassignedNeeds.length > 0 && (
                  <button onClick={() => setAssignModal(vol.id)} className="btn btn--primary" style={{ fontSize: '0.75rem', padding: '0.3rem 0.7rem' }}>
                    Assign Task
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Active Tasks */}
      {tasks.length > 0 && (
        <div>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0 0 0.75rem' }}>Active Tasks ({tasks.length})</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {tasks.map(task => (
              <div key={task.id} className="af-card" style={{ padding: '0.9rem 1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div>
                  <h4 style={{ margin: '0 0 0.2rem', fontSize: '0.9rem', fontWeight: 600 }}>{task.needTitle}</h4>
                  <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--af-muted)' }}>Assigned to {task.volunteerName} &middot; {task.assignedAt}</p>
                </div>
                <span className={`badge badge--${task.status === 'completed' ? 'success' : task.status === 'in-progress' ? 'warning' : ''}`} style={{ textTransform: 'capitalize' }}>
                  {task.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Assign Modal */}
      {assignModal && (
        <div className="modal-overlay">
          <div className="af-card" style={{ width: '90%', maxWidth: '480px', maxHeight: '80vh', display: 'flex', flexDirection: 'column' }}>
            <div className="card__header">
              <h3 className="card__title">Assign to a Need</h3>
              <button onClick={() => setAssignModal(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--af-muted)' }}><X size={18} /></button>
            </div>
            <div className="card__body" style={{ overflowY: 'auto', flex: 1 }}>
              {unassignedNeeds.length === 0 ? (
                <p style={{ color: 'var(--af-muted)' }}>No unassigned needs available.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {unassignedNeeds.map(need => (
                    <div key={need.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: 'var(--af-card)', borderRadius: '0.5rem', border: '1px solid var(--af-border)' }}>
                      <div>
                        <p style={{ margin: 0, fontWeight: 600, fontSize: '0.85rem' }}>{need.title}</p>
                        <p style={{ margin: 0, fontSize: '0.7rem', color: 'var(--af-muted)' }}>{need.location} &middot; {need.severity}</p>
                      </div>
                      <button onClick={() => handleAssign(assignModal, need.id)} className="btn btn--primary" style={{ fontSize: '0.75rem', padding: '0.3rem 0.7rem' }}>
                        Assign
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
