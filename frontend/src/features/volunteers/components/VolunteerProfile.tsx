import { X, User, Phone, MapPin, Calendar, Clock, Star, TrendingUp, Award } from 'lucide-react';
import { Volunteer } from '../data/mockData';

interface VolunteerProfileProps {
  volunteer: Volunteer;
  onClose: () => void;
}

export function VolunteerProfile({ volunteer, onClose }: VolunteerProfileProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-card border-b border-border p-6 flex justify-between items-start z-10">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h2 className="text-xl">{volunteer.name}</h2>
              <p className="text-muted-foreground">{volunteer.id} • {volunteer.role}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <section>
            <h3 className="text-base mb-3 text-foreground">Personal Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Contact</p>
                  <p className="text-sm">{volunteer.contact}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Address</p>
                  <p className="text-sm">{volunteer.address}</p>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-base mb-3 text-foreground">Skills & Expertise</h3>
            <div className="flex flex-wrap gap-2 mb-3">
              {volunteer.skills.map((skill, idx) => (
                <span key={idx} className="px-3 py-1.5 bg-primary/10 text-primary rounded border border-primary/20">
                  {skill}
                </span>
              ))}
            </div>
            {volunteer.certifications.length > 0 && (
              <div className="flex items-start gap-3">
                <Award className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Certifications</p>
                  <div className="flex flex-wrap gap-2">
                    {volunteer.certifications.map((cert, idx) => (
                      <span key={idx} className="px-2 py-1 bg-green-500/10 text-green-600 dark:text-green-400 rounded text-sm border border-green-500/20">
                        {cert}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </section>

          <section>
            <h3 className="text-base mb-3 text-foreground">Availability</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Days Available</p>
                  <p className="text-sm">{volunteer.availability.days.join(', ')}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Time Slots</p>
                  <p className="text-sm">{volunteer.availability.hours}</p>
                </div>
              </div>
            </div>
            <div className="mt-3">
              <span className={`px-3 py-1.5 rounded ${
                volunteer.status === 'Available' ? 'bg-green-500/20 text-green-800 border border-green-300' :
                volunteer.status === 'Busy' ? 'bg-red-500/20 text-red-800 border border-red-300' :
                'bg-muted text-foreground border border-border'
              }`}>
                Current Status: {volunteer.status}
              </span>
            </div>
          </section>

          <section>
            <h3 className="text-base mb-3 text-foreground">Performance Metrics</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-primary/10 p-4 rounded-lg border border-primary/20">
                <p className="text-sm text-muted-foreground mb-1">Tasks Completed</p>
                <p className="text-2xl text-primary">{volunteer.tasksCompleted}</p>
              </div>
              <div className="bg-green-500/10 p-4 rounded-lg border border-green-500/20">
                <p className="text-sm text-muted-foreground mb-1">Success Rate</p>
                <p className="text-2xl text-green-600 dark:text-green-400">{volunteer.performanceMetrics.successRate}%</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                <p className="text-sm text-muted-foreground mb-1">Avg Response Time</p>
                <p className="text-2xl text-purple-700">{volunteer.performanceMetrics.avgResponseTime}</p>
              </div>
              <div className="bg-yellow-500/10 p-4 rounded-lg border border-yellow-500/20">
                <p className="text-sm text-muted-foreground mb-1">Rating</p>
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                  <p className="text-2xl text-yellow-600 dark:text-yellow-400">{volunteer.rating.toFixed(1)}</p>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-base mb-3 text-foreground">Activity History</h3>
            <div className="space-y-3">
              {volunteer.activityHistory.map((activity, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 bg-muted rounded-lg border border-border">
                  <TrendingUp className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm">{activity.taskName}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className={`text-xs px-2 py-0.5 rounded ${
                        activity.outcome === 'Completed' ? 'bg-green-500/20 text-green-600 dark:text-green-400' : 'bg-primary/20 text-primary'
                      }`}>
                        {activity.outcome}
                      </span>
                      <span className="text-xs text-muted-foreground">{activity.date}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <div className="flex gap-3 pt-4 border-t border-border">
            <button className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
              Edit Details
            </button>
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              Assign Task
            </button>
            <button className="px-4 py-2 bg-secondary text-foreground rounded-lg hover:bg-secondary/80 transition-colors">
              Deactivate
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
