import { Clock, MapPin, CheckCircle, AlertTriangle, UserPlus } from 'lucide-react';

interface Activity {
  id: string;
  type: 'new' | 'updated' | 'assigned' | 'resolved';
  message: string;
  location: string;
  timestamp: string;
}

interface ActivityFeedProps {
  activities: Activity[];
}

export function ActivityFeed({ activities }: ActivityFeedProps) {
  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'new':
        return <AlertTriangle className="w-4 h-4 text-orange-500" />;
      case 'updated':
        return <Clock className="w-4 h-4 text-blue-500" />;
      case 'assigned':
        return <UserPlus className="w-4 h-4 text-purple-500" />;
      case 'resolved':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
    }
  };

  const getActivityBg = (type: Activity['type']) => {
    switch (type) {
      case 'new':
        return 'bg-orange-500/10 border-orange-500/20';
      case 'updated':
        return 'bg-primary/10 border-primary/20';
      case 'assigned':
        return 'bg-purple-50 border-purple-200';
      case 'resolved':
        return 'bg-green-500/10 border-green-500/20';
    }
  };

  return (
    <div className="bg-card rounded-lg border border-border p-4">
      <h3 className="font-semibold text-foreground mb-4">Real-Time Activity Feed</h3>
      <div className="space-y-3 max-h-[400px] overflow-y-auto">
        {activities.map((activity) => (
          <div key={activity.id} className={`border-l-4 p-3 rounded ${getActivityBg(activity.type)}`}>
            <div className="flex items-start gap-3">
              <div className="mt-0.5">{getActivityIcon(activity.type)}</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground">{activity.message}</p>
                <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {activity.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {activity.timestamp}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
