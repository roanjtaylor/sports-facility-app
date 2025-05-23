// src/pages/auth/VerifyEmail.jsx
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MainLayout, Container } from '../../components/layout';
import { Button, Alert } from '../../components/common';

function VerifyEmail() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email;
  const initialMessage = location.state?.message;

  useEffect(() => {
    if (initialMessage) {
      setMessage(initialMessage);
    }
  }, [initialMessage]);

  const handleResendVerification = async () => {
    if (!email) {
      setError('No email address provided. Please register again.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { supabase } = await import('../../services/supabaseClient');

      const { error: resendError } = await supabase.auth.resend({
        type: 'signup',
        email: email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/verify-email`,
        },
      });

      if (resendError) {
        throw new Error(resendError.message);
      }

      setMessage('Verification email sent! Please check your inbox and spam folder.');
    } catch (err) {
      console.error('Resend verification error:', err);
      setError(err.message || 'Failed to resend verification email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <Container className="py-16">
        <div className="max-w-md mx-auto text-center">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-8 h-8 text-primary-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 3.26a2 2 0 001.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">Check Your Email</h1>

          {email && (
            <p className="text-gray-600 mb-6">
              We've sent a verification link to{' '}
              <span className="font-medium text-gray-900">{email}</span>
            </p>
          )}

          {message && <Alert type="success" message={message} className="mb-6" />}

          {error && <Alert type="error" message={error} className="mb-6" />}

          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <h3 className="font-medium text-gray-900 mb-2">What to do next:</h3>
            <ol className="text-sm text-gray-600 text-left space-y-2">
              <li>1. Check your email inbox</li>
              <li>2. Look for an email from our platform</li>
              <li>3. Click the verification link in the email</li>
              <li>4. You'll be redirected to complete your registration</li>
            </ol>
          </div>

          <div className="space-y-4">
            {email && (
              <Button
                onClick={handleResendVerification}
                disabled={loading}
                variant="outline"
                className="w-full"
              >
                {loading ? 'Sending...' : 'Resend Verification Email'}
              </Button>
            )}

            <Button onClick={() => navigate('/login')} variant="secondary" className="w-full">
              Back to Login
            </Button>
          </div>

          <div className="mt-8 text-sm text-gray-500">
            <p>
              Didn't receive the email? Check your spam folder or{' '}
              <button
                onClick={handleResendVerification}
                className="text-primary-600 hover:text-primary-700 underline"
                disabled={loading}
              >
                click here to resend
              </button>
            </p>
          </div>
        </div>
      </Container>
    </MainLayout>
  );
}

export default VerifyEmail;
