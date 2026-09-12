// Phase 6: Smart Irrigation — Coming soon page (full implementation in Phase 6)
import Navbar from '../components/layout/Navbar';
import BottomNav from '../components/layout/BottomNav';
import Alert from '../components/common/Alert';

const SmartIrrigationPage = () => (
  <div className="app-container">
    <Navbar title="Smart Irrigation" showBack />
    <div className="page page-with-header fade-in">
      <div className="card">
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <div style={{ fontSize: '3rem' }}>💧</div>
          <h2 style={{ margin: '1rem 0 0.5rem', fontWeight: 700 }}>Smart Irrigation</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>
            Personalized watering recommendations based on your crops, growth stages, and weather forecasts.
          </p>
        </div>
      </div>
      <Alert type="info" icon="🚧">
        <strong>Phase 6 Feature.</strong> This feature will be built in Phase 6 after weather integration is complete.
        It will use real-time rain probability + your crop's stage to give smart advice.
      </Alert>
    </div>
    <BottomNav />
  </div>
);
export default SmartIrrigationPage;
