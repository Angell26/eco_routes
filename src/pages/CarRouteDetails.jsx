// src/pages/CarRouteDetails.jsx
import React, { useState, useEffect } from 'react';
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
`;

const RouteStep = styled.div`
  padding: 15px;
  background: ${props => props.active ? '#f0f9ff' : 'white'};
  border-radius: 10px;
  margin-bottom: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
  border-left: 4px solid #19A1AA;

  &:hover {
    background: #f0f9ff;
  }
`;

const StepInstruction = styled.div`
  font-size: 14px;
  color: #333;
  margin-bottom: 5px;
`;

const StepDistance = styled.div`
  font-size: 12px;
  color: #666;
`;

const TrafficAlert = styled.div`
  background: ${props => props.severity === 'severe' ? '#fee2e2' : '#fff3e0'};
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 10px;
  font-size: 14px;
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
  &:hover {
    background: #f5f5f5;
  }
`;

const RouteHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const RouteDetails = styled.div`
  display: flex;
  gap: 20px;
  color: #666;
  font-size: 14px;
`;

function CarRouteDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const { start, end } = location.state || {};

  const [route, setRoute] = useState(null);
  const [trafficData, setTrafficData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStep, setSelectedStep] = useState(null);

  useEffect(() => {
    const fetchRoute = async () => {
      if (start && end) {
        try {
          // Fetch route coordinates
          const routeResponse = await fetch(
            `https://api.tfl.gov.uk/Journey/JourneyResults/${encodeURIComponent(start)}/to/${encodeURIComponent(end)}?mode=car&app_key=dc13ae1f39d34686808400ee5dcea8bd`
          );
          const routeData = await routeResponse.json();

          if (routeData.journeys?.[0]) {
            setRoute({
              duration: routeData.journeys[0].duration,
              distance: routeData.journeys[0].distance,
              steps: routeData.journeys[0].legs[0].path.points.map((point, index) => ({
                id: index,
                instruction: `Step ${index + 1}`,
                distance: point.distance || 0,
                location: [point.lat, point.lon]
              }))
            });
          }

          // Fetch traffic data
          const trafficResponse = await fetch(
            `https://api.tfl.gov.uk/Road/all/Status?app_key=dc13ae1f39d34686808400ee5dcea8bd`
          );
          const trafficData = await trafficResponse.json();
          setTrafficData(trafficData);

        } catch (error) {
          console.error('Error fetching route:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchRoute();
  }, [start, end]);

  const startIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  const endIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  if (isLoading) {
    return (
      <PageContainer>
        <div style={{ textAlign: 'center', color: 'white' }}>Loading route...</div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <JourneyCard>
        <SidePanel>
          <BackButton onClick={() => navigate(-1)}>← Back</BackButton>
          
          <RouteHeader>
            <h2>Driving Directions</h2>
            <RouteDetails>
              <span>{route?.duration} mins</span>
              <span>{(route?.distance / 1000).toFixed(1)} km</span>
            </RouteDetails>
          </RouteHeader>

          {trafficData?.some(road => road.statusSeverity !== 'Good') && (
            <TrafficAlert severity="severe">
              Traffic alerts in your route area. Expect delays.
            </TrafficAlert>
          )}

          {route?.steps.map((step, index) => (
            <RouteStep
              key={step.id}
              active={selectedStep?.id === step.id}
              onClick={() => setSelectedStep(step)}
            >
              <StepInstruction>{step.instruction}</StepInstruction>
              <StepDistance>{(step.distance / 1000).toFixed(1)} km</StepDistance>
            </RouteStep>
          ))}
        </SidePanel>

        <MapSection>
          <MapContainer
            center={route?.steps[0]?.location || [51.5074, -0.1278]}
            zoom={13}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; OpenStreetMap contributors'
            />

            {route?.steps[0] && (
              <Marker position={route.steps[0].location} icon={startIcon}>
                <Popup>Start: {start}</Popup>
              </Marker>
            )}

            {route?.steps[route.steps.length - 1] && (
              <Marker 
                position={route.steps[route.steps.length - 1].location} 
                icon={endIcon}
              >
                <Popup>End: {end}</Popup>
              </Marker>
            )}

            {route && (
              <Polyline
                positions={route.steps.map(step => step.location)}
                color="#19A1AA"
                weight={4}
                opacity={0.8}
              />
            )}
          </MapContainer>
        </MapSection>
      </JourneyCard>
    </PageContainer>
  );
}

export default CarRouteDetails;