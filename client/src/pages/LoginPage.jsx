import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Alert from '../components/common/Alert';
import './AuthPages.css';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError('Please enter your email and password.');
      return;
    }
    setLoading(true);
    try {
      await login(form);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page" id="login-page">
      {/* Top green banner */}
      <div className="auth-header">
        <div className="auth-logo">🌾</div>
        <h1 className="auth-app-name">AgroSelf</h1>
        <p className="auth-subtitle">Smart Farming for Every Farmer</p>
      </div>

      {/* Card */}
      <div className="auth-card">
        <h2 className="auth-card-title">Welcome Back 👋</h2>
        <p className="auth-card-desc">Login to manage your farm</p>

        {error && (
          <Alert type="danger" className="mb-4">
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit} id="login-form" noValidate>
          {/* Email */}
          <div className="form-group">
            <label htmlFor="login-email" className="form-label">
              Email Address
            </label>
            <input
              id="login-email"
              name="email"
              type="email"
              className="form-input"
              placeholder="ramesh@example.com"
              value={form.email}
              onChange={handleChange}
              autoComplete="email"
              required
            />
          </div>

          {/* Password */}
          <div className="form-group">
            <label htmlFor="login-password" className="form-label">
              Password
            </label>
            <div className="password-wrapper">
              <input
                id="login-password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                className="form-input"
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword((v) => !v)}
                aria-label="Toggle password visibility"
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          <button
            id="login-submit-btn"
            type="submit"
            className="btn btn-primary btn-full btn-lg"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} />
                Logging in...
              </>
            ) : (
              'Login to AgroSelf'
            )}
          </button>
        </form>

        <div className="divider-text mt-4 mb-4">
          <span>New farmer?</span>
        </div>

        <Link
          to="/register"
          id="go-to-register-btn"
          className="btn btn-outline btn-full"
        >
          Create New Account
        </Link>
      </div>
    </div>
  );
};

export default LoginPage;
