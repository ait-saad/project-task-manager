import React from 'react';
import './StatusBadge.css';

interface StatusBadgeProps {
  status: 'not-started' | 'in-progress' | 'completed' | 'overdue' | 'on-track' | 'at-risk';
  size?: 'small' | 'medium' | 'large';
  showIcon?: boolean;
  children?: React.ReactNode;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'medium',
  showIcon = true,
  children
}) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'completed':
        return {
          label: 'Completed',
          icon: '✓',
          className: 'status-completed'
        };
      case 'in-progress':
        return {
          label: 'In Progress',
          icon: '⚡',
          className: 'status-in-progress'
        };
      case 'not-started':
        return {
          label: 'Not Started',
          icon: '○',
          className: 'status-not-started'
        };
      case 'overdue':
        return {
          label: 'Overdue',
          icon: '!',
          className: 'status-overdue'
        };
      case 'on-track':
        return {
          label: 'On Track',
          icon: '↗',
          className: 'status-on-track'
        };
      case 'at-risk':
        return {
          label: 'At Risk',
          icon: '⚠',
          className: 'status-at-risk'
        };
      default:
        return {
          label: 'Unknown',
          icon: '?',
          className: 'status-unknown'
        };
    }
  };

  const config = getStatusConfig();

  return (
    <span className={`status-badge ${config.className} ${size}`}>
      {showIcon && <span className="status-icon">{config.icon}</span>}
      <span className="status-text">
        {children || config.label}
      </span>
    </span>
  );
};

export default StatusBadge;