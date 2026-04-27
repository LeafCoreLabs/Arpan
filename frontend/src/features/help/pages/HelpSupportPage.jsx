import { useState } from 'react'
import { LifeBuoy, Book, MessageCircle, Mail, Phone, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react'

const FAQ = [
  { q: 'How do I report a community need?', a: 'Navigate to the Community Needs page and click the "New Need" button, or ask a community user to submit a report through their portal. The need will appear on your dashboard for assignment.' },
  { q: 'How does AI matching work?', a: 'The AI matching engine analyzes volunteer skills, proximity, availability, and past performance to suggest optimal need-volunteer pairings. You can review, accept, or reject matches, and fine-tune model weights in the AI Matching control panel.' },
  { q: 'How do I assign volunteers to needs?', a: 'Go to the Volunteers page, find an available volunteer, and click "Assign Task". Alternatively, use the AI Matching page for automated suggestions, or assign directly from the Community Needs page.' },
  { q: 'What is Emergency Mode?', a: 'Emergency Mode activates rapid deployment protocols. When enabled, it prioritizes critical needs, sends mass notifications to all available volunteers, and enables real-time GPS tracking on the map. Toggle it from the sidebar.' },
  { q: 'How do I export reports?', a: 'Visit the Reports page and click the "Export PDF" button. Reports include incident trends, volunteer utilization, resolution rates, and regional breakdowns.' },
  { q: 'Can volunteers see coordinator data?', a: 'No. Role-based access control ensures volunteers only see their assigned tasks, personal profile, and community feed. They cannot access coordinator analytics, volunteer management, or AI matching tools.' },
  { q: 'How do I change my password?', a: 'Go to Settings > Account. Password changes are handled through the authentication provider. Contact the system administrator for password resets.' },
]

const GUIDES = [
  { title: 'Getting Started Guide', desc: 'Learn the basics of the Arpan coordinator portal', icon: Book },
  { title: 'Volunteer Management', desc: 'Best practices for coordinating volunteer teams', icon: Book },
  { title: 'AI Matching Walkthrough', desc: 'How to use the AI engine for optimal assignments', icon: Book },
  { title: 'Map & Data Collection', desc: 'Using the interactive map and field reports', icon: Book },
]

export default function HelpSupportPage() {
  const [expandedFaq, setExpandedFaq] = useState(null)

  return (
    <div className="af-dashboard">
      <div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '0 0 0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <LifeBuoy size={22} style={{ color: 'var(--af-orange)' }} /> Help & Support
        </h1>
        <p style={{ color: 'var(--af-muted)', fontSize: '0.9rem', margin: 0 }}>Find answers, documentation, and get in touch with our team.</p>
      </div>

      {/* Contact Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '0.75rem' }}>
        {[
          { icon: MessageCircle, label: 'Live Chat', desc: 'Chat with support team', color: '#3b82f6', action: 'Start Chat' },
          { icon: Mail, label: 'Email Support', desc: 'support@arpan.org', color: '#8b5cf6', action: 'Send Email' },
          { icon: Phone, label: 'Phone Support', desc: '+91 1800-XXX-XXXX', color: '#10b981', action: 'Call Now' },
        ].map(c => (
          <div key={c.label} className="af-card" style={{ padding: '1.25rem', textAlign: 'center' }}>
            <div style={{
              width: 44, height: 44, borderRadius: '12px', margin: '0 auto 0.75rem',
              background: `${c.color}12`, display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <c.icon size={22} style={{ color: c.color }} />
            </div>
            <h4 style={{ margin: '0 0 0.2rem', fontWeight: 600, fontSize: '0.9rem' }}>{c.label}</h4>
            <p style={{ margin: '0 0 0.75rem', fontSize: '0.75rem', color: 'var(--af-muted)' }}>{c.desc}</p>
            <button className="btn btn--primary" style={{ width: '100%', justifyContent: 'center', fontSize: '0.8rem' }}>{c.action}</button>
          </div>
        ))}
      </div>

      {/* FAQ */}
      <div>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0 0 0.75rem' }}>Frequently Asked Questions</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {FAQ.map((item, i) => {
            const isOpen = expandedFaq === i
            return (
              <div key={i} className="af-card" style={{ padding: 0, overflow: 'hidden' }}>
                <button onClick={() => setExpandedFaq(isOpen ? null : i)} style={{
                  width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '0.9rem 1.25rem', background: 'none', border: 'none', cursor: 'pointer',
                  textAlign: 'left', fontWeight: 500, fontSize: '0.85rem', color: 'inherit',
                }}>
                  {item.q}
                  {isOpen ? <ChevronUp size={16} style={{ color: 'var(--af-muted)', flexShrink: 0 }} /> : <ChevronDown size={16} style={{ color: 'var(--af-muted)', flexShrink: 0 }} />}
                </button>
                {isOpen && (
                  <div style={{ padding: '0 1.25rem 1rem', fontSize: '0.8rem', color: 'var(--af-muted)', lineHeight: 1.6 }}>
                    {item.a}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Documentation */}
      <div>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0 0 0.75rem' }}>Documentation</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
          {GUIDES.map((guide, i) => (
            <div key={i} className="af-card" style={{ padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
              <div style={{
                width: 36, height: 36, borderRadius: '10px',
                background: 'var(--af-orange)12', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                border: '1px solid var(--af-border)',
              }}>
                <guide.icon size={16} style={{ color: 'var(--af-orange)' }} />
              </div>
              <div style={{ flex: 1 }}>
                <h4 style={{ margin: 0, fontWeight: 600, fontSize: '0.85rem' }}>{guide.title}</h4>
                <p style={{ margin: 0, fontSize: '0.7rem', color: 'var(--af-muted)' }}>{guide.desc}</p>
              </div>
              <ExternalLink size={14} style={{ color: 'var(--af-muted)', flexShrink: 0 }} />
            </div>
          ))}
        </div>
      </div>

      {/* Version */}
      <div style={{ textAlign: 'center', fontSize: '0.7rem', color: 'var(--af-muted)', padding: '0.5rem 0' }}>
        Arpan Humanitarian Platform v2.0.0 &middot; Built with care for communities in need.
      </div>
    </div>
  )
}
