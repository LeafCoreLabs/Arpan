import { useState, useEffect } from 'react'
import { BarChart3, FileText, Send, AlertCircle, CheckCircle, Clock } from 'lucide-react'
import { apiClient } from '../../../services/apiClient.js'

const issueTypes = ['general', 'food', 'water', 'medical', 'shelter', 'education', 'sanitation', 'safety']

export default function DataCollectionDashboardPage() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [needs, setNeeds] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({
    title: '', description: '', location: '', issueType: 'general',
    severity: 'medium', peopleAffected: 1, lat: 28.6139, lng: 77.2090
  })

  const loadData = async () => {
    setLoading(true)
    try { const { data } = await apiClient.get('/api/needs'); setNeeds(data) }
    catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  useEffect(() => { loadData() }, [])

  const handleSubmit = async (e) => {
    e.preventDefault(); setSubmitting(true)
    try {
      await apiClient.post('/api/needs', form)
      setForm({ title: '', description: '', location: '', issueType: 'general', severity: 'medium', peopleAffected: 1, lat: 28.6139, lng: 77.2090 })
      setActiveTab('dashboard'); loadData()
    } catch (err) { console.error(err) }
    finally { setSubmitting(false) }
  }

  const total = needs.length
  const critical = needs.filter(n => n.severity === 'critical').length
  const resolved = needs.filter(n => n.status === 'resolved').length
  const pending = needs.filter(n => n.status === 'unassigned').length

  const metricCards = [
    { label: 'Total Reports', value: total, icon: BarChart3, tone: 'default' },
    { label: 'Critical Reports', value: critical, icon: AlertCircle, tone: 'danger' },
    { label: 'Pending Review', value: pending, icon: Clock, tone: 'warning' },
    { label: 'Resolved', value: resolved, icon: CheckCircle, tone: 'success' },
  ]

  return (
    <div className="af-dashboard">
      {/* Tab Bar */}
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        {[
          { key: 'dashboard', label: 'Dashboard', icon: BarChart3 },
          { key: 'submit', label: 'Submit Report', icon: FileText },
        ].map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            className={`btn ${activeTab === tab.key ? 'btn--primary' : 'btn--ghost'}`}>
            <tab.icon size={16} /> {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'dashboard' && (
        <>
          {/* KPI Cards */}
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

          {/* Data Quality + Recent */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div className="af-card" style={{ padding: '1.5rem' }}>
              <h3 className="af-card__title" style={{ marginBottom: '1rem' }}>Issue Type Distribution</h3>
              {issueTypes.map(type => {
                const count = needs.filter(n => n.issueType === type).length
                const pct = total > 0 ? (count / total * 100) : 0
                return (
                  <div key={type} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                    <span style={{ width: '80px', fontSize: '0.75rem', color: 'var(--af-muted)', textTransform: 'capitalize' }}>{type}</span>
                    <div style={{ flex: 1, height: 6, borderRadius: 3, background: 'var(--af-border)' }}>
                      <div style={{ width: `${pct}%`, height: '100%', borderRadius: 3, background: 'var(--af-orange)', transition: 'width 0.5s' }} />
                    </div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--af-muted)', width: '25px', textAlign: 'right' }}>{count}</span>
                  </div>
                )
              })}
            </div>

            <div className="af-card" style={{ padding: '1.5rem' }}>
              <h3 className="af-card__title" style={{ marginBottom: '1rem' }}>Recent Submissions</h3>
              {loading ? <p style={{ color: 'var(--af-muted)' }}>Loading...</p> : needs.length === 0 ? (
                <p style={{ color: 'var(--af-muted)', fontSize: '0.85rem' }}>No submissions yet.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '280px', overflowY: 'auto' }}>
                  {needs.slice(0, 8).map(n => (
                    <div key={n.id} style={{ padding: '0.6rem', background: 'var(--af-card)', borderRadius: '0.5rem', border: '1px solid var(--af-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <p style={{ margin: 0, fontSize: '0.8rem', fontWeight: 500 }}>{n.title}</p>
                        <p style={{ margin: 0, fontSize: '0.7rem', color: 'var(--af-muted)' }}>{n.location} &middot; {n.issueType}</p>
                      </div>
                      <span className={`badge badge--${n.severity === 'critical' ? 'danger' : n.severity === 'high' ? 'warning' : ''}`} style={{ textTransform: 'capitalize' }}>{n.severity}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {activeTab === 'submit' && (
        <form onSubmit={handleSubmit} className="af-card" style={{ padding: '2rem', maxWidth: '700px' }}>
          <h3 style={{ margin: '0 0 1.5rem', fontWeight: 700 }}>Submit Field Report</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.3rem', fontSize: '0.8rem', color: 'var(--af-muted)', fontWeight: 500 }}>Title *</label>
              <input required className="searchbar" value={form.title} onChange={e => setForm(f => ({...f, title: e.target.value}))} placeholder="Report title" />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.3rem', fontSize: '0.8rem', color: 'var(--af-muted)', fontWeight: 500 }}>Location *</label>
              <input required className="searchbar" value={form.location} onChange={e => setForm(f => ({...f, location: e.target.value}))} placeholder="Location" />
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
              <textarea className="searchbar" value={form.description} onChange={e => setForm(f => ({...f, description: e.target.value}))} rows={3} placeholder="Detailed description..." style={{ resize: 'vertical' }} />
            </div>
          </div>
          <button type="submit" disabled={submitting} className="btn btn--primary" style={{ marginTop: '1.5rem' }}>
            <Send size={16} /> {submitting ? 'Submitting...' : 'Submit Report'}
          </button>
        </form>
      )}
    </div>
  )
}
