// src/pages/auth/EmailConfirmed.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { MainLayout, Container } from '../../components/layout';
import { Alert, Spinner } from '../../components/common';
import { createUserProfile } from '../../services/userService';
import { supabase } from '../../services/supabaseClient';

function EmailConfirmed() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const handleEmailConfirmation = async () => {
      try {
        // Get the current session after email confirmation
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError) {
          throw new Error(sessionError.message);
        }

        if (!session?.user) {
          throw new Error('No authenticated user found');
        }

        // Check if user profile already exists
        const { data: existingProfile } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (!existingProfile) {
          // Create user profile using metadata from auth
          const metadata = session.user.user_metadata;

          const userProfileData = {
            id: session.user.id,
            email: session.user.email,
            full_name: metadata.full_name,
            role: metadata.role,
            ...(metadata.phone && { phone: metadata.phone }),
            ...(metadata.date_of_birth && { date_of_birth: metadata.date_of_birth }),
            ...(metadata.profile_photo_url && { profile_photo_url: metadata.profile_photo_url }),
          };

          await createUserProfile(userProfileData);
        }

        setSuccess(true);

        // Redirect to appropriate dashboard after 2 seconds
        setTimeout(() => {
          const redirectPath =
            existingProfile?.role === 'facility_owner' || metadata.role === 'facility_owner'
              ? '/facility/dashboard'
              : '/player/dashboard';
          navigate(redirectPath, { replace: true });
        }, 2000);
      } catch (err) {
        console.error('Email confirmation error:', err);
        setError(err.message || 'Failed to confirm email. Please try logging in.');

        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate('/login', { replace: true });
        }, 3000);
      } finally {
        setLoading(false);
      }
    };

    handleEmailConfirmation();
  }, [navigate]);

  if (loading) {
    return (
      <MainLayout>
        <Container className="py-16">
          <div className="max-w-md mx-auto text-center">
            <Spinner size="lg" />
            <h2 className="text-2xl font-bold text-gray-900 mt-4 mb-2">Confirming your email...</h2>
            <p className="text-gray-600">Please wait while we set up your account.</p>
          </div>
        </Container>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Container className="py-16">
        <div className="max-w-md mx-auto text-center">
          {success ? (
            <>
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
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Email Confirmed!</h1>
              <Alert
                type="success"
                message="Your account has been successfully created and verified. Redirecting you to your dashboard..."
                className="mb-6"
              />
            </>
          ) : (
            <>
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-8 h-8 text-red-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Confirmation Failed</h1>
              {error && (
                <Alert
                  type="error"
                  message={error + ' Redirecting you to login...'}
                  className="mb-6"
                />
              )}
            </>
          )}
        </div>
      </Container>
    </MainLayout>
  );
}

export default EmailConfirmed;
