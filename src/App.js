import React, { useState, useEffect } from 'react';
import SearchBar from './components/SearchBar';
import CurrentWeather from './components/CurrentWeather';
import Forecast from './components/Forecast';
import Loader from './components/Loader';
import { getCurrentWeather, getForecast } from './services/weatherApi';
import './styles/weather.css';

function App() {
  const [city, setCity] = useState('');
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!city) return;

    const fetchWeatherData = async () => {
      setLoading(true);
      setError('');
      setCurrentWeather(null);
      setForecast(null);

      try {
        const [weatherData, forecastData] = await Promise.all([
          getCurrentWeather(city),
          getForecast(city),
        ]);

        setCurrentWeather(weatherData);
        setForecast(forecastData);
      } catch (err) {
        if (err.response?.status === 404) {
          setError(`City "${city}" not found. Please check the spelling.`);
        } else if (err.response?.status === 401) {
          setError('Invalid API key. Please check your .env file.');
        } else {
          setError('Unable to fetch weather data. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchWeatherData();
  }, [city]);

  return (
    <div className="app">
      <div className="app-container">
        <header className="app-header">
          <h1>Weather Forecast</h1>
          <p className="subtitle">Search any city to see current conditions</p>
        </header>

        <SearchBar onSearch={setCity} />

        {loading && <Loader />}
        {error && <div className="error-message">{error}</div>}

        {!loading && !error && currentWeather && (
          <>
            <CurrentWeather data={currentWeather} />
            <Forecast data={forecast} />
          </>
        )}

        {!loading && !error && !currentWeather && (
          <p className="empty-state">Start by searching for a city above.</p>
        )}
      </div>
    </div>
  );
}

export default App;