import { Button } from '../ui/Button.jsx'

export function ErrorState({ title = 'Something went wrong', message, onRetry }) {
  return (
    <div className="error-state" role="alert">
      <h3 className="error-state__title">{title}</h3>
      {message && <p className="error-state__msg">{message}</p>}
      {onRetry && (
        <Button type="button" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  )
}
