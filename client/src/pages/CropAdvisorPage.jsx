import { useMemo, useState } from 'react';
import Navbar from '../components/layout/Navbar';
import BottomNav from '../components/layout/BottomNav';
import Alert from '../components/common/Alert';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { SOIL_TYPES, WATER_AVAILABILITY } from '../constants/farmConstants';

const CROP_GUIDANCE = [
  { name: 'Groundnut', soils: ['Red Sandy', 'Sandy Loam', 'Loamy'], water: ['Rain-fed', 'Limited'], seasons: ['Kharif', 'Rabi'] },
  { name: 'Rice', soils: ['Clay', 'Alluvial', 'Loamy'], water: ['Canal', 'River', 'Pond'], seasons: ['Kharif', 'Rabi'] },
  { name: 'Maize', soils: ['Loamy', 'Sandy Loam', 'Alluvial'], water: ['Borewell', 'Canal', 'Rain-fed'], seasons: ['Kharif', 'Rabi', 'Zaid'] },
  { name: 'Cotton', soils: ['Black Cotton', 'Alluvial', 'Loamy'], water: ['Borewell', 'Canal', 'Rain-fed'], seasons: ['Kharif'] },
  { name: 'Tomato', soils: ['Loamy', 'Sandy Loam', 'Alluvial'], water: ['Borewell', 'Canal', 'Limited'], seasons: ['Rabi', 'Zaid'] },
  { name: 'Chilli', soils: ['Black Cotton', 'Loamy', 'Sandy Loam'], water: ['Borewell', 'Canal', 'Limited'], seasons: ['Kharif', 'Rabi'] },
  { name: 'Millets', soils: ['Red Sandy', 'Laterite', 'Sandy Loam'], water: ['Rain-fed', 'Limited'], seasons: ['Kharif', 'Rabi'] },
  { name: 'Onion', soils: ['Loamy', 'Sandy Loam', 'Alluvial'], water: ['Borewell', 'Canal', 'Drip'], seasons: ['Rabi', 'Zaid'] },
  { name: 'Soybean', soils: ['Black Cotton', 'Loamy', 'Alluvial'], water: ['Rain-fed', 'Canal'], seasons: ['Kharif'] },
  { name: 'Sugarcane', soils: ['Loamy', 'Alluvial', 'Black Cotton'], water: ['Canal', 'River', 'Borewell'], seasons: ['Year-round'] },
];

const SEASONS = ['Kharif', 'Rabi', 'Zaid', 'Year-round'];

const CropAdvisorPage = () => {
  const { farmer } = useAuth();
  const { t } = useLanguage();
  const [soilType, setSoilType] = useState(farmer?.landDetails?.soilType || 'Loamy');
  const [waterAvailability, setWaterAvailability] = useState(farmer?.landDetails?.waterAvailability || 'Rain-fed');
  const [season, setSeason] = useState('Kharif');

  const recommendations = useMemo(() => CROP_GUIDANCE.map((crop) => {
    let score = 45;
    if (crop.soils.includes(soilType)) score += 30;
    if (crop.water.includes(waterAvailability)) score += 20;
    if (crop.seasons.includes(season)) score += 5;
    return { ...crop, score: Math.min(score, 100) };
  }).sort((a, b) => b.score - a.score || a.name.localeCompare(b.name)), [soilType, waterAvailability, season]);

  return (
    <div className="app-container">
      <Navbar title="Crop Advisor" showBack />
      <div className="page page-with-header fade-in">
        <div className="card">
          <h2 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>{t('Find crops for your farm')}</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)', marginBottom: '1rem' }}>
            {t('Recommendations use your soil, water source, and growing season.')}
          </p>
          <div className="form-row-2">
            <div className="form-group">
              <label className="form-label" htmlFor="advisor-soil">{t('Soil type')}</label>
              <select id="advisor-soil" className="form-input form-select" value={soilType} onChange={(event) => setSoilType(event.target.value)}>
                {SOIL_TYPES.filter((soil) => soil !== 'Other').map((soil) => <option key={soil} value={soil}>{t(soil)}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="advisor-water">{t('Water availability')}</label>
              <select id="advisor-water" className="form-input form-select" value={waterAvailability} onChange={(event) => setWaterAvailability(event.target.value)}>
                {WATER_AVAILABILITY.filter((water) => water !== 'Other').map((water) => <option key={water} value={water}>{t(water)}</option>)}
              </select>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="advisor-season">{t('Season')}</label>
            <select id="advisor-season" className="form-input form-select" value={season} onChange={(event) => setSeason(event.target.value)}>
              {SEASONS.map((value) => <option key={value} value={value}>{t(value)}</option>)}
            </select>
          </div>
        </div>

        <h3 className="section-title" style={{ margin: '1.25rem 0 0.75rem' }}>{t('Best matches')}</h3>
        {recommendations.slice(0, 6).map((crop, index) => (
          <div className="card" key={crop.name} style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '1.75rem' }}>{index < 3 ? '🌱' : '🌾'}</span>
            <div style={{ flex: 1 }}>
              <strong>{t(crop.name)}</strong>
              <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-xs)', marginTop: '0.2rem' }}>
                {t(crop.soils.includes(soilType) ? 'Soil match' : 'Check local soil suitability')} · {t(crop.water.includes(waterAvailability) ? 'Water match' : 'Plan reliable irrigation')}
              </p>
            </div>
            <strong style={{ color: 'var(--green-700)' }}>{crop.score}%</strong>
          </div>
        ))}
        <Alert type="info" icon="ℹ️">
          {t('These are general planning suggestions, not a guarantee of yield. Confirm seed choice and planting dates with your local agriculture extension office.')}
        </Alert>
      </div>
      <BottomNav />
    </div>
  );
};
export default CropAdvisorPage;
