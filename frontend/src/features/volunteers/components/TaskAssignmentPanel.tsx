import { X, MapPin, Clock, Target, Star, User } from 'lucide-react';
import { Task, Volunteer } from '../data/mockData';

interface TaskAssignmentPanelProps {
  task: Task | null;
  volunteers: Volunteer[];
  onClose: () => void;
  onAssign: (volunteerId: string, taskId: string) => void;
}

export function TaskAssignmentPanel({ task, volunteers, onClose, onAssign }: TaskAssignmentPanelProps) {
  if (!task) return null;

  const calculateMatchScore = (volunteer: Volunteer): number => {
    let score = 0;
    task.requiredSkills.forEach(skill => {
      if (volunteer.skills.includes(skill)) score += 30;
    });
    if (volunteer.status === 'Available') score += 40;
    if (volunteer.location === task.location) score += 30;
    return Math.min(score, 100);
  };

  const suggestedVolunteers = volunteers
    .map(v => ({ ...v, matchScore: calculateMatchScore(v) }))
    .filter(v => v.matchScore > 30)
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 5);

  const getDistance = (volunteer: Volunteer): string => {
    if (volunteer.location === task.location) return '0 km';
    return `${Math.floor(Math.random() * 15 + 1)} km`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-card border-b border-border p-6 flex justify-between items-start z-10">
          <div>
            <h2 className="text-xl mb-1">Assign Task</h2>
            <p className="text-muted-foreground">{task.title}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <section className="bg-muted p-4 rounded-lg border border-border">
            <h3 className="text-base mb-3 text-foreground">Task Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Description</p>
                <p className="text-sm mt-1">{task.description}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Priority</p>
                <span className={`inline-block mt-1 px-2 py-1 rounded text-xs ${
                  task.priority === 'High' ? 'bg-red-500/20 text-red-600 dark:text-red-400' :
                  task.priority === 'Medium' ? 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400' :
                  'bg-primary/20 text-primary'
                }`}>
                  {task.priority}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Location</p>
                  <p className="text-sm mt-1">{task.location}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Due Date</p>
                  <p className="text-sm mt-1">{task.dueDate}</p>
                </div>
              </div>
            </div>
            <div className="mt-3">
              <p className="text-sm text-muted-foreground mb-2">Required Skills</p>
              <div className="flex flex-wrap gap-2">
                {task.requiredSkills.map((skill, idx) => (
                  <span key={idx} className="px-2 py-1 bg-primary/10 text-primary rounded text-xs border border-primary/20">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-base mb-3 text-foreground flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              Suggested Volunteers (AI-Based Matching)
            </h3>
            <div className="space-y-3">
              {suggestedVolunteers.map((volunteer) => (
                <div key={volunteer.id} className="border border-border rounded-lg p-4 hover:border-primary/30 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <User className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-sm">{volunteer.name}</h4>
                          <span className={`px-2 py-0.5 rounded text-xs ${
                            volunteer.status === 'Available' ? 'bg-green-500/20 text-green-600 dark:text-green-400' :
                            volunteer.status === 'Busy' ? 'bg-red-500/20 text-red-600 dark:text-red-400' :
                            'bg-muted text-foreground'
                          }`}>
                            {volunteer.status}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1 mb-2">
                          {volunteer.skills.map((skill, idx) => (
                            <span
                              key={idx}
                              className={`px-2 py-0.5 rounded text-xs ${
                                task.requiredSkills.includes(skill)
                                  ? 'bg-green-500/10 text-green-600 dark:text-green-400 border border-green-300'
                                  : 'bg-muted text-muted-foreground border border-border'
                              }`}
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            <span>{getDistance(volunteer)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                            <span>{volunteer.rating}</span>
                          </div>
                          <span>Success Rate: {volunteer.performanceMetrics.successRate}%</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">Match Score</p>
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 bg-secondary rounded-full overflow-hidden">
                            <div
                              className={`h-full ${
                                volunteer.matchScore >= 80 ? 'bg-green-500' :
                                volunteer.matchScore >= 60 ? 'bg-yellow-500' :
                                'bg-orange-500'
                              }`}
                              style={{ width: `${volunteer.matchScore}%` }}
                            />
                          </div>
                          <span className="text-sm">{volunteer.matchScore}%</span>
                        </div>
                      </div>
                      <button
                        onClick={() => onAssign(volunteer.id, task.id)}
                        disabled={volunteer.status !== 'Available'}
                        className={`px-4 py-1.5 rounded text-sm ${
                          volunteer.status === 'Available'
                            ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                            : 'bg-secondary text-muted-foreground cursor-not-allowed'
                        }`}
                      >
                        Assign
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h3 className="text-base mb-3 text-foreground">All Volunteers</h3>
            <div className="max-h-64 overflow-y-auto space-y-2">
              {volunteers.filter(v => !suggestedVolunteers.find(sv => sv.id === v.id)).map((volunteer) => (
                <div key={volunteer.id} className="flex items-center justify-between p-3 bg-muted rounded border border-border">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm">{volunteer.name}</p>
                      <p className="text-xs text-muted-foreground">{volunteer.location}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => onAssign(volunteer.id, task.id)}
                    disabled={volunteer.status !== 'Available'}
                    className={`px-3 py-1 rounded text-sm ${
                      volunteer.status === 'Available'
                        ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                        : 'bg-secondary text-muted-foreground cursor-not-allowed'
                    }`}
                  >
                    Assign
                  </button>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
