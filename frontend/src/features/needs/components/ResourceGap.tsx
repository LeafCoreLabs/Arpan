import { AlertCircle, Users, TrendingUp } from 'lucide-react';

interface ResourceGapProps {
  totalNeeds: number;
  assignedNeeds: number;
  unassignedCritical: number;
  volunteerAvailability: number;
  demandScore: number;
}

export function ResourceGap({ totalNeeds, assignedNeeds, unassignedCritical, volunteerAvailability, demandScore }: ResourceGapProps) {
  const gapPercentage = ((totalNeeds - assignedNeeds) / totalNeeds * 100).toFixed(1);

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
        <TrendingUp className="w-5 h-5" />
        Resource Gap Analysis
      </h3>

      <div className="space-y-4">
        <div className="bg-muted p-4 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-foreground">Total Needs vs Assigned Resources</span>
            <span className="text-sm font-semibold text-foreground">{gapPercentage}% Gap</span>
          </div>
          <div className="w-full bg-secondary rounded-full h-3">
            <div
              className="bg-primary h-3 rounded-full transition-all"
              style={{ width: `${(assignedNeeds / totalNeeds * 100)}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>{assignedNeeds} assigned</span>
            <span>{totalNeeds} total</span>
          </div>
        </div>

        {unassignedCritical > 0 && (
          <div className="bg-red-500/10 border-l-4 border-red-600 p-4 rounded">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
              <div>
                <p className="font-semibold text-red-900">{unassignedCritical} Critical Needs Unassigned</p>
                <p className="text-sm text-red-600 dark:text-red-400 mt-1">Immediate action required to prevent escalation</p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-muted p-4 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-foreground">Volunteer Availability vs Demand</span>
            <Users className="w-4 h-4 text-muted-foreground" />
          </div>
          <div className="grid grid-cols-2 gap-4 mt-3">
            <div>
              <p className="text-xs text-muted-foreground">Available Volunteers</p>
              <p className="text-2xl font-semibold text-foreground">{volunteerAvailability}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Demand Score</p>
              <p className="text-2xl font-semibold text-orange-600">{demandScore}</p>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-start gap-2 text-sm">
            <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
            <p className="text-foreground">High demand in Northern Region, low volunteer availability</p>
          </div>
          <div className="flex items-start gap-2 text-sm">
            <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
            <p className="text-foreground">Medical emergencies require specialist volunteers</p>
          </div>
        </div>
      </div>
    </div>
  );
}
