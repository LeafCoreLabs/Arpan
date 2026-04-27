import React, { useState } from 'react';
import {
  X, MapPin, Users, Clock, AlertTriangle, CheckCircle, Star,
  Phone, Calendar, Activity, ChevronRight, Zap, Target,
  ArrowRight, User, Clipboard, TrendingUp,
} from 'lucide-react';
import type { CommunityNeed, Volunteer, Task } from '../data/mockData';

type SelectedItem =
  | { type: 'need'; data: CommunityNeed }
  | { type: 'volunteer'; data: Volunteer }
  | null;

interface SidePanelProps {
  selectedItem: SelectedItem;
  allVolunteers: Volunteer[];
  allNeeds: CommunityNeed[];
  allTasks: Task[];
  onClose: () => void;
  onFlyTo: (lat: number, lng: number) => void;
  onAssignVolunteer: (needId: string) => void;
  onMarkResolved: (needId: string) => void;
}

const SEVERITY_CONFIG = {
  critical: { color: '#ef4444', bg: 'rgba(239,68,68,0.15)', label: 'CRITICAL', dot: '🔴' },
  high: { color: '#f97316', bg: 'rgba(249,115,22,0.15)', label: 'HIGH', dot: '🟠' },
  medium: { color: '#3b82f6', bg: 'rgba(59,130,246,0.15)', label: 'MEDIUM', dot: '🔵' },
  resolved: { color: '#22c55e', bg: 'rgba(34,197,94,0.15)', label: 'RESOLVED', dot: '🟢' },
};

const STATUS_CONFIG = {
  unassigned: { color: '#94a3b8', label: 'Unassigned', bg: 'rgba(148,163,184,0.12)' },
  assigned: { color: '#3b82f6', label: 'Assigned', bg: 'rgba(59,130,246,0.12)' },
  'in-progress': { color: '#f59e0b', label: 'In Progress', bg: 'rgba(245,158,11,0.12)' },
  resolved: { color: '#22c55e', label: 'Resolved', bg: 'rgba(34,197,94,0.12)' },
};

const TASK_STATUS_CONFIG = {
  completed: { color: '#22c55e', label: 'Completed', icon: '✓' },
  'in-progress': { color: '#f59e0b', label: 'In Progress', icon: '↻' },
  delayed: { color: '#ef4444', label: 'Delayed', icon: '⚠' },
};

const VOL_STATUS = {
  available: { color: '#22c55e', label: 'Available' },
  busy: { color: '#f59e0b', label: 'Busy' },
  offline: { color: '#64748b', label: 'Offline' },
};

function SectionHeader({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px', marginTop: '16px' }}>
      <div style={{ color: '#3b82f6', display: 'flex' }}>{icon}</div>
      <span style={{ fontSize: '10px', fontWeight: 700, color: '#475569', letterSpacing: '1px', textTransform: 'uppercase' }}>{title}</span>
      <div style={{ flex: 1, height: '1px', background: 'rgba(148,163,184,0.08)', marginLeft: '8px' }} />
    </div>
  );
}

function InfoRow({ label, value, valueColor }: { label: string; value: string | number; valueColor?: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '5px 0', borderBottom: '1px solid rgba(148,163,184,0.06)' }}>
      <span style={{ fontSize: '11px', color: '#475569' }}>{label}</span>
      <span style={{ fontSize: '11px', color: valueColor || '#cbd5e1', fontWeight: 500 }}>{value}</span>
    </div>
  );
}

// ─── Need Details View ───────────────────────────────────────
function NeedDetailsView({
  need, allVolunteers, allTasks, onFlyTo, onAssignVolunteer, onMarkResolved
}: {
  need: CommunityNeed;
  allVolunteers: Volunteer[];
  allTasks: Task[];
  onFlyTo: (lat: number, lng: number) => void;
  onAssignVolunteer: (id: string) => void;
  onMarkResolved: (id: string) => void;
}) {
  const sev = SEVERITY_CONFIG[need.severity];
  const st = STATUS_CONFIG[need.status];
  const assignedVol = need.assignedVolunteerId ? allVolunteers.find(v => v.id === need.assignedVolunteerId) : null;
  const task = allTasks.find(t => t.needId === need.id);
  const taskSt = task ? TASK_STATUS_CONFIG[task.status] : null;

  return (
    <div>
      {/* Hero */}
      <div style={{ padding: '16px', background: `${sev.bg}`, borderBottom: '1px solid rgba(148,163,184,0.08)' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '8px' }}>
          <span style={{
            fontSize: '10px', fontWeight: 700, padding: '2px 10px', borderRadius: '100px',
            background: `${sev.color}20`, color: sev.color, border: `1px solid ${sev.color}40`, flexShrink: 0,
          }}>{sev.dot} {sev.label}</span>
          <span style={{
            fontSize: '10px', padding: '2px 8px', borderRadius: '100px',
            background: st.bg, color: st.color, border: `1px solid ${st.color}30`,
          }}>{st.label}</span>
        </div>
        <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#f1f5f9', lineHeight: 1.3, margin: '0 0 6px' }}>{need.title}</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: '#64748b' }}>
          <MapPin size={11} />
          <span>{need.location}</span>
        </div>
      </div>

      {/* Description */}
      <div style={{ padding: '14px 16px' }}>
        <p style={{ fontSize: '12px', color: '#94a3b8', lineHeight: 1.6, margin: 0 }}>{need.description}</p>
      </div>

      {/* Key Info */}
      <div style={{ padding: '0 16px' }}>
        <SectionHeader icon={<Activity size={12} />} title="Situation" />
        <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '8px', padding: '4px 10px' }}>
          <InfoRow label="People Affected" value={`${need.peopleAffected.toLocaleString()} people`} valueColor="#f97316" />
          <InfoRow label="Priority" value={`Level ${need.priority} / 5`} valueColor={sev.color} />
          <InfoRow label="Issue Type" value={need.issueType.charAt(0).toUpperCase() + need.issueType.slice(1)} />
          <InfoRow label="Reported" value={need.timeReported} />
          <InfoRow label="Coordinates" value={`${need.lat.toFixed(4)}, ${need.lng.toFixed(4)}`} />
        </div>
      </div>

      {/* Assigned Volunteer */}
      {assignedVol && (
        <div style={{ padding: '0 16px' }}>
          <SectionHeader icon={<User size={12} />} title="Assigned Volunteer" />
          <div style={{
            display: 'flex', alignItems: 'center', gap: '10px', padding: '10px',
            background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.15)', borderRadius: '8px',
          }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: '50%',
              background: VOL_STATUS[assignedVol.status].color,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white', fontWeight: 700, fontSize: '12px', flexShrink: 0,
            }}>{assignedVol.initials}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '12px', fontWeight: 600, color: '#e2e8f0' }}>{assignedVol.name}</div>
              <div style={{ fontSize: '10px', color: '#64748b' }}>{assignedVol.region}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '11px', color: '#fbbf24', fontWeight: 700 }}>★ {assignedVol.rating}</div>
              <div style={{ fontSize: '9px', color: '#475569' }}>{assignedVol.completedTasks} tasks</div>
            </div>
          </div>
        </div>
      )}

      {/* Task Progress */}
      {task && taskSt && (
        <div style={{ padding: '0 16px' }}>
          <SectionHeader icon={<Clipboard size={12} />} title="Task Progress" />
          <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '8px', padding: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontSize: '11px', color: '#94a3b8' }}>{task.title}</span>
              <span style={{ fontSize: '10px', color: taskSt.color, fontWeight: 600 }}>{taskSt.icon} {taskSt.label}</span>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: '4px', height: '6px', overflow: 'hidden', marginBottom: '6px' }}>
              <div style={{
                height: '100%', width: `${task.progress}%`,
                background: `linear-gradient(90deg, ${taskSt.color}88, ${taskSt.color})`,
                borderRadius: '4px', transition: 'width 0.5s',
              }} />
            </div>
            <div style={{ fontSize: '10px', color: '#64748b' }}>{task.progress}% · ETA: {task.estimatedCompletion}</div>
            {task.notes && <div style={{ fontSize: '10px', color: '#64748b', marginTop: '6px', fontStyle: 'italic' }}>"{task.notes}"</div>}
          </div>
        </div>
      )}

      {/* Actions */}
      {need.severity !== 'resolved' && (
        <div style={{ padding: '14px 16px', display: 'flex', gap: '8px' }}>
          <button
            onClick={() => onFlyTo(need.lat, need.lng)}
            style={{
              flex: 1, padding: '8px 0', fontSize: '11px', fontWeight: 600, borderRadius: '8px',
              background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.3)',
              color: '#60a5fa', cursor: 'pointer',
            }}
          >📍 Fly To</button>
          {!assignedVol && (
            <button
              onClick={() => onAssignVolunteer(need.id)}
              style={{
                flex: 1, padding: '8px 0', fontSize: '11px', fontWeight: 600, borderRadius: '8px',
                background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.3)',
                color: '#fbbf24', cursor: 'pointer',
              }}
            >👤 Assign</button>
          )}
          <button
            onClick={() => onMarkResolved(need.id)}
            style={{
              flex: 1, padding: '8px 0', fontSize: '11px', fontWeight: 600, borderRadius: '8px',
              background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.3)',
              color: '#4ade80', cursor: 'pointer',
            }}
          >✓ Resolve</button>
        </div>
      )}
    </div>
  );
}

// ─── Volunteer Details View ──────────────────────────────────
function VolunteerDetailsView({
  volunteer, allNeeds, allTasks, onFlyTo
}: {
  volunteer: Volunteer;
  allNeeds: CommunityNeed[];
  allTasks: Task[];
  onFlyTo: (lat: number, lng: number) => void;
}) {
  const st = VOL_STATUS[volunteer.status];
  const assignedTasks = allTasks.filter(t => t.volunteerId === volunteer.id);
  const completedTasksData = allTasks.filter(t => t.volunteerId === volunteer.id && t.status === 'completed');

  return (
    <div>
      {/* Profile Header */}
      <div style={{ padding: '16px', background: 'rgba(34,197,94,0.06)', borderBottom: '1px solid rgba(148,163,184,0.08)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '52px', height: '52px', borderRadius: '50%',
            background: `linear-gradient(135deg, ${st.color}, ${st.color}88)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', fontWeight: 700, fontSize: '18px', flexShrink: 0,
            boxShadow: `0 0 20px ${st.color}40`,
          }}>{volunteer.initials}</div>
          <div style={{ flex: 1 }}>
            <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#f1f5f9', margin: '0 0 4px' }}>{volunteer.name}</h3>
            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
              <span style={{
                fontSize: '10px', padding: '2px 8px', borderRadius: '100px',
                background: `${st.color}20`, color: st.color, border: `1px solid ${st.color}40`, fontWeight: 600,
              }}>● {st.label}</span>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '18px', fontWeight: 800, color: '#fbbf24' }}>★ {volunteer.rating}</div>
            <div style={{ fontSize: '9px', color: '#475569' }}>rating</div>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '6px', padding: '12px 16px' }}>
        {[
          { label: 'Completed', value: volunteer.completedTasks, color: '#22c55e' },
          { label: 'Avg Response', value: volunteer.responseTime.replace(' avg', ''), color: '#3b82f6' },
          { label: 'Joined', value: volunteer.joinedDate, color: '#a78bfa' },
        ].map(stat => (
          <div key={stat.label} style={{
            background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(148,163,184,0.08)',
            borderRadius: '8px', padding: '8px', textAlign: 'center',
          }}>
            <div style={{ fontSize: '14px', fontWeight: 700, color: stat.color }}>{stat.value}</div>
            <div style={{ fontSize: '9px', color: '#475569', marginTop: '2px' }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Skills */}
      <div style={{ padding: '0 16px' }}>
        <SectionHeader icon={<Zap size={12} />} title="Skills & Expertise" />
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
          {volunteer.skills.map(skill => (
            <span key={skill} style={{
              fontSize: '10px', padding: '4px 10px', borderRadius: '100px',
              background: 'rgba(59,130,246,0.12)', color: '#60a5fa',
              border: '1px solid rgba(59,130,246,0.25)',
            }}>{skill}</span>
          ))}
        </div>
      </div>

      {/* Contact Info */}
      <div style={{ padding: '0 16px' }}>
        <SectionHeader icon={<Phone size={12} />} title="Contact" />
        <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '8px', padding: '4px 10px' }}>
          <InfoRow label="Phone" value={volunteer.phone} />
          <InfoRow label="Region" value={volunteer.region} />
          <InfoRow label="Coordinates" value={`${volunteer.lat.toFixed(4)}, ${volunteer.lng.toFixed(4)}`} />
        </div>
      </div>

      {/* Current Tasks */}
      {assignedTasks.length > 0 && (
        <div style={{ padding: '0 16px' }}>
          <SectionHeader icon={<Clipboard size={12} />} title="Active Tasks" />
          {assignedTasks.map(task => {
            const ts = TASK_STATUS_CONFIG[task.status];
            const relatedNeed = allNeeds.find(n => n.id === task.needId);
            return (
              <div key={task.id} style={{
                background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(148,163,184,0.08)',
                borderRadius: '8px', padding: '8px 10px', marginBottom: '6px',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 600, color: '#e2e8f0' }}>{task.title}</span>
                  <span style={{ fontSize: '9px', color: ts.color, fontWeight: 600 }}>{ts.icon} {ts.label}</span>
                </div>
                {relatedNeed && <div style={{ fontSize: '10px', color: '#475569' }}>📍 {relatedNeed.location}</div>}
                <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: '4px', height: '4px', marginTop: '6px' }}>
                  <div style={{ height: '100%', width: `${task.progress}%`, background: ts.color, borderRadius: '4px' }} />
                </div>
                <div style={{ fontSize: '9px', color: '#475569', marginTop: '3px' }}>{task.progress}% complete</div>
              </div>
            );
          })}
        </div>
      )}

      {/* Fly To Button */}
      <div style={{ padding: '14px 16px' }}>
        <button
          onClick={() => onFlyTo(volunteer.lat, volunteer.lng)}
          style={{
            width: '100%', padding: '9px 0', fontSize: '12px', fontWeight: 600, borderRadius: '8px',
            background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.3)',
            color: '#60a5fa', cursor: 'pointer',
          }}
        >📍 Fly to Volunteer Location</button>
      </div>
    </div>
  );
}

// ─── Main Side Panel ─────────────────────────────────────────
export function SidePanel({
  selectedItem, allVolunteers, allNeeds, allTasks,
  onClose, onFlyTo, onAssignVolunteer, onMarkResolved,
}: SidePanelProps) {
  const isOpen = selectedItem !== null;

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 999, background: 'rgba(0,0,0,0.1)' }}
          onClick={onClose}
        />
      )}

      {/* Panel */}
      <div style={{
        position: 'fixed', right: 0, top: 0, bottom: 0, width: '380px',
        zIndex: 1000, display: 'flex', flexDirection: 'column',
        background: 'rgba(4, 10, 26, 0.97)',
        backdropFilter: 'blur(20px)',
        borderLeft: '1px solid rgba(59,130,246,0.2)',
        boxShadow: '-8px 0 40px rgba(0,0,0,0.5)',
        transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.3s cubic-bezier(0.4,0,0.2,1)',
      }}>
        {/* Panel Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '12px 16px', borderBottom: '1px solid rgba(59,130,246,0.15)',
          background: 'rgba(59,130,246,0.05)', flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '6px', height: '6px', borderRadius: '50%',
              background: selectedItem?.type === 'need'
                ? (selectedItem.data.severity === 'critical' ? '#ef4444' : selectedItem.data.severity === 'high' ? '#f97316' : '#3b82f6')
                : '#22c55e',
              boxShadow: `0 0 8px currentColor`,
            }} />
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#e2e8f0' }}>
              {selectedItem?.type === 'need' ? '📍 Community Need' : '👤 Volunteer Profile'}
            </span>
          </div>
          <button onClick={onClose} style={{
            background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(148,163,184,0.12)',
            borderRadius: '6px', padding: '5px', cursor: 'pointer', color: '#64748b',
            display: 'flex', alignItems: 'center',
          }}>
            <X size={14} />
          </button>
        </div>

        {/* Panel Content */}
        <div className="dark-scroll" style={{ flex: 1, overflowY: 'auto' }}>
          {selectedItem?.type === 'need' && (
            <NeedDetailsView
              need={selectedItem.data}
              allVolunteers={allVolunteers}
              allTasks={allTasks}
              onFlyTo={onFlyTo}
              onAssignVolunteer={onAssignVolunteer}
              onMarkResolved={onMarkResolved}
            />
          )}
          {selectedItem?.type === 'volunteer' && (
            <VolunteerDetailsView
              volunteer={selectedItem.data}
              allNeeds={allNeeds}
              allTasks={allTasks}
              onFlyTo={onFlyTo}
            />
          )}
        </div>
      </div>
    </>
  );
}
