import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';

// Keyframes for fade-in and fade-out animation
const fadeInOut = keyframes`
  0%, 100% { opacity: 0; transform: scale(0.8); }
  50% { opacity: 1; transform: scale(1); }
`;

// Styled Components
const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f8f9fa;
`;

const LoadingIcon = styled.div`
  font-size: 64px;
  animation: ${fadeInOut} 1.2s ease-in-out infinite; /* Smooth fade animation */
  margin-bottom: 20px;
`;

const LoadingText = styled.div`
  font-size: 20px;
  font-weight: 500;
  color: #19A1AA;
`;

// Array of Transport Mode Icons
const transportIcons = ['🚶‍♂️', '🚲', '🚇', '🚌', '🚗']; // Walking, Cycling, Tube, Bus, Car

function LoadingScreen() {
  const [currentIcon, setCurrentIcon] = useState(0);

  // Cycle through transport icons
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIcon((prev) => (prev + 1) % transportIcons.length);
    }, 1000); // Switch every 1 second
    return () => clearInterval(interval);
  }, []);

  return (
    <LoadingContainer>
      <LoadingIcon>{transportIcons[currentIcon]}</LoadingIcon>
      <LoadingText>Finding the best route...</LoadingText>
    </LoadingContainer>
  );
}

export default LoadingScreen;
