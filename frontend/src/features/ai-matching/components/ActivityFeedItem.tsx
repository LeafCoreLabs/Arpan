import { CheckCircle2, XCircle, Sparkles, Clock } from 'lucide-react';

interface ActivityFeedItemProps {
  activity: {
    id: string;
    type: 'match_generated' | 'match_accepted' | 'match_rejected' | 'task_completed';
    needTitle: string;
    volunteerName: string;
    timestamp: string;
  };
}

const typeConfig: Record<string, { icon: typeof Sparkles; color: string; label: string; cls: string }> = {
  match_generated: { icon: Sparkles,     color: '#3b82f6', label: 'New match generated',  cls: 'af-activity__icon--user' },
  match_accepted:  { icon: CheckCircle2, color: '#16a34a', label: 'Match accepted',       cls: 'af-activity__icon--success' },
  match_rejected:  { icon: XCircle,      color: '#ef4444', label: 'Match rejected',       cls: 'af-activity__icon--alert' },
  task_completed:  { icon: CheckCircle2, color: '#16a34a', label: 'Task completed',       cls: 'af-activity__icon--success' },
};

export function ActivityFeedItem({ activity }: ActivityFeedItemProps) {
  const cfg = typeConfig[activity.type] || typeConfig.match_generated;
  const Icon = cfg.icon;

  return (
    <li className="af-activity__row">
      <div className={`af-activity__icon ${cfg.cls}`}>
        <Icon size={13} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p className="af-activity__msg" style={{ fontSize: '0.8rem', fontWeight: 500 }}>{cfg.label}</p>
        <p style={{ margin: 0, fontSize: '0.7rem', color: 'var(--af-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {activity.needTitle} &rarr; {activity.volunteerName}
        </p>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.65rem', color: 'var(--af-muted)', flexShrink: 0 }}>
        <Clock size={11} />{activity.timestamp}
      </div>
    </li>
  );
}
