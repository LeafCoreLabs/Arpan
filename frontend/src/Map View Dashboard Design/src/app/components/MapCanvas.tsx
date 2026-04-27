import React, { useRef, useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { CommunityNeed, Volunteer, Task, SeverityType, VolunteerStatus } from '../data/mockData';

// ─── Severity / Status Config ────────────────────────────────
export const SEVERITY_COLORS: Record<SeverityType, string> = {
  critical: '#ef4444',
  high: '#f97316',
  medium: '#3b82f6',
  resolved: '#22c55e',
};

const ISSUE_ICONS: Record<string, string> = {
  food: '🍽', water: '💧', medical: '⚕', shelter: '🏠',
  education: '📚', sanitation: '🚿', security: '🛡',
};

const VOL_COLORS: Record<VolunteerStatus, string> = {
  available: '#22c55e',
  busy: '#f59e0b',
  offline: '#64748b',
};

const TASK_COLORS: Record<string, string> = {
  completed: '#22c55e',
  'in-progress': '#f59e0b',
  delayed: '#ef4444',
};

// ─── Icon Factories ──────────────────────────────────────────
export function createNeedIcon(severity: SeverityType, issueType: string): L.DivIcon {
  const color = SEVERITY_COLORS[severity];
  const isPulsing = severity === 'critical';
  const emoji = ISSUE_ICONS[issueType] || '📍';

  return L.divIcon({
    className: '',
    html: `
      <div style="position:relative;width:42px;height:42px;display:flex;align-items:center;justify-content:center">
        ${isPulsing ? `<div class="map-pulse-ring" style="position:absolute;inset:0;border-radius:50%;background:${color};opacity:0.25;"></div>` : ''}
        <div style="position:relative;width:34px;height:34px;background:${color};border-radius:50%;border:2.5px solid rgba(255,255,255,0.9);box-shadow:0 3px 12px rgba(0,0,0,0.5),0 0 0 2px ${color}40;display:flex;align-items:center;justify-content:center;font-size:14px;line-height:1;z-index:2">${emoji}</div>
      </div>`,
    iconSize: [42, 42],
    iconAnchor: [21, 21],
    popupAnchor: [0, -24],
  });
}

export function createVolunteerIcon(status: VolunteerStatus, initials: string): L.DivIcon {
  const color = VOL_COLORS[status];
  return L.divIcon({
    className: '',
    html: `<div style="width:36px;height:36px;background:${color};border-radius:50%;border:2.5px solid rgba(255,255,255,0.9);box-shadow:0 3px 12px rgba(0,0,0,0.5),0 0 0 2px ${color}40;display:flex;align-items:center;justify-content:center;color:white;font-size:11px;font-weight:700;letter-spacing:-0.5px;font-family:system-ui,sans-serif">${initials}</div>`,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -20],
  });
}

// ─── Popup HTML Builders ─────────────────────────────────────
function needPopupHTML(need: CommunityNeed): string {
  const color = SEVERITY_COLORS[need.severity];
  const statusLabels: Record<string, string> = {
    unassigned: 'Unassigned', assigned: 'Assigned',
    'in-progress': 'In Progress', resolved: 'Resolved',
  };
  return `
    <div style="font-family:system-ui,sans-serif;width:270px">
      <div style="padding:12px 14px 10px;border-bottom:1px solid rgba(255,255,255,0.08)">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">
          <span style="font-size:10px;font-weight:700;padding:2px 8px;border-radius:100px;background:${color}25;color:${color};border:1px solid ${color}50">${need.severity.toUpperCase()}</span>
          <span style="font-size:9px;color:#64748b;margin-left:auto">${need.timeReported}</span>
        </div>
        <div style="font-size:13px;font-weight:600;color:#f1f5f9;line-height:1.3">${need.title}</div>
        <div style="font-size:11px;color:#64748b;margin-top:3px">📍 ${need.location}</div>
      </div>
      <div style="padding:10px 14px;display:grid;grid-template-columns:1fr 1fr;gap:6px">
        <div style="background:rgba(255,255,255,0.04);border-radius:6px;padding:6px 8px">
          <div style="font-size:9px;color:#475569;margin-bottom:2px">👥 Affected</div>
          <div style="font-size:11px;color:#cbd5e1;font-weight:500">${need.peopleAffected.toLocaleString()} people</div>
        </div>
        <div style="background:rgba(255,255,255,0.04);border-radius:6px;padding:6px 8px">
          <div style="font-size:9px;color:#475569;margin-bottom:2px">📋 Status</div>
          <div style="font-size:11px;color:#cbd5e1;font-weight:500">${statusLabels[need.status] || need.status}</div>
        </div>
        <div style="background:rgba(255,255,255,0.04);border-radius:6px;padding:6px 8px">
          <div style="font-size:9px;color:#475569;margin-bottom:2px">⚡ Priority</div>
          <div style="font-size:11px;color:${color};font-weight:600">P${need.priority} / 5</div>
        </div>
        <div style="background:rgba(255,255,255,0.04);border-radius:6px;padding:6px 8px">
          <div style="font-size:9px;color:#475569;margin-bottom:2px">🏷 Type</div>
          <div style="font-size:11px;color:#cbd5e1;font-weight:500">${need.issueType.charAt(0).toUpperCase() + need.issueType.slice(1)}</div>
        </div>
      </div>
      <div style="padding:6px 14px 12px;text-align:center;font-size:10px;color:#334155">
        Click marker to open full details panel →
      </div>
    </div>`;
}

function volunteerPopupHTML(vol: Volunteer): string {
  const color = VOL_COLORS[vol.status];
  const statusLabel = { available: '🟢 Available', busy: '🟡 Busy', offline: '⚫ Offline' }[vol.status];
  const skillsHTML = vol.skills.map(s =>
    `<span style="font-size:9px;padding:2px 7px;border-radius:100px;background:rgba(59,130,246,0.15);color:#60a5fa;border:1px solid rgba(59,130,246,0.25)">${s}</span>`
  ).join('');
  return `
    <div style="font-family:system-ui,sans-serif;width:255px">
      <div style="padding:12px 14px 10px;border-bottom:1px solid rgba(255,255,255,0.08)">
        <div style="display:flex;align-items:center;gap:10px">
          <div style="width:38px;height:38px;border-radius:50%;background:${color};display:flex;align-items:center;justify-content:center;color:white;font-weight:700;font-size:13px;flex-shrink:0">${vol.initials}</div>
          <div style="flex:1">
            <div style="font-size:13px;font-weight:600;color:#f1f5f9">${vol.name}</div>
            <div style="font-size:10px;color:${color};font-weight:500">${statusLabel}</div>
          </div>
          <div style="text-align:right">
            <div style="font-size:13px;font-weight:700;color:#fbbf24">★ ${vol.rating}</div>
            <div style="font-size:9px;color:#475569">${vol.completedTasks} done</div>
          </div>
        </div>
      </div>
      <div style="padding:10px 14px">
        <div style="font-size:9px;color:#475569;margin-bottom:5px;letter-spacing:0.5px;text-transform:uppercase">Skills</div>
        <div style="display:flex;flex-wrap:wrap;gap:4px;margin-bottom:8px">${skillsHTML}</div>
        <div style="font-size:10px;color:#64748b">📍 ${vol.region} · ⏱ ${vol.responseTime}</div>
      </div>
      <div style="padding:6px 14px 12px;text-align:center;font-size:10px;color:#334155">
        Click marker to view full profile →
      </div>
    </div>`;
}

// ─── Props Interface ─────────────────────────────────────────
export interface MapCanvasProps {
  needs: CommunityNeed[];
  volunteers: Volunteer[];
  tasks: Task[];
  activeLayers: { needs: boolean; volunteers: boolean; tasks: boolean; heatmap: boolean };
  heatmapIntensity: number;
  flyToLocation: [number, number] | null;
  onSelectNeed: (need: CommunityNeed) => void;
  onSelectVolunteer: (vol: Volunteer) => void;
  onAssignVolunteer: (needId: string) => void;
  onMarkResolved: (needId: string) => void;
}

// ─── Main Map Canvas ─────────────────────────────────────────
export function MapCanvas({
  needs, volunteers, tasks, activeLayers, heatmapIntensity,
  flyToLocation, onSelectNeed, onSelectVolunteer,
}: MapCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const layersRef = useRef<L.Layer[]>([]);

  // Stable callback refs to avoid stale closures in Leaflet event handlers
  const onSelectNeedRef = useRef(onSelectNeed);
  const onSelectVolunteerRef = useRef(onSelectVolunteer);
  useEffect(() => { onSelectNeedRef.current = onSelectNeed; }, [onSelectNeed]);
  useEffect(() => { onSelectVolunteerRef.current = onSelectVolunteer; }, [onSelectVolunteer]);

  // ── Initialize map once ──
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: [-1.2921, 36.8219],
      zoom: 12,
      zoomControl: false,
      preferCanvas: true,
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
      maxZoom: 20,
    }).addTo(map);

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // ── Rebuild all markers/layers when data or filters change ──
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Clear previous layers
    layersRef.current.forEach(layer => {
      try { map.removeLayer(layer); } catch (_) {}
    });
    layersRef.current = [];

    const add = (layer: L.Layer) => {
      layer.addTo(map);
      layersRef.current.push(layer);
    };

    // ── Heatmap ──
    if (activeLayers.heatmap) {
      needs.filter(n => n.severity !== 'resolved').forEach(need => {
        const color = SEVERITY_COLORS[need.severity];
        const base = need.severity === 'critical' ? 900 : need.severity === 'high' ? 650 : 400;
        add(L.circle([need.lat, need.lng], {
          radius: base * heatmapIntensity,
          fillColor: color, fillOpacity: 0.10,
          color: 'transparent', weight: 0,
        }));
        add(L.circle([need.lat, need.lng], {
          radius: base * 0.45 * heatmapIntensity,
          fillColor: color, fillOpacity: 0.16,
          color: 'transparent', weight: 0,
        }));
      });
    }

    // ── Task connection lines ──
    if (activeLayers.tasks) {
      tasks.forEach(task => {
        const need = needs.find(n => n.id === task.needId);
        const vol = volunteers.find(v => v.id === task.volunteerId);
        if (!need || !vol) return;
        add(L.polyline([[vol.lat, vol.lng], [need.lat, need.lng]], {
          color: TASK_COLORS[task.status] || '#94a3b8',
          weight: 2, opacity: 0.75,
          dashArray: task.status === 'in-progress' ? '10,5'
            : task.status === 'delayed' ? '4,4'
            : undefined,
        }));
      });
    }

    // ── Community Need markers ──
    if (activeLayers.needs) {
      needs.forEach(need => {
        const marker = L.marker([need.lat, need.lng], {
          icon: createNeedIcon(need.severity, need.issueType),
        });
        marker.on('click', () => onSelectNeedRef.current(need));
        marker.bindPopup(needPopupHTML(need), { maxWidth: 280, minWidth: 270 });
        add(marker);
      });
    }

    // ── Volunteer markers ──
    if (activeLayers.volunteers) {
      volunteers.forEach(vol => {
        const marker = L.marker([vol.lat, vol.lng], {
          icon: createVolunteerIcon(vol.status, vol.initials),
        });
        marker.on('click', () => onSelectVolunteerRef.current(vol));
        marker.bindPopup(volunteerPopupHTML(vol), { maxWidth: 265 });
        add(marker);
      });
    }
  }, [needs, volunteers, tasks, activeLayers, heatmapIntensity]);

  // ── FlyTo ──
  useEffect(() => {
    if (flyToLocation && mapRef.current) {
      mapRef.current.flyTo(flyToLocation, 15, { duration: 1.8, easeLinearity: 0.3 });
    }
  }, [flyToLocation]);

  return (
    <div
      ref={containerRef}
      style={{ height: '100%', width: '100%' }}
    />
  );
}
