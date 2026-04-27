import { Outlet } from 'react-router-dom'
import { motion } from 'framer-motion'
import { EarthGlobe } from '../../features/auth/components/EarthGlobe.jsx'

export function AuthLayout() {
  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      width: '100vw',
      background: '#010b16',
      fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
      overflow: 'hidden',
    }}>
      {/* Left — 3D Globe */}
      <div style={{
        flex: 1,
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        alignItems: 'center',
        overflow: 'hidden',
        background: 'radial-gradient(ellipse at 50% 40%, #04111f 0%, #000508 100%)',
      }}>
        {/* Globe Canvas — fills entire panel */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 1 }}>
          <EarthGlobe />
        </div>

        {/* Bottom gradient for text readability */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 2,
          background: 'linear-gradient(to top, rgba(1,11,22,0.92) 0%, rgba(1,11,22,0.3) 30%, transparent 55%)',
          pointerEvents: 'none',
        }} />

        {/* Right-edge fade into form panel */}
        <div style={{
          position: 'absolute', top: 0, right: 0, bottom: 0, width: '100px', zIndex: 2,
          background: 'linear-gradient(to left, rgba(1,11,22,0.95) 0%, transparent 100%)',
          pointerEvents: 'none',
        }} />

        {/* Branding at bottom */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          style={{
            position: 'relative', zIndex: 10, maxWidth: '520px',
            color: '#fff', textAlign: 'center', padding: '0 2rem 2.5rem',
          }}
        >
          {/* Logo Mark */}
          <div style={{ marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '56px', height: '56px', borderRadius: '16px',
              background: 'linear-gradient(145deg, #0ea5e9, #0284c7 50%, #0369a1)',
              boxShadow: '0 0 30px rgba(14,165,233,0.35), 0 0 80px rgba(14,165,233,0.1)',
              display: 'flex', justifyContent: 'center', alignItems: 'center',
            }}>
              {/* Globe SVG icon */}
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                <path d="M2 12h20" />
                <path d="M4.93 4.93a15.3 15.3 0 0 0 14.14 0" opacity="0.5" />
                <path d="M4.93 19.07a15.3 15.3 0 0 1 14.14 0" opacity="0.5" />
              </svg>
            </div>

            {/* Brand Name */}
            <div style={{ textAlign: 'center' }}>
              <h1 style={{ margin: 0, fontSize: '2.2rem', fontWeight: 800, letterSpacing: '-0.03em', color: '#f0f4f8', lineHeight: 1.1 }}>
                Arpan
              </h1>
              <p style={{ margin: '0.15rem 0 0', fontSize: '1rem', fontWeight: 400, color: 'rgba(125,211,252,0.7)', letterSpacing: '0.08em' }}>
                अर्पण
              </p>
            </div>
          </div>

          {/* Tagline */}
          <h2 style={{ fontSize: '1.15rem', fontWeight: 300, lineHeight: 1.6, color: '#94a3b8', textAlign: 'center', marginBottom: '0.5rem' }}>
            Empowering communities through{' '}
            <span style={{ color: '#38bdf8', fontWeight: 500 }}>intelligent</span>{' '}
            disaster response
          </h2>

          {/* Hint */}
          <p style={{ fontSize: '0.7rem', color: '#334155', letterSpacing: '0.1em', textTransform: 'uppercase', textAlign: 'center', marginBottom: 0 }}>
            Drag to rotate · Scroll to zoom
          </p>
        </motion.div>
      </div>

      {/* Right — Form */}
      <div style={{
        flex: '0 0 480px',
        background: 'rgba(1,11,22,0.9)',
        backdropFilter: 'blur(40px)',
        borderLeft: '1px solid rgba(0,229,255,0.06)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '2.5rem 3.5rem',
        boxShadow: '-30px 0 80px rgba(0,0,0,0.6)',
        overflowY: 'auto',
        maxHeight: '100vh',
      }}>
        <Outlet />
      </div>
    </div>
  )
}
