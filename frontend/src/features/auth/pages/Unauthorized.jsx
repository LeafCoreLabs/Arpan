import { Link } from 'react-router-dom'
import { ROUTES } from '../../../config/routes.js'

export default function Unauthorized() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        padding: '1.5rem',
        textAlign: 'center',
        color: '#e2e8f0',
      }}
    >
      <div>
        <h1 style={{ margin: '0 0 0.5rem' }}>Unauthorized</h1>
        <p style={{ margin: '0 0 1rem', opacity: 0.9 }}>You do not have access to this page.</p>
        <Link to={ROUTES.LOGIN} className="topbar__link" style={{ color: '#7dd3fc' }}>
          Back to sign in
        </Link>
      </div>
    </div>
  )
}
