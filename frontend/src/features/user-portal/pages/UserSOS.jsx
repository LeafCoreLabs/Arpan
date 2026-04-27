import { useState } from 'react'
import { AlertTriangle, Phone, CheckCircle } from 'lucide-react'
import { apiClient } from '../../../services/apiClient.js'

const EMERGENCY_CONTACTS = [
  { name: 'National Emergency', number: '112', color: '#ef4444' },
  { name: 'Ambulance', number: '108', color: '#3b82f6' },
  { name: 'Women Helpline', number: '1091', color: '#ec4899' },
  { name: 'Child Helpline', number: '1098', color: '#f59e0b' },
  { name: 'Disaster Mgmt', number: '1070', color: '#8b5cf6' },
  { name: 'Fire Services', number: '101', color: '#f97316' },
]

export default function UserSOS() {
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [location, setLocation] = useState('')

  const sendSOS = async () => {
    setSending(true)
    let lat = 28.6139, lng = 77.2090
    try {
      const pos = await new Promise((resolve, reject) => navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 }))
      lat = pos.coords.latitude; lng = pos.coords.longitude
    } catch (e) { /* use defaults */ }

    try {
      await apiClient.post('/api/needs', {
        title: 'SOS — Emergency Help Needed',
        description: `EMERGENCY: User sent SOS from coordinates (${lat.toFixed(4)}, ${lng.toFixed(4)}). Immediate assistance required.`,
        location: location || `GPS: ${lat.toFixed(4)}, ${lng.toFixed(4)}`,
        issueType: 'safety', severity: 'critical', peopleAffected: 1, lat, lng
      })
      setSent(true); setTimeout(() => setSent(false), 5000)
    } catch (e) { console.error(e) }
    setSending(false)
  }

  return (
    <div className="af-dashboard" style={{ maxWidth: '700px' }}>
      <div>
        <h1 style={{ fontSize: '1.35rem', fontWeight: 700, margin: '0 0 0.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ef4444' }}>
          <AlertTriangle size={20} /> SOS Emergency
        </h1>
        <p style={{ color: 'var(--af-muted)', fontSize: '0.85rem', margin: 0 }}>Send an emergency alert to coordinators and nearby volunteers.</p>
      </div>

      {/* SOS Button */}
      <div className="af-card" style={{ textAlign: 'center', border: '1px solid #fecaca', padding: '2rem' }}>
        {sent ? (
          <div>
            <CheckCircle size={56} style={{ color: '#16a34a', marginBottom: '1rem' }} />
            <h3 style={{ color: '#16a34a', fontWeight: 700, margin: 0 }}>SOS Alert Sent!</h3>
            <p style={{ color: 'var(--af-muted)', fontSize: '0.85rem', marginTop: '0.5rem' }}>Coordinators have been notified. Help is on the way.</p>
          </div>
        ) : (
          <>
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', marginBottom: '0.3rem', fontSize: '0.8rem', color: 'var(--af-muted)', fontWeight: 500 }}>Location (optional)</label>
              <input className="searchbar" value={location} onChange={e => setLocation(e.target.value)} placeholder="e.g. Near Block A, Sector 12" style={{ maxWidth: '400px', margin: '0 auto' }} />
            </div>
            <button onClick={sendSOS} disabled={sending}
              style={{
                width: 140, height: 140, borderRadius: '50%', border: 'none',
                background: 'linear-gradient(145deg, #ef4444, #dc2626)',
                color: '#fff', fontSize: '1.2rem', fontWeight: 800, cursor: sending ? 'not-allowed' : 'pointer',
                boxShadow: '0 0 40px rgba(239,68,68,0.3), 0 0 80px rgba(239,68,68,0.1)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.25rem',
                margin: '0 auto',
              }}>
              <AlertTriangle size={32} />
              <span>{sending ? 'Sending...' : 'SOS'}</span>
            </button>
            <p style={{ color: 'var(--af-muted)', fontSize: '0.75rem', marginTop: '1rem' }}>Press to send an emergency alert with your GPS location</p>
          </>
        )}
      </div>

      {/* Emergency Contacts */}
      <div>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0 0 0.75rem' }}>Emergency Contacts</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '0.75rem' }}>
          {EMERGENCY_CONTACTS.map(c => (
            <div key={c.number} className="af-card" style={{ padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: 36, height: 36, borderRadius: '10px', background: `${c.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Phone size={16} style={{ color: c.color }} />
              </div>
              <div>
                <div style={{ fontSize: '0.8rem', fontWeight: 600 }}>{c.name}</div>
                <div style={{ fontSize: '1rem', fontWeight: 700, color: c.color }}>{c.number}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
