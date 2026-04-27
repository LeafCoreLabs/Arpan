import { useState, useEffect } from 'react'
import { Bell, AlertCircle, Info, AlertTriangle, RefreshCcw, Clock, MapPin } from 'lucide-react'
import { apiClient } from '../../../services/apiClient.js'

const typeConfig = {
  critical: { icon: AlertCircle, tone: 'danger', label: 'Critical' },
  warning:  { icon: AlertTriangle, tone: 'warning', label: 'Warning' },
  info:     { icon: Info, tone: '', label: 'Info' },
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  const loadNotifications = async () => {
    setLoading(true)
    try { const { data } = await apiClient.get('/api/notifications/alerts'); setNotifications(data) }
    catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  useEffect(() => { loadNotifications() }, [])

  const markRead = async (id) => {
    try { await apiClient.post(`/api/notifications/${id}/read`); loadNotifications() }
    catch (err) { console.error(err) }
  }

  const filtered = filter === 'all' ? notifications : notifications.filter(n => n.type === filter)

  const criticalCount = notifications.filter(n => n.type === 'critical').length
  const warningCount = notifications.filter(n => n.type === 'warning').length
  const infoCount = notifications.filter(n => n.type === 'info').length

  const metricCards = [
    { label: 'Total Alerts', value: notifications.length, icon: Bell, tone: 'default' },
    { label: 'Critical', value: criticalCount, icon: AlertCircle, tone: 'danger' },
    { label: 'Warnings', value: warningCount, icon: AlertTriangle, tone: 'warning' },
    { label: 'Informational', value: infoCount, icon: Info, tone: '' },
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
      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
        {['all', 'critical', 'warning', 'info'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`btn ${filter === f ? 'btn--primary' : 'btn--ghost'}`}
            style={{ fontSize: '0.8rem', textTransform: 'capitalize' }}>
            {f}
          </button>
        ))}
        <div style={{ flex: 1 }} />
        <button onClick={loadNotifications} className="btn btn--ghost"><RefreshCcw size={15} /> Refresh</button>
      </div>

      {/* List */}
      {loading ? (
        <div className="loader-fullpage"><span className="loader" /></div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <Bell size={40} style={{ color: 'var(--af-muted)', marginBottom: '0.75rem' }} />
          <h3 className="empty-state__title">No notifications</h3>
          <p className="empty-state__desc">System alerts will appear here when events occur.</p>
        </div>
      ) : (
        <div className="af-card af-activity">
          <ul className="af-activity__list" style={{ maxHeight: 'none' }}>
            {filtered.map(notif => {
              const config = typeConfig[notif.type] || typeConfig.info
              const Icon = config.icon
              return (
                <li key={notif.id} className="af-activity__row" style={{ cursor: 'pointer' }} onClick={() => markRead(notif.id)}>
                  <div className={`af-activity__icon af-activity__icon--${notif.type === 'critical' ? 'alert' : notif.type === 'info' ? 'user' : 'alert'}`}>
                    <Icon size={14} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <p className="af-activity__msg" style={{ fontWeight: 600 }}>{notif.message}</p>
                    <div style={{ display: 'flex', gap: '1rem', marginTop: '0.25rem', fontSize: '0.7rem', color: 'var(--af-muted)' }}>
                      {notif.location && <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><MapPin size={11} />{notif.location}</span>}
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Clock size={11} />{notif.time}</span>
                    </div>
                  </div>
                  <span className={`badge badge--${config.tone}`} style={{ flexShrink: 0 }}>{config.label}</span>
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </div>
  )
}
