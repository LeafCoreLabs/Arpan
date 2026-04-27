import React, { useState, useRef, useEffect } from 'react';
import {
  Search, X, Layers, Flame, Users, ClipboardList, AlertTriangle,
  ToggleLeft, ToggleRight, RefreshCw, ChevronDown, Filter,
  Calendar, Map, Wifi, WifiOff, Shield, Settings,
} from 'lucide-react';

export interface ActiveLayers {
  needs: boolean;
  volunteers: boolean;
  tasks: boolean;
  heatmap: boolean;
}

export interface QuickFilters {
  criticalNeeds: boolean;
  unassignedNeeds: boolean;
  availableVolunteers: boolean;
  activeTasks: boolean;
}

export type UserRole = 'admin' | 'field-manager' | 'volunteer';

interface TopControlBarProps {
  searchQuery: string;
  onSearch: (q: string) => void;
  quickFilters: QuickFilters;
  onToggleQuickFilter: (key: keyof QuickFilters) => void;
  activeLayers: ActiveLayers;
  onToggleLayer: (key: keyof ActiveLayers) => void;
  autoRefresh: boolean;
  onToggleAutoRefresh: () => void;
  onManualRefresh: () => void;
  lastUpdated: string;
  userRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  heatmapIntensity: number;
  onHeatmapIntensity: (v: number) => void;
  onOpenFilters: () => void;
  totalNeeds: number;
  criticalCount: number;
}

const QUICK_FILTERS = [
  { key: 'criticalNeeds' as const, label: 'Critical', icon: AlertTriangle, color: '#ef4444', bg: 'rgba(239,68,68,0.15)', border: 'rgba(239,68,68,0.4)' },
  { key: 'unassignedNeeds' as const, label: 'Unassigned', icon: ClipboardList, color: '#f97316', bg: 'rgba(249,115,22,0.15)', border: 'rgba(249,115,22,0.4)' },
  { key: 'availableVolunteers' as const, label: 'Available', icon: Users, color: '#22c55e', bg: 'rgba(34,197,94,0.15)', border: 'rgba(34,197,94,0.4)' },
  { key: 'activeTasks' as const, label: 'Active Tasks', icon: Layers, color: '#3b82f6', bg: 'rgba(59,130,246,0.15)', border: 'rgba(59,130,246,0.4)' },
];

const LAYERS = [
  { key: 'needs' as const, label: 'Needs', icon: '📍', color: '#ef4444' },
  { key: 'volunteers' as const, label: 'Volunteers', icon: '👤', color: '#22c55e' },
  { key: 'tasks' as const, label: 'Tasks', icon: '↗', color: '#f59e0b' },
  { key: 'heatmap' as const, label: 'Heatmap', icon: '🔥', color: '#ef4444' },
];

const ROLES: { value: UserRole; label: string; icon: string }[] = [
  { value: 'admin', label: 'Admin', icon: '🛡' },
  { value: 'field-manager', label: 'Field Manager', icon: '📋' },
  { value: 'volunteer', label: 'Volunteer', icon: '👤' },
];

export function TopControlBar({
  searchQuery, onSearch, quickFilters, onToggleQuickFilter,
  activeLayers, onToggleLayer, autoRefresh, onToggleAutoRefresh,
  onManualRefresh, lastUpdated, userRole, onRoleChange,
  heatmapIntensity, onHeatmapIntensity, onOpenFilters,
  totalNeeds, criticalCount,
}: TopControlBarProps) {
  const [roleOpen, setRoleOpen] = useState(false);
  const [heatmapOpen, setHeatmapOpen] = useState(false);
  const roleRef = useRef<HTMLDivElement>(null);
  const heatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (roleRef.current && !roleRef.current.contains(e.target as Node)) setRoleOpen(false);
      if (heatRef.current && !heatRef.current.contains(e.target as Node)) setHeatmapOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentRole = ROLES.find(r => r.value === userRole);

  return (
    <div
      className="absolute top-0 left-0 right-0 z-[1000]"
      style={{
        background: 'rgba(4, 10, 26, 0.96)',
        borderBottom: '1px solid rgba(59,130,246,0.2)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
      }}
    >
      {/* ── Main Bar ── */}
      <div className="flex items-center gap-2 px-3 py-2">

        {/* Logo */}
        <div className="flex items-center gap-2 mr-2 flex-shrink-0">
          <div style={{
            width: '30px', height: '30px', borderRadius: '8px',
            background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 12px rgba(59,130,246,0.5)',
          }}>
            <Map size={16} color="white" />
          </div>
          <div className="hidden lg:block">
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#f1f5f9', letterSpacing: '0.5px' }}>RespondOps</div>
            <div style={{ fontSize: '9px', color: '#475569', letterSpacing: '0.5px' }}>NGO RESOURCE SYSTEM</div>
          </div>
        </div>

        {/* Divider */}
        <div style={{ width: '1px', height: '28px', background: 'rgba(148,163,184,0.1)', flexShrink: 0 }} />

        {/* Search */}
        <div className="relative flex-shrink-0" style={{ width: '220px' }}>
          <Search size={13} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#475569' }} />
          <input
            type="text"
            placeholder="Search location, issue, volunteer..."
            value={searchQuery}
            onChange={e => onSearch(e.target.value)}
            style={{
              width: '100%', paddingLeft: '30px', paddingRight: searchQuery ? '30px' : '10px',
              paddingTop: '6px', paddingBottom: '6px',
              background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(148,163,184,0.15)',
              borderRadius: '8px', fontSize: '11px', color: '#e2e8f0', outline: 'none',
            }}
            onFocus={e => { e.target.style.borderColor = 'rgba(59,130,246,0.5)'; e.target.style.background = 'rgba(59,130,246,0.08)'; }}
            onBlur={e => { e.target.style.borderColor = 'rgba(148,163,184,0.15)'; e.target.style.background = 'rgba(255,255,255,0.06)'; }}
          />
          {searchQuery && (
            <button onClick={() => onSearch('')} style={{
              position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)',
              background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: '#475569',
            }}><X size={12} /></button>
          )}
        </div>

        {/* Divider */}
        <div style={{ width: '1px', height: '28px', background: 'rgba(148,163,184,0.1)', flexShrink: 0 }} />

        {/* Quick Filters */}
        <div className="flex items-center gap-1">
          {QUICK_FILTERS.map(f => {
            const Icon = f.icon;
            const active = quickFilters[f.key];
            return (
              <button
                key={f.key}
                onClick={() => onToggleQuickFilter(f.key)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '4px',
                  padding: '5px 9px', borderRadius: '6px', cursor: 'pointer',
                  fontSize: '10px', fontWeight: active ? 600 : 500,
                  background: active ? f.bg : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${active ? f.border : 'rgba(148,163,184,0.12)'}`,
                  color: active ? f.color : '#64748b',
                  transition: 'all 0.15s',
                }}
              >
                <Icon size={11} />
                <span className="hidden md:inline">{f.label}</span>
              </button>
            );
          })}
        </div>

        {/* Divider */}
        <div style={{ width: '1px', height: '28px', background: 'rgba(148,163,184,0.1)', flexShrink: 0 }} />

        {/* Layer Toggles */}
        <div className="flex items-center gap-1">
          {LAYERS.map(layer => {
            const active = activeLayers[layer.key];
            return (
              <button
                key={layer.key}
                onClick={() => onToggleLayer(layer.key)}
                title={`Toggle ${layer.label} layer`}
                style={{
                  display: 'flex', alignItems: 'center', gap: '4px',
                  padding: '5px 8px', borderRadius: '6px', cursor: 'pointer',
                  fontSize: '10px', fontWeight: active ? 600 : 400,
                  background: active ? 'rgba(59,130,246,0.18)' : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${active ? 'rgba(59,130,246,0.4)' : 'rgba(148,163,184,0.12)'}`,
                  color: active ? '#93c5fd' : '#475569',
                  transition: 'all 0.15s',
                }}
              >
                <span style={{ fontSize: '12px', lineHeight: 1 }}>{layer.icon}</span>
                <span className="hidden xl:inline" style={{ fontSize: '10px' }}>{layer.label}</span>
              </button>
            );
          })}

          {/* Heatmap Intensity (when heatmap active) */}
          {activeLayers.heatmap && (
            <div ref={heatRef} className="relative">
              <button
                onClick={() => setHeatmapOpen(v => !v)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '4px',
                  padding: '5px 8px', borderRadius: '6px', cursor: 'pointer',
                  fontSize: '10px', fontWeight: 500,
                  background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)',
                  color: '#f87171',
                }}
              >
                <Flame size={11} />
                <span className="hidden xl:inline">{Math.round(heatmapIntensity * 100)}%</span>
              </button>
              {heatmapOpen && (
                <div style={{
                  position: 'absolute', top: '100%', left: 0, marginTop: '6px',
                  background: 'rgba(4,10,26,0.97)', border: '1px solid rgba(59,130,246,0.2)',
                  borderRadius: '10px', padding: '12px', width: '160px', zIndex: 100,
                  boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
                }}>
                  <div style={{ fontSize: '10px', color: '#64748b', marginBottom: '8px' }}>Heatmap Intensity</div>
                  <input
                    type="range" min={0.3} max={2} step={0.1} value={heatmapIntensity}
                    onChange={e => onHeatmapIntensity(parseFloat(e.target.value))}
                    style={{ width: '100%', accentColor: '#ef4444' }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', color: '#475569', marginTop: '4px' }}>
                    <span>Low</span><span>High</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Divider */}
        <div style={{ width: '1px', height: '28px', background: 'rgba(148,163,184,0.1)', flexShrink: 0 }} />

        {/* Advanced Filter */}
        <button
          onClick={onOpenFilters}
          style={{
            display: 'flex', alignItems: 'center', gap: '4px',
            padding: '5px 9px', borderRadius: '6px', cursor: 'pointer',
            fontSize: '10px', fontWeight: 500,
            background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(148,163,184,0.12)',
            color: '#64748b',
          }}
        >
          <Filter size={11} />
          <span className="hidden lg:inline">Filters</span>
        </button>

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* Stats Mini */}
        <div className="hidden lg:flex items-center gap-3 mr-2">
          <div style={{ fontSize: '10px', color: '#64748b' }}>
            <span style={{ color: '#f1f5f9', fontWeight: 600 }}>{totalNeeds}</span> needs ·{' '}
            <span style={{ color: '#ef4444', fontWeight: 600 }}>{criticalCount}</span> critical
          </div>
        </div>

        {/* Auto Refresh */}
        <div className="flex items-center gap-1">
          <button
            onClick={onToggleAutoRefresh}
            title={autoRefresh ? 'Disable auto-refresh' : 'Enable auto-refresh'}
            style={{
              display: 'flex', alignItems: 'center', gap: '4px',
              padding: '5px 8px', borderRadius: '6px', cursor: 'pointer', fontSize: '10px',
              background: autoRefresh ? 'rgba(34,197,94,0.12)' : 'rgba(255,255,255,0.04)',
              border: `1px solid ${autoRefresh ? 'rgba(34,197,94,0.3)' : 'rgba(148,163,184,0.12)'}`,
              color: autoRefresh ? '#4ade80' : '#475569',
            }}
          >
            {autoRefresh ? <Wifi size={11} /> : <WifiOff size={11} />}
            <span className="hidden xl:inline">{autoRefresh ? 'Live' : 'Paused'}</span>
          </button>
          <button
            onClick={onManualRefresh}
            title="Manual refresh"
            style={{
              padding: '5px 7px', borderRadius: '6px', cursor: 'pointer',
              background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(148,163,184,0.12)',
              color: '#475569', display: 'flex', alignItems: 'center',
            }}
          >
            <RefreshCw size={11} />
          </button>
        </div>

        {/* Divider */}
        <div style={{ width: '1px', height: '28px', background: 'rgba(148,163,184,0.1)', flexShrink: 0 }} />

        {/* Role Selector */}
        <div ref={roleRef} className="relative">
          <button
            onClick={() => setRoleOpen(v => !v)}
            style={{
              display: 'flex', alignItems: 'center', gap: '5px',
              padding: '5px 10px', borderRadius: '6px', cursor: 'pointer', fontSize: '10px',
              background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)',
              color: '#a5b4fc', fontWeight: 600,
            }}
          >
            <Shield size={11} />
            <span>{currentRole?.icon} {currentRole?.label}</span>
            <ChevronDown size={10} style={{ transform: roleOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
          </button>
          {roleOpen && (
            <div style={{
              position: 'absolute', top: '100%', right: 0, marginTop: '6px',
              background: 'rgba(4,10,26,0.97)', border: '1px solid rgba(59,130,246,0.2)',
              borderRadius: '10px', overflow: 'hidden', zIndex: 100,
              boxShadow: '0 8px 32px rgba(0,0,0,0.5)', minWidth: '150px',
            }}>
              {ROLES.map(role => (
                <button
                  key={role.value}
                  onClick={() => { onRoleChange(role.value); setRoleOpen(false); }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '8px',
                    width: '100%', padding: '9px 12px', fontSize: '11px', cursor: 'pointer',
                    background: userRole === role.value ? 'rgba(99,102,241,0.15)' : 'transparent',
                    border: 'none', color: userRole === role.value ? '#a5b4fc' : '#94a3b8',
                    fontWeight: userRole === role.value ? 600 : 400, textAlign: 'left',
                  }}
                >
                  <span>{role.icon}</span><span>{role.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Status Bar ── */}
      <div style={{ borderTop: '1px solid rgba(148,163,184,0.06)', padding: '3px 12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        {autoRefresh && (
          <div className="flex items-center gap-1">
            <div className="blink-alert" style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#22c55e' }} />
            <span style={{ fontSize: '9px', color: '#22c55e', fontWeight: 500 }}>LIVE</span>
          </div>
        )}
        <span style={{ fontSize: '9px', color: '#334155' }}>Updated: {lastUpdated}</span>
        <span style={{ fontSize: '9px', color: '#1e3a5f', marginLeft: '4px' }}>|</span>
        <span style={{ fontSize: '9px', color: '#334155' }}>Nairobi Metro Area · Kenya</span>
        <span style={{ fontSize: '9px', color: '#1e3a5f' }}>|</span>
        <span style={{ fontSize: '9px', color: '#334155' }}>Coord: -1.2921°N, 36.8219°E</span>
      </div>
    </div>
  );
}
