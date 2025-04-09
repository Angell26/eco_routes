import axios from 'axios';

// Constants for environmental impact calculation
const CO2_PER_KM = {
  DRIVING: 120, // g/km
  TRANSIT: 40,  // g/km
  WALKING: 0,   // g/km
  CYCLING: 0    // g/km
};

class MapService {
    async getRouteOptions(start, end, mode = 'walk') {
      try {
        const response = await this.getRoute(start, end, mode);
        const path = this.decodePolyline(response.geometry);
        
        // Calculate eco-metrics
        const distance = response.distance / 1000; // km
        const duration = Math.round(response.duration / 60); // minutes
        const calories = this.calculateCalories(distance, mode);
        const co2Saved = this.calculateCO2Savings(distance, mode);
        const ecoScore = this.calculateEcoScore(mode, distance);
  
        return {
          path,
          info: {
            distance: distance.toFixed(1),
            duration,
            calories,
            co2Saved: co2Saved.toFixed(1),
            elevation: response.elevation,
            ecoScore
          }
        };
      } catch (error) {
        console.error('Error calculating route:', error);
        return null;
      }
    }
  
    calculateCalories(distance, mode) {
      const caloriesPerKm = {
        walk: 60,
        bike: 40,
        transit: 0,
        car: 0
      };
      return Math.round(distance * caloriesPerKm[mode]);
    }
  
    calculateCO2Savings(distance, mode) {
      const co2PerKm = {
        walk: 0,
        bike: 0,
        transit: 60,
        car: 120
      };
      return (co2PerKm.car - co2PerKm[mode]) * distance / 1000;
    }
  
    calculateEcoScore(mode, distance) {
      const baseScores = {
        walk: 100,
        bike: 90,
        transit: 70,
        car: 40
      };
      
      return Math.round(baseScores[mode]);
    }
  }

export default new MapService();