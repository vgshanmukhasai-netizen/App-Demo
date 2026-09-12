import Navbar from '../components/layout/Navbar';
import BottomNav from '../components/layout/BottomNav';
import Alert from '../components/common/Alert';

const CropAdvisorPage = () => (
  <div className="app-container">
    <Navbar title="AI Crop Advisor" showBack />
    <div className="page page-with-header fade-in">
      <div className="card">
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <div style={{ fontSize: '3rem' }}>🤖</div>
          <h2 style={{ margin: '1rem 0 0.5rem', fontWeight: 700 }}>Crop Advisor</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>
            Get personalized crop recommendations based on your soil type, water availability, season, and more.
          </p>
        </div>
      </div>
      <Alert type="info" icon="🚧">
        <strong>Phase 8 Feature.</strong> The rule-based crop advisor will recommend crops with suitability scores,
        categorized by demand, profit potential, water needs, and more.
      </Alert>
    </div>
    <BottomNav />
  </div>
);
export default CropAdvisorPage;
