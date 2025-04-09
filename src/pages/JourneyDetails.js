// src/pages/JourneyDetails.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import { Clock, ArrowLeft, Train, Bus, PersonStanding } from 'lucide-react';

const JourneyDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { route, mode } = location.state || {};
  const [liveUpdates, setLiveUpdates] = useState(null);

  const getLegIcon = (legType) => {
    switch (legType) {
      case 'tube':
        return <Train className="h-5 w-5" />;
      case 'bus':
        return <Bus className="h-5 w-5" />;
      case 'walking':
        return <Walking className="h-5 w-5" />;
      default:
        return null;
    }
  };

  return (
    <div className="h-screen flex">
      {/* Left Panel */}
      <div className="w-1/3 bg-white border-r border-gray-200 overflow-y-auto">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </button>
          
          <div className="mt-4">
            <div className="text-lg font-semibold">Your Journey</div>
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-gray-500" />
                <span>{route?.duration} mins</span>
              </div>
              {route?.fare && (
                <span className="text-green-600 font-medium">
                  £{route.fare.toFixed(2)}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Journey Steps */}
        <div className="p-4">
          {route?.legs?.map((leg, index) => (
            <div key={index} className="mb-6 relative">
              {/* Connection line */}
              {index < route.legs.length - 1 && (
                <div className="absolute left-6 top-8 bottom-0 w-0.5 bg-gray-200" />
              )}
              
              <div className="flex items-start space-x-4">
                <div className={`p-2 rounded-full ${
                  leg.mode === 'tube' ? 'bg-blue-100 text-blue-600' :
                  leg.mode === 'bus' ? 'bg-green-100 text-green-600' :
                  'bg-gray-100 text-gray-600'
                }`}>
                  {getLegIcon(leg.mode)}
                </div>
                
                <div className="flex-1">
                  <div className="font-medium">
                    {leg.mode === 'tube' && `${leg.lineName} line`}
                    {leg.mode === 'bus' && `Bus ${leg.lineNumber}`}
                    {leg.mode === 'walking' && <PersonStanding className="h-5 w-5" />}
                    </div>
                  
                  <div className="text-sm text-gray-600 mt-1">
                    {leg.departurePoint} → {leg.arrivalPoint}
                  </div>
                  
                  {leg.platform && (
                    <div className="text-sm text-gray-500 mt-1">
                      Platform {leg.platform}
                    </div>
                  )}
                  
                  <div className="text-sm text-gray-500 mt-1">
                    {new Date(leg.departureTime).toLocaleTimeString('en-GB', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                    {' → '}
                    {new Date(leg.arrivalTime).toLocaleTimeString('en-GB', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>

                  {leg.disruptions?.length > 0 && (
                    <div className="mt-2 p-2 bg-amber-50 text-amber-700 rounded text-sm">
                      {leg.disruptions[0].description}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Map Panel */}
      <div className="flex-1">
        <MapContainer
          center={[51.505, -0.09]}
          zoom={13}
          className="h-full w-full"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          
          {route?.legs?.map((leg, index) => (
            <Polyline
              key={index}
              positions={leg.coordinates || []}
              color={
                leg.mode === 'tube' ? '#1d4ed8' :
                leg.mode === 'bus' ? '#059669' :
                '#6b7280'
              }
              weight={4}
              opacity={0.8}
            />
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default JourneyDetails;