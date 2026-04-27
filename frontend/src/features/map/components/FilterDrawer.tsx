import React, { useState } from 'react';
import { X, Filter, RotateCcw } from 'lucide-react';

export interface AdvancedFilters {
  severity: string[];
  issueType: string[];
  volunteerStatus: string[];
  taskStatus: string[];
  radiusKm: number;
  timeFilter: string;
}

interface FilterDrawerProps {
  isOpen: boolean;
  filters: AdvancedFilters;
  onClose: () => void;
  onApply: (filters: AdvancedFilters) => void;
}

const SEVERITY_OPTIONS = [
  { value: 'critical', label: 'Critical', color: '#ef4444' },
  { value: 'high', label: 'High', color: '#f97316' },
  { value: 'medium', label: 'Medium', color: '#3b82f6' },
  { value: 'resolved', label: 'Resolved', color: '#22c55e' },
];

const ISSUE_TYPE_OPTIONS = [
  { value: 'food', label: '🍽 Food', },
  { value: 'water', label: '💧 Water' },
  { value: 'medical', label: '⚕ Medical' },
  { value: 'shelter', label: '🏠 Shelter' },
  { value: 'education', label: '📚 Education' },
  { value: 'sanitation', label: '🚿 Sanitation' },
  { value: 'security', label: '🛡 Security' },
];

const VOLUNTEER_STATUS_OPTIONS = [
  { value: 'available', label: 'Available', color: '#22c55e' },
  { value: 'busy', label: 'Busy', color: '#f59e0b' },
  { value: 'offline', label: 'Offline', color: '#64748b' },
];

const TASK_STATUS_OPTIONS = [
  { value: 'in-progress', label: 'In Progress', color: '#f59e0b' },
  { value: 'completed', label: 'Completed', color: '#22c55e' },
  { value: 'delayed', label: 'Delayed', color: '#ef4444' },
];

const TIME_OPTIONS = [
  { value: 'all', label: 'All time' },
  { value: '24h', label: 'Last 24 hours' },
  { value: '48h', label: 'Last 48 hours' },
  { value: '7d', label: 'Last 7 days' },
];

function ToggleChip({ label, active, color, onClick }: { label: string; active: boolean; color?: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '5px 10px', fontSize: '10px', fontWeight: active ? 600 : 400,
        borderRadius: '100px', cursor: 'pointer',
        background: active ? (color ? `${color}20` : 'rgba(59,130,246,0.2)') : 'rgba(255,255,255,0.04)',
        border: `1px solid ${active ? (color || 'rgba(59,130,246,0.5)') + (color ? '55' : '') : 'rgba(148,163,184,0.12)'}`,
        color: active ? (color || '#60a5fa') : '#475569',
        transition: 'all 0.15s',
      }}
    >{label}</button>
  );
}

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: '20px' }}>
      <div style={{ fontSize: '10px', fontWeight: 700, color: '#475569', letterSpacing: '0.8px', textTransform: 'uppercase', marginBottom: '8px' }}>
        {title}
      </div>
      {children}
    </div>
  );
}

export function FilterDrawer({ isOpen, filters, onClose, onApply }: FilterDrawerProps) {
  const [local, setLocal] = useState<AdvancedFilters>(filters);

  const toggle = <K extends keyof AdvancedFilters>(key: K, value: string) => {
    const arr = local[key] as string[];
    setLocal(f => ({
      ...f,
      [key]: arr.includes(value) ? arr.filter(v => v !== value) : [...arr, value],
    }));
  };

  const reset = () => setLocal({
    severity: [], issueType: [], volunteerStatus: [], taskStatus: [],
    radiusKm: 50, timeFilter: 'all',
  });

  return (
    <>
      {isOpen && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 1001, background: 'rgba(0,0,0,0.15)' }}
          onClick={onClose}
        />
      )}
      <div style={{
        position: 'fixed', left: 0, top: 0, bottom: 0, width: '300px',
        zIndex: 1002, display: 'flex', flexDirection: 'column',
        background: 'rgba(4, 10, 26, 0.98)',
        backdropFilter: 'blur(24px)',
        borderRight: '1px solid rgba(59,130,246,0.2)',
        boxShadow: '8px 0 40px rgba(0,0,0,0.5)',
        transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 0.3s cubic-bezier(0.4,0,0.2,1)',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '14px 16px', borderBottom: '1px solid rgba(59,130,246,0.15)',
          background: 'rgba(59,130,246,0.06)', flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Filter size={14} color="#3b82f6" />
            <span style={{ fontSize: '13px', fontWeight: 700, color: '#e2e8f0' }}>Advanced Filters</span>
          </div>
          <div style={{ display: 'flex', gap: '6px' }}>
            <button onClick={reset} style={{
              display: 'flex', alignItems: 'center', gap: '3px', padding: '5px 8px',
              borderRadius: '6px', cursor: 'pointer', fontSize: '10px',
              background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(148,163,184,0.12)',
              color: '#64748b',
            }}><RotateCcw size={10} /> Reset</button>
            <button onClick={onClose} style={{
              background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(148,163,184,0.12)',
              borderRadius: '6px', padding: '5px', cursor: 'pointer', color: '#64748b',
              display: 'flex',
            }}><X size={14} /></button>
          </div>
        </div>

        {/* Filters */}
        <div className="dark-scroll" style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
          <FilterSection title="Severity">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
              {SEVERITY_OPTIONS.map(opt => (
                <ToggleChip
                  key={opt.value} label={opt.label} color={opt.color}
                  active={local.severity.includes(opt.value)}
                  onClick={() => toggle('severity', opt.value)}
                />
              ))}
            </div>
          </FilterSection>

          <FilterSection title="Issue Type">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
              {ISSUE_TYPE_OPTIONS.map(opt => (
                <ToggleChip
                  key={opt.value} label={opt.label}
                  active={local.issueType.includes(opt.value)}
                  onClick={() => toggle('issueType', opt.value)}
                />
              ))}
            </div>
          </FilterSection>

          <FilterSection title="Volunteer Availability">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
              {VOLUNTEER_STATUS_OPTIONS.map(opt => (
                <ToggleChip
                  key={opt.value} label={opt.label} color={opt.color}
                  active={local.volunteerStatus.includes(opt.value)}
                  onClick={() => toggle('volunteerStatus', opt.value)}
                />
              ))}
            </div>
          </FilterSection>

          <FilterSection title="Task Status">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
              {TASK_STATUS_OPTIONS.map(opt => (
                <ToggleChip
                  key={opt.value} label={opt.label} color={opt.color}
                  active={local.taskStatus.includes(opt.value)}
                  onClick={() => toggle('taskStatus', opt.value)}
                />
              ))}
            </div>
          </FilterSection>

          <FilterSection title="Search Radius">
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontSize: '10px', color: '#64748b' }}>Within radius</span>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#60a5fa' }}>{local.radiusKm} km</span>
              </div>
              <input
                type="range" min={1} max={100} step={1}
                value={local.radiusKm}
                onChange={e => setLocal(f => ({ ...f, radiusKm: parseInt(e.target.value) }))}
                style={{ width: '100%', accentColor: '#3b82f6' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', color: '#334155', marginTop: '3px' }}>
                <span>1 km</span><span>100 km</span>
              </div>
            </div>
          </FilterSection>

          <FilterSection title="Time Period">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {TIME_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => setLocal(f => ({ ...f, timeFilter: opt.value }))}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '7px 10px', borderRadius: '7px', cursor: 'pointer',
                    fontSize: '11px',
                    background: local.timeFilter === opt.value ? 'rgba(59,130,246,0.15)' : 'rgba(255,255,255,0.03)',
                    border: `1px solid ${local.timeFilter === opt.value ? 'rgba(59,130,246,0.35)' : 'rgba(148,163,184,0.08)'}`,
                    color: local.timeFilter === opt.value ? '#60a5fa' : '#64748b',
                    fontWeight: local.timeFilter === opt.value ? 600 : 400,
                  }}
                >
                  {opt.label}
                  {local.timeFilter === opt.value && <span style={{ fontSize: '10px' }}>✓</span>}
                </button>
              ))}
            </div>
          </FilterSection>
        </div>

        {/* Apply Button */}
        <div style={{ padding: '14px 16px', borderTop: '1px solid rgba(59,130,246,0.12)', flexShrink: 0 }}>
          <button
            onClick={() => { onApply(local); onClose(); }}
            style={{
              width: '100%', padding: '10px 0', fontSize: '12px', fontWeight: 700,
              borderRadius: '8px', cursor: 'pointer',
              background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
              border: 'none', color: 'white',
              boxShadow: '0 4px 16px rgba(59,130,246,0.35)',
            }}
          >Apply Filters</button>
        </div>
      </div>
    </>
  );
}
