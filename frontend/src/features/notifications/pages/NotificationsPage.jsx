import { useState, useEffect } from 'react'
import { Bell, AlertCircle, Info, AlertTriangle, CheckCircle, Calendar, RefreshCcw, Clock, Check, CheckCheck } from 'lucide-react'
import { apiClient } from '../../../services/apiClient.js'

const typeConfig = {
  warning:  { icon: AlertTriangle, tone: 'warning', label: 'Warning' },
  info:     { icon: Info, tone: '', label: 'Info' },
  success:  { icon: CheckCircle, tone: 'success', label: 'Success' },
  event:    { icon: Calendar, tone: '', label: 'Event' },
  task:     { icon: Check, tone: '', label: 'Task' },
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  const loadNotifications = async () => {
    setLoading(true)
    try { const { data } = await apiClient.get('/api/notifications'); setNotifications(data) }
    catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  useEffect(() => { loadNotifications() }, [])

  const markRead = async (id) => {
    try { await apiClient.post(`/api/notifications/${id}/read`); loadNotifications() }
    catch (err) { console.error(err) }
  }

  const markAllRead = async () => {
    try { await apiClient.put('/api/notifications/read-all'); loadNotifications() }
    catch (err) { console.error(err) }
  }

  const filtered = filter === 'all' ? notifications : notifications.filter(n => n.type === filter)
  const unreadCount = notifications.filter(n => !n.isRead).length

  const metricCards = [
    { label: 'Total', value: notifications.length, icon: Bell, tone: 'default' },
    { label: 'Unread', value: unreadCount, icon: AlertCircle, tone: 'danger' },
    { label: 'Warnings', value: notifications.filter(n => n.type === 'warning').length, icon: AlertTriangle, tone: 'warning' },
    { label: 'Info', value: notifications.filter(n => n.type === 'info' || n.type === 'success').length, icon: Info, tone: '' },
  ]

  return (
    <div className="af-dashboard">
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

      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
        {['all', 'warning', 'info', 'success', 'event'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`btn ${filter === f ? 'btn--primary' : 'btn--ghost'}`}
            style={{ fontSize: '0.8rem', textTransform: 'capitalize' }}>
            {f}
          </button>
        ))}
        <div style={{ flex: 1 }} />
        {unreadCount > 0 && (
          <button onClick={markAllRead} className="btn btn--ghost" style={{ fontSize: '0.8rem' }}>
            <CheckCheck size={15} /> Mark all read
          </button>
        )}
        <button onClick={loadNotifications} className="btn btn--ghost"><RefreshCcw size={15} /> Refresh</button>
      </div>

      {loading ? (
        <div className="loader-fullpage"><span className="loader" /></div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <Bell size={40} style={{ color: 'var(--af-muted)', marginBottom: '0.75rem' }} />
          <h3 className="empty-state__title">No notifications</h3>
          <p className="empty-state__desc">Notifications will appear here as events occur.</p>
        </div>
      ) : (
        <div className="af-card af-activity">
          <ul className="af-activity__list" style={{ maxHeight: 'none' }}>
            {filtered.map(notif => {
              const config = typeConfig[notif.type] || typeConfig.info
              const Icon = config.icon
              return (
                <li key={notif.id} className="af-activity__row"
                  style={{ cursor: notif.isRead ? 'default' : 'pointer', opacity: notif.isRead ? 0.6 : 1 }}
                  onClick={() => !notif.isRead && markRead(notif.id)}>
                  <div className={`af-activity__icon af-activity__icon--${notif.type === 'warning' ? 'alert' : 'user'}`}>
                    <Icon size={14} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <p className="af-activity__msg" style={{ fontWeight: notif.isRead ? 400 : 600 }}>{notif.title}</p>
                    <p style={{ fontSize: '0.78rem', color: 'var(--af-muted)', marginTop: '0.15rem' }}>{notif.message}</p>
                    {notif.createdAt && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.25rem', fontSize: '0.7rem', color: 'var(--af-muted)' }}>
                        <Clock size={11} />{new Date(notif.createdAt).toLocaleString()}
                      </span>
                    )}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.25rem', flexShrink: 0 }}>
                    <span className={`badge badge--${config.tone}`}>{config.label}</span>
                    {!notif.isRead && <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--af-accent)' }} />}
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </div>
  )
}
