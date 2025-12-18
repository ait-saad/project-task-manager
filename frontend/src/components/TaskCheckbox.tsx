import React, { useState } from 'react';
import { CheckIcon } from './Icons';
import './TaskCheckbox.css';

interface TaskCheckboxProps {
  checked: boolean;
  onChange: () => void;
  disabled?: boolean;
  size?: 'small' | 'medium' | 'large';
  label?: string;
}

const TaskCheckbox: React.FC<TaskCheckboxProps> = ({
  checked,
  onChange,
  disabled = false,
  size = 'medium',
  label
}) => {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = () => {
    if (disabled) return;

    setIsAnimating(true);
    onChange();

    // Reset animation state
    setTimeout(() => {
      setIsAnimating(false);
    }, 300);
  };

  return (
    <div className={`task-checkbox-container ${size}`}>
      <button
        type="button"
        className={`task-checkbox ${checked ? 'checked' : ''} ${isAnimating ? 'animating' : ''} ${disabled ? 'disabled' : ''}`}
        onClick={handleClick}
        disabled={disabled}
        aria-checked={checked}
        aria-label={label || (checked ? 'Mark as incomplete' : 'Mark as complete')}
      >
        <div className="checkbox-background">
          <div className="checkbox-checkmark">
            <CheckIcon size={size === 'small' ? 12 : size === 'large' ? 18 : 14} />
          </div>
        </div>
        <div className="ripple-effect"></div>
      </button>

      {label && (
        <label className={`checkbox-label ${checked ? 'checked' : ''}`}>
          {label}
        </label>
      )}
    </div>
  );
};

export default TaskCheckbox;