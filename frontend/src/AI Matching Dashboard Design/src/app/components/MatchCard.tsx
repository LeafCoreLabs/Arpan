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
  };
  onAccept: () => void;
  onReject: () => void;
  onReassign: () => void;
  onViewDetails: () => void;
}

export function MatchCard({ match, onAccept, onReject, onReassign, onViewDetails }: MatchCardProps) {
  const severityColors = {
    low: 'text-blue-500 bg-blue-500/10',
    medium: 'text-yellow-500 bg-yellow-500/10',
    high: 'text-orange-500 bg-orange-500/10',
    critical: 'text-red-500 bg-red-500/10',
  };

  const scoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const statusBadge = {
    suggested: 'bg-blue-500/10 text-blue-500',
    assigned: 'bg-green-500/10 text-green-500',
    rejected: 'bg-red-500/10 text-red-500',
  };

  return (
    <div className="border border-gray-800 rounded-lg p-4 bg-gray-900/50 hover:border-gray-700 transition-colors">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold">{match.needTitle}</h3>
            <span className={`px-2 py-0.5 rounded text-xs ${severityColors[match.severity]}`}>
              {match.severity}
            </span>
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-400">
            <div className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {match.location}
            </div>
            <div className="flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {match.peopleAffected} affected
            </div>
          </div>
        </div>
        <span className={`px-2 py-1 rounded text-xs ${statusBadge[match.status]}`}>
          {match.status}
        </span>
      </div>

      <div className="border-t border-gray-800 pt-3 mb-3">
        <div className="flex items-center gap-2 mb-2">
          <User className="w-4 h-4 text-blue-500" />
          <span className="font-medium">{match.volunteerName}</span>
        </div>
        <div className="flex flex-wrap gap-1 mb-2">
          {match.skills.map((skill, idx) => (
            <span key={idx} className="px-2 py-0.5 bg-blue-500/10 text-blue-500 rounded text-xs">
              {skill}
            </span>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-2 text-sm text-gray-400">
          <div>Distance: {match.distance}</div>
          <div>Available: {match.availability}</div>
        </div>
      </div>

      <div className="border border-gray-800 rounded p-3 mb-3 bg-black/20">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">AI Match Score</span>
          <span className={`text-2xl font-bold ${scoreColor(match.matchScore)}`}>
            {match.matchScore}%
          </span>
        </div>
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-gray-400">Skill Match</span>
            <span className={scoreColor(match.skillMatch)}>{match.skillMatch}%</span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-1">
            <div
              className={`h-1 rounded-full ${scoreColor(match.skillMatch) === 'text-green-500' ? 'bg-green-500' : scoreColor(match.skillMatch) === 'text-yellow-500' ? 'bg-yellow-500' : 'bg-red-500'}`}
              style={{ width: `${match.skillMatch}%` }}
            />
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-gray-400">Distance Score</span>
            <span className={scoreColor(match.distanceScore)}>{match.distanceScore}%</span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-1">
            <div
              className={`h-1 rounded-full ${scoreColor(match.distanceScore) === 'text-green-500' ? 'bg-green-500' : scoreColor(match.distanceScore) === 'text-yellow-500' ? 'bg-yellow-500' : 'bg-red-500'}`}
              style={{ width: `${match.distanceScore}%` }}
            />
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-gray-400">Availability</span>
            <span className={scoreColor(match.availabilityScore)}>{match.availabilityScore}%</span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-1">
            <div
              className={`h-1 rounded-full ${scoreColor(match.availabilityScore) === 'text-green-500' ? 'bg-green-500' : scoreColor(match.availabilityScore) === 'text-yellow-500' ? 'bg-yellow-500' : 'bg-red-500'}`}
              style={{ width: `${match.availabilityScore}%` }}
            />
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-gray-400">Performance</span>
            <span className={scoreColor(match.performanceScore)}>{match.performanceScore}%</span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-1">
            <div
              className={`h-1 rounded-full ${scoreColor(match.performanceScore) === 'text-green-500' ? 'bg-green-500' : scoreColor(match.performanceScore) === 'text-yellow-500' ? 'bg-yellow-500' : 'bg-red-500'}`}
              style={{ width: `${match.performanceScore}%` }}
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 text-xs text-gray-400 mb-3">
        <Clock className="w-3 h-3" />
        Reported {match.timeReported}
      </div>

      <div className="flex gap-2">
        <button
          onClick={onAccept}
          className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-green-500/10 text-green-500 rounded hover:bg-green-500/20 transition-colors text-sm"
        >
          <CheckCircle2 className="w-4 h-4" />
          Accept
        </button>
        <button
          onClick={onReject}
          className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-red-500/10 text-red-500 rounded hover:bg-red-500/20 transition-colors text-sm"
        >
          <XCircle className="w-4 h-4" />
          Reject
        </button>
        <button
          onClick={onReassign}
          className="px-3 py-2 bg-gray-800 rounded hover:bg-gray-700 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
        <button
          onClick={onViewDetails}
          className="px-3 py-2 bg-gray-800 rounded hover:bg-gray-700 transition-colors"
        >
          <Eye className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
