import { MapPin, User, Clock, AlertCircle, CheckCircle2, XCircle, RefreshCw, Eye } from 'lucide-react';

interface MatchCardProps {
  match: {
    id: string;
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
  onViewDetails: () => void;
}

const sevTone: Record<string, string> = { low: '', medium: 'warning', high: 'warning', critical: 'danger' };
const statusTone: Record<string, string> = { suggested: '', assigned: 'success', rejected: 'danger' };

function ScoreBar({ label, value }: { label: string; value: number }) {
  const color = value >= 80 ? '#16a34a' : value >= 60 ? '#f59e0b' : '#ef4444';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
      <span style={{ width: '90px', fontSize: '0.7rem', color: 'var(--af-muted)' }}>{label}</span>
      <div style={{ flex: 1, height: 5, borderRadius: 3, background: 'var(--af-border)' }}>
        <div style={{ width: `${value}%`, height: '100%', borderRadius: 3, background: color, transition: 'width 0.4s' }} />
      </div>
      <span style={{ width: '32px', textAlign: 'right', fontSize: '0.7rem', fontWeight: 600, color }}>{value}%</span>
    </div>
  );
}

export function MatchCard({ match, onAccept, onReject, onReassign, onViewDetails }: MatchCardProps) {
  const scoreColor = match.matchScore >= 80 ? '#16a34a' : match.matchScore >= 60 ? '#f59e0b' : '#ef4444';

  return (
    <div className="af-card" style={{ padding: '1.25rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
            <h3 style={{ margin: 0, fontWeight: 600, fontSize: '0.95rem' }}>{match.needTitle}</h3>
            <span className={`badge badge--${sevTone[match.severity] || ''}`} style={{ textTransform: 'capitalize' }}>{match.severity}</span>
          </div>
          <div style={{ display: 'flex', gap: '1rem', color: 'var(--af-muted)', fontSize: '0.75rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><MapPin size={12} />{match.location}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><AlertCircle size={12} />{match.peopleAffected} affected</span>
          </div>
        </div>
        <span className={`badge badge--${statusTone[match.status] || ''}`} style={{ textTransform: 'capitalize' }}>{match.status}</span>
      </div>

      {/* Volunteer Info */}
      <div style={{ borderTop: '1px solid var(--af-border)', paddingTop: '0.75rem', marginBottom: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <User size={16} style={{ color: 'var(--af-orange)' }} />
          <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{match.volunteerName}</span>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem', marginBottom: '0.5rem' }}>
          {match.skills.map((skill, idx) => (
            <span key={idx} className="af-tag">{skill}</span>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.75rem', color: 'var(--af-muted)' }}>
          <span>Distance: {match.distance}</span>
          <span>Available: {match.availability}</span>
        </div>
      </div>

      {/* Score Panel */}
      <div style={{ background: 'var(--af-card)', border: '1px solid var(--af-border)', borderRadius: '0.5rem', padding: '0.75rem', marginBottom: '0.75rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>Gemini Match Score</span>
          <span style={{ fontSize: '1.5rem', fontWeight: 800, color: scoreColor }}>{match.matchScore}%</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          <ScoreBar label="Skill Match" value={match.skillMatch} />
          <ScoreBar label="Distance" value={match.distanceScore} />
          <ScoreBar label="Availability" value={match.availabilityScore} />
          <ScoreBar label="Performance" value={match.performanceScore} />
        </div>
      </div>

      {match.reason ? (
        <div style={{
          border: '1px solid rgba(249,115,22,0.22)',
          background: 'rgba(249,115,22,0.07)',
          borderRadius: '0.5rem',
          padding: '0.7rem',
          color: 'var(--af-text)',
          fontSize: '0.76rem',
          lineHeight: 1.5,
          marginBottom: '0.75rem',
        }}>
          <strong>Gemini rationale:</strong> {match.reason}
        </div>
      ) : null}

      {/* Footer */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.7rem', color: 'var(--af-muted)', marginBottom: '0.75rem' }}>
        <Clock size={12} /> Reported {match.timeReported}
      </div>

      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <button onClick={onAccept} className="btn btn--primary" style={{ flex: 1, justifyContent: 'center', fontSize: '0.8rem' }}>
          <CheckCircle2 size={15} /> Accept
        </button>
        <button onClick={onReject} className="btn btn--ghost" style={{ flex: 1, justifyContent: 'center', fontSize: '0.8rem', color: '#ef4444' }}>
          <XCircle size={15} /> Reject
        </button>
        <button onClick={onReassign} className="btn btn--ghost" style={{ padding: '0.4rem 0.6rem' }}>
          <RefreshCw size={15} />
        </button>
        <button onClick={onViewDetails} className="btn btn--ghost" style={{ padding: '0.4rem 0.6rem' }}>
          <Eye size={15} />
        </button>
      </div>
    </div>
  );
}
