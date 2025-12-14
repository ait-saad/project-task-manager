import React, { useState } from 'react';
  import { useNavigate, Link } from 'react-router-dom';
  import { useAuth } from '../context/AuthContext';
  import { register } from '../services/api';
  import './RegisterPage.css';

  const RegisterPage: React.FC = () => {
    const [formData, setFormData] = useState({
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [fieldErrors, setFieldErrors] = useState<{[key: string]: string}>({});

    const { login } = useAuth();
    const navigate = useNavigate();

    const validateForm = () => {
      const errors: {[key: string]: string} = {};

      // Name validation
      if (!formData.name.trim()) {
        errors.name = 'Name is required';
      } else if (formData.name.trim().length < 2) {
        errors.name = 'Name must be at least 2 characters';
      }

      // Email validation
      if (!formData.email.trim()) {
        errors.email = 'Email is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        errors.email = 'Please enter a valid email address';
      }

      // Password validation
      if (!formData.password) {
        errors.password = 'Password is required';
      } else if (formData.password.length < 6) {
        errors.password = 'Password must be at least 6 characters';
      }

      // Confirm password validation
      if (!formData.confirmPassword) {
        errors.confirmPassword = 'Please confirm your password';
      } else if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = 'Passwords do not match';
      }

      setFieldErrors(errors);
      return Object.keys(errors).length === 0;
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));

      // Clear field error when user starts typing
      if (fieldErrors[name]) {
        setFieldErrors(prev => ({
          ...prev,
          [name]: ''
        }));
      }
    };

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();

      if (!validateForm()) {
        return;
      }

      setLoading(true);
      setError('');

      try {
        const response = await register(formData);
        login({ email: response.email, name: response.name, token: response.token });
        navigate('/projects');
      } catch (err: any) {
        const errorMessage = err.response?.data?.message || err.response?.data?.error || 'Registration failed. Please try again.';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    return (
      <div className="register-container">
        <div className="register-card">
          <div className="register-header">
            <h1>Create Your Account</h1>
            <p>Join us to start managing your projects</p>
          </div>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit} className="register-form">
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={fieldErrors.name ? 'error' : ''}
                placeholder="Enter your full name"
                disabled={loading}
              />
              {fieldErrors.name && <span className="field-error">{fieldErrors.name}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={fieldErrors.email ? 'error' : ''}
                placeholder="Enter your email address"
                disabled={loading}
              />
              {fieldErrors.email && <span className="field-error">{fieldErrors.email}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className={fieldErrors.password ? 'error' : ''}
                placeholder="Create a password (min. 6 characters)"
                disabled={loading}
              />
              {fieldErrors.password && <span className="field-error">{fieldErrors.password}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className={fieldErrors.confirmPassword ? 'error' : ''}
                placeholder="Confirm your password"
                disabled={loading}
              />
              {fieldErrors.confirmPassword && <span className="field-error">{fieldErrors.confirmPassword}</span>}
            </div>

            <button
              type="submit"
              className="register-button"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Creating Account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <div className="register-footer">
            <p>
              Already have an account?
              <Link to="/login" className="login-link"> Sign in here</Link>
            </p>
          </div>

          <div className="demo-note">
            <p>🎯 <strong>Demo Account:</strong> Use john@example.com / password123 to test the app</p>
          </div>
        </div>
      </div>
    );
  };
  export default RegisterPage;