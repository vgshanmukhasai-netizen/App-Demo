import { useState } from 'react';
import Navbar from '../components/layout/Navbar';
import BottomNav from '../components/layout/BottomNav';
import Alert from '../components/common/Alert';
import { useAuth } from '../context/AuthContext';
import { useLanguage, LANGUAGES } from '../context/LanguageContext';
import { farmerAPI } from '../services/farmerAPI';
import { INDIAN_STATES } from '../constants/farmConstants';

const SettingsPage = () => {
  const { farmer, updateFarmerLocally } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const [form, setForm] = useState({
    name: farmer?.name || '',
    phone: farmer?.phone || '',
    village: farmer?.location?.village || '',
    district: farmer?.location?.district || '',
    state: farmer?.location?.state || '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      const response = await farmerAPI.updateProfile({
        name: form.name,
        phone: form.phone,
        location: { village: form.village, district: form.district, state: form.state },
      });
      updateFarmerLocally(response.data.data.farmer);
      setSuccess(t('Settings saved successfully.'));
    } catch (requestError) {
      setError(requestError.response?.data?.message || t('Could not save settings. Please try again.'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="app-container">
      <Navbar title="Settings" showBack />
      <div className="page page-with-header fade-in">
        <section className="card" style={{ marginBottom: '1rem' }}>
          <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, marginBottom: '0.35rem' }}>{t('Language')}</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)', marginBottom: '1rem' }}>
            {t('Choose the language used across AgroSelf.')}
          </p>
          <label className="form-label" htmlFor="settings-language">{t('Language')}</label>
          <select
            id="settings-language"
            className="form-input form-select"
            value={language}
            onChange={(event) => setLanguage(event.target.value)}
          >
            {LANGUAGES.map((item) => (
              <option key={item.code} value={item.code}>{item.nativeLabel}</option>
            ))}
          </select>
        </section>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <section className="card">
            <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, marginBottom: '1rem' }}>{t('Account details')}</h2>
            <div className="form-group">
              <label className="form-label" htmlFor="settings-name">{t('Full name')}</label>
              <input id="settings-name" name="name" className="form-input" value={form.name} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="settings-email">{t('Email')}</label>
              <input id="settings-email" className="form-input" value={farmer?.email || ''} readOnly />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" htmlFor="settings-phone">{t('Phone number')}</label>
              <input id="settings-phone" name="phone" type="tel" className="form-input" value={form.phone} onChange={handleChange} maxLength={10} />
            </div>
          </section>

          <section className="card">
            <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, marginBottom: '1rem' }}>{t('Farm location')}</h2>
            <div className="form-group">
              <label className="form-label" htmlFor="settings-village">{t('Village')}</label>
              <input id="settings-village" name="village" className="form-input" value={form.village} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="settings-district">{t('District')}</label>
              <input id="settings-district" name="district" className="form-input" value={form.district} onChange={handleChange} />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" htmlFor="settings-state">{t('State')}</label>
              <select id="settings-state" name="state" className="form-input form-select" value={form.state} onChange={handleChange}>
                <option value="">{t('Select State')}</option>
                {INDIAN_STATES.map((state) => <option key={state} value={state}>{t(state)}</option>)}
              </select>
            </div>
          </section>

          {success && <Alert type="success">{success}</Alert>}
          {error && <Alert type="danger">{error}</Alert>}
          <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={saving}>
            {saving ? t('Saving...') : t('Save settings')}
          </button>
        </form>
      </div>
      <BottomNav />
    </div>
  );
};

export default SettingsPage;