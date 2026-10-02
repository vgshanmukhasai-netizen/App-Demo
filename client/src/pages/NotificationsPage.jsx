import { useEffect, useState } from 'react';
import Navbar from '../components/layout/Navbar';
import BottomNav from '../components/layout/BottomNav';
import Loader from '../components/common/Loader';
import Alert from '../components/common/Alert';
import api from '../services/api';
import { timeAgo } from '../utils/dateUtils';
import { useLanguage } from '../context/LanguageContext';

const TYPE_ICONS = {
  rain_alert: '🌧️',
  watering_reminder: '💧',
  harvest_reminder: '🌾',
  market_alert: '📊',
  crop_protection: '🛡️',
  general: '🔔',
};

const PRIORITY_COLORS = { high: 'red', medium: 'yellow', low: 'gray' };

const NotificationsPage = () => {
  const { t } = useLanguage();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get('/notifications');
        setNotifications(res.data.data.notifications);
      } catch {
        setError(t('Failed to load notifications.'));
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [t]);

  const markRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
    } catch {}
  };

  const clearRead = async () => {
    try {
      await api.delete('/notifications/clear');
      setNotifications((prev) => prev.filter((n) => !n.isRead));
    } catch {}
  };

  const unread = notifications.filter((n) => !n.isRead);

  return (
    <div className="app-container">
      <Navbar title="Notifications" showBack />
      <div className="page page-with-header fade-in">

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>
            {unread.length} {t('unread')}
          </p>
          {notifications.some((n) => n.isRead) && (
            <button id="clear-read-btn" className="btn btn-ghost btn-sm" onClick={clearRead}>
              {t('Clear Read')}
            </button>
          )}
        </div>

        {loading && <Loader text={t('Loading')} />}
        {error && <Alert type="danger">{error}</Alert>}

        {!loading && notifications.length === 0 && (
          <div className="empty-state card">
            <span className="empty-icon">🔔</span>
            <p className="empty-title">{t('No notifications yet')}</p>
            <p className="empty-desc">{t('Rain alerts, watering reminders, and harvest notifications will appear here.')}</p>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {notifications.map((notif) => (
            <div
              key={notif._id}
              id={`notif-${notif._id}`}
              className="card"
              style={{
                opacity: notif.isRead ? 0.6 : 1,
                borderLeft: `3px solid ${notif.isRead ? 'var(--neutral-200)' : 'var(--green-500)'}`,
                cursor: !notif.isRead ? 'pointer' : 'default',
              }}
              onClick={() => !notif.isRead && markRead(notif._id)}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                <span style={{ fontSize: '1.5rem' }}>{TYPE_ICONS[notif.type] || '🔔'}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <p style={{ fontWeight: notif.isRead ? 500 : 700, fontSize: 'var(--text-sm)', color: 'var(--text-primary)' }}>
                      {t(notif.title)}
                    </p>
                    {!notif.isRead && (
                      <span style={{ width: '0.5rem', height: '0.5rem', borderRadius: '50%', background: 'var(--green-500)', flexShrink: 0 }} />
                    )}
                  </div>
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                    {t(notif.message)}
                  </p>
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
                    {timeAgo(notif.createdAt)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <BottomNav />
    </div>
  );
};
export default NotificationsPage;
