import React from 'react';
import './LoadingSpinner.css';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  variant?: 'primary' | 'secondary' | 'white';
  text?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'medium',
  variant = 'primary',
  text
}) => {
  return (
    <div className={`loading-spinner-container ${size}`}>
      <div className={`loading-spinner ${variant} ${size}`}>
        <div className="spinner-ring"></div>
        <div className="spinner-ring"></div>
        <div className="spinner-ring"></div>
        <div className="spinner-ring"></div>
      </div>
      {text && <span className="loading-text">{text}</span>}
    </div>
  );
};

export default LoadingSpinner;