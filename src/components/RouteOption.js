// src/components/RouteOption.jsx
import React from 'react';
import { Clock, AlertTriangle } from 'lucide-react';

const RouteOption = ({ route, isSelected, onClick }) => {
  const getTubeLineColor = (lineName) => {
    const colors = {
      'Jubilee': 'bg-gray-500',
      'Central': 'bg-red-600',
      'District': 'bg-green-600',
      'Northern': 'bg-black',
      'DLR': 'bg-teal-500'
      // Add more line colors as needed
    };
    return colors[lineName] || 'bg-blue-500';
  };

  return (
    <div
      className={`p-4 border-b border-gray-200 cursor-pointer transition-all ${
        isSelected ? 'bg-blue-50' : 'hover:bg-gray-50'
      }`}
      onClick={onClick}
    >
      {/* Header with duration and changes */}
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-gray-600" />
          <span className="font-medium">{route.duration} min</span>
          {route.changes > 0 && (
            <span className="text-sm text-gray-500">
              • {route.changes} {route.changes === 1 ? 'change' : 'changes'}
            </span>
          )}
        </div>
        {route.disruptions.length > 0 && (
          <AlertTriangle className="w-4 h-4 text-amber-500" />
        )}
      </div>

      {/* Route visualization */}
      <div className="flex items-center gap-1 my-4">
        {route.legs.map((leg, idx) => (
          <React.Fragment key={idx}>
            <div className={`w-2 h-2 rounded-full ${
              idx === 0 ? 'bg-green-500' :
              idx === route.legs.length - 1 ? 'bg-red-500' :
              getTubeLineColor(leg.lineName)
            }`} />
            {idx < route.legs.length - 1 && (
              <div className={`flex-1 h-0.5 ${
                leg.mode === 'tube' ? getTubeLineColor(leg.lineName) :
                leg.mode === 'walking' ? 'bg-gray-300 border-t border-dashed' :
                'bg-gray-300'
              }`} />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Journey details */}
      <div className="space-y-2">
        {route.legs.map((leg, idx) => (
          <div key={idx} className="text-sm">
            <div className="flex items-center gap-2">
              {leg.mode === 'tube' && '🚇'}
              {leg.mode === 'bus' && '🚌'}
              {leg.mode === 'walking' && '🚶'}
              <span className="font-medium">
                {leg.mode === 'tube' && leg.lineName}
                {leg.mode === 'bus' && `Bus ${leg.lineNumber}`}
                {leg.mode === 'walking' && 'Walk'}
              </span>
              {leg.platform && (
                <span className="text-gray-500">• Platform {leg.platform}</span>
              )}
            </div>
            <div className="text-gray-600 ml-6">
              {leg.departurePoint} → {leg.arrivalPoint}
              <div className="text-xs">
                {leg.departureTime.toLocaleTimeString('en-GB', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
                {' → '}
                {leg.arrivalTime.toLocaleTimeString('en-GB', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Fare and eco info */}
      <div className="mt-3 flex justify-between text-sm">
        <span className="font-medium">
          £{route.fare.toFixed(2)}
        </span>
        <span className="text-green-600">
          🌱 Saves {(0.2 * route.legs.reduce((acc, leg) => acc + leg.distance, 0)).toFixed(1)} kg CO₂
        </span>
      </div>
    </div>
  );
};

export default RouteOption;