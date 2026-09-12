/**
 * Alert/Info box component
 * @param {string} type - 'info' | 'success' | 'warning' | 'danger'
 */
const Alert = ({ type = 'info', icon, children, className = '' }) => {
  const icons = {
    info: 'ℹ️',
    success: '✅',
    warning: '⚠️',
    danger: '🚨',
  };

  return (
    <div className={`alert alert-${type} ${className}`}>
      <span style={{ fontSize: '1rem', flexShrink: 0 }}>{icon || icons[type]}</span>
      <div>{children}</div>
    </div>
  );
};

export default Alert;
