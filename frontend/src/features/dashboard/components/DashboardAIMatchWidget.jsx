import { useNavigate } from 'react-router-dom'
import { Sparkles, User } from 'lucide-react'
import { ROUTES } from '../../../config/routes.js'
import { Badge } from '../../../components/ui/Badge.jsx'

/**
 * @param {null | { name?: string, match?: number, skills?: string[] }} match
 */
export function DashboardAIMatchWidget({ match }) {
  const nav = useNavigate()
  return (
    <section className="af-card af-ai-card" aria-label="AI match">
      <div className="af-card__head" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1rem' }}>
        <div className="af-ai-card__head-row">
          <Sparkles size={18} className="af-ai-card__spark" aria-hidden />
          <h2 className="af-card__title" style={{ margin: 0 }}>AI Match</h2>
        </div>
        <Badge tone="warning" style={{ backgroundColor: '#ffedd5', color: '#ea580c', border: 'none' }}>Auto-suggest</Badge>
      </div>
      {!match ? (
        <div className="af-ai-card__empty">
          <p className="af-ai-card__empty-text">No pending AI suggestions. Open the matching view when the API is connected.</p>
          <button type="button" className="af-btn af-btn--primary" onClick={() => nav(ROUTES.AI_MATCHING)}>
            Open AI matching
          </button>
        </div>
      ) : (
        <div className="af-ai-card__content">
          <div className="af-ai-card__profile">
            <div className="af-ai-card__avatar" aria-hidden style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {match.avatar ? (
                <img src={match.avatar} alt={match.name} style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover', display: 'block' }} />
              ) : (
                <User size={32} />
              )}
            </div>
            <div className="af-ai-card__meta">
              <p className="af-ai-card__name">{match.name ?? '—'}</p>
              {match.subtitle && (
                <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: '0.15rem 0 0' }}>
                  {match.subtitle}
                </p>
              )}
            </div>
            <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
              {match.match != null && (
                <p className="af-ai-card__match-pct" style={{ margin: 0 }}>
                  {(() => {
                    const v = Number(match.match)
                    if (Number.isNaN(v)) return null
                    const pct = v <= 1 ? Math.round(v * 1000) / 10 : v
                    return <>{pct}% Match</>
                  })()}
                </p>
              )}
            </div>
          </div>
          {match?.skills?.length > 0 && (
            <div className="af-ai-card__tags">
              {match.skills.map((s) => (
                <span key={s} className="af-tag">
                  {s}
                </span>
              ))}
            </div>
          )}
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
            <button type="button" className="af-btn af-btn--primary af-btn--block" onClick={() => nav(ROUTES.AI_MATCHING)}>
              Assign Task
            </button>
            <button type="button" className="af-btn" style={{ backgroundColor: '#f3f4f6', color: '#6b7280', padding: '0.55rem 0.75rem' }}>
              ✕
            </button>
          </div>
        </div>
      )}
    </section>
  )
}
