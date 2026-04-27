import { Sliders, Power } from 'lucide-react';
import { useState } from 'react';

export function ModelControlPanel() {
  const [weights, setWeights] = useState({
    skill: 35,
    distance: 25,
    availability: 20,
    performance: 20,
  });
  const [autoAssign, setAutoAssign] = useState(true);
  const [minThreshold, setMinThreshold] = useState(70);

  const handleWeightChange = (key: keyof typeof weights, value: number) => {
    setWeights(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="border border-gray-800 rounded-lg p-4 bg-gray-900/50">
      <h3 className="font-semibold mb-4 flex items-center gap-2">
        <Sliders className="w-5 h-5" />
        Model Control Panel
      </h3>

      <div className="space-y-4">
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm text-gray-400">Skill Importance</label>
            <span className="text-sm font-medium">{weights.skill}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={weights.skill}
            onChange={(e) => handleWeightChange('skill', parseInt(e.target.value))}
            className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm text-gray-400">Distance Importance</label>
            <span className="text-sm font-medium">{weights.distance}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={weights.distance}
            onChange={(e) => handleWeightChange('distance', parseInt(e.target.value))}
            className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm text-gray-400">Availability Importance</label>
            <span className="text-sm font-medium">{weights.availability}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={weights.availability}
            onChange={(e) => handleWeightChange('availability', parseInt(e.target.value))}
            className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm text-gray-400">Performance Importance</label>
            <span className="text-sm font-medium">{weights.performance}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={weights.performance}
            onChange={(e) => handleWeightChange('performance', parseInt(e.target.value))}
            className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        <div className="border-t border-gray-800 pt-4">
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm text-gray-400">Auto-Assignment</label>
            <button
              onClick={() => setAutoAssign(!autoAssign)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                autoAssign ? 'bg-green-500' : 'bg-gray-700'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  autoAssign ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm text-gray-400">Min. Match Score Threshold</label>
              <span className="text-sm font-medium">{minThreshold}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={minThreshold}
              onChange={(e) => setMinThreshold(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
