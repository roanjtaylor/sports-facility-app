// src/pages/auth/ResetPassword.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { MainLayout, Container } from '../../components/layout';
import { Form, Input, Button, Alert } from '../../components/common';
import { useAuth } from '../../contexts/AuthContext';

function ResetPassword() {
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { updatePassword } = useAuth();

  useEffect(() => {
    // Check if we have the necessary tokens/session for password reset
    // Supabase automatically handles the session when user clicks the reset link
    const checkResetSession = async () => {
      try {
        const { supabase } = await import('../../services/supabaseClient');
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error || !session) {
          setError('Invalid or expired reset link. Please request a new password reset.');
          return;
        }

        // If we have a valid session from the reset link, we're good to proceed
      } catch (err) {
        console.error('Error checking reset session:', err);
        setError('Invalid or expired reset link. Please request a new password reset.');
      }
    };

    checkResetSession();
  }, []);

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

    // Clear general error
    if (error) {
      setError('');
    }
  };

  const validateForm = () => {
    const errors = {};

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

    return errors;
  };

  const handleSubmit = async e => {
    e.preventDefault();

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    setLoading(true);
    setError('');

    try {
      await updatePassword(formData.password);
      setSuccess(true);

      // After successful password update, check user role and redirect to appropriate dashboard
      setTimeout(async () => {
        try {
          const { supabase } = await import('../../services/supabaseClient');
          const {
            data: { user },
            error,
          } = await supabase.auth.getUser();

          if (error || !user) {
            // If no user session, redirect to login
            navigate('/login', {
              state: {
                message: 'Password updated successfully! Please log in with your new password.',
              },
            });
            return;
          }

          // Get user profile to determine role
          const { data: profile } = await supabase
            .from('users')
            .select('role')
            .eq('id', user.id)
            .single();

          // Redirect to appropriate dashboard based on role
          const redirectPath =
            profile?.role === 'facility_owner' ? '/facility/dashboard' : '/player/dashboard';

          navigate(redirectPath, { replace: true });
        } catch (redirectError) {
          console.error('Error during redirect:', redirectError);
          // Fallback to login if anything goes wrong
          navigate('/login', {
            state: {
              message: 'Password updated successfully! Please log in with your new password.',
            },
          });
        }
      }, 2000); // Reduced to 2 seconds for better UX
    } catch (err) {
      console.error('Password update error:', err);

      if (err.message.includes('session_not_found') || err.message.includes('invalid_session')) {
        setError('Your reset link has expired. Please request a new password reset.');
      } else {
        setError(err.message || 'Failed to update password. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Success state
  if (success) {
    return (
      <MainLayout>
        <Container className="py-16">
          <div className="max-w-md mx-auto text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Password Updated!</h1>
            <Alert
              type="success"
              message="Your password has been successfully updated. Redirecting you to your dashboard..."
              className="mb-6"
            />
          </div>
        </Container>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Container className="py-16">
        <div className="max-w-md mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Reset Your Password</h1>
            <p className="text-gray-600">Enter your new password below</p>
          </div>

          {error && <Alert type="error" message={error} className="mb-6" />}

          <Form onSubmit={handleSubmit}>
            <Input
              label="New Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              error={validationErrors.password}
              placeholder="Enter your new password"
              autoComplete="new-password"
            />

            <Input
              label="Confirm New Password"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              error={validationErrors.confirmPassword}
              placeholder="Confirm your new password"
              autoComplete="new-password"
            />

            <div className="mb-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-2">Password Requirements:</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• At least 6 characters long</li>
                  <li>• Contains a mix of letters and numbers (recommended)</li>
                  <li>• Avoid using personal information</li>
                </ul>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Updating Password...' : 'Update Password'}
            </Button>
          </Form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Remember your password?{' '}
              <button
                onClick={() => navigate('/login')}
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                Back to Login
              </button>
            </p>
          </div>
        </div>
      </Container>
    </MainLayout>
  );
}

export default ResetPassword;
