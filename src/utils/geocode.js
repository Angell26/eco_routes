// src/utils/geocode.js
export const geocodeLocation = async (location) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}`
      );
      const data = await response.json();
  
      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        return [parseFloat(lat), parseFloat(lon)];
      } else {
        throw new Error('Location not found');
      }
    } catch (error) {
      console.error('Error in geocoding:', error);
      return null;
    }
  };
  