import { useState } from 'react';
import { MapPin, Users, Clock, CheckCircle2, XCircle, RefreshCw, Zap, User, Target, Navigation, Activity } from 'lucide-react';

interface MatchCardProps {
  match: {
    id: string;
    needId?: string;
    volunteerId?: string;
    needTitle: string;
    location: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    peopleAffected: number;
    volunteerName: string;
    skills: string[];
    distance: string;
    availability: string;
    matchScore: number;
    skillMatch: number;
    distanceScore: number;
    availabilityScore: number;
    performanceScore: number;
    timeReported: string;
    status: 'suggested' | 'assigned' | 'rejected';
    reason?: string;
  };
  onAccept: () => void;
  onReject: () => void;
  onReassign: () => void;
  isAssigning?: boolean;
}

const sevColors: Record<string, { bg: string; text: string; border: string; dot: string }> = {
  critical: { bg: 'rgba(239,68,68,0.1)', text: '#ef4444', border: 'rgba(239,68,68,0.25)', dot: '#ef4444' },
  high: { bg: 'rgba(249,115,22,0.1)', text: '#ea580c', border: 'rgba(249,115,22,0.25)', dot: '#f97316' },
  medium: { bg: 'rgba(234,179,8,0.08)', text: '#ca8a04', border: 'rgba(234,179,8,0.2)', dot: '#eab308' },
  low: { bg: 'rgba(34,197,94,0.08)', text: '#16a34a', border: 'rgba(34,197,94,0.2)', dot: '#22c55e' },
};

function ScoreRing({ value, size = 56, stroke = 5 }: { value: number; size?: number; stroke?: number }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - value / 100);
  const color = value >= 80 ? '#16a34a' : value >= 60 ? '#f59e0b' : '#ef4444';
  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--af-border)" strokeWidth={stroke} />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke}
        strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 0.6s ease' }} />
      <text x={size / 2} y={size / 2} textAnchor="middle" dominantBaseline="central"
        style={{ transform: 'rotate(90deg)', transformOrigin: 'center', fontSize: '0.85rem', fontWeight: 800, fill: color }}>
        {value}
      </text>
    </svg>
  );
}

function MiniBar({ label, value, icon: Icon }: { label: string; value: number; icon: typeof Target }) {
  const color = value >= 80 ? '#16a34a' : value >= 60 ? '#f59e0b' : '#ef4444';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
      <Icon size={12} style={{ color: 'var(--af-muted)', flexShrink: 0 }} />
      <span style={{ width: '72px', fontSize: '0.68rem', color: 'var(--af-muted)' }}>{label}</span>
      <div style={{ flex: 1, height: 4, borderRadius: 2, background: 'var(--af-border)', overflow: 'hidden' }}>
        <div style={{ width: `${value}%`, height: '100%', borderRadius: 2, background: color, transition: 'width 0.5s ease' }} />
      </div>
      <span style={{ width: '28px', textAlign: 'right', fontSize: '0.68rem', fontWeight: 700, color }}>{value}</span>
    </div>
  );
}

export function MatchCard({ match, onAccept, onReject, onReassign, isAssigning }: MatchCardProps) {
  const [localStatus, setLocalStatus] = useState<'suggested' | 'accepted' | 'rejected'>(match.status === 'assigned' ? 'accepted' : match.status === 'rejected' ? 'rejected' : 'suggested');
  const sev = sevColors[match.severity] || sevColors.medium;
  const done = localStatus !== 'suggested';

  const handleAccept = () => {
    setLocalStatus('accepted');
    onAccept();
  };
  const handleReject = () => {
    setLocalStatus('rejected');
    onReject();
  };

  return (
    <div className="af-card" style={{
      padding: 0, overflow: 'hidden',
      opacity: done ? 0.65 : 1,
      transition: 'opacity 0.3s, box-shadow 0.2s',
      boxShadow: done ? 'none' : undefined,
    }}>
      {/* Severity accent bar */}
      <div style={{ height: 3, background: sev.dot }} />

      <div style={{ padding: '1.15rem 1.25rem' }}>
        {/* Row 1: Need info + Score ring */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '0.85rem' }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem', flexWrap: 'wrap' }}>
              <h3 style={{ margin: 0, fontWeight: 700, fontSize: '0.95rem', lineHeight: 1.3 }}>{match.needTitle}</h3>
              <span style={{
                fontSize: '0.65rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em',
                padding: '0.15rem 0.5rem', borderRadius: '9999px',
                background: sev.bg, color: sev.text, border: `1px solid ${sev.border}`,
              }}>{match.severity}</span>
              {done && (
                <span style={{
                  fontSize: '0.65rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em',
                  padding: '0.15rem 0.5rem', borderRadius: '9999px',
                  background: localStatus === 'accepted' ? 'rgba(22,163,74,0.1)' : 'rgba(239,68,68,0.1)',
                  color: localStatus === 'accepted' ? '#16a34a' : '#ef4444',
                  border: `1px solid ${localStatus === 'accepted' ? 'rgba(22,163,74,0.25)' : 'rgba(239,68,68,0.25)'}`,
                }}>
                  {localStatus === 'accepted' ? 'Assigned' : 'Rejected'}
                </span>
              )}
            </div>
            <div style={{ display: 'flex', gap: '0.85rem', fontSize: '0.74rem', color: 'var(--af-muted)' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}><MapPin size={11} />{match.location}</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}><Users size={11} />{match.peopleAffected} affected</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}><Clock size={11} />{match.timeReported}</span>
            </div>
          </div>
          <div style={{ flexShrink: 0 }}>
            <ScoreRing value={match.matchScore} />
          </div>
        </div>

        {/* Row 2: Volunteer + Breakdown side by side */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem',
          padding: '0.85rem', borderRadius: '0.5rem',
          background: 'rgba(0,0,0,0.02)', border: '1px solid var(--af-border)',
          marginBottom: '0.85rem',
        }}>
          {/* Volunteer */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.45rem' }}>
              <div style={{
                width: 28, height: 28, borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--af-orange), #fb923c)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <User size={14} color="#fff" />
              </div>
              <div>
                <div style={{ fontWeight: 650, fontSize: '0.85rem', lineHeight: 1.2 }}>{match.volunteerName}</div>
                <div style={{ fontSize: '0.68rem', color: 'var(--af-muted)' }}>{match.availability}</div>
              </div>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem', marginBottom: '0.4rem' }}>
              {match.skills.slice(0, 4).map((skill, idx) => (
                <span key={idx} style={{
                  fontSize: '0.62rem', padding: '0.1rem 0.4rem', borderRadius: '9999px',
                  background: 'rgba(14,165,233,0.1)', color: '#0284c7', border: '1px solid rgba(14,165,233,0.2)',
                }}>{skill.trim()}</span>
              ))}
              {match.skills.length > 4 && (
                <span style={{ fontSize: '0.62rem', padding: '0.1rem 0.4rem', color: 'var(--af-muted)' }}>
                  +{match.skills.length - 4}
                </span>
              )}
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--af-muted)' }}>
              <Navigation size={10} style={{ display: 'inline', marginRight: '0.25rem', verticalAlign: 'middle' }} />
              {match.distance} away
            </div>
          </div>

          {/* Score breakdown */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', justifyContent: 'center' }}>
            <MiniBar label="Skill" value={match.skillMatch} icon={Target} />
            <MiniBar label="Distance" value={match.distanceScore} icon={Navigation} />
            <MiniBar label="Availability" value={match.availabilityScore} icon={Clock} />
            <MiniBar label="Performance" value={match.performanceScore} icon={Activity} />
          </div>
        </div>

        {/* Rationale */}
        {match.reason && (
          <div style={{
            padding: '0.6rem 0.75rem', borderRadius: '0.4rem', marginBottom: '0.85rem',
            background: 'rgba(249,115,22,0.05)', border: '1px solid rgba(249,115,22,0.15)',
            fontSize: '0.73rem', lineHeight: 1.55, color: 'var(--af-muted)',
          }}>
            <Zap size={11} style={{ display: 'inline', marginRight: '0.3rem', color: 'var(--af-orange)', verticalAlign: 'middle' }} />
            {match.reason}
          </div>
        )}

        {/* Actions */}
        {!done ? (
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button onClick={handleAccept} disabled={isAssigning} className="btn btn--primary"
              style={{ flex: 1, justifyContent: 'center', fontSize: '0.8rem', opacity: isAssigning ? 0.6 : 1 }}>
              {isAssigning ? (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                  <span className="af-spinner" /> Assigning...
                </span>
              ) : (
                <><CheckCircle2 size={15} /> Accept &amp; Assign</>
              )}
            </button>
            <button onClick={handleReject} disabled={isAssigning} className="btn btn--ghost"
              style={{ flex: 1, justifyContent: 'center', fontSize: '0.8rem', color: '#ef4444' }}>
              <XCircle size={15} /> Reject
            </button>
            <button onClick={onReassign} disabled={isAssigning} className="btn btn--ghost" style={{ padding: '0.4rem 0.6rem' }}>
              <RefreshCw size={15} />
            </button>
          </div>
        ) : (
          <div style={{
            display: 'flex', alignItems: 'center', gap: '0.4rem', justifyContent: 'center',
            padding: '0.5rem', borderRadius: '0.4rem',
            background: localStatus === 'accepted' ? 'rgba(22,163,74,0.08)' : 'rgba(239,68,68,0.08)',
            color: localStatus === 'accepted' ? '#16a34a' : '#ef4444',
            fontSize: '0.8rem', fontWeight: 600,
          }}>
            {localStatus === 'accepted' ? <><CheckCircle2 size={15} /> Assigned successfully</> : <><XCircle size={15} /> Match rejected</>}
          </div>
        )}
      </div>
    </div>
  );
}
