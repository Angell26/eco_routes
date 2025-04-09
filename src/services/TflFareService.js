// src/services/TflFareService.js
class TflFareService {
    static BUS_FARES = {
      singleJourney: 1.75,
      dailyCap: 5.25,
      hopperTimeLimit: 60 // minutes
    };
  
    static TUBE_FARES = {
      zone1: {
        peak: 2.80,
        offPeak: 2.70
      }
    };
  
    static isPeakTime() {
      const now = new Date();
      const hour = now.getHours();
      const day = now.getDay(); // 0 is Sunday
  
      // Check if it's a weekday
      if (day >= 1 && day <= 5) {
        // Monday to Friday peak times: 6:30-9:30 and 16:00-19:00
        return (hour >= 6 && hour < 10) || (hour >= 16 && hour < 19);
      }
      return false; // Weekend is always off-peak
    }
  
    static calculateBusFare(numberOfJourneys = 1, timeSpan = null) {
      // If journeys are within hopper time limit (1 hour), charge only once
      if (timeSpan && timeSpan <= this.BUS_FARES.hopperTimeLimit) {
        return this.BUS_FARES.singleJourney;
      }
  
      // Calculate total fare with daily cap
      const totalFare = numberOfJourneys * this.BUS_FARES.singleJourney;
      return Math.min(totalFare, this.BUS_FARES.dailyCap);
    }
  
    static calculateTubeFare(fromZone = 1, toZone = 1) {
      const isPeak = this.isPeakTime();
      return isPeak ? this.TUBE_FARES.zone1.peak : this.TUBE_FARES.zone1.offPeak;
    }
  
    static getFareEstimate(mode) {
      switch (mode) {
        case 'bus':
          return {
            singleFare: this.BUS_FARES.singleJourney,
            hopperFare: `£${this.BUS_FARES.singleJourney} for unlimited journeys within 1 hour`,
            dailyCap: this.BUS_FARES.dailyCap
          };
        case 'tube':
          const currentFare = this.calculateTubeFare();
          return {
            peak: this.TUBE_FARES.zone1.peak,
            offPeak: this.TUBE_FARES.zone1.offPeak,
            currentFare: currentFare
          };
        default:
          return null;
      }
    }
  }
  
  export default TflFareService;