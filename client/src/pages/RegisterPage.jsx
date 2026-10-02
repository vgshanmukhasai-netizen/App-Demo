import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage, LANGUAGES } from '../context/LanguageContext';
import Alert from '../components/common/Alert';
import {
  SOIL_TYPES, WATER_AVAILABILITY, IRRIGATION_TYPES,
  AREA_UNITS, INDIAN_STATES,
} from '../constants/farmConstants';
import './AuthPages.css';

const STEPS = [
  { id: 1, title: 'Personal Details', icon: '👤' },
  { id: 2, title: 'Farm Location', icon: '📍' },
  { id: 3, title: 'Land & Soil', icon: '🌱' },
];

const RegisterPage = () => {
  const { register } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    // Step 1: Personal
    name: '',
    phone: '',
    email: '',
    password: '',
    // Step 2: Location
    village: '',
    district: '',
    state: '',
    // Step 3: Land
    totalArea: '',
    areaUnit: 'acres',
    soilType: 'Loamy',
    waterAvailability: 'Rain-fed',
    irrigationType: 'None',
  });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const validateStep = () => {
    if (step === 1) {
      if (!form.name.trim()) return t('Please enter your name.');
      if (!/^[6-9]\d{9}$/.test(form.phone)) return t('Enter a valid 10-digit phone number.');
      if (!/\S+@\S+\.\S+/.test(form.email)) return t('Enter a valid email address.');
      if (form.password.length < 6) return t('Password must be at least 6 characters.');
    }
    if (step === 2) {
      if (!form.district.trim()) return t('Please enter your district.');
      if (!form.state) return t('Please select your state.');
    }
    return null;
  };

  const nextStep = () => {
    const err = validateStep();
    if (err) { setError(err); return; }
    setError('');
    setStep((s) => s + 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validateStep();
    if (err) { setError(err); return; }

    setLoading(true);
    try {
      await register({
        name: form.name,
        phone: form.phone,
        email: form.email,
        password: form.password,
        location: {
          village: form.village,
          district: form.district,
          state: form.state,
        },
        landDetails: {
          totalArea: parseFloat(form.totalArea) || 0,
          areaUnit: form.areaUnit,
          soilType: form.soilType,
          waterAvailability: form.waterAvailability,
          irrigationType: form.irrigationType,
        },
      });
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || t('Registration failed. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page" id="register-page">
      {/* Top banner */}
      <div className="auth-header auth-header-compact">
        <div className="auth-logo">🌾</div>
        <h1 className="auth-app-name">{t('Join AgroSelf')}</h1>
        <p className="auth-subtitle">{t('Create your free farmer account')}</p>
      </div>

      {/* Step indicator */}
      <div className="step-indicator">
        {STEPS.map((s) => (
          <div
            key={s.id}
            className={`step-item ${step === s.id ? 'active' : ''} ${step > s.id ? 'done' : ''}`}
          >
            <div className="step-dot">{step > s.id ? '✓' : s.icon}</div>
            <span className="step-label">{t(s.title)}</span>
          </div>
        ))}
      </div>

      {/* Card */}
      <div className="auth-card">
        <div className="form-group">
          <label className="form-label" htmlFor="register-language">{t('Language')}</label>
          <select id="register-language" className="form-input form-select" value={language} onChange={(event) => setLanguage(event.target.value)}>
            {LANGUAGES.map((item) => <option key={item.code} value={item.code}>{item.nativeLabel}</option>)}
          </select>
        </div>
        {error && (
          <Alert type="danger" className="mb-4">
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit} id="register-form" noValidate>

          {/* ── STEP 1: Personal ── */}
          {step === 1 && (
            <div className="fade-in">
              <h2 className="auth-card-title">{t('Personal Details')}</h2>
              <p className="auth-card-desc mb-4">{t('Tell us about yourself')}</p>

              <div className="form-group">
                <label htmlFor="reg-name" className="form-label">{t('Full Name *')}</label>
                <input id="reg-name" name="name" type="text" className="form-input"
                  placeholder={t('e.g. Ramesh Kumar')} value={form.name} onChange={handleChange} />
              </div>

              <div className="form-group">
                <label htmlFor="reg-phone" className="form-label">{t('Phone Number *')}</label>
                <input id="reg-phone" name="phone" type="tel" className="form-input"
                  placeholder={t('e.g. 9876543210')} value={form.phone} onChange={handleChange}
                  maxLength={10} />
              </div>

              <div className="form-group">
                <label htmlFor="reg-email" className="form-label">{t('Email Address *')}</label>
                <input id="reg-email" name="email" type="email" className="form-input"
                  placeholder={t('ramesh@example.com')} value={form.email} onChange={handleChange} />
              </div>

              <div className="form-group">
                <label htmlFor="reg-password" className="form-label">{t('Password *')}</label>
                <div className="password-wrapper">
                  <input id="reg-password" name="password"
                    type={showPassword ? 'text' : 'password'} className="form-input"
                    placeholder={t('Min. 6 characters')} value={form.password} onChange={handleChange} />
                  <button type="button" className="password-toggle"
                    onClick={() => setShowPassword((v) => !v)}>
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              <button type="button" id="reg-next-1" className="btn btn-primary btn-full btn-lg"
                onClick={nextStep}>
                {t('Continue →')}
              </button>
            </div>
          )}

          {/* ── STEP 2: Location ── */}
          {step === 2 && (
            <div className="fade-in">
              <h2 className="auth-card-title">{t('Farm Location')}</h2>
              <p className="auth-card-desc mb-4">{t('Where is your farm located?')}</p>

              <div className="form-group">
                <label htmlFor="reg-village" className="form-label">{t('Village / Town')}</label>
                <input id="reg-village" name="village" type="text" className="form-input"
                  placeholder={t('e.g. Kothapalli')} value={form.village} onChange={handleChange} />
              </div>

              <div className="form-group">
                <label htmlFor="reg-district" className="form-label">{t('District *')}</label>
                <input id="reg-district" name="district" type="text" className="form-input"
                  placeholder={t('e.g. Guntur')} value={form.district} onChange={handleChange} />
              </div>

              <div className="form-group">
                <label htmlFor="reg-state" className="form-label">{t('State *')}</label>
                <select id="reg-state" name="state" className="form-input form-select"
                  value={form.state} onChange={handleChange}>
                  <option value="">{t('Select your state')}</option>
                  {INDIAN_STATES.map((s) => (
                    <option key={s} value={s}>{t(s)}</option>
                  ))}
                </select>
              </div>

              <div className="form-row-2">
                <button type="button" className="btn btn-outline" onClick={() => setStep(1)}>
                  {t('← Back')}
                </button>
                <button type="button" id="reg-next-2" className="btn btn-primary"
                  onClick={nextStep}>
                  {t('Continue →')}
                </button>
              </div>
            </div>
          )}

          {/* ── STEP 3: Land ── */}
          {step === 3 && (
            <div className="fade-in">
              <h2 className="auth-card-title">{t('Land Details')}</h2>
              <p className="auth-card-desc mb-4">{t('Tell us about your farmland')}</p>

              <div className="form-row-2">
                <div className="form-group" style={{ flex: 2 }}>
                  <label htmlFor="reg-area" className="form-label">{t('Land Area')}</label>
                  <input id="reg-area" name="totalArea" type="number" className="form-input"
                    placeholder={t('e.g. 3')} value={form.totalArea} onChange={handleChange}
                    min="0" step="0.5" />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label htmlFor="reg-areaunit" className="form-label">{t('Unit')}</label>
                  <select id="reg-areaunit" name="areaUnit" className="form-input form-select"
                    value={form.areaUnit} onChange={handleChange}>
                    {AREA_UNITS.map((u) => <option key={u} value={u}>{t(u)}</option>)}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="reg-soil" className="form-label">{t('Soil Type')}</label>
                <select id="reg-soil" name="soilType" className="form-input form-select"
                  value={form.soilType} onChange={handleChange}>
                  {SOIL_TYPES.map((s) => <option key={s} value={s}>{t(s)}</option>)}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="reg-water" className="form-label">{t('Water Availability')}</label>
                <select id="reg-water" name="waterAvailability" className="form-input form-select"
                  value={form.waterAvailability} onChange={handleChange}>
                  {WATER_AVAILABILITY.map((w) => <option key={w} value={w}>{t(w)}</option>)}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="reg-irrigation" className="form-label">{t('Irrigation Type')}</label>
                <select id="reg-irrigation" name="irrigationType" className="form-input form-select"
                  value={form.irrigationType} onChange={handleChange}>
                  {IRRIGATION_TYPES.map((i) => <option key={i} value={i}>{t(i)}</option>)}
                </select>
              </div>

              <div className="form-row-2">
                <button type="button" className="btn btn-outline" onClick={() => setStep(2)}>
                  {t('← Back')}
                </button>
                <button id="reg-submit-btn" type="submit" className="btn btn-primary"
                  disabled={loading}>
                  {loading ? (
                    <>
                      <span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} />
                      {t('Creating...')}
                    </>
                  ) : (
                    t('Create Account ✓')
                  )}
                </button>
              </div>
            </div>
          )}
        </form>

        {step === 1 && (
          <p className="auth-switch-text mt-4">
            {t('Already have an account?')}{' '}
            <Link to="/login" id="go-to-login-link">{t('Login here')}</Link>
          </p>
        )}
      </div>
    </div>
  );
};

export default RegisterPage;
