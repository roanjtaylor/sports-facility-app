// src/components/auth/ProfileEdit.jsx
import { useState, useEffect } from 'react';
import { Form, Input, Button, Card, Alert } from '../common';

function ProfileEdit({ user, onSave, onCancel, loading, error }) {
  const [formData, setFormData] = useState({
    fullName: '',
    profilePhotoUrl: '',
    phone: '',
    dateOfBirth: '',
  });
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || user.full_name || '',
        profilePhotoUrl: user.profilePhotoUrl || user.profile_photo_url || '',
        phone: user.phone || '',
        dateOfBirth: user.dateOfBirth || user.date_of_birth || '',
      });
    }
  }, [user]);

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

    // Full name validation
    if (!formData.fullName.trim()) {
      errors.fullName = 'Full name is required';
    }

    // Profile photo URL validation (optional but must be valid if provided)
    if (
      formData.profilePhotoUrl &&
      !/^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i.test(formData.profilePhotoUrl)
    ) {
      errors.profilePhotoUrl = 'Please enter a valid image URL';
    }

    // Phone validation for facility owners (optional but must be valid if provided)
    if (
      user.role === 'facility_owner' &&
      formData.phone &&
      !/^\+?[\d\s\-\(\)]+$/.test(formData.phone)
    ) {
      errors.phone = 'Please enter a valid phone number';
    }

    // Date of birth validation for players
    if (user.role === 'player') {
      if (!formData.dateOfBirth) {
        errors.dateOfBirth = 'Date of birth is required';
      } else {
        const birthDate = new Date(formData.dateOfBirth);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();

        if (age < 16) {
          errors.dateOfBirth = 'You must be at least 16 years old';
        }
      }
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

    // Prepare update data based on user role
    const updateData = {
      full_name: formData.fullName,
      profile_photo_url: formData.profilePhotoUrl || null,
    };

    if (user.role === 'facility_owner') {
      updateData.phone = formData.phone || null;
    }

    if (user.role === 'player') {
      updateData.date_of_birth = formData.dateOfBirth;
    }

    onSave(updateData);
  };

  return (
    <Card padding="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">Edit Profile</h2>
        <button onClick={onCancel} className="text-gray-600 hover:text-gray-900" disabled={loading}>
          Cancel
        </button>
      </div>

      {error && <Alert type="error" message={error} className="mb-6" />}

      <Form onSubmit={handleSubmit}>
        <div className="space-y-6">
          {/* Profile Photo Preview */}
          {formData.profilePhotoUrl && (
            <div className="flex justify-center">
              <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                <img
                  src={formData.profilePhotoUrl}
                  alt="Profile Preview"
                  className="w-full h-full object-cover"
                  onError={e => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              label="Profile Photo URL"
              type="url"
              name="profilePhotoUrl"
              value={formData.profilePhotoUrl}
              onChange={handleChange}
              error={validationErrors.profilePhotoUrl}
              placeholder="https://example.com/photo.jpg (optional)"
            />

            {/* Role-specific fields */}
            {user.role === 'facility_owner' && (
              <Input
                label="Phone Number"
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                error={validationErrors.phone}
                placeholder="Enter your phone number (optional)"
              />
            )}

            {user.role === 'player' && (
              <Input
                label="Date of Birth"
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                required
                error={validationErrors.dateOfBirth}
              />
            )}
          </div>

          <div className="flex space-x-4 pt-4">
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
            <Button type="button" variant="secondary" onClick={onCancel} disabled={loading}>
              Cancel
            </Button>
          </div>
        </div>
      </Form>
    </Card>
  );
}

export default ProfileEdit;
