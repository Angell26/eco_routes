// src/services/TransportService.js

const TFL_APP_KEY = 'dc13ae1f39d34686808400ee5dcea8bd';

export const TransportService = {
  // Get routes including transit, walking, and cycling options
  async getAllRoutes(start, end) {
    try {
      const transitResponse = await fetch(
        `https://api.tfl.gov.uk/Journey/JourneyResults/${encodeURIComponent(start)}/to/${encodeURIComponent(end)}?app_key=${TFL_APP_KEY}&alternativeWalking=true&alternativeCycling=true`
      );
      const transitData = await transitResponse.json();
      
      const routes = [];

      // Add transit routes
      if (transitData?.journeys) {
        transitData.journeys.forEach(journey => {
          routes.push({
            id: `transit-${routes.length}`,
            type: 'mixed',
            duration: journey.duration,
            startTime: new Date(journey.startDateTime),
            arrivalTime: new Date(journey.arrivalDateTime),
            fare: journey.fare?.totalCost,
            co2: this.calculateCO2(journey),
            legs: journey.legs.map(leg => ({
              mode: leg.mode.name.toLowerCase(),
              duration: leg.duration,
              distance: leg.distance,
              lineNumber: leg.routeOptions?.[0]?.lineNumber,
              lineName: leg.routeOptions?.[0]?.name
            }))
          });
        });
      }

      return routes;
    } catch (error) {
      console.error('Error fetching routes:', error);
      return [];
    }
  },

  // Get road traffic status
  async getRoadStatus() {
    try {
      const mainRoads = ['A2', 'A20', 'A102', 'A13', 'A11', 'A10'];
      const response = await fetch(
        `https://api.tfl.gov.uk/Road/${mainRoads.join(',')}/Status?app_key=${TFL_APP_KEY}`
      );
      const data = await response.json();
      console.log('Traffic data received:', data); // Debug log
      return data;
    } catch (error) {
      console.error('Error fetching road status:', error);
      return null;
    }
  },

  // CO2 calculation helper
  calculateCO2(journey) {
    let totalCO2 = 0;
    journey.legs.forEach(leg => {
      const distance = leg.distance || 0;
      switch(leg.mode.name.toLowerCase()) {
        case 'walking':
        case 'cycling':
          totalCO2 += 0;
          break;
        case 'tube':
          totalCO2 += distance * 0.03;
          break;
        case 'bus':
          totalCO2 += distance * 0.08;
          break;
        default:
          totalCO2 += distance * 0.2;
      }
    });
    return totalCO2;
  }
};