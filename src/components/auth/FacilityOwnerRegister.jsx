// src/components/auth/FacilityOwnerRegister.jsx
import { useState } from 'react';
import { Form, Input, Button, Alert } from '../common';

function FacilityOwnerRegister({ onSubmit, loading, error, onBack }) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    phone: '',
  });

  const [validationErrors, setValidationErrors] = useState({});

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    // Clear validation error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const errors = {};

    // Email validation
    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters long';
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    // Full name validation
    if (!formData.fullName.trim()) {
      errors.fullName = 'Full name is required';
    }

    // Phone validation (optional but must be valid if provided)
    if (formData.phone && !/^\+?[\d\s\-\(\)]+$/.test(formData.phone)) {
      errors.phone = 'Please enter a valid phone number';
    }

    return errors;
  };

  const handleSubmit = e => {
    e.preventDefault();

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    // Submit the form data
    onSubmit({
      email: formData.email,
      password: formData.password,
      userData: {
        full_name: formData.fullName,
        role: 'facility_owner',
        phone: formData.phone || null,
      },
    });
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="mb-8">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
        >
          <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to account type selection
        </button>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Create Facility Owner Account</h2>
        <p className="text-gray-600">
          Join our platform to manage your sports facilities and maximize bookings
        </p>
      </div>

      {error && <Alert type="error" message={error} className="mb-6" />}

      <Form onSubmit={handleSubmit}>
        <Input
          label="Full Name"
          type="text"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          required
          error={validationErrors.fullName}
          placeholder="Enter your full name"
        />

        <Input
          label="Email Address"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          error={validationErrors.email}
          placeholder="Enter your email address"
        />

        <Input
          label="Phone Number"
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          error={validationErrors.phone}
          placeholder="Enter your phone number (optional)"
        />

        <Input
          label="Password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
          error={validationErrors.password}
          placeholder="Create a secure password"
        />

        <Input
          label="Confirm Password"
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
          error={validationErrors.confirmPassword}
          placeholder="Confirm your password"
        />

        <div className="mb-6">
          <label className="flex items-start">
            <input type="checkbox" required className="mt-1 mr-3" />
            <span className="text-sm text-gray-600">
              I agree to the{' '}
              <a href="#" className="text-primary-600 hover:text-primary-700">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#" className="text-primary-600 hover:text-primary-700">
                Privacy Policy
              </a>
            </span>
          </label>
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Creating Account...' : 'Create Facility Owner Account'}
        </Button>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <a href="/login" className="text-primary-600 hover:text-primary-700 font-medium">
              Sign in here
            </a>
          </p>
        </div>
      </Form>
    </div>
  );
}

export default FacilityOwnerRegister;
