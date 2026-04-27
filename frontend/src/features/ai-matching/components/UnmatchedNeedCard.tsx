import { MapPin, UserX, Bell, ArrowUpCircle } from 'lucide-react';

interface UnmatchedNeedCardProps {
  need: {
    id: string;
    title: string;
    location: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    reason: string;
  };
}

const sevTone: Record<string, string> = { low: '', medium: 'warning', high: 'warning', critical: 'danger' };

export function UnmatchedNeedCard({ need }: UnmatchedNeedCardProps) {
  return (
    <div className="af-card" style={{ padding: '1rem', border: '1px solid #fecaca' }}>
      <div style={{ marginBottom: '0.6rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
          <h4 style={{ margin: 0, fontWeight: 600, fontSize: '0.9rem' }}>{need.title}</h4>
          <span className={`badge badge--${sevTone[need.severity] || ''}`} style={{ textTransform: 'capitalize' }}>{need.severity}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', color: 'var(--af-muted)' }}>
          <MapPin size={12} />{need.location}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', padding: '0.5rem 0.6rem', background: '#fef2f2', borderRadius: '0.375rem', marginBottom: '0.75rem', fontSize: '0.8rem', color: '#dc2626' }}>
        <UserX size={14} style={{ flexShrink: 0, marginTop: 2 }} />
        <span>{need.reason}</span>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <button className="btn btn--primary" style={{ flex: 1, justifyContent: 'center', fontSize: '0.75rem' }}>
          <UserX size={13} /> Assign Manually
        </button>
        <button className="btn btn--ghost" style={{ padding: '0.35rem 0.5rem' }}><Bell size={14} /></button>
        <button className="btn btn--ghost" style={{ padding: '0.35rem 0.5rem' }}><ArrowUpCircle size={14} /></button>
      </div>
    </div>
  );
}
