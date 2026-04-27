import { ArrowUpDown, Eye, Edit, UserPlus } from 'lucide-react';
import { Need } from './NeedCard';

interface NeedsTableProps {
  needs: Need[];
  onSort: (column: string) => void;
  onViewDetails: (id: string) => void;
  onAssign: (id: string) => void;
}

export function NeedsTable({ needs, onSort, onViewDetails, onAssign }: NeedsTableProps) {
  const getSeverityBadge = (severity: Need['severity']) => {
    const colors = {
      Critical: 'bg-red-600 text-white',
      High: 'bg-orange-500 text-white',
      Medium: 'bg-yellow-500 text-white',
      Low: 'bg-primary text-primary-foreground'
    };
    return <span className={`px-2 py-1 rounded text-xs font-medium ${colors[severity]}`}>{severity}</span>;
  };

  const getStatusBadge = (status: Need['status']) => {
    const colors = {
      Pending: 'bg-muted text-foreground',
      'In Progress': 'bg-primary/20 text-primary',
      Resolved: 'bg-green-500/20 text-green-600 dark:text-green-400'
    };
    return <span className={`px-2 py-1 rounded text-xs font-medium ${colors[status]}`}>{status}</span>;
  };

  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted border-b border-border">
            <tr>
              <th className="px-4 py-3 text-left">
                <button onClick={() => onSort('id')} className="flex items-center gap-1 text-xs font-medium text-foreground hover:text-foreground">
                  Need ID <ArrowUpDown className="w-3 h-3" />
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <button onClick={() => onSort('location')} className="flex items-center gap-1 text-xs font-medium text-foreground hover:text-foreground">
                  Location <ArrowUpDown className="w-3 h-3" />
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <button onClick={() => onSort('issueType')} className="flex items-center gap-1 text-xs font-medium text-foreground hover:text-foreground">
                  Issue Type <ArrowUpDown className="w-3 h-3" />
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <button onClick={() => onSort('severity')} className="flex items-center gap-1 text-xs font-medium text-foreground hover:text-foreground">
                  Severity <ArrowUpDown className="w-3 h-3" />
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <button onClick={() => onSort('priorityScore')} className="flex items-center gap-1 text-xs font-medium text-foreground hover:text-foreground">
                  Priority <ArrowUpDown className="w-3 h-3" />
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <button onClick={() => onSort('affectedPeople')} className="flex items-center gap-1 text-xs font-medium text-foreground hover:text-foreground">
                  Affected <ArrowUpDown className="w-3 h-3" />
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <button onClick={() => onSort('status')} className="flex items-center gap-1 text-xs font-medium text-foreground hover:text-foreground">
                  Status <ArrowUpDown className="w-3 h-3" />
                </button>
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-foreground">Assigned To</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-foreground">Date Reported</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-foreground">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {needs.map((need) => (
              <tr key={need.id} className="hover:bg-muted">
                <td className="px-4 py-3 text-sm font-medium text-foreground">{need.id}</td>
                <td className="px-4 py-3 text-sm text-foreground">{need.location}, {need.district}</td>
                <td className="px-4 py-3 text-sm text-foreground">{need.issueType}</td>
                <td className="px-4 py-3">{getSeverityBadge(need.severity)}</td>
                <td className="px-4 py-3 text-sm font-medium text-foreground">{need.priorityScore}</td>
                <td className="px-4 py-3 text-sm text-foreground">{need.affectedPeople}</td>
                <td className="px-4 py-3">{getStatusBadge(need.status)}</td>
                <td className="px-4 py-3 text-sm text-foreground">{need.assignedTo || '-'}</td>
                <td className="px-4 py-3 text-sm text-muted-foreground">{need.reportedAt}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onViewDetails(need.id)}
                      className="p-1 hover:bg-secondary rounded"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4 text-muted-foreground" />
                    </button>
                    <button
                      onClick={() => onAssign(need.id)}
                      className="p-1 hover:bg-secondary rounded"
                      title="Assign Volunteer"
                    >
                      <UserPlus className="w-4 h-4 text-primary" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
