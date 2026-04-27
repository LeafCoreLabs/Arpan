import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { PlusCircle, AlertTriangle, CheckCircle, Clock, MapPin } from 'lucide-react'
import { apiClient } from '../../../services/apiClient.js'
import { useAuth } from '../../../app/providers.jsx'
import { ROUTES } from '../../../config/routes.js'

const sevColor = { critical: '#ef4444', high: '#f59e0b', medium: '#3b82f6', low: '#6b7280', resolved: '#10b981' }

export default function UserDashboardTab() {
  const { user } = useAuth()
  const nav = useNavigate()
  const [stats, setStats] = useState(null)
  const [recent, setRecent] = useState([])

  useEffect(() => {
    apiClient.get('/api/profile/stats').then(r => setStats(r.data)).catch(() => {})
    apiClient.get('/api/needs/my').then(r => setRecent((r.data || []).slice(0, 3))).catch(() => {})
  }, [])

  const statCards = [
    { label: 'Needs Reported', value: stats?.totalNeeds || 0, icon: PlusCircle, tone: 'default' },
    { label: 'Resolved', value: stats?.resolvedNeeds || 0, icon: CheckCircle, tone: 'success' },
    { label: 'Active', value: stats?.activeNeeds || 0, icon: Clock, tone: 'warning' },
  ]

  return (
    <div className="af-dashboard">
      <div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '0 0 0.25rem' }}>
          Namaste, {user?.name || 'Community Member'}
        </h1>
        <p style={{ color: 'var(--af-muted)', fontSize: '0.9rem', margin: 0 }}>
          Your community dashboard — report needs, track progress.
        </p>
      </div>

      {/* Quick Actions */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <button onClick={() => nav(ROUTES.COMMUNITY_REPORT)} className="af-card" style={{ cursor: 'pointer', border: '1px solid #dcfce7', display: 'flex', alignItems: 'center', gap: '1rem', textAlign: 'left', padding: '1.25rem' }}>
          <div style={{ width: 44, height: 44, borderRadius: '12px', background: 'linear-gradient(135deg, #10b981, #059669)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', flexShrink: 0 }}>
            <PlusCircle size={22} />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Report a Need</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--af-muted)', marginTop: '0.15rem' }}>Submit a community issue</div>
          </div>
        </button>
        <button onClick={() => nav(ROUTES.COMMUNITY_SOS)} className="af-card" style={{ cursor: 'pointer', border: '1px solid #fecaca', display: 'flex', alignItems: 'center', gap: '1rem', textAlign: 'left', padding: '1.25rem' }}>
          <div style={{ width: 44, height: 44, borderRadius: '12px', background: 'linear-gradient(135deg, #ef4444, #dc2626)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', flexShrink: 0 }}>
            <AlertTriangle size={22} />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>SOS Emergency</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--af-muted)', marginTop: '0.15rem' }}>One-tap critical alert</div>
          </div>
        </button>
      </div>

      {/* Stats */}
      <div className="af-metrics">
        {statCards.map(s => (
          <div key={s.label} className="af-metric">
            <div className="af-metric__icon" data-tone={s.tone}><s.icon size={18} /></div>
            <div>
              <p className="af-metric__label">{s.label}</p>
              <p className="af-metric__value" style={{ fontSize: '1.5rem' }}>{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Reports */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>Recent Reports</h2>
          <button onClick={() => nav(ROUTES.COMMUNITY_TRACKER)} className="btn btn--ghost" style={{ fontSize: '0.8rem' }}>View all</button>
        </div>
        {recent.length === 0 ? (
          <div className="af-card" style={{ textAlign: 'center', color: 'var(--af-muted)', padding: '2rem' }}>No reports yet. Start by reporting a community need.</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {recent.map(n => (
              <div key={n.id} className="af-card" style={{ padding: '1rem 1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: sevColor[n.severity] || '#6b7280' }} />
                    <h4 style={{ margin: 0, fontWeight: 600, fontSize: '0.9rem' }}>{n.title}</h4>
                  </div>
                  <div style={{ display: 'flex', gap: '1rem', color: 'var(--af-muted)', fontSize: '0.75rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><MapPin size={12} />{n.location}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Clock size={12} />{n.timeReported}</span>
                  </div>
                </div>
                <span className={`badge badge--${n.status === 'resolved' ? 'success' : n.severity === 'critical' ? 'danger' : n.severity === 'high' ? 'warning' : ''}`} style={{ textTransform: 'capitalize' }}>{n.status}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
