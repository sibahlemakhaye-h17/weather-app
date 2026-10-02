import React from 'react';

function CurrentWeather({ data }) {

  if (!data) return null;

  const {
    name,
    sys: { country },
    main: { temp, feels_like, humidity, pressure },
    weather,
    wind: { speed },
  } = data;

  const iconUrl = `https://openweathermap.org/img/wn/${weather[0].icon}@2x.png`;

  return (
    <div className="current-weather">
      <h2 className="location">
        {name}, {country}
      </h2>

      <div className="weather-main">
        <img src={iconUrl} alt={weather[0].description} />
        <div className="temp-display">{Math.round(temp)}°C</div>
      </div>

      <p className="description">{weather[0].description}</p>

      <div className="weather-details">
        <div className="detail">
          <span className="detail-label">Feels Like</span>
          <span className="detail-value">{Math.round(feels_like)}°C</span>
        </div>
        <div className="detail">
          <span className="detail-label">Humidity</span>
          <span className="detail-value">{humidity}%</span>
        </div>
        <div className="detail">
          <span className="detail-label">Wind</span>
          <span className="detail-value">{speed} m/s</span>
        </div>
        <div className="detail">
          <span className="detail-label">Pressure</span>
          <span className="detail-value">{pressure} hPa</span>
        </div>
      </div>
    </div>
  );
}

export default CurrentWeather;