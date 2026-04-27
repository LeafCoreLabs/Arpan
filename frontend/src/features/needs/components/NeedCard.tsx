import { MapPin, Users, Clock, AlertCircle } from 'lucide-react';

export interface Need {
  id: string;
  title: string;
  location: string;
  district: string;
  issueType: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  priorityScore: number;
  affectedPeople: number;
  reportedAt: string;
  status: 'Pending' | 'In Progress' | 'Resolved';
  assignedTo?: string;
  coordinates?: [number, number];
}

interface NeedCardProps {
  need: Need;
  onViewDetails: (id: string) => void;
  onAssign: (id: string) => void;
  onUpdateStatus: (id: string, status: Need['status']) => void;
}

export function NeedCard({ need, onViewDetails, onAssign, onUpdateStatus }: NeedCardProps) {
  const severityColors = {
    Critical: 'border-red-600 bg-red-50 border-l-4',
    High: 'border-orange-500 bg-orange-50 border-l-4',
    Medium: 'border-yellow-500 bg-yellow-50 border-l-4',
    Low: 'border-blue-500 bg-blue-50 border-l-4'
  };

  const statusColors = {
    Pending: 'bg-muted text-foreground',
    'In Progress': 'bg-blue-100 text-blue-700',
    Resolved: 'bg-green-100 text-green-700'
  };

  return (
    <div className={`rounded-lg p-4 border ${severityColors[need.severity]}`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            {need.severity === 'Critical' && <AlertCircle className="w-5 h-5 text-red-600" />}
            <h3 className="font-semibold text-foreground">{need.title}</h3>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {need.location}, {need.district}
            </span>
          </div>
        </div>
        <span className={`px-2 py-1 rounded text-xs font-medium ${statusColors[need.status]}`}>
          {need.status}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-3">
        <div>
          <p className="text-xs text-muted-foreground">Issue Type</p>
          <p className="text-sm font-medium text-foreground">{need.issueType}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Severity</p>
          <p className={`text-sm font-medium ${need.severity === 'Critical' ? 'text-red-600' : 'text-foreground'}`}>
            {need.severity}
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Priority Score</p>
          <p className="text-sm font-medium text-foreground">{need.priorityScore}/100</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Affected People</p>
          <p className="text-sm font-medium text-foreground flex items-center gap-1">
            <Users className="w-3 h-3" />
            {need.affectedPeople}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
        <span className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {need.reportedAt}
        </span>
        {need.assignedTo && <span className="text-blue-600">Assigned: {need.assignedTo}</span>}
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => onViewDetails(need.id)}
          className="flex-1 px-3 py-1.5 bg-gray-900 text-white rounded text-sm font-medium hover:bg-gray-800"
        >
          View Details
        </button>
        {!need.assignedTo && (
          <button
            onClick={() => onAssign(need.id)}
            className="flex-1 px-3 py-1.5 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700"
          >
            Assign
          </button>
        )}
        {need.status === 'Pending' && (
          <button
            onClick={() => onUpdateStatus(need.id, 'In Progress')}
            className="px-3 py-1.5 border border-border rounded text-sm font-medium hover:bg-muted"
          >
            Start
          </button>
        )}
      </div>
    </div>
  );
}
