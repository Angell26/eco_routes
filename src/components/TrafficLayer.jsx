// src/components/TrafficLayer.jsx
import React, { useEffect, useState } from 'react';
import { Polyline, Popup, useMap } from 'react-leaflet';
import styled from 'styled-components';

const TrafficPopup = styled.div`
  .header {
    font-weight: bold;
    margin-bottom: 8px;
  }
  
  .status {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 4px;
  }
  
  .dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
  }
`;

const TrafficLayer = ({ trafficData, onTrafficUpdate }) => {
  const map = useMap();
  const [roadCoordinates, setRoadCoordinates] = useState({});

  // Function to get color based on traffic status
  const getTrafficColor = (status) => {
    switch (status) {
      case 'Severe':
        return '#d32f2f';
      case 'Serious':
        return '#f44336';
      case 'Moderate':
        return '#ff9800';
      case 'Minor Delays':
        return '#ffc107';
      case 'Good':
      case 'Normal':
        return '#4caf50';
      default:
        return '#757575';
    }
  };

  useEffect(() => {
    const fetchRoadCoordinates = async () => {
      try {
        const coordinates = {};
        for (const road of trafficData) {
          // Real TfL API endpoint for road coordinates
          const response = await fetch(
            `https://api.tfl.gov.uk/Road/${road.id}/Route/Sequence/outbound?app_key=dc13ae1f39d34686808400ee5dcea8bd`
          );
          const data = await response.json();
          
          if (data && data.lineString) {
            coordinates[road.id] = data.lineString.map(coord => [coord[1], coord[0]]);
          }
        }
        setRoadCoordinates(coordinates);
      } catch (error) {
        console.error('Error fetching road coordinates:', error);
      }
    };

    if (trafficData && trafficData.length > 0) {
      fetchRoadCoordinates();
    }
  }, [trafficData]);

  // Set up real-time updates
  useEffect(() => {
    const updateInterval = setInterval(() => {
      onTrafficUpdate && onTrafficUpdate();
    }, 300000); // Update every 5 minutes

    return () => clearInterval(updateInterval);
  }, [onTrafficUpdate]);

  return (
    <>
      {trafficData.map(road => {
        const coordinates = roadCoordinates[road.id];
        if (!coordinates) return null;

        return (
          <Polyline
            key={road.id}
            positions={coordinates}
            pathOptions={{
              color: getTrafficColor(road.status),
              weight: 5,
              opacity: 0.7
            }}
          >
            <Popup>
              <TrafficPopup>
                <div className="header">{road.name}</div>
                <div className="status">
                  <div 
                    className="dot" 
                    style={{ background: getTrafficColor(road.status) }}
                  />
                  {road.status}
                </div>
                <div>{road.description}</div>
                {road.disruption && (
                  <div style={{ marginTop: '8px', color: '#d32f2f' }}>
                    {road.disruption}
                  </div>
                )}
              </TrafficPopup>
            </Popup>
          </Polyline>
        );
      })}
    </>
  );
};

export default TrafficLayer;