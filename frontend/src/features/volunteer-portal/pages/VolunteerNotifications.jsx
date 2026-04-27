import { useState, useEffect } from 'react'
import { Bell, CheckCheck } from 'lucide-react'
import { apiClient } from '../../../services/apiClient.js'

const TYPE_ICON = { success: 'check-circle', warning: 'alert-triangle', task: 'clipboard', event: 'calendar', info: 'info' }

export default function VolunteerNotifications() {
  const [notifs, setNotifs] = useState([])
  const [loading, setLoading] = useState(true)

  const load = () => {
    apiClient.get('/api/notifications').then(r => { setNotifs(r.data || []); setLoading(false) }).catch(() => setLoading(false))
  }
  useEffect(() => { load() }, [])

  const markRead = async (id) => {
    try { await apiClient.put(`/api/notifications/${id}/read`); load() } catch (e) { console.error(e) }
  }
  const markAllRead = async () => {
    try { await apiClient.put('/api/notifications/read-all'); load() } catch (e) { console.error(e) }
  }

  const unread = notifs.filter(n => !n.isRead).length

  return (
    <div className="af-dashboard">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.35rem', fontWeight: 700, margin: '0 0 0.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Bell size={20} style={{ color: '#f59e0b' }} /> Notifications
            {unread > 0 && (
              <span style={{
                padding: '0.1rem 0.45rem', borderRadius: '0.3rem', background: '#dc2626',
                color: '#fff', fontSize: '0.7rem', fontWeight: 700, lineHeight: 1.3,
              }}>{unread}</span>
            )}
          </h1>
          <p style={{ color: 'var(--af-muted)', fontSize: '0.85rem', margin: 0 }}>Stay updated with your latest alerts.</p>
        </div>
        {unread > 0 && (
          <button onClick={markAllRead} className="btn btn--ghost" style={{ fontSize: '0.8rem' }}>
            <CheckCheck size={15} /> Mark all read
          </button>
        )}
      </div>

      {loading ? (
        <div className="loader-fullpage"><span className="loader" /></div>
      ) : notifs.length === 0 ? (
        <div className="empty-state">
          <h3 className="empty-state__title">No notifications yet</h3>
          <p className="empty-state__desc">You'll be notified about tasks, events and community updates.</p>
        </div>
      ) : (
        <div className="af-card" style={{ overflow: 'hidden' }}>
          {notifs.map((n, i) => (
            <div
              key={n.id}
              style={{
                padding: '0.9rem 1.25rem',
                display: 'flex', gap: '0.75rem', alignItems: 'flex-start',
                borderBottom: i < notifs.length - 1 ? '1px solid var(--af-border)' : 'none',
                background: n.isRead ? undefined : '#eff6ff',
                cursor: !n.isRead ? 'pointer' : 'default',
              }}
              onClick={() => !n.isRead && markRead(n.id)}
            >
              <div className={`af-activity__icon af-activity__icon--${n.type === 'success' ? 'success' : n.type === 'warning' ? 'alert' : n.type === 'event' ? 'user' : 'default'}`}>
                <span style={{ fontSize: '0.6rem', fontWeight: 700 }}>
                  {n.type === 'success' ? '✓' : n.type === 'warning' ? '!' : n.type === 'event' ? '📅' : 'i'}
                </span>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.15rem' }}>
                  <h4 style={{ margin: 0, fontWeight: 600, fontSize: '0.85rem', color: n.isRead ? 'var(--af-muted)' : undefined }}>{n.title}</h4>
                  <span style={{ fontSize: '0.65rem', color: 'var(--af-muted)', whiteSpace: 'nowrap' }}>{n.createdAt?.split('T')[0] || ''}</span>
                </div>
                <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--af-muted)', lineHeight: 1.5 }}>{n.message}</p>
              </div>
              {!n.isRead && <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#3b82f6', flexShrink: 0, marginTop: '0.4rem' }} />}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
