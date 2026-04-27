export function MarkerCluster({ count = 0 }) {
  if (!count) return null
  return (
    <div
      className="marker-cluster"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 28,
        height: 28,
        padding: '0 0.4rem',
        borderRadius: 999,
        background: '#0ea5e9',
        color: '#fff',
        fontSize: 12,
        fontWeight: 700,
      }}
    >
      {count}
    </div>
  )
}
