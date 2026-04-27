import { formatDate } from '../../../utils/formatters.js'

export function NotificationItem({ item, onRead }) {
  if (!item) return null
  return (
    <article
      className="notification-item"
      style={{
        border: '1px solid #e2e8f0',
        borderRadius: 8,
        padding: '0.75rem 1rem',
        background: item.read ? '#f8fafc' : '#fff',
      }}
    >
      <header style={{ display: 'flex', justifyContent: 'space-between', gap: '0.5rem' }}>
        <strong>{item.title}</strong>
        <time dateTime={item.createdAt} style={{ fontSize: 12, color: '#64748b' }}>
          {formatDate(item.createdAt)}
        </time>
      </header>
      <p style={{ margin: '0.5rem 0 0', color: '#475569' }}>{item.body}</p>
      {!item.read && (
        <p style={{ margin: '0.5rem 0 0' }}>
          <button type="button" className="topbar__link" onClick={() => onRead?.(item.id)}>
            Mark read
          </button>
        </p>
      )}
    </article>
  )
}
