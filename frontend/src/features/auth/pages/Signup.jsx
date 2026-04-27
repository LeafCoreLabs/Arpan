import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { apiClient } from '../../../services/apiClient.js'
import { useAuth } from '../hooks/useAuth.js'
import { persistToken } from '../api/auth.api.js'

export default function Signup() {
  const { setUser } = useAuth()
  const nav = useNavigate()

  const [role, setRole] = useState('user') // 'user' or 'volunteer'
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [skills, setSkills] = useState('')
  const [region, setRegion] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      if (role === 'user') {
        const { data } = await apiClient.post('/api/v1/auth/signup/user', {
          email, password, full_name: fullName
        })
        persistToken(data.access_token)
        setUser(data.user)
        nav('/community', { replace: true })
      } else {
        await apiClient.post('/api/v1/auth/signup/volunteer', {
          email, password, full_name: fullName, skills, region
        })
        setSuccess('🎉 Registration submitted! A coordinator will review and approve your account. You will be notified when approved.')
        setFullName(''); setEmail(''); setPassword(''); setSkills(''); setRegion('')
      }
    } catch (err) {
      setError(err?.response?.data?.detail || err?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  const roleConfig = {
    user: { title: 'Community Signup', subtitle: 'Create an account to report needs and track resolutions.', color: '#10b981' },
    volunteer: { title: 'Volunteer Signup', subtitle: 'Register to help — your application will be reviewed by a coordinator.', color: '#3b82f6' }
  }

  const inputStyle = {
    width: '100%', padding: '0.75rem 1rem', borderRadius: '8px',
    background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)',
    color: '#fff', fontSize: '1rem', outline: 'none', transition: 'border-color 0.2s'
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      style={{ width: '100%', color: '#f3f4f6' }}
    >
      {/* Role Selector */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', background: 'rgba(255,255,255,0.05)', padding: '0.35rem', borderRadius: '12px' }}>
        {['user', 'volunteer'].map(r => (
          <button key={r} onClick={() => { setRole(r); setError(''); setSuccess('') }}
            style={{
              flex: 1, padding: '0.6rem 0', borderRadius: '8px', border: 'none',
              background: role === r ? 'rgba(255,255,255,0.1)' : 'transparent',
              color: role === r ? '#fff' : '#9ca3af',
              fontWeight: role === r ? 600 : 500,
              fontSize: '0.85rem', cursor: 'pointer', transition: 'all 0.2s',
              textTransform: 'capitalize'
            }}>
            {r === 'user' ? '🙏 Community User' : '🤝 Volunteer'}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={role} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
          <h2 style={{ margin: '0 0 0.5rem', fontSize: '1.5rem', fontWeight: 700, color: '#fff' }}>
            {roleConfig[role].title}
          </h2>
          <p style={{ margin: '0 0 1.5rem', color: '#9ca3af', fontSize: '0.85rem' }}>
            {roleConfig[role].subtitle}
          </p>

          {success && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              style={{ padding: '1rem', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '10px', color: '#6ee7b7', fontSize: '0.85rem', marginBottom: '1.5rem', lineHeight: 1.5 }}>
              {success}
            </motion.div>
          )}

          <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.8rem', color: '#d1d5db', fontWeight: 500 }}>Full Name *</label>
              <input required value={fullName} onChange={e => setFullName(e.target.value)} placeholder="e.g. Priya Sharma" style={inputStyle}
                onFocus={e => e.target.style.borderColor = roleConfig[role].color}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.8rem', color: '#d1d5db', fontWeight: 500 }}>Email *</label>
              <input required type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" style={inputStyle}
                onFocus={e => e.target.style.borderColor = roleConfig[role].color}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.8rem', color: '#d1d5db', fontWeight: 500 }}>Password *</label>
              <input required type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Min 6 characters" style={inputStyle}
                onFocus={e => e.target.style.borderColor = roleConfig[role].color}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'} />
            </div>

            {role === 'volunteer' && (
              <>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.8rem', color: '#d1d5db', fontWeight: 500 }}>Skills</label>
                  <input value={skills} onChange={e => setSkills(e.target.value)} placeholder="e.g. first-aid, logistics, driving" style={inputStyle}
                    onFocus={e => e.target.style.borderColor = roleConfig[role].color}
                    onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'} />
                  <p style={{ margin: '0.25rem 0 0', fontSize: '0.7rem', color: '#6b7280' }}>Comma separated skills</p>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.8rem', color: '#d1d5db', fontWeight: 500 }}>Region / Area</label>
                  <input value={region} onChange={e => setRegion(e.target.value)} placeholder="e.g. Central Delhi" style={inputStyle}
                    onFocus={e => e.target.style.borderColor = roleConfig[role].color}
                    onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'} />
                </div>
              </>
            )}

            {error && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                style={{ padding: '0.75rem', background: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.3)', borderRadius: '8px', color: '#fca5a5', fontSize: '0.85rem' }}>
                {error}
              </motion.div>
            )}

            <button type="submit" disabled={loading}
              style={{
                marginTop: '0.25rem', width: '100%', padding: '0.85rem', borderRadius: '8px',
                background: loading ? 'rgba(255,255,255,0.1)' : roleConfig[role].color,
                color: '#fff', fontSize: '1rem', fontWeight: 600, border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer', transition: 'all 0.2s',
                boxShadow: loading ? 'none' : `0 4px 14px ${roleConfig[role].color}40`
              }}
              onMouseEnter={e => !loading && (e.currentTarget.style.transform = 'translateY(-1px)')}
              onMouseLeave={e => !loading && (e.currentTarget.style.transform = 'translateY(0)')}>
              {loading ? 'Submitting...' : role === 'volunteer' ? 'Submit for Approval' : 'Create Account'}
            </button>
          </form>

          <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
            <p style={{ color: '#6b7280', fontSize: '0.85rem' }}>
              Already have an account? <Link to="/login" style={{ color: roleConfig[role].color, fontWeight: 500, textDecoration: 'none' }}>Sign in here</Link>
            </p>
          </div>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  )
}
