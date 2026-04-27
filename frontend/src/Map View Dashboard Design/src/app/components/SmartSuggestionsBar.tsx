import React, { useState } from 'react';
import { Zap, ChevronUp, ChevronDown, X } from 'lucide-react';
import type { AISuggestion } from '../data/mockData';

interface SmartSuggestionsBarProps {
  suggestions: AISuggestion[];
  onAction: (suggestion: AISuggestion) => void;
}

const TYPE_CONFIG = {
  assignment: { color: '#3b82f6', bg: 'rgba(59,130,246,0.12)', border: 'rgba(59,130,246,0.25)', icon: '🎯', label: 'AI Match' },
  prediction: { color: '#a78bfa', bg: 'rgba(167,139,250,0.12)', border: 'rgba(167,139,250,0.25)', icon: '🔮', label: 'Prediction' },
  cluster: { color: '#f59e0b', bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.25)', icon: '⚡', label: 'Cluster' },
  underserved: { color: '#ef4444', bg: 'rgba(239,68,68,0.12)', border: 'rgba(239,68,68,0.25)', icon: '📍', label: 'Gap Alert' },
};

export function SmartSuggestionsBar({ suggestions, onAction }: SmartSuggestionsBarProps) {
  const [expanded, setExpanded] = useState(false);
  const [dismissed, setDismissed] = useState<string[]>([]);

  const visible = suggestions.filter(s => !dismissed.includes(s.id));

  if (visible.length === 0) return null;

  return (
    <div style={{
      position: 'absolute',
      bottom: '16px',
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 900,
      minWidth: '480px',
      maxWidth: '680px',
    }}>
      {/* Header toggle */}
      <button
        onClick={() => setExpanded(v => !v)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '8px 14px',
          background: 'rgba(4, 10, 26, 0.97)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(99,102,241,0.3)',
          borderBottom: expanded ? '1px solid rgba(99,102,241,0.12)' : undefined,
          borderRadius: expanded ? '12px 12px 0 0' : '12px',
          cursor: 'pointer',
          boxShadow: '0 0 30px rgba(99,102,241,0.15), 0 8px 32px rgba(0,0,0,0.5)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '22px', height: '22px', borderRadius: '6px',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Zap size={12} color="white" />
          </div>
          <span style={{ fontSize: '11px', fontWeight: 700, color: '#c4b5fd', letterSpacing: '0.3px' }}>
            AI Smart Suggestions
          </span>
          <span style={{
            fontSize: '9px', padding: '1px 7px', borderRadius: '100px',
            background: 'rgba(99,102,241,0.2)', color: '#a5b4fc',
            border: '1px solid rgba(99,102,241,0.35)', fontWeight: 700,
          }}>{visible.length} insights</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#475569' }}>
          <span style={{ fontSize: '9px' }}>Powered by RespondOps AI</span>
          {expanded ? <ChevronDown size={12} /> : <ChevronUp size={12} />}
        </div>
      </button>

      {/* Suggestions List */}
      {expanded && (
        <div style={{
          background: 'rgba(4, 10, 26, 0.97)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(99,102,241,0.2)',
          borderTop: 'none',
          borderRadius: '0 0 12px 12px',
          overflow: 'hidden',
          boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
        }}>
          {visible.map((s, i) => {
            const cfg = TYPE_CONFIG[s.type];
            return (
              <div
                key={s.id}
                style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  padding: '10px 14px',
                  background: cfg.bg,
                  borderBottom: i < visible.length - 1 ? '1px solid rgba(148,163,184,0.06)' : 'none',
                }}
              >
                {/* Type badge */}
                <div style={{ flexShrink: 0 }}>
                  <div style={{
                    fontSize: '8px', fontWeight: 700, padding: '2px 6px', borderRadius: '4px',
                    background: `${cfg.color}20`, color: cfg.color, border: `1px solid ${cfg.border}`,
                    display: 'flex', alignItems: 'center', gap: '3px', whiteSpace: 'nowrap',
                  }}>
                    {cfg.icon} {cfg.label}
                  </div>
                  <div style={{
                    marginTop: '3px', textAlign: 'center',
                    fontSize: '10px', fontWeight: 700, color: cfg.color,
                  }}>{s.confidence}%</div>
                  <div style={{ fontSize: '8px', color: '#334155', textAlign: 'center' }}>confidence</div>
                </div>

                {/* Message */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '11px', color: '#cbd5e1', lineHeight: 1.4 }}>{s.message}</div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '5px', flexShrink: 0 }}>
                  <button
                    onClick={() => onAction(s)}
                    style={{
                      padding: '5px 10px', fontSize: '9px', fontWeight: 600, borderRadius: '6px',
                      background: `${cfg.color}20`, color: cfg.color,
                      border: `1px solid ${cfg.border}`, cursor: 'pointer', whiteSpace: 'nowrap',
                    }}
                  >{s.action}</button>
                  <button
                    onClick={() => setDismissed(d => [...d, s.id])}
                    style={{
                      padding: '5px 6px', borderRadius: '6px', cursor: 'pointer',
                      background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(148,163,184,0.1)',
                      color: '#334155', display: 'flex', alignItems: 'center',
                    }}
                  ><X size={10} /></button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
