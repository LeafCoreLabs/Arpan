import { useAuth } from '../../app/providers.jsx'
import { useNavigate } from 'react-router-dom'
import { LogOut, UserCircle2 } from 'lucide-react'

/**
 * Lightweight header bar for Volunteer and User portals (no sidebar).
 */
export function PortalHeader() {
  const { user, logout } = useAuth()
  const nav = useNavigate()

  return (
    <header style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '1rem 2rem',
      background: 'rgba(255,255,255,0.02)',
      borderBottom: '1px solid rgba(255,255,255,0.05)',
      backdropFilter: 'blur(10px)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff' }}>Arpan</span>
        <span style={{ fontSize: '0.8rem', color: '#9ca3af', opacity: 0.7 }}>अर्पण</span>
        <span style={{
          marginLeft: '0.5rem', padding: '0.2rem 0.6rem', borderRadius: '4px',
          background: user?.role === 'VOLUNTEER' ? 'rgba(59,130,246,0.15)' : 'rgba(16,185,129,0.15)',
          color: user?.role === 'VOLUNTEER' ? '#60a5fa' : '#34d399',
          fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase'
        }}>
          {user?.role === 'VOLUNTEER' ? 'Volunteer' : 'Community'}
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#d1d5db', fontSize: '0.85rem' }}>
          <UserCircle2 size={20} />
          <span>{user?.name || user?.email || 'Guest'}</span>
        </div>
        <button
          onClick={() => {
            logout()
            nav('/login', { replace: true })
          }}
          style={{
            padding: '0.4rem 0.8rem', borderRadius: '6px',
            border: '1px solid rgba(220,38,38,0.3)', background: 'rgba(220,38,38,0.08)',
            color: '#ef4444', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: '0.4rem', transition: 'all 0.2s'
          }}
        >
          <LogOut size={14} /> Sign Out
        </button>
      </div>
    </header>
  )
}
