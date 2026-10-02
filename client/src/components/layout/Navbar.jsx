import { Link, useNavigate } from 'react-router-dom';
import { useNetwork } from '../../context/NetworkContext';
import { useLanguage } from '../../context/LanguageContext';
import './Navbar.css';

const Navbar = ({ title, showBack = false }) => {
  const { isOnline } = useNetwork();
  const { t } = useLanguage();
  const navigate = useNavigate();

  return (
    <header className="navbar" id="app-navbar">
      <div className="navbar-left">
        {showBack ? (
          <button
            className="navbar-back-btn"
            onClick={() => navigate(-1)}
            aria-label="Go back"
          >
            ←
          </button>
        ) : (
          <Link to="/dashboard" className="navbar-logo">
            <span className="navbar-logo-icon">🌾</span>
            <span className="navbar-logo-text">AgroSelf</span>
          </Link>
        )}
        {title && <h1 className="navbar-title">{t(title)}</h1>}
      </div>

      <div className="navbar-right">
        {!isOnline && (
          <span className="offline-indicator" title={t('You are offline')}>
            📵 {t('Offline')}
          </span>
        )}
        <Link to="/notifications" className="navbar-icon-btn" aria-label={t('Notifications')} title={t('Notifications')}>
          🔔
        </Link>
        <Link to="/settings" className="navbar-icon-btn" aria-label={t('Settings')} title={t('Settings')}>
          ⚙️
        </Link>
      </div>
    </header>
  );
};

export default Navbar;
