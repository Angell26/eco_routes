// src/components/TrafficConditions.jsx
import React from 'react';
import styled from 'styled-components';

const TrafficCard = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  margin-top: 15px;
  overflow: hidden;
`;

const CardHeader = styled.div`
  padding: 15px;
  border-bottom: 1px solid #eee;
`;

const CardTitle = styled.h3`
  margin: 0;
  font-size: 16px;
  color: #333;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const CardContent = styled.div`
  padding: 15px;
`;

const StatusContainer = styled.div`
  background: ${props => 
    props.severity === 'low' ? '#e8f5e9' :
    props.severity === 'medium' ? '#fff3e0' : '#ffebee'};
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 16px;
`;

const StatusHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const DelayText = styled.span`
  color: ${props => 
    props.severity === 'low' ? '#2e7d32' :
    props.severity === 'medium' ? '#ef6c00' : '#c62828'};
  font-weight: bold;
`;

const RoadStatus = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px;
  border-bottom: 1px solid #eee;
  &:last-child {
    border-bottom: none;
  }
`;

const StatusDot = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${props => 
    props.status === 'Good' || props.status === 'Normal' ? '#4caf50' :
    props.status === 'Minor Delays' ? '#ff9800' : '#f44336'};
  margin-right: 8px;
`;

const RoadInfo = styled.div`
  display: flex;
  align-items: center;
`;

const RoadName = styled.span`
  font-weight: 500;
  margin-right: 8px;
`;

const RoadDescription = styled.span`
  color: #666;
  font-size: 14px;
`;

const TrafficConditions = ({ roads }) => {
  if (!roads || !Array.isArray(roads) || roads.length === 0) {
    return (
      <TrafficCard>
        <CardHeader>
          <CardTitle>🚗 Traffic Conditions</CardTitle>
        </CardHeader>
        <CardContent>
          <div style={{ color: '#666' }}>
            No traffic data available at the moment
          </div>
        </CardContent>
      </TrafficCard>
    );
  }

  const calculateOverallDelay = (roads) => {
    const impacts = roads.map(road => {
      const delayMap = {
        'Good': 1,
        'Normal': 1.1,
        'Minor Delays': 1.3,
        'Moderate': 1.5,
        'Serious': 1.8,
        'Severe': 2
      };
      return delayMap[road.status] || 1;
    });
    
    const avgImpact = impacts.reduce((sum, impact) => sum + impact, 0) / impacts.length;
    return Math.round((avgImpact - 1) * 100);
  };

  const delay = calculateOverallDelay(roads);
  const severity = delay <= 10 ? 'low' : delay <= 30 ? 'medium' : 'high';

  return (
    <TrafficCard>
      <CardHeader>
        <CardTitle>🚗 Traffic Conditions</CardTitle>
      </CardHeader>
      <CardContent>
        <StatusContainer severity={severity}>
          <StatusHeader>
            <span>Expected Delay:</span>
            <DelayText severity={severity}>{delay}%</DelayText>
          </StatusHeader>
          <div style={{ fontSize: '14px', color: '#666' }}>
            ⏰ Travel time may increase by {delay} minutes
          </div>
        </StatusContainer>

        <div>
          {roads.map(road => (
            <RoadStatus key={road.id}>
              <RoadInfo>
                <StatusDot status={road.status} />
                <RoadName>{road.name}</RoadName>
              </RoadInfo>
              <RoadDescription>{road.description}</RoadDescription>
            </RoadStatus>
          ))}
        </div>
      </CardContent>
    </TrafficCard>
  );
};

export default TrafficConditions;