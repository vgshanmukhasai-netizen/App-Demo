import { useState } from 'react';
import Navbar from '../components/layout/Navbar';
import BottomNav from '../components/layout/BottomNav';
import Alert from '../components/common/Alert';
import { calculateProfit, formatCurrency } from '../utils/calculatorUtils';
import { COMMON_CROPS, AREA_UNITS } from '../constants/farmConstants';

const COST_FIELDS = [
  { name: 'seedCost', label: '🌱 Seed Cost' },
  { name: 'fertilizerCost', label: '🧪 Fertilizer Cost' },
  { name: 'labourCost', label: '👷 Labour Cost' },
  { name: 'irrigationCost', label: '💧 Irrigation Cost' },
  { name: 'pesticideCost', label: '🧴 Pesticide Cost' },
  { name: 'otherCosts', label: '📦 Other Costs' },
];

const ProfitCalculatorPage = () => {
  const [form, setForm] = useState({
    cropName: '', landArea: '1', areaUnit: 'acres',
    expectedYieldPerAcre: '', sellingPricePerKg: '',
    seedCost: '', fertilizerCost: '', labourCost: '',
    irrigationCost: '', pesticideCost: '', otherCosts: '',
  });
  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
    setResult(null);
  };

  const handleCalculate = (e) => {
    e.preventDefault();
    const r = calculateProfit({
      landArea: parseFloat(form.landArea) || 1,
      expectedYieldPerAcre: parseFloat(form.expectedYieldPerAcre) || 0,
      sellingPricePerKg: parseFloat(form.sellingPricePerKg) || 0,
      seedCost: parseFloat(form.seedCost) || 0,
      fertilizerCost: parseFloat(form.fertilizerCost) || 0,
      labourCost: parseFloat(form.labourCost) || 0,
      irrigationCost: parseFloat(form.irrigationCost) || 0,
      pesticideCost: parseFloat(form.pesticideCost) || 0,
      otherCosts: parseFloat(form.otherCosts) || 0,
    });
    setResult(r);
  };

  return (
    <div className="app-container">
      <Navbar title="Profit Calculator" showBack />
      <div className="page page-with-header fade-in" style={{ paddingBottom: '2rem' }}>

        <Alert type="warning" icon="⚠️">
          All figures are <strong>estimates</strong> based on your inputs. Actual profit may vary.
        </Alert>

        <form onSubmit={handleCalculate} id="profit-calculator-form" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

          {/* Crop & Area */}
          <div className="card">
            <h3 style={{ fontWeight: 600, marginBottom: '1rem' }}>🌾 Crop & Area</h3>
            <div className="form-group">
              <label className="form-label">Crop</label>
              <select name="cropName" className="form-input form-select" value={form.cropName} onChange={handleChange}>
                <option value="">Select Crop</option>
                {COMMON_CROPS.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-row-2">
              <div className="form-group" style={{ flex: 2 }}>
                <label className="form-label">Land Area</label>
                <input name="landArea" type="number" className="form-input" value={form.landArea} onChange={handleChange} min="0.1" step="0.5" />
              </div>
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">Unit</label>
                <select name="areaUnit" className="form-input form-select" value={form.areaUnit} onChange={handleChange}>
                  {AREA_UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Yield & Price */}
          <div className="card">
            <h3 style={{ fontWeight: 600, marginBottom: '1rem' }}>📦 Yield & Price</h3>
            <div className="form-group">
              <label className="form-label">Expected Yield per Acre (kg)</label>
              <input name="expectedYieldPerAcre" type="number" className="form-input"
                placeholder="e.g. 1500" value={form.expectedYieldPerAcre} onChange={handleChange} min="0" />
            </div>
            <div className="form-group">
              <label className="form-label">Selling Price per kg (₹)</label>
              <input name="sellingPricePerKg" type="number" className="form-input"
                placeholder="e.g. 30" value={form.sellingPricePerKg} onChange={handleChange} min="0" step="0.5" />
            </div>
          </div>

          {/* Costs */}
          <div className="card">
            <h3 style={{ fontWeight: 600, marginBottom: '1rem' }}>💸 Cultivation Costs (₹)</h3>
            {COST_FIELDS.map((f) => (
              <div className="form-group" key={f.name}>
                <label className="form-label">{f.label}</label>
                <input name={f.name} type="number" className="form-input"
                  placeholder="0" value={form[f.name]} onChange={handleChange} min="0" />
              </div>
            ))}
          </div>

          <button id="calculate-profit-btn" type="submit" className="btn btn-primary btn-full btn-lg">
            💰 Calculate Profit
          </button>
        </form>

        {/* Result */}
        {result && (
          <div className="card fade-in" id="profit-result" style={{ marginTop: '0', border: '2px solid var(--green-300)' }}>
            <h3 style={{ fontWeight: 700, marginBottom: '1rem', color: 'var(--text-primary)' }}>
              📊 Profit Estimate {form.cropName && `— ${form.cropName}`}
            </h3>

            {[
              { label: 'Total Yield', value: `${result.totalYield} kg`, color: 'var(--text-primary)' },
              { label: 'Expected Revenue', value: formatCurrency(result.expectedRevenue), color: 'var(--color-info)' },
              { label: 'Total Cost', value: formatCurrency(result.totalCost), color: 'var(--color-danger)' },
            ].map(({ label, value, color }) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid var(--neutral-100)', fontSize: 'var(--text-sm)' }}>
                <span style={{ color: 'var(--text-muted)' }}>{label}</span>
                <span style={{ fontWeight: 600, color }}>{value}</span>
              </div>
            ))}

            <div style={{ marginTop: '1rem', background: result.isProfitable ? 'var(--green-50)' : '#fee2e2', borderRadius: 'var(--radius-xl)', padding: '1rem', textAlign: 'center' }}>
              <p style={{ fontSize: 'var(--text-xs)', color: result.isProfitable ? 'var(--green-700)' : 'var(--color-danger)', fontWeight: 600, marginBottom: '0.25rem' }}>
                ESTIMATED PROFIT
              </p>
              <p style={{ fontSize: '2rem', fontWeight: 800, color: result.isProfitable ? 'var(--green-600)' : 'var(--color-danger)', fontFamily: 'var(--font-heading)' }}>
                {result.isProfitable ? '+' : ''}{formatCurrency(result.estimatedProfit)}
              </p>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                {formatCurrency(result.profitPerAcre)} per acre · {result.profitMargin}% margin
              </p>
            </div>

            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', textAlign: 'center', marginTop: '0.75rem', fontStyle: 'italic' }}>
              * This is an estimate only. Market prices and actual yield may vary.
            </p>
          </div>
        )}
      </div>
      <BottomNav />
    </div>
  );
};
export default ProfitCalculatorPage;
