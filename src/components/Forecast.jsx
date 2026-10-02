import React from 'react';

function Forecast({ data }) {
  if (!data || !data.list) return null;

  // The API returns 40 entries (every 3 hours for 5 days).
  // We only want one per day, so we pick the entry closest to noon for each date.
  const dailyForecasts = data.list.reduce((acc, item) => {
    const [date, time] = item.dt_txt.split(' ');

    if (time === '12:00:00' && !acc[date]) {
      acc[date] = item;
    }

    return acc;
  }, {});

  const forecastDays = Object.values(dailyForecasts).slice(0, 5);

  const formatDay = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  };

  return (
    <div className="forecast">
      <h3 className="forecast-title">5-Day Forecast</h3>
      <div className="forecast-grid">
        {forecastDays.map((day) => (
          <div className="forecast-card" key={day.dt}>
            <span className="forecast-day">{formatDay(day.dt_txt)}</span>
            <img
              src={`https://openweathermap.org/img/wn/${day.weather[0].icon}.png`}
              alt={day.weather[0].description}
            />
            <span className="forecast-temp">{Math.round(day.main.temp)}°C</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Forecast;