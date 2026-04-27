import { useState, useEffect } from 'react'
import { UserCircle, Save, Award } from 'lucide-react'
import { apiClient } from '../../../services/apiClient.js'

const SKILL_COLORS = ['#3b82f6', '#16a34a', '#f59e0b', '#8b5cf6', '#ef4444', '#ec4899']

export default function VolunteerProfile() {
  const [profile, setProfile] = useState(null)
  const [form, setForm] = useState({ full_name: '', skills: '', region: '' })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    apiClient.get('/api/profile').then(r => {
      setProfile(r.data)
      setForm({ full_name: r.data.name || '', skills: r.data.skills || '', region: r.data.region || '' })
    }).catch(() => {})
  }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      await apiClient.put('/api/profile', form)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch (e) { console.error(e) }
    setSaving(false)
  }

  const skills = (profile?.skills || '').split(',').filter(Boolean)

  return (
    <div className="af-dashboard" style={{ maxWidth: '700px' }}>
      <div>
        <h1 style={{ fontSize: '1.35rem', fontWeight: 700, margin: '0 0 0.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <UserCircle size={20} style={{ color: '#8b5cf6' }} /> My Profile
        </h1>
        <p style={{ color: 'var(--af-muted)', fontSize: '0.85rem', margin: 0 }}>
          Manage your volunteer profile and skills.
        </p>
      </div>

      {/* Profile Header */}
      {profile && (
        <div className="af-card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <div style={{
              width: 56, height: 56, borderRadius: '1rem', flexShrink: 0,
              background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.4rem', fontWeight: 800, color: '#fff',
            }}>
              {(profile.name || 'V').charAt(0).toUpperCase()}
            </div>
            <div style={{ flex: 1 }}>
              <h2 style={{ margin: 0, fontWeight: 700, fontSize: '1.05rem' }}>{profile.name}</h2>
              <p style={{ margin: '0.15rem 0 0', color: 'var(--af-muted)', fontSize: '0.8rem' }}>{profile.email}</p>
              <p style={{ margin: '0.1rem 0 0', color: 'var(--af-muted)', fontSize: '0.7rem' }}>Joined: {profile.createdAt?.split('T')[0] || 'N/A'}</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#f59e0b' }}>{profile.rating || 0}/5</div>
              <div style={{ fontSize: '0.65rem', color: 'var(--af-muted)', textTransform: 'uppercase' }}>Rating</div>
            </div>
          </div>
        </div>
      )}

      {/* Skill Badges */}
      {skills.length > 0 && (
        <div className="af-card" style={{ padding: '1.25rem' }}>
          <h3 style={{ margin: '0 0 0.75rem', fontWeight: 600, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Award size={16} style={{ color: '#f59e0b' }} /> Skill Badges
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
            {skills.map((s, i) => (
              <span key={s} className="af-tag" style={{
                borderColor: SKILL_COLORS[i % SKILL_COLORS.length],
                color: SKILL_COLORS[i % SKILL_COLORS.length],
                textTransform: 'capitalize',
              }}>{s.trim()}</span>
            ))}
          </div>
        </div>
      )}

      {/* Edit Form */}
      <div className="af-card" style={{ padding: '1.25rem' }}>
        <h3 style={{ margin: '0 0 1rem', fontWeight: 600, fontSize: '0.9rem' }}>Edit Profile</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.3rem', fontSize: '0.8rem', color: 'var(--af-muted)', fontWeight: 500 }}>Full Name</label>
            <input className="searchbar" value={form.full_name} onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.3rem', fontSize: '0.8rem', color: 'var(--af-muted)', fontWeight: 500 }}>Skills (comma-separated)</label>
            <input className="searchbar" value={form.skills} onChange={e => setForm(f => ({ ...f, skills: e.target.value }))} placeholder="e.g. first-aid, logistics, teaching" />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.3rem', fontSize: '0.8rem', color: 'var(--af-muted)', fontWeight: 500 }}>Region</label>
            <input className="searchbar" value={form.region} onChange={e => setForm(f => ({ ...f, region: e.target.value }))} placeholder="e.g. Central Delhi" />
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className={`btn ${saved ? '' : 'btn--primary'}`}
            style={{
              width: '100%', justifyContent: 'center',
              background: saved ? '#16a34a' : undefined,
              color: saved ? '#fff' : undefined,
            }}
          >
            <Save size={15} /> {saved ? 'Saved!' : saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  )
}
