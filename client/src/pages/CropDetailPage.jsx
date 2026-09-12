import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import { useCrops } from '../context/CropContext';
import { cropAPI } from '../services/cropAPI';
import Badge from '../components/common/Badge';
import Alert from '../components/common/Alert';
import Loader from '../components/common/Loader';
import { formatDate, timeAgo, daysUntilHarvest } from '../utils/dateUtils';
import { GROWTH_STAGES, getNextStage } from '../constants/growthStages';

const STAGE_COLORS = {
  Planting: 'gray', Seedling: 'green', Vegetative: 'green',
  Flowering: 'yellow', 'Fruit Development': 'blue', Harvest: 'yellow',
};

const CropDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { updateGrowthStage, deleteCrop } = useCrops();

  const [crop, setCrop] = useState(null);
  const [wateringLogs, setWateringLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stageUpdating, setStageUpdating] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showWaterModal, setShowWaterModal] = useState(false);
  const [waterForm, setWaterForm] = useState({ wateredAt: '', method: 'Manual', notes: '' });
  const [waterLoading, setWaterLoading] = useState(false);

  useEffect(() => {
    const fetchCrop = async () => {
      try {
        const res = await cropAPI.getCropById(id);
        setCrop(res.data.data.crop);
        setWateringLogs(res.data.data.wateringLogs || []);
      } catch {
        setError('Crop not found or access denied.');
      } finally {
        setLoading(false);
      }
    };
    fetchCrop();
  }, [id]);

  const handleNextStage = async () => {
    const nextStage = getNextStage(crop.currentGrowthStage);
    if (!nextStage) return;
    setStageUpdating(true);
    try {
      const updated = await updateGrowthStage(id, nextStage);
      setCrop(updated);
    } finally {
      setStageUpdating(false);
    }
  };

  const handleDelete = async () => {
    await deleteCrop(id);
    navigate('/crops', { replace: true });
  };

  const handleLogWater = async (e) => {
    e.preventDefault();
    setWaterLoading(true);
    try {
      const res = await cropAPI.logWatering(id, waterForm);
      setWateringLogs((prev) => [res.data.data.wateringLog, ...prev]);
      setCrop((c) => ({ ...c, lastWateredAt: res.data.data.wateringLog.wateredAt }));
      setShowWaterModal(false);
      setWaterForm({ wateredAt: '', method: 'Manual', notes: '' });
    } finally {
      setWaterLoading(false);
    }
  };

  if (loading) return <div className="app-container"><Loader fullScreen text="Loading crop..." /></div>;
  if (error) return <div className="app-container"><div className="page page-with-header"><Alert type="danger">{error}</Alert></div></div>;

  const daysToHarvest = crop.expectedHarvestDate ? daysUntilHarvest(crop.expectedHarvestDate) : null;
  const nextStage = getNextStage(crop.currentGrowthStage);
  const stageIndex = GROWTH_STAGES.findIndex((s) => s.id === crop.currentGrowthStage);

  return (
    <div className="app-container">
      <Navbar title={crop.cropName} showBack />
      <div className="page page-with-header fade-in" style={{ paddingBottom: '2rem' }}>

        {/* Header card */}
        <div className="card card-green" style={{ position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h2 style={{ fontSize: 'var(--text-2xl)', color: 'white', fontWeight: 800 }}>
                🌿 {crop.cropName}
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 'var(--text-sm)', marginTop: '0.25rem' }}>
                {crop.landArea} {crop.areaUnit} · {crop.soilType} soil
              </p>
            </div>
            <Link to={`/crops/${id}/edit`} className="btn btn-sm"
              style={{ background: 'rgba(255,255,255,0.2)', color: 'white', border: 'none' }}>
              Edit
            </Link>
          </div>
          {daysToHarvest !== null && (
            <div style={{ marginTop: '1rem', background: 'rgba(255,255,255,0.15)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-3)' }}>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 'var(--text-xs)' }}>Expected Harvest</p>
              <p style={{ color: 'white', fontWeight: 700 }}>
                {formatDate(crop.expectedHarvestDate)}
                {daysToHarvest > 0 ? ` — ${daysToHarvest} days away` : ' — Ready to harvest!'}
              </p>
            </div>
          )}
        </div>

        {/* Growth Stage Tracker */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Growth Stage</h3>
            <Badge variant={STAGE_COLORS[crop.currentGrowthStage] || 'gray'}>
              {crop.currentGrowthStage}
            </Badge>
          </div>

          {/* Stage stepper */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginBottom: '1rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
            {GROWTH_STAGES.map((stage, idx) => (
              <div key={stage.id} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', flexShrink: 0 }}>
                <div style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem',
                }}>
                  <div style={{
                    width: '2rem', height: '2rem', borderRadius: '50%',
                    background: idx <= stageIndex ? 'var(--green-600)' : 'var(--neutral-100)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.8rem', color: idx <= stageIndex ? 'white' : 'var(--text-muted)',
                    border: idx === stageIndex ? '2px solid var(--green-400)' : 'none',
                    boxShadow: idx === stageIndex ? '0 0 0 3px rgba(45,125,70,0.2)' : 'none',
                  }}>
                    {idx < stageIndex ? '✓' : stage.icon}
                  </div>
                  <span style={{ fontSize: '0.55rem', color: idx <= stageIndex ? 'var(--green-700)' : 'var(--text-muted)', fontWeight: 600, textAlign: 'center', maxWidth: '3rem' }}>
                    {stage.label}
                  </span>
                </div>
                {idx < GROWTH_STAGES.length - 1 && (
                  <div style={{ width: '1.5rem', height: '2px', background: idx < stageIndex ? 'var(--green-400)' : 'var(--neutral-200)', marginBottom: '1.2rem' }} />
                )}
              </div>
            ))}
          </div>

          {nextStage && (
            <button
              id="advance-stage-btn"
              className="btn btn-outline btn-full btn-sm"
              onClick={handleNextStage}
              disabled={stageUpdating}
            >
              {stageUpdating ? 'Updating...' : `→ Advance to ${nextStage}`}
            </button>
          )}
          {!nextStage && (
            <Alert type="success">🌾 This crop has reached the Harvest stage!</Alert>
          )}
        </div>

        {/* Watering */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontWeight: 600, color: 'var(--text-primary)' }}>💧 Watering</h3>
            <button id="log-water-btn" className="btn btn-primary btn-sm"
              onClick={() => setShowWaterModal(true)}>
              + Log Watering
            </button>
          </div>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
            Last watered: <strong>{crop.lastWateredAt ? timeAgo(crop.lastWateredAt) : 'Not recorded'}</strong>
          </p>

          {wateringLogs.length > 0 && (
            <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {wateringLogs.slice(0, 5).map((log) => (
                <div key={log._id} style={{
                  display: 'flex', justifyContent: 'space-between',
                  padding: 'var(--space-2) var(--space-3)',
                  background: 'var(--green-50)', borderRadius: 'var(--radius-md)',
                  fontSize: 'var(--text-xs)'
                }}>
                  <span>💧 {log.method}</span>
                  <span style={{ color: 'var(--text-muted)' }}>{formatDate(log.wateredAt)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Crop Info */}
        <div className="card">
          <h3 style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '1rem' }}>Crop Info</h3>
          {[
            ['Planted On', formatDate(crop.plantingDate)],
            ['Soil Type', crop.soilType],
            ['Water Source', crop.waterAvailability],
            ['Expected Yield', crop.expectedYield ? `${crop.expectedYield} ${crop.yieldUnit}` : '—'],
          ].map(([label, value]) => (
            <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: 'var(--space-2) 0', borderBottom: '1px solid var(--neutral-100)', fontSize: 'var(--text-sm)' }}>
              <span style={{ color: 'var(--text-muted)' }}>{label}</span>
              <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{value}</span>
            </div>
          ))}
          {crop.notes && (
            <p style={{ marginTop: '0.75rem', fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
              📝 {crop.notes}
            </p>
          )}
        </div>

        {/* Delete */}
        {!showDeleteConfirm ? (
          <button id="delete-crop-btn" className="btn btn-danger btn-full"
            onClick={() => setShowDeleteConfirm(true)}>
            🗑 Delete Crop
          </button>
        ) : (
          <div className="card" style={{ border: '1px solid var(--color-danger)' }}>
            <p style={{ fontWeight: 600, color: 'var(--color-danger)', marginBottom: '0.75rem' }}>
              Are you sure you want to delete {crop.cropName}?
            </p>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button id="confirm-delete-btn" className="btn btn-danger" style={{ flex: 1 }} onClick={handleDelete}>Yes, Delete</button>
              <button className="btn btn-outline" style={{ flex: 1 }} onClick={() => setShowDeleteConfirm(false)}>Cancel</button>
            </div>
          </div>
        )}

        {/* Water Modal */}
        {showWaterModal && (
          <div style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
            display: 'flex', alignItems: 'flex-end', zIndex: 200,
          }}>
            <div style={{ background: 'white', borderRadius: '1.5rem 1.5rem 0 0', padding: '1.5rem', width: '100%', maxWidth: '480px', margin: '0 auto' }}>
              <h3 style={{ fontWeight: 700, marginBottom: '1rem' }}>Log Watering</h3>
              <form onSubmit={handleLogWater}>
                <div className="form-group">
                  <label className="form-label">Date & Time</label>
                  <input type="datetime-local" name="wateredAt" className="form-input"
                    value={waterForm.wateredAt}
                    onChange={(e) => setWaterForm((p) => ({ ...p, wateredAt: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label className="form-label">Method</label>
                  <select name="method" className="form-input form-select"
                    value={waterForm.method}
                    onChange={(e) => setWaterForm((p) => ({ ...p, method: e.target.value }))}>
                    {['Drip', 'Sprinkler', 'Flood', 'Manual', 'Rain', 'Other'].map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Notes</label>
                  <input type="text" className="form-input" placeholder="Optional notes..."
                    value={waterForm.notes}
                    onChange={(e) => setWaterForm((p) => ({ ...p, notes: e.target.value }))} />
                </div>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={waterLoading}>
                    {waterLoading ? 'Saving...' : '💧 Save'}
                  </button>
                  <button type="button" className="btn btn-outline" style={{ flex: 1 }}
                    onClick={() => setShowWaterModal(false)}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CropDetailPage;
