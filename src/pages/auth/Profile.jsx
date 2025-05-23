// src/pages/auth/Profile.jsx
import { useState } from 'react';
import { MainLayout, Container } from '../../components/layout';
import { Alert, Spinner } from '../../components/common';
import ProfileView from '../../components/auth/ProfileView';
import ProfileEdit from '../../components/auth/ProfileEdit';
import { useAuth } from '../../contexts/AuthContext';
import { useUpdateUserProfile } from '../../hooks/useUsers';

function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const { user } = useAuth();
  const updateProfileMutation = useUpdateUserProfile();

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    updateProfileMutation.reset();
  };

  const handleSave = async updateData => {
    try {
      await updateProfileMutation.mutateAsync({
        userId: user.id,
        updates: updateData,
      });

      setIsEditing(false);

      // Show success message
      // Note: In a real app, you might want to use a toast notification system
      console.log('Profile updated successfully');
    } catch (error) {
      console.error('Failed to update profile:', error);
      // Error will be displayed by the ProfileEdit component
    }
  };

  if (!user) {
    return (
      <MainLayout>
        <Container className="py-16">
          <div className="flex justify-center">
            <Spinner size="lg" />
          </div>
        </Container>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Container className="py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
            <p className="text-gray-600 mt-2">Manage your account information and preferences</p>
          </div>

          {/* Success message */}
          {updateProfileMutation.isSuccess && !isEditing && (
            <Alert
              type="success"
              message="Profile updated successfully!"
              className="mb-6"
              onClose={() => updateProfileMutation.reset()}
            />
          )}

          {/* Profile content */}
          {isEditing ? (
            <ProfileEdit
              user={user}
              onSave={handleSave}
              onCancel={handleCancel}
              loading={updateProfileMutation.isLoading}
              error={updateProfileMutation.error?.message}
            />
          ) : (
            <ProfileView user={user} onEdit={handleEdit} />
          )}
        </div>
      </Container>
    </MainLayout>
  );
}

export default Profile;
