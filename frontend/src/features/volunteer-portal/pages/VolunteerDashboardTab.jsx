import { useState, useEffect } from 'react'
import { CheckCircle, Clock, Activity, TrendingUp, Star } from 'lucide-react'
import { apiClient } from '../../../services/apiClient.js'
import { useAuth } from '../../../app/providers.jsx'

export default function VolunteerDashboardTab() {
  const { user } = useAuth()
  const [stats, setStats] = useState(null)
  const [profile, setProfile] = useState(null)
  const [feed, setFeed] = useState([])

  useEffect(() => {
    apiClient.get('/api/profile').then(r => setProfile(r.data)).catch(() => {})
    apiClient.get('/api/profile/stats').then(r => setStats(r.data)).catch(() => {})
    apiClient.get('/api/needs/feed').then(r => setFeed(r.data?.slice(0, 5) || [])).catch(() => {})
  }, [])

  const statCards = [
    { label: 'Tasks Completed', value: stats?.completedTasks || 0, icon: CheckCircle, tone: 'success' },
    { label: 'Active Tasks', value: stats?.activeTasks || 0, icon: Clock, tone: 'default' },
    { label: 'Rating', value: stats?.rating ? `${stats.rating}/5` : '—', icon: Star, tone: 'warning' },
    { label: 'Response Time', value: stats?.responseTime || 'N/A', icon: TrendingUp, tone: 'default' },
  ]

  return (
    <div className="af-dashboard">
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '0 0 0.25rem' }}>
          Welcome back, {user?.name || 'Volunteer'}
        </h1>
        <p style={{ color: 'var(--af-muted)', fontSize: '0.9rem', margin: 0 }}>
          Here's your volunteer dashboard overview.
        </p>
      </div>

      {/* Status Badge */}
      {profile && (
        <div className="af-card" style={{ padding: '1rem 1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--af-muted)', fontWeight: 500 }}>Current Status</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
                <span style={{
                  width: 10, height: 10, borderRadius: '50%',
                  background: profile.status === 'available' ? '#16a34a' : profile.status === 'busy' ? '#f59e0b' : '#6b7280',
                  display: 'inline-block',
                }} />
                <span style={{ fontWeight: 600, textTransform: 'capitalize' }}>{profile.status || 'offline'}</span>
              </div>
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--af-muted)' }}>
              Region: <strong>{profile.region || 'Not set'}</strong>
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--af-muted)' }}>
              Skills: <strong>{profile.skills || 'Not set'}</strong>
            </div>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="af-metrics">
        {statCards.map(s => (
          <div key={s.label} className="af-metric">
            <div className="af-metric__icon" data-tone={s.tone}>
              <s.icon size={18} />
            </div>
            <div>
              <p className="af-metric__label">{s.label}</p>
              <p className="af-metric__value" style={{ fontSize: '1.5rem' }}>{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="af-card af-activity">
        <div className="af-card__head">
          <h2 className="af-card__title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Activity size={16} style={{ color: '#3b82f6' }} /> Recent Community Activity
          </h2>
        </div>
        {feed.length === 0 ? (
          <p className="af-activity__empty">No recent activity</p>
        ) : (
          <ul className="af-activity__list">
            {feed.map(item => (
              <li key={item.id} className="af-activity__row">
                <div className={`af-activity__icon af-activity__icon--${item.kind === 'success' ? 'success' : item.kind === 'alert' ? 'alert' : 'user'}`}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'currentColor', display: 'block' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <p className="af-activity__msg">{item.text}</p>
                  <p className="af-activity__time">{item.time}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
