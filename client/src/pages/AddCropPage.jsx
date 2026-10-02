import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Alert from '../components/common/Alert';
import { useCrops } from '../context/CropContext';
import { useLanguage } from '../context/LanguageContext';
import {
  SOIL_TYPES, WATER_AVAILABILITY, COMMON_CROPS, AREA_UNITS, YIELD_UNITS,
} from '../constants/farmConstants';

const AddCropPage = () => {
  const { addCrop } = useCrops();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    cropName: '',
    customCrop: '',
    landArea: '',
    areaUnit: 'acres',
    plantingDate: '',
    expectedHarvestDate: '',
    expectedYield: '',
    yieldUnit: 'kg',
    soilType: 'Loamy',
    waterAvailability: 'Rain-fed',
    notes: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const cropName = form.cropName === 'Other' ? form.customCrop : form.cropName;
    if (!cropName.trim()) { setError(t('Please select or enter a crop name.')); return; }
    if (!form.landArea) { setError(t('Please enter land area.')); return; }
    if (!form.plantingDate) { setError(t('Please enter planting date.')); return; }

    setLoading(true);
    try {
      await addCrop({
        cropName: cropName.trim(),
        landArea: parseFloat(form.landArea),
        areaUnit: form.areaUnit,
        plantingDate: form.plantingDate,
        expectedHarvestDate: form.expectedHarvestDate || null,
        expectedYield: form.expectedYield ? parseFloat(form.expectedYield) : null,
        yieldUnit: form.yieldUnit,
        soilType: form.soilType,
        waterAvailability: form.waterAvailability,
        notes: form.notes,
      });
      navigate('/crops', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || t('Failed to add crop. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <Navbar title="Add New Crop" showBack />
      <div className="page page-with-header fade-in" style={{ paddingBottom: '2rem' }}>

        {error && <Alert type="danger">{error}</Alert>}

        <form onSubmit={handleSubmit} id="add-crop-form" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

          <div className="card">
            <h3 style={{ fontWeight: 600, marginBottom: '1rem', color: 'var(--text-primary)' }}>{t('Crop Details')}</h3>

            <div className="form-group">
              <label htmlFor="crop-name-select" className="form-label">{t('Crop Name *')}</label>
              <select id="crop-name-select" name="cropName" className="form-input form-select"
                value={form.cropName} onChange={handleChange}>
                <option value="">{t('Select a crop')}</option>
                {COMMON_CROPS.map((c) => <option key={c} value={c}>{t(c)}</option>)}
              </select>
            </div>

            {form.cropName === 'Other' && (
              <div className="form-group">
                <label htmlFor="custom-crop" className="form-label">{t('Crop Name (Custom) *')}</label>
                <input id="custom-crop" name="customCrop" type="text" className="form-input"
                  placeholder={t('Enter crop name')} value={form.customCrop} onChange={handleChange} />
              </div>
            )}

            <div className="form-row-2">
              <div className="form-group" style={{ flex: 2 }}>
                <label htmlFor="land-area" className="form-label">{t('Land Area *')}</label>
                <input id="land-area" name="landArea" type="number" className="form-input"
                  placeholder="e.g. 2" value={form.landArea} onChange={handleChange} min="0.1" step="0.1" />
              </div>
              <div className="form-group" style={{ flex: 1 }}>
                <label htmlFor="area-unit" className="form-label">{t('Unit')}</label>
                <select id="area-unit" name="areaUnit" className="form-input form-select"
                  value={form.areaUnit} onChange={handleChange}>
                  {AREA_UNITS.map((u) => <option key={u} value={u}>{t(u)}</option>)}
                </select>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 style={{ fontWeight: 600, marginBottom: '1rem', color: 'var(--text-primary)' }}>{t('Dates & Yield')}</h3>

            <div className="form-group">
              <label htmlFor="planting-date" className="form-label">{t('Planting Date *')}</label>
              <input id="planting-date" name="plantingDate" type="date" className="form-input"
                value={form.plantingDate} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label htmlFor="harvest-date" className="form-label">{t('Expected Harvest Date')}</label>
              <input id="harvest-date" name="expectedHarvestDate" type="date" className="form-input"
                value={form.expectedHarvestDate} onChange={handleChange} />
            </div>

            <div className="form-row-2">
              <div className="form-group" style={{ flex: 2 }}>
                <label htmlFor="expected-yield" className="form-label">{t('Expected Yield')}</label>
                <input id="expected-yield" name="expectedYield" type="number" className="form-input"
                  placeholder="e.g. 1500" value={form.expectedYield} onChange={handleChange} min="0" />
              </div>
              <div className="form-group" style={{ flex: 1 }}>
                <label htmlFor="yield-unit" className="form-label">{t('Unit')}</label>
                <select id="yield-unit" name="yieldUnit" className="form-input form-select"
                  value={form.yieldUnit} onChange={handleChange}>
                  {YIELD_UNITS.map((u) => <option key={u} value={u}>{t(u)}</option>)}
                </select>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 style={{ fontWeight: 600, marginBottom: '1rem', color: 'var(--text-primary)' }}>{t('Soil & Water')}</h3>

            <div className="form-group">
              <label htmlFor="soil-type" className="form-label">{t('Soil Type')}</label>
              <select id="soil-type" name="soilType" className="form-input form-select"
                value={form.soilType} onChange={handleChange}>
                {SOIL_TYPES.map((s) => <option key={s} value={s}>{t(s)}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="water-avail" className="form-label">{t('Water Availability')}</label>
              <select id="water-avail" name="waterAvailability" className="form-input form-select"
                value={form.waterAvailability} onChange={handleChange}>
                {WATER_AVAILABILITY.map((w) => <option key={w} value={w}>{t(w)}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="crop-notes" className="form-label">{t('Notes (Optional)')}</label>
              <textarea id="crop-notes" name="notes" className="form-input" rows={3}
                placeholder={t('Any additional notes about this crop...')}
                value={form.notes} onChange={handleChange}
                style={{ resize: 'vertical' }} />
            </div>
          </div>

          <button id="submit-add-crop" type="submit" className="btn btn-primary btn-full btn-lg"
            disabled={loading}>
            {loading ? (
              <>
                <span className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} />
                {t('Adding Crop...')}
              </>
            ) : t('🌱 Add Crop')}
          </button>

        </form>
      </div>
    </div>
  );
};

export default AddCropPage;
