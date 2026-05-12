import { NavLink } from 'react-router-dom'
import {
  PieChart,
  FileEdit,
  Users,
  UserPlus,
  Map,
  Sparkles,
  Bell,
  FileText,
  Settings,
  LifeBuoy,
  Moon,
  Sun,
} from 'lucide-react'
import { ROUTES } from '../../config/routes.js'
import { useAppStore } from '../../app/store.js'
import { useTheme } from '../../app/providers.jsx'
import { useTranslation } from 'react-i18next'

const mainLinks = [
  { to: ROUTES.DASHBOARD, label: 'Dashboard', icon: PieChart, end: true },
  { to: ROUTES.DATA_COLLECTION, label: 'Data Collection', icon: FileEdit },
  { to: ROUTES.NEEDS, label: 'Community Needs', icon: Users },
  { to: ROUTES.VOLUNTEERS, label: 'Volunteer Mgmt', icon: UserPlus },
  { to: ROUTES.AI_MATCHING, label: 'AI Matching', icon: Sparkles },
  { to: ROUTES.MAP, label: 'Map View', icon: Map },
  { to: ROUTES.NOTIFICATIONS, label: 'Notifications', icon: Bell, badge: 3 },
  { to: ROUTES.REPORTS, label: 'Reports', icon: FileText },
]

export function Sidebar() {
  const emergencyMode = useAppStore((s) => s.emergencyMode)
  const setEmergencyMode = useAppStore((s) => s.setEmergencyMode)
  const { theme, setTheme } = useTheme()
  const isDark = theme === 'dark'
  const { i18n } = useTranslation()
  const isHindi = i18n.language === 'hi'

  return (
    <aside className="af-sidebar" aria-label="Main navigation">
      <div className="af-sidebar__brand">
        <div className="af-sidebar__logo" aria-hidden>
          <span className="af-sidebar__logo-icon" />
        </div>
        <span className="af-sidebar__title" style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
          <span style={{ fontSize: '1.25rem', fontWeight: 800 }}>Arpan</span>
          <span style={{ fontSize: '0.75rem', fontWeight: 400, opacity: 0.7 }}>अर्पण</span>
        </span>
      </div>
      <nav className="af-sidebar__nav">
        {mainLinks.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            end={l.end}
            className={({ isActive }) => `af-sidebar__link ${isActive ? 'is-active' : ''}`.trim()}
          >
            <l.icon size={20} className="af-sidebar__link-icon" aria-hidden />
            <span className="af-sidebar__link-text">{l.label}</span>
            {l.badge != null && l.badge > 0 ? <span className="af-sidebar__badge">{l.badge}</span> : null}
          </NavLink>
        ))}
      </nav>
      <div className="af-sidebar__footer">
        <div className="af-emergency" data-on={emergencyMode ? 'true' : 'false'}>
          <p className="af-emergency__label">Emergency Mode</p>
          <p className="af-emergency__hint">Activate rapid deployment protocols for disaster response.</p>
          <button type="button" className="af-emergency__btn" onClick={() => setEmergencyMode((v) => !v)}>
            {emergencyMode ? 'Deactivate' : 'Activate Now'}
          </button>
        </div>
        <div className="af-sidebar__utils">
          <button
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
            className="af-sidebar__text-link"
            style={{ border: 'none', background: 'none', cursor: 'pointer', width: '100%', textAlign: 'left' }}
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
            {isDark ? 'Light Mode' : 'Dark Mode'}
          </button>
          <button
            onClick={() => i18n.changeLanguage(isHindi ? 'en' : 'hi')}
            className="af-sidebar__text-link"
            style={{ border: 'none', background: 'none', cursor: 'pointer', width: '100%', textAlign: 'left' }}
          >
            <span style={{ fontSize: '1rem', width: 18, display: 'inline-block', textAlign: 'center' }}>{isHindi ? 'EN' : 'हि'}</span>
            {isHindi ? 'English' : 'हिन्दी'}
          </button>
          <NavLink to={ROUTES.SETTINGS} className={({ isActive }) => `af-sidebar__text-link ${isActive ? 'is-active' : ''}`}>
            <Settings size={18} /> Settings
          </NavLink>
          <NavLink to={ROUTES.HELP} className={({ isActive }) => `af-sidebar__text-link ${isActive ? 'is-active' : ''}`}>
            <LifeBuoy size={18} /> Help &amp; support
          </NavLink>
        </div>
      </div>
    </aside>
  )
}
