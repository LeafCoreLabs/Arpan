import { useEffect, useRef } from 'react'
import { EmptyState } from '../../../components/common/EmptyState.jsx'

/**
 * Map container ref for a future map library. Renders no geodata until wired.
 */
export function MapView({ onReady }) {
  const ref = useRef(null)
  useEffect(() => {
    onReady?.(ref.current)
  }, [onReady])
  return (
    <div
      ref={ref}
      className="map-view"
      style={{
        minHeight: 360,
        borderRadius: 12,
        border: '1px solid #e2e8f0',
        background: '#f8fafc',
        display: 'grid',
        placeItems: 'center',
        padding: '1rem',
      }}
    >
      <EmptyState title="Map not loaded" description="Add a map SDK and feed locations from your API." />
    </div>
  )
}
