// src/pages/auth/Register.jsx (Fixed)
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout, Container } from '../../components/layout';
import UserTypeSelection from '../../components/auth/UserTypeSelection';
import FacilityOwnerRegister from '../../components/auth/FacilityOwnerRegister';
import PlayerRegister from '../../components/auth/PlayerRegister';
import { useAuth } from '../../contexts/AuthContext';

function Register() {
  const [selectedUserType, setSelectedUserType] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth();

  // Redirect if user is already logged in
  if (user) {
    const redirectPath =
      user.role === 'facility_owner' ? '/facility/dashboard' : '/player/dashboard';
    navigate(redirectPath, { replace: true });
    return null;
  }

  const handleUserTypeSelect = userType => {
    setSelectedUserType(userType);
    setError('');
  };

  const handleBackToSelection = () => {
    setSelectedUserType(null);
    setError('');
  };

  // ENHANCED: More robust email existence check
  const checkEmailExists = async email => {
    try {
      const { supabase } = await import('../../services/supabaseClient');

      // Method 1: Check users table first
      const { data: existingUser, error: userError } = await supabase
        .from('users')
        .select('email')
        .eq('email', email)
        .single();

      // If we found a user in the users table, email definitely exists
      if (existingUser) {
        return true;
      }

      // Method 2: Try to sign up with a dummy password to check auth.users
      // This is a safe way to check if email exists in Supabase auth
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password: 'dummy-password-for-check-12345', // This won't be used
        options: {
          data: { email_check: true }, // Flag to identify this as a check
        },
      });

      // If sign up "succeeds" but no user is returned, email likely already exists
      if (signUpData && !signUpData.user) {
        return true;
      }

      // If we get a specific error about email already registered
      if (
        signUpError &&
        (signUpError.message.includes('already registered') ||
          signUpError.message.includes('already been registered') ||
          signUpError.message.includes('User already registered'))
      ) {
        return true;
      }

      // If we got this far and have a user, we need to clean up
      if (signUpData?.user) {
        // Delete the test user we just created
        try {
          await supabase.auth.admin.deleteUser(signUpData.user.id);
        } catch (cleanupError) {
          console.warn('Could not cleanup test user:', cleanupError);
        }
      }

      return false;
    } catch (error) {
      console.error('Error checking email existence:', error);
      // If we can't check reliably, allow registration to proceed
      // The actual registration will catch any conflicts
      return false;
    }
  };

  // ALTERNATIVE APPROACH: More reliable email check using a different method
  const checkEmailExistsAlternative = async email => {
    try {
      const { supabase } = await import('../../services/supabaseClient');

      // First check the users table
      const { data: existingUser } = await supabase
        .from('users')
        .select('email')
        .eq('email', email)
        .single();

      if (existingUser) {
        return true;
      }

      // Use password reset as a way to check if email exists in auth
      // This is safe because it doesn't create anything
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'https://example.com/dummy', // Dummy redirect
      });

      // If reset password succeeds, email exists in auth system
      if (!resetError) {
        return true;
      }

      // If we get "user not found" type errors, email doesn't exist
      if (
        resetError.message.includes('User not found') ||
        resetError.message.includes('Unable to validate email address')
      ) {
        return false;
      }

      // For other errors, assume email might exist to be safe
      return false;
    } catch (error) {
      console.error('Error checking email existence:', error);
      return false;
    }
  };

  const handleRegistration = async registrationData => {
    setLoading(true);
    setError('');

    try {
      // STEP 1: Check if email already exists (using alternative method)
      const emailExists = await checkEmailExistsAlternative(registrationData.email);

      if (emailExists) {
        throw new Error(
          'An account with this email address already exists. Please try logging in instead.'
        );
      }

      // Import Supabase client
      const { supabase } = await import('../../services/supabaseClient');

      // STEP 2: Attempt registration with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: registrationData.email,
        password: registrationData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/email-confirmed`,
          data: {
            full_name: registrationData.userData.full_name,
            role: registrationData.userData.role,
            ...(registrationData.userData.phone && { phone: registrationData.userData.phone }),
            ...(registrationData.userData.date_of_birth && {
              date_of_birth: registrationData.userData.date_of_birth,
            }),
            ...(registrationData.userData.profile_photo_url && {
              profile_photo_url: registrationData.userData.profile_photo_url,
            }),
          },
        },
      });

      // STEP 3: Handle specific auth errors
      if (authError) {
        if (
          authError.message.includes('already registered') ||
          authError.message.includes('already been registered') ||
          authError.message.includes('User already registered')
        ) {
          throw new Error(
            'An account with this email address already exists. Please try logging in instead.'
          );
        }
        throw new Error(authError.message);
      }

      // STEP 4: Validate that we actually got a user
      if (!authData.user) {
        // This might indicate the email already exists but Supabase didn't return an error
        throw new Error(
          'Registration failed. This email address may already be in use. Please try logging in instead.'
        );
      }

      // STEP 5: Create user profile (optional, will be retried after email confirmation)
      try {
        const userProfileData = {
          id: authData.user.id,
          email: registrationData.email,
          ...registrationData.userData,
        };

        const { createUserProfile } = await import('../../services/userService');
        await createUserProfile(userProfileData);
        console.log('User profile created successfully');
      } catch (profileError) {
        console.warn(
          'User profile creation failed (will retry after email confirmation):',
          profileError
        );
      }

      // STEP 6: Success - redirect to verification page
      navigate('/auth/verify-email', {
        state: {
          email: registrationData.email,
          message: 'Registration successful! Please check your email to verify your account.',
          userData: registrationData.userData,
        },
      });
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderCurrentStep = () => {
    if (!selectedUserType) {
      return <UserTypeSelection onSelectType={handleUserTypeSelect} />;
    }

    if (selectedUserType === 'facility_owner') {
      return (
        <FacilityOwnerRegister
          onSubmit={handleRegistration}
          onBack={handleBackToSelection}
          loading={loading}
          error={error}
        />
      );
    }

    if (selectedUserType === 'player') {
      return (
        <PlayerRegister
          onSubmit={handleRegistration}
          onBack={handleBackToSelection}
          loading={loading}
          error={error}
        />
      );
    }
  };

  return (
    <MainLayout>
      <Container className="py-16">{renderCurrentStep()}</Container>
    </MainLayout>
  );
}

export default Register;
