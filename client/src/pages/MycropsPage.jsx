import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import BottomNav from '../components/layout/BottomNav';
import { useCrops } from '../context/CropContext';
import { formatDate } from '../utils/dateUtils';
import Loader from '../components/common/Loader';
import Badge from '../components/common/Badge';
import './MycropsPage.css';

const STAGE_COLORS = {
  Planting: 'gray',
  Seedling: 'green',
  Vegetative: 'green',
  Flowering: 'yellow',
  'Fruit Development': 'blue',
  Harvest: 'yellow',
};

const MycropsPage = () => {
  const { crops, loading, error } = useCrops();

  const activeCrops = crops.filter((c) => c.status === 'Active');
  const harvestedCrops = crops.filter((c) => c.status === 'Harvested');

  return (
    <div className="app-container">
      <Navbar title="My Crops" />
      <div className="page page-with-header fade-in">

        {/* Header */}
        <div className="crops-header">
          <div>
            <p className="crops-count">{activeCrops.length} active crop{activeCrops.length !== 1 ? 's' : ''}</p>
          </div>
          <Link to="/crops/add" id="add-crop-fab" className="btn btn-primary btn-sm">
            + Add Crop
          </Link>
        </div>

        {loading && <Loader text="Loading crops..." />}
        {error && <p className="text-sm" style={{ color: 'var(--color-danger)' }}>{error}</p>}

        {!loading && crops.length === 0 && (
          <div className="empty-state card" id="crops-empty-state">
            <span className="empty-icon">🌾</span>
            <p className="empty-title">No crops added yet</p>
            <p className="empty-desc">Start by adding your first crop</p>
            <Link to="/crops/add" id="add-first-crop-link" className="btn btn-primary mt-4">
              + Add First Crop
            </Link>
          </div>
        )}

        {!loading && activeCrops.length > 0 && (
          <section>
            <h3 className="section-title mb-3">Active Crops</h3>
            <div className="crops-list">
              {activeCrops.map((crop) => (
                <Link
                  key={crop._id}
                  to={`/crops/${crop._id}`}
                  className="crop-card card"
                  id={`crop-card-${crop._id}`}
                >
                  <div className="crop-card-top">
                    <div className="crop-card-icon">🌿</div>
                    <div className="crop-card-info">
                      <h4 className="crop-card-name">{crop.cropName}</h4>
                      <p className="crop-card-area">
                        {crop.landArea} {crop.areaUnit} · Planted {formatDate(crop.plantingDate)}
                      </p>
                    </div>
                    <Badge variant={STAGE_COLORS[crop.currentGrowthStage] || 'gray'}>
                      {crop.currentGrowthStage}
                    </Badge>
                  </div>

                  {crop.expectedHarvestDate && (
                    <div className="crop-card-harvest">
                      <span>🌾 Expected Harvest:</span>
                      <span>{formatDate(crop.expectedHarvestDate)}</span>
                    </div>
                  )}
                </Link>
              ))}
            </div>
          </section>
        )}

        {!loading && harvestedCrops.length > 0 && (
          <section className="mt-4">
            <h3 className="section-title mb-3">Harvested</h3>
            <div className="crops-list">
              {harvestedCrops.map((crop) => (
                <Link
                  key={crop._id}
                  to={`/crops/${crop._id}`}
                  className="crop-card card"
                  style={{ opacity: 0.7 }}
                >
                  <div className="crop-card-top">
                    <div className="crop-card-icon">✅</div>
                    <div className="crop-card-info">
                      <h4 className="crop-card-name">{crop.cropName}</h4>
                      <p className="crop-card-area">{crop.landArea} {crop.areaUnit}</p>
                    </div>
                    <Badge variant="gray">Harvested</Badge>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

      </div>
      <BottomNav />
    </div>
  );
};

export default MycropsPage;
