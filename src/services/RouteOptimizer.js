class RouteOptimizer {
    constructor() {
      // Weights for different factors in optimization
      this.weights = {
        co2Emissions: 0.4,
        duration: 0.3,
        weather: 0.2,
        convenience: 0.1
      };
    }
  
    optimizeRoutes(routes, weather, userPreferences = {}) {
      return routes.map(route => ({
        ...route,
        score: this.calculateRouteScore(route, weather, userPreferences)
      }))
      .sort((a, b) => b.score - a.score);
    }
  
    calculateRouteScore(route, weather, userPreferences) {
      const co2Score = this.calculateCO2Score(route);
      const durationScore = this.calculateDurationScore(route);
      const weatherScore = this.calculateWeatherScore(route, weather);
      const convenienceScore = this.calculateConvenienceScore(route, userPreferences);
  
      return (
        co2Score * this.weights.co2Emissions +
        durationScore * this.weights.duration +
        weatherScore * this.weights.weather +
        convenienceScore * this.weights.convenience
      );
    }
  
    calculateCO2Score(route) {
      const maxCO2 = 300; // g/km for worst case
      const co2PerKm = route.co2Emissions / route.distance;
      return Math.max(0, 1 - (co2PerKm / maxCO2));
    }
  
    calculateDurationScore(route) {
      const maxAcceptableDuration = 7200; // 2 hours in seconds
      return Math.max(0, 1 - (route.duration / maxAcceptableDuration));
    }
  
    calculateWeatherScore(route, weather) {
      if (!weather) return 1;
  
      switch (route.mode) {
        case 'WALKING':
          return this.calculateWalkingWeatherScore(weather);
        case 'CYCLING':
          return this.calculateCyclingWeatherScore(weather);
        default:
          return 1;
      }
    }
  
    calculateWalkingWeatherScore(weather) {
      let score = 1;
      
      // Temperature impact
      if (weather.temperature < 0 || weather.temperature > 35) {
        score *= 0.5;
      } else if (weather.temperature < 10 || weather.temperature > 25) {
        score *= 0.8;
      }
  
      // Rain impact
      if (weather.conditions.includes('Rain')) {
        score *= 0.3;
      }
  
      return score;
    }
  
    calculateCyclingWeatherScore(weather) {
      let score = 1;
      
      // Temperature impact
      if (weather.temperature < 5 || weather.temperature > 30) {
        score *= 0.4;
      } else if (weather.temperature < 10 || weather.temperature > 25) {
        score *= 0.7;
      }
  
      // Wind impact
      if (weather.wind > 20) {
        score *= 0.3;
      } else if (weather.wind > 10) {
        score *= 0.7;
      }
  
      // Rain impact
      if (weather.conditions.includes('Rain')) {
        score *= 0.2;
      }
  
      return score;
    }
  
    calculateConvenienceScore(route, userPreferences) {
      let score = 1;
  
      // Mode preference
      if (userPreferences.preferredMode === route.mode) {
        score *= 1.2;
      }
  
      // Transit changes penalty
      if (route.mode === 'TRANSIT') {
        const changes = route.segments.length - 1;
        score *= Math.max(0.5, 1 - (changes * 0.1));
      }
  
      return Math.min(1, score);
    }
  }
  
  export default new RouteOptimizer();