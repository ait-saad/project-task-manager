import React, { useState, useRef, useEffect } from 'react';
import { AlertCircleIcon, CheckIcon, EyeIcon } from './Icons';
import './FormInput.css';

interface FormInputProps {
  type?: 'text' | 'email' | 'password' | 'textarea' | 'date';
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  success?: boolean;
  hint?: string;
  autoComplete?: string;
  rows?: number;
  maxLength?: number;
  validation?: {
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
    custom?: (value: string) => string | null;
  };
  showPasswordToggle?: boolean;
  onBlur?: () => void;
  onFocus?: () => void;
  className?: string;
}

const FormInput: React.FC<FormInputProps> = ({
  type = 'text',
  label,
  value,
  onChange,
  placeholder,
  required = false,
  disabled = false,
  error,
  success = false,
  hint,
  autoComplete,
  rows = 3,
  maxLength,
  validation,
  showPasswordToggle = false,
  onBlur,
  onFocus,
  className = ''
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState<string>('');
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  const validateInput = (inputValue: string) => {
    if (!validation) return null;

    if (validation.minLength && inputValue.length < validation.minLength) {
      return `Minimum ${validation.minLength} characters required`;
    }

    if (validation.maxLength && inputValue.length > validation.maxLength) {
      return `Maximum ${validation.maxLength} characters allowed`;
    }

    if (validation.pattern && !validation.pattern.test(inputValue)) {
      return 'Invalid format';
    }

    if (validation.custom) {
      return validation.custom(inputValue);
    }

    return null;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    onChange(newValue);

    // Real-time validation
    if (newValue && validation) {
      const validationError = validateInput(newValue);
      setLocalError(validationError || '');
    } else {
      setLocalError('');
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
    onFocus?.();
  };

  const handleBlur = () => {
    setIsFocused(false);
    onBlur?.();

    // Validate on blur
    if (value && validation) {
      const validationError = validateInput(value);
      setLocalError(validationError || '');
    }
  };

  const displayError = error || localError;
  const hasValue = value.length > 0;
  const isValid = !displayError && hasValue && !disabled;
  const showSuccess = success || (isValid && !isFocused);

  const inputType = type === 'password' && showPassword ? 'text' : type;

  const inputProps = {
    id: `input-${label.replace(/\s+/g, '-').toLowerCase()}`,
    value,
    onChange: handleChange,
    onFocus: handleFocus,
    onBlur: handleBlur,
    placeholder,
    required,
    disabled,
    autoComplete,
    maxLength,
    ref: inputRef as any,
    className: `form-input ${isFocused ? 'focused' : ''} ${hasValue ? 'has-value' : ''} ${displayError ? 'error' : ''} ${showSuccess ? 'success' : ''}`
  };

  return (
    <div className={`form-input-container ${className}`}>
      <div className="form-input-wrapper">
        <label
          htmlFor={inputProps.id}
          className={`form-label ${isFocused || hasValue ? 'active' : ''}`}
        >
          {label}
          {required && <span className="required-asterisk">*</span>}
        </label>

        <div className="input-wrapper">
          {type === 'textarea' ? (
            <textarea
              {...inputProps}
              rows={rows}
              className={`form-textarea ${inputProps.className}`}
            />
          ) : (
            <input
              {...inputProps}
              type={inputType}
              className={`form-input ${inputProps.className}`}
            />
          )}

          <div className="input-icons">
            {type === 'password' && showPasswordToggle && (
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                disabled={disabled}
              >
                <EyeIcon size={16} />
              </button>
            )}

            {displayError && (
              <div className="input-icon error-icon">
                <AlertCircleIcon size={16} />
              </div>
            )}

            {showSuccess && (
              <div className="input-icon success-icon">
                <CheckIcon size={16} />
              </div>
            )}
          </div>
        </div>

        {maxLength && type !== 'date' && (
          <div className="character-count">
            <span className={value.length > maxLength * 0.8 ? 'warning' : ''}>
              {value.length}
            </span>
            /{maxLength}
          </div>
        )}
      </div>

      {displayError && (
        <div className="form-error animate-shake">
          <AlertCircleIcon size={14} />
          {displayError}
        </div>
      )}

      {hint && !displayError && (
        <div className="form-hint">
          {hint}
        </div>
      )}
    </div>
  );
};

export default FormInput;