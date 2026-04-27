import { MapPin, AlertTriangle, UserX, Bell, ArrowUpCircle } from 'lucide-react';

interface UnmatchedNeedCardProps {
  need: {
    id: string;
    title: string;
    location: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    reason: string;
  };
}

export function UnmatchedNeedCard({ need }: UnmatchedNeedCardProps) {
  const severityColors = {
    low: 'text-blue-500 bg-blue-500/10',
    medium: 'text-yellow-500 bg-yellow-500/10',
    high: 'text-orange-500 bg-orange-500/10',
    critical: 'text-red-500 bg-red-500/10',
  };

  return (
    <div className="border border-red-500/30 rounded-lg p-4 bg-red-500/5">
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-medium">{need.title}</h4>
            <span className={`px-2 py-0.5 rounded text-xs ${severityColors[need.severity]}`}>
              {need.severity}
            </span>
          </div>
          <div className="flex items-center gap-1 text-sm text-gray-400">
            <MapPin className="w-3 h-3" />
            {need.location}
          </div>
        </div>
      </div>

      <div className="flex items-start gap-2 mb-3 p-2 bg-red-500/10 rounded text-sm">
        <UserX className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
        <span className="text-red-400">{need.reason}</span>
      </div>

      <div className="flex gap-2">
        <button className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 bg-blue-500/10 text-blue-500 rounded hover:bg-blue-500/20 transition-colors text-sm">
          <UserX className="w-3 h-3" />
          Assign Manually
        </button>
        <button className="px-3 py-1.5 bg-gray-800 rounded hover:bg-gray-700 transition-colors">
          <Bell className="w-4 h-4" />
        </button>
        <button className="px-3 py-1.5 bg-gray-800 rounded hover:bg-gray-700 transition-colors">
          <ArrowUpCircle className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
