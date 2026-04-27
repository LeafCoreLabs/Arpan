import { NotificationItem } from './NotificationItem.jsx'
import { EmptyState } from '../../../components/common/EmptyState.jsx'

export function NotificationList({ items = [], onRead }) {
  if (!items.length) {
    return <EmptyState title="No notifications" />
  }
  return (
    <div style={{ display: 'grid', gap: '0.75rem' }}>
      {items.map((n) => (
        <NotificationItem key={n.id} item={n} onRead={onRead} />
      ))}
    </div>
  )
}
