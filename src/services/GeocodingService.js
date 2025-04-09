import axios from 'axios';

const OPENCAGE_API_KEY = '8be1f0c29ee64b00861c7a81d4617d57';

class GeocodingService {
  async geocodeLocation(location) {
    try {
      const response = await axios.get('https://api.opencagedata.com/geocode/v1/json', {
        params: {
          q: `${location},London`,
          key: OPENCAGE_API_KEY,
          limit: 1
        }
      });

      if (!response.data.results.length) {
        throw new Error('Location not found');
      }

      const result = response.data.results[0];
      return {
        lat: result.geometry.lat,
        lon: result.geometry.lng,
        displayName: result.formatted
      };
    } catch (error) {
      console.error('Geocoding error:', error);
      throw error;
    }
  }

  // Helper method for reverse geocoding if needed
  async reverseGeocode(lat, lon) {
    try {
      const response = await axios.get('https://api.opencagedata.com/geocode/v1/json', {
        params: {
          q: `${lat}+${lon}`,
          key: OPENCAGE_API_KEY,
          limit: 1
        }
      });

      if (!response.data.results.length) {
        throw new Error('Address not found');
      }

      return {
        address: response.data.results[0].formatted,
        components: response.data.results[0].components
      };
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      throw error;
    }
  }

  // Method to validate if a location exists
  async validateLocation(location) {
    try {
      const result = await this.geocodeLocation(location);
      return !!result;
    } catch {
      return false;
    }
  }
}

export default new GeocodingService();