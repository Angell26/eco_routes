import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { TransportService } from '../services/TransportService';
import WeatherService from '../services/WeatherService';
import EcoService from '../services/EcoService';
import TrafficService from '../services/TrafficService';
import TrafficConditions from '../components/TrafficConditions';
import TrafficLayer from '../components/TrafficLayer';
import TaxiFareService from '../services/TaxiFareService';
import TflFareService from '../services/TflFareService';
import TflFareCalculator from '../services/TflFareCalculator';
import LoadingScreen from '../components/LoadingScreen';

const PageContainer = styled.div`
  display: flex;
  height: 100vh;
`;

const Sidebar = styled.div`
  width: 350px;
  background: #f8f9fa;
  padding: 20px;
  overflow-y: auto;
`;

const MapArea = styled.div`
  flex: 1;
  height: 100%;
`;

const ContentBox = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  margin-bottom: 20px;
  overflow: hidden;
`;

const BackButton = styled.button`
  color: #19A1AA;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
  padding: 0;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  
  &:hover {
    text-decoration: underline;
  }
`;

const LocationBox = styled(ContentBox)`
  padding: 0;
`;

const LocationField = styled.div`
  display: flex;
  align-items: center;
  padding: 15px;
  border-bottom: 1px solid #eee;

  &:last-child {
    border-bottom: none;
  }
`;
const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  font-size: 18px;
  color: #19A1AA;
`;
const LocationLabel = styled.span`
  color: #19A1AA;
  font-weight: 600;
  width: 60px;
`;

const LocationValue = styled.span`
  color: #333;
  flex: 1;
`;

const TransportModeRow = styled(ContentBox)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
`;

const ModeOption = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: all 0.2s ease;

  ${props => props.active === 'true' && `
    color: #19A1AA;
    background: rgba(25, 161, 170, 0.1);
  `}

  &:hover {
    background: ${props => props.active === 'true' ? 'rgba(25, 161, 170, 0.1)' : 'rgba(0, 0, 0, 0.05)'};
  }
`;


const ModeIcon = styled.div`
  font-size: 24px;
  margin-bottom: 4px;
`;

const ModeDuration = styled.div`
  font-weight: 600;
  font-size: 16px;
  color: ${props => props.active ? '#19A1AA' : '#333'};
`;

const ModeMetrics = styled.div`
  font-size: 12px;
  color: #666;
`;

const EcoImpact = styled.div`
  background: #e8f5e9;
  color: #2e7d32;
  padding: 12px;
  border-radius: 8px;
  text-align: center;
  font-size: 14px;
`;

const TransitDetails = styled(ContentBox)`
  padding: 15px;
  margin-top: 15px;
`;

const TransitLeg = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #eee;
  
  &:last-child {
    border-bottom: none;
  }
`;

const LineBadge = styled.span`
  background: #19A1AA;
  color: white;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  margin-right: 8px;
`;
const RouteSuggestions = styled(ContentBox)`
  margin-top: 15px;
`;

const RouteOption = styled.div`
  padding: 15px;
  border-bottom: 1px solid #eee;
  cursor: pointer;
  transition: all 0.2s ease;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: rgba(25, 161, 170, 0.05);
  }

  ${props => props.selected && `
    background: rgba(25, 161, 170, 0.1);
  `}
`;

const RouteHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const RouteModeBadges = styled.div`
  display: flex;
  gap: 8px;
`;

const ModeBadge = styled.span`
  background: ${props => props.isTransit ? '#19A1AA' : '#e8f5e9'};
  color: ${props => props.isTransit ? 'white' : '#2e7d32'};
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const RouteTiming = styled.div`
  color: #666;
  font-size: 14px;
`;

const RouteMetrics = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 8px;
  font-size: 14px;
  color: #666;
`;

const EcoMetric = styled.div`
  color: #2e7d32;
  display: flex;
  align-items: center;
  gap: 4px;
`;
const TrafficInfo = styled(ContentBox)`
  margin-top: 15px;
  padding: 15px;
`;

const TrafficStatus = styled.div`
  display: flex;
  align-items: center;
  padding: 8px 0;
  color: ${props => props.severity === 'Good' ? '#2e7d32' : '#d32f2f'};
`;
// Add these styled components with your other styled components
const WeatherBox = styled(ContentBox)`
  padding: 15px;
  margin-bottom: 15px;
`;

const WeatherInfo = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const WeatherMain = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const WeatherDetails = styled.div`
  font-size: 14px;
  color: #666;
  text-align: right;
`;

const WeatherIcon = styled.img`
  width: 50px;
  height: 50px;
`;

const Temperature = styled.div`
  font-size: 24px;
  font-weight: 500;
  color: #333;
`;
const EcoDetailsBox = styled(ContentBox)`
  margin-top: 15px;
  padding: 15px;
`;

const EcoMetricGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
  margin-top: 10px;
`;

const EcoMetricCard = styled.div`
  background: #e8f5e9;
  padding: 12px;
  border-radius: 8px;
  text-align: center;

  h4 {
    color: #2e7d32;
    margin: 0 0 5px 0;
  }

  p {
    margin: 0;
    font-size: 14px;
    color: #1b5e20;
  }
`;
const TrafficAlert = styled(ContentBox)`
  padding: 15px;
  margin-top: 15px;
  background: ${props => props.severity === 'Good' ? '#e8f5e9' : '#ffebee'};
  color: ${props => props.severity === 'Good' ? '#2e7d32' : '#c62828'};
`;
const AlertBadge = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  background: #fff;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  z-index: 1000;
  animation: slideIn 0.3s ease;
  max-width: 300px;

  @keyframes slideIn {
    from { transform: translateX(100%); }
    to { transform: translateX(0); }
  }
`;
// Create custom marker icons
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

function RouteDetails() {
    const navigate = useNavigate();
    const location = useLocation();
    const { start, end } = location.state || {};
    
    // Existing state
    const [selectedMode, setSelectedMode] = useState('walk');
    const [coordinates, setCoordinates] = useState({ start: null, end: null });
    const [routeMetrics, setRouteMetrics] = useState(null);
    const [transitData, setTransitData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [routes, setRoutes] = useState([]);
    const [selectedRoute, setSelectedRoute] = useState(null);
    const [trafficData, setTrafficData] = useState(null);
    const [debug, setDebug] = useState({});
    const [weatherData, setWeatherData] = useState(null);
    const [showAlert, setShowAlert] = useState(false);
    const [fareInfo, setFareInfo] = useState(null);
    const [data, setData] = useState(null); // To store fetched data
    useEffect(() => {
      const fetchData = async () => {
        setIsLoading(true);
        try {
          // Example: Fetch route data or any relevant data here
          const response = await fetch('https://api.tfl.gov.uk/data'); // Replace with your actual API URL
          const result = await response.json();
          setData(result); // Store the fetched data
        } catch (error) {
          console.error('Error fetching data:', error);
        } finally {
          setIsLoading(false); // Stop loading
        }
      };
    
      fetchData();
    }, []); // Runs only once when the component mounts
    
// Add right after your routes state declaration
useEffect(() => {
    console.log('Current routes:', routes);
    console.log('Selected mode:', selectedMode);
  }, [routes, selectedMode]);
  const transportModes = [
    { 
      id: 'walk', 
      label: 'Walk',
      icon: '🚶‍♂️',
      speed: 4.8,
      caloriesPerKm: 60
    },
    { 
      id: 'cycle', 
      label: 'Cycle',
      icon: '🚲',
      speed: 15,
      caloriesPerKm: 40
    },
    { 
      id: 'tubes', 
      label: 'Tubes',
      icon: '🚇',
      speed: 30,
      getFare: async () => {
        try {
            const journeyOptions = await TflFareCalculator.getJourneyOptions(start, end);
            return {
                current: journeyOptions.currentFare,
                peak: journeyOptions.peakFare,
                offPeak: journeyOptions.offPeakFare,
                dailyCap: journeyOptions.dailyCap,
                zones: journeyOptions.zones
            };
        } catch (error) {
            console.error('Error calculating fare:', error);
            return null;
        }
    }
},
    {
      id: 'bus',
      label: 'Bus',
      icon: '🚌',
      speed: 20,
      getFare: () => ({
        single: 1.75,
        hopper: true,
        dailyCap: 5.25
      })
    },
    { 
      id: 'drive', 
      label: 'Drive',
      icon: '🚗',
      speed: 40,
      pricePerKm: 0.5
    }
  ];
  const calculateTubeFare = async (start, end) => {
    try {
      const journeyOptions = await TflFareCalculator.getJourneyOptions(start, end);
      
      return {
        current: journeyOptions.currentFare,
        peak: journeyOptions.peakFare,
        offPeak: journeyOptions.offPeakFare,
        dailyCap: journeyOptions.dailyCap,
        zones: journeyOptions.zones
      };
    } catch (error) {
      console.error('Error getting fare:', error);
      return null;
    }
  };
  
  // Example usage in your component
  useEffect(() => {
    const fetchFareInfo = async () => {
        if (selectedMode === 'tubes' && start && end) {
            try {
                const mode = transportModes.find(m => m.id === 'tubes');
                const fare = await mode.getFare();
                setFareInfo(fare);
            } catch (error) {
                console.error('Error fetching fare info:', error);
            }
        }
    }; 

    fetchFareInfo();
}, [selectedMode, start, end]);

  const geocodeLocation = async (location) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(location)},London,UK&format=json&limit=1`
      );
      const data = await response.json();
      if (data.length > 0) {
        return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
      }
      return null;
    } catch (error) {
      console.error('Geocoding error:', error);
      return null;
    }
  };
  useEffect(() => {
    const fetchTrafficData = async () => {
      if (selectedMode === 'drive') {
        try {
          const traffic = await TrafficService.getTrafficStatus();
          setTrafficData(traffic);
        } catch (error) {
          console.error('Error fetching traffic:', error);
        }
      }
    };
  
    fetchTrafficData();
  }, [selectedMode]);
  useEffect(() => {
    const fetchWeather = async () => {
      if (coordinates.start) {
        try {
          const weather = await WeatherService.getWeather(
            coordinates.start[0],
            coordinates.start[1]
          );
          setWeatherData(weather);
        } catch (error) {
          console.error('Weather fetch error:', error);
        }
      }
    };
  
    fetchWeather();
  }, [coordinates.start]);
  const handleTubeSelect = () => {
    navigate('/tube-journey', {
      state: {
        start,
        end
      }
    });
  };

  // Add handleBusSelect here
const handleBusSelect = () => {
  navigate('/bus-journey', {
    state: {
      start,
      end
    }
  });
};
const handleCarSelect = () => {
  navigate('/car-journey', {
    state: {
      start,
      end
    }
  });
};
  const calculateDistance = (coord1, coord2) => {
    const R = 6371; // Earth's radius in km
    const lat1 = coord1[0] * Math.PI / 180;
    const lat2 = coord2[0] * Math.PI / 180;
    const lon1 = coord1[1] * Math.PI / 180;
    const lon2 = coord2[1] * Math.PI / 180;

    const dLat = lat2 - lat1;
    const dLon = lon2 - lon1;

    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1) * Math.cos(lat2) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };
  useEffect(() => {
    console.log('Current state:', {
      selectedMode,
      coordinates,
      routeMetrics,
      transitData,
      trafficData
    });
  }, [selectedMode, coordinates, routeMetrics, transitData, trafficData]);
  
  useEffect(() => {
    const fetchData = async () => {
      if (start && end) {
        setIsLoading(true);
        try {
          const startCoords = await geocodeLocation(start);
          const endCoords = await geocodeLocation(end);
  
          if (startCoords && endCoords) {
            setCoordinates({
              start: startCoords,
              end: endCoords
            });
  
            const distance = calculateDistance(startCoords, endCoords);
   if (selectedMode === 'drive') {
            try {
              const trafficResponse = await TrafficService.getTrafficStatus();
              console.log('Traffic response:', trafficResponse);
              
              if (Array.isArray(trafficResponse) && trafficResponse.length > 0) {
                setTrafficData(trafficResponse);
                
                // Calculate average traffic impact
                const avgImpact = trafficResponse.reduce((acc, road) => 
                  acc + road.impact, 0) / trafficResponse.length;
                
                // Adjust duration based on traffic
                const adjustedDuration = Math.round((distance / transportModes.find(m => m.id === selectedMode).speed) * 60 * avgImpact);
                setRouteMetrics({
                  distance,
                  duration: adjustedDuration,
                  co2Savings: distance * 0.2,
                  trafficDelay: avgImpact > 1 ? Math.round((avgImpact - 1) * 100) : 0
                });
                return; // Exit early after setting metrics with traffic
              }
            } catch (error) {
              console.error('Traffic fetch error:', error);
            }
          }
            // Transit mode handling
            if (selectedMode === 'tubes') {
              try {
                console.log('Fetching transit data for:', start, end);
                const response = await fetch(
                  `https://api.tfl.gov.uk/Journey/JourneyResults/${encodeURIComponent(start)}/to/${encodeURIComponent(end)}?mode=tube,bus,walking&app_key=dc13ae1f39d34686808400ee5dcea8bd`
                );
                const data = await response.json();
                console.log('TfL response:', data);
  
                if (data?.journeys?.length > 0) {
                  const allRoutes = data.journeys.map(journey => ({
                    id: journey.id || Math.random().toString(),
                    duration: journey.duration,
                    startTime: new Date(journey.startDateTime),
                    arrivalTime: new Date(journey.arrivalDateTime),
                    fare: journey.fare?.totalCost || 2.50,
                    co2: journey.legs.reduce((total, leg) => {
                      const distance = leg.distance?.value || 0;
                      switch (leg.mode.name.toLowerCase()) {
                        case 'tube': return total + (distance * 0.03);
                        case 'bus': return total + (distance * 0.08);
                        default: return total;
                      }
                    }, 0),
                    legs: journey.legs.map(leg => ({
                      mode: leg.mode.name.toLowerCase(),
                      duration: leg.duration,
                      distance: leg.distance?.value || 0,
                      lineNumber: leg.instruction?.detailed || leg.routeOptions?.[0]?.lineNumber || '',
                      departure: leg.departurePoint?.commonName || '',
                      arrival: leg.arrivalPoint?.commonName || ''
                    }))
                  }));
  
                  console.log('Processed routes:', allRoutes);
                  setRoutes(allRoutes);
                  setSelectedRoute(allRoutes[0]);
  
                  const primaryRoute = allRoutes[0];
                  setTransitData({
                    duration: primaryRoute.duration,
                    startTime: primaryRoute.startTime.toLocaleTimeString('en-GB', {
                      hour: '2-digit',
                      minute: '2-digit'
                    }),
                    fare: primaryRoute.fare,
                    legs: primaryRoute.legs
                  });
                }
              } catch (error) {
                console.error('Transit API Error:', error);
              }
            }
  
            // Drive mode handling with traffic
            if (selectedMode === 'drive') {
                try {
                  const mainRoads = ['A2', 'A20', 'A102', 'A13', 'A11', 'A10'];
                  const response = await fetch(
                    `https://api.tfl.gov.uk/Road/${mainRoads.join(',')}/Status?app_key=dc13ae1f39d34686808400ee5dcea8bd`
                  );
                  const trafficData = await response.json();
                  console.log('Traffic data:', trafficData);
                  
                  // Process and set traffic data
                  const processedTraffic = trafficData.map(road => ({
                    id: road.id,
                    name: road.displayName,
                    status: road.statusSeverity,
                    description: road.statusSeverityDescription,
                    disruption: road.disruptions?.[0]?.description || null
                  }));
                  
                  setTrafficData(processedTraffic);
                
                  if (processedTraffic.some(road => road.status !== 'Good')) {
                    setShowAlert(true);
                    setTimeout(() => setShowAlert(false), 5000);
                  }
              
                  // Adjust route duration based on traffic
                  const trafficDelay = processedTraffic.some(road => 
                    road.status !== 'Good' && road.status !== 'Normal'
                  ) ? 1.3 : 1; // 30% longer if there's traffic
                  
                  const adjustedDuration = Math.round((distance / transportModes.find(m => m.id === 'drive').speed) * 60 * trafficDelay);
                  setRouteMetrics(prev => ({
                    ...prev,
                    duration: adjustedDuration,
                    traffic: processedTraffic.map(r => r.status).join(', ')
                  }));
                } catch (error) {
                  console.error('Traffic API Error:', error);
                }
              } 
              else {
              // Non-driving modes
              setRouteMetrics({
                distance,
                duration: Math.round((distance / transportModes.find(m => m.id === selectedMode).speed) * 60),
                co2Savings: distance * 0.2
              });
            }
          }
        } catch (error) {
          console.error('Error loading data:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };
  
    fetchData();
  }, [start, end, selectedMode]);
  
  if (!location.state) {
    return (
      <div style={{ padding: '20px' }}>
        <h2>No route information provided</h2>
        <button onClick={() => navigate('/plan')}>Back to Route Planner</button>
      </div>
    );
  }
  
  const FareDisplay = ({ fareInfo }) => {
    if (!fareInfo) return null;
    
    return (
      <div>
        <div>Current Fare: £{fareInfo.current.toFixed(2)}</div>
        <div>
          <small>
            Peak: £{fareInfo.peak.toFixed(2)} / Off-peak: £{fareInfo.offPeak.toFixed(2)}
          </small>
        </div>
        <div>Daily Cap: £{fareInfo.dailyCap.toFixed(2)}</div>
        <div>Zones: {fareInfo.zones.from} to {fareInfo.zones.to}</div>
      </div>
    );
  };
  if (isLoading) {
    return <LoadingScreen />;
  }
  
  return (
    <PageContainer>
      <Sidebar>
        <BackButton onClick={() => navigate('/plan')}>← Back</BackButton>

        <LocationBox>
          <LocationField>
            <LocationLabel>Start</LocationLabel>
            <LocationValue>{start}</LocationValue>
          </LocationField>
          <LocationField>
            <LocationLabel>End</LocationLabel>
            <LocationValue>{end}</LocationValue>
          </LocationField>
        </LocationBox>
        {weatherData && (
  <WeatherBox>
    <WeatherInfo>
      <WeatherMain>
        <WeatherIcon src={weatherData.icon} alt={weatherData.condition} />
        <div>
          <Temperature>{weatherData.temperature}°C</Temperature>
          <div>{weatherData.description}</div>
        </div>
      </WeatherMain>
      <WeatherDetails>
        <div>Feels like {weatherData.feels_like}°C</div>
        <div>Wind: {weatherData.wind.speed} mph</div>
        <div>Humidity: {weatherData.humidity}%</div>
      </WeatherDetails>
    </WeatherInfo>
  </WeatherBox>
)}
   <TransportModeRow>
            {transportModes.map((mode) => {
                const metrics = routeMetrics ? {
                    duration: mode.id === 'tubes' && transitData ? 
                        transitData.duration : 
                        Math.round((routeMetrics.distance / mode.speed) * 60),
                    calories: mode.caloriesPerKm ? 
                        Math.round(routeMetrics.distance * mode.caloriesPerKm) : 
                        null,
                    price: mode.id === 'tubes' ? 
                        fareInfo || { current: null, peak: null, offPeak: null, dailyCap: null } :
                        mode.id === 'bus' ? 
                            { single: 1.75, dailyCap: 5.25, hopper: true } :
                        mode.pricePerKm ? 
                            Number((routeMetrics.distance * mode.pricePerKm).toFixed(2)) : 
                            null
                } : null;

                return (
                  <ModeOption
  key={mode.id}
  active={selectedMode === mode.id}
  onClick={() => {
    if (mode.id === 'tubes') {
      handleTubeSelect();
    } else if (mode.id === 'bus') {
      handleBusSelect();
    }  else if (mode.id === 'drive') {  // Add this condition
        handleCarSelect();   
    } else {
      setSelectedMode(mode.id);
    }
  }}
>
      <ModeIcon>{mode.icon}</ModeIcon>
      <ModeDuration active={selectedMode === mode.id}>
        {metrics ? `${metrics.duration} min` : '--'}
      </ModeDuration>
      <ModeMetrics>
                        {metrics && mode.caloriesPerKm && `${metrics.calories} cal`}
                        {mode.id === 'tubes' && metrics?.price && (
                            <div>
                                {metrics.price.current ? 
                                    `£${metrics.price.current.toFixed(2)}` : 
                                    'Calculating...'}
                                <div style={{ fontSize: '10px', color: '#666' }}>
                                    {metrics.price.peak && metrics.price.offPeak ? (
                                        <>
                                            Peak: £{metrics.price.peak.toFixed(2)} / 
                                            Off-peak: £{metrics.price.offPeak.toFixed(2)}
                                            <br />
                                            {metrics.price.dailyCap && 
                                                `Daily cap: £${metrics.price.dailyCap.toFixed(2)}`}
                                        </>
                                    ) : 'Loading fares...'}
                                </div>
                            </div>
                        )}
                        {mode.id === 'bus' && metrics?.price && (
                            <div>
                                £{metrics.price.single?.toFixed(2) || '1.75'}
                                <div style={{ fontSize: '10px', color: '#666' }}>
                                    Hopper fare / £{metrics.price.dailyCap?.toFixed(2) || '5.25'} daily cap
                                </div>
                            </div>
                        )}
                        {mode.id === 'drive' && metrics?.price && 
                            `£${typeof metrics.price === 'number' ? 
                                metrics.price.toFixed(2) : 
                                metrics.price}+`}
                    </ModeMetrics>
                </ModeOption>
                );
            })} 
        </TransportModeRow>

        {selectedMode === 'tubes' && routes.length > 0 && (
  <RouteSuggestions>
    {routes.map((route) => (
      <RouteOption 
        key={route.id}
        selected={selectedRoute?.id === route.id}
        onClick={() => setSelectedRoute(route)}
      >
        <RouteOption 
  onClick={() => navigate('/journey', { 
    state: { 
      route: route,
      mode: selectedMode 
    }
  })}
>

</RouteOption>
        <RouteHeader>
          <RouteModeBadges>
            {route.legs.map((leg, idx) => (
              <ModeBadge 
                key={idx}
                isTransit={leg.mode === 'tube' || leg.mode === 'bus'}
              >
                {leg.mode === 'tube' && '🚇'}
                {leg.mode === 'bus' && '🚌'}
                {leg.mode === 'walking' && '🚶'}
                {leg.mode === 'cycling' && '🚲'}
                {leg.lineNumber ? leg.lineNumber : leg.mode}
              </ModeBadge>
            ))}
          </RouteModeBadges>
          <span>{route.duration} min</span>
        </RouteHeader>
        <RouteTiming>
          {route.startTime && `Depart: ${route.startTime.toLocaleTimeString('en-GB', {
            hour: '2-digit',
            minute: '2-digit'
          })}`}
        </RouteTiming>
        <RouteMetrics>
          {route.fare && <span>£{route.fare.toFixed(2)}</span>}
          <EcoMetric>
            🌱 Saves {(0.2 * calculateDistance(coordinates.start, coordinates.end) - route.co2).toFixed(1)} kg CO₂
          </EcoMetric>
        </RouteMetrics>
      </RouteOption>
    ))}
  </RouteSuggestions>
)}
  {selectedMode === 'drive' && trafficData && (
  <TrafficConditions roads={trafficData} />
)}

{selectedMode !== 'drive' && routeMetrics && (
  <EcoImpact>
    Saves {routeMetrics.co2Savings.toFixed(1)} kg CO₂ compared to driving
  </EcoImpact>
)}
     {selectedMode !== 'drive' && routeMetrics && (
  <EcoDetailsBox>
    <EcoImpact>
      Saves {routeMetrics.co2Savings.toFixed(1)} kg CO₂ compared to driving
    </EcoImpact>
    
    <EcoMetricGrid>
      <EcoMetricCard>
        <h4>🌳 Tree Equivalent</h4>
        <p>{EcoService.calculateEcoEquivalents(routeMetrics.co2Savings).treeMonths} months of tree growth</p>
      </EcoMetricCard>
      
      <EcoMetricCard>
        <h4>🚗 Car Miles Saved</h4>
        <p>{EcoService.calculateEcoEquivalents(routeMetrics.co2Savings).carMiles} miles not driven</p>
      </EcoMetricCard>
      
      <EcoMetricCard>
        <h4>📱 Energy Saved</h4>
        <p>Equal to {EcoService.calculateEcoEquivalents(routeMetrics.co2Savings).phoneCharges} phone charges</p>
      </EcoMetricCard>
      
      <EcoMetricCard>
        <h4>💡 Light Bulb Hours</h4>
        <p>{EcoService.calculateEcoEquivalents(routeMetrics.co2Savings).lightBulbHours} hours of LED usage</p>
      </EcoMetricCard>
    </EcoMetricGrid>
  </EcoDetailsBox>
)}
      </Sidebar>

      <MapArea>
  {coordinates.start && coordinates.end && (
    <MapContainer
      center={[
        (coordinates.start[0] + coordinates.end[0]) / 2,
        (coordinates.start[1] + coordinates.end[1]) / 2
      ]}
      zoom={13}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />

      <Marker position={coordinates.start} icon={startIcon}>
        <Popup>Start: {start}</Popup>
      </Marker>

      <Marker position={coordinates.end} icon={endIcon}>
        <Popup>End: {end}</Popup>
      </Marker>

      {selectedMode === 'drive' && trafficData && (
        <TrafficLayer
          trafficData={trafficData}
          onTrafficUpdate={() => {
            const fetchTrafficData = async () => {
              try {
                const traffic = await TrafficService.getTrafficStatus();
                setTrafficData(traffic);
              } catch (error) {
                console.error('Error updating traffic:', error);
              }
            };
            fetchTrafficData();
          }}
        />
      )}

      {selectedMode === 'drive' && trafficData && trafficData.map(road => (
        <Polyline
          key={road.id}
          positions={road.coordinates || []}
          color={road.status === 'Good' ? '#4CAF50' : 
                road.status === 'Minor Delays' ? '#FFC107' : '#f44336'}
          weight={4}
          opacity={0.8}
        >
          <Popup>
            <strong>{road.name}</strong>
            <br />
            Status: {road.status}
            <br />
            {road.description}
          </Popup>
        </Polyline>
      ))}

      <Polyline
        positions={[coordinates.start, coordinates.end]}
        color={selectedMode === 'drive' && trafficData ? 
          trafficData.some(r => r.status !== 'Good') ? '#f44336' : '#4CAF50' 
          : '#19A1AA'}
        weight={4}
        opacity={0.8}
      />
    </MapContainer>
  )}

  {/* Traffic Alert Notification */}
  {showAlert && trafficData && trafficData.some(r => r.status !== 'Good') && (
    <AlertBadge>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
        <strong>Traffic Alert</strong>
        <span
          style={{ cursor: 'pointer' }}
          onClick={() => setShowAlert(false)}
        >
          ✕
        </span>
      </div>
      {trafficData
        .filter(r => r.status !== 'Good')
        .map(road => (
          <div key={road.id} style={{ fontSize: '14px', marginBottom: '5px' }}>
            {road.name}: {road.description}
          </div>
        ))}
    </AlertBadge>
  )}
</MapArea>
    </PageContainer>
  );
}

export default RouteDetails;