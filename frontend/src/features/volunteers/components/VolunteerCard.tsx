import { User, MapPin, Star, CheckCircle } from 'lucide-react';
import { Volunteer } from '../data/mockData';

interface VolunteerCardProps {
  volunteer: Volunteer;
  onClick: () => void;
  onAssignTask: () => void;
}

export function VolunteerCard({ volunteer, onClick, onAssignTask }: VolunteerCardProps) {
  const statusColors = {
    Available: 'bg-green-500/20 text-green-800 border-green-300',
    Busy: 'bg-red-500/20 text-red-800 border-red-300',
    Offline: 'bg-muted text-foreground border-border'
  };

  return (
    <div className="bg-card border border-border rounded-lg p-5 hover:shadow-lg transition-all cursor-pointer">
      <div onClick={onClick}>
        <div className="flex items-start gap-4 mb-4">
          <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
            <User className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base truncate">{volunteer.name}</h3>
            <p className="text-sm text-muted-foreground">{volunteer.id}</p>
          </div>
          <span className={`${statusColors[volunteer.status]} px-2 py-1 rounded-full text-xs border flex-shrink-0`}>
            {volunteer.status}
          </span>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="px-2 py-1 bg-muted rounded text-xs">{volunteer.role}</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {volunteer.skills.map((skill, idx) => (
              <span key={idx} className="px-2 py-1 bg-primary/10 text-primary rounded text-xs border border-primary/20">
                {skill}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <span>{volunteer.location}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
          <div>
            <p className="text-muted-foreground">Tasks Assigned</p>
            <p className="text-primary">{volunteer.tasksAssigned}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Tasks Completed</p>
            <p className="text-green-600 flex items-center gap-1">
              <CheckCircle className="w-4 h-4" />
              {volunteer.tasksCompleted}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 mb-4">
          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
          <span className="text-sm">{volunteer.rating.toFixed(1)}</span>
        </div>
      </div>

      <div className="flex gap-2 pt-4 border-t border-border">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
          className="flex-1 px-3 py-2 bg-primary/10 text-primary rounded hover:bg-primary/20 transition-colors text-sm"
        >
          View Profile
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAssignTask();
          }}
          className="flex-1 px-3 py-2 bg-green-500/10 text-green-600 dark:text-green-400 rounded hover:bg-green-500/20 transition-colors text-sm"
        >
          Assign Task
        </button>
      </div>
    </div>
  );
}
