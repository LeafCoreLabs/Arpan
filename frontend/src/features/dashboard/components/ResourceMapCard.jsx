import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet'
import { apiClient } from '../../../services/apiClient.js'
import 'leaflet/dist/leaflet.css'

function FitBounds({ bounds }) {
  const map = useMap()
  useEffect(() => {
    if (bounds && bounds.length > 0) {
      map.fitBounds(bounds, { padding: [30, 30], maxZoom: 13 })
    }
  }, [bounds, map])
  return null
}

const sevColors = { critical: '#ef4444', high: '#f59e0b', medium: '#3b82f6', low: '#6b7280', resolved: '#10b981' }
const volColors = { available: '#10b981', busy: '#f59e0b', offline: '#6b7280' }

export function ResourceMapCard() {
  const [mapData, setMapData] = useState(null)

  useEffect(() => {
    async function load() {
      try {
        const { data } = await apiClient.get('/api/map/data')
        setMapData(data)
      } catch (err) {
        console.error('Failed to load map data', err)
      }
    }
    load()
    const interval = setInterval(load, 30000) // Refresh every 30s
    return () => clearInterval(interval)
  }, [])

  const needs = mapData?.communityNeeds || []
  const vols = mapData?.volunteers || []
  const allPoints = [...needs.map(n => [n.lat, n.lng]), ...vols.map(v => [v.lat, v.lng])].filter(p => p[0] && p[1])

  return (
    <section className="af-card af-map-card" aria-label="Resource distribution" style={{ overflow: 'hidden' }}>
      <div className="af-card__head" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h2 className="af-card__title">Resource Distribution Map</h2>
          <p className="af-card__subtitle">Live overview — {needs.length} needs, {vols.length} volunteers</p>
        </div>
        <div className="af-map-legend" role="list" style={{ padding: 0, paddingBottom: '0.5rem' }}>
          <span className="af-map-legend__item" role="listitem"><i className="af-dot af-dot--urgent" /> Needs</span>
          <span className="af-map-legend__item" role="listitem"><i className="af-dot af-dot--vol" /> Volunteers</span>
          <span className="af-map-legend__item" role="listitem"><i className="af-dot af-dot--done" /> Resolved</span>
        </div>
      </div>
      <div style={{ height: '300px', borderRadius: '12px', overflow: 'hidden', background: '#0f1117' }}>
        <MapContainer
          center={[28.6139, 77.2090]}
          zoom={5}
          style={{ height: '100%', width: '100%' }}
          zoomControl={false}
          attributionControl={false}
        >
          <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
          {allPoints.length > 0 && <FitBounds bounds={allPoints} />}

          {/* Needs */}
          {needs.map(n => (
            <CircleMarker
              key={n.id}
              center={[n.lat, n.lng]}
              radius={n.severity === 'critical' ? 10 : n.severity === 'high' ? 8 : 6}
              fillColor={sevColors[n.severity] || '#3b82f6'}
              fillOpacity={0.8}
              stroke={true}
              color={sevColors[n.severity] || '#3b82f6'}
              weight={2}
              opacity={0.5}
            >
              <Popup>
                <div style={{ color: '#1f2937', fontSize: '0.85rem' }}>
                  <strong>{n.title}</strong><br />
                  📍 {n.location}<br />
                  ⚡ {n.severity} • {n.status}<br />
                  👥 {n.peopleAffected} affected
                </div>
              </Popup>
            </CircleMarker>
          ))}

          {/* Volunteers */}
          {vols.map(v => (
            <CircleMarker
              key={v.id}
              center={[v.lat, v.lng]}
              radius={6}
              fillColor={volColors[v.status] || '#6b7280'}
              fillOpacity={0.9}
              stroke={true}
              color="#fff"
              weight={2}
              opacity={0.6}
            >
              <Popup>
                <div style={{ color: '#1f2937', fontSize: '0.85rem' }}>
                  <strong>{v.name}</strong><br />
                  🟢 {v.status}<br />
                  📍 {v.region}<br />
                  ⭐ {v.rating?.toFixed(1)} • {v.completedTasks} tasks
                </div>
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>
    </section>
  )
}
