import { useState, useRef } from 'react'
import { Send, MapPin, CheckCircle, Camera, X } from 'lucide-react'
import { apiClient } from '../../../services/apiClient.js'

const issueTypes = ['general', 'food', 'water', 'medical', 'shelter', 'education', 'sanitation', 'safety']

export default function UserReportNeed() {
  const [form, setForm] = useState({ title: '', description: '', location: '', issueType: 'general', severity: 'medium', peopleAffected: 1, lat: 28.6139, lng: 77.2090 })
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [imagePreview, setImagePreview] = useState(null)
  const [imageFile, setImageFile] = useState(null)
  const fileInputRef = useRef(null)

  const handleLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => setForm(f => ({ ...f, lat: pos.coords.latitude, lng: pos.coords.longitude })),
        () => alert('Location access denied')
      )
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) { alert('Image must be under 5MB'); return }
    setImageFile(file)
    const reader = new FileReader()
    reader.onload = (ev) => setImagePreview(ev.target.result)
    reader.readAsDataURL(file)
  }

  const removeImage = () => { setImageFile(null); setImagePreview(null); if (fileInputRef.current) fileInputRef.current.value = '' }

  const handleSubmit = async (e) => {
    e.preventDefault(); setSubmitting(true)
    try {
      const { data } = await apiClient.post('/api/needs', form)
      const needId = data?.id || data?.need?.id
      if (imageFile && needId) {
        const fd = new FormData()
        fd.append('file', imageFile)
        await apiClient.post(`/api/upload/need-image/${needId}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      }
      setForm({ title: '', description: '', location: '', issueType: 'general', severity: 'medium', peopleAffected: 1, lat: 28.6139, lng: 77.2090 })
      removeImage()
      setSuccess(true); setTimeout(() => setSuccess(false), 3000)
    } catch (err) { console.error(err) }
    setSubmitting(false)
  }

  return (
    <div className="af-dashboard" style={{ maxWidth: '700px' }}>
      <div>
        <h1 style={{ fontSize: '1.35rem', fontWeight: 700, margin: '0 0 0.2rem' }}>Report a Community Need</h1>
        <p style={{ color: 'var(--af-muted)', fontSize: '0.85rem', margin: 0 }}>Help us understand what your community needs.</p>
      </div>

      {success && (
        <div className="af-card" style={{ padding: '1rem 1.25rem', border: '1px solid #bbf7d0', display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#16a34a' }}>
          <CheckCircle size={20} /> <span style={{ fontWeight: 600 }}>Need reported successfully! A coordinator will review it shortly.</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="af-card" style={{ padding: '2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.3rem', fontSize: '0.8rem', color: 'var(--af-muted)', fontWeight: 500 }}>Title *</label>
            <input required className="searchbar" value={form.title} onChange={e => setForm(f => ({...f, title: e.target.value}))} placeholder="e.g. Water shortage in Block A" />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.3rem', fontSize: '0.8rem', color: 'var(--af-muted)', fontWeight: 500 }}>Location *</label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input required className="searchbar" value={form.location} onChange={e => setForm(f => ({...f, location: e.target.value}))} placeholder="e.g. Sector 12, Noida" style={{ flex: 1 }} />
              <button type="button" onClick={handleLocation} className="btn btn--ghost" title="Use my location" style={{ padding: '0 0.7rem' }}>
                <MapPin size={16} />
              </button>
            </div>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.3rem', fontSize: '0.8rem', color: 'var(--af-muted)', fontWeight: 500 }}>Category</label>
            <select className="searchbar" value={form.issueType} onChange={e => setForm(f => ({...f, issueType: e.target.value}))}>
              {issueTypes.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
            </select>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.3rem', fontSize: '0.8rem', color: 'var(--af-muted)', fontWeight: 500 }}>Severity</label>
            <select className="searchbar" value={form.severity} onChange={e => setForm(f => ({...f, severity: e.target.value}))}>
              {['low', 'medium', 'high', 'critical'].map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
            </select>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.3rem', fontSize: '0.8rem', color: 'var(--af-muted)', fontWeight: 500 }}>People Affected</label>
            <input type="number" min="1" className="searchbar" value={form.peopleAffected} onChange={e => setForm(f => ({...f, peopleAffected: parseInt(e.target.value) || 1}))} />
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={{ display: 'block', marginBottom: '0.3rem', fontSize: '0.8rem', color: 'var(--af-muted)', fontWeight: 500 }}>Description</label>
            <textarea className="searchbar" value={form.description} onChange={e => setForm(f => ({...f, description: e.target.value}))} rows={3} placeholder="Describe the situation in detail..." style={{ resize: 'vertical' }} />
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={{ display: 'block', marginBottom: '0.3rem', fontSize: '0.8rem', color: 'var(--af-muted)', fontWeight: 500 }}>Photo Evidence (optional)</label>
            <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={handleImageChange} style={{ display: 'none' }} />
            {imagePreview ? (
              <div style={{ position: 'relative', display: 'inline-block' }}>
                <img src={imagePreview} alt="Preview" style={{ maxWidth: '200px', maxHeight: '150px', borderRadius: '8px', border: '1px solid var(--af-border)' }} />
                <button type="button" onClick={removeImage} style={{ position: 'absolute', top: -8, right: -8, background: '#ef4444', color: '#fff', border: 'none', borderRadius: '50%', width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                  <X size={12} />
                </button>
              </div>
            ) : (
              <button type="button" onClick={() => fileInputRef.current?.click()} className="btn btn--ghost" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Camera size={16} /> Attach Photo
              </button>
            )}
          </div>
        </div>
        <button type="submit" disabled={submitting} className="btn btn--primary" style={{ marginTop: '1.5rem' }}>
          <Send size={16} /> {submitting ? 'Submitting...' : 'Submit Report'}
        </button>
      </form>
    </div>
  )
}
