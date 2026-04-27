import { CheckCircle2, AlertCircle, UserPlus, Activity } from 'lucide-react'
import { emptyAsDash } from '../utils/dashboardMappers.js'

const KIND_ICON = {
  success: CheckCircle2,
  alert: AlertCircle,
  user: UserPlus,
  default: Activity,
}

/**
 * @param {Array<{ id: string, kind?: string, text: string, time?: string }>} items
 */
export function LiveActivityFeed({ items = [] }) {
  return (
    <section className="af-card af-activity" aria-label="Live activity">
      <div className="af-card__head">
        <h2 className="af-card__title">Live Activity</h2>
      </div>
      {items.length === 0 ? (
        <p className="af-activity__empty">No recent activity. Events will show here when the API is connected.</p>
      ) : (
        <ul className="af-activity__list">
          {items.map((a) => {
            const k = a.kind && KIND_ICON[a.kind] ? a.kind : 'default'
            const Icon = KIND_ICON[k] ?? KIND_ICON.default
            return (
              <li key={a.id} className="af-activity__row">
                <div className={`af-activity__icon af-activity__icon--${k}`} aria-hidden>
                  <Icon size={16} />
                </div>
                <div className="af-activity__text">
                  <p className="af-activity__msg">{a.text}</p>
                  {a.time && <p className="af-activity__time">{emptyAsDash(a.time)}</p>}
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}
