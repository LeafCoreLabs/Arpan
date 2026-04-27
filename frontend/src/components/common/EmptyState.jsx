import { Button } from '../ui/Button.jsx'

export function EmptyState({ title = 'Nothing here', description, actionLabel, onAction }) {
  return (
    <div className="empty-state">
      <h3 className="empty-state__title">{title}</h3>
      {description && <p className="empty-state__desc">{description}</p>}
      {actionLabel && onAction && (
        <p>
          <Button type="button" onClick={onAction}>
            {actionLabel}
          </Button>
        </p>
      )}
    </div>
  )
}
