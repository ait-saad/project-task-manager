import React from 'react';
import './ProgressRing.css';

interface ProgressRingProps {
  progress: number; // 0-100
  size?: number;
  strokeWidth?: number;
  color?: string;
  backgroundColor?: string;
  showPercentage?: boolean;
  className?: string;
  animated?: boolean;
}

const ProgressRing: React.FC<ProgressRingProps> = ({
  progress = 0,
  size = 80,
  strokeWidth = 8,
  color = '#2563eb',
  backgroundColor = '#e5e7eb',
  showPercentage = true,
  className = '',
  animated = true
}) => {
  const normalizedRadius = (size - strokeWidth * 2) / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDasharray = `${circumference} ${circumference}`;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className={`progress-ring ${className}`} style={{ width: size, height: size }}>
      <svg
        height={size}
        width={size}
        className={`progress-ring-svg ${animated ? 'animated' : ''}`}
      >
        {/* Background circle */}
        <circle
          stroke={backgroundColor}
          fill="transparent"
          strokeWidth={strokeWidth}
          r={normalizedRadius}
          cx={size / 2}
          cy={size / 2}
          className="progress-ring-background"
        />
        {/* Progress circle */}
        <circle
          stroke={color}
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeDasharray={strokeDasharray}
          style={{ strokeDashoffset }}
          strokeLinecap="round"
          r={normalizedRadius}
          cx={size / 2}
          cy={size / 2}
          className="progress-ring-circle"
        />
      </svg>
      {showPercentage && (
        <div className="progress-ring-text">
          <span className="progress-percentage">{Math.round(progress)}%</span>
        </div>
      )}
    </div>
  );
};

export default ProgressRing;