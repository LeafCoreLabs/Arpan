import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Layers } from 'lucide-react';

export function MapLegend() {
  const [expanded, setExpanded] = useState(false);

  return (
    <div style={{
      position: 'absolute', bottom: '120px', right: '16px', zIndex: 900,
    }}>
      {/* Toggle button */}
      <button
        onClick={() => setExpanded(v => !v)}
        style={{
          display: 'flex', alignItems: 'center', gap: '5px',
          padding: '6px 10px', borderRadius: expanded ? '8px 8px 0 0' : '8px',
          background: 'rgba(4, 10, 26, 0.97)',
          border: '1px solid rgba(59,130,246,0.2)',
          borderBottom: expanded ? '1px solid rgba(59,130,246,0.1)' : undefined,
          color: '#94a3b8', cursor: 'pointer', fontSize: '10px', fontWeight: 600,
          boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
          backdropFilter: 'blur(16px)',
        }}
      >
        <Layers size={11} />
        <span>Legend</span>
        {expanded ? <ChevronUp size={10} /> : <ChevronDown size={10} />}
      </button>

      {/* Legend Content */}
      {expanded && (
        <div style={{
          background: 'rgba(4, 10, 26, 0.97)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(59,130,246,0.2)',
          borderTop: 'none',
          borderRadius: '0 0 8px 8px',
          padding: '10px 12px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
          width: '190px',
        }}>
          {/* Needs */}
          <div style={{ marginBottom: '10px' }}>
            <div style={{ fontSize: '9px', color: '#334155', fontWeight: 700, letterSpacing: '0.8px', marginBottom: '5px', textTransform: 'uppercase' }}>Community Needs</div>
            {[
              { color: '#ef4444', label: 'Critical' },
              { color: '#f97316', label: 'High' },
              { color: '#3b82f6', label: 'Medium' },
              { color: '#22c55e', label: 'Resolved' },
            ].map(item => (
              <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '4px' }}>
                <div style={{
                  width: '14px', height: '14px', borderRadius: '50%',
                  background: item.color, border: '1.5px solid rgba(255,255,255,0.5)',
                  flexShrink: 0,
                }} />
                <span style={{ fontSize: '10px', color: '#94a3b8' }}>{item.label}</span>
              </div>
            ))}
          </div>

          {/* Divider */}
          <div style={{ height: '1px', background: 'rgba(148,163,184,0.08)', margin: '8px 0' }} />

          {/* Volunteers */}
          <div style={{ marginBottom: '10px' }}>
            <div style={{ fontSize: '9px', color: '#334155', fontWeight: 700, letterSpacing: '0.8px', marginBottom: '5px', textTransform: 'uppercase' }}>Volunteers</div>
            {[
              { color: '#22c55e', label: 'Available' },
              { color: '#f59e0b', label: 'Busy' },
              { color: '#64748b', label: 'Offline' },
            ].map(item => (
              <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '4px' }}>
                <div style={{
                  width: '14px', height: '14px', borderRadius: '50%',
                  background: item.color, border: '1.5px solid rgba(255,255,255,0.5)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '7px', color: 'white', fontWeight: 700, flexShrink: 0,
                }}>V</div>
                <span style={{ fontSize: '10px', color: '#94a3b8' }}>{item.label}</span>
              </div>
            ))}
          </div>

          {/* Divider */}
          <div style={{ height: '1px', background: 'rgba(148,163,184,0.08)', margin: '8px 0' }} />

          {/* Task Lines */}
          <div>
            <div style={{ fontSize: '9px', color: '#334155', fontWeight: 700, letterSpacing: '0.8px', marginBottom: '5px', textTransform: 'uppercase' }}>Task Lines</div>
            {[
              { color: '#22c55e', label: 'Completed', dash: false },
              { color: '#f59e0b', label: 'In Progress', dash: true },
              { color: '#ef4444', label: 'Delayed', dash: true },
            ].map(item => (
              <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '4px' }}>
                <div style={{ width: '20px', height: '2px', background: item.dash
                  ? `repeating-linear-gradient(90deg, ${item.color} 0, ${item.color} 4px, transparent 4px, transparent 7px)`
                  : item.color,
                  flexShrink: 0,
                }} />
                <span style={{ fontSize: '10px', color: '#94a3b8' }}>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
