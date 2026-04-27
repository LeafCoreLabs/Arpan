import { User, AlertTriangle, TrendingDown } from 'lucide-react';

interface VolunteerUtilizationProps {
  data: {
    overloaded: number;
    underutilized: number;
    optimal: number;
  };
}

export function VolunteerUtilization({ data }: VolunteerUtilizationProps) {
  return (
    <div className="border border-gray-800 rounded-lg p-4 bg-gray-900/50">
      <h3 className="font-semibold mb-4 flex items-center gap-2">
        <User className="w-5 h-5" />
        Volunteer Utilization
      </h3>

      <div className="space-y-3">
        <div className="flex items-center justify-between p-3 bg-red-500/10 border border-red-500/30 rounded">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-500" />
            <span className="text-sm">Overloaded</span>
          </div>
          <span className="text-xl font-bold text-red-500">{data.overloaded}</span>
        </div>

        <div className="flex items-center justify-between p-3 bg-green-500/10 border border-green-500/30 rounded">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-green-500" />
            <span className="text-sm">Optimal</span>
          </div>
          <span className="text-xl font-bold text-green-500">{data.optimal}</span>
        </div>

        <div className="flex items-center justify-between p-3 bg-yellow-500/10 border border-yellow-500/30 rounded">
          <div className="flex items-center gap-2">
            <TrendingDown className="w-4 h-4 text-yellow-500" />
            <span className="text-sm">Underutilized</span>
          </div>
          <span className="text-xl font-bold text-yellow-500">{data.underutilized}</span>
        </div>
      </div>

      <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded">
        <div className="text-sm text-blue-400 mb-1">Insights</div>
        <div className="text-xs text-gray-400">
          • {data.overloaded} volunteers are overloaded
        </div>
        <div className="text-xs text-gray-400">
          • {data.underutilized} volunteers are underutilized
        </div>
      </div>
    </div>
  );
}
