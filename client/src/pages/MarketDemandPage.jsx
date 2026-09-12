import { useEffect, useState } from 'react';
import Navbar from '../components/layout/Navbar';
import BottomNav from '../components/layout/BottomNav';
import Loader from '../components/common/Loader';
import Alert from '../components/common/Alert';
import { marketAPI } from '../services/marketAPI';
import { formatIndianNumber } from '../utils/calculatorUtils';

const DEMAND_COLORS = { High: 'green', Medium: 'yellow', Low: 'red' };
const TREND_ICONS = { Rising: '📈', Stable: '➡️', Falling: '📉' };

const MarketDemandPage = () => {
  const [marketData, setMarketData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await marketAPI.getAllMarketData();
        setMarketData(res.data.data.marketData);
      } catch {
        setError('Failed to load market data.');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const filtered = filter === 'All' ? marketData : marketData.filter((m) => m.demandLevel === filter);

  return (
    <div className="app-container">
      <Navbar title="Market & Demand" />
      <div className="page page-with-header fade-in">

        <Alert type="info" icon="ℹ️">
          <strong>Note:</strong> Prices shown are indicative estimates from APMC markets.
          Real market data integration planned for a future phase.
        </Alert>

        {/* Filter */}
        <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
          {['All', 'High', 'Medium', 'Low'].map((f) => (
            <button
              key={f}
              id={`filter-${f.toLowerCase()}`}
              className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setFilter(f)}
              style={{ flexShrink: 0 }}
            >
              {f} Demand
            </button>
          ))}
        </div>

        {loading && <Loader text="Loading market data..." />}
        {error && <Alert type="danger">{error}</Alert>}

        {!loading && filtered.length === 0 && (
          <div className="empty-state card">
            <span className="empty-icon">📊</span>
            <p className="empty-title">No data available</p>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {filtered.map((item) => (
            <div key={item._id} className="card" id={`market-card-${item.cropName.toLowerCase()}`}
              style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ fontSize: '2rem', width: '3rem', height: '3rem', background: 'var(--green-50)', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                🌾
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <h4 style={{ fontSize: 'var(--text-base)', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {item.cropName}
                  </h4>
                  <span className={`badge badge-${DEMAND_COLORS[item.demandLevel] || 'gray'}`}>
                    {item.demandLevel}
                  </span>
                </div>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                  {item.market} · {item.state}
                </p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: 'var(--text-lg)', fontWeight: 800, color: 'var(--green-700)' }}>
                  ₹{item.pricePerKg}/kg
                </p>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
                  {TREND_ICONS[item.priceTrend]} {item.priceTrend}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <BottomNav />
    </div>
  );
};
export default MarketDemandPage;
