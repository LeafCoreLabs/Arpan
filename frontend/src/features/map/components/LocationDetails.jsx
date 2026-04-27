import { Card } from '../../../components/ui/Card.jsx'
import { formatDate } from '../../../utils/formatters.js'

export function LocationDetails({ point }) {
  if (!point) {
    return <p style={{ color: '#64748b' }}>Select a marker to see details.</p>
  }
  return (
    <Card title={point.name ?? 'Location'}>
      <dl style={{ margin: 0, display: 'grid', gap: '0.35rem' }}>
        <div>
          <dt className="sr-only">Address</dt>
          <dd style={{ margin: 0 }}>{point.address}</dd>
        </div>
        {point.updatedAt && (
          <div>
            <dt style={{ fontSize: 12, color: '#64748b' }}>Updated</dt>
            <dd style={{ margin: 0 }}>{formatDate(point.updatedAt)}</dd>
          </div>
        )}
      </dl>
    </Card>
  )
}
