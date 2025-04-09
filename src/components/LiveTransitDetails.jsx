// src/components/TransitDetails.jsx
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const TransitContainer = styled.div`
  background: white;
  border-radius: 12px;
  padding: 15px;
  margin-top: 15px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
`;

const JourneySection = styled.div`
  margin: 10px 0;
  padding: 10px;
  border-left: 3px solid #19A1AA;
`;

const StationInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 5px 0;
`;

const PlatformBadge = styled.span`
  background: #e8f5e9;
  color: #2e7d32;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
`;

const LineStatus = styled.div`
  padding: 8px;
  margin: 5px 0;
  background: ${props => props.hasDisruption ? '#fff3e0' : '#f5f5f5'};
  border-radius: 4px;
  font-size: 14px;
`;

const TimeInfo = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  margin-top: 5px;
  color: #666;
  font-size: 14px;
`;

const LiveTransitDetails = ({ journey, start, end }) => {
  const [liveUpdates, setLiveUpdates] = useState(null);
  const [lineStatuses, setLineStatuses] = useState([]);

  useEffect(() => {
    const fetchLiveUpdates = async () => {
      try {
        // TfL API for live departure board
        const response = await fetch(
          `https://api.tfl.gov.uk/Line/${journey.line}/Arrivals?app_key=dc13ae1f39d34686808400ee5dcea8bd`
        );
        const data = await response.json();
        setLiveUpdates(data);
      } catch (error) {
        console.error('Error fetching live updates:', error);
      }
    };

    const fetchLineStatuses = async () => {
      try {
        // TfL API for line status
        const response = await fetch(
          `https://api.tfl.gov.uk/Line/${journey.line}/Status?app_key=dc13ae1f39d34686808400ee5dcea8bd`
        );
        const data = await response.json();
        setLineStatuses(data);
      } catch (error) {
        console.error('Error fetching line status:', error);
      }
    };

    fetchLiveUpdates();
    fetchLineStatuses();

    // Refresh every 30 seconds
    const interval = setInterval(fetchLiveUpdates, 30000);
    return () => clearInterval(interval);
  }, [journey.line]);

  const getNextDepartures = () => {
    if (!liveUpdates) return [];
    return liveUpdates
      .filter(update => update.stationName === journey.departure)
      .sort((a, b) => new Date(a.expectedArrival) - new Date(b.expectedArrival))
      .slice(0, 3);
  };

  return (
    <TransitContainer>
      <h4>Journey Details</h4>
      
      {journey.legs.map((leg, index) => (
        <JourneySection key={index}>
          <StationInfo>
            <div>
              <strong>{leg.departure}</strong>
              {leg.platform && (
                <PlatformBadge>Platform {leg.platform}</PlatformBadge>
              )}
            </div>
            <TimeInfo>
              {leg.departureTimes?.scheduled && (
                <span>Scheduled: {leg.departureTimes.scheduled}</span>
              )}
              {leg.departureTimes?.expected && (
                <span>Expected: {leg.departureTimes.expected}</span>
              )}
            </TimeInfo>
          </StationInfo>

          {leg.mode === 'tube' && (
            <>
              <LineStatus 
                hasDisruption={lineStatuses.some(s => s.statusSeverity > 5)}
              >
                {lineStatuses.map(status => (
                  <div key={status.id}>
                    {status.statusSeverityDescription}
                  </div>
                ))}
              </LineStatus>

              <div style={{ margin: '10px 0' }}>
                Next departures:
                {getNextDepartures().map((departure, idx) => (
                  <div key={idx}>
                    {new Date(departure.expectedArrival).toLocaleTimeString()}
                  </div>
                ))}
              </div>
            </>
          )}

          <StationInfo>
            <div>
              <strong>{leg.arrival}</strong>
              {leg.arrivalPlatform && (
                <PlatformBadge>Platform {leg.arrivalPlatform}</PlatformBadge>
              )}
            </div>
            {leg.arrivalTime && (
              <TimeInfo>
                <span>Arrival: {leg.arrivalTime}</span>
              </TimeInfo>
            )}
          </StationInfo>
        </JourneySection>
      ))}
    </TransitContainer>
  );
};

export default LiveTransitDetails;