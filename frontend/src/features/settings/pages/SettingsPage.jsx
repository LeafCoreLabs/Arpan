import { useState } from 'react'
import { Settings, Bell, Shield, Globe, Palette, Save, CheckCircle, Moon, Sun } from 'lucide-react'
import { useAuth, useTheme } from '../../../app/providers.jsx'

export default function SettingsPage() {
  const { user } = useAuth()
  const { theme, setTheme } = useTheme()
  const [saved, setSaved] = useState(false)

  const [prefs, setPrefs] = useState({
    emailNotifications: true,
    pushNotifications: true,
    criticalAlerts: true,
    weeklyDigest: false,
    autoAssign: true,
    language: 'en',
  })

  const toggle = (key) => setPrefs(p => ({ ...p, [key]: !p[key] }))

  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000) }

  const ToggleSwitch = ({ checked, onChange }) => (
    <button onClick={onChange} style={{
      position: 'relative', width: 40, height: 22, borderRadius: 11,
      background: checked ? '#16a34a' : 'var(--af-border)',
      border: 'none', cursor: 'pointer', transition: 'background 0.2s', flexShrink: 0,
    }}>
      <span style={{
        position: 'absolute', top: 3, left: checked ? 21 : 3,
        width: 16, height: 16, borderRadius: '50%', background: '#fff', transition: 'left 0.2s',
      }} />
    </button>
  )

  const SettingRow = ({ label, desc, children }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.85rem 0', borderBottom: '1px solid var(--af-border)' }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 500, fontSize: '0.85rem' }}>{label}</div>
        {desc && <div style={{ fontSize: '0.75rem', color: 'var(--af-muted)', marginTop: '0.1rem' }}>{desc}</div>}
      </div>
      {children}
    </div>
  )

  return (
    <div className="af-dashboard" style={{ maxWidth: '740px' }}>
      <div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '0 0 0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Settings size={22} style={{ color: 'var(--af-orange)' }} /> Settings
        </h1>
        <p style={{ color: 'var(--af-muted)', fontSize: '0.9rem', margin: 0 }}>Manage your account preferences and system configuration.</p>
      </div>

      {/* Profile */}
      <div className="af-card" style={{ padding: '1.25rem' }}>
        <h3 style={{ margin: '0 0 0.75rem', fontWeight: 600, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Shield size={16} /> Account
        </h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.5rem 0' }}>
          <div style={{
            width: 48, height: 48, borderRadius: '12px',
            background: 'linear-gradient(135deg, #f97316, #ea580c)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.1rem', fontWeight: 700, color: '#fff', flexShrink: 0,
          }}>{(user?.name || 'A').charAt(0).toUpperCase()}</div>
          <div>
            <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{user?.name || 'Admin'}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--af-muted)' }}>{user?.email || 'admin@arpan.org'}</div>
            <div style={{ fontSize: '0.65rem', color: 'var(--af-orange)', fontWeight: 600, marginTop: '0.1rem', textTransform: 'uppercase' }}>{user?.role || 'Coordinator'}</div>
          </div>
        </div>
      </div>

      {/* Appearance */}
      <div className="af-card" style={{ padding: '1.25rem' }}>
        <h3 style={{ margin: '0 0 0.5rem', fontWeight: 600, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Palette size={16} /> Appearance
        </h3>
        <SettingRow label="Theme" desc="Switch between light and dark mode">
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button onClick={() => setTheme('light')} className={`btn ${theme === 'light' ? 'btn--primary' : 'btn--ghost'}`} style={{ fontSize: '0.8rem' }}>
              <Sun size={14} /> Light
            </button>
            <button onClick={() => setTheme('dark')} className={`btn ${theme === 'dark' ? 'btn--primary' : 'btn--ghost'}`} style={{ fontSize: '0.8rem' }}>
              <Moon size={14} /> Dark
            </button>
          </div>
        </SettingRow>
        <SettingRow label="Language" desc="Interface language">
          <select className="searchbar" value={prefs.language} onChange={e => setPrefs(p => ({ ...p, language: e.target.value }))} style={{ width: 'auto' }}>
            <option value="en">English</option>
            <option value="hi">Hindi</option>
            <option value="es">Spanish</option>
          </select>
        </SettingRow>
      </div>

      {/* Notifications */}
      <div className="af-card" style={{ padding: '1.25rem' }}>
        <h3 style={{ margin: '0 0 0.5rem', fontWeight: 600, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Bell size={16} /> Notifications
        </h3>
        <SettingRow label="Email Notifications" desc="Receive email for important updates">
          <ToggleSwitch checked={prefs.emailNotifications} onChange={() => toggle('emailNotifications')} />
        </SettingRow>
        <SettingRow label="Push Notifications" desc="Browser push notifications">
          <ToggleSwitch checked={prefs.pushNotifications} onChange={() => toggle('pushNotifications')} />
        </SettingRow>
        <SettingRow label="Critical Alerts Only" desc="Only notify for critical severity needs">
          <ToggleSwitch checked={prefs.criticalAlerts} onChange={() => toggle('criticalAlerts')} />
        </SettingRow>
        <SettingRow label="Weekly Digest" desc="Summary email every Monday morning">
          <ToggleSwitch checked={prefs.weeklyDigest} onChange={() => toggle('weeklyDigest')} />
        </SettingRow>
      </div>

      {/* Matching */}
      <div className="af-card" style={{ padding: '1.25rem' }}>
        <h3 style={{ margin: '0 0 0.5rem', fontWeight: 600, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Globe size={16} /> System
        </h3>
        <SettingRow label="Auto-Assign Matches" desc="Automatically assign high-confidence AI matches">
          <ToggleSwitch checked={prefs.autoAssign} onChange={() => toggle('autoAssign')} />
        </SettingRow>
      </div>

      {/* Save */}
      <button onClick={handleSave} className={`btn ${saved ? '' : 'btn--primary'}`} style={{
        width: '100%', justifyContent: 'center',
        background: saved ? '#16a34a' : undefined, color: saved ? '#fff' : undefined,
      }}>
        {saved ? <><CheckCircle size={16} /> Saved!</> : <><Save size={16} /> Save Settings</>}
      </button>
    </div>
  )
}
