import { MapPin, User } from 'lucide-react';
import { Volunteer } from '../data/mockData';

interface GeographicMapProps {
  volunteers: Volunteer[];
  onVolunteerClick: (volunteer: Volunteer) => void;
}

export function GeographicMap({ volunteers, onVolunteerClick }: GeographicMapProps) {
  const districts = ['North District', 'East District', 'Central District', 'West District', 'South District'];

  const getVolunteersByDistrict = (district: string) => {
    return volunteers.filter(v => v.location === district);
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <MapPin className="w-5 h-5 text-primary" />
        <h3 className="text-base">Geographic Distribution</h3>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {districts.map((district) => {
          const districtVolunteers = getVolunteersByDistrict(district);
          const available = districtVolunteers.filter(v => v.status === 'Available').length;
          const busy = districtVolunteers.filter(v => v.status === 'Busy').length;
          const offline = districtVolunteers.filter(v => v.status === 'Offline').length;

          return (
            <div key={district} className="border border-border rounded-lg p-4 hover:shadow-md transition-all">
              <h4 className="text-sm mb-3">{district}</h4>

              <div className="space-y-2 mb-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Available</span>
                  <span className="px-2 py-0.5 bg-green-500/20 text-green-600 dark:text-green-400 rounded">{available}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Busy</span>
                  <span className="px-2 py-0.5 bg-red-500/20 text-red-600 dark:text-red-400 rounded">{busy}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Offline</span>
                  <span className="px-2 py-0.5 bg-muted text-foreground rounded">{offline}</span>
                </div>
              </div>

              <div className="border-t border-border pt-3">
                <p className="text-xs text-muted-foreground mb-2">Volunteers:</p>
                <div className="flex flex-wrap gap-1">
                  {districtVolunteers.slice(0, 3).map((volunteer) => (
                    <button
                      key={volunteer.id}
                      onClick={() => onVolunteerClick(volunteer)}
                      className={`p-1.5 rounded-full ${
                        volunteer.status === 'Available' ? 'bg-green-500/20 hover:bg-green-200' :
                        volunteer.status === 'Busy' ? 'bg-red-500/20 hover:bg-red-200' :
                        'bg-muted hover:bg-secondary'
                      }`}
                      title={volunteer.name}
                    >
                      <User className="w-3 h-3" />
                    </button>
                  ))}
                  {districtVolunteers.length > 3 && (
                    <span className="px-2 py-1 text-xs text-muted-foreground">+{districtVolunteers.length - 3}</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex items-center gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span className="text-muted-foreground">Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <span className="text-muted-foreground">Busy</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
          <span className="text-muted-foreground">Offline</span>
        </div>
      </div>
    </div>
  );
}
