// src/pages/RoutePlanner.js
import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const PlannerContainer = styled.div`
  min-height: 100vh;
  background: #19A1AA;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 20px;
`;

const PlannerCard = styled.div`
  background: white;
  border-radius: 20px;
  width: 100%;
  max-width: 800px;
  padding: 40px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  color: white;
  font-size: 42px;
  margin-bottom: 10px;
  text-align: center;
`;

const Subtitle = styled.p`
  color: white;
  font-size: 18px;
  margin-bottom: 40px;
  text-align: center;
`;

const InputGroup = styled.div`
  position: relative;
  margin-bottom: 20px;
`;

const RouteInput = styled.input`
  width: 100%;
  padding: 15px;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  font-size: 16px;
  outline: none;
  transition: all 0.3s ease;

  &:focus {
    border-color: #19A1AA;
    box-shadow: 0 0 0 2px rgba(25, 161, 170, 0.2);
  }
`;

const SwapButton = styled.button`
  position: absolute;
  right: -50px;
  top: 50%;
  transform: translateY(-50%);
  background: white;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-50%) scale(1.1);
  }
`;

const GoButton = styled.button`
  background: #4CAF50;
  color: white;
  border: none;
  padding: 15px 40px;
  font-size: 18px;
  border-radius: 30px;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 20px;
  width: 100%;

  &:hover {
    background: #45a049;
    transform: translateY(-2px);
  }
`;

const CitySelector = styled.div`
  text-align: center;
  margin-top: 30px;
`;

const CityName = styled.h2`
  color: #333;
  font-size: 24px;
  margin-bottom: 10px;
`;

const SwitchCityButton = styled.button`
  background: rgba(25, 161, 170, 0.1);
  color: #19A1AA;
  border: none;
  padding: 8px 20px;
  border-radius: 20px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(25, 161, 170, 0.2);
  }
`;

const TimeOptions = styled.div`
  display: flex;
  gap: 10px;
  margin: 20px 0;
`;

const TimeButton = styled.button`
  background: ${props => props.active ? '#19A1AA' : 'white'};
  color: ${props => props.active ? 'white' : '#333'};
  border: 1px solid #e0e0e0;
  padding: 8px 15px;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: ${props => props.active ? '#19A1AA' : '#f5f5f5'};
  }
`;

function RoutePlanner() {
  const navigate = useNavigate(); // Add this hook
  const [startLocation, setStartLocation] = useState('');
  const [endLocation, setEndLocation] = useState('');
  const [timeOption, setTimeOption] = useState('now');

  const handleSwapLocations = () => {
    const temp = startLocation;
    setStartLocation(endLocation);
    setEndLocation(temp);
  };

// In RoutePlanner.js where you handle the GO button
const handleSubmit = () => {
  navigate('/details', {
    state: {
      start: startLocation,
      end: endLocation
    }
  });
};
  return (
    <PlannerContainer>
      <Title>Get Me Somewhere</Title>
      <Subtitle>Plan your eco-friendly journey</Subtitle>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <PlannerCard>
          <InputGroup>
            <RouteInput
              placeholder="Start location"
              value={startLocation}
              onChange={(e) => setStartLocation(e.target.value)}
            />
          </InputGroup>

          <InputGroup>
            <RouteInput
              placeholder="End location"
              value={endLocation}
              onChange={(e) => setEndLocation(e.target.value)}
            />
            <SwapButton onClick={handleSwapLocations}>
              ⇅
            </SwapButton>
          </InputGroup>

          <TimeOptions>
            <TimeButton 
              active={timeOption === 'now'} 
              onClick={() => setTimeOption('now')}
            >
              Now
            </TimeButton>
            <TimeButton 
              active={timeOption === 'later'} 
              onClick={() => setTimeOption('later')}
            >
              Later
            </TimeButton>
          </TimeOptions>

          <GoButton onClick={handleSubmit}>GO</GoButton>

          <CitySelector>
            <CityName>London</CityName>
            <SwitchCityButton>Switch City</SwitchCityButton>
          </CitySelector>
        </PlannerCard>
      </motion.div>
    </PlannerContainer>
  );
}

export default RoutePlanner;