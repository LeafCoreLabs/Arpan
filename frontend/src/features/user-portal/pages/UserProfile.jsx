import { useState, useEffect } from 'react'
import { UserCircle, Save } from 'lucide-react'
import { apiClient } from '../../../services/apiClient.js'

export default function UserProfile() {
  const [profile, setProfile] = useState(null)
  const [form, setForm] = useState({ full_name: '' })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [stats, setStats] = useState(null)

  useEffect(() => {
    apiClient.get('/api/profile').then(r => { setProfile(r.data); setForm({ full_name: r.data.name || '' }) }).catch(() => {})
    apiClient.get('/api/profile/stats').then(r => setStats(r.data)).catch(() => {})
  }, [])

  const handleSave = async () => {
    setSaving(true)
    try { await apiClient.put('/api/profile', form); setSaved(true); setTimeout(() => setSaved(false), 2000) }
    catch (e) { console.error(e) }
    setSaving(false)
  }

  const statCards = [
    { label: 'Reported', value: stats?.totalNeeds || 0, tone: 'default' },
    { label: 'Resolved', value: stats?.resolvedNeeds || 0, tone: 'success' },
    { label: 'Active', value: stats?.activeNeeds || 0, tone: 'warning' },
  ]

  return (
    <div className="af-dashboard" style={{ maxWidth: '600px' }}>
      <div>
        <h1 style={{ fontSize: '1.35rem', fontWeight: 700, margin: '0 0 0.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <UserCircle size={20} style={{ color: '#10b981' }} /> My Profile
        </h1>
        <p style={{ color: 'var(--af-muted)', fontSize: '0.85rem', margin: 0 }}>Manage your community account.</p>
      </div>

      {/* Profile Card */}
      {profile && (
        <div className="af-card" style={{ padding: '1.25rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div style={{
            width: 56, height: 56, borderRadius: '1rem', flexShrink: 0,
            background: 'linear-gradient(135deg, #10b981, #059669)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.4rem', fontWeight: 800, color: '#fff',
          }}>{(profile.name || 'U').charAt(0).toUpperCase()}</div>
          <div>
            <h2 style={{ margin: 0, fontWeight: 700, fontSize: '1.05rem' }}>{profile.name}</h2>
            <p style={{ margin: '0.15rem 0 0', color: 'var(--af-muted)', fontSize: '0.8rem' }}>{profile.email}</p>
            <p style={{ margin: '0.1rem 0 0', color: 'var(--af-muted)', fontSize: '0.7rem' }}>Joined: {profile.createdAt?.split('T')[0] || 'N/A'}</p>
          </div>
        </div>
      )}

      {/* Stats */}
      {stats && (
        <div className="af-metrics">
          {statCards.map(s => (
            <div key={s.label} className="af-metric">
              <div>
                <p className="af-metric__label">{s.label}</p>
                <p className="af-metric__value" style={{ fontSize: '1.5rem' }}>{s.value}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit */}
      <div className="af-card" style={{ padding: '1.25rem' }}>
        <h3 style={{ margin: '0 0 1rem', fontWeight: 600, fontSize: '0.9rem' }}>Edit Profile</h3>
        <div>
          <label style={{ display: 'block', marginBottom: '0.3rem', fontSize: '0.8rem', color: 'var(--af-muted)', fontWeight: 500 }}>Full Name</label>
          <input className="searchbar" value={form.full_name} onChange={e => setForm({ ...form, full_name: e.target.value })} />
        </div>
        <button onClick={handleSave} disabled={saving}
          className={`btn ${saved ? '' : 'btn--primary'}`}
          style={{
            marginTop: '1rem', width: '100%', justifyContent: 'center',
            background: saved ? '#16a34a' : undefined, color: saved ? '#fff' : undefined,
          }}>
          <Save size={15} /> {saved ? 'Saved!' : saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  )
}
