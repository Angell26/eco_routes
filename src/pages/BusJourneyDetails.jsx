// src/pages/BusJourneyDetails.jsx
import React from 'react';
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const PageContainer = styled.div`
  min-height: 100vh;
  background: #19A1AA;
  padding: 20px;
`;

const JourneyCard = styled.div`
  background: white;
  border-radius: 20px;
  padding: 30px;
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 350px 1fr;
  gap: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
`;

const SidePanel = styled.div`
  border-right: 1px solid #eee;
  padding-right: 20px;
`;

const MapSection = styled.div`
  height: 600px;
  border-radius: 15px;
  overflow: hidden;
`;

const RouteInfo = styled.div`
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  color: #666;
`;

const BusStop = styled.div`
  padding: 15px;
  background: ${props => 
    props.isStart ? '#e8f5e9' :
    props.isEnd ? '#ffebee' :
    props.active ? '#f0f9ff' : 'white'};
  border-radius: 10px;
  margin-bottom: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
  border-left: 4px solid ${props => 
    props.isStart ? '#4CAF50' :
    props.isEnd ? '#f44336' :
    '#2196F3'};

  &:hover {
    background: #f0f9ff;
  }
`;
const StopTime = styled.div`
  font-size: 14px;
  color: #666;
  margin-top: 5px;
`;

const ServiceAlert = styled.div`
  background: ${props => props.severity === 'high' ? '#fee2e2' : '#fff3e0'};
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 10px;
  font-size: 14px;
`;

const LiveIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #16a34a;
  font-size: 14px;
  margin-bottom: 10px;

  &::before {
    content: '';
    width: 8px;
    height: 8px;
    background: #16a34a;
    border-radius: 50%;
    animation: pulse 2s infinite;
  }

  @keyframes pulse {
    0% { opacity: 1; }
    50% { opacity: 0.5; }
    100% { opacity: 1; }
  }
`;

const BusNumber = styled.div`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 10px;
`;

const EstimatedTime = styled.div`
  font-size: 18px;
  color: #666;
  margin-bottom: 20px;
`;

const AlternativeRoutes = styled.div`
  margin-top: 20px;
`;

const AlternativeRoute = styled.div`
  padding: 12px;
  border: 1px solid #eee;
  border-radius: 8px;
  margin-bottom: 10px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #f9fafb;
  }
`;


const BackButton = styled.button`
  background: white;
  border: none;
  padding: 10px 20px;
  border-radius: 20px;
  margin-bottom: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
`;



const RouteHeader = styled.div`
  border-bottom: 1px solid #eee;
  padding-bottom: 20px;
  margin-bottom: 20px;
`;

const RouteName = styled.h2`
  font-size: 24px;
  color: #333;
  margin-bottom: 10px;
`;


const StopName = styled.div`
  font-weight: ${props => props.isMainStop ? 'bold' : 'normal'};
  color: ${props => props.isMainStop ? '#333' : '#666'};
  font-size: ${props => props.isMainStop ? '16px' : '14px'};
`;


const BusInfo = styled.div`
  background: #f5f5f5;
  border-radius: 10px;
  padding: 15px;
  margin: 20px 0;
`;
function BusJourneyDetails() {
    const location = useLocation();
    const navigate = useNavigate();
    const { start, end } = location.state || {};
    
    const [busLocations, setBusLocations] = useState([]);
    const [selectedStop, setSelectedStop] = useState(null);
    const [serviceAlerts, setServiceAlerts] = useState([]);
    const [alternativeRoutes, setAlternativeRoutes] = useState([]);
    const [liveArrivals, setLiveArrivals] = useState({});
  
    // Mock bus route for initial development
    const [busRoute, setBusRoute] = useState({
        number: "188",
        destination: end,
        duration: "45 mins",
        frequency: "Every 6-8 minutes",
        stops: [
          {
            id: "1",
            name: start,
            location: [51.5074, -0.1278],
            timeToArrival: "0 mins",
            platform: "Stop A",
            isStart: true
          },
          {
            id: "2",
            name: "Baker Street",
            location: [51.5226, -0.1571],
            timeToArrival: "10 mins",
            platform: "Stop B",
            isIntermediate: true
          },
          {
            id: "3",
            name: "Oxford Circus",
            location: [51.5152, -0.1418],
            timeToArrival: "20 mins",
            platform: "Stop C",
            isIntermediate: true
          },
          {
            id: "4",
            name: end,
            location: [51.5074, -0.1278],
            timeToArrival: "30 mins",
            platform: "Stop D",
            isEnd: true
          }
        ]
      });
  
      useEffect(() => {
        const fetchBusRoute = async () => {
          if (start && end) {
            try {
              // Get all possible journeys between the locations
              const journeyResponse = await fetch(
                `https://api.tfl.gov.uk/Journey/JourneyResults/${encodeURIComponent(start)}/to/${encodeURIComponent(end)}?mode=bus,walking&app_key=dc13ae1f39d34686808400ee5dcea8bd`
              );
              const journeyData = await journeyResponse.json();
      
              if (journeyData.journeys?.[0]) {
                const journey = journeyData.journeys[0];
                let allStops = [];
                let currentBusNumber = null;
      
                // Process each leg of the journey
                for (const leg of journey.legs) {
                  if (leg.mode.id === 'bus' && leg.routeOptions?.[0]) {
                    const busLine = leg.routeOptions[0].lineId;
                    currentBusNumber = busLine;
                    
                    // Process stops for this bus leg
                    if (Array.isArray(leg.path?.stopPoints)) {
                      leg.path.stopPoints.forEach((stop, idx) => {
                        if (stop) {
                          allStops.push({
                            id: stop.id || `stop-${allStops.length}`,
                            name: stop.name || `Stop ${allStops.length + 1}`,
                            location: [
                              stop.lat || leg.path.points[0][0],
                              stop.lon || leg.path.points[0][1]
                            ],
                            platform: stop.platformName || `Stop ${String.fromCharCode(65 + idx)}`,
                            timeToArrival: `${Math.round(leg.duration * (idx / leg.path.stopPoints.length))} mins`,
                            busNumber: currentBusNumber,
                            isStart: idx === 0 && allStops.length === 0,
                            isEnd: idx === leg.path.stopPoints.length - 1 && 
                                  leg === journey.legs[journey.legs.length - 1],
                            isInterchange: idx === leg.path.stopPoints.length - 1 && 
                                         leg !== journey.legs[journey.legs.length - 1]
                          });
                        }
                      });
                    }
                  } else if (leg.mode.id === 'walking' && leg.path?.points?.length > 0) {
                    allStops.push({
                      id: `walk-${allStops.length}`,
                      name: `Walk to ${leg.arrival || 'next stop'}`,
                      duration: leg.duration || 5,
                      distance: leg.distance || 100,
                      isWalking: true,
                      location: leg.path.points[0]
                    });
                  }
                }
      
                if (allStops.length > 0) {
                  setBusRoute({
                    number: journey.legs
                      .filter(leg => leg.mode.id === 'bus' && leg.routeOptions?.[0])
                      .map(leg => leg.routeOptions[0].lineId)
                      .join(' → ') || 'No direct bus',
                    duration: journey.duration || '0',
                    frequency: "Every 6-8 minutes",
                    stops: allStops,
                    destination: end
                  });
      
                  // Fetch live arrivals for each bus stop
                  allStops
                    .filter(stop => !stop.isWalking)
                    .forEach(stop => fetchStopArrivals(stop.id, stop.busNumber));
                }
              }
            } catch (error) {
              console.error('Error fetching bus route:', error);
            }
          }
        };
      
        fetchBusRoute();
      }, [start, end]);
  
    const fetchStopArrivals = async (stopId, busNumber) => {
        try {
          const response = await fetch(
            `https://api.tfl.gov.uk/StopPoint/${stopId}/Arrivals?app_key=dc13ae1f39d34686808400ee5dcea8bd`
          );
          const data = await response.json();
          
          // Check if data is an array before filtering
          const arrivals = Array.isArray(data) ? data : [];
          
          setLiveArrivals(prev => ({
            ...prev,
            [stopId]: arrivals.filter(arrival => arrival.lineId === busNumber)
          }));
        } catch (error) {
          console.error('Error fetching stop arrivals:', error);
          // Set empty array for this stop if there's an error
          setLiveArrivals(prev => ({
            ...prev,
            [stopId]: []
          }));
        }
      };
  return (
    <PageContainer>
    <JourneyCard>
      <SidePanel>
        <RouteInfo>
          <BusNumber>Bus {busRoute.number}</BusNumber>
          <EstimatedTime>
            Journey time: {busRoute.duration} minutes
          </EstimatedTime>
          <div>Frequency: {busRoute.frequency}</div>
          <LiveIndicator>Live tracking enabled</LiveIndicator>
        </RouteInfo>

        <div>
        {busRoute.stops.map((stop, index) => (
  <BusStop 
    key={stop.id}
    active={selectedStop?.id === stop.id}
    isStart={stop.isStart}
    isEnd={stop.isEnd}
    isInterchange={stop.isInterchange}
    onClick={() => setSelectedStop(stop)}
  >
    {stop.isWalking ? (
      <>
        <div style={{ fontWeight: 'normal' }}>
          🚶‍♂️ {stop.name}
        </div>
        <StopTime>
          {Math.round(stop.duration)} min walk ({(stop.distance / 1000).toFixed(1)} km)
        </StopTime>
      </>
    ) : (
      <>
        <div style={{ 
          fontWeight: stop.isStart || stop.isEnd || stop.isInterchange ? 'bold' : 'normal' 
        }}>
          {stop.name}
          {stop.isStart && ' (Start)'}
          {stop.isEnd && ' (End)'}
          {stop.isInterchange && ' (Change Bus)'}
        </div>
        <div style={{ fontSize: '12px', color: '#19A1AA', marginTop: '4px' }}>
          Bus {stop.busNumber}
        </div>
        <StopTime>
          {liveArrivals[stop.id]?.[0] ? (
            `Next bus: ${Math.floor(liveArrivals[stop.id][0].timeToStation / 60)} mins`
          ) : (
            `Expected: ${stop.timeToArrival}`
          )}
        </StopTime>
        <div style={{ fontSize: '12px', color: '#666' }}>{stop.platform}</div>
      </>
    )}
  </BusStop>
))}
</div>
      </SidePanel>

      <MapSection>
        <MapContainer
          center={busRoute.stops[0]?.location || [51.5074, -0.1278]}
          zoom={13}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; OpenStreetMap contributors'
          />
          
          {busRoute.stops.map((stop, index) => (
            <Marker
              key={stop.id}
              position={stop.location}
              icon={L.divIcon({
                className: 'bus-stop-icon',
                html: `<div style="background: ${index === 0 ? '#4CAF50' : 
                  index === busRoute.stops.length - 1 ? '#f44336' : '#2196F3'}; 
                  width: 12px; height: 12px; border-radius: 50%; border: 2px solid white;"></div>`,
                iconSize: [16, 16]
              })}
            >
              <Popup>
                <strong>{stop.name}</strong>
                <br />
                {stop.platform}
                {liveArrivals[stop.id]?.[0] && (
                  <div>
                    Next bus: {Math.floor(liveArrivals[stop.id][0].timeToStation / 60)} mins
                  </div>
                )}
              </Popup>
            </Marker>
          ))}

          <Polyline
            positions={busRoute.stops.map(stop => stop.location)}
            color="#19A1AA"
            weight={4}
            opacity={0.8}
          />
        </MapContainer>
      </MapSection>
    </JourneyCard>
  </PageContainer>
  );
}

export default BusJourneyDetails;