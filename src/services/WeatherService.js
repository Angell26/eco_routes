// src/services/WeatherService.js
const WEATHER_API_KEY = 'bb558891f8e1b6ead3dbcf535e385114';

const WeatherService = {
  async getWeather(lat, lon) {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`
      );
      if (!response.ok) throw new Error('Weather API error');
      const data = await response.json();
      return {
        temperature: Math.round(data.main.temp),
        feels_like: Math.round(data.main.feels_like),
        humidity: data.main.humidity,
        condition: data.weather[0].main,
        description: data.weather[0].description,
        icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
        wind: {
          speed: Math.round(data.wind.speed * 2.237),
          direction: data.wind.deg
        }
      };
    } catch (error) {
      console.error('Weather API Error:', error);
      return null;
    }
  }
};

export default WeatherService;