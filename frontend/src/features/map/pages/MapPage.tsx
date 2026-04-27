import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { toast, Toaster } from 'sonner';
import '../styles/index.css';

import { MapCanvas } from '../components/MapCanvas';
import { TopControlBar } from '../components/TopControlBar';
import { SidePanel } from '../components/SidePanel';
import { AnalyticsOverlay } from '../components/AnalyticsOverlay';
import { AlertsPanel } from '../components/AlertsPanel';
import { MapLegend } from '../components/MapLegend';
import { SmartSuggestionsBar } from '../components/SmartSuggestionsBar';
import { FilterDrawer } from '../components/FilterDrawer';
import type { AdvancedFilters } from '../components/FilterDrawer';
import type { ActiveLayers, QuickFilters, UserRole } from '../components/TopControlBar';

import {
  type CommunityNeed, type Volunteer, type Alert, type Task, type AISuggestion
} from '../data/mockData';
import { apiClient } from '../../../services/apiClient';

// ─── Main App ────────────────────────────────────────────────
export default function MapPage() {
  // ── Map State
  const [flyToLocation, setFlyToLocation] = useState<[number, number] | null>(null);

  // ── UI State
  const [sidePanelItem, setSidePanelItem] = useState<
    { type: 'need'; data: CommunityNeed } | { type: 'volunteer'; data: Volunteer } | null
  >(null);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

  // ── Layer & Filter State
  const [activeLayers, setActiveLayers] = useState<ActiveLayers>({
    needs: true, volunteers: true, tasks: true, heatmap: false,
  });
  const [quickFilters, setQuickFilters] = useState<QuickFilters>({
    criticalNeeds: false, unassignedNeeds: false,
    availableVolunteers: false, activeTasks: false,
  });
  const [advancedFilters, setAdvancedFilters] = useState<AdvancedFilters>({
    severity: [], issueType: [], volunteerStatus: [], taskStatus: [],
    radiusKm: 50, timeFilter: 'all',
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [heatmapIntensity, setHeatmapIntensity] = useState(1);

  // ── User
  const [userRole, setUserRole] = useState<UserRole>('admin');

  // ── Real-time
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastUpdated, setLastUpdated] = useState('Just now');
  const [secondsAgo, setSecondsAgo] = useState(0);
  const refreshRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── Data (fetched from live backend)
  const [needsData, setNeedsData] = useState<CommunityNeed[]>([]);
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [alertsData, setAlertsData] = useState<Alert[]>([]);
  const [aiSuggestions, setAiSuggestions] = useState<AISuggestion[]>([]);

  // ── Initial Fetch
  useEffect(() => {
    async function loadData() {
      try {
        const { data } = await apiClient.get('/api/map/data');
        setNeedsData(data.communityNeeds || []);
        setVolunteers(data.volunteers || []);
        setTasks(data.tasks || []);
        setAlertsData(data.alerts || []);
        setAiSuggestions(data.aiSuggestions || []);
      } catch (err) {
        console.error("Failed to fetch map data", err);
        toast.error("Failed to load map data from server");
      }
    }
    loadData();
  }, []);

  // ── Real-time simulation
  useEffect(() => {
    const ticker = setInterval(() => {
      setSecondsAgo(s => s + 5);
    }, 5000);
    return () => clearInterval(ticker);
  }, []);

  useEffect(() => {
    if (secondsAgo < 60) setLastUpdated(secondsAgo === 0 ? 'Just now' : `${secondsAgo}s ago`);
    else if (secondsAgo < 3600) setLastUpdated(`${Math.floor(secondsAgo / 60)}m ago`);
    else setLastUpdated(`${Math.floor(secondsAgo / 3600)}h ago`);
  }, [secondsAgo]);

  useEffect(() => {
    if (autoRefresh) {
      refreshRef.current = setInterval(() => {
        setSecondsAgo(0);
        setLastUpdated('Just now');
        // Simulate occasional new alert
        if (Math.random() > 0.85) {
          const newAlert: Alert = {
            id: `a-live-${Date.now()}`, type: 'info',
            message: 'Volunteer movement detected — route updated',
            location: 'Mathare, Nairobi', time: 'Just now',
          };
          setAlertsData(prev => [newAlert, ...prev].slice(0, 6));
        }
      }, 30000);
    } else {
      if (refreshRef.current) clearInterval(refreshRef.current);
    }
    return () => { if (refreshRef.current) clearInterval(refreshRef.current); };
  }, [autoRefresh]);

  const handleManualRefresh = useCallback(() => {
    setSecondsAgo(0);
    setLastUpdated('Just now');
    toast.success('Map data refreshed', { duration: 2000 });
  }, []);

  // ── Filtering Logic
  const filteredNeeds = useMemo(() => {
    return needsData.filter(need => {
      // Role-based visibility
      if (userRole === 'volunteer') return false; // volunteers see tasks only
      if (userRole === 'field-manager') {
        // field managers see their region (simplified: all except resolved)
        if (need.severity === 'resolved' && !quickFilters.criticalNeeds) {
          // allow it through anyway for field managers
        }
      }

      // Quick filters
      if (quickFilters.criticalNeeds && need.severity !== 'critical') return false;
      if (quickFilters.unassignedNeeds && need.status !== 'unassigned') return false;

      // Advanced severity filter
      if (advancedFilters.severity.length > 0 && !advancedFilters.severity.includes(need.severity)) return false;

      // Advanced issue type filter
      if (advancedFilters.issueType.length > 0 && !advancedFilters.issueType.includes(need.issueType)) return false;

      // Search
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        if (!need.title.toLowerCase().includes(q) &&
            !need.location.toLowerCase().includes(q) &&
            !need.issueType.toLowerCase().includes(q)) return false;
      }

      return true;
    });
  }, [needsData, quickFilters, advancedFilters, searchQuery, userRole]);

  const filteredVolunteers = useMemo(() => {
    return volunteers.filter(vol => {
      // Role-based: volunteers only see themselves
      if (userRole === 'volunteer') return true; // show all for demo

      // Quick filters
      if (quickFilters.availableVolunteers && vol.status !== 'available') return false;

      // Advanced
      if (advancedFilters.volunteerStatus.length > 0 && !advancedFilters.volunteerStatus.includes(vol.status)) return false;

      // Search
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        if (!vol.name.toLowerCase().includes(q) &&
            !vol.region.toLowerCase().includes(q) &&
            !vol.skills.some(s => s.toLowerCase().includes(q))) return false;
      }

      return true;
    });
  }, [volunteers, quickFilters, advancedFilters, searchQuery, userRole]);

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      if (quickFilters.activeTasks && task.status !== 'in-progress') return false;
      if (advancedFilters.taskStatus.length > 0 && !advancedFilters.taskStatus.includes(task.status)) return false;
      return true;
    });
  }, [tasks, quickFilters, advancedFilters]);

  // ── Actions
  const handleSelectNeed = useCallback((need: CommunityNeed) => {
    setSidePanelItem({ type: 'need', data: need });
    setFlyToLocation([need.lat, need.lng]);
  }, []);

  const handleSelectVolunteer = useCallback((vol: Volunteer) => {
    setSidePanelItem({ type: 'volunteer', data: vol });
    setFlyToLocation([vol.lat, vol.lng]);
  }, []);

  const handleAssignVolunteer = useCallback(async (needId: string) => {
    // In a real flow, this would select a volunteer first. For now, simulate assigning v1.
    try {
      const response = await apiClient.post('/api/tasks', { needId, volunteerId: 'v1' });
      toast.success(`Task assigned successfully: ${response.data.taskId}`, { duration: 3000 });
      // Update local state to reflect assignment
      setNeedsData(prev => prev.map(n => n.id === needId ? { ...n, status: 'assigned' as const } : n));
    } catch (err) {
      toast.error('Failed to assign volunteer');
    }
  }, []);

  const handleMarkResolved = useCallback(async (needId: string) => {
    try {
      await apiClient.put(`/api/needs/${needId}/resolve`);
      setNeedsData(prev => prev.map(n =>
        n.id === needId ? { ...n, severity: 'resolved' as const, status: 'resolved' as const } : n
      ));
      const need = needsData.find(n => n.id === needId);
      toast.success(`✓ Need marked as resolved: "${need?.title}"`, { duration: 3000 });
      if (sidePanelItem?.type === 'need' && sidePanelItem.data.id === needId) {
        setSidePanelItem(null);
      }
    } catch (err) {
      toast.error('Failed to mark need as resolved');
    }
  }, [needsData, sidePanelItem]);

  const handleDismissAlert = useCallback((id: string) => {
    setAlertsData(prev => prev.filter(a => a.id !== id));
  }, []);

  const handleAlertClick = useCallback((alert: Alert) => {
    if (alert.needId) {
      const need = needsData.find(n => n.id === alert.needId);
      if (need) {
        setSidePanelItem({ type: 'need', data: need });
        setFlyToLocation([need.lat, need.lng]);
      }
    }
  }, [needsData]);

  const handleAIAction = useCallback((suggestion: typeof aiSuggestions[0]) => {
    if (suggestion.type === 'assignment' && suggestion.needId && suggestion.volunteerId) {
      const need = needsData.find(n => n.id === suggestion.needId);
      const vol = volunteers.find(v => v.id === suggestion.volunteerId);
      toast.success(`AI Match Applied: ${vol?.name} assigned to "${need?.title}"`, {
        description: `Estimated arrival: 12–15 minutes · Match confidence: ${suggestion.confidence}%`,
        duration: 4000,
      });
    } else {
      toast.info(suggestion.action, { description: suggestion.message, duration: 3500 });
    }
  }, [needsData]);

  const handleFlyTo = useCallback((lat: number, lng: number) => {
    setFlyToLocation([lat, lng]);
  }, []);

  const handleToggleLayer = useCallback((key: keyof ActiveLayers) => {
    setActiveLayers(prev => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const handleToggleQuickFilter = useCallback((key: keyof QuickFilters) => {
    setQuickFilters(prev => ({ ...prev, [key]: !prev[key] }));
  }, []);

  // Computed stats
  const criticalCount = needsData.filter(n => n.severity === 'critical').length;

  return (
    <div className="map-page-wrapper" style={{
      position: 'relative', width: '100%', height: 'calc(100vh - 120px)',
      background: 'var(--map-bg, #030b1a)',
      overflow: 'hidden',
    }}>
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: 'var(--af-card, rgba(4, 10, 26, 0.97))',
            border: '1px solid var(--af-border, rgba(59,130,246,0.3))',
            color: 'var(--af-text, #e2e8f0)',
            borderRadius: '10px',
            backdropFilter: 'blur(20px)',
          },
        }}
      />

      {/* ── Map Canvas (full screen base) ── */}
      <div style={{ position: 'absolute', inset: 0, top: '72px' }}>
        <MapCanvas
          needs={filteredNeeds}
          volunteers={filteredVolunteers}
          tasks={filteredTasks}
          activeLayers={activeLayers}
          heatmapIntensity={heatmapIntensity}
          flyToLocation={flyToLocation}
          onSelectNeed={handleSelectNeed}
          onSelectVolunteer={handleSelectVolunteer}
          onAssignVolunteer={handleAssignVolunteer}
          onMarkResolved={handleMarkResolved}
        />
      </div>

      {/* ── Top Control Bar ── */}
      <TopControlBar
        searchQuery={searchQuery}
        onSearch={setSearchQuery}
        quickFilters={quickFilters}
        onToggleQuickFilter={handleToggleQuickFilter}
        activeLayers={activeLayers}
        onToggleLayer={handleToggleLayer}
        autoRefresh={autoRefresh}
        onToggleAutoRefresh={() => setAutoRefresh(v => !v)}
        onManualRefresh={handleManualRefresh}
        lastUpdated={lastUpdated}
        userRole={userRole}
        onRoleChange={setUserRole}
        heatmapIntensity={heatmapIntensity}
        onHeatmapIntensity={setHeatmapIntensity}
        onOpenFilters={() => setFilterDrawerOpen(true)}
        totalNeeds={needsData.length}
        criticalCount={criticalCount}
      />

      {/* ── Analytics Overlay (bottom-left) ── */}
      <AnalyticsOverlay
        needs={filteredNeeds}
        volunteers={filteredVolunteers}
        tasks={filteredTasks}
      />

      {/* ── Alerts Panel (top-right) ── */}
      <AlertsPanel
        alerts={alertsData}
        onDismiss={handleDismissAlert}
        onAlertClick={handleAlertClick}
      />

      {/* ── Map Legend (bottom-right) ── */}
      <MapLegend />

      {/* ── AI Suggestions Bar (bottom-center) ── */}
      <SmartSuggestionsBar
        suggestions={aiSuggestions}
        onAction={handleAIAction}
      />

      {/* ── Side Panel (right slide-in) ── */}
      <SidePanel
        selectedItem={sidePanelItem}
        allVolunteers={volunteers}
        allNeeds={needsData}
        allTasks={tasks}
        onClose={() => setSidePanelItem(null)}
        onFlyTo={handleFlyTo}
        onAssignVolunteer={handleAssignVolunteer}
        onMarkResolved={handleMarkResolved}
      />

      {/* ── Filter Drawer (left slide-in) ── */}
      <FilterDrawer
        isOpen={filterDrawerOpen}
        filters={advancedFilters}
        onClose={() => setFilterDrawerOpen(false)}
        onApply={setAdvancedFilters}
      />

      {/* ── Role Banner (field-manager / volunteer specific) ── */}
      {userRole !== 'admin' && (
        <div className="badge" style={{
          position: 'absolute', top: '72px', left: '50%', transform: 'translateX(-50%)',
          zIndex: 800, marginTop: '8px',
          backdropFilter: 'blur(12px)', whiteSpace: 'nowrap',
        }}>
          {userRole === 'field-manager'
            ? '📋 Field Manager View — Region-specific data displayed'
            : '👤 Volunteer View — Showing assigned tasks only'}
        </div>
      )}
    </div>
  );
}