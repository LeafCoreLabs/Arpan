import React from 'react';
import { AlertTriangle, Users, Clock, BarChart2, TrendingUp, CheckCircle } from 'lucide-react';
import type { CommunityNeed, Volunteer, Task } from '../data/mockData';

interface AnalyticsOverlayProps {
  needs: CommunityNeed[];
  volunteers: Volunteer[];
  tasks: Task[];
}

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  sub: string;
  color: string;
  trend?: string;
  trendUp?: boolean;
}

function StatCard({ icon, label, value, sub, color, trend, trendUp }: StatCardProps) {
  return (
    <div style={{
      background: 'rgba(4, 10, 26, 0.95)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      border: `1px solid ${color}25`,
      borderLeft: `3px solid ${color}`,
      borderRadius: '10px',
      padding: '10px 12px',
      minWidth: '130px',
      boxShadow: `0 4px 20px rgba(0,0,0,0.4), 0 0 12px ${color}10`,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
        <div style={{
          width: '26px', height: '26px', borderRadius: '6px',
          background: `${color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center',
          color,
        }}>{icon}</div>
        {trend && (
          <span style={{
            fontSize: '9px', fontWeight: 600,
            color: trendUp ? '#22c55e' : '#ef4444',
            display: 'flex', alignItems: 'center', gap: '1px',
          }}>
            {trendUp ? '▲' : '▼'} {trend}
          </span>
        )}
      </div>
      <div style={{ fontSize: '22px', fontWeight: 800, color: '#f1f5f9', lineHeight: 1, marginBottom: '2px' }}>{value}</div>
      <div style={{ fontSize: '10px', fontWeight: 600, color: color, marginBottom: '1px' }}>{label}</div>
      <div style={{ fontSize: '9px', color: '#475569' }}>{sub}</div>
    </div>
  );
}

export function AnalyticsOverlay({ needs, volunteers, tasks }: AnalyticsOverlayProps) {
  // Compute stats
  const totalNeeds = needs.length;
  const criticalCount = needs.filter(n => n.severity === 'critical').length;
  const unassigned = needs.filter(n => n.status === 'unassigned').length;
  const resolved = needs.filter(n => n.status === 'resolved').length;
  const resolutionRate = totalNeeds > 0 ? Math.round((resolved / totalNeeds) * 100) : 0;

  const availableVols = volunteers.filter(v => v.status === 'available').length;
  const busyVols = volunteers.filter(v => v.status === 'busy').length;

  const activeTasks = tasks.filter(t => t.status === 'in-progress').length;
  const delayedTasks = tasks.filter(t => t.status === 'delayed').length;
  const completedTasks = tasks.filter(t => t.status === 'completed').length;

  const totalPeopleAffected = needs
    .filter(n => n.severity !== 'resolved')
    .reduce((sum, n) => sum + n.peopleAffected, 0);

  return (
    <div style={{
      position: 'absolute',
      bottom: '80px',
      left: '16px',
      zIndex: 900,
      display: 'flex',
      flexDirection: 'column',
      gap: '6px',
    }}>
      {/* Primary stats row */}
      <div style={{ display: 'flex', gap: '6px' }}>
        <StatCard
          icon={<AlertTriangle size={13} />}
          label="Total Needs"
          value={totalNeeds}
          sub={`${criticalCount} critical · ${unassigned} unassigned`}
          color="#ef4444"
          trend="2 new"
          trendUp={false}
        />
        <StatCard
          icon={<Users size={13} />}
          label="Volunteers"
          value={`${availableVols}/${volunteers.length}`}
          sub={`${busyVols} deployed · ${volunteers.length - availableVols - busyVols} offline`}
          color="#22c55e"
          trend="available"
          trendUp={true}
        />
      </div>

      {/* Secondary stats row */}
      <div style={{ display: 'flex', gap: '6px' }}>
        <StatCard
          icon={<BarChart2 size={13} />}
          label="Active Tasks"
          value={activeTasks}
          sub={`${delayedTasks} delayed · ${completedTasks} done`}
          color="#f59e0b"
          trend={delayedTasks > 0 ? `${delayedTasks} delayed` : undefined}
          trendUp={false}
        />
        <StatCard
          icon={<CheckCircle size={13} />}
          label="Resolved"
          value={`${resolutionRate}%`}
          sub={`${resolved} of ${totalNeeds} needs closed`}
          color="#22c55e"
          trend={`${resolutionRate}%`}
          trendUp={true}
        />
      </div>

      {/* People affected banner */}
      <div style={{
        background: 'rgba(4, 10, 26, 0.95)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(249,115,22,0.2)',
        borderRadius: '10px',
        padding: '8px 12px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
      }}>
        <TrendingUp size={14} color="#f97316" />
        <div>
          <span style={{ fontSize: '14px', fontWeight: 800, color: '#f97316' }}>{totalPeopleAffected.toLocaleString()}</span>
          <span style={{ fontSize: '10px', color: '#64748b', marginLeft: '6px' }}>people currently affected (open needs)</span>
        </div>
      </div>
    </div>
  );
}
