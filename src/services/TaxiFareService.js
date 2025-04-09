// src/services/TaxiFareService.js
class TaxiFareService {
    static MINIMUM_CHARGE = 3.80;
    
    static TARIFF_RATES = {
      // Rates per mile for different tariffs
      TARIFF_1: { // Mon-Fri 5AM-8PM
        base: 11.60,
        perMile: 3.40
      },
      TARIFF_2: { // Weekday evenings, weekend daytime
        base: 11.60 * 1.2,
        perMile: 3.40 * 1.2
      },
      TARIFF_3: { // Night time and public holidays
        base: 11.60 * 1.4,
        perMile: 3.40 * 1.4
      },
      TARIFF_4: { // Over 6 miles
        base: 11.60,
        perMile: 4.00
      }
    };
  
    static getCurrentTariff(date = new Date()) {
      const hour = date.getHours();
      const day = date.getDay(); // 0 is Sunday, 1-5 are Mon-Fri, 6 is Saturday
  
      // Check if it's a weekday
      if (day >= 1 && day <= 5) {
        // Weekday tariffs
        if (hour >= 5 && hour < 20) {
          return 'TARIFF_1'; // Daytime
        }
        return 'TARIFF_3'; // Night time
      }
      // Weekend tariffs
      if (hour >= 5 && hour < 20) {
        return 'TARIFF_2'; // Weekend daytime
      }
      return 'TARIFF_3'; // Weekend night time
    }
  
    static calculateFare(distance, date = new Date()) {
      if (distance <= 0) return this.MINIMUM_CHARGE;
  
      let fare = this.MINIMUM_CHARGE;
      const tariff = this.getCurrentTariff(date);
      const rates = this.TARIFF_RATES[tariff];
  
      if (distance <= 2) {
        // First 2 miles
        fare = rates.base;
      } else if (distance <= 6) {
        // 2-6 miles
        fare = rates.base + (distance - 2) * rates.perMile;
      } else {
        // Over 6 miles - uses Tariff 4 for the portion over 6 miles
        const firstSixMiles = rates.base + 4 * rates.perMile;
        const remainingMiles = distance - 6;
        fare = firstSixMiles + remainingMiles * this.TARIFF_RATES.TARIFF_4.perMile;
      }
  
      return {
        fare: Math.round(fare * 100) / 100,
        tariff: tariff,
        breakdown: {
          minimumCharge: this.MINIMUM_CHARGE,
          distance: distance,
          baseRate: rates.base,
          additionalDistance: distance > 2 ? distance - 2 : 0,
          additionalRate: rates.perMile
        }
      };
    }
  
    static getEstimatedRange(distance) {
      // Calculate min (Tariff 1) and max (Tariff 3) possible fares
      const minFare = this.calculateFare(distance, new Date('2024-01-01T12:00:00')).fare;
      const maxFare = this.calculateFare(distance, new Date('2024-01-01T02:00:00')).fare;
      
      return {
        min: minFare,
        max: maxFare
      };
    }
  }
  
  export default TaxiFareService;