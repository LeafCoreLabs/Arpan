import { Users, MapPin, AlertTriangle, Package, TrendingUp, TrendingDown, Check } from 'lucide-react'
import { formatNumber } from '../../../utils/formatters.js'
import { EmptyState } from '../../../components/common/EmptyState.jsx'

const DEFAULT_ICONS = [Users, MapPin, AlertTriangle, Package]
const TONE = ['success', 'success', 'danger', 'success']

/**
 * @param {Array<{ id?: string, label: string, value: unknown, sublabel?: string, trendPositive?: boolean, tone?: 'success' | 'danger' | 'default' | 'warning' }>} metrics
 */
export function ArpanMetricsRow({ metrics = [] }) {
  if (!metrics.length) {
    return (
      <div className="af-metrics af-metrics--empty">
        <EmptyState title="No metrics yet" description="Connect the dashboard API to show volunteer and case metrics here." />
      </div>
    )
  }
  return (
    <div className="af-metrics">
      {metrics.map((m, i) => {
        const Icon = DEFAULT_ICONS[i % DEFAULT_ICONS.length]
        const tone = m.tone ?? TONE[i % TONE.length] ?? 'default'
        const valueStr = m.value == null || m.value === '' ? '—' : formatNumber(m.value)
        return (
          <article key={m.id ?? i} className="af-metric">
            <div className="af-metric__icon" data-tone={tone}>
              <Icon size={20} strokeWidth={2} aria-hidden />
            </div>
            <div className="af-metric__body">
              <p className="af-metric__label">{m.label}</p>
              <p className="af-metric__value">{valueStr}</p>
              {m.sublabel && (
                <p 
                  className={`af-metric__sublabel ${m.trendPositive === false && m.sublabel && m.tone !== 'danger' ? 'is-warn' : ''}`.trim()} 
                  data-trend={m.trendPositive ? 'up' : m.trendPositive === false ? 'down' : 'neutral'}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                >
                  {m.trendPositive === true && m.tone === 'success' ? <Check size={14} /> : m.trendPositive === true ? <TrendingUp size={14} /> : m.trendPositive === false ? <TrendingDown size={14} /> : null}
                  {m.sublabel}
                </p>
              )}
            </div>
          </article>
        )
      })}
    </div>
  )
}
