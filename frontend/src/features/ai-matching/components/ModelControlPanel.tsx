import { Sliders } from 'lucide-react';
import { useState } from 'react';

const sliderStyle: React.CSSProperties = {
  width: '100%', height: 6, borderRadius: 3,
  appearance: 'none', background: 'var(--af-border)', cursor: 'pointer',
  accentColor: 'var(--af-orange)',
};

export function ModelControlPanel() {
  const [weights, setWeights] = useState({ skill: 35, distance: 25, availability: 20, performance: 20 });
  const [autoAssign, setAutoAssign] = useState(true);
  const [minThreshold, setMinThreshold] = useState(70);

  const handleWeight = (key: keyof typeof weights, value: number) => setWeights(prev => ({ ...prev, [key]: value }));

  const weightItems = [
    { key: 'skill' as const, label: 'Skill Importance' },
    { key: 'distance' as const, label: 'Distance Importance' },
    { key: 'availability' as const, label: 'Availability Importance' },
    { key: 'performance' as const, label: 'Performance Importance' },
  ];

  return (
    <div className="af-card" style={{ padding: '1.25rem' }}>
      <h3 style={{ margin: '0 0 1rem', fontWeight: 600, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Sliders size={18} style={{ color: 'var(--af-orange)' }} /> Model Control Panel
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {weightItems.map(item => (
          <div key={item.key}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
              <label style={{ fontSize: '0.75rem', color: 'var(--af-muted)' }}>{item.label}</label>
              <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>{weights[item.key]}%</span>
            </div>
            <input type="range" min="0" max="100" value={weights[item.key]}
              onChange={e => handleWeight(item.key, parseInt(e.target.value))}
              style={sliderStyle} />
          </div>
        ))}

        <div style={{ borderTop: '1px solid var(--af-border)', paddingTop: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <label style={{ fontSize: '0.75rem', color: 'var(--af-muted)' }}>Auto-Assignment</label>
            <button onClick={() => setAutoAssign(!autoAssign)} style={{
              position: 'relative', width: 40, height: 22, borderRadius: 11,
              background: autoAssign ? '#16a34a' : 'var(--af-border)',
              border: 'none', cursor: 'pointer', transition: 'background 0.2s',
            }}>
              <span style={{
                position: 'absolute', top: 3, left: autoAssign ? 21 : 3,
                width: 16, height: 16, borderRadius: '50%', background: '#fff', transition: 'left 0.2s',
              }} />
            </button>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
              <label style={{ fontSize: '0.75rem', color: 'var(--af-muted)' }}>Min. Match Score Threshold</label>
              <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>{minThreshold}%</span>
            </div>
            <input type="range" min="0" max="100" value={minThreshold}
              onChange={e => setMinThreshold(parseInt(e.target.value))}
              style={sliderStyle} />
          </div>
        </div>
      </div>
    </div>
  );
}
