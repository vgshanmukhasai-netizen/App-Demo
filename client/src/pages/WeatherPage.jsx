import { useCallback, useEffect, useState } from 'react';
import Navbar from '../components/layout/Navbar';
import BottomNav from '../components/layout/BottomNav';
import Alert from '../components/common/Alert';
import Loader from '../components/common/Loader';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

const weatherDescription = (code) => {
  if (code === 0) return ['Clear sky', '☀️'];
  if ([1, 2, 3].includes(code)) return ['Partly cloudy', '🌤️'];
  if ([45, 48].includes(code)) return ['Fog', '🌫️'];
  if ([51, 53, 55, 56, 57].includes(code)) return ['Drizzle', '🌦️'];
  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return ['Rain', '🌧️'];
  if ([71, 73, 75, 77, 85, 86].includes(code)) return ['Snow', '🌨️'];
  if ([95, 96, 99].includes(code)) return ['Thunderstorm', '⛈️'];
  return ['Conditions unavailable', '🌡️'];
};

const formatDay = (date, language) => new Intl.DateTimeFormat(language, { weekday: 'short', month: 'short', day: 'numeric' }).format(new Date(`${date}T12:00:00`));

const WeatherPage = () => {
  const { farmer } = useAuth();
  const { language, t } = useLanguage();
  const defaultLocation = [farmer?.location?.district, farmer?.location?.state].filter(Boolean).join(', ');
  const [query, setQuery] = useState(defaultLocation);
  const [weather, setWeather] = useState(null);
  const [place, setPlace] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadWeather = useCallback(async (location) => {
    const search = location.trim();
    if (!search) {
      setError(t('Enter a city or district to get a forecast.'));
      return;
    }

    setLoading(true);
    setError('');
    try {
      const candidates = [...new Set(search.split(',').map((part) => part.trim()).filter(Boolean))];
      let result = null;
      for (const candidate of candidates) {
        const geocodeResponse = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(candidate)}&count=5&language=en&format=json&countryCode=IN`);
        if (!geocodeResponse.ok) throw new Error(t('Location search is unavailable. Please try again.'));
        const geocode = await geocodeResponse.json();
        if (geocode.results?.[0]) {
          result = geocode.results[0];
          break;
        }
      }
      if (!result) throw new Error(`${t('No matching location found for')} "${search}".`);

      const params = new URLSearchParams({
        latitude: result.latitude,
        longitude: result.longitude,
        current: 'temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m',
        daily: 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max',
        timezone: 'auto',
        forecast_days: '5',
      });
      const forecastResponse = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`);
      if (!forecastResponse.ok) throw new Error(t('Weather forecast is unavailable. Please try again shortly.'));
      setWeather(await forecastResponse.json());
      setPlace([result.name, result.admin1, result.country].filter(Boolean).join(', '));
    } catch (requestError) {
      setWeather(null);
      setError(requestError.message || t('Could not load weather. Check your connection and try again.'));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    if (!defaultLocation) return undefined;
    const timer = window.setTimeout(() => loadWeather(defaultLocation), 0);
    return () => window.clearTimeout(timer);
  }, [defaultLocation, loadWeather]);

  const currentConditions = weather ? weatherDescription(weather.current.weather_code) : null;

  return (
    <div className="app-container">
      <Navbar title="Weather" showBack />
      <div className="page page-with-header fade-in">
        <form className="card" onSubmit={(event) => { event.preventDefault(); loadWeather(query); }}>
          <label className="form-label" htmlFor="weather-location">{t('City or district')}</label>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input id="weather-location" className="form-input" value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t('e.g. Guntur, Andhra Pradesh')} />
            <button className="btn btn-primary" type="submit" disabled={loading}>{loading ? t('Loading...') : t('Search')}</button>
          </div>
        </form>

        {loading && <Loader text={t('Loading local forecast...')} />}
        {error && <Alert type="danger">{error}</Alert>}

        {weather && currentConditions && (
          <>
            <section className="card" style={{ textAlign: 'center', marginBottom: '1rem' }}>
              <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>{place}</p>
              <div style={{ fontSize: '3rem', margin: '0.5rem 0' }}>{currentConditions[1]}</div>
              <h2 style={{ fontSize: '2.5rem', fontWeight: 800 }}>{Math.round(weather.current.temperature_2m)}°C</h2>
              <p style={{ fontWeight: 600 }}>{t(currentConditions[0])}</p>
              <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)', marginTop: '0.35rem' }}>
                {t('Feels like')} {Math.round(weather.current.apparent_temperature)}°C · {t('Updated')} {weather.current.time.replace('T', ' ')}
              </p>
              <div className="form-row-2" style={{ marginTop: '1rem' }}>
                <div><strong>{weather.current.relative_humidity_2m}%</strong><p style={{ color: 'var(--text-muted)' }}>{t('Humidity')}</p></div>
                <div><strong>{weather.current.wind_speed_10m} km/h</strong><p style={{ color: 'var(--text-muted)' }}>{t('Wind')}</p></div>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)', marginTop: '0.75rem' }}>
                {t('Precipitation now: ')}{weather.current.precipitation} mm
              </p>
            </section>

            <h3 className="section-title" style={{ margin: '1.25rem 0 0.75rem' }}>{t('5-day forecast')}</h3>
            {weather.daily.time.map((date, index) => {
              const [description, icon] = weatherDescription(weather.daily.weather_code[index]);
              return (
                <div className="card" key={date} style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr auto', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                  <strong>{formatDay(date, language)}</strong>
                  <span aria-label={t(description)}>{icon}</span>
                  <span>{Math.round(weather.daily.temperature_2m_min[index])}° / {Math.round(weather.daily.temperature_2m_max[index])}°</span>
                  <span style={{ color: 'var(--text-muted)', fontSize: 'var(--text-xs)' }}>{weather.daily.precipitation_probability_max[index] ?? 0}% {t('rain')}</span>
                </div>
              );
            })}
            <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-xs)', textAlign: 'center', margin: '1rem 0' }}>
              {t('Forecast by Open-Meteo. Use local observations for farm decisions.')}
            </p>
          </>
        )}
      </div>
      <BottomNav />
    </div>
  );
};
export default WeatherPage;
