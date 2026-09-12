import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import BottomNav from '../components/layout/BottomNav';
import { useAuth } from '../context/AuthContext';
import { useCrops } from '../context/CropContext';
import Badge from '../components/common/Badge';
import Alert from '../components/common/Alert';
import { farmerAPI } from '../services/farmerAPI';
import {
  SOIL_TYPES, WATER_AVAILABILITY, IRRIGATION_TYPES,
  AREA_UNITS, INDIAN_STATES,
} from '../constants/farmConstants';

const ProfilePage = () => {
  const { farmer, logout, updateFarmerLocally } = useAuth();
  const { activeCrops } = useCrops();
  const navigate = useNavigate();

  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [form, setForm] = useState({
    name: farmer?.name || '',
    phone: farmer?.phone || '',
    village: farmer?.location?.village || '',
    district: farmer?.location?.district || '',
    state: farmer?.location?.state || '',
    totalArea: farmer?.landDetails?.totalArea || '',
    areaUnit: farmer?.landDetails?.areaUnit || 'acres',
    soilType: farmer?.landDetails?.soilType || 'Loamy',
    waterAvailability: farmer?.landDetails?.waterAvailability || 'Rain-fed',
    irrigationType: farmer?.landDetails?.irrigationType || 'None',
  });

  const handleChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
    setError('');
    setSuccess('');
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await farmerAPI.updateProfile({
        name: form.name,
        phone: form.phone,
        location: { village: form.village, district: form.district, state: form.state },
        landDetails: {
          totalArea: parseFloat(form.totalArea) || 0,
          areaUnit: form.areaUnit,
          soilType: form.soilType,
          waterAvailability: form.waterAvailability,
          irrigationType: form.irrigationType,
        },
      });
      updateFarmerLocally(res.data.data.farmer);
      setSuccess('Profile updated successfully!');
      setEditing(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  if (!farmer) return null;

  return (
    <div className="app-container">
      <Navbar title="My Profile" />
      <div className="page page-with-header fade-in">

        {/* Avatar + Name */}
        <div className="card card-green" style={{ textAlign: 'center', padding: '2rem 1.5rem' }}>
          <div style={{
            width: '5rem', height: '5rem', borderRadius: '50%',
            background: 'rgba(255,255,255,0.2)', margin: '0 auto 1rem',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '2.5rem',
          }}>
            👨‍🌾
          </div>
          <h2 style={{ color: 'white', fontWeight: 800, fontSize: '1.5rem' }}>{farmer.name}</h2>
          <p style={{ color: 'rgba(255,255,255,0.75)', marginTop: '0.25rem' }}>{farmer.email}</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', marginTop: '1rem' }}>
            <Badge variant="green" style={{ background: 'rgba(255,255,255,0.2)', color: 'white' }}>
              {activeCrops.length} Active Crops
            </Badge>
          </div>
        </div>

        {success && <Alert type="success">{success}</Alert>}
        {error && <Alert type="danger">{error}</Alert>}

        {!editing ? (
          <>
            {/* Details View */}
            {[
              { title: '📞 Contact', fields: [['Phone', farmer.phone], ['Email', farmer.email]] },
              { title: '📍 Location', fields: [['Village', farmer.location?.village || '—'], ['District', farmer.location?.district || '—'], ['State', farmer.location?.state || '—']] },
              { title: '🌱 Land Details', fields: [
                ['Total Area', `${farmer.landDetails?.totalArea || 0} ${farmer.landDetails?.areaUnit || 'acres'}`],
                ['Soil Type', farmer.landDetails?.soilType || '—'],
                ['Water Source', farmer.landDetails?.waterAvailability || '—'],
                ['Irrigation', farmer.landDetails?.irrigationType || '—'],
              ]},
            ].map(({ title, fields }) => (
              <div key={title} className="card">
                <h3 style={{ fontWeight: 600, marginBottom: '0.75rem', fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {title}
                </h3>
                {fields.map(([label, value]) => (
                  <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid var(--neutral-100)', fontSize: 'var(--text-sm)' }}>
                    <span style={{ color: 'var(--text-muted)' }}>{label}</span>
                    <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{value}</span>
                  </div>
                ))}
              </div>
            ))}

            <button id="edit-profile-btn" className="btn btn-outline btn-full"
              onClick={() => { setEditing(true); setSuccess(''); }}>
              ✏️ Edit Profile
            </button>
            <button id="logout-btn" className="btn btn-danger btn-full" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          /* Edit Form */
          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="card">
              <h3 style={{ fontWeight: 600, marginBottom: '1rem' }}>Personal Details</h3>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input name="name" type="text" className="form-input" value={form.name} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input name="phone" type="tel" className="form-input" value={form.phone} onChange={handleChange} maxLength={10} />
              </div>
            </div>

            <div className="card">
              <h3 style={{ fontWeight: 600, marginBottom: '1rem' }}>Location</h3>
              <div className="form-group">
                <label className="form-label">Village / Town</label>
                <input name="village" type="text" className="form-input" value={form.village} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label">District</label>
                <input name="district" type="text" className="form-input" value={form.district} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label">State</label>
                <select name="state" className="form-input form-select" value={form.state} onChange={handleChange}>
                  <option value="">Select State</option>
                  {INDIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>

            <div className="card">
              <h3 style={{ fontWeight: 600, marginBottom: '1rem' }}>Land Details</h3>
              <div className="form-row-2">
                <div className="form-group" style={{ flex: 2 }}>
                  <label className="form-label">Total Area</label>
                  <input name="totalArea" type="number" className="form-input" value={form.totalArea} onChange={handleChange} min="0" step="0.5" />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Unit</label>
                  <select name="areaUnit" className="form-input form-select" value={form.areaUnit} onChange={handleChange}>
                    {AREA_UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Soil Type</label>
                <select name="soilType" className="form-input form-select" value={form.soilType} onChange={handleChange}>
                  {SOIL_TYPES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Water Availability</label>
                <select name="waterAvailability" className="form-input form-select" value={form.waterAvailability} onChange={handleChange}>
                  {WATER_AVAILABILITY.map((w) => <option key={w} value={w}>{w}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Irrigation Type</label>
                <select name="irrigationType" className="form-input form-select" value={form.irrigationType} onChange={handleChange}>
                  {IRRIGATION_TYPES.map((i) => <option key={i} value={i}>{i}</option>)}
                </select>
              </div>
            </div>

            <div className="form-row-2">
              <button type="button" className="btn btn-outline" style={{ flex: 1 }} onClick={() => setEditing(false)}>
                Cancel
              </button>
              <button id="save-profile-btn" type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={loading}>
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        )}
      </div>
      <BottomNav />
    </div>
  );
};

export default ProfilePage;
