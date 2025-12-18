import React, { useEffect, useState } from 'react';
import { CheckIcon, AlertCircleIcon, XIcon } from './Icons';
import './Notification.css';

interface NotificationProps {
  type: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  message: string;
  onClose: () => void;
  autoClose?: boolean;
  duration?: number;
  actions?: Array<{
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary';
  }>;
}

const Notification: React.FC<NotificationProps> = ({
  type,
  title,
  message,
  onClose,
  autoClose = true,
  duration = 5000,
  actions
}) => {
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [autoClose, duration]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckIcon size={20} />;
      case 'error':
      case 'warning':
        return <AlertCircleIcon size={20} />;
      case 'info':
        return <AlertCircleIcon size={20} />;
      default:
        return null;
    }
  };

  return (
    <div className={`notification ${type} ${isClosing ? 'closing' : 'entering'}`}>
      <div className="notification-content">
        <div className="notification-icon">
          {getIcon()}
        </div>

        <div className="notification-text">
          {title && <div className="notification-title">{title}</div>}
          <div className="notification-message">{message}</div>
        </div>

        <button
          className="notification-close"
          onClick={handleClose}
          aria-label="Close notification"
        >
          <XIcon size={16} />
        </button>
      </div>

      {actions && actions.length > 0 && (
        <div className="notification-actions">
          {actions.map((action, index) => (
            <button
              key={index}
              className={`notification-action ${action.variant || 'secondary'}`}
              onClick={action.onClick}
            >
              {action.label}
            </button>
          ))}
        </div>
      )}

      {autoClose && (
        <div className="notification-progress">
          <div
            className="notification-progress-bar"
            style={{ animationDuration: `${duration}ms` }}
          />
        </div>
      )}
    </div>
  );
};

export default Notification;