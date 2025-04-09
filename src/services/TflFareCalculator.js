// src/services/TflFareCalculator.js

class TflFareCalculator {
    // Zone-based fare matrix for 2024 (peak/off-peak)
    static ZONE_FARES = {
      'z1-1': { peak: 2.80, offPeak: 2.70 },
      'z1-2': { peak: 3.50, offPeak: 3.00 },
      'z1-3': { peak: 4.30, offPeak: 3.50 },
      'z1-4': { peak: 5.20, offPeak: 3.90 },
      'z1-5': { peak: 6.00, offPeak: 4.50 },
      'z1-6': { peak: 6.40, offPeak: 4.90 },
      'z2-2': { peak: 2.80, offPeak: 2.50 },
      'z2-3': { peak: 2.80, offPeak: 2.50 },
      'z2-4': { peak: 3.50, offPeak: 2.90 },
      'z2-5': { peak: 4.30, offPeak: 3.30 },
      'z2-6': { peak: 4.70, offPeak: 3.70 },
      'z3-3': { peak: 2.80, offPeak: 2.50 },
      'z3-4': { peak: 2.80, offPeak: 2.50 },
      'z3-5': { peak: 3.50, offPeak: 2.90 },
      'z3-6': { peak: 3.90, offPeak: 3.30 },
      'z4-4': { peak: 2.80, offPeak: 2.50 },
      'z4-5': { peak: 2.80, offPeak: 2.50 },
      'z4-6': { peak: 3.50, offPeak: 2.90 },
      'z5-5': { peak: 2.80, offPeak: 2.50 },
      'z5-6': { peak: 2.80, offPeak: 2.50 },
      'z6-6': { peak: 2.80, offPeak: 2.50 }
    };
  
    // London station zones mapping
    static STATION_ZONES = {
      // Central London
      'london bridge': [1],
      'liverpool street': [1],
      'kings cross': [1],
      'waterloo': [1],
      'oxford circus': [1],
      'bank': [1],
      
      // Zone 2
      'stratford': [2, 3],
      'canary wharf': [2],
      'brixton': [2],
      'hammersmith': [2],
      
      // Zone 3
      'wimbledon': [3],
      'finsbury park': [2, 3, 4],
      'lewisham': [2, 3],
      
      // Zone 4
      'wembley central': [4],
      'barking': [4],
      'richmond': [4],
      
      // Zone 5
      'heathrow terminals 2 & 3': [5],
      'stanmore': [5],
      
      // Zone 6
      'uxbridge': [6],
      'upminster': [6]
    };
  
    static isPeakTime() {
      const now = new Date();
      const hour = now.getHours();
      const minute = now.getMinutes();
      const day = now.getDay();
  
      // Weekday check (Monday = 1, Sunday = 0)
      if (day >= 1 && day <= 5) {
        // Morning peak: 06:30-09:30
        if ((hour === 6 && minute >= 30) || (hour >= 7 && hour < 9) || (hour === 9 && minute <= 30)) {
          return true;
        }
        // Evening peak: 16:00-19:00
        if (hour >= 16 && hour < 19) {
          return true;
        }
      }
      return false;
    }
  
    static getStationZone(station) {
      const normalizedStation = station.toLowerCase().trim();
      return this.STATION_ZONES[normalizedStation] || this.findNearestStation(normalizedStation);
    }
  
    static findNearestStation(location) {
      // In a real application, you would use geocoding and a more comprehensive station database
      // This is a simplified version
      return [1]; // Default to zone 1 if station not found
    }
  
    static getFareKey(fromZone, toZone) {
      const zones = [fromZone[0], toZone[0]].sort((a, b) => a - b);
      return `z${zones[0]}-${zones[1]}`;
    }
  
    static calculateFare(fromStation, toStation) {
      const fromZones = this.getStationZone(fromStation);
      const toZones = this.getStationZone(toStation);
      const isPeak = this.isPeakTime();
  
      // Calculate all possible combinations of zones
      let minFare = Infinity;
      let fareDetails = null;
  
      fromZones.forEach(fromZone => {
        toZones.forEach(toZone => {
          const fareKey = this.getFareKey([fromZone], [toZone]);
          const fare = this.ZONE_FARES[fareKey];
          
          if (fare) {
            const currentFare = isPeak ? fare.peak : fare.offPeak;
            if (currentFare < minFare) {
              minFare = currentFare;
              fareDetails = {
                fare: currentFare,
                isPeak,
                fromZone,
                toZone,
                peakFare: fare.peak,
                offPeakFare: fare.offPeak
              };
            }
          }
        });
      });
  
      if (!fareDetails) {
        throw new Error('Unable to calculate fare for the given stations');
      }
  
      return {
        ...fareDetails,
        stations: {
          from: fromStation,
          to: toStation
        }
      };
    }
  
    static getDailyCapForZones(zones) {
      const maxZone = Math.max(...zones);
      const minZone = Math.min(...zones);
      
      // 2024 daily caps
      const caps = {
        'z1-1': 7.90,
        'z1-2': 7.90,
        'z1-3': 9.50,
        'z1-4': 11.60,
        'z1-5': 13.90,
        'z1-6': 14.90,
        'z2-2': 7.90,
        'z2-3': 7.90,
        'z2-4': 7.90,
        'z2-5': 9.50,
        'z2-6': 11.60
      };
  
      const capKey = `z${minZone}-${maxZone}`;
      return caps[capKey] || 14.90; // Default to highest cap if not found
    }
  
    static async getJourneyOptions(fromStation, toStation) {
      try {
        const baseFare = this.calculateFare(fromStation, toStation);
        const dailyCap = this.getDailyCapForZones([baseFare.fromZone, baseFare.toZone]);
  
        return {
          currentFare: baseFare.fare,
          peakFare: baseFare.peakFare,
          offPeakFare: baseFare.offPeakFare,
          isPeak: baseFare.isPeak,
          dailyCap,
          zones: {
            from: baseFare.fromZone,
            to: baseFare.toZone
          },
          stations: baseFare.stations
        };
      } catch (error) {
        console.error('Error calculating journey options:', error);
        throw error;
      }
    }
  }
  
  export default TflFareCalculator;