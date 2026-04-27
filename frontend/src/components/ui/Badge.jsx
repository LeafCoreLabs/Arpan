export function Badge({ tone = 'neutral', className = '', children }) {
  const t = {
    neutral: 'badge--neutral',
    success: 'badge--success',
    warning: 'badge--warning',
    danger: 'badge--danger',
  }[tone] ?? 'badge--neutral'
  return <span className={`badge ${t} ${className}`.trim()}>{children}</span>
}
