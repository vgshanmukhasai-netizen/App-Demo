import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCrops } from '../context/CropContext';
import { useLanguage } from '../context/LanguageContext';
import Navbar from '../components/layout/Navbar';
import BottomNav from '../components/layout/BottomNav';
import { daysUntilHarvest, formatDate } from '../utils/dateUtils';
import './DashboardPage.css';

const QUICK_ACTIONS = [
  { to: '/crops/add', icon: '➕', label: 'Add Crop', color: '#2d7d46' },
  { to: '/advisor', icon: '🤖', label: 'Crop Advisor', color: '#3b82f6' },
  { to: '/calculator', icon: '💰', label: 'Profit Calc', color: '#e8a838' },
  { to: '/market', icon: '📊', label: 'Market', color: '#8b5cf6' },
  { to: '/irrigation', icon: '💧', label: 'Irrigation', color: '#06b6d4' },
  { to: '/weather', icon: '🌤️', label: 'Weather', color: '#f97316' },
];

const DashboardPage = () => {
  const { farmer } = useAuth();
  const { activeCrops, loading } = useCrops();
  const { t } = useLanguage();

  const firstName = farmer?.name?.split(' ')[0] || 'Farmer';

  // Nearest harvest
  const nearestHarvest = activeCrops
    .filter((c) => c.expectedHarvestDate)
    .sort(
      (a, b) =>
        new Date(a.expectedHarvestDate) - new Date(b.expectedHarvestDate)
    )[0];

  const daysToHarvest = nearestHarvest
    ? daysUntilHarvest(nearestHarvest.expectedHarvestDate)
    : null;

  return (
    <div className="app-container">
      <Navbar />

      <div className="page page-with-header dashboard-page fade-in">

        {/* ── Greeting Card ── */}
        <div className="dashboard-greeting card-green" id="greeting-card">
          <div>
            <p className="greeting-sub">{t('Good morning 🌅')}</p>
            <h2 className="greeting-title">{t('Hello, ')}{firstName} 👋</h2>
            <p className="greeting-location">
              📍 {farmer?.location?.district || t('Your Farm')}
              {farmer?.location?.state ? `, ${farmer.location.state}` : ''}
            </p>
          </div>
          <div className="greeting-stats">
            <div className="stat-item">
              <span className="stat-value">{activeCrops.length}</span>
              <span className="stat-label">{t('Active Crops')}</span>
            </div>
            <div className="stat-divider" />
            <div className="stat-item">
              <span className="stat-value">
                {farmer?.landDetails?.totalArea || '—'}
              </span>
              <span className="stat-label">{t(farmer?.landDetails?.areaUnit || 'acres')}</span>
            </div>
          </div>
        </div>

        {/* ── Harvest Alert ── */}
        {nearestHarvest && daysToHarvest !== null && daysToHarvest <= 14 && (
          <div
            className={`harvest-alert-card ${daysToHarvest <= 3 ? 'urgent' : ''}`}
            id="harvest-alert-banner"
          >
            <span className="harvest-alert-icon">🌾</span>
            <div>
              <p className="harvest-alert-title">
                {daysToHarvest <= 0
                  ? `${t(nearestHarvest.cropName)} ${t('is ready to harvest!')}`
                  : `${t(nearestHarvest.cropName)} ${t('harvest in')} ${daysToHarvest} ${t(daysToHarvest === 1 ? 'day' : 'days')}`}
              </p>
              <p className="harvest-alert-sub">
                {t('Expected:')} {formatDate(nearestHarvest.expectedHarvestDate)}
              </p>
            </div>
            <Link to={`/crops/${nearestHarvest._id}`} className="harvest-alert-link">
              {t('View →')}
            </Link>
          </div>
        )}

        {/* ── Quick Actions ── */}
        <section className="dashboard-section" id="quick-actions">
          <h3 className="section-title">{t('Quick Actions')}</h3>
          <div className="quick-actions-grid">
            {QUICK_ACTIONS.map((action) => (
              <Link
                key={action.to}
                to={action.to}
                className="quick-action-item"
                id={`action-${action.label.replace(/\s+/g, '-').toLowerCase()}`}
              >
                <div
                  className="quick-action-icon"
                  style={{ background: `${action.color}15`, color: action.color }}
                >
                  {action.icon}
                </div>
                <span className="quick-action-label">{t(action.label)}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* ── Active Crops ── */}
        <section className="dashboard-section" id="active-crops-section">
          <div className="section-header">
            <h3 className="section-title">{t('My Crops')}</h3>
            <Link to="/crops" className="section-link">{t('View All →')}</Link>
          </div>

          {loading ? (
            <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
              <div className="spinner" style={{ margin: '0 auto' }} />
            </div>
          ) : activeCrops.length === 0 ? (
            <div className="empty-state card" id="no-crops-state">
              <span className="empty-icon">🌱</span>
              <p className="empty-title">{t('No active crops yet')}</p>
              <p className="empty-desc">{t('Add your first crop to start tracking')}</p>
              <Link to="/crops/add" id="add-first-crop-btn" className="btn btn-primary mt-4">
                {t('+ Add First Crop')}
              </Link>
            </div>
          ) : (
            <div className="crops-preview-list">
              {activeCrops.slice(0, 3).map((crop) => (
                <Link
                  key={crop._id}
                  to={`/crops/${crop._id}`}
                  className="crop-preview-card card"
                  id={`crop-preview-${crop._id}`}
                >
                  <div className="crop-preview-left">
                    <span className="crop-preview-icon">🌿</span>
                    <div>
                      <p className="crop-preview-name">{t(crop.cropName)}</p>
                      <p className="crop-preview-stage">{t(crop.currentGrowthStage)}</p>
                    </div>
                  </div>
                  <div className="crop-preview-right">
                    <p className="crop-preview-area">{crop.landArea} {t(crop.areaUnit)}</p>
                    {crop.expectedHarvestDate && (
                      <p className="crop-preview-harvest">
                        {t('Harvest')}: {formatDate(crop.expectedHarvestDate)}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
              {activeCrops.length > 3 && (
                <Link to="/crops" className="see-more-link">
                  + {activeCrops.length - 3} {t('more crops')}
                </Link>
              )}
            </div>
          )}
        </section>

        {/* ── Local weather preview link ── */}
        <section className="dashboard-section" id="weather-section">
          <div className="section-header">
            <h3 className="section-title">{t("Today's Weather")}</h3>
            <Link to="/weather" className="section-link">{t('Details →')}</Link>
          </div>
          <Link to="/weather" className="weather-teaser-card card">
            <div className="weather-teaser-content">
              <span className="weather-teaser-icon">🌤️</span>
              <div>
                <p className="weather-teaser-title">{t('Live Farm Forecast')}</p>
                <p className="weather-teaser-sub">
                  {t('Current conditions and a five-day forecast for your location')}
                </p>
              </div>
            </div>
          </Link>
        </section>

      </div>

      <BottomNav />
    </div>
  );
};

export default DashboardPage;
