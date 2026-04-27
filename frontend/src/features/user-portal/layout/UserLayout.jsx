import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { LayoutDashboard, PlusCircle, ListChecks, Rss, AlertTriangle, Building2, UserCircle, LogOut } from 'lucide-react'
import { useAuth } from '../../../app/providers.jsx'
import { ROUTES } from '../../../config/routes.js'

const NAV_ITEMS = [
  { to: ROUTES.COMMUNITY_DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
  { to: ROUTES.COMMUNITY_REPORT, label: 'Report Need', icon: PlusCircle },
  { to: ROUTES.COMMUNITY_TRACKER, label: 'My Reports', icon: ListChecks },
  { to: ROUTES.COMMUNITY_FEED, label: 'Community Feed', icon: Rss },
  { to: ROUTES.COMMUNITY_SOS, label: 'SOS Emergency', icon: AlertTriangle, danger: true },
  { to: ROUTES.COMMUNITY_RESOURCES, label: 'Resources', icon: Building2 },
  { to: ROUTES.COMMUNITY_PROFILE, label: 'My Profile', icon: UserCircle },
]

export function UserLayout() {
  const { user, logout } = useAuth()
  const nav = useNavigate()

  return (
    <div className="app-shell">
      <aside className="af-sidebar af-sidebar--user">
        {/* Brand */}
        <div className="af-sidebar__brand">
          <div className="af-sidebar__logo" style={{ background: 'linear-gradient(140deg, #d1fae5, #10b981 55%, #059669)' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/><path d="M2 12h20"/>
            </svg>
          </div>
          <div>
            <span className="af-sidebar__title">Arpan</span>
            <div style={{ fontSize: '0.65rem', color: '#10b981', fontWeight: 600, letterSpacing: '0.06em' }}>COMMUNITY</div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="af-sidebar__nav">
          {NAV_ITEMS.map(({ to, label, icon: Icon, danger }) => (
            <NavLink
              key={to}
              to={to}
              end={to === ROUTES.COMMUNITY_DASHBOARD}
              className={({ isActive }) => `af-sidebar__link af-sidebar__link--user ${isActive ? 'is-active' : ''} ${danger ? 'af-sidebar__link--sos' : ''}`}
            >
              <Icon size={18} className="af-sidebar__link-icon" />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Footer: user info + sign out */}
        <div className="af-sidebar__footer">
          <div className="af-sidebar__utils">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.25rem' }}>
              <div style={{
                width: 32, height: 32, borderRadius: '8px',
                background: 'linear-gradient(135deg, #10b981, #059669)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.75rem', fontWeight: 700, color: '#fff', flexShrink: 0,
              }}>
                {(user?.name || 'U').charAt(0).toUpperCase()}
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user?.name || 'Community Member'}
                </div>
                <div style={{ fontSize: '0.65rem', color: '#9ca3af', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user?.email || ''}
                </div>
              </div>
            </div>
            <button
              onClick={() => { logout(); nav('/login', { replace: true }) }}
              className="af-sidebar__text-link"
              style={{ color: '#ef4444' }}
            >
              <LogOut size={15} /> Sign Out
            </button>
          </div>
        </div>
      </aside>

      <div className="app-main">
        <div className="page-wrapper page-wrapper--arpan">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
