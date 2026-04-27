export function Button({
  type = 'button',
  variant = 'primary',
  className = '',
  disabled,
  children,
  ...rest
}) {
  const v = {
    primary: 'btn--primary',
    secondary: 'btn--secondary',
    ghost: 'btn--ghost',
  }[variant] ?? 'btn--primary'
  return (
    <button type={type} className={`btn ${v} ${className}`.trim()} disabled={disabled} {...rest}>
      {children}
    </button>
  )
}
