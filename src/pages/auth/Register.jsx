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

  const handleRegistration = async registrationData => {
    setLoading(true);
    setError('');

    try {
      // Import Supabase client
      const { supabase } = await import('../../services/supabaseClient');

      // Step 1: Sign up with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: registrationData.email,
        password: registrationData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/email-confirmed`,
          data: {
            // Store user data in auth metadata temporarily
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

      if (authError) {
        throw new Error(authError.message);
      }

      if (!authData.user) {
        throw new Error('Registration failed. Please try again.');
      }

      // Step 2: Try to create user profile (this might fail due to RLS, but that's ok)
      try {
        const userProfileData = {
          id: authData.user.id,
          email: registrationData.email,
          ...registrationData.userData,
        };

        // Import and use the user service
        const { createUserProfile } = await import('../../services/userService');
        await createUserProfile(userProfileData);

        console.log('User profile created successfully');
      } catch (profileError) {
        console.warn(
          'User profile creation failed (will retry after email confirmation):',
          profileError
        );
        // This is ok - we'll create the profile after email confirmation
      }

      // Step 3: Redirect to verification page regardless of profile creation result
      navigate('/auth/verify-email', {
        state: {
          email: registrationData.email,
          message: 'Registration successful! Please check your email to verify your account.',
          userData: registrationData.userData, // Pass user data for later use
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
