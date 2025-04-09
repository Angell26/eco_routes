// src/pages/TubeJourneyDetails.jsx
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const PageContainer = styled.div`
  min-height: 100vh;
  background: #19A1AA;
  padding: 20px;
`;

const JourneyCard = styled.div`
  background: white;
  border-radius: 20px;
  padding: 30px;
  max-width: 800px;
  margin: 0 auto;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
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

const JourneyHeader = styled.div`
  border-bottom: 1px solid #eee;
  padding-bottom: 20px;
  margin-bottom: 20px;
`;

const LocationText = styled.div`
  font-size: 24px;
  font-weight: bold;
  margin: 10px 0;
`;

const JourneyStep = styled.div`
  padding: 20px;
  border-radius: 10px;
  background: ${props => props.isTransfer ? '#f5f5f5' : 'white'};
  margin-bottom: 15px;
`;

const TubeLine = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  background: ${props => props.color || '#000'};
  color: white;
  border-radius: 8px;
  margin-bottom: 10px;
`;

const StationInfo = styled.div`
  margin: 15px 0;
  padding-left: 20px;
  border-left: 2px solid #eee;
`;

const TimeInfo = styled.div`
  color: #666;
  font-size: 14px;
`;

function TubeJourneyDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const { start, end } = location.state || {};

  // Mock tube line data - replace with actual TfL API data
  const tubeJourney = {
    duration: '35 mins',
    steps: [
      {
        type: 'START',
        station: start,
        time: '10:00'
      },
      {
        type: 'TUBE',
        line: 'Northern',
        lineColor: '#000000',
        from: start,
        to: 'Bank',
        duration: '15 mins',
        platform: '2',
        direction: 'Southbound'
      },
      {
        type: 'TRANSFER',
        station: 'Bank',
        duration: '5 mins'
      },
      {
        type: 'TUBE',
        line: 'DLR',
        lineColor: '#00A4A7',
        from: 'Bank',
        to: end,
        duration: '12 mins',
        platform: '1',
        direction: 'Eastbound'
      },
      {
        type: 'END',
        station: end,
        time: '10:35'
      }
    ]
  };

  return (
    <PageContainer>
      <JourneyCard>
        <BackButton onClick={() => navigate(-1)}>
          ← Back
        </BackButton>
        
        <JourneyHeader>
          <LocationText>From: {start}</LocationText>
          <LocationText>To: {end}</LocationText>
          <TimeInfo>Journey time: {tubeJourney.duration}</TimeInfo>
        </JourneyHeader>

        {tubeJourney.steps.map((step, index) => (
          <JourneyStep key={index} isTransfer={step.type === 'TRANSFER'}>
            {step.type === 'TUBE' && (
              <>
                <TubeLine color={step.lineColor}>
                  🚇 {step.line} Line
                </TubeLine>
                <StationInfo>
                  <div>From: {step.from}</div>
                  <div>To: {step.to}</div>
                  <TimeInfo>
                    Platform {step.platform} • {step.direction}
                    <br />
                    Journey time: {step.duration}
                  </TimeInfo>
                </StationInfo>
              </>
            )}
            
            {step.type === 'TRANSFER' && (
              <div>
                🚶‍♂️ Change at {step.station}
                <TimeInfo>Walking time: {step.duration}</TimeInfo>
              </div>
            )}

            {(step.type === 'START' || step.type === 'END') && (
              <div>
                {step.type === 'START' ? '🟢' : '🔴'} {step.station}
                <TimeInfo>{step.time}</TimeInfo>
              </div>
            )}
          </JourneyStep>
        ))}
      </JourneyCard>
    </PageContainer>
  );
}

export default TubeJourneyDetails;