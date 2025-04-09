import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import landscapeImage from '../assets/hero.png'; 

// Animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

// Styled Components
const PageContainer = styled.div`
  min-height: 100vh;
  background: white;
  overflow-x: hidden;
`;

const Nav = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 40px;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(5px);
  z-index: 100;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const Logo = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: #19A1AA;
`;

const NavLinks = styled.div`
  display: flex;
  gap: 30px;
  align-items: center;

  a {
    text-decoration: none;
    color: #333;
    font-weight: 500;
    transition: color 0.3s ease;

    &:hover {
      color: #19A1AA;
    }
  }
`;

const HeroSection = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  padding: 120px 40px 40px;
  position: relative;
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
`;

const HeroContent = styled.div`
  animation: ${fadeIn} 1s ease-out;

  h1 {
    font-size: 56px;
    color: #004412;
    margin-bottom: 24px;
    line-height: 1.2;
  }

  p {
    font-size: 18px;
    color: #666;
    line-height: 1.6;
    margin-bottom: 32px;
  }
`;

const StartButton = styled.button`
  background: #19A1AA;
  color: white;
  border: none;
  padding: 16px 32px;
  border-radius: 30px;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(25, 161, 170, 0.2);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(25, 161, 170, 0.3);
  }
`;

const ImageContainer = styled.div`
  width: 100%;
  height: 100%;
  animation: ${float} 6s ease-in-out infinite;
  display: flex;
  justify-content: center;
  align-items: center;

  img {
    max-width: 100%;
    height: auto;
  }
`;

const FeaturesSection = styled.div`
  padding: 80px 40px;
  background: #f9f9f9;
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 40px;
  max-width: 1200px;
  margin: 0 auto;
`;

const FeatureCard = styled.div`
  background: white;
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-10px);
  }

  .icon {
    font-size: 40px;
    margin-bottom: 20px;
    color: #19A1AA;
  }

  h3 {
    color: #004412;
    margin-bottom: 15px;
  }

  p {
    color: #666;
    line-height: 1.6;
  }
`;

const features = [
  {
    icon: "🌱",
    title: "Eco-Friendly Routes",
    description: "Find the most sustainable paths with our AI-powered route optimization."
  },
  {
    icon: "🚶‍♂️",
    title: "Multi-Modal Transport",
    description: "Choose between walking, cycling, public transit, or eco-friendly driving options."
  },
  {
    icon: "📊",
    title: "Carbon Impact Tracker",
    description: "Monitor and reduce your carbon footprint with every journey."
  },
  {
    icon: "🌤️",
    title: "Real-Time Updates",
    description: "Get live traffic, weather, and public transport schedule updates."
  },
  {
    icon: "💚",
    title: "Green Points",
    description: "Earn rewards for choosing eco-friendly travel options."
  },
  {
    icon: "📱",
    title: "Smart Notifications",
    description: "Receive alerts about delays, route changes, and better eco alternatives."
  }
];

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <PageContainer>
      <Nav>
        <Logo>Eco Routes</Logo>
        <NavLinks>
          <a href="#features">Features</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
        </NavLinks>
      </Nav>

      <HeroSection>
        <ContentGrid>
          <HeroContent>
            <h1>Smart Green Navigation</h1>
            <p>
              Experience smarter, greener travel with AI-powered route optimization. 
              Reduce your carbon footprint while finding the most efficient paths 
              through real-time traffic and weather integration.
            </p>
            <StartButton onClick={() => navigate('/plan')}>
              Start Journey
            </StartButton>
          </HeroContent>
          <ImageContainer>
  <img 
    src={landscapeImage} 
    alt="Eco-friendly route visualization" 
  />
</ImageContainer>
        </ContentGrid>
      </HeroSection>
      <FeaturesSection>
  <FeaturesGrid>
    {features.map((feature, index) => (
      <FeatureCard key={index}>
        <div className="icon">{feature.icon}</div>
        <h3>{feature.title}</h3>
        <p>{feature.description}</p>
      </FeatureCard>
    ))}
  </FeaturesGrid>
</FeaturesSection>
    </PageContainer>
  );
};

export default LandingPage;