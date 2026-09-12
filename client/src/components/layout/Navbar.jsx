import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNetwork } from '../../context/NetworkContext';
import './Navbar.css';

const Navbar = ({ title, showBack = false }) => {
  const { farmer, logout } = useAuth();
  const { isOnline } = useNetwork();
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
        {title && <h1 className="navbar-title">{title}</h1>}
      </div>

      <div className="navbar-right">
        {!isOnline && (
          <span className="offline-indicator" title="You are offline">
            📵 Offline
          </span>
        )}
        <Link to="/notifications" className="navbar-icon-btn" aria-label="Notifications">
          🔔
        </Link>
      </div>
    </header>
  );
};

export default Navbar;
