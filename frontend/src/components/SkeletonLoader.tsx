import React from 'react';
import './SkeletonLoader.css';

interface SkeletonLoaderProps {
  variant?: 'text' | 'rect' | 'circle' | 'project-card' | 'task-item';
  width?: string | number;
  height?: string | number;
  count?: number;
  className?: string;
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  variant = 'text',
  width = '100%',
  height,
  count = 1,
  className = ''
}) => {
  const getSkeletonStyle = () => {
    const style: React.CSSProperties = {};

    if (width) style.width = typeof width === 'number' ? `${width}px` : width;

    switch (variant) {
      case 'text':
        style.height = height || '1rem';
        break;
      case 'rect':
        style.height = height || '2rem';
        break;
      case 'circle':
        style.height = width;
        style.borderRadius = '50%';
        break;
      default:
        if (height) style.height = typeof height === 'number' ? `${height}px` : height;
    }

    return style;
  };

  const renderProjectCardSkeleton = () => (
    <div className="skeleton-project-card">
      <div className="skeleton-card-header">
        <div className="skeleton skeleton-rect" style={{ width: '60%', height: '1.5rem' }} />
        <div className="skeleton skeleton-rect" style={{ width: '4rem', height: '2rem', borderRadius: '6px' }} />
      </div>
      <div className="skeleton skeleton-text" style={{ width: '100%', height: '1rem', marginBottom: '0.5rem' }} />
      <div className="skeleton skeleton-text" style={{ width: '80%', height: '1rem', marginBottom: '1.5rem' }} />
      <div className="skeleton-progress">
        <div className="skeleton-progress-info">
          <div className="skeleton skeleton-text" style={{ width: '6rem', height: '0.875rem' }} />
          <div className="skeleton skeleton-text" style={{ width: '2rem', height: '0.875rem' }} />
        </div>
        <div className="skeleton skeleton-rect" style={{ width: '100%', height: '6px', borderRadius: '3px' }} />
      </div>
    </div>
  );

  const renderTaskItemSkeleton = () => (
    <div className="skeleton-task-item">
      <div className="skeleton skeleton-circle" style={{ width: '20px', height: '20px', flexShrink: 0 }} />
      <div className="skeleton-task-content">
        <div className="skeleton skeleton-text" style={{ width: '70%', height: '1.125rem', marginBottom: '0.5rem' }} />
        <div className="skeleton skeleton-text" style={{ width: '100%', height: '0.875rem', marginBottom: '0.25rem' }} />
        <div className="skeleton skeleton-text" style={{ width: '60%', height: '0.875rem', marginBottom: '0.75rem' }} />
        <div className="skeleton skeleton-rect" style={{ width: '5rem', height: '1.5rem', borderRadius: '6px' }} />
      </div>
      <div className="skeleton-task-actions">
        <div className="skeleton skeleton-rect" style={{ width: '3rem', height: '1.75rem', borderRadius: '6px' }} />
        <div className="skeleton skeleton-rect" style={{ width: '3.5rem', height: '1.75rem', borderRadius: '6px' }} />
      </div>
    </div>
  );

  const renderBasicSkeleton = () => (
    <div
      className={`skeleton skeleton-${variant} ${className}`}
      style={getSkeletonStyle()}
    />
  );

  const renderSkeleton = () => {
    switch (variant) {
      case 'project-card':
        return renderProjectCardSkeleton();
      case 'task-item':
        return renderTaskItemSkeleton();
      default:
        return renderBasicSkeleton();
    }
  };

  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <React.Fragment key={index}>
          {renderSkeleton()}
        </React.Fragment>
      ))}
    </>
  );
};

export default SkeletonLoader;