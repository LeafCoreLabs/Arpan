import { useEffect, useRef } from "react";
import { Card } from "./ui/card";
import { MapPin } from "lucide-react";

export default function MapVisualization() {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && mapRef.current) {
      import("leaflet").then((L) => {
        const map = L.map(mapRef.current!).setView([20.5937, 78.9629], 5);

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        const urgentIcon = L.divIcon({
          className: "custom-marker",
          html: `<div style="background-color: #dc2626; width: 24px; height: 24px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
          iconSize: [24, 24],
          iconAnchor: [12, 12]
        });

        const volunteerIcon = L.divIcon({
          className: "custom-marker",
          html: `<div style="background-color: #2563eb; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
          iconSize: [20, 20],
          iconAnchor: [10, 10]
        });

        const completedIcon = L.divIcon({
          className: "custom-marker",
          html: `<div style="background-color: #16a34a; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
          iconSize: [20, 20],
          iconAnchor: [10, 10]
        });

        const urgentCases = [
          { lat: 19.076, lng: 72.8777, title: "Food Shortage - Mumbai", severity: "Critical" },
          { lat: 28.7041, lng: 77.1025, title: "Medical Emergency - Delhi", severity: "Critical" },
          { lat: 22.5726, lng: 88.3639, title: "Medical Emergency - Kolkata", severity: "Critical" }
        ];

        const volunteers = [
          { lat: 12.9716, lng: 77.5946, title: "Volunteer: Amit Patel" },
          { lat: 13.0827, lng: 80.2707, title: "Volunteer: Lakshmi Iyer" },
          { lat: 17.385, lng: 78.4867, title: "Volunteer: Vijay Reddy" }
        ];

        const completed = [
          { lat: 18.5204, lng: 73.8567, title: "Water & Sanitation - Resolved" },
          { lat: 23.0225, lng: 72.5714, title: "Shelter Need - Resolved" }
        ];

        urgentCases.forEach(location => {
          L.marker([location.lat, location.lng], { icon: urgentIcon })
            .addTo(map)
            .bindPopup(`<strong>${location.title}</strong><br>Severity: ${location.severity}`);
        });

        volunteers.forEach(location => {
          L.marker([location.lat, location.lng], { icon: volunteerIcon })
            .addTo(map)
            .bindPopup(`<strong>${location.title}</strong>`);
        });

        completed.forEach(location => {
          L.marker([location.lat, location.lng], { icon: completedIcon })
            .addTo(map)
            .bindPopup(`<strong>${location.title}</strong>`);
        });

        return () => {
          map.remove();
        };
      });
    }
  }, []);

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl flex items-center gap-2">
          <MapPin className="w-5 h-5" />
          Map Visualization
        </h2>
        <div className="flex gap-4 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-red-600 border border-white"></div>
            <span>Urgent Cases</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-primary border border-white"></div>
            <span>Volunteers</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-green-600 border border-white"></div>
            <span>Completed</span>
          </div>
        </div>
      </div>
      <div ref={mapRef} className="h-96 rounded-lg overflow-hidden border"></div>
    </Card>
  );
}
