import { useState, useEffect } from 'react'
import { Calendar, MapPin, Users, Clock, Check } from 'lucide-react'
import { apiClient } from '../../../services/apiClient.js'

const CAT_TONE = {
  cleanup: 'success', training: 'default', distribution: 'warning',
  awareness: 'default', medical: 'danger', general: '',
}

export default function VolunteerEvents() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)

  const load = () => {
    apiClient.get('/api/events').then(r => { setEvents(r.data || []); setLoading(false) }).catch(() => setLoading(false))
  }
  useEffect(() => { load() }, [])

  const handleRSVP = async (eventId, isRegistered) => {
    try {
      if (isRegistered) await apiClient.delete(`/api/events/${eventId}/unregister`)
      else await apiClient.post(`/api/events/${eventId}/register`)
      load()
    } catch (e) { console.error(e) }
  }

  return (
    <div className="af-dashboard">
      <div>
        <h1 style={{ fontSize: '1.35rem', fontWeight: 700, margin: '0 0 0.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Calendar size={20} style={{ color: '#8b5cf6' }} /> Events & Community Drives
        </h1>
        <p style={{ color: 'var(--af-muted)', fontSize: '0.85rem', margin: 0 }}>
          Register for upcoming events and give back to the community.
        </p>
      </div>

      {loading ? (
        <div className="loader-fullpage"><span className="loader" /></div>
      ) : events.length === 0 ? (
        <div className="empty-state">
          <h3 className="empty-state__title">No upcoming events</h3>
          <p className="empty-state__desc">Check back later for community drives and activities.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1rem' }}>
          {events.map(evt => {
            const fillPct = Math.min((evt.registeredCount / evt.spots) * 100, 100)
            return (
              <div key={evt.id} className="af-card" style={{ display: 'flex', flexDirection: 'column' }}>
                <div className="card__body" style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                    <span className={`badge badge--${CAT_TONE[evt.category] || ''}`} style={{ textTransform: 'capitalize' }}>{evt.category}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.75rem', color: 'var(--af-muted)' }}>
                      <Users size={14} /> {evt.registeredCount}/{evt.spots}
                    </div>
                  </div>

                  <h3 style={{ margin: '0 0 0.4rem', fontWeight: 700, fontSize: '1rem' }}>{evt.title}</h3>
                  <p style={{ color: 'var(--af-muted)', fontSize: '0.8rem', lineHeight: 1.5, marginBottom: '0.75rem' }}>{evt.description}</p>

                  <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.7rem', color: 'var(--af-muted)', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Calendar size={12} />{evt.date}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Clock size={12} />{evt.time}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><MapPin size={12} />{evt.location}</span>
                  </div>

                  {/* Fill bar */}
                  <div style={{ height: 4, borderRadius: 2, background: '#e5e7eb', marginBottom: '1rem', overflow: 'hidden' }}>
                    <div style={{ height: '100%', borderRadius: 2, background: '#3b82f6', width: `${fillPct}%`, transition: 'width 0.3s' }} />
                  </div>
                </div>

                <div style={{ padding: '0 1.25rem 1.25rem' }}>
                  <button onClick={() => handleRSVP(evt.id, evt.isRegistered)} className={`btn ${evt.isRegistered ? 'btn--secondary' : 'btn--primary'}`}
                    style={{ width: '100%', justifyContent: 'center', background: evt.isRegistered ? '#dcfce7' : undefined, color: evt.isRegistered ? '#166534' : undefined }}
                  >
                    {evt.isRegistered ? <><Check size={15} /> Registered</> : 'Register Now'}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
