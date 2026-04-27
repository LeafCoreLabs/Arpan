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

export function ActivityFeedItem({ activity }: ActivityFeedItemProps) {
  const icons = {
    match_generated: <Sparkles className="w-4 h-4 text-blue-500" />,
    match_accepted: <CheckCircle2 className="w-4 h-4 text-green-500" />,
    match_rejected: <XCircle className="w-4 h-4 text-red-500" />,
    task_completed: <CheckCircle2 className="w-4 h-4 text-green-500" />,
  };

  const messages = {
    match_generated: 'New match generated',
    match_accepted: 'Match accepted',
    match_rejected: 'Match rejected',
    task_completed: 'Task completed',
  };

  return (
    <div className="flex items-start gap-3 py-2 border-b border-gray-800 last:border-0">
      <div className="mt-0.5">{icons[activity.type]}</div>
      <div className="flex-1 min-w-0">
        <div className="text-sm">{messages[activity.type]}</div>
        <div className="text-xs text-gray-400 truncate">
          {activity.needTitle} → {activity.volunteerName}
        </div>
      </div>
      <div className="flex items-center gap-1 text-xs text-gray-500">
        <Clock className="w-3 h-3" />
        {activity.timestamp}
      </div>
    </div>
  );
}
