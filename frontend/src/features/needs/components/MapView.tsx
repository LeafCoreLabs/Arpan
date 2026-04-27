import { MapPin } from 'lucide-react';
import { Need } from './NeedCard';

interface MapViewProps {
  needs: Need[];
  onMarkerClick: (id: string) => void;
}

export function MapView({ needs, onMarkerClick }: MapViewProps) {
  const getMarkerColor = (severity: Need['severity']) => {
    switch (severity) {
      case 'Critical':
        return 'bg-red-600 border-red-800';
      case 'High':
        return 'bg-orange-500 border-orange-700';
      case 'Medium':
        return 'bg-primary/100 border-blue-700';
      case 'Low':
        return 'bg-green-500 border-green-700';
    }
  };

  const regions = [
    { name: 'Northern', y: 20, x: 40, count: needs.filter(n => n.district.includes('North')).length },
    { name: 'Southern', y: 70, x: 50, count: needs.filter(n => n.district.includes('South')).length },
    { name: 'Eastern', y: 45, x: 75, count: needs.filter(n => n.district.includes('East')).length },
    { name: 'Western', y: 40, x: 15, count: needs.filter(n => n.district.includes('West')).length },
    { name: 'Central', y: 50, x: 50, count: needs.filter(n => n.district.includes('Central')).length },
  ];

  return (
    <div className="bg-card rounded-lg border border-border p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-foreground">Geographic Distribution</h3>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-red-600" />
            <span>Critical</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-orange-500" />
            <span>High</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-primary/100" />
            <span>Medium</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span>Resolved</span>
          </div>
        </div>
      </div>

      <div className="relative w-full h-[400px] bg-muted rounded-lg overflow-hidden border-2 border-border">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-green-50" />

        {regions.map((region, idx) => (
          <div
            key={idx}
            className="absolute transform -translate-x-1/2 -translate-y-1/2"
            style={{ top: `${region.y}%`, left: `${region.x}%` }}
          >
            <div className="relative group">
              <div className="w-16 h-16 rounded-full bg-primary bg-opacity-20 flex items-center justify-center border-2 border-blue-600 cursor-pointer hover:bg-opacity-30 transition">
                <div className="text-center">
                  <p className="text-xs font-semibold text-foreground">{region.count}</p>
                  <p className="text-[10px] text-foreground">{region.name}</p>
                </div>
              </div>
              <div className="absolute hidden group-hover:block bg-card p-2 rounded shadow-lg border border-border -top-12 left-1/2 transform -translate-x-1/2 whitespace-nowrap z-10">
                <p className="text-xs font-medium">{region.name} Region</p>
                <p className="text-xs text-muted-foreground">{region.count} active needs</p>
              </div>
            </div>
          </div>
        ))}

        {needs.slice(0, 15).map((need, idx) => (
          <div
            key={need.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
            style={{
              top: `${20 + Math.random() * 60}%`,
              left: `${20 + Math.random() * 60}%`
            }}
            onClick={() => onMarkerClick(need.id)}
          >
            <div className={`w-6 h-6 rounded-full border-2 ${getMarkerColor(need.severity)} flex items-center justify-center hover:scale-125 transition shadow-md`}>
              <MapPin className="w-3 h-3 text-white" />
            </div>
            <div className="absolute hidden group-hover:block bg-card p-2 rounded shadow-lg border border-border -top-20 left-1/2 transform -translate-x-1/2 w-48 z-20">
              <p className="text-xs font-medium text-foreground">{need.title}</p>
              <p className="text-xs text-muted-foreground">{need.location}</p>
              <p className="text-xs text-muted-foreground mt-1">{need.severity} | {need.affectedPeople} affected</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 p-3 bg-primary/10 rounded border border-primary/20">
        <p className="text-sm text-blue-900">
          <span className="font-semibold">Hotspot Alert:</span> Northern and Eastern regions showing highest concentration of critical needs
        </p>
      </div>
    </div>
  );
}
