import axios from 'axios';

const GEO_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const WEATHER_URL = 'https://api.open-meteo.com/v1/forecast';

export const getCurrentWeather = async (city) => {
  // Step 1: Convert city name to coordinates
  const geoResponse = await axios.get(GEO_URL, {
    params: { name: city, count: 1, language: 'en', format: 'json' },
  });

  if (!geoResponse.data.results || geoResponse.data.results.length === 0) {
   const error = new Error('City not found');
error.response = { status: 404 };
throw error;
  }

  const { latitude, longitude, name, country } = geoResponse.data.results[0];

  // Step 2: Fetch weather using coordinates
  const weatherResponse = await axios.get(WEATHER_URL, {
    params: {
      latitude,
      longitude,
      current: 'temperature_2m,relative_humidity_2m,apparent_temperature,surface_pressure,wind_speed_10m,weather_code',
      daily: 'weather_code,temperature_2m_max,temperature_2m_min',
      timezone: 'auto',
      forecast_days: 5,
    },
  });

  // Step 3: Reshape to match what your components expect
  const current = weatherResponse.data.current;
  const daily = weatherResponse.data.daily;

  return {
    name,
    sys: { country },
    main: {
      temp: current.temperature_2m,
      feels_like: current.apparent_temperature,
      humidity: current.relative_humidity_2m,
      pressure: current.surface_pressure,
    },
    weather: [{ icon: '01d', description: getWeatherDescription(current.weather_code) }],
    wind: { speed: current.wind_speed_10m },
    // Build forecast array for your Forecast component
    forecast: daily.time.map((date, i) => ({
      dt: i,
      dt_txt: `${date} 12:00:00`,
      main: { temp: daily.temperature_2m_max[i] },
      weather: [{ icon: '01d', description: getWeatherDescription(daily.weather_code[i]) }],
    })),
  };
};

// Open-Meteo uses WMO weather codes instead of text descriptions
function getWeatherDescription(code) {
  const descriptions = {
    0: 'clear sky', 1: 'mainly clear', 2: 'partly cloudy', 3: 'overcast',
    45: 'fog', 48: 'depositing rime fog',
    51: 'light drizzle', 53: 'moderate drizzle', 55: 'dense drizzle',
    61: 'slight rain', 63: 'moderate rain', 65: 'heavy rain',
    71: 'slight snow', 73: 'moderate snow', 75: 'heavy snow',
    80: 'slight rain showers', 81: 'moderate rain showers', 82: 'violent rain showers',
    95: 'thunderstorm', 96: 'thunderstorm with slight hail', 99: 'thunderstorm with heavy hail',
  };
  return descriptions[code] || 'unknown';
}

// For getForecast, we need to call the same endpoint but return a forecast-only structure
export const getForecast = async (city) => {
  const geoResponse = await axios.get(GEO_URL, {
    params: { name: city, count: 1, language: 'en', format: 'json' },
  });

  if (!geoResponse.data.results || geoResponse.data.results.length === 0) {
   const error = new Error('City not found');
error.response = { status: 404 };
throw error;
  }

  const { latitude, longitude } = geoResponse.data.results[0];

  const weatherResponse = await axios.get(WEATHER_URL, {
    params: {
      latitude,
      longitude,
      daily: 'weather_code,temperature_2m_max',
      timezone: 'auto',
      forecast_days: 5,
    },
  });

  const daily = weatherResponse.data.daily;

  return {
    list: daily.time.map((date, i) => ({
      dt: i,
      dt_txt: `${date} 12:00:00`,
      main: { temp: daily.temperature_2m_max[i] },
      weather: [{ icon: '01d', description: getWeatherDescription(daily.weather_code[i]) }],
    })),
  };
};