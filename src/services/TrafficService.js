// src/services/TrafficService.js
class TrafficService {
    static async getTrafficStatus() {
      try {
        // Major London roads
        const roads = ['a406', 'a205', 'a2', 'a20', 'a102', 'a13', 'a12', 'a11', 'a10'];
        const [trafficResponse, disruptionResponse] = await Promise.all([
          fetch(
            `https://api.tfl.gov.uk/Road/${roads.join(',')}/Status?app_key=${TFL_APP_KEY}`
          ),
          fetch(
            `https://api.tfl.gov.uk/Road/all/Disruption?app_key=${TFL_APP_KEY}`
          )
        ]);
  
        const [trafficData, disruptionData] = await Promise.all([
          trafficResponse.json(),
          disruptionResponse.json()
        ]);
  
        if (!Array.isArray(trafficData)) {
          throw new Error('Invalid traffic data received');
        }
  
        // Process and combine traffic and disruption data
        return trafficData.map(road => {
          const roadDisruptions = disruptionData.filter(d => d.roadDisruption.affectedRoads
            .some(ar => ar.id === road.id));
  
          return {
            id: road.id,
            name: road.displayName,
            status: road.statusSeverity,
            description: road.statusSeverityDescription,
            impact: this.calculateTrafficImpact(road.statusSeverity),
            disruptions: roadDisruptions.map(d => ({
              id: d.id,
              category: d.category,
              description: d.description,
              severity: d.severity,
              startTime: d.startDateTime,
              endTime: d.endDateTime
            })),
            lastUpdated: new Date().toISOString()
          };
        });
      } catch (error) {
        console.error('Traffic API Error:', error);
        return [];
      }
    }
  
    static calculateTrafficImpact(severity) {
      const delays = {
        'Good': 1,
        'Normal': 1.1,
        'Minor Delays': 1.3,
        'Moderate': 1.5,
        'Serious': 1.8,
        'Severe': 2
      };
      return delays[severity] || 1;
    }
  
    static async getDetailedRouteTraffic(startCoords, endCoords) {
      try {
        const response = await fetch(
          `https://api.tfl.gov.uk/Journey/JourneyResults/${startCoords.join()}/to/${endCoords.join()}?app_key=${TFL_APP_KEY}`
        );
        const data = await response.json();
  
        return {
          mainRoute: data.journeys[0],
          alternativeRoutes: data.journeys.slice(1),
          trafficImpact: this.calculateRouteTrafficImpact(data.journeys[0])
        };
      } catch (error) {
        console.error('Route traffic error:', error);
        return null;
      }
    }
  
    static calculateRouteTrafficImpact(journey) {
      // Calculate traffic impact based on journey details
      const baselineDuration = journey.duration;
      const actualDuration = this.adjustDurationForTraffic(journey);
      
      return {
        delay: actualDuration - baselineDuration,
        delayPercentage: ((actualDuration - baselineDuration) / baselineDuration) * 100,
        severity: this.getDelaySeverity(actualDuration - baselineDuration)
      };
    }
  
    static adjustDurationForTraffic(journey) {
      // Implement logic to adjust duration based on current traffic conditions
      return journey.duration * (1 + (Math.random() * 0.5)); // Placeholder
    }
  
    static getDelaySeverity(delay) {
      if (delay <= 5) return 'Low';
      if (delay <= 15) return 'Moderate';
      return 'High';
    }
  }
  
  export default TrafficService;