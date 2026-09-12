import Navbar from '../components/layout/Navbar';
import BottomNav from '../components/layout/BottomNav';
import Alert from '../components/common/Alert';

const WeatherPage = () => (
  <div className="app-container">
    <Navbar title="Weather" showBack />
    <div className="page page-with-header fade-in">
      <div className="card">
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <div style={{ fontSize: '3rem' }}>🌤️</div>
          <h2 style={{ margin: '1rem 0 0.5rem', fontWeight: 700 }}>Weather Monitoring</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>
            Real-time temperature, rain probability, humidity, wind speed, and 7-day forecast.
          </p>
        </div>
      </div>
      <Alert type="warning" icon="⚙️">
        <strong>Phase 7 Feature.</strong> Add your <code>WEATHER_API_KEY</code> from OpenWeatherMap to activate this page.
        Visit <a href="https://openweathermap.org/api" target="_blank" rel="noreferrer">openweathermap.org</a> for a free API key.
      </Alert>
    </div>
    <BottomNav />
  </div>
);
export default WeatherPage;
