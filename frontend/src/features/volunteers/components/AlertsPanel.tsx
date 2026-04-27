import { AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

interface Alert {
  id: string;
  type: 'error' | 'warning' | 'info';
  message: string;
  timestamp: string;
}

const mockAlerts: Alert[] = [
  {
    id: '1',
    type: 'warning',
    message: 'No volunteers available in South District',
    timestamp: '2 hours ago'
  },
  {
    id: '2',
    type: 'info',
    message: 'Jessica Taylor inactive for 7 days',
    timestamp: '5 hours ago'
  },
  {
    id: '3',
    type: 'error',
    message: 'Task T003 overdue by 3 hours',
    timestamp: '1 hour ago'
  }
];

export function AlertsPanel() {
  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case 'info':
        return <Info className="w-5 h-5 text-primary" />;
      default:
        return <Info className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getAlertStyles = (type: string) => {
    switch (type) {
      case 'error':
        return 'bg-red-500/10 border-red-500/20';
      case 'warning':
        return 'bg-yellow-500/10 border-yellow-500/20';
      case 'info':
        return 'bg-primary/10 border-primary/20';
      default:
        return 'bg-muted border-border';
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h3 className="text-base mb-4">Alerts & Notifications</h3>
      <div className="space-y-3">
        {mockAlerts.map((alert) => (
          <div key={alert.id} className={`${getAlertStyles(alert.type)} border rounded-lg p-4 flex items-start gap-3`}>
            {getAlertIcon(alert.type)}
            <div className="flex-1">
              <p className="text-sm">{alert.message}</p>
              <p className="text-xs text-muted-foreground mt-1">{alert.timestamp}</p>
            </div>
            <button className="p-1 hover:bg-card rounded transition-colors">
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
