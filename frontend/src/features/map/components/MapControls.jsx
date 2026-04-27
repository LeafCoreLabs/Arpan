import { Button } from '../../../components/ui/Button.jsx'

export function MapControls({ onZoomIn, onZoomOut, onLocate }) {
  return (
    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
      <Button type="button" variant="secondary" onClick={onZoomIn}>
        Zoom in
      </Button>
      <Button type="button" variant="secondary" onClick={onZoomOut}>
        Zoom out
      </Button>
      <Button type="button" variant="primary" onClick={onLocate}>
        My location
      </Button>
    </div>
  )
}
