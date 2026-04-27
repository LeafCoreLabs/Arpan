import { Link, useLocation } from 'react-router-dom'
import { Bell, UserCircle2, Moon, Sun, Search, LogOut } from 'lucide-react'
import { ROUTES } from '../../config/routes.js'
import { useTheme, useAuth } from '../../app/providers.jsx'
import { SearchBar } from '../common/SearchBar.jsx'
import { titleForPath } from '../../config/pageTitles.js'

export function Topbar() {
  const { pathname } = useLocation()
  const { theme, setTheme } = useTheme()
  const { user, logout } = useAuth()
  const pageTitle = titleForPath(pathname)

  return (
    <header className="af-topbar">
      <h1 className="af-topbar__title">{pageTitle}</h1>
      <div className="af-topbar__search-wrap">
        <Search className="af-topbar__search-icon" size={18} aria-hidden />
        <SearchBar
          className="af-topbar__search"
          placeholder="Search resources, volunteers…"
          onSearch={() => {}}
        />
      </div>
      <div className="af-topbar__right">
        <button
          type="button"
          className="af-topbar__icon-btn"
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          aria-label={theme === 'light' ? 'Use dark mode' : 'Use light mode'}
        >
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </button>
        <Link to={ROUTES.NOTIFICATIONS} className="af-topbar__icon-btn" aria-label="Notifications">
          <Bell size={20} />
        </Link>
        <div className="af-topbar__user" role="group" aria-label="Account">
          <div className="af-topbar__avatar" aria-hidden>
            {user?.avatar
              ? <img src={user.avatar} alt={user.name} className="af-topbar__avatar-img" />
              : <UserCircle2 size={28} />}
          </div>
          <div className="af-topbar__user-text">
            <span className="af-topbar__name">{user?.name ?? 'Guest'}</span>
            <span className="af-topbar__role">{user?.role ?? 'Signed out'}</span>
          </div>
        </div>
        <button
          type="button"
          className="btn btn--logout"
          onClick={() => {
            if (window.confirm('Are you sure you want to sign out?')) logout()
          }}
        >
          <LogOut size={15} /> Sign Out
        </button>
      </div>
    </header>
  )
}
