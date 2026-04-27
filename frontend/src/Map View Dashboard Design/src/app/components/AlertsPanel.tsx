import React, { useState } from 'react';
import { Bell, X, AlertTriangle, Info, ChevronDown, ChevronUp } from 'lucide-react';
import type { Alert } from '../data/mockData';

interface AlertsPanelProps {
  alerts: Alert[];
  onDismiss: (id: string) => void;
  onAlertClick: (alert: Alert) => void;
}

const ALERT_CONFIG = {
  critical: {
    icon: AlertTriangle, color: '#ef4444', bg: 'rgba(239,68,68,0.1)',
    border: 'rgba(239,68,68,0.3)', dot: '#ef4444', label: 'CRITICAL',
  },
  warning: {
    icon: AlertTriangle, color: '#f97316', bg: 'rgba(249,115,22,0.08)',
    border: 'rgba(249,115,22,0.25)', dot: '#f97316', label: 'WARNING',
  },
  info: {
    icon: Info, color: '#3b82f6', bg: 'rgba(59,130,246,0.08)',
    border: 'rgba(59,130,246,0.25)', dot: '#3b82f6', label: 'INFO',
  },
};

export function AlertsPanel({ alerts, onDismiss, onAlertClick }: AlertsPanelProps) {
  const [collapsed, setCollapsed] = useState(false);

  const criticalCount = alerts.filter(a => a.type === 'critical').length;
  const totalCount = alerts.length;

  return (
    <div style={{
      position: 'absolute',
      top: '72px',
      right: '16px',
      zIndex: 900,
      width: '300px',
    }}>
      {/* Header */}
      <div
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '8px 12px',
          background: 'rgba(4, 10, 26, 0.97)',
          backdropFilter: 'blur(16px)',
          border: `1px solid ${criticalCount > 0 ? 'rgba(239,68,68,0.3)' : 'rgba(59,130,246,0.2)'}`,
          borderRadius: collapsed ? '10px' : '10px 10px 0 0',
          cursor: 'pointer',
          boxShadow: criticalCount > 0 ? '0 0 20px rgba(239,68,68,0.15)' : '0 4px 20px rgba(0,0,0,0.4)',
        }}
        onClick={() => setCollapsed(v => !v)}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ position: 'relative' }}>
            <Bell size={14} color={criticalCount > 0 ? '#ef4444' : '#64748b'} />
            {criticalCount > 0 && (
              <div className="blink-alert" style={{
                position: 'absolute', top: '-4px', right: '-4px',
                width: '8px', height: '8px', borderRadius: '50%',
                background: '#ef4444', border: '1.5px solid rgba(4,10,26,0.97)',
              }} />
            )}
          </div>
          <span style={{ fontSize: '11px', fontWeight: 700, color: '#e2e8f0' }}>
            Alerts
          </span>
          {criticalCount > 0 && (
            <span style={{
              fontSize: '9px', padding: '1px 6px', borderRadius: '100px',
              background: 'rgba(239,68,68,0.2)', color: '#ef4444',
              border: '1px solid rgba(239,68,68,0.4)', fontWeight: 700,
            }}>{criticalCount} CRITICAL</span>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '10px', color: '#475569' }}>{totalCount}</span>
          {collapsed ? <ChevronDown size={12} color="#475569" /> : <ChevronUp size={12} color="#475569" />}
        </div>
      </div>

      {/* Alerts List */}
      {!collapsed && (
        <div style={{
          background: 'rgba(4, 10, 26, 0.95)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(59,130,246,0.15)',
          borderTop: 'none',
          borderRadius: '0 0 10px 10px',
          overflow: 'hidden',
          boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
          maxHeight: '320px',
          overflowY: 'auto',
        }} className="dark-scroll">
          {alerts.length === 0 ? (
            <div style={{ padding: '16px', textAlign: 'center', fontSize: '11px', color: '#475569' }}>
              No active alerts
            </div>
          ) : (
            alerts.map((alert, i) => {
              const cfg = ALERT_CONFIG[alert.type];
              const Icon = cfg.icon;
              return (
                <div
                  key={alert.id}
                  style={{
                    padding: '10px 12px',
                    borderBottom: i < alerts.length - 1 ? '1px solid rgba(148,163,184,0.06)' : 'none',
                    background: cfg.bg,
                    cursor: 'pointer',
                    transition: 'background 0.15s',
                    position: 'relative',
                  }}
                  onClick={() => onAlertClick(alert)}
                  onMouseEnter={e => (e.currentTarget.style.background = `${cfg.bg.replace('0.1', '0.16').replace('0.08', '0.14')}`)}
                  onMouseLeave={e => (e.currentTarget.style.background = cfg.bg)}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                    <div style={{
                      width: '20px', height: '20px', borderRadius: '5px', flexShrink: 0,
                      background: `${cfg.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      marginTop: '1px',
                    }}>
                      <Icon size={11} color={cfg.color} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '3px' }}>
                        <span style={{
                          fontSize: '8px', fontWeight: 700, color: cfg.color,
                          letterSpacing: '0.5px',
                        }}>{cfg.label}</span>
                        {alert.type === 'critical' && (
                          <div className="blink-alert" style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#ef4444' }} />
                        )}
                      </div>
                      <div style={{ fontSize: '11px', color: '#cbd5e1', lineHeight: 1.4, marginBottom: '4px', fontWeight: 500 }}>
                        {alert.message}
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '9px', color: '#475569' }}>📍 {alert.location}</span>
                        <span style={{ fontSize: '9px', color: '#334155' }}>{alert.time}</span>
                      </div>
                    </div>
                    <button
                      onClick={e => { e.stopPropagation(); onDismiss(alert.id); }}
                      style={{
                        background: 'none', border: 'none', cursor: 'pointer',
                        color: '#334155', padding: '2px', flexShrink: 0,
                        display: 'flex', alignItems: 'center',
                      }}
                    >
                      <X size={11} />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
