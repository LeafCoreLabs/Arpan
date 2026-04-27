import { AlertTriangle, AlertCircle, Info } from 'lucide-react';

interface Alert {
  id: string;
  type: 'critical' | 'warning' | 'info';
  message: string;
  timestamp: string;
}

interface AlertPanelProps {
  alerts: Alert[];
}

export function AlertPanel({ alerts }: AlertPanelProps) {
  const alertStyles = {
    critical: {
      bg: 'bg-red-500/10',
      border: 'border-red-500/30',
      icon: <AlertTriangle className="w-4 h-4 text-red-500" />,
      text: 'text-red-400',
    },
    warning: {
      bg: 'bg-yellow-500/10',
      border: 'border-yellow-500/30',
      icon: <AlertCircle className="w-4 h-4 text-yellow-500" />,
      text: 'text-yellow-400',
    },
    info: {
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/30',
      icon: <Info className="w-4 h-4 text-blue-500" />,
      text: 'text-blue-400',
    },
  };

  return (
    <div className="space-y-2">
      {alerts.map((alert) => {
        const style = alertStyles[alert.type];
        return (
          <div
            key={alert.id}
            className={`flex items-start gap-3 p-3 rounded-lg border ${style.bg} ${style.border}`}
          >
            {style.icon}
            <div className="flex-1">
              <div className={`text-sm ${style.text}`}>{alert.message}</div>
              <div className="text-xs text-gray-500 mt-1">{alert.timestamp}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
