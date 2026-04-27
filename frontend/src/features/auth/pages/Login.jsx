import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ROUTES } from '../../../config/routes.js'
import { useAuth } from '../hooks/useAuth.js'
import { loginRequest, persistToken } from '../api/auth.api.js'

export default function Login() {
  const { setUser } = useAuth()
  const nav = useNavigate()
  
  const [role, setRole] = useState('coordinator')
  const [email, setEmail] = useState('admin@arpan.org')
  const [password, setPassword] = useState('admin123')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (role === 'coordinator') {
      setEmail('admin@arpan.org')
      setPassword('admin123')
    } else if (role === 'volunteer') {
      setEmail('volunteer@arpan.org')
      setPassword('volunteer123')
    } else {
      setEmail('user@arpan.org')
      setPassword('user123')
    }
    setError('')
  }, [role])

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const data = await loginRequest({ email, password })
      persistToken(data?.token)
      setUser(data?.user ?? null)

      // Route based on actual role from server
      const userRole = data?.user?.role
      if (userRole === 'VOLUNTEER') {
        nav('/volunteer', { replace: true })
      } else if (userRole === 'USER') {
        nav('/community', { replace: true })
      } else {
        nav(ROUTES.DASHBOARD, { replace: true })
      }
    } catch (err) {
      setError(err?.message ?? 'Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  const roleConfig = {
    coordinator: { title: 'Coordinator Portal', subtitle: 'Manage operations, volunteers, and community needs.', color: '#f97316' },
    volunteer: { title: 'Volunteer Portal', subtitle: 'View assigned tasks and update progress.', color: '#3b82f6' },
    user: { title: 'Community Portal', subtitle: 'Report needs and track their resolution.', color: '#10b981' }
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      style={{ width: '100%', color: '#f3f4f6' }}
    >
      {/* Role Selector Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2.5rem', background: 'rgba(255,255,255,0.05)', padding: '0.35rem', borderRadius: '12px' }}>
        {['coordinator', 'volunteer', 'user'].map((r) => (
          <button
            key={r}
            onClick={() => setRole(r)}
            style={{
              flex: 1, padding: '0.6rem 0', borderRadius: '8px', border: 'none',
              background: role === r ? 'rgba(255,255,255,0.1)' : 'transparent',
              color: role === r ? '#fff' : '#9ca3af',
              fontWeight: role === r ? 600 : 500,
              fontSize: '0.85rem', cursor: 'pointer', transition: 'all 0.2s',
              textTransform: 'capitalize'
            }}
          >
            {r}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={role}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          <h2 style={{ margin: '0 0 0.5rem', fontSize: '1.75rem', fontWeight: 700, color: '#fff' }}>
            {roleConfig[role].title}
          </h2>
          <p style={{ margin: '0 0 2rem', color: '#9ca3af', fontSize: '0.9rem' }}>
            {roleConfig[role].subtitle}
          </p>

          <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label htmlFor="email" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', color: '#d1d5db', fontWeight: 500 }}>Email Address</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  width: '100%', padding: '0.75rem 1rem', borderRadius: '8px',
                  background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)',
                  color: '#fff', fontSize: '1rem', outline: 'none', transition: 'border-color 0.2s'
                }}
                onFocus={(e) => e.target.style.borderColor = roleConfig[role].color}
                onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
              />
            </div>
            
            <div>
              <label htmlFor="password" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', color: '#d1d5db', fontWeight: 500 }}>Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  width: '100%', padding: '0.75rem 1rem', borderRadius: '8px',
                  background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)',
                  color: '#fff', fontSize: '1rem', outline: 'none', transition: 'border-color 0.2s'
                }}
                onFocus={(e) => e.target.style.borderColor = roleConfig[role].color}
                onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
              />
            </div>

            {error && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ padding: '0.75rem', background: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.3)', borderRadius: '8px', color: '#fca5a5', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                {error}
              </motion.div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                marginTop: '0.5rem', width: '100%', padding: '0.85rem', borderRadius: '8px',
                background: loading ? 'rgba(255,255,255,0.1)' : roleConfig[role].color,
                color: '#fff', fontSize: '1rem', fontWeight: 600, border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer', transition: 'all 0.2s',
                boxShadow: loading ? 'none' : `0 4px 14px ${roleConfig[role].color}40`
              }}
              onMouseEnter={(e) => !loading && (e.currentTarget.style.transform = 'translateY(-1px)')}
              onMouseLeave={(e) => !loading && (e.currentTarget.style.transform = 'translateY(0)')}
            >
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>

          <div style={{ marginTop: '2rem', textAlign: 'center' }}>
            <p style={{ color: '#6b7280', fontSize: '0.8rem' }}>
              Default: <span style={{ color: '#d1d5db' }}>{roleConfig[role].title === 'Community Portal' ? 'user@arpan.org / user123' : role === 'volunteer' ? 'volunteer@arpan.org / volunteer123' : 'admin@arpan.org / admin123'}</span>
            </p>
            <p style={{ color: '#6b7280', fontSize: '0.85rem', marginTop: '0.75rem' }}>
              Don't have an account? <a href="/signup" style={{ color: roleConfig[role].color, fontWeight: 500, textDecoration: 'none' }}>Sign up here</a>
            </p>
          </div>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  )
}
