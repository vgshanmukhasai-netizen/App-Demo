import { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import BottomNav from '../components/layout/BottomNav';
import Alert from '../components/common/Alert';
import { useCrops } from '../context/CropContext';
import { cropAPI } from '../services/cropAPI';
import { WATERING_METHODS } from '../constants/farmConstants';
import { useLanguage } from '../context/LanguageContext';

const intervalFor = (crop) => {
  let days = ['Seedling', 'Flowering', 'Fruit Development'].includes(crop.currentGrowthStage) ? 2 : 4;
  if (['Sandy Loam', 'Red Sandy'].includes(crop.soilType)) days -= 1;
  if (crop.soilType === 'Clay') days += 1;
  if (crop.waterAvailability === 'Rain-fed') days += 1;
  return Math.max(1, days);
};

const formatLastWatered = (date, language) => date
  ? new Intl.DateTimeFormat(language, { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(date))
  : 'No watering logged yet';

const SmartIrrigationPage = () => {
  const { activeCrops, fetchCrops } = useCrops();
  const { language, t } = useLanguage();
  const [currentTime] = useState(() => Date.now());
  const [method, setMethod] = useState('Manual');
  const [savingCrop, setSavingCrop] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const logWatering = async (crop) => {
    setSavingCrop(crop._id);
    setMessage('');
    setError('');
    try {
      await cropAPI.logWatering(crop._id, { method, notes: 'Logged from irrigation planner' });
      await fetchCrops();
      setMessage(`${t('Watering logged for')} ${t(crop.cropName)}.`);
    } catch (requestError) {
      setError(requestError.response?.data?.message || t('Could not save watering log. Please try again.'));
    } finally {
      setSavingCrop(null);
    }
  };

  return (
    <div className="app-container">
      <Navbar title="Smart Irrigation" showBack />
      <div className="page page-with-header fade-in">
        <Alert type="info" icon="💧">
          {t('Watering intervals are starting estimates based on crop stage, soil, and water availability. Check soil moisture and local conditions before watering.')}
        </Alert>

        {message && <Alert type="success">{message}</Alert>}
        {error && <Alert type="danger">{error}</Alert>}

        {activeCrops.length > 0 && (
          <div className="card" style={{ marginBottom: '1rem' }}>
            <label htmlFor="watering-method" className="form-label">{t('Watering method to log')}</label>
            <select id="watering-method" className="form-input form-select" value={method} onChange={(event) => setMethod(event.target.value)}>
              {WATERING_METHODS.map((value) => <option key={value} value={value}>{t(value)}</option>)}
            </select>
          </div>
        )}

        {activeCrops.length === 0 ? (
          <div className="empty-state card">
            <span className="empty-icon">🌱</span>
            <p className="empty-title">{t('No active crops to plan for')}</p>
            <p className="empty-desc">{t('Add a crop to get stage-based watering guidance.')}</p>
            <Link to="/crops/add" className="btn btn-primary mt-4">{t('Add Crop')}</Link>
          </div>
        ) : activeCrops.map((crop) => {
          const interval = intervalFor(crop);
          const lastWateredAt = crop.lastWateredAt ? new Date(crop.lastWateredAt) : null;
          const due = !lastWateredAt || (currentTime - lastWateredAt.getTime()) >= interval * 86400000;

          return (
            <article className="card" key={crop._id} style={{ marginBottom: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
                <div>
                  <h3 style={{ fontWeight: 700 }}>{t(crop.cropName)}</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>
                    {t(crop.currentGrowthStage)} · {t(crop.soilType)} · {t(crop.waterAvailability)}
                  </p>
                </div>
                <span className={`badge badge-${due ? 'yellow' : 'green'}`}>{t(due ? 'Check moisture' : 'Recently watered')}</span>
              </div>
              <div style={{ margin: '1rem 0', padding: '0.75rem', background: 'var(--green-50)', borderRadius: 'var(--radius-md)' }}>
                <strong>{t('Starting interval: about every ')}{interval} {t(interval === 1 ? 'day' : 'days')}</strong>
                <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-xs)', marginTop: '0.25rem' }}>
                  {t('Last watered: ')}{formatLastWatered(crop.lastWateredAt, language)}
                </p>
              </div>
              <button type="button" className="btn btn-primary" disabled={savingCrop === crop._id} onClick={() => logWatering(crop)}>
                {savingCrop === crop._id ? t('Saving...') : t('Log watering')}
              </button>
            </article>
          );
        })}
      </div>
      <BottomNav />
    </div>
  );
};
export default SmartIrrigationPage;
