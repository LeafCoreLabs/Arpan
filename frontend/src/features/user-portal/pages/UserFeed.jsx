import { useState, useEffect } from 'react'
import { Rss } from 'lucide-react'
import { apiClient } from '../../../services/apiClient.js'

const KIND_MAP = {
  success: { label: 'Resolved', cls: 'af-activity__icon--success' },
  alert:   { label: 'Alert',    cls: 'af-activity__icon--alert' },
  user:    { label: 'Update',   cls: 'af-activity__icon--user' },
}

export default function UserFeed() {
  const [feed, setFeed] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    apiClient.get('/api/needs/feed').then(r => { setFeed(r.data || []); setLoading(false) }).catch(() => setLoading(false))
  }, [])

  return (
    <div className="af-dashboard">
      <div>
        <h1 style={{ fontSize: '1.35rem', fontWeight: 700, margin: '0 0 0.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Rss size={20} style={{ color: '#10b981' }} /> Community Feed
        </h1>
        <p style={{ color: 'var(--af-muted)', fontSize: '0.85rem', margin: 0 }}>Latest updates from the Arpan community.</p>
      </div>

      {loading ? (
        <div className="loader-fullpage"><span className="loader" /></div>
      ) : feed.length === 0 ? (
        <div className="empty-state">
          <h3 className="empty-state__title">No community activity yet</h3>
          <p className="empty-state__desc">New updates will appear here as they happen.</p>
        </div>
      ) : (
        <div className="af-card af-activity">
          <ul className="af-activity__list" style={{ maxHeight: 'none' }}>
            {feed.map(item => {
              const kind = KIND_MAP[item.kind] || KIND_MAP.user
              return (
                <li key={item.id} className="af-activity__row">
                  <div className={`af-activity__icon ${kind.cls}`}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'currentColor', display: 'block' }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.15rem' }}>
                      <span className={`badge ${item.kind === 'success' ? 'badge--success' : item.kind === 'alert' ? 'badge--danger' : ''}`}
                        style={{ fontSize: '0.6rem', textTransform: 'uppercase' }}>
                        {kind.label}
                      </span>
                      <span style={{ fontSize: '0.65rem', color: 'var(--af-muted)' }}>{item.time}</span>
                    </div>
                    <p className="af-activity__msg" style={{ fontSize: '0.85rem' }}>{item.text}</p>
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
