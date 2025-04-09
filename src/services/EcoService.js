// src/services/EcoService.js

class EcoService {
    static get EMISSIONS() {
      return {
        walking: 0,
        cycling: 0,
        bus: {
          electric: 0.03,
          hybrid: 0.05,
          diesel: 0.08
        },
        tube: 0.03,
        car: {
          electric: 0.05,
          hybrid: 0.10,
          petrol: 0.17,
          diesel: 0.15
        }
      };
    }
  
    static calculateCO2(mode, distance, passengerCount = 1) {
      try {
        switch(mode) {
          case 'walk':
          case 'cycling':
            return {
              co2: 0,
              saved: this.EMISSIONS.car.petrol * distance,
              calories: mode === 'walk' ? distance * 60 : distance * 40
            };
  
          case 'tubes':
            const tubeCO2 = this.EMISSIONS.tube * distance;
            return {
              co2: tubeCO2,
              saved: this.EMISSIONS.car.petrol * distance - tubeCO2,
              type: 'public'
            };
  
          case 'drive':
            const carCO2 = this.EMISSIONS.car.petrol * distance / passengerCount;
            return {
              co2: carCO2,
              saved: 0,
              type: 'private'
            };
  
          default:
            throw new Error('Unknown transport mode');
        }
      } catch (error) {
        console.error('CO2 calculation error:', error);
        return null;
      }
    }
  
    static calculateYearlyImpact(weeklyTrips, distance, mode) {
      const yearlyTrips = weeklyTrips * 52;
      const yearlyDistance = distance * yearlyTrips;
      const impact = this.calculateCO2(mode, yearlyDistance);
      
      return {
        ...impact,
        treesNeeded: Math.ceil(impact.co2 / 21),
        yearlyDistance,
        yearlyTrips
      };
    }
  
    static calculateEcoEquivalents(co2Saved) {
      return {
        treeMonths: Math.round(co2Saved * 12 / 21),
        carMiles: Math.round(co2Saved / this.EMISSIONS.car.petrol),
        phoneCharges: Math.round(co2Saved * 1000),
        lightBulbHours: Math.round(co2Saved * 500)
      };
    }
  }
  
  export default EcoService;